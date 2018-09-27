var store = new Vuex.Store({
  state: {
    notification: {},
    browsState: null
  },
  mutations: {
    setNotification(state, payload) {
      state.notification = payload
    },
    setBrowsState(state, payload) {
      state.browsState = payload
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
  mounted() {
    const currentBrowsState = this.getUrlParams('brows') ? this.getUrlParams('brows') : 'installed'
    this.getBlocks(currentBrowsState)
    window.store.commit('setBrowsState', currentBrowsState)
    window.addEventListener('popstate', this.fetchBlocks)
  },
  watch: {
    currentBrowsFilter (newState) {
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
            if (fgcData.installedBlocks && fgcData.installedBlocks.length && !!fgcData.installedBlocks.filter(b => b.package_name == theBlock.packageName).length) {
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
