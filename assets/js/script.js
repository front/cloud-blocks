Vue.component('admin-notice', {
  data() {
    return {
      activeTimeout: -1
    }
  },
  template: `
    <div
      :class="['fgc-notification', notification.class]"
      v-cloak>
      <p v-html="notification.text"></p>
    </div>
  `,
  watch: {
    isActive () {
      this.showingTimeout()
    }
  },
  mounted() {
    this.showingTimeout()
  },
  methods: {
    showingTimeout() {
      window.clearTimeout(this.activeTimeout)
      this.activeTimeout = window.setTimeout(() => {
        window.store.state.notification.class = ''
        this.isShowing = false
      }, 4000)
    }
  },
  computed: {
    isActive() {
      return window.store.state.notification.text
    },
    notification() {
      return window.store.state.notification
    }
  }
})

Vue.component('block-card', {
  props: ['block'],
  data() {
    return {
      installing: false,
      alreadyInstaleld: false,
      updateAvailable: false,
      currentVersion: null
    }
  },
  template: `
    <div class="theme">
      <div class="theme-screenshot">
        <img :src="block.imageUrl" :alt="block.name">
        <div class="spinner installing-block" v-if="installing"></div>
      </div>

      <div v-if="alreadyInstaleld" class="notice inline notice-success notice-alt"><p>{{fgcData.strings.installed}}</p></div>

      <div v-if="updateAvailable" class="update-message notice inline notice-warning notice-alt">
        <p>New version available. <button class="button-link" type="button" @click="updateBlock">{{fgcData.strings.update_now}}</button></p>
      </div>

      <span class="more-details" @click="openMoreDetails">{{fgcData.strings.show_more_details}}</span>

      <div class="theme-id-container">
        <h3 class="theme-name">{{ block.name }}</h3>
        <span class="block-version">Version: {{ currentVersion }}</span>

        <div class="theme-actions">
          <button class="button button-primary theme-install install-block-btn"
              v-if="currentBrowsState != 'installed' && !alreadyInstaleld"
              @click.prevent="installBlock">
              Install
          </button>
          <button class="button theme-install install-block-btn"
              v-else
              @click.prevent="deleteBlock">
              {{fgcData.strings.delete}}
          </button>
          <a class="button preview install-theme-preview" :href="block.infoUrl" target="_blank">{{fgcData.strings.more_details}}</a>
        </div>
      </div>

    </div>
  `,
  mounted() {
    this.currentVersion = this.block.version
    if (!!window.store.state.installedBlocks.filter(b => b.package_name == this.block.packageName).length) {
      this.alreadyInstaleld = this.currentBrowsState != 'installed'
      if (this.currentBrowsState == 'installed') {
        this.updateAvailable = !!window.store.state.installedBlocks.filter(b => {
          if (b.package_name == this.block.packageName) {
            return b.block_version < this.block.version
          }
        }).length
        this.currentVersion = window.store.state.installedBlocks.filter(b => b.package_name == this.block.packageName)[0].block_version
      }
    }
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
          this.incrementInstalls(this.block.packageName)
          window.store.dispatch('getInstalledBlocks')
          window.store.commit('setNotification', { text: `${fgcData.strings.block} <b>${this.block.name}</b> ${fgcData.strings.block_installed}`, class: 'show success' })
          console.log('Block installed ', res.data)  
        })
        .fail(error => {
          this.installing = false
          console.log('There is some issues installing block: ', error);
        })
    },
    deleteBlock() {
      this.installing = true
      let postData = this.block
      jQuery.ajax({
        type: 'POST',
        url: fgcData.ajaxUrl,
        data: {
          action: "fgc_delete_block",
          data: postData
        }
      })
        .done(res => {
          this.installing = false
          this.alreadyInstaleld = false
          window.store.dispatch('getInstalledBlocks')
          window.store.commit('setNotification', { text: `${fgcData.strings.block} <b>${this.block.name}</b> ${fgcData.strings.block_uninstalled}`, class: 'show success' })
          console.log('Block uninstalled ', res.data)  
        })
        .fail(error => {
          this.installing = false
          console.log('There is some issues uninstalling block: ', error)
        })
    },
    updateBlock() {
      this.installing = true
      let postData = this.block
      jQuery.ajax({
        type: 'POST',
        url: fgcData.ajaxUrl,
        data: {
          action: "fgc_update_block",
          data: postData
        }
      })
        .done(res => {
          this.installing = false
          this.updateAvailable = false
          this.currentVersion = this.block.version
          window.store.dispatch('getInstalledBlocks')
          window.store.commit('setNotification', { text: `${fgcData.strings.block} <b>${this.block.name}</b> ${fgcData.strigns.block_updated}`, class: 'show success' })
          console.log('Block Updated ', res.data)  
        })
        .fail(error => {
          this.installing = false
          console.log('There is some issues updating block: ', error)
        })
    },
    incrementInstalls(packageName) {
      jQuery.ajax({
        type: 'PUT',
        url: `https://api.gutenbergcloud.org/blocks/${packageName}`
      })
        .done(() => {
          console.log('Installation counter increased ')  
        })
        .fail(error => {
          console.log('Some errors occured white increasing number of installs: ', error)
        })
    },
    openMoreDetails() {
      if (this.block.infoUrl) {
        window.open(this.block.infoUrl, '_blank')
      }
    }
  },
  computed: {
    currentBrowsState() {
      return window.store.state.browsState
    }
  }
})

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

