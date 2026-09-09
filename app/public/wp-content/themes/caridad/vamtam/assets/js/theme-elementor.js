// Theme-Elementor related code for both frontend and editor.
( function( $, undefined ) {
	"use strict";

	window.VAMTAM = window.VAMTAM || {}; // Namespace

	$( function() {
		// Caridad-only.
		var vamtamGiveWPHandler = function() {
			function hideGiveWPNotices() {
				if ( ! $( 'body' ).hasClass( 'give-test-mode' ) ) {
					return;
				}

				const donateIframes = document.querySelectorAll( 'iframe[name="give-embed-form"]' ),
				ourDomains      = [ 'caridad.demo.localhost', 'caridad.demo.vamtam.com', 'caridad.vamtam.com' ],
				url             = window.location.href;

				let isOurDomain = false;
				if ( ourDomains.some( v => url.includes( v ) ) ) {
					isOurDomain = true;
				}

				if ( ! isOurDomain ) {
					return;
				}

				// On body of normal page.
				$( 'body' ).addClass( 'hide-give-notices' );

				if ( ! donateIframes.length ) {
					return;
				}

				// Adds a class to inidcate use on our domains. It's used to hide some notices on our Live demo and test env.
				donateIframes.forEach( iframe => {
					$( iframe ).one('load', () => {
                        // On body of multistep form (in <iframe>).
                        $( iframe.contentDocument.body ).addClass( 'hide-give-notices' );
					} );
				} );
			}

			// Hide give-wp notices on our live/demo domains.
			hideGiveWPNotices();

			// Checks for --vamtam-givewp-form-dark prop and if found, adds appropriate classes.
			function handleDarkFormSkinForPage() {
				const darkFormSkinClass = 'vamtam-givewp-form-dark',
					pageHasDarkFormSkin = getComputedStyle( document.documentElement ).getPropertyValue( `--${darkFormSkinClass}` );

				if ( ! pageHasDarkFormSkin ) {
					return;
				}

				// On body of normal page.
				$( 'body' ).addClass( darkFormSkinClass );

				// Multistep forms (iframes).
				const darkSkinDonateIframes = document.querySelectorAll( `.${darkFormSkinClass} iframe[name="give-embed-form"]` );

				if ( ! darkSkinDonateIframes.length ) {
					return;
				}

				// Adds the dark skin class to the multistep form so we can apply proper styling.
				darkSkinDonateIframes.forEach( iframe => {
					$( iframe ).one('load', () => {
                        // On body of multistep form (in <iframe>).
                        $( iframe.contentDocument.body ).addClass( darkFormSkinClass );
					} );
				} );
			}

			handleDarkFormSkinForPage();

			function handleMultistepFormAltStyle() {
				const altStyleClass = 'vamtam-givewp-form-alt',
					altStyleDonateIframes = document.querySelectorAll( `.${altStyleClass} iframe[name="give-embed-form"]` );

				if ( ! altStyleDonateIframes.length ) {
					return;
				}

				// Adds the alt style class to the multistep form so we can apply proper styling.
				altStyleDonateIframes.forEach( iframe => {
					$( iframe ).one('load', () => {
                        // On body of multistep form (in <iframe>).
                        $( iframe.contentDocument.body ).addClass( altStyleClass );
					} );
				} );
			}

			handleMultistepFormAltStyle();

			// Add listener.
			document.body.addEventListener( 'click', function( e ) {
				var isFormModalOpener  = ( e.target.classList.contains( 'js-give-embed-form-modal-opener' ) ? e.target : false ) || e.target.closest( '.js-give-embed-form-modal-opener' );
				if ( isFormModalOpener ) {
					setTimeout(() => {
						hideGiveWPNotices();
					}, 1000);
				}
			} );
		};

		var isFrontend = ! window.elementorFrontend.isEditMode();

		if ( isFrontend ) {
			$( document ).ready( function () {
				// Normal GiveWP forms.
				vamtamGiveWPHandler();
			} );
			$( window ).load( function () {
				// Multistep GiveWP forms (in <iframes>).
				vamtamGiveWPHandler();
			} );
		} else {
			$(window).on('elementor/frontend/init', function(){
				window.elementor.on('document:loaded', function(){
					// The timeout is for ensuring that when the function is run, the frontend DOM has
					// been created (when on editor). Can't seem to find a proper event for this from Elementor.
					setTimeout( function() {
						vamtamGiveWPHandler();
					}, 1000 );
				} );
			} );
		}
	});
})( jQuery );
