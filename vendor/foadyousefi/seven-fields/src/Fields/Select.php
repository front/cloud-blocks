<?php

namespace SevenFields\Fields;

class Select extends Fields {
  
	/**
	 * @param object $name
	 */
  public static $name;

	/**
	 * @param object $label
	 */
  public static $label;

	/**
	 * @param object $description
	 */
  public static $description;

	/**
	 * @param object $description
	 */
  public static $options;

  /**
   * Initiate field.
   *
   * @since 0.1.0
   * @param string $name
   * @param string $label
   * @param string $description
   * @return function field_html()
   */
  public function __construct($name, $label, $description, $options) {
    self::$name = $name;
    self::$label = $label;
    self::$description = $description;
    self::$options = $options;
    return $this->field_html();
  }

  /**
   * Get field value, so we can use it to show current value.
   *
   * @since 0.1.0
   * @param
   * @return string $field_value
   */
  public static function get_value() {
    return get_option( self::$name, null );
  }

  /**
   * Set field name attr.
   *
   * @since 0.1.0
   * @param
   * @return string $field_name
   */
  public static function input_name() {
    $options_name = parent::$options_name;
    return $options_name . '[' . self::$name . ']';
  }

  public function field_html() {
    ?>
      <div class="seven-field text-field">
        <div class="label"><?php _e( self::$label, 'seven-fields' ); ?></div>
        <select name="<?php echo self::input_name() ?>">
          <?php
          foreach ( self::$options as $key => $value ) { ?>
            <option value="<?php echo esc_attr( $key ); ?>" <?php selected( self::get_value(), $key, true ); ?>>
              <?php echo _e( strip_tags( $value ), 'seven-fields' ); ?>
            </option>
          <?php } ?>
        </select>
        <span class="desc"><?php echo self::$description ?></span>
      </div>
    <?php
  }
}
