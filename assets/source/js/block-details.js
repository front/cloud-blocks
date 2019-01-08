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