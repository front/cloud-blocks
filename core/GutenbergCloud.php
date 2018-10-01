<?php

namespace GutenbergCloud;

use GutenbergCloud\Blocks;
use GutenbergCloud\Cloud;
use GutenbergCloud\Settings;

/**
 * GutenbergCloud Class.
 *
 * This is main class called to initiate all functionalities this plugin provides.
 *
 */
class GutenbergCloud {

  public function __construct() {
    global $pagenow;
    if (( $pagenow == 'admin.php' ) && ($_GET['page'] == FGC_NAME)) {
      add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
    }
    
    new Blocks;
    Cloud\Explore::init();
  }

  /**
  * Enqueue admin scripts.
  * @since    0.1.0
  * @param
  * @return
  */
  public function enqueue_scripts() {
    wp_enqueue_script( 'vuejs', 'https://unpkg.com/vue@2.5.17/dist/vue.min.js', array( 'jquery' ), FGC_VERSION, true );
    wp_enqueue_script( 'vuex', 'https://unpkg.com/vuex@3.0.1/dist/vuex.min.js', array('vuejs'), FGC_VERSION, TRUE );
    wp_enqueue_script( 'gutenberg_cloud_admin_js', FGC_URL . 'assets/js/script.js', array( 'jquery', 'vuejs', 'vuex', 'wp-i18n' ), FGC_VERSION, true );
    $localized_data = array(
      'ajaxUrl' 				=> admin_url( 'admin-ajax.php' ),
      'installedBlocks' => Settings::get_all()
		);
    wp_localize_script( 'gutenberg_cloud_admin_js', 'fgcData', $localized_data );
    wp_enqueue_style( 'gutenberg_cloud_admin_styles', FGC_URL . 'assets/css/style.css', false, 20180914 );
  }

}