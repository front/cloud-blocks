Vue.component('block-card', {
  props: ['block'],
  template: `
    <div class="theme">
      <div class="theme-screenshot">
        <img :src="block.imageUrl" :alt="block.name">
      </div>

      <span class="more-details">Show more details</span>

      <div class="theme-id-container">
        <h3 class="theme-name">{{ block.name }}</h3>
        <span class="block-version">Version: {{ block.version }}</span>

        <div class="theme-actions">
          <button class="button button-primary theme-install install-block-btn" @click.prevent="installBlock">Install</button>
          <a class="button preview install-theme-preview" :href="block.infoUrl" target="_blank">More details</a>
        </div>
      </div>

    </div>
  `,
  methods: {
    installBlock() {
      console.log(this.block.name)
    }
  }
})
