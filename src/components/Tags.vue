<template>

  <div class="filter-options">
    Теги:
    <a v-for="tag in tags" :key="tag" :data-group="tag" href="#" @click.prevent="clickTag" :class="{'active': active === tag}">{{tag}}</a>
  </div>

</template>


<script>

  export default {
    name: "Tags",
    props: {
      tags: {
        type: Array
      }
    },
    data() {
      return {
        active: ''   
      }
    },
    methods: {
      clickTag(event) {
        let tag = event.target.dataset.group

        if ( this.active === tag ) {
          this.active = ''
        } else {
          this.active = tag
        }          
        
        this.$emit('onSelectTag', this.active)
      }

    }
  }

</script>


<style>

</style>