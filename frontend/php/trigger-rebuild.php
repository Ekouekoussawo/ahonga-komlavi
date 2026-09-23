<?php
/**
 * Must-Use Plugin: Trigger GitHub Actions rebuild on post publish/update.
 *
 * evangelisteahongankomlavi.com — automatic rebuild-on-publish pipeline.
 *
 * Whenever a post transitions to "publish" (or an existing published post is
 * saved), fire a `repository_dispatch` webhook to GitHub so the
 * `.github/workflows/deploy.yml` workflow builds the Next.js static export and
 * FTP-deploys it to the live site. Without this, a newly published post has no
 * static detail page until someone runs `npm run build` and re-uploads `out/`.
 *
 * Security
 * --------
 * The webhook POST carries a shared secret in the `X-GitHub-Dispatch-Secret`
 * header. GitHub adds it server-side; nothing unauthenticated can trigger a
 * rebuild. The secret lives in the GitHub repo's Actions secrets, not here.
 *
 * Debounce
 * --------
 * WordPress fires `save_post` + `transition_post_status` for every edit, so a
 * bulk edit would otherwise trigger N rebuilds. We coalesce: a transient key
 * per post records the last dispatch time, and we only re-dispatch if the
 * previous one was more than REBUILD_DEBOUNCE_SECONDS ago. In-flight older
 * GitHub runs are cancelled by the workflow's own `cancel-in-progress`, so this
 * is belt-and-braces, not the only protection.
 *
 * Placement
 * ---------
 * wp-content/mu-plugins/trigger-rebuild.php — must-use, always loaded.
 *
 * @package evangelisteahongankomlavi
 */

defined('SCRIPT_NAME', 'trigger-rebuild'); // phpcs:ignore

// Tunables — keep in sync with .github/workflows/deploy.yml.
const REPO_OWNER        = 'Ekouekoussawo';
const REPO_NAME         = 'evangelisteahongankomlavi';
const DISPATCH_TYPE     = 'wp-post-published';
const DEBOUNCE_SECONDS  = 120; // 2 minutes
const REQUEST_TIMEOUT   = 10;  // seconds

/**
 * Fire the GitHub repository_dispatch webhook.
 *
 * @param int $post_id The post that was published/updated.
 */
function evha_trigger_rebuild(int $post_id): void
{
    // Skip autosaves, revisions, and non-public post types.
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }

    $post = get_post($post_id);
    if (!$post || $post->post_status !== 'publish') {
        return;
    }

    $post_type = get_post_type($post_id);
    $supported = apply_filters('evha_rebuild_post_types', ['post', 'page']);
    if (!in_array($post_type, (array) $supported, true)) {
        return;
    }

    // Debounce: don't fire again for this post within DEBOUNCE_SECONDS.
    $key = '_evha_last_rebuild_dispatch';
    $last = get_post_meta($post_id, $key, true);
    $now  = time();
    if ($last && ($now - (int) $last) < DEBOUNCE_SECONDS) {
        return;
    }
    update_post_meta($post_id, $key, $now);

    $url = 'https://api.github.com/repos/' . esc_attr(REPO_OWNER) . '/'
         . esc_attr(REPO_NAME) . '/dispatches';

    $body = wp_json_encode([
        'event_type'         => DISPATCH_TYPE,
        'client_payload'     => [
            'post_id'      => $post_id,
            'post_type'    => $post_type,
            'post_title'   => get_the_title($post_id),
            'post_modified'=> get_post_modified_time('c', true, $post_id),
            'triggered_by' => 'wordpress_save_post',
        ],
    ]);

    $args = [
        'timeout' => REQUEST_TIMEOUT,
        'headers' => [
            'Accept'               => 'application/vnd.github+json',
            'Content-Type'         => 'application/json',
            // GitHub verifies this against the repo's DISPATCH_SECRET.
            'X-GitHub-Dispatch-Secret' => defined('GITHUB_DISPATCH_SECRET')
                ? constant('GITHUB_DISPATCH_SECRET')
                : (string) get_option('evha_github_dispatch_secret', ''),
        ],
        'body' => $body,
    ];

    /**
     * Filter the wp_remote_post args before the request is sent.
     *
     * @param array $args    The request args.
     * @param int   $post_id The post that triggered the dispatch.
     */
    $args = apply_filters('evha_rebuild_request_args', $args, $post_id);

    $response = wp_remote_post($url, $args);

    if (is_wp_error($response)) {
        error_log('evha trigger-rebuild: dispatch failed for post '
            . $post_id . ' — ' . $response->get_error_message());
        return;
    }

    $code = (int) wp_remote_retrieve_response_code($response);
    if ($code >= 200 && $code < 300) {
        error_log('evha trigger-rebuild: dispatch OK for post ' . $post_id
            . ' (HTTP ' . $code . ')');
    } else {
        error_log('evha trigger-rebuild: dispatch rejected for post '
            . $post_id . ' (HTTP ' . $code . ' '
            . wp_remote_retrieve_response_body($response) . ')');
    }
}

// Fire on publish and on save of an already-published post.
add_action('publish_post', 'evha_trigger_rebuild');
add_action('publish_page', 'evha_trigger_rebuild');

// Also catch edits to live posts (status transitions handled by save_post).
add_action('save_post', function (int $post_id): void {
    $post = get_post($post_id);
    if ($post && $post->post_status === 'publish') {
        evha_trigger_rebuild($post_id);
    }
});