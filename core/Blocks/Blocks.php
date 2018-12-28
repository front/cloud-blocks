<?php

namespace CloudBlocks\Blocks;

use CloudBlocks\Blocks\Options;

class Blocks {

  public function __construct() {
    add_action( 'admin_enqueue_scripts', array( $this, 'blocks_register_scripts' ) );
    add_action( 'admin_enqueue_scripts', array( $this, 'blocks_register_styles' ) );
    add_action( 'wp_enqueue_scripts', array( $this, 'blocks_register_styles' ) );
    add_action( 'wp_ajax_fgc_install_block', array( $this, 'install' ) );
    add_action( 'wp_ajax_nopriv_fgc_install_block', array( $this, 'install' ) );

    add_action( 'wp_ajax_fgc_get_all_blocks', array( $this, 'get_all' ) );
    add_action( 'wp_ajax_nopriv_fgc_get_all_blocks', array( $this, 'get_all' ) );

    add_action( 'wp_ajax_fgc_uninstall_block', array( $this, 'uninstall' ) );
    add_action( 'wp_ajax_nopriv_fgc_uninstall_block', array( $this, 'uninstall' ) );

    add_action( 'wp_ajax_fgc_delete_block', array( $this, 'delete_block' ) );
    add_action( 'wp_ajax_nopriv_fgc_delete_block', array( $this, 'delete_block' ) );

    add_action( 'wp_ajax_fgc_update_block', array( $this, 'update' ) );
    add_action( 'wp_ajax_nopriv_fgc_update_block', array( $this, 'update' ) );

    add_action( 'wp_ajax_fgc_local_blocks', array( $this, 'local_blocks' ) );
    add_action( 'wp_ajax_nopriv_fgc_local_blocks', array( $this, 'local_blocks' ) );
    
    // add_action( 'init', array( $this, 'custom_blocks' ) );
  }


