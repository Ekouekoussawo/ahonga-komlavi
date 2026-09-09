<?php
namespace VamtamElementor\Widgets\MenuCart;

// Extending the Menu Cart widget.

// Is WC Widget.
if ( ! vamtam_has_woocommerce() ) {
	return;
}

// Is Pro Widget.
if ( ! \VamtamElementorIntregration::is_elementor_pro_active() ) {
	return;
}

function render_content( $content, $widget ) {
	if ( 'woocommerce-menu-cart' === $widget->get_name() ) {
		$settings            = $widget->get_settings();
		$show_close_cart_btn = ! empty( $settings[ 'close_cart_button_show' ] );
		$close_cart_btn_icon = isset( $settings[ 'close_cart_icon_svg' ] ) ? $settings[ 'close_cart_icon_svg' ] : [];
		$close_btn_el        = '';
		$regex               = '/<div class="elementor-menu-cart__close-button(-custom)?">.*?<\/div>/s';
		$force_show          = ! \VamtamElementorBridge::elementor_pro_is_v3_12_or_greater(); // before pro v3.12.0 there was no way to hide or change the close icon.

		preg_match_all( $regex, $content, $matches );

		// Remove current close button (we add it in header below).
		$content = preg_replace( $regex, '', $content );

		if ( $show_close_cart_btn || $force_show ) {
			if ( empty( $close_cart_btn_icon[ 'value' ] ) || $force_show ) { // empty value == default icon (we replace with theme default)
				$close_cart_icon = '<svg class="font-h4 vamtam-close vamtam-close-cart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" version="1.1"><path d="M10 8.586l-7.071-7.071-1.414 1.414 7.071 7.071-7.071 7.071 1.414 1.414 7.071-7.071 7.071 7.071 1.414-1.414-7.071-7.071 7.071-7.071-1.414-1.414-7.071 7.071z"></path></svg>';

				if ( vamtam_theme_supports( 'woocommerce-menu-cart--close-cart-theme-icon' ) ) {
					$close_cart_icon = '<i class="vamtam-close vamtam-close-cart vamtamtheme- vamtam-theme-close"></i>';
				}

				$close_btn_el = '<div class="elementor-menu-cart__close-button">' . $close_cart_icon . '</div>';
			} else {
				$close_btn_el = ! empty( $matches[0] ) ? $matches[0][0] : '';
			}
		}

		// Inject cart header.
		$header  = '<div class="vamtam-elementor-menu-cart__header">
						<span class="font-h4 label">' . esc_html__( 'Cart', 'vamtam-elementor-integration' ) . '</span>
						<span class="item-count">(' . esc_html( WC()->cart->get_cart_contents_count() ) . ')</span>
						' . $close_btn_el . '
					</div>';
		$content = str_replace( '<div class="widget_shopping_cart_content', $header . '<div class="widget_shopping_cart_content', $content );
	}
	return $content;
}
// Called frontend & editor (editor after element loses focus).
add_filter( 'elementor/widget/render_content', __NAMESPACE__ . '\render_content', 10, 2 );

