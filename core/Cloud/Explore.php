<?php

namespace GutenbergCloud\Cloud;

class Explore {
 
	/**
	 * @param object $page_title
	 */
  public static $page_title;

	/**
	 * @param object $menu_slug
	 */
  public static $menu_slug;

	/**
	 * @param object $options_group
	 */
  public static $options_group;

	/**
	 * @param object $options_name
	 */
  public static $options_name;

  /**
   * Initiate things.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public static function init() {
    self::$page_title = ucwords( str_replace( '-', ' ', FGC_NAME ) );
    self::$menu_slug = FGC_NAME;
    self::$options_group = str_replace( '-', '_', FGC_NAME ) . '_options_group';
    self::$options_name = str_replace( '-', '_', FGC_NAME ) . '_options';;
    // Add menu 
    add_action( 'admin_menu', array( __class__, 'add_menu') );
  }

  /**
   * Add options menu page.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public static function add_menu() {
    add_menu_page( 
      esc_html__( self::$page_title, 'gutenberg-cloud' ),
      esc_html__( self::$page_title, 'gutenberg-cloud' ),
      'manage_options',
      self::$menu_slug,
      array( __class__, 'cloud_explorer' ),
      'dashicons-cloud',
      11
    );
  }

  
  /**
   * Settings page output.
   *
   * @since 0.1.0
   * @param
   * @return
   */
  public static function cloud_explorer() {
    ?>
    <div class="wrap">
      <h1><?php esc_html_e( self::$page_title, 'wp-redisearch' ); ?></h1>

      <div class="wp-filter hide-if-no-js">
        <div class="filter-count">
          <span class="count theme-count">15</span>
        </div>

        <ul class="filter-links">
          <li><a href="#" data-sort="featured" class="current" aria-current="page">Installed</a></li>
          <li><a href="#" data-sort="popular">Popular</a></li>
          <li><a href="#" data-sort="new">Latest</a></li>
          <li><a href="#" data-sort="favorites">Most downloaded</a></li>
        </ul>

        <button type="button" id="searchFilter" class="button drawer-toggle" aria-expanded="false">Filter</button>

        <form class="search-form"><label class="screen-reader-text" for="wp-filter-search-input">Search for blocks</label><input placeholder="Søk etter tema..." type="search" aria-describedby="live-search-desc" id="wp-filter-search-input" class="wp-filter-search"></form>

        <div class="filter-drawer">
          <div class="buttons">
            <button type="button" class="apply-filters button">Apply Filters<span></span></button>
            <button type="button" class="clear-filters button" aria-label="Clear all filters">Clear</button>
          </div>
          <fieldset class="filter-group">
            <legend>Subject</legend>
            <div class="filter-group-feature">
              <input type="checkbox" id="filter-id-blog" value="blog">
              <label for="filter-id-blog">Blog</label>
              <input type="checkbox" id="filter-id-e-commerce" value="e-commerce">
              <label for="filter-id-e-commerce">E-Commerce</label>
              <input type="checkbox" id="filter-id-education" value="education">
              <label for="filter-id-education">Education</label>
              <input type="checkbox" id="filter-id-entertainment" value="entertainment">
              <label for="filter-id-entertainment">News</label>
            </div>
          </fieldset>
          <fieldset class="filter-group">
            <legend>Features</legend>
            <div class="filter-group-feature">
              <input type="checkbox" id="filter-id-accessibility-ready" value="accessibility-ready">
              <label for="filter-id-accessibility-ready">Custom Colors</label>
              <input type="checkbox" id="filter-id-custom-background" value="custom-background">
              <label for="filter-id-custom-background">Editor style</label>
              <input type="checkbox" id="filter-id-custom-colors" value="custom-colors">
              <label for="filter-id-custom-colors">Full Width Template</label>
            </div>  
          </fieldset>
          <fieldset class="filter-group">
            <legend>Layout</legend>
            <div class="filter-group-feature">
              <input type="checkbox" id="filter-id-grid-layout" value="grid-layout">
              <label for="filter-id-grid-layout">Grid-layout</label>
              <input type="checkbox" id="filter-id-one-column" value="one-column">
              <label for="filter-id-one-column">One Column</label>
              <input type="checkbox" id="filter-id-two-columns" value="two-columns">
              <label for="filter-id-two-columns">Two Column</label>
              <input type="checkbox" id="filter-id-three-columns" value="three-columns">
              <label for="filter-id-three-columns">Responsive</label>
            </div>
          </fieldset>
          <div class="buttons">
            <button type="button" class="apply-filters button">Apply Filters<span></span></button>
            <button type="button" class="clear-filters button" aria-label="Clear all filters">Clear</button>
          </div>

        </div>
      </div>
    </div>
  <?php
  }
  
}
