var store = new Vuex.Store({
  state: {
    notification: {},
    browseState: null,
    installedBlocks: fgcData.installedBlocks,
    searchQuery: null,
    opendOverlay: null,
    blocksCount: 0
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
    const currentBrowseState = this.getUrlParams('browse') ? this.getUrlParams('browse') : 'installed'
    const q = this.getUrlParams('q') ? this.getUrlParams('q') : ''
    let query = {
      state: currentBrowseState,
      q
    }
    this.getBlocks(query)
    window.store.commit('setBrowseState', currentBrowseState)
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
            
            blocks.push(theBlock)
          }
        }
      } else if (query.state == 'local') {
        this.localBlocks()
      } else {
        jQuery.get(`https://api.gutenbergcloud.org/blocks?${queryString}`, (res) => {
          if (res.count) {
            window.store.commit('setBlocksCount', res.count)
          }
          for (const block of res.rows) {
            const theBlock = {}
            theBlock.jsUrl = `https://unpkg.com/${block.name}@${block.version}/${block.config.js}`
            theBlock.cssUrl = `https://unpkg.com/${block.name}@${block.version}/${block.config.css}`
            theBlock.editorCss = block.config.editor ? `https://unpkg.com/${block.name}@${block.version}/${block.config.editor}` : null
            theBlock.infoUrl = `https://www.npmjs.com/package/${block.name}`
            theBlock.imageUrl = `https://unpkg.com/${block.name}@${block.version}/${block.config.screenshot}`
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
    localBlocks() {
      jQuery.ajax({
        type: 'POST',
        url: fgcData.ajaxUrl,
        data: {
          action: "fgc_local_blocks"
        }
      })
        .done(res => {
          this.blocks = res.data
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
    }
  }
})
