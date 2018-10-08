<?php

namespace SevenFields\Fields;

class Fields {
  
	/**
	 * @param object $option_group
	 */
  public static $options_group;

	/**
	 * @param object $options_name
	 */
  public static $options_name;

  /**
   * Initiate fields.
   * 
   * @since 0.1.0
   * @param string $options_group
   * @param string $options_name
   * @return 
   */
  public static function make( $options_group, $options_name ) {
    self::$options_group = $options_group;
    self::$options_name = $options_name;
  }

  /**
   * Initiate fields.
   *
   * @since 0.1.0
   * @param string $type
   * @param string $name
   * @param string $label
   * @param string $description
   * @param array $options
   * @return
   */
  public static function factory($type, $name, $label = null, $description = null, $options = null) {
    $class = self::type_to_class($type, __NAMESPACE__);
    $field = new $class( $name, $label, $description, $options );
  }

  /**
   * Add field to the page.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public static function add() {
    return call_user_func_array( array( get_class(), 'factory' ), func_get_args() );
  }

  /**
   * Save fields values to wp_options table.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public static function save( $name, $type ){
    if ( isset( $_REQUEST ) && isset( $_REQUEST['_wpnonce'] ) && wp_verify_nonce( $_REQUEST['_wpnonce'], 'wprds_nonce_check' ) == 1 ) {
      $post_data = $_REQUEST[ self::$options_name ];
      $value = isset( $post_data[ $name ] ) ? $post_data[ $name ] : null;
      switch ( $type ) {
        case 'text':
          update_option( $name, sanitize_text_field( $value ) );
          break;
        case 'textarea':
          update_option( $name, sanitize_textarea_field( $value ) );
          break;
        case 'multiselect':
          update_option( $name, $value );
          break;
        case 'checkbox':
          $value = isset( $value ) ? true : false;
          update_option( $name, $value );
          break;
      }
    }
  }

	/**
	 * Convert a string representing an object type to a fully qualified class name
	 *
	 * @param  string $type
	 * @param  string $namespace
	 * @return string
	 */
	public static function type_to_class( $type, $namespace = '' ) {
		$type = ucwords( $type );
		$type = str_replace( ' ', '_', $type );
		$class = $type;
		if ( $namespace ) {
			$class = $namespace . '\\' . $class;
		}
		return $class;
	}
}