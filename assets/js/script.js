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
      currentVersion: null,
      fromCloud: null
    }
  },
  template: `
    <div class="theme">
      <div class="theme-screenshot" @click="openMoreDetails">
        <img :src="block.imageUrl || fgcData.defaultThumbnail" :alt="block.name">
        <div class="spinner installing-block" v-if="installing"></div>
      </div>

      <div v-if="currentBrowseState != 'installed' && alreadyInstaleld" class="notice inline notice-success notice-alt"><p>{{fgcData.strings.installed}}</p></div>

      <div v-if="currentBrowseState == 'installed' && isLocalBlock" class="notice inline notice-info notice-alt"><p>{{fgcData.strings.local_block}}</p></div>

      <div v-if="updateAvailable" class="update-message notice inline notice-warning notice-alt">
        <p>{{fgcData.strings.update_available}} <button class="button-link" type="button" @click="updateBlock">{{fgcData.strings.update_now}}</button></p>
      </div>

      <span class="more-details" @click="openMoreDetails">{{fgcData.strings.show_more_details}}</span>

      <div class="theme-id-container">
        <h3 class="theme-name">{{ block.name }}</h3>
        <span v-if="blockManifest && blockManifest.author" class="block-author">{{fgcData.strings.by}}: 
          <span v-if="typeof blockManifest.author == 'object'">
            {{ blockManifest.author.name }}
          </span>
          <span v-if="typeof blockManifest.author == 'string'">
            {{ blockManifest.author }}
          </span>
        </span>
        <span v-else class="block-version">{{fgcData.strings.version}}: {{ currentVersion }}</span>

        <div class="theme-actions">
          <button class="button button-primary theme-install install-block-btn"
              v-if="currentBrowseState != 'installed' && !alreadyInstaleld"
              @click.prevent="installBlock">
              {{fgcData.strings.install}}
          </button>
          <button class="button theme-install install-block-btn"
              v-else
              @click.prevent="uninstallBlock">
              {{fgcData.strings.uninstall}}
          </button>
          <a class="button button-primary" :href="blockUrl" target="_blank">{{fgcData.strings.homepage}}</a>
        </div>
      </div>

    </div>
  `,
  mounted() {
    this.currentVersion = this.block.version
    if (!!window.store.state.installedBlocks.filter(b => b.package_name == this.block.packageName).length) {
      this.alreadyInstaleld = this.currentBrowseState != 'installed'
      if (this.currentBrowseState == 'installed') {
        window.store.state.installedBlocks.map(b => {
          if (b.package_name == this.block.packageName && !this.isLocalBlock) {
            jQuery.get(`https://api.gutenbergcloud.org/blocks/${b.package_name}`, (res) => {
              if (res) {
                let block = res
                const theBlock = {}
                theBlock.jsUrl = `https://cdn.jsdelivr.net/npm/${block.name}@${block.version}/${block.config.js}`
                theBlock.cssUrl = `https://cdn.jsdelivr.net/npm/${block.name}@${block.version}/${block.config.css}`
                theBlock.editorCss = block.config.editor ? `https://cdn.jsdelivr.net/npm/${block.name}@${block.version}/${block.config.editor}` : null
                theBlock.infoUrl = `https://www.npmjs.com/package/${block.name}`
                theBlock.imageUrl = `https://cdn.jsdelivr.net/npm/${block.name}@${block.version}/${block.config.screenshot}`
                theBlock.name = block.config.name
                theBlock.blockManifest = JSON.stringify(block.package)
                theBlock.version = block.version
                theBlock.packageName = block.name
  
                if (res.version && b.block_version < res.version) {
                  this.updateAvailable = true
                  theBlock.availVersion = block.version
                }

                this.fromCloud = theBlock
                
                if (this.updateAvailable) {
                  this.setAvalVersion()
                }
              }
            })
          }
        })
        this.currentVersion = window.store.state.installedBlocks.filter(b => b.package_name == this.block.packageName)[0].block_version
      }
    }
  },
  methods: {
    installBlock() {
      this.installing = true
      let postData = this.block
      console.log('Install block', postData)
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
          if (!this.isLocalBlock) {
            this.incrementInstalls(this.block.packageName)
          }
          window.store.dispatch('getInstalledBlocks')
          window.store.commit('setNotification', { text: `${fgcData.strings.the_block} <b>${this.block.name}</b> ${fgcData.strings.block_installed}`, class: 'show success' })
          console.log('Block installed ', res.data)  
        })
        .fail(error => {
          this.installing = false
          console.log('There is some issues installing block: ', error);
        })
    },
    uninstallBlock() {
      this.installing = true
      let postData = this.block
      jQuery.ajax({
        type: 'POST',
        url: fgcData.ajaxUrl,
        data: {
          action: "fgc_uninstall_block",
          data: postData
        }
      })
        .done(res => {
          this.installing = false
          this.alreadyInstaleld = false
          if (!this.isLocalBlock) {
            this.decrementInstalls(this.block.packageName)
          }
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
      let postData = this.fromCloud
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
          window.store.commit('setNotification', { text: `${fgcData.strings.block} <b>${this.block.name}</b> ${fgcData.strings.block_updated}`, class: 'show success' })
          console.log('Block Updated ', res.data)  
        })
        .fail(error => {
          this.installing = false
          console.log('There is some issues updating block: ', error)
        })
    },
    setAvalVersion() {
      let postData = this.fromCloud
      jQuery.ajax({
        type: 'POST',
        url: fgcData.ajaxUrl,
        data: {
          action: "fgc_update_version",
          data: postData
        }
      })
        .done(res => {
          console.log('Available new version ', res.data)  
        })
        .fail(error => {
          console.log('There is some issues: ', error)
        })
    },
    incrementInstalls(packageName) {
      jQuery.ajax({
        type: 'POST',
        data: { increment: 1 },
        url: `https://api.gutenbergcloud.org/blocks/${packageName}`
      })
        .done(() => {
          console.log('Installation counter increased ')  
        })
        .fail(error => {
          console.log('Some errors occured white increasing number of installs: ', error)
        })
    },
    decrementInstalls(packageName) {
      jQuery.ajax({
        type: 'POST',
        data: { increment: -1 },
        url: `https://api.gutenbergcloud.org/blocks/${packageName}`
      })
        .done(() => {
          console.log('Installation counter decreased ')  
        })
        .fail(error => {
          console.log('Some errors occured white increasing number of installs: ', error)
        })
    },
    openMoreDetails() {
      window.store.commit('openOverlay', this.block)
    }
  },
  computed: {
    currentBrowseState() {
      return window.store.state.browseState
    },
    blockManifest() {
      let manifest = JSON.parse(this.block.blockManifest)
      return (typeof manifest == 'string' && manifest != '') ? JSON.parse(manifest) : manifest
    },
    isLocalBlock() {
      return (this.blockManifest && this.blockManifest.isLocal) || false
    },
    blockUrl() {
      if (this.blockManifest.homepage) {
        return this.blockManifest.homepage
      } else if (this.blockManifest.author && typeof this.blockManifest.author == 'object' && this.blockManifest.author.url) {
        return this.blockManifest.author.url
      } else {
        return `https://www.npmjs.com/package/${this.block.packageName}`
      }
    },
  }
})

