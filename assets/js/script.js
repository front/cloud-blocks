Vue.component('block-card', {
  props: ['block'],
  data() {
    return {
      installing: false,
      alreadyInstaleld: false
    }
  },
  template: `
    <div :class="[alreadyInstaleld ? 'block-installed' : '', 'theme']">
      <div class="theme-screenshot">
        <img :src="block.imageUrl" :alt="block.name">
        <div class="spinner installing-block" v-if="installing"></div>
      </div>

      <span class="more-details">Show more details</span>

      <div class="theme-id-container">
        <h3 class="theme-name">{{ block.name }}</h3>
        <span class="block-version">Version: {{ block.version }}</span>

        <div class="theme-actions">
          <button class="button button-primary theme-install install-block-btn"
              v-if="!alreadyInstaleld"
              @click.prevent="installBlock">
              Install
          </button>
          <a class="button preview install-theme-preview" :href="block.infoUrl" target="_blank">More details</a>
        </div>
      </div>

    </div>
  `,
  mounted() {
    this.alreadyInstaleld = !!fgcData.installedBlocks.filter(b => b.package_name == this.block.packageName).length
  },
  methods: {
    installBlock() {
      this.installing = true
      let postData = this.block
      jQuery.ajax({
        type: 'POST',
        url: fgcData.ajaxUrl,
        data: {
          action: "fgc_install_block",
          data: postData
        }
      })
        .done(res => {
          this.installing = false
          this.alreadyInstaleld = true
          console.log('Block installed ', res.data)  
        })
        .fail(error => {
          this.installing = false
          console.log('There is some issues installing block: ', error);
        })
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
        <li><a href="#" data-sort="favorites">Most used</a></li>
      </ul>

      <button type="button" id="searchFilter" class="button drawer-toggle" :aria-expanded="drawerFilterOpen" @click="drawerFilterOpen = !drawerFilterOpen">Filter</button>

      <form class="search-form"><label class="screen-reader-text" for="wp-filter-search-input">Search for blocks</label><input placeholder="Search blocks..." type="search" aria-describedby="live-search-desc" id="wp-filter-search-input" class="wp-filter-search"></form>

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
          packageName: '@frontkom/g-hero-section',
          jsUrl: 'https://unpkg.com/@frontkom/g-hero-section@0.5.0/build/index.js',
          cssUrl: 'https://unpkg.com/@frontkom/g-hero-section@0.5.0/build/style.css',
          infoUrl: 'https://www.npmjs.com/package/@frontkom/g-hero-section',
          imageUrl: 'https://codex.wordpress.org/images/7/7c/gutenberg_block_list.jpg',
          version: '2.7.0'
        },
        {
          name: 'Content in columns',
          packageName: '@frontkom/g-content-in-columns',
          jsUrl: 'https://unpkg.com/@frontkom/g-content-in-columns@0.1.1/build/index.js',
          cssUrl: 'https://unpkg.com/@frontkom/g-content-in-columns@0.1.1/build/style.css',
          infoUrl: 'https://www.npmjs.com/package/@frontkom/g-content-in-columns',
          imageUrl: 'https://image.slidesharecdn.com/wceu2018-180615075731/95/lets-build-a-gutenberg-block-wordcamp-europe-2018-1-638.jpg',
          version: '1.2.12'
        }
      ],
      blo: []
    }
  },
  mounted() {
    this.getBlocks()
  },
  methods: {
    getBlocks() {
      jQuery.get('https://api.gutenbergcloud.org/blocks', (res) => {
        let blocks = []
        res.rows.map(block => {
          console.log(block)
          const theBlock = {}
          theBlock.jsUrl = `https://unpkg.com/${block.name}@${block.version}/${block.config.js}`
          theBlock.cssUrl = `https://unpkg.com/${block.name}@${block.version}/${block.config.css}`
          theBlock.infoUrl = `https://www.npmjs.com/package/${block.name}`
          theBlock.imageUrl = `https://unpkg.com/${block.name}@${block.version}/${block.config.screenshot}`
          theBlock.name = block.config.name
          theBlock.version = block.version
          theBlock.packageName = block.name
          blocks.push(theBlock)
        })
        this.blocks = blocks
      })
    }
  },
  computed: {
  }
})
