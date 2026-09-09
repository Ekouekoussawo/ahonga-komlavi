<?php
/**
 * Ahonga child theme functions
 */

// Enqueue design system CSS
add_action('wp_enqueue_scripts', 'ahonga_enqueue_styles');
function ahonga_enqueue_styles() {
    // Load parent theme styles first
    wp_enqueue_style('caridad-style', get_template_directory_uri() . '/style.css');
    
    // Load our design system CSS - this overrides parent styles
    wp_enqueue_style(
        'ahonga-design',
        get_stylesheet_directory_uri() . '/design-system.css',
        array('caridad-style'),
        '1.0.0'
    );
    
    // Load joyful customizations
    wp_enqueue_style(
        'ahonga-joyful',
        get_stylesheet_directory_uri() . '/joyful.css',
        array('ahonga-design'),
        '1.0.0'
    );
}

// Override parent theme functions if needed
function ahonga_override_parent_styles() {
    // Dequeue parent theme's extra styles that might conflict
    wp_dequeue_style('vamtam-joyful');
    wp_dequeue_style('vamtam-joyful-design');
}

add_action('wp_enqueue_scripts', 'ahonga_override_parent_styles', 20);