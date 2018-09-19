var app = new Vue({
  el: '#blockExplorer',
  data() {
    return {
      blocks: [
        {
          name: 'Hero section',
          jsUrl: 'https://unpkg.com/@frontkom/g-hero-section@0.5.0/build/index.js',
          cssUrl: 'https://unpkg.com/@frontkom/g-hero-section@0.5.0/build/style.css',
          infoUrl: 'https://www.npmjs.com/package/@frontkom/g-hero-section',
          imageUrl: 'https://codex.wordpress.org/images/7/7c/gutenberg_block_list.jpg',
          version: '2.7.0'
        },
        {
          name: 'Content in columns',
          jsUrl: 'https://unpkg.com/@frontkom/g-content-in-columns@0.1.1/build/index.js',
          cssUrl: 'https://unpkg.com/@frontkom/g-content-in-columns@0.1.1/build/style.css',
          infoUrl: 'https://www.npmjs.com/package/@frontkom/g-content-in-columns',
          imageUrl: 'https://image.slidesharecdn.com/wceu2018-180615075731/95/lets-build-a-gutenberg-block-wordcamp-europe-2018-1-638.jpg',
          version: '1.2.12'
        }
      ]
    }
  },
  mounted() {
  },
  methods: {
    installBlock(block) {
      console.log(block)
    }
  }
})
