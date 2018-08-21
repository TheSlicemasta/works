<template>
  <li :class="[{ 'studio': work.studio }, 'workitem']">

    <gallery 
      :id="'gallery-' + work.id"
      :images="work.screen" 
      :index="index" 
      :options="{ 
        hidePageScrollbars: false,
        closeOnEscape: true
      }" 
      @close="index = null" 
    />
    
    <div class="item">
      <img class="thumb lazy-loaded" v-lazy-load="work.image" width="470" height="470" :alt="work.title" />
      <div class="overlay">
        <h3>{{work.title}}</h3>
        <p class="comment" v-html="work.comment"></p>
        <p v-if="work.link" class="link">
          <a :href="work.link" target="_blank">{{work.link}}</a>
        </p>
        <p v-if="work.screen" class="screen"> 
          <a
            v-for="(image, imageIndex) in work.screen"
            :class="{'hide': imageIndex > 0}"
            :href="image"
            :key="imageIndex"
            @click.prevent="index = imageIndex"
            >Макет ({{work.screen.length}})</a> 
        </p>
        <p class="tag">{{work.tag}}, {{work.created}}</p>
      </div>
    </div>
  </li>
</template>


<script>
  import VueGallery from 'vue-gallery'

  export default {
    name: "Work",
    props: {
      params: {
        type: Object
      }
    },
    components: {
      'gallery': VueGallery
    },
    data() {
      return {
        work: {},
        index: null
      }
    },
    created() {
      this.work = this.params
    }
  }

</script>


<style>

.lazy-loaded {
  transition: opacity .5s ease-in;
  opacity: .3;
}

.lazy-loaded.lazy-load-progress {
  opacity: .3;
}

.lazy-loaded.lazy-load-success {
  opacity: 1;
}

.lazy-loaded.lazy-load-error {
  outline: 4px solid red;
}

</style>