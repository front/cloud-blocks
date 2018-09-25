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
