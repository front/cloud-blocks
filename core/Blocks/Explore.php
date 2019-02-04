<?php

namespace CloudBlocks\Blocks;

use CloudBlocks\Blocks\Options;
use CloudBlocks\Blocks\Blocks;

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
    add_action( 'admin_menu', array( __CLASS__, 'add_menu') );
    // Handle uploading custom blocks as zip files
    add_action( 'init', array( __CLASS__, 'upload_block' ) );
    // Schedule cron with check updates
    add_action( 'admin_init', array( __CLASS__, 'cron_schedule' ) );
    add_action( 'fgc_cron_check_updates', array( __CLASS__, 'check_updates' ) );
  }

  /**
   * Handle uploading custom blocks via zip file.
   *
   * @since 1.0.7
   * @param
   * @return
   */
  public static function upload_block() {
    if ( isset( $_REQUEST ) && isset( $_REQUEST['_wpnonce'] ) && \wp_verify_nonce( $_REQUEST['_wpnonce'], 'fgc_upload_block' ) == 1 && $_FILES['blockzip']['name'] ) {
      // Define some variables that we need down the road
      $filename = $_FILES["blockzip"]["name"];
      $source = $_FILES["blockzip"]["tmp_name"];
      $type = $_FILES["blockzip"]["type"];
      $name = explode(".", $filename);
      // Here is accepted file types
      $accepted_types = array('application/zip', 'application/x-zip-compressed', 'multipart/x-zip', 'application/x-compressed');
      foreach($accepted_types as $mime_type) {
        if($mime_type == $type) {
          $okay = true;
          break;
        }
      }

      $continue = strtolower( $name[1] ) == 'zip' ? true : false;
      if ( !$continue ) {
        \CloudBlocks\Settings\Tools::add_notice( __( 'The file you are trying to upload is not a supported file type. Please try again.', 'cloud-blocks' ), 'error' );
      } else {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        \WP_Filesystem();
        $destination = wp_upload_dir();
        $destination_path = $destination['basedir'] . '/gutenberg-blocks/';
        $create_folder = wp_mkdir_p( $destination_path );

        // Here the magic happens.
        if ( move_uploaded_file( $source, $destination_path . $filename ) ) {
          // Unzip
          $unzipfile = unzip_file( $destination_path . $filename , $destination_path);
          if ( $unzipfile ) {
            wp_delete_file( $destination_path . $filename );
            \CloudBlocks\Settings\Tools::add_notice( sprintf(__('Your custom block <b>%s</b> installed successfully. You must activate it in local tab.', 'cloud-blocks'), $name[0] ), 'success' );
          }
        } else {
          \CloudBlocks\Settings\Tools::add_notice( __( 'There was a problem with the upload. Please try again.', 'cloud-blocks' ), 'error' );
        }
      }
    }
  }

  /**
   * Add options menu page.
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public static function add_menu() {

      $update_count = self::count_updates();
      $menu_label = sprintf( esc_html__( self::$page_title, 'cloud-blocks' ) . " %s", "<span class='update-plugins update-blocks count-$update_count' title='$update_count'><span class='update-count'>" . number_format_i18n($update_count) . "</span></span>" );

      add_menu_page(
      esc_html__( self::$page_title, 'cloud-blocks' ),
      $menu_label,
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
      <h1 class="wp-heading-inline"><?php esc_html_e( self::$page_title, 'cloud-blocks' ); ?></h1>
      <a href="#" @click.prevent="showUploader" class="upload-view-toggle page-title-action">
        <span class="upload"><?php _e( 'Upload block', 'cloud-blocks' ); ?></span>
      </a>
      <hr class="wp-header-end">

      <div class="upload-plugin-wrap">
        <div class="upload-plugin upload-custom-block">
          <p class="install-help"><?php _e( 'If you have a custom Gutenberg block, you can upload it here.', 'cloud-blocks' ); ?></p>
          <p class="fgc-center-text block-install-help">
            <?php echo sprintf( __( 'If using Git, we recommend adjusting your .gitignore and commit your block in <b>%s</b>', 'cloud-blocks' ), '<code>/wp-content/uploads/gutenberg-blocks/*</code>' ); ?>
            <br />
            <a href="https://github.com/front/cloud-blocks/blob/master/docs/private-blocks.md" target="_blank"><?php _e( 'See documentation: Private blocks.', 'cloud-blocks' ); ?></a>
          </p>
          <form method="post" enctype="multipart/form-data" class="wp-upload-form">
            <?php wp_nonce_field( 'fgc_upload_block' ); ?>
            <input type="hidden" name="_wp_http_referer" value="<?php menu_page_url( self::$page_title, true ); ?>">
            <label class="screen-reader-text" for="blockzip"><?php _e( 'Zip file of block', 'cloud-blocks' ); ?></label>
            <input type="file" id="blockzip" name="blockzip">
            <input type="submit" name="install-block-submit" id="install-block-submit" class="button" value="<?php _e( 'Install now', 'cloud-blocks' ); ?>" disabled="">
          </form>
        </div>
      </div>

      <admin-notice></admin-notice>
      <explorer-filter></explorer-filter>

		  <div class="theme-browser content-filterable rendered">
        <div class="themes wp-clearfix">
          <block-card v-for="block in blocks" :key="block.name" :block="block"/>
        </div>
          <block-details v-if="openOverlay" :block="openOverlay"></block-details>
      </div>

    </div>
  <?php
  }

  /**
   * Updates counter.
   *
   * @since 1.1.2
   * @param
   * @return $counter
   */
  public static function count_updates() {
    $counter = 0;
    $installed_blocks = Options::get_all();

    foreach ($installed_blocks as $block) {
      // We must check if block is not local block, then we check for new version availability
      $manifest = json_decode( stripslashes( $block->block_manifest ), true );

      if( empty($manifest['isLocal']) && !empty($block->available_version) && version_compare($block->available_version, $block->block_version, '>')) {
        $counter++;
      }
    }

    return $counter;
  }

  /**
  * CRON schedule.
  *
  * @since 1.1.4
  * @param
  * @return
  */
  public static function cron_schedule() {
    if ( !wp_next_scheduled( 'fgc_cron_check_updates' ) ) {
        wp_schedule_event(time(), 'daily', 'fgc_cron_check_updates');
    }
  }

  /**
  * CRON unschedule.
  *
  * @since 1.1.4
  * @param
  * @return
  */
  public static function cron_unschedule() {
    wp_clear_scheduled_hook('fgc_cron_check_updates');
  }

  /**
  * CRON schedule.
  *
  * @since 1.1.4
  * @param
  * @return
  */
  public static function check_updates() {
    $installed_blocks = Options::get_all();

      foreach ( $installed_blocks as $block ) {
        // We must check if block is not local block, then we check for new version availability
        $manifest = json_decode( stripslashes( $block->block_manifest ), true );
        if ( empty( $manifest['isLocal'] ) ) {
          $args     = array(
            'method' => 'GET'
          );
          $response = wp_remote_request( 'https://api.gutenbergcloud.org/blocks/' . $block->package_name, $args );
          $body     = wp_remote_retrieve_body( $response );
          $the_block  = json_decode( $body, true );

          if( !empty($the_block['version']) && $the_block['version'] !== $block->block_version) {
              $_REQUEST['data'] = $the_block;
              Blocks::update_version($the_block);
          }
        }
      }

  }

}

