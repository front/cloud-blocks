var store = new Vuex.Store({
  state: {
    notification: {}
  },
  mutations: {
    setNotification(state, payload) {
      state.notification = payload
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
    this.getBlocks()
  },
  methods: {
    getBlocks() {
      jQuery.get('https://api.gutenbergcloud.org/blocks', (res) => {
        let blocks = []
        res.rows.map(block => {
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
