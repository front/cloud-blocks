<?php

namespace GutenbergCloud\Blocks;

class Explore {
 
	/**
	 * @param object $page_title
	 */
  public static $page_title;

	/**
	 * @param object $menu_slug
	 */
  public static $menu_slug;

  /**
   * Initiate things.
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public static function init() {
    self::$page_title = ucwords( str_replace( '-', ' ', FGC_NAME ) );
    self::$menu_slug = FGC_NAME;
    // Add menu 
    add_action( 'admin_menu', array( __class__, 'add_menu') );
  }

  /**
   * Add options menu page.
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public static function add_menu() {
    add_menu_page( 
      esc_html__( self::$page_title, 'cloud-blocks' ),
      esc_html__( self::$page_title, 'cloud-blocks' ),
      'manage_options',
      self::$menu_slug,
      array( __class__, 'cloud_explorer' ),
      'dashicons-cloud',
      11
    );
  }
  
  /**
   * Settings page output.
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public static function cloud_explorer() {
    ?>
    <div class="wrap" id="blockExplorer">
      <h1><?php esc_html_e( self::$page_title, 'cloud-blocks' ); ?></h1>
      <admin-notice></admin-notice>
      <explorer-filter></explorer-filter>
      
		  <div class="theme-browser content-filterable rendered">
        <div class="themes wp-clearfix">
          <block-card v-for="block in blocks" :key="block.name" :block="block"/>
        </div>
      </div>

    </div>
  <?php
  }

}