  /**
   * Get all installed blocks.
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public function get_all() {
    $installed_blocks = Options::get_all();
    wp_send_json_success( $installed_blocks );
  }

  /**
   * Install the block.
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public function install() {
    $block = $_REQUEST['data'];
    if ( isset( $block ) ) {
      $new_block = array(
        'block_name'      => isset( $block['name'] ) ? $block['name'] : '',
        'package_name'    => isset( $block['packageName'] ) ? $block['packageName'] : '',
        'js_url'          => isset( $block['jsUrl'] ) ? $block['jsUrl'] : '',
        'css_url'         => isset( $block['cssUrl'] ) ? $block['cssUrl'] : '',
        'editor_css'      => isset( $block['editorCss'] ) ? $block['editorCss'] : '',
        'info_url'        => isset( $block['infoUrl'] ) ? $block['infoUrl'] : '',
        'thumbnail'       => isset( $block['imageUrl'] ) ? $block['imageUrl'] : '',
        'block_version'   => isset( $block['version'] ) ? $block['version'] : '',
        'block_manifest'  => isset( $block['blockManifest'] ) ? $block['blockManifest'] : ''
      );
      Options::add( $new_block, true );

      $response = array(
        'code'      => 200,
        'message'   => 'Succesfully installed.'
      );
      wp_send_json_success( $response );
    }
    $response = array(
      'code'      => 400,
      'message'   => 'Block could not be installed!'
    );
    wp_send_json_success( $response );

  }

  /**
   * Delete the block.
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public function uninstall() {
    $block = $_REQUEST['data'];
    if ( isset( $block ) ) {
      $package_name = isset( $block['packageName'] ) ? $block['packageName'] : '';

      Options::delete( $package_name );

      $response = array(
        'code'      => 200,
        'message'   => 'Succesfully uninstalled.'
      );
      wp_send_json_success( $response );
    }
    $response = array(
      'code'      => 400,
      'message'   => 'Block could not be uninstalled!'
    );
    wp_send_json_success( $response );
  }

  /**
   * Update the block.
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public function update() {
    $block = $_REQUEST['data'];
    if ( isset( $block ) ) {
      $the_block = array(
        'block_name'      => isset( $block['name'] ) ? $block['name'] : '',
        'package_name'    => isset( $block['packageName'] ) ? $block['packageName'] : '',
        'js_url'          => isset( $block['jsUrl'] ) ? $block['jsUrl'] : '',
        'css_url'         => isset( $block['cssUrl'] ) ? $block['cssUrl'] : '',
        'editor_css'      => isset( $block['editorCss'] ) ? $block['editorCss'] : '',
        'info_url'        => isset( $block['infoUrl'] ) ? $block['infoUrl'] : '',
        'thumbnail'       => isset( $block['imageUrl'] ) ? $block['imageUrl'] : '',
        'block_version'   => isset( $block['version'] ) ? $block['version'] : '',
        'block_manifest'  => isset( $block['blockManifest'] ) ? $block['blockManifest'] : ''
      );

      $existing_block = Options::get( $the_block['package_name'] );

      $block_id = Options::update( $existing_block->id, $the_block );

      if ( isset( $block_id ) ) {
        $response = array(
          'code'      => 200,
          'message'   => 'Succesfully updated.'
        );
      } else {
        $response = array(
          'code'      => 400,
          'message'   => 'Block could not be updated!'
        );
      }
      wp_send_json_success( $response );
    }
    $response = array(
      'code'      => 400,
      'message'   => 'Block could not be updated!'
    );
    wp_send_json_success( $response );
  }

  /**
   * Check for existence of custom blocks and load them.
   * Custom blocks can be uploaded to /wp-content/gutenberg-blocks/
   * They must follow file structure like:
   * -/block-dir/
   * --/style.css
   * --/script.js
   *
   * @since 1.0.0
   * @param
   * @return
   */
  public function custom_blocks() {
    // First we must make sure files.php loaded
    if ( ! function_exists( 'get_home_path' ) ) {
      include_once ABSPATH . '/wp-admin/includes/file.php';
    }
    // list all blocks (The sub-directory of /gutenberg-blocks/).
    $gutenberg_blocks_dir = wp_upload_dir()['basedir'] . '/gutenberg-blocks/';
    $gutenberg_blocks = list_files($gutenberg_blocks_dir, 1);
    // Then loop through blocks.
    foreach ($gutenberg_blocks as $block) {
      preg_match( '/([a-zA-Z-_]*(:?\/))$/i', $block, $block_name);
      $block_name = str_replace('/', '', $block_name);
      // And list js and css files.
      $block_files = list_files($block . 'build', 1);

      // Reset script and styles of the block
      $block_style = null;
      $editor_style = null;
      $block_script = null;
      
      // Extract block js and css files
      foreach ($block_files as $file) {
        if ( preg_match('/style.css$/i', $file) ) {
          preg_match( '/wp-content\/uploads\/gutenberg-blocks\/[a-zA-Z0-9-_\/.]*/i', $file, $block_style );
        }
        if ( preg_match('/editor.css$/i', $file) ) {
          preg_match( '/wp-content\/uploads\/gutenberg-blocks\/[a-zA-Z0-9-_\/.]*/i', $file, $editor_style );
        }
        if ( preg_match('/index.js$/i', $file) ) {
          preg_match( '/wp-content\/uploads\/gutenberg-blocks\/[a-zA-Z0-9-_\/.]*/i', $file, $block_script );
        }
      }
      global $pagenow;
      if ( ( $pagenow == 'post-new.php' || $pagenow == 'post.php' ) && isset( $block_script ) && !empty( $block_script ) ) {
        wp_enqueue_script( $block_name[0], '/' . $block_script[0], array( 'wp-editor', 'wp-blocks', 'wp-element', 'wp-i18n' ), FGC_VERSION, true);
      }
      if ( ( $pagenow == 'post-new.php' || $pagenow == 'post.php' || !is_admin() ) && isset( $block_style ) && !empty( $block_style ) ) {
        wp_enqueue_style( $block_name[0], '/' . $block_style[0], array(), FGC_VERSION);
        if ( isset( $editor_style ) && !empty( $editor_style ) && is_admin() ) {
          wp_enqueue_style( $block_name[0] . '-editor', '/' . $editor_style[0], array(), FGC_VERSION);
        }
      }
    }
  }

