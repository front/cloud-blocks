Vue.component('block-card', {
  props: ['block'],
  data() {
    return {
      installing: false,
      alreadyInstaleld: false,
      updateAvailable: false,
      currentVersion: null
    }
  },
  template: `
    <div class="theme">
      <div class="theme-screenshot" @click="openMoreDetails">
        <img :src="block.imageUrl" :alt="block.name">
        <div class="spinner installing-block" v-if="installing"></div>
      </div>

      <div v-if="alreadyInstaleld" class="notice inline notice-success notice-alt"><p>{{fgcData.strings.installed}}</p></div>

      <div v-if="updateAvailable" class="update-message notice inline notice-warning notice-alt">
        <p>{{fgcData.strings.update_available}} <button class="button-link" type="button" @click="updateBlock">{{fgcData.strings.update_now}}</button></p>
      </div>

      <span class="more-details" @click="openMoreDetails">{{fgcData.strings.show_more_details}}</span>

      <div class="theme-id-container">
        <h3 class="theme-name">{{ block.name }}</h3>
        <span v-if="blockManifest.author" class="block-author">{{fgcData.strings.by}}: 
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
              @click.prevent="deleteBlock">
              {{fgcData.strings.delete}}
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
        this.updateAvailable = !!window.store.state.installedBlocks.filter(b => {
          if (b.package_name == this.block.packageName) {
            return b.block_version < this.block.version
          }
        }).length
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
          this.incrementInstalls(this.block.packageName)
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
      this.installing = true
      let postData = this.block
      jQuery.ajax({
        type: 'POST',
        url: fgcData.ajaxUrl,
        data: {
          action: "fgc_delete_block",
          data: postData
        }
      })
        .done(res => {
          this.installing = false
          this.alreadyInstaleld = false
          this.decrementInstalls(this.block.packageName)
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
      let postData = this.block
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
      return JSON.parse(this.block.blockManifest)
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
