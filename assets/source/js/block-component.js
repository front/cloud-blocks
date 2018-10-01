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
      <div class="theme-screenshot">
        <img :src="block.imageUrl" :alt="block.name">
        <div class="spinner installing-block" v-if="installing"></div>
      </div>

      <div v-if="alreadyInstaleld" class="notice inline notice-success notice-alt"><p>Installed</p></div>

      <div v-if="updateAvailable" class="update-message notice inline notice-warning notice-alt">
        <p>New version available. <button class="button-link" type="button" @click="updateBlock">Update now</button></p>
      </div>

      <span class="more-details">Show more details</span>

      <div class="theme-id-container">
        <h3 class="theme-name">{{ block.name }}</h3>
        <span class="block-version">Version: {{ currentVersion }}</span>

        <div class="theme-actions">
          <button class="button button-primary theme-install install-block-btn"
              v-if="currentBrowsState != 'installed' && !alreadyInstaleld"
              @click.prevent="installBlock">
              Install
          </button>
          <button class="button button-delete theme-install install-block-btn"
              v-else
              @click.prevent="deleteBlock">
              Delete
          </button>
          <a class="button preview install-theme-preview" :href="block.infoUrl" target="_blank">More details</a>
        </div>
      </div>

    </div>
  `,
  mounted() {
    this.currentVersion = this.block.version
    if (!!window.store.state.installedBlocks.filter(b => b.package_name == this.block.packageName).length) {
      this.alreadyInstaleld = this.currentBrowsState != 'installed'
      if (this.currentBrowsState == 'installed') {
        this.updateAvailable = !!window.store.state.installedBlocks.filter(b => b.block_version < this.block.version).length
        this.currentVersion = window.store.state.installedBlocks.filter(b => b.package_name == this.block.packageName)[0].block_version
      }
    }
  },
  methods: {
    installBlock() {
      this.installing = true
      let postData = this.block
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
          window.store.commit('setNotification', { text: `Block <b>${this.block.name}</b> have been installed successfully.`, class: 'show success' })
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
          window.store.dispatch('getInstalledBlocks')
          window.store.commit('setNotification', { text: `Block <b>${this.block.name}</b> have been uninstalled successfully.`, class: 'show success' })
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
          window.store.commit('setNotification', { text: `Block <b>${this.block.name}</b> have been updated successfully.`, class: 'show success' })
          console.log('Block Updated ', res.data)  
        })
        .fail(error => {
          this.installing = false
          console.log('There is some issues updating block: ', error)
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
    }
  },
  computed: {
    currentBrowsState() {
      return window.store.state.browsState
    }
  }
})
