<template>
  <g><node v-for="node in nodes" :key="node.id">
  </node><g>
</template>

<script>
export default {

  props: {
    nodes: {
      type: Array,
      default: () => []
    }
  }

}
</script>

<style>

</style>
