<?php

namespace SevenFields\Fields;

class Header extends Fields {

	/**
	 * @param object $label
	 */
  public static $label;

	/**
	 * @param object $description
	 */
  public static $description;

  /**
   * Initiate field.
   *
   * @since 0.1.0
   * @param string $name
   * @param string $label
   * @param string $description
   * @return function field_html()
   */
  public function __construct($name, $label, $description) {
    self::$label = $label;
    self::$description = $description;
    return $this->field_html();
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
    <div class="seven-field header">
      <h3><?php _e( self::$label, 'seven-fields' ); ?></h3>
      <span class="desc"><?php _e( self::$description, 'seven-fields' ); ?></span>
    </div>
    <?php
  }
}