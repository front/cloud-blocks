<?php 

namespace GutenbergCloud\Blocks;

/**
 * Options class.
 *
 * Contains methods for inserting into database, reading and updating.
 *
 */
class Options {

  /**
  * Add new record to the database.
  * @since    0.1.0
  * @param array $options   The options need to be stored into database
  * @param boolean $force   If record exists, to update it or ignore.
  * @return int $id         Inserted records id
  */
  public static function add( $options, $force = false ) {
    global $wpdb;

    $block_name = $options['block_name'];
    $package_name = $options['package_name'];
    $js_url = $options['js_url'];
    $css_url = $options['css_url'];
    $info_url = $options['info_url'];
    $thumbnail = $options['thumbnail'];
    $block_version = $options['block_version'];

    // First of all, lets make sure column exists or not.
    $block = self::get( $package_name );
    if ( isset( $block ) && $force ) {
      self::update( $block->id, $options );

      return array(
        'message'   => 'Block was already installed, and updated with new data.',
        'block_id'  => $block->id
      );
    } else if ( isset( $block ) ) {
      return array(
        'message'   => 'Block already installed.',
        'block_id'  => $block->id
      );
    } else {
      // If not exists, so insert it.
      $table_name = $wpdb->prefix . str_replace( '-', '_', FGC_NAME );
      
      $id = $wpdb->insert( 
        $table_name, 
        array( 
          'block_name'      => $block_name,
          'package_name'    => $package_name,
          'js_url'          => $js_url,
          'css_url'         => $css_url,
          'info_url'        => $info_url,
          'thumbnail'       => $thumbnail,
          'block_version'   => $block_version
        )
      );
      return array(
        'message'   => 'Block installed',
        'block_id'  => $id
      );
    }
  }

  /**
  * Insert block into database.
  * @since    0.1.0
  * @param array $block     The array of block values
  * @return int $id         Inserted records id
  */
  public static function insert( $block ) {
    global $wpdb;
    // Validate block
    $block_name = isset( $block['block_name'] ) ? $block['block_name'] : '';
    $package_name = isset( $block['package_name'] ) ? $block['package_name'] : '';
    $js_url = isset( $block['js_url'] ) ? $block['js_url'] : '';
    $css_url = isset( $block['css_url'] ) ? $block['css_url'] : '';
    $info_url = isset( $block['info_url'] ) ? $block['info_url'] : '';
    $thumbnail = isset( $block['thumbnail'] ) ? $block['thumbnail'] : '';
    $block_version = isset( $block['block_version'] ) ? $block['block_version'] : '';

    // First of all, lets make sure column exists or not.
    $block = self::get( $package_name );
    if ( isset( $block ) ) {
      return $block;
    } else {

      $table_name = $wpdb->prefix . str_replace( '-', '_', FGC_NAME );
      
      $imserted = $wpdb->insert(
        $table_name, 
        array(
          'block_name'      => $block_name,
          'package_name'    => $package_name,
          'js_url'          => $js_url,
          'css_url'         => $css_url,
          'info_url'        => $info_url,
          'thumbnail'       => $thumbnail,
          'block_version'   => $block_version
        )
      );
    }
    
    if ( $imserted ) {
      return $wpdb->insert_id;
    }

    return false;

  }

  /**
  * Update existing value in database.
  * @since    0.1.0
  * @param array $options   The options need to be stored into database
  * @return int $id         Inserted records id
  */
  public static function update( $id, $options ) {
    global $wpdb;
    
    $block_name = $options['block_name'];
    $package_name = $options['package_name'];
    $js_url = $options['js_url'];
    $css_url = $options['css_url'];
    $info_url = $options['info_url'];
    $thumbnail = $options['thumbnail'];
    $block_version = $options['block_version'];

    $table_name = $wpdb->prefix . str_replace( '-', '_', FGC_NAME );
    
    $id = $wpdb->update( 
      $table_name, 
      array(
        'block_name'      => $block_name,
        'package_name'    => $package_name,
        'js_url'          => $js_url,
        'css_url'         => $css_url,
        'info_url'        => $info_url,
        'thumbnail'       => $thumbnail,
        'block_version'   => $block_version
      ),
      array(
        'id'      => $id
      )
    );

    return $id;
  }

  /**
  * Get all installed blocks.
  * @since    0.1.0
  * @param
  * @return object|null $blocks          All installed blocks
  */
  public static function get_all() {
    global $wpdb;
    
    $table_name = $wpdb->prefix . str_replace( '-', '_', FGC_NAME );
    $blocks = $wpdb->get_results( "SELECT * FROM $table_name" );

    return $blocks;
  }

  /**
  * Read a row from database.
  * @since    0.1.0
  * @param string|null $package_name   npm package name
  * @return object|null $block          The block in the database
  */
  public static function get( $package_name = null ) {
    global $wpdb;
    
    $table_name = $wpdb->prefix . str_replace( '-', '_', FGC_NAME );
    $block = $wpdb->get_row( "SELECT * FROM $table_name WHERE package_name = '{$package_name}'" );

    return $block;
  }

  /**
  * Delete a row from database.
  * @since    0.1.0
  * @param string|null $package_name    npm package name
  * @return object|null $block          The block in the database
  */
  public static function delete( $package_name = null ) {
    global $wpdb;
    
    $table_name = $wpdb->prefix . str_replace( '-', '_', FGC_NAME );
    $block = $wpdb->delete( $table_name, array('package_name' => $package_name) );

    return $block;
  }

}
