Vue.component('explorer-filter', {
  componenets: ['filter-drawer'],
  data() {
    return {
      drawerFilterOpen: false,
      filterLinks: [
        {
          name: fgcData.strings.installed,
          slug: 'installed'
        },
        {
          name: fgcData.strings.popular,
          slug: 'popular'
        },
        {
          name: fgcData.strings.latest,
          slug: 'latest'
        },
        {
          name: fgcData.strings.most_used,
          slug: 'mostused'
        }
      ]
    }
  },
  template: `
    <div class="wp-filter g-blocks-filter hide-if-no-js">
      <div class="filter-count">
        <span class="count theme-count">{{ installedBlocksCount }}</span>
      </div>

      <ul class="filter-links">
        <li><a v-for="filter in filterLinks" :key="filter.slug" @click="filterLink(filter.slug)" :class="currentFilter(filter.slug)">{{ filter.name }}</a></li>
      </ul>

      <button type="button" id="searchFilter" class="button drawer-toggle" :aria-expanded="drawerFilterOpen" @click="drawerFilterOpen = !drawerFilterOpen">{{fgcData.strings.filter}}</button>

      <form class="search-form"><label class="screen-reader-text" for="wp-filter-search-input">{{fgcData.strings.search_for_blocks}}</label><input :placeholder="fgcData.strings.search_blocks" type="search" id="wp-filter-search-input" class="wp-filter-search"></form>

      <filter-drawer :style="{display: drawerFilterOpen ? 'block' : 'none'}"></filter-drawer>
    </div>
  `,
  mounted() {
  },
  methods: {
    filterLink(newFilter) {
      let currentState = window.location.search.replace(/\&brows[=a-z]*/, '')
      history.pushState({state: newFilter}, null, `${currentState}&brows=${newFilter}`)
      window.store.commit('setBrowsState', newFilter)
    },
    currentFilter(filter) {
      return window.store.state.browsState == filter ? 'current' : ''
    }
  },
  computed: {
    installedBlocksCount() {
      return window.store.state.installedBlocks.length
    }
  }
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
