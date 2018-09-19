Vue.component('block-card', {
  props: ['block'],
  template: `
    <div class="theme">
      <div class="theme-screenshot">
        <img :src="block.imageUrl" :alt="block.name">
      </div>

      <span class="more-details">Show more details</span>

      <div class="theme-id-container">
        <h3 class="theme-name">{{ block.name }}</h3>
        <span class="block-version">Version: {{ block.version }}</span>

        <div class="theme-actions">
          <button class="button button-primary theme-install install-block-btn" @click.prevent="installBlock">Install</button>
          <a class="button preview install-theme-preview" :href="block.infoUrl" target="_blank">More details</a>
        </div>
      </div>

    </div>
  `,
  methods: {
    installBlock() {
      console.log(this.block.name)
    }
  }
})

Vue.component('explorer-filter', {
  componenets: ['filter-drawer'],
  data() {
    return {
      drawerFilterOpen: false
    }
  },
  template: `
    <div class="wp-filter g-blocks-filter hide-if-no-js">
      <div class="filter-count">
        <span class="count theme-count">15</span>
      </div>

      <ul class="filter-links">
        <li><a href="#" data-sort="featured" class="current" aria-current="page">Installed</a></li>
        <li><a href="#" data-sort="popular">Popular</a></li>
        <li><a href="#" data-sort="new">Latest</a></li>
        <li><a href="#" data-sort="favorites">Most downloaded</a></li>
      </ul>

      <button type="button" id="searchFilter" class="button drawer-toggle" :aria-expanded="drawerFilterOpen" @click="drawerFilterOpen = !drawerFilterOpen">Filter</button>

      <form class="search-form"><label class="screen-reader-text" for="wp-filter-search-input">Search for blocks</label><input placeholder="Søk etter tema..." type="search" aria-describedby="live-search-desc" id="wp-filter-search-input" class="wp-filter-search"></form>

      <filter-drawer :style="{display: drawerFilterOpen ? 'block' : 'none'}"></filter-drawer>
    </div>
  `
})


Vue.component('filter-drawer', {
  template: `
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
  `
})

var app = new Vue({
  el: '#blockExplorer',
  data() {
    return {
      blocks: [
        {
          name: 'Hero section',
          jsUrl: 'https://unpkg.com/@frontkom/g-hero-section@0.5.0/build/index.js',
          cssUrl: 'https://unpkg.com/@frontkom/g-hero-section@0.5.0/build/style.css',
          infoUrl: 'https://www.npmjs.com/package/@frontkom/g-hero-section',
          imageUrl: 'https://codex.wordpress.org/images/7/7c/gutenberg_block_list.jpg',
          version: '2.7.0'
        },
        {
          name: 'Content in columns',
          jsUrl: 'https://unpkg.com/@frontkom/g-content-in-columns@0.1.1/build/index.js',
          cssUrl: 'https://unpkg.com/@frontkom/g-content-in-columns@0.1.1/build/style.css',
          infoUrl: 'https://www.npmjs.com/package/@frontkom/g-content-in-columns',
          imageUrl: 'https://image.slidesharecdn.com/wceu2018-180615075731/95/lets-build-a-gutenberg-block-wordcamp-europe-2018-1-638.jpg',
          version: '1.2.12'
        }
      ]
    }
  },
  mounted() {
  },
  methods: {
    installBlock(block) {
      console.log(block)
    }
  }
})