function update_controls_style_tab_products_section( $controls_manager, $widget ) {
	// Product Title Typography.
	\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'product_title_typography', [
		'selectors' => [
			'{{WRAPPER}} .vamtam-elementor-menu-cart__header > .item-count' => '{{_RESET_}}',
		],
		'separator' => 'before',
		],
		\Elementor\Group_Control_Typography::get_type()
	);

	// Product Variations Typography.
	\Vamtam_Elementor_Utils::replace_control_options( $controls_manager, $widget, 'product_variations_typography', [
		'selector' => [
			'selector' => '{{WRAPPER}} .elementor-menu-cart__product.cart_item .variation',
		],
		],
		\Elementor\Group_Control_Typography::get_type()
	);

	// Product Price Typography.
	\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'product_price_typography', [
		'selector' => [
			'selector' => '{{WRAPPER}} .elementor-menu-cart__product-price, {{WRAPPER}} .elementor-menu-cart__product.cart_item .quantity .amount',
		],
		],
		\Elementor\Group_Control_Typography::get_type()
	);

	$qnty_selectors = '{{WRAPPER}} .elementor-menu-cart__product-price.product-price .quantity .vamtam-quantity select,' .
		'{{WRAPPER}} .elementor-menu-cart__product-price.product-price .quantity .vamtam-quantity select option,' .
		'{{WRAPPER}} .elementor-menu-cart__product-price.product-price .quantity .vamtam-quantity > .vamtam-quantity-input,' .
		'{{WRAPPER}} .product-price .quantity .vamtam-quantity .vamtam-count-wrap > *';

	// Product Quantity Color.
	\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'product_quantity_color', [
		'selectors' => [
			$qnty_selectors => '{{_RESET_}}' ],
		]
	);

	// Product Quantity Typography.
	\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'product_quantity_typography', [
		'selectors' => [
			$qnty_selectors => '{{_RESET_}}'
		],
		],
		\Elementor\Group_Control_Typography::get_type()
	);

	// Products Divider Style.
	\Vamtam_Elementor_Utils::replace_control_options( $controls_manager, $widget, 'divider_style', [
		'selectors' => [
			'{{WRAPPER}}' => '--divider-style: {{VALUE}};',
		]
	] );

	// Products Divider Color.
	\Vamtam_Elementor_Utils::replace_control_options( $controls_manager, $widget, 'divider_color', [
		'selectors' => [
			'{{WRAPPER}}' => '--divider-color: {{VALUE}};',
		]
	] );

	// Products Divider Weight.
	\Vamtam_Elementor_Utils::replace_control_options( $controls_manager, $widget, 'divider_width', [
		'selectors' => [
			'{{WRAPPER}}' => '--divider-width: {{SIZE}}{{UNIT}};',
		]
	] );
}

function update_menu_icon_section_controls( $controls_manager, $widget ) {
	// Hide Emtpy.
	\Vamtam_Elementor_Utils::replace_control_options( $controls_manager, $widget, 'hide_empty_indicator', [
		'condition' => null,
	] );
}

function add_controls_content_tab_section( $controls_manager, $widget ) {
	$widget->add_control(
		'hide_on_wc_cart_checkout',
		[
			'label' => __( 'Hide on Cart/Checkout', 'vamtam-elementor-integration' ),
			'description' => __( 'Hides the menu-card widget on WC\'s Cart & Checkout pages.', 'vamtam-elementor-integration' ),
			'type' => $controls_manager::SWITCHER,
			'prefix_class' => 'vamtam-has-',
			'return_value' => 'hide-cart-checkout',
			'default' => 'hide-cart-checkout',
		]
	);
}

// Content - Menu Icon Section
function section_menu_icon_content_before_section_end( $widget, $args ) {
	$controls_manager = \Elementor\Plugin::instance()->controls_manager;
	add_controls_content_tab_section( $controls_manager, $widget );
	update_menu_icon_section_controls( $controls_manager, $widget );
}
add_action( 'elementor/element/woocommerce-menu-cart/section_menu_icon_content/before_section_end', __NAMESPACE__ . '\section_menu_icon_content_before_section_end', 10, 2 );

function update_cart_section_controls( $controls_manager, $widget ) {
	if ( \VamtamElementorBridge::elementor_pro_is_v3_12_or_greater() ) {
		// Close Icon.
		\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'close_cart_button_show', [
			'render_type' => 'template',
		] );

		// Custom Icon.
		\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'close_cart_icon_svg', [
			'render_type' => 'template',
		] );
	}
}
// Content - Cart Section
function section_cart_before_section_end( $widget, $args ) {
	$controls_manager = \Elementor\Plugin::instance()->controls_manager;
	update_cart_section_controls( $controls_manager, $widget );
}
add_action( 'elementor/element/woocommerce-menu-cart/section_cart/before_section_end', __NAMESPACE__ . '\section_cart_before_section_end', 10, 2 );


