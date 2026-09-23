<?php
/**
 * Contact Form API Endpoint for WordPress
 * Place in WordPress: wp-content/mu-plugins/ahonga-contact-api.php
 * Or add to functions.php
 */

// Register REST API endpoints
add_action('rest_api_init', function () {
    // Contact form submission
    register_rest_route('contact-form/v1', '/submit', [
        'methods' => 'POST',
        'callback' => 'ahonga_handle_contact_form',
        'permission_callback' => '__return_true',
    ]);

    // Newsletter subscription
    register_rest_route('newsletter/v1', '/subscribe', [
        'methods' => 'POST',
        'callback' => 'ahonga_handle_newsletter',
        'permission_callback' => '__return_true',
    ]);

    // Prayer request submission
    register_rest_route('prayer/v1', '/submit', [
        'methods' => 'POST',
        'callback' => 'ahonga_handle_prayer_request',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * Sanitize and validate input
 */
function ahonga_sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

function ahonga_validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function ahonga_validate_required($fields, $data) {
    $errors = [];
    foreach ($fields as $field) {
        if (empty($data[$field])) {
            $errors[$field] = ucfirst($field) . ' is required';
        }
    }
    return $errors;
}

/**
 * Send email using WordPress wp_mail
 */
function ahonga_send_email($to, $subject, $message, $headers = '') {
    $default_headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Évangéliste Ahonga Komlavi <noreply@evangelisteahongakomlavi.com>',
    ];
    
    if ($headers) {
        $default_headers = array_merge($default_headers, $headers);
    }
    
    return wp_mail($to, $subject, $message, $default_headers);
}

/**
 * Handle contact form submission
 */
function ahonga_handle_contact_form($request) {
    $params = $request->get_json_params();
    
    // Validate required fields
    $errors = ahonga_validate_required(['name', 'email', 'subject', 'message'], $params);
    
    // Validate email format
    if (!empty($params['email']) && !ahonga_validate_email($params['email'])) {
        $errors['email'] = 'Invalid email format';
    }
    
    if (!empty($errors)) {
        return new WP_Error('validation_error', 'Validation failed', [
            'status' => 400,
            'errors' => $errors,
        ]);
    }
    
    // Sanitize inputs
    $name = ahonga_sanitize_input($params['name']);
    $email = ahonga_sanitize_input($params['email']);
    $subject = ahonga_sanitize_input($params['subject']);
    $phone = !empty($params['phone']) ? ahonga_sanitize_input($params['phone']) : '';
    $message = ahonga_sanitize_input($params['message']);
    
    // Prepare email content
    $admin_email = get_option('admin_email');
    $email_subject = "[Contact] $subject";
    
    $email_message = "
    <h2>Nouveau message de contact</h2>
    <p><strong>Nom:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    " . ($phone ? "<p><strong>Téléphone:</strong> $phone</p>" : "") . "
    <p><strong>Sujet:</strong> $subject</p>
    <p><strong>Message:</strong></p>
    <p>" . nl2br($message) . "</p>
    <hr>
    <p><small>Envoyé depuis le site evangelisteahongankomlavi.com</small></p>
    ";
    
    // Send to admin
    $sent = ahonga_send_email($admin_email, $email_subject, $email_message);
    
    // Auto-reply to user
    $auto_reply_subject = "Confirmation de réception - Évangéliste Ahonga Komlavi";
    $auto_reply_message = "
    <h2>Merci pour votre message, $name</h2>
    <p>Nous avons bien reçu votre message concernant <strong>$subject</strong>.</p>
    <p>Notre équipe vous répondra dans les plus brefs délais.</p>
    <hr>
    <p><small>Évangéliste Ahonga Komlavi - Ministère Évangélique</small></p>
    ";
    ahonga_send_email($email, $auto_reply_subject, $auto_reply_message);
    
    if ($sent) {
        return [
            'success' => true,
            'message' => 'Message envoyé avec succès',
        ];
    } else {
        return new WP_Error('email_failed', 'Failed to send email', ['status' => 500]);
    }
}

/**
 * Handle newsletter subscription
 */
function ahonga_handle_newsletter($request) {
    $params = $request->get_json_params();
    
    if (empty($params['email']) || !ahonga_validate_email($params['email'])) {
        return new WP_Error('invalid_email', 'Valid email required', ['status' => 400]);
    }
    
    $email = ahonga_sanitize_input($params['email']);
    
    // Store in WordPress (custom table or user meta)
    global $wpdb;
    $table = $wpdb->prefix . 'ahonga_newsletter';
    
    // Create table if not exists
    $wpdb->query("CREATE TABLE IF NOT EXISTS $table (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        subscribed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active',
        PRIMARY KEY (id),
        UNIQUE KEY email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    
    // Insert or update
    $result = $wpdb->replace($table, [
        'email' => $email,
        'subscribed_at' => current_time('mysql'),
        'status' => 'active',
    ]);
    
    if ($result === false) {
        return new WP_Error('db_error', 'Database error', ['status' => 500]);
    }
    
    // Send welcome email
    $subject = "Bienvenue dans la newsletter - Évangéliste Ahonga Komlavi";
    $message = "
    <h2>Bienvenue !</h2>
    <p>Merci de vous être abonné à notre newsletter.</p>
    <p>Vous recevrez désormais nos actualités, événements et inspirations par email.</p>
    <hr>
    <p><small>Évangéliste Ahonga Komlavi - Ministère Évangélique</small></p>
    ";
    ahonga_send_email($email, $subject, $message);
    
    return [
        'success' => true,
        'message' => 'Inscription réussie',
    ];
}

/**
 * Handle prayer request submission
 */
function ahonga_handle_prayer_request($request) {
    $params = $request->get_json_params();
    
    $errors = ahonga_validate_required(['name', 'email', 'subject', 'message'], $params);
    
    if (!empty($params['email']) && !ahonga_validate_email($params['email'])) {
        $errors['email'] = 'Invalid email format';
    }
    
    if (!empty($errors)) {
        return new WP_Error('validation_error', 'Validation failed', [
            'status' => 400,
            'errors' => $errors,
        ]);
    }
    
    $name = ahonga_sanitize_input($params['name']);
    $email = ahonga_sanitize_input($params['email']);
    $subject = ahonga_sanitize_input($params['subject']);
    $phone = !empty($params['phone']) ? ahonga_sanitize_input($params['phone']) : '';
    $message = ahonga_sanitize_input($params['message']);
    
    // Store in database
    global $wpdb;
    $table = $wpdb->prefix . 'ahonga_prayer_requests';
    
    $wpdb->query("CREATE TABLE IF NOT EXISTS $table (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    
    $wpdb->insert($table, [
        'name' => $name,
        'email' => $email,
        'subject' => $subject,
        'phone' => $phone,
        'message' => $message,
        'status' => 'pending',
    ]);
    
    // Send to admin
    $admin_email = get_option('admin_email');
    $email_subject = "[Demande de prière] $subject";
    $email_message = "
    <h2>Nouvelle demande de prière</h2>
    <p><strong>Nom:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    " . ($phone ? "<p><strong>Téléphone:</strong> $phone</p>" : "") . "
    <p><strong>Sujet:</strong> $subject</p>
    <p><strong>Message:</strong></p>
    <p>" . nl2br($message) . "</p>
    ";
    ahonga_send_email($admin_email, $email_subject, $email_message);
    
    // Auto-reply
    $auto_reply_subject = "Nous prions pour vous - Évangéliste Ahonga Komlavi";
    $auto_reply_message = "
    <h2>Merci pour votre confiance, $name</h2>
    <p>Votre demande de prière concernant <strong>$subject</strong> a bien été reçue.</p>
    <p>Notre équipe d'intercession portera votre besoin devant le Seigneur.</p>
    <p><em>\"Tout ce que vous demanderez avec foi par la prière, vous le recevrez.\" - Matthieu 21:22</em></p>
    <hr>
    <p><small>Évangéliste Ahonga Komlavi - Ministère Évangélique</small></p>
    ";
    ahonga_send_email($email, $auto_reply_subject, $auto_reply_message);
    
    return [
        'success' => true,
        'message' => 'Demande de prière enregistrée',
    ];
}

// Allow CORS for local development
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
});