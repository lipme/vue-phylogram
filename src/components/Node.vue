<template>
<g :class="classAttribute" :transform="transformAttribute">
    <circle v-if="showCircle" :r="size/2" :stroke="stroke"
     :stroke-width="stroke_width"
     :fill="fill"/>
    <text v-if="showLabel" :dx="optionsLabel.x"
    :dy="optionsLabel.y" :text-anchor="optionsLabel['text-anchor']" :fill="optionsLabel.fill"
    :font-family="optionsLabel['font-family']" :font-size="optionsLabel['font-size']">{{this.label}}</text></g>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 6
    },
    stroke_width: {
      type: Number,
      default: 2
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: ''
    }
  },

  computed: {
    showCircle () {
      return this.type !== 'inner'
    },
    stroke () {
      return this.type === 'root' ? 'yellowGreen' : '#369'
    },
    fill () {
      return this.type === 'root' ? 'greenYellow' : 'steelblue'
    },
    classAttribute () {
      return 'node ' + this.type
    },
    transformAttribute () {
      return 'translate(' + this.y + ' ' + this.x + ')'
    },
    optionsLabel () {
      return this.type === 'inner'
        ? { x: -this.size - this.size / 4, y: -this.size / 3, 'text-anchor': 'end', 'font-size': this.size + 3 + 'px', fill: 'black', 'font-family': 'Helvetica Neue, Helvetica, sans-serif' }
        : { x: this.size + this.size / 4, y: this.size / 3, 'text-anchor': 'start', 'font-size': this.size + 3 + 'px', fill: 'black', 'font-family': 'Helvetica Neue, Helvetica, sans-serif' }
    },
    showLabel () {
      return this.label !== null && this.label !== '' && this.type !== 'root'
    }

  }
}
</script>

<style>

</style>