  /**
   * Get local blocks.
   * Custom blocks can be uploaded to /wp-content/gutenberg-blocks/
   * They must follow file structure like:
   * -package.json
   * -/block-dir/
   * --/style.css
   * --/editor.css
   * --/script.js
   * --/thumbnail.(jpg|png|gif)
   *
   * @since 1.0.11
   * @param
   * @return
   */
  public function local_blocks() {
    // First we must make sure files.php loaded
    if ( ! function_exists( 'get_home_path' ) ) {
      include_once ABSPATH . '/wp-admin/includes/file.php';
    }
    // list all blocks (The sub-directory of /gutenberg-blocks/).
    $gutenberg_blocks_dir = wp_upload_dir()['basedir'] . '/gutenberg-blocks/';
    $gutenberg_blocks = list_files($gutenberg_blocks_dir, 1);

    $local_blocks = array();
    // Then loop through blocks.
    foreach ($gutenberg_blocks as $block) {
      preg_match( '/([a-zA-Z-_]*(:?\/))$/i', $block, $block_name);
      $block_name = str_replace('/', '', $block_name);
      // And list js and css files.
      $block_files = list_files($block . 'build', 1);

      // Reset script and styles of the block
      $block_style = null;
      $editor_style = null;
      $block_script = null;
      $block_thumbnail = null;
      
      // Extract block js and css files
      foreach ($block_files as $file) {
        if ( preg_match('/style.css$/i', $file) ) {
          preg_match( '/wp-content\/uploads\/gutenberg-blocks\/[a-zA-Z0-9-_\/.]*/i', $file, $block_style );
        }
        if ( preg_match('/editor.css$/i', $file) ) {
          preg_match( '/wp-content\/uploads\/gutenberg-blocks\/[a-zA-Z0-9-_\/.]*/i', $file, $editor_style );
        }
        if ( preg_match('/index.js$/i', $file) ) {
          preg_match( '/wp-content\/uploads\/gutenberg-blocks\/[a-zA-Z0-9-_\/.]*/i', $file, $block_script );
        }
        if ( preg_match('/thumbnail/i', $file) ) {
          preg_match( '/wp-content\/uploads\/gutenberg-blocks\/[a-zA-Z0-9-_\/.]*/i', $file, $block_thumbnail );
        }
      }

      // Read block manifest
      $package_json = array();
      $block_manifest = array();

      if ( file_exists( $block . 'package.json' ) ) {
        $package_json = file_get_contents($block . 'package.json');
        $package_json = json_decode( $package_json );

        $block_manifest = array(
          'name'            => isset( $package_json->name ) ? $package_json->name : '',
          'version'         => isset( $package_json->version ) ? $package_json->version : '',
          'description'     => isset( $package_json->description ) ? $package_json->description : '',
          'main'            => isset( $package_json->main ) ? $package_json->main : '',
          'author'          => isset( $package_json->author ) ? $package_json->author : '',
          'license'         => isset( $package_json->license ) ? $package_json->license : '',
          'repository'      => isset( $package_json->repository ) ? $package_json->repository : '',
          'homepage'        => isset( $package_json->homepage ) ? $package_json->homepage : '',
          'keywords'        => isset( $package_json->keywords ) ? $package_json->keywords : '',
          'isLocal'         => true
        );
      }

      $local_blocks[] = array(
        'name'            => isset( $package_json->gutenbergCloud->name ) ? $package_json->gutenbergCloud->name : $package_json->name,
        'packageName'     => isset( $package_json->name ) ? $package_json->name : '',
        'jsUrl'           => ( isset( $block_script ) && !empty( $block_script ) ) ? site_url() . '/' . $block_script[0] : $package_json->gutenbergCloud->js,
        'cssUrl'          => ( isset( $block_style ) && !empty( $block_style ) ) ? site_url() . '/' . $block_style[0] : $package_json->gutenbergCloud->css,
        'editorCss'       => ( isset( $editor_style ) && !empty( $editor_style ) ) ? site_url() . '/' . $editor_style[0] : $package_json->gutenbergCloud->editor,
        'infoUrl'         => 'https://www.npmjs.com/package/' . $package_json->name,
        'imageUrl'        => ( isset( $block_thumbnail ) && !empty( $block_thumbnail ) ) ? site_url() . '/' . $block_thumbnail[0] : $package_json->gutenbergCloud->thumbnail,
        'version'         => isset( $package_json->version ) ? $package_json->version : '',
        'blockManifest'   => json_encode($block_manifest)
      );

      
    }

    wp_send_json_success( $local_blocks );
  }