// Style - Products Section
function section_product_tabs_style_before_section_end( $widget, $args ) {
	$controls_manager = \Elementor\Plugin::instance()->controls_manager;
	update_controls_style_tab_products_section( $controls_manager, $widget );
}
add_action( 'elementor/element/woocommerce-menu-cart/section_product_tabs_style/before_section_end', __NAMESPACE__ . '\section_product_tabs_style_before_section_end', 10, 2 );

function add_padding_control_for_footer_buttons( $controls_manager, $widget ) {
	// Btns Border Radius.
	$widget->start_injection( [
		'of' => 'button_border_radius',
	] );
	$selectors = [
		'{{WRAPPER}} .elementor-menu-cart__container .elementor-menu-cart__main .elementor-menu-cart__footer-buttons' => 'padding: {{TOP}}{{UNIT}} 7% {{BOTTOM}}{{UNIT}} 7%;',
	];
	if ( vamtam_theme_supports( 'woocommerce-menu-cart--fixed-mobile-cart-padding' ) ) {
		$selectors = [
			'{{WRAPPER}} .elementor-menu-cart__container .elementor-menu-cart__main .elementor-menu-cart__footer-buttons'         => 'padding: {{TOP}}{{UNIT}} 7% {{BOTTOM}}{{UNIT}} 7%;',
			'(tablet) {{WRAPPER}} .elementor-menu-cart__container .elementor-menu-cart__main .elementor-menu-cart__footer-buttons' => 'padding: {{TOP}}{{UNIT}} 30px {{BOTTOM}}{{UNIT}} 30px;',
			'(mobile) {{WRAPPER}} .elementor-menu-cart__container .elementor-menu-cart__main .elementor-menu-cart__footer-buttons' => 'padding: {{TOP}}{{UNIT}} 20px {{BOTTOM}}{{UNIT}} 20px;',
		];
	}
	$widget->add_responsive_control(
		'footer_buttons_padding',
		[
			'label' => __( 'Padding', 'vamtam-elementor-integration' ),
			'type' => $controls_manager::DIMENSIONS,
			'size_units' => [ 'px', '%' ],
			'allowed_dimensions' => 'vertical',
			'default' => [
				'top' => 20,
				'bottom' => 20,
				'unit' => 'px',
				'isLinked' => true,
			],
			'selectors' => $selectors,
		]
	);
	$widget->end_injection();
}

function update_buttons_controls( $controls_manager, $widget ) {
	// View Cart Border.
	\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'view_cart_border', [
		'selector' => '{{WRAPPER}} a.elementor-button.elementor-button--view-cart',
		],
		\Elementor\Group_Control_Border::get_type()
	);
	// Checkout Border.
	\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'checkout_border', [
		'selector' => '{{WRAPPER}} a.elementor-button.elementor-button--checkout',
		],
		\Elementor\Group_Control_Border::get_type()
	);
	// View Cart Padding.
	\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'view_cart_button_padding', [
		'selectors' => [
			'{{WRAPPER}} .elementor-menu-cart__footer-buttons .elementor-button--view-cart' => 'padding: var(--view-cart-button-padding);',
		]
	] );
	// Checkout Padding.
	\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'view_checkout_button_padding', [
		'selectors' => [
			'{{WRAPPER}} .elementor-menu-cart__footer-buttons .elementor-button--checkout' => 'padding: var(--checkout-button-padding);',
		]
	] );
}

