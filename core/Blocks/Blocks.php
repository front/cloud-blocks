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

  public function blocks_register_scripts($hook) {
    $blocks = Settings::get_all();
    global $post;
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
