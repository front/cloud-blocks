<?php
/*
Plugin Name: Gutenberg Cloud
Version: 1.0.0
Description: Your library of Gutenberg blocks in the cloud
Author: Frontkom - Fouad Yousefi
Author URI: https://frintkom.no
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
	define( 'FGC_NAME', 'gutenberg-cloud' );
}
// Plugin version .
if ( ! defined( 'FGC_VERSION' ) ) {
	define( 'FGC_VERSION', '1.0.0' );
}

// Require autoload
require_once  __DIR__ . '/vendor/autoload.php';

// Initiate plugin
new GutenbergCloud\GutenbergCloud;
