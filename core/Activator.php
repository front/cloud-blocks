<?php 

namespace GutenbergCloud;

/**
 * Activate Class.
 *
 * Registers plugin activation hook.
 *
 */
class Activator {

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
      info_url varchar(255) DEFAULT '' NOT NULL,
      thumbnail varchar(255) DEFAULT '' NOT NULL,
      block_version varchar(10) DEFAULT '' NOT NULL,
      block_installed datetime DEFAULT CURRENT_TIMESTAMP,
      block_updated datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY  (id)
    ) $charset_collate;";
  
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );

    update_option( 'gutenberg_cloud_db_version', '1.0' );
  }
}