function add_bijoux_btn_type_controls( $controls_manager, $widget ) {
	$widget->start_injection( [
		'of' => 'buttons_layout',
	] );
	// Btn Type.
	$widget->add_control(
		'button_type',
		[
			'label' => __( 'Type', 'vamtam-elementor-widgets' ),
			'type' => $controls_manager::SELECT,
			'default' => '',
			'options' => [
				'' => __( 'Default', 'vamtam-elementor-widgets' ),
				'bijoux-alt' => __( 'Bijoux Alt', 'vamtam-elementor-widgets' ),
			],
			'prefix_class' => 'vamtam-has-',
		]
	);
	$widget->end_injection();
	$widget->start_injection( [
		'of' => 'heading_view_cart_button_style',
	] );
	// View Cart Line Padding
	$widget->add_responsive_control(
		'vamtam_view_cart_prefix_padding',
		[
			'label' => __( 'Line Padding', 'vamtam-elementor-integration' ),
			'type' => $controls_manager::DIMENSIONS,
			'size_units' => [ 'px', 'em', '%' ],
			'selectors' => [
				'{{WRAPPER}} .elementor-button.elementor-button--view-cart span.vamtam-prefix' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
			],
			'allowed_dimensions' => 'horizontal',
			'condition' => [
				'button_type' => 'bijoux-alt',
			]
		]
	);
	$widget->end_injection();
	$widget->start_injection( [
		'of' => 'view_cart_button_text_color',
		'at' => 'before',
	] );
	// View Cart Line Color.
	$widget->add_control(
		'view_cart_prefix_color',
		[
			'label' => __( 'Line Color', 'vamtam-elementor-integration' ),
			'type' => $controls_manager::COLOR,
			'default' => '',
			'selectors' => [
				'{{WRAPPER}} .elementor-button.elementor-button--view-cart span.vamtam-prefix::before' => 'background-color: {{VALUE}};',
			],
			'condition' => [
				'button_type' => 'bijoux-alt',
			]
		]
	);
	$widget->end_injection();
	$widget->start_injection( [
		'of' => 'view_cart_button_hover_text_color',
		'at' => 'before',
	] );
	// View Cart Line Color Hover.
	$widget->add_control(
		'view_cart_prefix_color_hover',
		[
			'label' => __( 'Line Color', 'vamtam-elementor-integration' ),
			'type' => $controls_manager::COLOR,
			'default' => '',
			'selectors' => [
				'{{WRAPPER}} .elementor-button.elementor-button--view-cart:hover span.vamtam-prefix::before' => 'background-color: {{VALUE}};',
			],
			'condition' => [
				'button_type' => 'bijoux-alt',
			]
		]
	);
	$widget->end_injection();
	$widget->start_injection( [
		'of' => 'heading_checkout_button_style',
	] );
	// View Cart Line Padding
	$widget->add_responsive_control(
		'vamtam_checkout_prefix_padding',
		[
			'label' => __( 'Line Padding', 'vamtam-elementor-integration' ),
			'type' => $controls_manager::DIMENSIONS,
			'size_units' => [ 'px', 'em', '%' ],
			'selectors' => [
				'{{WRAPPER}} .elementor-button.elementor-button--checkout span.vamtam-prefix' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
			],
			'allowed_dimensions' => 'horizontal',
			'condition' => [
				'button_type' => 'bijoux-alt',
			]
		]
	);
	$widget->end_injection();
	$widget->start_injection( [
		'of' => 'checkout_button_text_color',
		'at' => 'before',
		] );
	// Checkout Line Color.
	$widget->add_control(
		'checkout_prefix_color',
		[
			'label' => __( 'Line Color', 'vamtam-elementor-integration' ),
			'type' => $controls_manager::COLOR,
			'default' => '',
			'selectors' => [
				'{{WRAPPER}} .elementor-button.elementor-button--checkout span.vamtam-prefix::before' => 'background-color: {{VALUE}};',
			],
			'condition' => [
				'button_type' => 'bijoux-alt',
			]
		]
	);
	$widget->end_injection();
	$widget->start_injection( [
		'of' => 'checkout_button_hover_text_color',
		'at' => 'before',
	] );
	// Checkout Line Color Hover.
	$widget->add_control(
		'checkout_prefix_color_hover',
		[
			'label' => __( 'Line Color', 'vamtam-elementor-integration' ),
			'type' => $controls_manager::COLOR,
			'default' => '',
			'selectors' => [
				'{{WRAPPER}} .elementor-button.elementor-button--checkout:hover span.vamtam-prefix::before' => 'background-color: {{VALUE}};',
			],
			'condition' => [
				'button_type' => 'bijoux-alt',
			]
		]
	);
	$widget->end_injection();
}