Vue.component('block-details', {
  props: ['block'],
  data() {
    return {
      alreadyInstaleld: false,
      spinnerLoaded: false
    }
  },
  template: `
    <div class="theme-overlay" tabindex="0" role="dialog"><div class="theme-overlay">
      <div class="theme-backdrop"></div>
      <div class="theme-wrap wp-clearfix" role="document">
        <div class="theme-header">
          <button class="close dashicons dashicons-no" @click="closeOverlay"></button>
        </div>

        <div class="theme-about wp-clearfix">
          <div class="theme-screenshots">
            <div class="screenshot">
              <img :src="block.imageUrl || fgcData.defaultThumbnail" :alt="block.name">
              <div class="spinner installing-block" v-if="spinnerLoaded"></div>
            </div>
          </div>

          <div class="theme-info">
            <h2 class="theme-name">
              {{ block.name }}
                <span class="theme-version">{{fgcData.strings.version}}: {{ block.version }}</span>
            </h2>
            <p v-if="blockAuthor && authorUrl" class="theme-author">{{fgcData.strings.by}} <a :href="authorUrl" target="_blank">{{ blockAuthor }} </a></p>
            <p v-else-if="blockAuthor" class="theme-author">{{fgcData.strings.by}} {{ blockAuthor }}</p>

            
            <p class="theme-description">
              {{ blockManifest.description }}
            </p>

            <p class="theme-tags">
              <span>{{fgcData.strings.tags}}:</span>{{ blockTags }}
            </p>
            
          </div>
        </div>

        <div class="theme-actions">
          <div class="inactive-theme">
            <a v-if="alreadyInstaleld" @click.prevent="uninstallBlock" class="button activate">{{fgcData.strings.uninstall}}</a>
            <a v-else @click.prevent="installBlock" class="button activate">{{fgcData.strings.install}}</a>
            <a :href="blockUrl" target="_blank" class="button button-primary load-customize hide-if-no-customize">{{fgcData.strings.visit_homepage}}</a>
            <a v-if="isLocalBlock" class="button install-block-btn button-delete load-customize hide-if-no-customize" @click.prevent="deleteBlock">{{fgcData.strings.delete_block}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  mounted() {
    window.addEventListener('keyup', this.keypressEvent)
    if (!!window.store.state.installedBlocks.filter(b => b.package_name == this.block.packageName).length) {
      this.alreadyInstaleld = true
    }
  },
  computed: {
    blockManifest() {
      let manifest = JSON.parse(this.block.blockManifest)
      return (typeof manifest == 'string' && manifest != '') ? JSON.parse(manifest) : manifest
    },
    isLocalBlock() {
      return (this.blockManifest && this.blockManifest.isLocal) || false
    },
    blockUrl() {
      if (this.blockManifest.homepage) {
        return this.blockManifest.homepage
      } else if (this.blockManifest.author && typeof this.blockManifest.author == 'object' && this.blockManifest.author.url) {
        return this.blockManifest.author.url
      } else {
        return `https://www.npmjs.com/package/${this.block.packageName}`
      }
    },
    authorUrl() {
      if (this.blockManifest.author && typeof this.blockManifest.author == 'object' && this.blockManifest.author.url) {
        return this.blockManifest.author.url
      } else if (this.blockManifest.homepage) {
        return this.blockManifest.homepage
      } else {
        return `https://www.npmjs.com/package/${this.block.packageName}`
      }
    },
    blockAuthor() {
      if (this.blockManifest.author && typeof this.blockManifest.author == 'object' && this.blockManifest.author.name) {
        return this.blockManifest.author.name
      } else if (this.blockManifest.author && typeof this.blockManifest.author == 'string') {
        return this.blockManifest.author
      } else {
        return null
      }
    },
    blockTags() {
      return this.blockManifest ? this.blockManifest.keywords.join(', ') : ''
    }
  },
  methods: {
    keypressEvent(e) {
      if (e.keyCode === 27) {
       this.closeOverlay() 
      }
    },
    closeOverlay() {
      window.store.commit('openOverlay', null)
    },
    installBlock() {
      this.spinnerLoaded = true
      let postData = this.block
      console.log('Install block', postData)
      jQuery.ajax({
        type: 'POST',
        url: fgcData.ajaxUrl,
        data: {
          action: "fgc_install_block",
          data: postData
        }
      })
        .done(res => {
          this.alreadyInstaleld = true
          this.spinnerLoaded = false
          if (!this.isLocalBlock) {
            this.incrementInstalls(this.block.packageName)
          }
          window.store.dispatch('getInstalledBlocks')
          window.store.commit('setNotification', { text: `${fgcData.strings.the_block} <b>${this.block.name}</b> ${fgcData.strings.block_installed}`, class: 'show success' })
          console.log('Block installed ', res.data)  
        })
        .fail(error => {
          this.installing = false
          console.log('There is some issues installing block: ', error);
        })
    },
    deleteBlock() {
      this.spinnerLoaded = true
      // First we need to uninstall the block if already installed
      if (this.alreadyInstaleld) {
        this.uninstallBlock()
      }
      let postData = {
        block: this.block,
        nonce: fgcData.ajaxNonce
      }
      jQuery.ajax({
        type: 'POST',
        url: fgcData.ajaxUrl,
        data: {
          action: "fgc_delete_block",
          data: postData
        }
      })
        .done(res => {
          window.store.commit('setNotification', { text: `${fgcData.strings.the_block} <b>${this.block.name}</b> ${fgcData.strings.block_deleted}`, class: 'show success' })
          window.store.commit('setRefetchBlocks', true)
          this.closeOverlay()
          this.spinnerLoaded = false
          window.store.dispatch('getInstalledBlocks')
          console.log('Block removed ', res.data)  
        })
        .fail(error => {
          this.installing = false
          console.log('There is some issues installing block: ', error);
        })
    },
    uninstallBlock() {
      let postData = this.block
      jQuery.ajax({
        type: 'POST',
        url: fgcData.ajaxUrl,
        data: {
          action: "fgc_uninstall_block",
          data: postData
        }
      })
        .done(res => {
          this.alreadyInstaleld = false
          if (!this.isLocalBlock) {
            this.decrementInstalls(this.block.packageName)
          }
          window.store.dispatch('getInstalledBlocks')
          window.store.commit('setNotification', { text: `${fgcData.strings.block} <b>${this.block.name}</b> ${fgcData.strings.block_uninstalled}`, class: 'show success' })
          console.log('Block uninstalled ', res.data)  
        })
        .fail(error => {
          this.installing = false
          console.log('There is some issues uninstalling block: ', error)
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
    decrementInstalls(packageName) {
      jQuery.ajax({
        type: 'DELETE',
        url: `https://api.gutenbergcloud.org/blocks/${packageName}`
      })
        .done(() => {
          console.log('Installation counter decreased ')  
        })
        .fail(error => {
          console.log('Some errors occured white increasing number of installs: ', error)
        })
    },
  }
})
Vue.component('explorer-filter', {
  componenets: ['filter-drawer'],
  data() {
    return {
      drawerFilterOpen: false,
      searchQuery: null,
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
          name: fgcData.strings.local,
          slug: 'local'
        }
      ]
    }
  },
  template: `
    <div class="wp-filter g-blocks-filter hide-if-no-js">
      <div class="filter-count">
        <span class="count theme-count">{{ blocksCount }}</span>
      </div>

      <ul class="filter-links">
        <li><a v-for="filter in filterLinks" :key="filter.slug" @click="filterLink(filter.slug)" :class="currentFilter(filter.slug)">{{ filter.name }}</a></li>
      </ul>

      <button type="button" v-if="false" id="searchFilter" class="button drawer-toggle" :aria-expanded="drawerFilterOpen" @click="drawerFilterOpen = !drawerFilterOpen">{{fgcData.strings.filter}}</button>

      <form class="search-form" @submit.prevent="searchForBlock"><label class="screen-reader-text" for="wp-filter-search-input">{{fgcData.strings.search_for_blocks}}</label><input :placeholder="fgcData.strings.search_blocks" v-model="searchQuery" type="search" id="wp-filter-search-input" class="wp-filter-search"></form>

      <filter-drawer :style="{display: drawerFilterOpen ? 'block' : 'none'}"></filter-drawer>
    </div>
  `,
  mounted() {
    if (!window.store.state.installedBlocks.length && window.store.state.browseState != 'local') {
      this.filterLink('popular')
    }
  },
  methods: {
    filterLink(newFilter) {
      let currentState = window.location.search.replace(/\&browse[=a-z]*/, '')
      history.pushState({state: newFilter}, null, `${currentState}&browse=${newFilter}`)
      window.store.commit('setBrowseState', newFilter)
    },
    currentFilter(filter) {
      return window.store.state.browseState == filter ? 'current' : ''
    },
    searchForBlock() {
      let currentState = window.location.search.replace(/\&q[=a-z\-]*/, '')
      let query = this.searchQuery.replace(/\s+/g, '-').toLowerCase()
      history.pushState({state: query}, null, `${currentState}&q=${query}`)
      window.store.commit('setSearchQuery', query)
    }
  },
  computed: {
    blocksCount() {
      if (window.store.state.browseState === 'installed') {
        return window.store.state.installedBlocks.length
      } else {
        return window.store.state.blocksCount
      }
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
    browseState: null,
    installedBlocks: fgcData.installedBlocks,
    searchQuery: null,
    opendOverlay: null,
    blocksCount: 0,
    refetchBlocks: false
  },
  mutations: {
    setNotification(state, payload) {
      state.notification = payload
    },
    setBrowseState(state, payload) {
      state.browseState = payload
    },
    setInstalledBlocks(state, payload) {
      state.installedBlocks = payload
    },
    setSearchQuery(state, payload) {
      state.searchQuery = payload
    },
    openOverlay(state, payload) {
      state.opendOverlay = payload
    },
    setBlocksCount(state, payload) {
      state.blocksCount = payload
    },
    setRefetchBlocks(state, payload) {
      state.refetchBlocks = payload
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
    const currentBrowseState = this.getUrlParams('browse') ? this.getUrlParams('browse') : 'installed'
    const q = this.getUrlParams('q') ? this.getUrlParams('q') : ''
    let query = {
      state: currentBrowseState,
      q
    }
    this.getBlocks(query)
    window.store.commit('setBrowseState', currentBrowseState)
  },
  mounted() {
    window.addEventListener('popstate', this.fetchBlocks)
  },
  watch: {
    currentBrowseFilter(newState) {
      const q = this.getUrlParams('q') ? this.getUrlParams('q') : ''
      window.store.dispatch('getInstalledBlocks')
      let query = {
        state: newState,
        q
      }
      this.getBlocks(query)
    },
    currentSearchQuery(q) {
      const currentBrowseState = this.getUrlParams('browse') ? this.getUrlParams('browse') : 'installed'
      window.store.dispatch('getInstalledBlocks')
      let query = {
        state: currentBrowseState,
        q
      }
      this.getBlocks(query)
    },
    installedBlocks(newBlocksList, oldBlocksList) {
      const currentBrowseState = this.getUrlParams('browse') ? this.getUrlParams('browse') : 'installed'
      if (newBlocksList.length != oldBlocksList.length && currentBrowseState == 'installed') {
        this.blocks = this.blocks.filter(block => newBlocksList.some(bl => bl.package_name == block.packageName))
      }
    },
    refetchBlocks() {
      const currentBrowseState = this.getUrlParams('browse') ? this.getUrlParams('browse') : 'installed'
      let query = {
        state: currentBrowseState
      }
      this.getBlocks(query)
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
    getBlocks(query) {
      let blocks = []
      let queryString = ''
      if (query.q && query.q !== null) {
        queryString = `q=${query.q}`
      }
      if (query.state !== null) {
        queryString += `&order=${query.state}`
      }
      if (query.state == null || query.state == 'installed') {
        if (this.installedBlocks.length) {
          for (const block of this.installedBlocks) {
            const theBlock = {}
            theBlock.jsUrl = block.js_url
            theBlock.cssUrl = block.css_url
            theBlock.editorCss = block.editor_css
            theBlock.infoUrl = block.info_url
            theBlock.imageUrl = block.thumbnail
            theBlock.name = block.block_name
            theBlock.blockManifest = '\"' + block.block_manifest + '\"'
            theBlock.version = block.block_version
            theBlock.packageName = block.package_name
            
            if ((query.q && query.q !== null && (theBlock.name.toLowerCase().indexOf(query.q.toLowerCase()) > -1 || theBlock.packageName.toLowerCase().indexOf(query.q.toLowerCase()) > -1)) || !query.q ) {
              blocks.push(theBlock)
            }
          }
        }
      } else if (query.state == 'local') {
        this.localBlocks(query)
      } else {
        jQuery.get(`https://api.gutenbergcloud.org/blocks?${queryString}`, (res) => {
          if (res.count) {
            window.store.commit('setBlocksCount', res.count)
          }
          for (const block of res.rows) {
            const theBlock = {}
            theBlock.jsUrl = `https://cdn.jsdelivr.net/npm/${block.name}@${block.version}/${block.config.js}`
            theBlock.cssUrl = `https://cdn.jsdelivr.net/npm/${block.name}@${block.version}/${block.config.css}`
            theBlock.editorCss = block.config.editor ? `https://cdn.jsdelivr.net/npm/${block.name}@${block.version}/${block.config.editor}` : null
            theBlock.infoUrl = `https://www.npmjs.com/package/${block.name}`
            theBlock.imageUrl = `https://cdn.jsdelivr.net/npm/${block.name}@${block.version}/${block.config.screenshot}`
            theBlock.name = block.config.name
            theBlock.blockManifest = JSON.stringify(block.package)
            theBlock.version = block.version
            theBlock.packageName = block.name
            if (query.state == null || query.state == 'installed') {
              if (this.installedBlocks.length && this.installedBlocks.filter(b => b.package_name == theBlock.packageName).length) {
                blocks.push(theBlock)
              }
            } else {
              blocks.push(theBlock)
            }
          }
        })
      }
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
    },
    showUploader() {
      document.body.classList.toggle('show-upload-view')
    },
    localBlocks(query) {
      jQuery.ajax({
        type: 'POST',
        url: fgcData.ajaxUrl,
        data: {
          action: "fgc_local_blocks"
        }
      })
        .done(res => {
          if (res.data.length) {
            window.store.commit('setBlocksCount', res.data.length)
            window.store.commit('setRefetchBlocks', false)
          } else {
            window.store.commit('setBlocksCount', 0)
          }
          if (query.q && query.q !== null) {
            this.blocks = res.data.filter(block => block.name.toLowerCase().indexOf(query.q.toLowerCase()) > -1 || block.packageName.toLowerCase().indexOf(query.q.toLowerCase()) > -1)
          } else {
            this.blocks = res.data
          }
        })
        .fail(error => {
          console.log('There is some issues getting local blocks: ', error);
        })
    },
  },
  computed: {
    currentBrowseFilter() {
      return window.store.state.browseState
    },
    currentSearchQuery() {
      return window.store.state.searchQuery
    },
    installedBlocks() {
      return window.store.state.installedBlocks
    },
    openOverlay() {
      return window.store.state.opendOverlay
    },
    refetchBlocks() {
      return window.store.state.refetchBlocks
    }
  }
})
