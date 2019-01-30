<?php

namespace CloudBlocks\Settings;

use SevenFields\Fields\Fields;
use SevenFields\Container\Container;
use CloudBlocks\Blocks\Options;

/**
 * Settings class.
 *
 * Admin settings page.
 *
 */
class Tools {

	/**
	 * @param object $page_title
	 */
  public static $page_title;

	/**
	 * @param object $menu_slug
	 */
  public static $menu_slug;

	/**
	 * @param object $notices
	 */
  public static $notices = array();

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
    add_action( 'admin_menu', array( __class__, 'settings_page') );
    add_action('admin_notices', 		array( __class__, 'admin_notices'));

    add_action( 'init', array( __class__, 'export_import') );		
  }

  /**
   * Handle import and export actions.
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public static function export_import() {

    if ( isset( $_REQUEST ) && isset( $_REQUEST['_wpnonce'] ) && \wp_verify_nonce( $_REQUEST['_wpnonce'], 'fgc_nonce_check' ) == 1 ) {

      if ( $_REQUEST['action'] == 'download-json' ) {
        // Get all installed blocks from database
        $installed_blocks = Options::get_all();
        // Set headers
        $file_name = 'fgc-export-' . date('Y-m-d') . '.json';
        header( "Content-Description: File Transfer" );
        header( "Content-Disposition: attachment; filename={$file_name}" );
        header( "Content-Type: application/json; charset=utf-8" );
        // Export the file
        echo self::fgc_json_encode( $installed_blocks );
        die;
      } else if ( $_REQUEST['action'] == 'import-json' ) {
        if ( empty( $_FILES['import_blocks_json']['size'] ) ) {
          self::add_notice( __( 'No file selected.', 'gutenberg-cloug' ), 'error' );
          return;
        }

        $file = $_FILES['import_blocks_json'];
        
        // validate error
        if ( $file['error'] ) {
          self::add_notice( __( 'Error uploading file. Please try again.', 'gutenberg-cloug' ), 'error' );
          return;
        }

        // validate type
        if( pathinfo($file['name'], PATHINFO_EXTENSION) !== 'json' ) {
          self::add_notice( __('Incorrect file type', 'gutenberg-cloug'), 'error' );
          return;
        }
        
        // read file
        $blocks = file_get_contents( $file['tmp_name'] );

        // decode json
        $blocks = json_decode( $blocks, true );

        // validate json
    	  if ( empty( $blocks ) ) {
          self::add_notice( __('Empty file imported', 'gutenberg-cloug'), 'error' );
	    	  return;
    	  }
        
        foreach ( $blocks as $block ) {
          if ( isset( $block['package_name'] ) ) {
            $imported = Options::insert( $block );
            if ( ( gettype( $imported == 'array' ) || gettype( $imported == 'object' ) ) && isset( $imported->block_name ) ) {
              self::add_notice( sprintf(__('Block <b>%s</b> already installed.', 'gutenberg-cloug'), $imported->block_name ), 'error' );
            } else {
              Options::increase_installs( $block['package_name'] );
              self::add_notice( sprintf(__('Block <b>%s</b> installed successfully.', 'gutenberg-cloug'), $block['block_name'] ), 'success' );
            }
          } else {
            self::add_notice( sprintf(__('Incorrect file type', 'gutenberg-cloug'), $block['block_name'] ), 'success' );
          }
        }

      }
      
    }
  }
    
  /**
   * Encode json object to be exported.
   *
   * @since 1.0.0
   * @param object|array $json      Array or object to be encoded
   * @return
   */
  private static function fgc_json_encode( $json ) {
	
    // PHP at least 5.4
    if( version_compare(PHP_VERSION, '5.4.0', '>=') ) {
      return json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);      
    }

    // PHP less than 5.4
    $json = json_encode($json);
    
    // http://snipplr.com/view.php?codeview&id=60559
    $result      = '';
    $pos         = 0;
    $strLen      = strlen($json);
    $indentStr   = "    ";
    $newLine     = "\n";
    $prevChar    = '';
    $outOfQuotes = true;

    for ($i=0; $i<=$strLen; $i++) {
      // Grab the next character in the string.
      $char = substr($json, $i, 1);
      // Are we inside a quoted string?
      if ($char == '"' && $prevChar != '\\') {
        $outOfQuotes = !$outOfQuotes;
        // If this character is the end of an element, 
        // output a new line and indent the next line.
      } else if(($char == '}' || $char == ']') && $outOfQuotes) {
        $result .= $newLine;
        $pos --;
        for ($j=0; $j<$pos; $j++) {
          $result .= $indentStr;
        }
      }  
      // Add the character to the result string.
      $result .= $char;
    
      // If this character is ':' adda space after it
      if($char == ':' && $outOfQuotes) {
        $result .= ' ';
      }
      // If the last character was the beginning of an element, 
      // output a new line and indent the next line.
      if (($char == ',' || $char == '{' || $char == '[') && $outOfQuotes) {
        $result .= $newLine;
        if ($char == '{' || $char == '[') {
          $pos ++;
        }  
        for ($j = 0; $j < $pos; $j++) {
          $result .= $indentStr;
        }
      }  
      $prevChar = $char;
    }
    // return
    return $result;
  }

  /**
   * Add settings sub-menu page.
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public static function settings_page() {
    Container::make( __( 'Tools', 'cloud-blocks' ), 'gutenberg-cloud-tools')
        ->set_parent( self::$menu_slug )
        ->plain_page()
        ->add_fields(array( __CLASS__, 'settings_page_output') );
  }
    
  /**
   * Plugin settings page output.
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public static function settings_page_output() {
    Fields::add('header', null, __( 'Gutenberg cloud configurations', 'cloud-blocks' ));
    Fields::add('html', 'export_installed_blocks', null, self::export_fields_html() );
  }

  public static function export_fields_html() {
    ?>
      <div class="fgc-wrapper-grid">

        <div id="normal-sortables" class="meta-box-sortables">
          <!-- Export section - Start -->
          <div class="postbox ">
            <h2 class="hndle"><span><?php _e( 'Export installed blocks', 'cloud-blocks' ); ?></span></h2>
            <div class="inside">
              <form method="post">
                <p><?php _e( 'Export all your installed blocks from Gutenberg Cloud as JSON. Note: The content will not be exported.', 'cloud-blocks' ); ?></p>
                <p class="fgc-submit">
                  <button type="submit" name="action" class="button button-primary" value="download-json"><?php _e( 'Export file', 'cloud-blocks' ); ?></button>
                </p>
                <?php wp_nonce_field( 'fgc_nonce_check' ); ?>
              </form>
            </div>
          </div>
          <!-- Export section - End -->
          <!-- Import section - Start -->
          <div class="postbox">
            <h2 class="hndle"><span><?php _e( 'Import custom blocks', 'cloud-blocks' ); ?></span></h2>
            <div class="inside">
              <form method="post" enctype="multipart/form-data">
                <p><?php _e( 'Choose the JSON file you want to import.', 'cloud-blocks' ); ?></p>
                <div class="fgc-fields">
                  <div class="fgc-field" data-type="file">
                    <div class="fgc-label">
                      <label for="fgc_import_file"><?php _e( 'Choose the file', 'cloud-blocks' ); ?></label>
                    </div>
                    <div class="fgc-input">
                      <label class="fgc-basic-uploader">
                        <input name="import_blocks_json" id="import_blocks_json" type="file">
                      </label>
                    </div>
                  </div>
                </div>

                <p class="fgc-submit">
                  <button type="submit" name="action" class="button button-primary" value="import-json"><?php _e( 'Import file', 'cloud-blocks' ); ?></button>
                </p>
                <?php wp_nonce_field( 'fgc_nonce_check' ); ?>
              </form>
            </div>
          </div>
          <!-- Import section - End -->
        </div>
      </div>
    <?php
  }

    
  /**
   * Add admin notices
   *
   * @since 1.0.0
   * @param string $text
   * @param string $class
   * @param string $wrap
   * @return
   */
  public static function add_notice( $text = '', $class = '', $wrap = 'p' ) {
		self::$notices[] = array(
			'text'	=> $text,
			'class'	=> $class,
			'wrap'	=> $wrap
		);
  }
  
  	
  /**
   * Add admin notices
   *
   * @since 1.0.0
   * @param string $text
   * @param string $class
   * @param string $wrap
   * @return
   */
	public static function get_notices() {
		if ( empty( self::$notices ) ) return false;
		return self::$notices;
  }
  
  /**
   * Admin notices output.
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public static function admin_notices() {
		$notices = self::get_notices();
		if ( !$notices ) return;
		// loop
		foreach( $notices as $notice ) {
			$open = '';
      $close = '';
      // Wrapper tag for admin notice
			if ( $notice['wrap'] ) {
				$open = "<{$notice['wrap']}>";
				$close = "</{$notice['wrap']}>";
      }
      
			?>
			<div class="notice is-dismissible notice-<?php echo esc_attr($notice['class']); ?>">
        <?php echo $open . $notice['text'] . $close; ?>
      </div>
			<?php	
		}
  }
  
}