if ( vamtam_theme_supports( [ 'woocommerce-menu-cart--fitness-btn-style', 'woocommerce-menu-cart--fitness-vc-btn-style' ] ) ) {
	function add_use_theme_btn_style_controls( $controls_manager, $widget ) {
		if ( vamtam_theme_supports( 'woocommerce-menu-cart--fitness-btn-style' ) ) {
			// View Cart.
			$widget->start_injection( [
				'of' => 'heading_view_cart_button_style',
			] );
			// Use view cart btn theme style.
			$widget->add_control(
				'use_theme_vc_btn_style',
				[
					'label' => __( 'Use Theme Style', 'vamtam-elementor-integration' ),
					'type' => $controls_manager::SWITCHER,
					'prefix_class' => 'vamtam-has-',
					'return_value' => 'theme-vc-btn-style',
					'default' => 'theme-vc-btn-style',
				]
			);
			$widget->end_injection();
		}
		if ( vamtam_theme_supports( 'woocommerce-menu-cart--fitness-vc-btn-style' ) ) {
			// Checkout.
			$widget->start_injection( [
				'of' => 'heading_checkout_button_style',
			] );
			// Use checkout btn theme style.
			$widget->add_control(
				'use_theme_checkout_btn_style',
				[
					'label' => __( 'Use Theme Style', 'vamtam-elementor-integration' ),
					'type' => $controls_manager::SWITCHER,
					'prefix_class' => 'vamtam-has-',
					'return_value' => 'theme-checkout-btn-style',
					'default' => 'theme-checkout-btn-style',
				]
			);
			$widget->end_injection();
		}
	}
}

// Style - Buttons section
function section_style_buttons_before_section_end( $widget, $args ) {
	$controls_manager = \Elementor\Plugin::instance()->controls_manager;
	update_buttons_controls( $controls_manager, $widget );
	add_padding_control_for_footer_buttons( $controls_manager, $widget );
	if ( vamtam_theme_supports( 'woocommerce-menu-cart--bijoux-button-type' ) ) {
		add_bijoux_btn_type_controls( $controls_manager, $widget );
	}
	if ( vamtam_theme_supports( [ 'woocommerce-menu-cart--fitness-btn-style', 'woocommerce-menu-cart--fitness-vc-btn-style' ] ) ) {
		add_use_theme_btn_style_controls( $controls_manager, $widget );
	}
}
add_action( 'elementor/element/woocommerce-menu-cart/section_style_buttons/before_section_end', __NAMESPACE__ . '\section_style_buttons_before_section_end', 10, 2 );

