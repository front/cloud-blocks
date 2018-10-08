<?php

namespace SevenFields\Fields;

class Multiselect extends Fields {
  
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
   * @param array $options
   * @return function field_html()
   */
  public function __construct($name, $label, $description, $options) {
    self::$name = $name;
    self::$label = $label;
    self::$description = $description;
    self::$options = $options;
    // Save value in as wp_option in database
    parent::save( self::$name, 'multiselect' );
    return $this->field_html();
  }

  /**
   * Get field value, so we can use it to show current value.
   *
   * @since 0.1.0
   * @param
   * @return array $field_value
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

  /**
   * And the actual output markup of the field.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public function field_html() {
    ?>
    <div class="seven-field multiselect">
      <div class="label"><?php _e( self::$label, 'seven-fields' ); ?></div>
      <div class="options">
        <?php
          foreach ( self::$options as $key => $value) {
            ?>
              <p>
                <label>
                  <input type="checkbox"
                        name="<?php echo self::input_name() ?>[<?php echo $value ?>]"
                        <?php echo ( isset( self::get_value()[ $value] ) && self::get_value()[ $value] == 'on' ) ? 'checked="checked"' : '' ?> />
                  <?php _e( $value, 'seven-fields' ); ?>
                </label>
              </p>
            <?php
          }
        ?>
      </div>
      <span class="desc"><?php _e( self::$description, 'seven-fields' ); ?></span>
    </div>
    <?php
  }
}