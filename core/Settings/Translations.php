<?php

namespace GutenbergCloud\Settings;

// Contain translatable strings to be used in javascript files

class Translations {

  /**
   * Set translatable strings to be localized and used whithin javascript files.
   * 
   * @param 
   * @return array      Translatable strings
   * @since 0.1.0
   */
  public function strings() {
    return array(
      'block'                   => __( 'Block', 'gutenberg-cloud' ),
      'delete'                  => __( 'Delete', 'gutenberg-cloud' ),
      'installed'               => __( 'Installed', 'gutenberg-cloud' ),
      'popular'                 => __( 'Popular', 'gutenberg-cloud' ),
      'latest'                  => __( 'Latest', 'gutenberg-cloud' ),
      'most_used'               => __( 'Most used', 'gutenberg-cloud' ),
      'search_for_blocks'       => __( 'Search for blocks', 'gutenberg-cloud' ),
      'search_blocks'           => __( 'Search blocks...', 'gutenberg-cloud' ),
      'filter'                  => __( 'Filter', 'gutenberg-cloud' ),
      'update_now'              => __( 'Update now', 'gutenberg-cloud' ),
      'show_more_details'       => __( 'Show more details', 'gutenberg-cloud' ),
      'more_details'            => __( 'More details', 'gutenberg-cloud' ),
      'block_installed'         => __( 'have been installed successfully.', 'gutenberg-cloud' ),
      'block_uninstalled'       => __( 'have been uninstalled successfully.', 'gutenberg-cloud' ),
      'block_updated'           => __( 'have been updated successfully.', 'gutenberg-cloud' ),
    );
  }
}