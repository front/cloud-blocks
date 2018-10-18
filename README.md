# Cloud Blocks

Your online library of Gutenberg blocks! Browse and discover new blocks, and install with a click.

### Description

No block collection plugins needed:
This is the only plugin you need to browse and install new blocks.

Reuse between platforms
Gutenberg blocks can be used in both Wordpress and Drupal

Code once, use everywhere: As Gutenberg blocks are CMS agnostic, we want to provide an ecosystem all systems can connect to.

Why Gutenberg Cloud? Installing an actual plugin/module for each block or block collection easily leads to managing lots of code that you don’t really need. It’s like having one app for each website you visit, instead of just installing a browser. With the block manager, you have a growing library at your fingertips, without the bloat.

### Installation
Install it just like any other plugin. It just works!

### Available hooks

`gutenberg_cloud_disable_style`

Disable blocks styling for single block:

```php
add_filter( 'gutenberg_cloud_disable_style', 'disable_custom_blocks_styles', 10, 2);
function disable_custom_blocks_styles( $exclude, $block ) {
	if ( $block->package_name == '@frontkom/g-content-in-columns') {
		return true;
	}
	return false;
}
```

Or disable for all custom blocks:

```php
add_filter( 'gutenberg_cloud_disable_style', 'disable_custom_blocks_styles', 10, 2);
function disable_custom_blocks_styles( $exclude, $block ) {
	return true;
}
```

### Frequently Asked Questions
**How do I add my own custom blocks to Gutenberg Cloud?**
Gutenberg Cloud blocks are really just normal Gutenberg blocks. They have a screenshot and some other meta, but follows the official standards. See https://gutenbergcloud.org/ for more information.

### Changelog


##### 1.0.1
* Fix: is_plugin_active() undefined fix
* Fix: Change strings functions to static

##### 1.0.0
* Initial plugin