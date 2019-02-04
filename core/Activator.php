<?php

namespace CloudBlocks;

use CloudBlocks\Blocks\Explore;

/**
 * Activate Class.
 *
 * Registers plugin activation hook.
 *
 */
class Activator {

	/**
   * Current version of custom db table
	 * @param object
	 */
  public static $current_db_version = '1.3';

  /**
  * activate, runs at plugin activation.
  * @since 1.0.0
  * @param
  * @return
  */
  public static function init() {
    self::create_db();

  }

  /**
  * Create database table used for store and tracking active Gutenberg blocks.
  * @since 1.0.0
  * @param
  * @return
  */
  public static function create_db() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    $table_name = $wpdb->prefix . str_replace( '-', '_', FGC_NAME );

    $sql = "CREATE TABLE $table_name (
      id mediumint(9) NOT NULL AUTO_INCREMENT,
      block_name varchar(150) NOT NULL,
      package_name varchar(150) NOT NULL UNIQUE,
      js_url varchar(255) DEFAULT '' NOT NULL,
      css_url varchar(255) DEFAULT '' NOT NULL,
      editor_css varchar(255) DEFAULT '',
      info_url varchar(255) DEFAULT '' NOT NULL,
      thumbnail varchar(255) DEFAULT '' NOT NULL,
      block_version varchar(10) DEFAULT '' NOT NULL,
      block_manifest text DEFAULT '' NOT NULL,
      block_installed datetime DEFAULT CURRENT_TIMESTAMP,
      block_updated datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      available_version varchar(10) DEFAULT '' NOT NULL,
      PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );

    update_option( 'gutenberg_cloud_db_version', '1.0' );
  }


  /**
  * Update database.
  * @since 1.0.0
  * @param
  * @return
  */
  public static function update_db() {
    // First we check if there is new version available
    $installed_ver = get_option( 'gutenberg_cloud_db_version' );
    if ( $installed_ver != self::$current_db_version ) {
      global $wpdb;
      $charset_collate = $wpdb->get_charset_collate();
      $table_name = $wpdb->prefix . str_replace( '-', '_', FGC_NAME );

      $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        block_name varchar(150) NOT NULL,
        package_name varchar(150) NOT NULL UNIQUE,
        js_url varchar(255) DEFAULT '' NOT NULL,
        css_url varchar(255) DEFAULT '' NOT NULL,
        editor_css varchar(255) DEFAULT '',
        info_url varchar(255) DEFAULT '' NOT NULL,
        thumbnail varchar(255) DEFAULT '' NOT NULL,
        block_version varchar(10) DEFAULT '' NOT NULL,
        block_manifest text DEFAULT '' NOT NULL,
        block_installed datetime DEFAULT CURRENT_TIMESTAMP,
        block_updated datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        available_version varchar(10) DEFAULT '' NOT NULL,
        PRIMARY KEY  (id)
      ) $charset_collate;";

      require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
      dbDelta( $sql );

      update_option( 'gutenberg_cloud_db_version', self::$current_db_version );
    }

  }

}
