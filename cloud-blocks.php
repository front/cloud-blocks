<?php
/*
Plugin Name: Cloud Blocks
Version: 1.0.1
Description: Your library of Gutenberg blocks in the cloud
Author: Frontkom
Author URI: https://frontkom.no
License: GPL2
*/

if ( ! defined( 'ABSPATH' ) ) {
	die;
}
// Plugin path.
if ( ! defined( 'FGC_PATH' ) ) {
	define( 'FGC_PATH', plugin_dir_path( __FILE__ ) );
}
// Plugin URL.
if ( ! defined( 'FGC_URL' ) ) {
	define( 'FGC_URL', plugin_dir_url( __FILE__ ) );
}
// Plugin base.
if ( ! defined( 'FGC_BASE' ) ) {
	define( 'FGC_BASE', plugin_basename( __FILE__ ) );
}
// Plugin name.
if ( ! defined( 'FGC_NAME' ) ) {
	define( 'FGC_NAME', 'cloud-blocks' );
}
// Plugin version .
if ( ! defined( 'FGC_VERSION' ) ) {
	define( 'FGC_VERSION', '1.0.0' );
}

// Require autoload
require_once  __DIR__ . '/vendor/autoload.php';

// Register text-domain for translations
add_action( 'plugins_loaded', 'fgc_register_textdomain' );
function fgc_register_textdomain() {
	load_plugin_textdomain( 'cloud-blocks', false, basename( dirname( __FILE__ ) ) . '/languages' );
}

// Register activation hook
register_activation_hook( __FILE__, [ 'CloudBlocks\Activator', 'init' ] );

// Initiate plugin
new CloudBlocks\CloudBlocks;
