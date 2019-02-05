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
