Vue.component('admin-notice', {
  data() {
    return {
      activeTimeout: -1
    }
  },
  template: `
    <div
      :class="['fgc-notification', notification.class]"
      v-cloak>
      <p v-html="notification.text"></p>
    </div>
  `,
  watch: {
    isActive () {
      this.showingTimeout()
    }
  },
  mounted() {
    this.showingTimeout()
  },
  methods: {
    showingTimeout() {
      window.clearTimeout(this.activeTimeout)
      this.activeTimeout = window.setTimeout(() => {
        window.store.state.notification.class = ''
        this.isShowing = false
      }, 4000)
    }
  },
  computed: {
    isActive() {
      return window.store.state.notification.text
    },
    notification() {
      return window.store.state.notification
    }
  }
})
