<template>
<g :class="classAttribute" :transform="transformAttribute">
    <circle v-if="showCircle" :r="size/2" :stroke="stroke"
     :stroke-width="stroke_width"
     :fill="fill"/>
    <text v-if="showLabel" :dx="optionsLabel.x"
    :dy="optionsLabel.y" :text-anchor="optionsLabel['text-anchor']" :fill="optionsLabel.fill"
    :font-family="optionsLabel['font-family']" :font-size="optionsLabel['font-size']"
    :transform="optionsLabel.transform" >{{this.label}}
    </text></g>
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
    },
    circular: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    textClass () {
      if (this.circular && this.x > 180) {
        return 'reverse'
      }
      return 'normal'
    },
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
      return 'node ' + this.type + ' ' + this.textClass
    },
    transformAttribute () {
      if (this.circular === false) {
        return 'translate(' + this.y + ' ' + this.x + ')'
      } else {
        return 'rotate(' + (this.x - 90) + ')translate(' + this.y + ')'
      }
    },
    optionsLabel () {
      // const transform = ''
      let anchor = 'start'
      let x = this.size - this.size / 4

      if (this.circular && this.x > 180) {
        // transform = 'rotate(180)'
        anchor = 'end'
        x = -this.size - this.size / 4
      }

      return this.type === 'inner'
        ? { x: x, y: -this.size / 3, 'text-anchor': anchor, 'font-size': this.size + 3 + 'px', fill: 'black', 'font-family': 'Helvetica Neue, Helvetica, sans-serif' }
        : { x: x, y: this.size / 3, 'text-anchor': anchor, 'font-size': this.size + 3 + 'px', fill: 'black', 'font-family': 'Helvetica Neue, Helvetica, sans-serif' }
    },
    showLabel () {
      return this.label !== null && this.label !== '' && this.type !== 'root'
    }

  }
}
</script>

<style scoped>

circle:hover {
  transition: all 0.5s;
  transform: scale(1.5);
}

text:hover {
  transition: all 0.5s;
  transform: scale(1.5);
}

.reverse text:hover {
  transition: all 0.5s;
  transform: scale(1.5) rotate(180deg);
}

.reverse text {
  transform: rotate(180deg);
}
</style>