function update_controls_style_tab_cart_section( $controls_manager, $widget ) {
	// Subtotal Typography.
	\Vamtam_Elementor_Utils::replace_control_options( $controls_manager, $widget, 'subtotal_typography', [
		'selector' => '{{WRAPPER}}.elementor-widget-woocommerce-menu-cart .elementor-menu-cart__container .elementor-menu-cart__main .elementor-menu-cart__subtotal',
		],
		\Elementor\Group_Control_Typography::get_type()
	);
	// Subtotal Typography Font Weight.
	\Vamtam_Elementor_Utils::replace_control_options( $controls_manager, $widget, 'subtotal_typography_font_weight', [
		'selectors' => [
			'{{WRAPPER}} .elementor-menu-cart__subtotal strong' => '{{_RESET_}}',
		]
	] );
	// Subtotal Alignment.
	\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'subtotal_alignment', [
		'prefix_class' => 'vamtam-subtotal-align-',
	] );
	// Remove Icon Size (for SVG).
	\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'remove_item_button_size', [
		'selectors' => [
			'{{WRAPPER}} .vamtam-remove-product svg' => 'font-size: var(--remove-item-button-size);width: 1em;height: 1em;',
		]
	] );
	// Remove Icon Color (for SVG).
	\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'remove_item_button_color', [
		'selectors' => [
			'{{WRAPPER}} .vamtam-remove-product svg' => 'color: var(--remove-item-button-color);fill: currentColor;stroke: currentColor;',
			'{{WRAPPER}} .vamtam-remove-product svg :is(g, path)' => 'color: inherit;fill: inherit;stroke: inherit;',
		]
	] );
	// Remove Icon Hover Color (for SVG).
	\Vamtam_Elementor_Utils::add_control_options( $controls_manager, $widget, 'remove_item_button_hover_color', [
		'selectors' => [
			'{{WRAPPER}} .vamtam-remove-product svg:hover' => 'color: var(--remove-item-button-hover-color);fill: currentColor;stroke: currentColor;',
			'{{WRAPPER}} .vamtam-remove-product svg:hover :is(g, path)' => 'color: inherit;fill: inherit;stroke: inherit;',
		]
	] );
}
// Style - Cart section
function section_cart_style_before_section_end( $widget, $args ) {
	$controls_manager = \Elementor\Plugin::instance()->controls_manager;
	update_controls_style_tab_cart_section( $controls_manager, $widget );
}
add_action( 'elementor/element/woocommerce-menu-cart/section_cart_style/before_section_end', __NAMESPACE__ . '\section_cart_style_before_section_end', 10, 2 );

// Elementor menu cart widget, quantity override.
add_filter( 'woocommerce_widget_cart_item_quantity', 'vamtam_woocommerce_cart_item_quantity', 10, 3 );

if ( vamtam_theme_supports( 'woocommerce-menu-cart--bijoux-button-type' ) ) {
	// Vamtam_Widget_WC_Menu_Cart.
	function widgets_registered() {
		if ( ! \VamtamElementorIntregration::is_elementor_pro_active() ) {
			return;
		}

		class Vamtam_Widget_WC_Menu_Cart extends \ElementorPro\Modules\Woocommerce\Widgets\Menu_Cart {
			public $extra_depended_scripts = [
				'vamtam-woocommerce-menu-cart',
			];

			// Extend constructor.
			public function __construct($data = [], $args = null) {
				parent::__construct($data, $args);

				$this->register_assets();

				$this->add_extra_script_depends();
			}

			// Register the assets the widget depends on.
			public function register_assets() {
				$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

				wp_register_script(
					'vamtam-woocommerce-menu-cart',
					VAMTAM_ELEMENTOR_INT_URL . 'assets/js/widgets/woocommerce-menu-cart/vamtam-woocommerce-menu-cart' . $suffix . '.js',
					[
						'elementor-frontend',
					],
					\VamtamElementorIntregration::PLUGIN_VERSION,
					true
				);
			}

			// Assets the widget depends upon.
			public function add_extra_script_depends() {
				// Scripts
				foreach ( $this->extra_depended_scripts as $script ) {
					$this->add_script_depends( $script );
				}
			}
		}

		// Replace current divider widget with our extended version.
		$widgets_manager = \Elementor\Plugin::instance()->widgets_manager;
		$widgets_manager->unregister( 'woocommerce-menu-cart' );
		$widgets_manager->register( new Vamtam_Widget_WC_Menu_Cart );
	}
	add_action( \Vamtam_Elementor_Utils::get_widgets_registration_hook(), __NAMESPACE__ . '\widgets_registered', 100 );

	// That's needed for the editor (but also gets called on frontend).
	//TODO: Prob better to find a JS editor event (if available) for this, so there's no need to override Elementor's template.
	function vamtam_woocommerce_locate_template( $template, $template_name, $template_path ) {
		if ( 'cart/mini-cart.php' !== $template_name ) {
			return $template;
		}

		$use_mini_cart_template = 'yes' === get_option( 'elementor_use_mini_cart_template', 'no' );

		if ( ! $use_mini_cart_template ) {
			return $template;
		}

		$plugin_path = plugin_dir_path( __DIR__ ) . 'woocommerce/wc-templates/';

		if ( file_exists( $plugin_path . $template_name ) ) {
			$template = $plugin_path . $template_name;
		}

		return $template;
	}
	add_filter( 'woocommerce_locate_template', __NAMESPACE__ . '\vamtam_woocommerce_locate_template', 100, 3 );
}

