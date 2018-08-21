<template>

  <div class="sort-options">
    Сортировать:
    <select @change="$emit('onSort', $event.target.value)">
      <option value="new" selected>новые</option>
      <option value="old">старые</option>
      <option value="title">по названию</option>
    </select>
  </div>
  
</template>


<script>

  export default {
    name: "Sort",
    data() {
      return {
        
      }
    }
  }

</script>


<style>

</style>