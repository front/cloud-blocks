<?php

namespace CloudBlocks\Settings;

// Contain translatable strings to be used in javascript files

class Translations {

  /**
   * Set translatable strings to be localized and used whithin javascript files.
   * 
   * @param 
   * @return array      Translatable strings
   * @since 1.0.0
   */
  public static function strings() {
    return array(
      'block'                   => __( 'Block', 'cloud-blocks' ),
      'the_block'               => __( 'The block', 'cloud-blocks' ),
      'delete'                  => __( 'Delete', 'cloud-blocks' ),
      'install'                 => __( 'Install', 'cloud-blocks' ),
      'installed'               => __( 'Installed', 'cloud-blocks' ),
      'popular'                 => __( 'Popular', 'cloud-blocks' ),
      'latest'                  => __( 'Latest', 'cloud-blocks' ),
      'most_used'               => __( 'Most used', 'cloud-blocks' ),
      'search_for_blocks'       => __( 'Search for blocks', 'cloud-blocks' ),
      'search_blocks'           => __( 'Search blocks...', 'cloud-blocks' ),
      'filter'                  => __( 'Filter', 'cloud-blocks' ),
      'update_now'              => __( 'Update now', 'cloud-blocks' ),
      'show_more_details'       => __( 'Show more details', 'cloud-blocks' ),
      'more_details'            => __( 'More details', 'cloud-blocks' ),
      'block_installed'         => __( 'have been installed successfully.', 'cloud-blocks' ),
      'block_uninstalled'       => __( 'have been uninstalled successfully.', 'cloud-blocks' ),
      'block_updated'           => __( 'have been updated successfully.', 'cloud-blocks' ),
      'update_available'        => __( 'New version available.', 'cloud-blocks' ),
      'version'                 => __( 'Version', 'cloud-blocks' ),
    );
  }
}