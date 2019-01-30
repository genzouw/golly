<template>
  <div class="row">
    <div class="col ml-0 mr-0">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <router-link to="/">
          <a class="navbar-brand" href="/">Golly</a>
        </router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        </button>
      </nav>

      <router-view/>

        <footer id="footer"></footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      'serviceName': 'Golly'
    }
  },
  mounted: function () {
    var to = this.$route
    if (to.meta.title) {
      document.title = to.meta.title + ' - ' + this.serviceName
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.meta.title) {
        document.title = to.meta.title + ' - ' + this.serviceName
      }
    }
  }
}
</script>
