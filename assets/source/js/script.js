var store = new Vuex.Store({
  state: {
    notification: {},
    browsState: null,
    installedBlocks: fgcData.installedBlocks,
    searchQuery: null,
    opendOverlay: null
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
    },
    setSearchQuery(state, payload) {
      state.searchQuery = payload
    },
    openOverlay(state, payload) {
      state.opendOverlay = payload
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
    const q = this.getUrlParams('q') ? this.getUrlParams('q') : ''
    let query = {
      state: currentBrowsState,
      q
    }
    this.getBlocks(query)
    window.store.commit('setBrowsState', currentBrowsState)
    window.addEventListener('popstate', this.fetchBlocks)
  },
  watch: {
    currentBrowsFilter(newState) {
      const q = this.getUrlParams('q') ? this.getUrlParams('q') : ''
      window.store.dispatch('getInstalledBlocks')
      let query = {
        state: newState,
        q
      }
      this.getBlocks(query)
    },
    currentSearchQuery(q) {
      const currentBrowsState = this.getUrlParams('brows') ? this.getUrlParams('brows') : 'installed'
      window.store.dispatch('getInstalledBlocks')
      let query = {
        state: currentBrowsState,
        q
      }
      this.getBlocks(query)
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
    getBlocks(query) {
      let blocks = []
      let queryString = ''
      if (query.q !== null) {
        queryString = `q=${query.q}`
      }
      jQuery.get(`https://api.gutenbergcloud.org/blocks?${queryString}`, (res) => {
        res.rows.map(block => {
          jQuery.get(block.manifest, (blockManifest) => {
            const theBlock = {}
            theBlock.jsUrl = `https://unpkg.com/${block.name}@${block.version}/${block.config.js}`
            theBlock.cssUrl = `https://unpkg.com/${block.name}@${block.version}/${block.config.css}`
            theBlock.editorCss = block.config.editor ? `https://unpkg.com/${block.name}@${block.version}/${block.config.editor}` : null
            theBlock.infoUrl = `https://www.npmjs.com/package/${block.name}`
            theBlock.imageUrl = `https://unpkg.com/${block.name}@${block.version}/${block.config.screenshot}`
            theBlock.name = block.config.name
            theBlock.blockManifest = JSON.stringify(blockManifest)
            theBlock.version = block.version
            theBlock.packageName = block.name
            if (query.state == null || query.state == 'installed') {
              if (this.installedBlocks.length && this.installedBlocks.filter(b => b.package_name == theBlock.packageName).length) {
                blocks.push(theBlock)
              }
            } else {
              blocks.push(theBlock)
            }
          })
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
