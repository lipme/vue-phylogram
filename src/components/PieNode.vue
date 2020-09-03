<template>
<g v-if="data.length>0" :transform="transformAttribute">
     <path v-for="(d, i) in pieData" :key="d.data.label" :d="paths[i]" :fill="d.data.color">
        <title>{{d.data.label}} : {{d.data.value}}</title>
        <animateTransform attributeName="transform"
             type="scale"
             from="0 0"
             to="1 1"
             begin="0s"
             dur="1s"
        />
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
      default: () => { return [] },
      required: true,
      validator: function (data) {
        if (data.length === 0) { return false }
        for (let i = 0; i < data.length; i++) {
          if (!('value' in data[i])) {
            console.error("missing key 'value' in pie data")
            return false
          }
          if (!('color' in data[i])) {
            console.error("missing key 'color' in pie data")
            return false
          }
          if (!('label' in data[i])) {
            console.error("missing key 'label' in pie data")
            return false
          }
          if (!isFinite(data[i].value)) {
            console.error("The 'value' attribute in pie data must be a number")
            return false
          }
        }
        return true
      }
    }
  },

  computed: {
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