  /**
   * Delete block files completely.
   *
   * @since 1.0.11
   * @param
   * @return
   */
  public function delete_block() {
    if ( isset( $_REQUEST ) && isset( $_REQUEST['data']['nonce'] ) && \wp_verify_nonce( $_REQUEST['data']['nonce'], 'fgc_ajax_nonce' ) == 1 ) {

      require_once(ABSPATH . 'wp-admin/includes/file.php');
      \WP_Filesystem();
      $destination = wp_upload_dir();
      $destination_path = $destination['basedir'] . '/gutenberg-blocks/';
      $block = $_REQUEST['data']['block']['jsUrl'];

      $block = str_replace( $destination['baseurl'] . '/gutenberg-blocks/', '', $block );
      preg_match( '/[a-zA-Z0-9-_]*(?!:\/)/i', $block, $block_dir );
      
      $filesystem = new \WP_Filesystem_Direct(array());
      $removed = $filesystem->delete( $destination_path . $block_dir[0], true );

      if ( $removed ) {
        $response = array(
          'code'      => 200,
          'message'   => 'Block directory removed totally'
        );
        wp_send_json_success( $response );
      }

    }
    wp_send_json_error(array(
      'code'      => 500,
      'message'   => 'Block directory can not be deleted'
    ));

  }

  public function blocks_register_scripts($hook) {
    $blocks = Options::get_all();

    if ( $hook == 'post-new.php' || $hook == 'post.php' ) {
      foreach ($blocks as $block) {
        wp_register_script( str_replace( ' ', '-', $block->block_name ) , $block->js_url, array( 'wp-editor', 'wp-blocks', 'wp-element', 'wp-i18n' ), $block->block_version , true);
        wp_enqueue_script( str_replace( ' ', '-', $block->block_name ) );
      }
    }
  }


  public function blocks_register_styles() {
    global $pagenow;
    $blocks = Options::get_all();
    if ( $pagenow == 'post-new.php' || $pagenow == 'post.php' || !is_admin() ) {
      foreach ($blocks as $block) {
        /**
         * Use this filter in your functions.php or custom plugin 
         * to enable/disable styling per individual block or for all of them.
         */
        $disable_style = apply_filters( 'cloud_blocks_disable_style', false, $block );
        if ( !$disable_style && !empty( $block->css_url ) ) {
          wp_register_style( str_replace( ' ', '-', $block->block_name ) , $block->css_url, array(), $block->block_version);
          wp_enqueue_style( str_replace( ' ', '-', $block->block_name ) );
          
          if (is_admin() && isset( $block->editor_css ) && !empty( $block->editor_css ) ) {
            wp_register_style( str_replace( ' ', '-', $block->block_name ) . '-editor' , $block->editor_css, array(), $block->block_version);
            wp_enqueue_style( str_replace( ' ', '-', $block->block_name ) . '-editor' );
          }
        }
      }
    }
  }
}
