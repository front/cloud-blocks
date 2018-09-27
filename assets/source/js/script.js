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
            if (window.store.state.installedBlocks.length && window.store.state.installedBlocks.filter(b => b.package_name == theBlock.packageName).length) {
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
    }
  }
})
