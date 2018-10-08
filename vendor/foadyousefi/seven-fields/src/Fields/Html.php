<?php

namespace SevenFields\Fields;

class Html extends Fields {

	/**
	 * @param object $label
	 */
  public static $label;

	/**
	 * @param object $content
	 */
  public static $content;

  /**
   * Initiate field.
   *
   * @since 0.1.0
   * @param string $name
   * @param string $label
   * @param string $content
   * @return function field_html()
   */
  public function __construct($name, $label, $content) {
    self::$label = $label;
    self::$content = $content;
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
      <?php echo self::$content; ?>
    </div>
    <?php
  }
}