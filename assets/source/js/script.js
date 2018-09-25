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
