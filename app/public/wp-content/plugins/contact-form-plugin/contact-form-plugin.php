<?php
/**
 * Plugin Name: Contact Form Shortcode
 * Description: Provides a [contact_form] shortcode for the About Us page.
 */
function cf_shortcode_form() {
  ob_start();
  ?>
  <form class="vj-contact-form" action="" method="post">
    <input type="text" name="name" placeholder="Votre nom complet" required>
    <input type="email" name="email" placeholder="Votre adresse email" required>
    <input type="tel" name="phone" placeholder="Téléphone">
    <textarea name="message" rows="5" placeholder="Votre message ou demande de prière" required></textarea>
    <button type="submit">Envoyer le message</button>
  </form>
  <?php
  return ob_get_clean();
}
add_shortcode('contact_form', 'cf_shortcode_form');
