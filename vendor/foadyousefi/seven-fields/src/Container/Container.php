<?php

namespace SevenFields\Container;

use SevenFields\Fields\Fields;
use SevenFields\Bootstrap\Bootstrap;

class Container {

  /**
	 * @param object $page_title
	 */
  public $page_title;

	/**
	 * @param object $menu_slug
	 */
  public $menu_slug;

	/**
	 * @param object $parent_slug
	 */
  public $parent_slug = null;

	/**
	 * @param object $options_group
	 */
  public $options_group;

	/**
	 * @param object $options_name
	 */
  public $options_name;

	/**
	 * @param object $fields_callback
	 */
  public $fields_callback;

	/**
	 * @param object $plain_page
	 */
  public $plain_page = false;

	/**
	 * @param object $icon
	 */
  public $icon;

	/**
	 * @param object $position
	 */
  public $position = 99;

  public static function make($page_title, $menu_slug = null) {
    return new Container($page_title, $menu_slug);
  }
  
  /**
   * Initiate and create the page.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function __construct($page_title, $menu_slug = null) {
    // Initiate bootstrap
    new Bootstrap;
    $this->page_title = $page_title;
    $this->menu_slug = isset( $menu_slug ) ? $menu_slug : str_replace(' ','-', strtolower( $page_title ) );
    $this->options_group = str_replace('-','_', $this->menu_slug ) . '_options';
    $this->options_name = str_replace('-','_', $this->menu_slug );    
  }
  
  /**
   * Add options menu or sub-menu page.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function add_page() {
    
    if ( $this->parent_slug ) {
      add_submenu_page(
        $this->parent_slug,
        esc_html__( $this->page_title, 'seven-fields' ),
        esc_html__( $this->page_title, 'seven-fields' ),
        'manage_options',
        $this->menu_slug,
        array( $this, 'page' )
      );
    } else {
      add_menu_page(
        esc_html__( $this->page_title, 'seven-fields' ),
        esc_html__( $this->page_title, 'seven-fields' ),
        'manage_options',
        $this->menu_slug,
        array( $this, 'page' ),
        $this->icon,
        $this->position
      );
    }
    return $this;
  }
  
  /**
   * Add options menu or sub-menu page.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function set_parent( $parent ) {
    $this->parent_slug = $parent;
    return $this;
  }
  
  /**
   * Set page icon.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function set_icon( $icon ) {
    $this->icon = $icon;
    return $this;
  }

  /**
   * Disable form actions and output the page as plain html page.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function plain_page() {
    $this->plain_page = true;
    return $this;
  }
  
  /**
   * Set page menu position.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function set_menu_position( $position ) {
    $this->position = $position;
    return $this;
  }

  public function add_fields( $callback ) {
    if ( isset( $this->parent_slug ) ) {
      $this->options_group = str_replace('-','_', strtolower( $this->parent_slug ) ) . '_options';
      $this->options_name = str_replace('-','_', strtolower( $this->parent_slug ) );
    }
    $this->fields_callback = $callback;

    $this->add_page();
    return $this;
  }

  /**
   * Settings page output.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function page() {
    ?>
    <div class="wrap">
      <h1><?php esc_html_e( $this->page_title, 'seven-fields' ); ?></h1>
      <?php if ($this->plain_page) {
        call_user_func( $this->fields_callback );
      } else { ?>
        <form method="post">
          <div id="poststuff">
            <div id="post-body" class="metabox-holder columns-2 seven-form-wraper">

              <div id="post-body-content">
                <div class="postbox " style="display: block;">
                  <?php
                  wp_nonce_field( 'wprds_nonce_check' );
                  Fields::make( $this->options_group, $this->options_name );
                  call_user_func( $this->fields_callback );
                  ?>
                </div>
              </div>
          
              <div id="postbox-container-1" class="postbox-container">
                <div id="submitdiv" class="postbox">
                  <h3><?php esc_html_e('Actions', 'seven-fields'); ?></h3>
                  <div id="major-publishing-actions">

                    <div id="publishing-action">
                      <span class="spinner"></span>								
                      <?php submit_button(null, 'primary', null, false); ?>
                    </div>
                    <div class="clear"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    <?php
    }
  }
}
