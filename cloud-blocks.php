<?php
/*
Plugin Name: Cloud Blocks
Version: 1.1.5
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
	define( 'FGC_VERSION', '1.1.5' );
}

// Require autoload
require_once  __DIR__ . '/vendor/autoload.php';

// Register text-domain for translations
add_action( 'plugins_loaded', 'fgc_register_translations' );
function fgc_register_translations() {
	load_plugin_textdomain( 'cloud-blocks', false, basename( dirname( __FILE__ ) ) . '/languages' );
}

// Register activation hook
register_activation_hook( __FILE__, array( 'CloudBlocks\Activator', 'init' ) );

// Register CRON hooks
register_activation_hook( __FILE__, array( 'CloudBlocks\Blocks\Explore', 'cron_schedule' ) );
register_deactivation_hook( __FILE__, array( 'CloudBlocks\Blocks\Explore', 'cron_unschedule' ) );


// Initiate plugin
new CloudBlocks\CloudBlocks;
