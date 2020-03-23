<template>
  <div id="phylogram"><svg :width="width" :height="height"></svg></div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 500
    }
  }

}
</script>

<style>

</style>
