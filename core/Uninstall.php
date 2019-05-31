<?php

namespace CloudBlocks;

use CloudBlocks\Blocks\Explore;

/**
 * Uninstall Class.
 *
 * Registers plugin uninstall hook.
 *
 */
class Uninstall {

  /**
  * Runs at plugin uninstallation to delete database table.
  * @since 1.1.7
  * @param
  * @return
  */
  public static function init() {
    self::create_db();
  }

  /**
  * Drop database table.
  * @since 1.1.7
  * @param
  * @return
  */
  public static function create_db() {
    global $wpdb;

    $table_name = $wpdb->prefix . str_replace( '-', '_', FGC_NAME );
    $wpdb->query( "DROP TABLE IF EXISTS $table_name" );

    delete_option("gutenberg_cloud_db_version");
  }

}
