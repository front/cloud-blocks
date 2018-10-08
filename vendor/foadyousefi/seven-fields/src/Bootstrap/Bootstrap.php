<?php

namespace SevenFields\Bootstrap;

// Bootstrap the package
class Bootstrap {

  public function __construct() {
    include_once( dirname( dirname( __DIR__ ) ) . '/config.php' );
    add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
  }

   
  /**
   * Enqueue style and scripts for backend.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function enqueue_scripts() {
    wp_enqueue_style( 'seven-fields-styles', \SevenFields\URL . 'assets/css/styles.css', array(), \SevenFields\VERSION );
  }
}
