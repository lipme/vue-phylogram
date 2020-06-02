<template>
<g :class="classAttribute" :transform="transformAttribute" style="transition:transform 0.5s ease-out">
     <path v-for="(d, i) in pieData" :key="d.data.label" :d="paths[i]" :fill="d.data.color">
        <title>{{d.data.label}} : {{d.data.value}}</title>
     </path>
    </g>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'pieNode',
  props: {
    size: {
      type: Number,
      default: 6
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    circular: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => { return [] }
    }
  },

  computed: {
    strokeWidth () {
      return this.size / 5
    },
    classAttribute () {
      return 'pie ' + this.type
    },
    transformAttribute () {
      if (this.circular === false) {
        return 'translate(' + this.y + ' ' + this.x + ')'
      } else {
        return 'rotate(' + (this.x - 90) + ')translate(' + this.y + ')'
      }
    },
    arcFunction () {
      return d3.arc().innerRadius(0).outerRadius(this.size / 2)
    },
    pieData () {
      const pie = d3.pie().value(d => d.value).sort(null)
      return pie(this.data)
    },
    paths () {
      const arc = this.arcFunction
      return this.pieData.map(d => { return arc(d) })
    }
  }
}
</script>

<style scoped>
path:hover {
  transition: all 0.5s;
  transform: scale(1.5);
}
</style>
