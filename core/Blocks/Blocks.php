<?php

namespace GutenbergCloud;

use GutenbergCloud\Settings;

class Blocks {

  public function __construct() {
    // add_action( 'admin_enqueue_scripts', array( $this, 'theme_register_scripts' ) );
    // add_action( 'admin_enqueue_scripts', array( $this, 'theme_register_styles' ) );
    // add_action( 'wp_enqueue_scripts', array( $this, 'theme_register_styles' ) );
    add_action( 'admin_enqueue_scripts', array( $this, 'blocks_register_scripts' ) );
    add_action( 'admin_enqueue_scripts', array( $this, 'blocks_register_styles' ) );
    add_action( 'wp_enqueue_scripts', array( $this, 'blocks_register_styles' ) );
    add_action( 'wp_ajax_fgc_install_block', array( $this, 'install' ) );
    add_action( 'wp_ajax_nopriv_fgc_install_block', array( $this, 'install' ) );

    add_action( 'wp_ajax_fgc_get_all_blocks', array( $this, 'get_all' ) );
    add_action( 'wp_ajax_nopriv_fgc_get_all_blocks', array( $this, 'get_all' ) );

    add_action( 'wp_ajax_fgc_delete_block', array( $this, 'delete' ) );
    add_action( 'wp_ajax_nopriv_fgc_delete_block', array( $this, 'delete' ) );

    add_action( 'wp_ajax_fgc_update_block', array( $this, 'update' ) );
    add_action( 'wp_ajax_nopriv_fgc_update_block', array( $this, 'update' ) );

    add_action( 'init', array( $this, 'custom_blocks' ) );
  }


  /**
   * Get all installed blocks.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function get_all() {
    $installed_blocks = Settings::get_all();
    wp_send_json_success( $installed_blocks );
  }

  /**
   * Install the block.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function install() {
    $block = $_REQUEST['data'];
    if ( isset( $block ) ) {
      $new_block = array(
        'block_name'      => isset( $block['name'] ) ? $block['name'] : '',
        'package_name'    => isset( $block['packageName'] ) ? $block['packageName'] : '',
        'js_url'          => isset( $block['jsUrl'] ) ? $block['jsUrl'] : '',
        'css_url'         => isset( $block['cssUrl'] ) ? $block['cssUrl'] : '',
        'info_url'        => isset( $block['infoUrl'] ) ? $block['infoUrl'] : '',
        'thumbnail'       => isset( $block['imageUrl'] ) ? $block['imageUrl'] : '',
        'block_version'   => isset( $block['version'] ) ? $block['version'] : ''
      );
      Settings::add( $new_block, true );

      $response = array(
        'code'      => 200,
        'message'   => 'Succesfully installed.'
      );
      wp_send_json_success( $response );
    }
    $response = array(
      'code'      => 400,
      'message'   => 'Block could not be installed!'
    );
    wp_send_json_success( $response );

  }

  /**
   * Delete the block.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function delete() {
    $block = $_REQUEST['data'];
    if ( isset( $block ) ) {
      $package_name = isset( $block['packageName'] ) ? $block['packageName'] : '';

      Settings::delete( $package_name );

      $response = array(
        'code'      => 200,
        'message'   => 'Succesfully uninstalled.'
      );
      wp_send_json_success( $response );
    }
    $response = array(
      'code'      => 400,
      'message'   => 'Block could not be uninstalled!'
    );
    wp_send_json_success( $response );
  }

  /**
   * Update the block.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function update() {
    $block = $_REQUEST['data'];
    if ( isset( $block ) ) {
      $the_block = array(
        'block_name'      => isset( $block['name'] ) ? $block['name'] : '',
        'package_name'    => isset( $block['packageName'] ) ? $block['packageName'] : '',
        'js_url'          => isset( $block['jsUrl'] ) ? $block['jsUrl'] : '',
        'css_url'         => isset( $block['cssUrl'] ) ? $block['cssUrl'] : '',
        'info_url'        => isset( $block['infoUrl'] ) ? $block['infoUrl'] : '',
        'thumbnail'       => isset( $block['imageUrl'] ) ? $block['imageUrl'] : '',
        'block_version'   => isset( $block['version'] ) ? $block['version'] : ''
      );

      $existing_block = Settings::get( $the_block['package_name'] );

      $block_id = Settings::update( $existing_block->id, $the_block );

      if ( isset( $block_id ) ) {
        $response = array(
          'code'      => 200,
          'message'   => 'Succesfully updated.'
        );
      } else {
        $response = array(
          'code'      => 400,
          'message'   => 'Block could not be updated!'
        );
      }
      wp_send_json_success( $response );
    }
    $response = array(
      'code'      => 400,
      'message'   => 'Block could not be updated!'
    );
    wp_send_json_success( $response );
  }

  /**
   * Check for existence of custom blocks and load them.
   * Custom blocks can be uploaded to /wp-content/gutenberg-blocks/
   * They must follow file structure like:
   * -/block-dir/
   * --/style.css
   * --/script.js
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function custom_blocks() {
    // First we must make sure files.php loaded
    if ( ! function_exists( 'get_home_path' ) ) {
      include_once ABSPATH . '/wp-admin/includes/file.php';
    }
    // list all blocks (The sub-directory of /gutenberg-blocks/).
    $gutenberg_blocks_dir = WP_CONTENT_DIR . '/gutenberg-blocks/';
    $gutenberg_blocks = list_files($gutenberg_blocks_dir, 1);
    // Then loop through blocks.
    foreach ($gutenberg_blocks as $block) {
      preg_match( '/([a-zA-Z-_]*(:?\/))$/i', $block, $block_name);
      $block_name = str_replace('/', '', $block_name);
      // And list js and css files.
      $block_files = list_files($block, 1);
      // Extract block js and css files
      foreach ($block_files as $file) {
        if ( preg_match('/style.css$/i', $file) ) {
          preg_match( '/wp-content\/gutenberg-blocks\/[a-zA-Z0-9-_\/.]*/i', $file, $block_style );
        }
        if ( preg_match('/script.js$/i', $file) ) {
          preg_match( '/wp-content\/gutenberg-blocks\/[a-zA-Z0-9-_\/.]*/i', $file, $block_script );
        }
      }
      global $pagenow;
      if ( $pagenow == 'post-new.php' || $pagenow == 'post.php' ) {
        wp_enqueue_script( $block_name[0], '/' . $block_script[0], array( 'wp-blocks', 'wp-element', 'wp-i18n' ), 123321, true);
      }
      if ( $pagenow == 'post-new.php' || $pagenow == 'post.php' || !is_admin() ) {
        wp_enqueue_style( $block_name[0], '/' . $block_style[0], array(), 12321);
      }
    }
  }

  public function blocks_register_scripts($hook) {
    $blocks = Settings::get_all();

    if ( $hook == 'post-new.php' || $hook == 'post.php' ) {
      foreach ($blocks as $block) {
        wp_register_script( str_replace( ' ', '-', $block->block_name ) , $block->js_url, array(), $block->block_version , true);
        wp_enqueue_script( str_replace( ' ', '-', $block->block_name ) );
      }
    }
  }


  public function blocks_register_styles() {
    $blocks = Settings::get_all();
    foreach ($blocks as $block) {
      wp_register_style( str_replace( ' ', '-', $block->block_name ) , $block->css_url, array(), $block->block_version);
      wp_enqueue_style( str_replace( ' ', '-', $block->block_name ) );
    }
  }
}
