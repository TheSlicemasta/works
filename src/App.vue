<template>
  <div id="content">

    <link rel="stylesheet" href="assets/css/style.css">

    <Works />

  </div>
</template>

<script>
	import Vue from 'vue'

	import LazyImageDirective from 'v-lazy-img'
	Vue.use(LazyImageDirective )
	
	import Works from './components/Works.vue'

  export default {
    name: 'app',
    components: {Works}
  }
</script>

<style>

</style>