var store = new Vuex.Store({
  state: {
    notification: {},
    browsState: null,
    installedBlocks: fgcData.installedBlocks
  },
  mutations: {
    setNotification(state, payload) {
      state.notification = payload
    },
    setBrowsState(state, payload) {
      state.browsState = payload
    },
    setInstalledBlocks(state, payload) {
      state.installedBlocks = payload
    }
  },
  actions: {
    getInstalledBlocks(store) {
      jQuery.ajax({
        type: 'GET',
        url: fgcData.ajaxUrl,
        data: {
          action: "fgc_get_all_blocks"
        }
      })
        .done(res => {
          store.commit('setInstalledBlocks', res.data)
        })
        .fail(error => {
          console.log('There is some issues installing block: ', error);
        })
    }
  }
})


var app = new Vue({
  el: '#blockExplorer',
  data() {
    return {
      blocks: []
    }
  },
  created() {
    window.store.dispatch('getInstalledBlocks')
  },
  mounted() {
    const currentBrowsState = this.getUrlParams('brows') ? this.getUrlParams('brows') : 'installed'
    this.getBlocks(currentBrowsState)
    window.store.commit('setBrowsState', currentBrowsState)
    window.addEventListener('popstate', this.fetchBlocks)
  },
  watch: {
    currentBrowsFilter(newState) {
      window.store.dispatch('getInstalledBlocks')
      this.getBlocks(newState)
    },
    installedBlocks(newBlocksList, oldBlocksList) {
      const currentBrowsState = this.getUrlParams('brows') ? this.getUrlParams('brows') : 'installed'
      if (newBlocksList.length != oldBlocksList.length && currentBrowsState == 'installed') {
        this.blocks = this.blocks.filter(block => newBlocksList.some(bl => bl.package_name == block.packageName))
      }
    }
  },
  methods: {
    fetchBlocks(e) {
      let state = null
      if (e.state) {
        state = e.state.state
      }
      this.getBlocks(state)
    },
    getBlocks(brows) {
      let blocks = []
      jQuery.get('https://api.gutenbergcloud.org/blocks', (res) => {
        res.rows.map(block => {
          const theBlock = {}
          theBlock.jsUrl = `https://unpkg.com/${block.name}@${block.version}/${block.config.js}`
          theBlock.cssUrl = `https://unpkg.com/${block.name}@${block.version}/${block.config.css}`
          theBlock.infoUrl = `https://www.npmjs.com/package/${block.name}`
          theBlock.imageUrl = `https://unpkg.com/${block.name}@${block.version}/${block.config.screenshot}`
          theBlock.name = block.config.name
          theBlock.version = block.version
          theBlock.packageName = block.name
          if (brows == null || brows == 'installed') {
            if (this.installedBlocks.length && this.installedBlocks.filter(b => b.package_name == theBlock.packageName).length) {
              blocks.push(theBlock)
            }
          } else {
            blocks.push(theBlock)
          }
        })
      })
      this.blocks = blocks
    },
    getUrlParams(name, url) {
      if (!url) url = window.location.href
      name = name.replace(/[\[\]]/g, '\\$&')
      let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
      let results = regex.exec(url)
      if (!results) return null
      if (!results[2]) return ''
      return decodeURIComponent(results[2].replace(/\+/g, ' '))
    }
  },
  computed: {
    currentBrowsFilter() {
      return window.store.state.browsState
    },
    installedBlocks() {
      return window.store.state.installedBlocks
    }
  }
})
