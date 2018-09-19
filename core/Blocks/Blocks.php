<?php

namespace GutenbergCloud;

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
      update_option( 'gutenberg_cloud_installed_blocks', $block );
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

  public function getBlocks() {
    $blocks = get_option( 'gutenberg_cloud_installed_blocks', null );
    $installed_blocks = array();
    $installed_blocks[ $blocks['name'] ] = array(
      'js'    => $blocks['jsUrl'],
      'css'   => $blocks['cssUrl']
    );
    
    return $installed_blocks;
  }
  public function blocks_register_scripts($hook) {
    $blocks = $this->getBlocks();
    global $post;
    if ( $hook == 'post-new.php' || $hook == 'post.php' ) {
      foreach ($blocks as $key => $value) {
        wp_register_script($key, $value['js'], array(), '1.0.1' , true);
        wp_enqueue_script($key);
      }
    }
  }
  public function blocks_register_styles() {
    $blocks = $this->getBlocks();
    foreach ($blocks as $key => $value) {
      wp_register_style($key, $value['css'], array(), '1.0.1');
       wp_enqueue_style($key);
    }
  }
}
