# Hooks

## How to disable CSS for a single block


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
