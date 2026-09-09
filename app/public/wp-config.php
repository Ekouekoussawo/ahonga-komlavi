<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('WP_CACHE', true);
define( 'WPCACHEHOME', 'C:\Users\Oel\sites\ahonga-komlavi\app\public\wp-content\plugins\wp-super-cache/' );
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', '127.0.0.1:10007' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '^}Jx)34FqDt}h,#jQ|fImG9^>7*buBnljmK{>RtUu14 N_5Zr v,_DWwvxTqFCan' );
define( 'SECURE_AUTH_KEY',   '`t]5{ uDDKEsQ1*k^xRbwyg&Lwv!^<%>tvZk<:o.GrJ.T3FA+]qIA~>@(gzf^&&W' );
define( 'LOGGED_IN_KEY',     'wv=OX_IW&E Tg`KI`|C<.YA0nZoXL{GavlK}?+K7)tGTn^vI+)#vpm7B:h(6o6LM' );
define( 'NONCE_KEY',         'b1e4sATcc`<x;SUf@Ol:O.qw,JigvT|RIMP333H6=EU@[71JujE1n%6U%$BwxfBt' );
define( 'AUTH_SALT',         ']?h.H$Eo0.xb gyF#_-j?]WEcWQpS)Vb1A2$Czr(7PyYMTzD*K0IFz4C|qG^~:K&' );
define( 'SECURE_AUTH_SALT',  'tFxfcDLa6Napx)Q@]dxFS90-EFGWlB0VzKLs-Vj|vmG&I7]RiLQbG|{2sn*jrz&]' );
define( 'LOGGED_IN_SALT',    '6]+myvU=wQ(!j<#r(.<%WaDW!KW8I}f<qT3Uztu(cU.rMpWJ&~(X7]^!@]7@l)%R' );
define( 'NONCE_SALT',        '|w<}|9u#`@%Tsy~MDVX5jc4sfz|wO1LI4a&pRLV/#=0-cn4A3KQN+h@D20#13u^q' );
define( 'WP_CACHE_KEY_SALT', '/n~3+h5dOYRK(k.<xJ0_FGWWxxDM>+~#I&d@)G@)1sp_VJmg7tI-K23D2KG==@p<' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