// Before render (all widgets).
function menu_cart_before_render( $widget ) {
    $widget_name = $widget->get_name();

    if ( $widget->get_name() === 'global' ) {
        $widget_name = $widget->get_original_element_instance()->get_name();
    }

    if ( 'woocommerce-menu-cart' === $widget_name ) {
		$hide_empty = ! empty( $widget->get_settings( 'hide_empty_indicator' ) );
        if ( $hide_empty && WC()->cart->get_cart_contents_count() === 0 ) {
			// Add hidden class to wrapper element.
			$widget->add_render_attribute( '_wrapper',  'class', 'hidden' );
		}
    }
}
add_action( 'elementor/frontend/widget/before_render', __NAMESPACE__ . '\menu_cart_before_render', 10, 1 );

/* WC Filters */

// Cart quantity override.
function vamtam_woocommerce_widget_cart_item_quantity( $content, $cart_item_key, $cart_item ) {
	if ( \VamtamElementorBridge::is_elementor_active() ) {
		// Elementor's filter has different args order.
		if ( ! isset( $cart_item['data'] ) && isset( $cart_item_key['data'] ) ) {
			$temp          = $cart_item_key;
			$cart_item_key = $cart_item;
			$cart_item     = $temp;
		}
	}
	$_product  = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
	$only_one_allowed  = $_product->is_sold_individually();

	$max_product_quantity = $_product->get_stock_quantity();
	if ( ! isset( $max_product_quantity ) ) {
		if ( $_product->get_max_purchase_quantity() === -1 ) {
			// For product that don't adhere to stock_quantity, provide a default max-quantity.
			// This will be used for the number of options inside the quantity <select>.
			$max_product_quantity = apply_filters( 'vamtam_cart_item_max_quantity', 10 );
		} else {
			$max_product_quantity = $_product->get_max_purchase_quantity();
		}
	}

    // Create number input for quantity
    $input = '<div class="vamtam-quantity"' . ( $only_one_allowed ? ' disabled ' : '' ) . '>';
    $input .= '<input type="number" ' .
              ( $only_one_allowed ? 'disabled ' : '' ) .
              'name="cart[' . esc_attr( $cart_item_key ) . '][qty]" ' .
              'value="' . esc_attr( $cart_item['quantity'] ) . '" ' .
              'title="' . esc_attr__( 'Qty', 'wpv' ) . '" ' .
              'min="0" ' .
              'max="' . esc_attr( $max_product_quantity ) . '" ' .
              'step="1" ' .
              'data-product_id="' . esc_attr( $cart_item['product_id'] ) . '" ' .
              'data-cart_item_key="' . esc_attr( $cart_item_key ) . '" ' .
              'class="vamtam-quantity-input" ' .
              '/>';
    $input .= '</div>';

	if ( vamtam_extra_features() ) {
		$patterns = [
			'/<span class="quantity"><span class="product-quantity">(\d+)/',
			'/<span class="quantity">(\d+)/'
		];

		$replacements = [
			'<span class="quantity">' . $input,
			'<span class="quantity">' . $input
		];

		$content = preg_replace($patterns, $replacements, $content, 1, $count);

		if ($count > 0) {
			$content = str_replace([' &times;</span>', ' &times; '], '', $content);
		}
	} else {
        $content = preg_replace( '#</div>#', $content, $input, 1 ) . '</div>';
	}

	return $content;
}

// Elementor menu cart widget, quantity override.
add_filter( 'woocommerce_widget_cart_item_quantity', __NAMESPACE__ . '\vamtam_woocommerce_widget_cart_item_quantity', 10, 3 );
