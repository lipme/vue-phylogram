<template>
<g :class="classAttribute" :transform="transformAttribute"  @click="emitClick">
    <circle :r="type === 'inner' ? size/3 : size/2"
     :stroke-width="strokeWidth"
     :fill="fill"/>
    <text v-if="showLabel" :dx="optionsLabel.x"
    :dy="optionsLabel.y" :text-anchor="optionsLabel['text-anchor']"
    :font-size="optionsLabel['font-size']"
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
    },
    id: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      selected: false
    }
  },

  computed: {
    strokeWidth () {
      return this.size / 5
    },
    textClass () {
      if (this.circular && this.x > 180) {
        return 'reverse'
      }
      return 'normal'
    },
    showCircle () {
      return this.type !== 'inner'
    },
    classAttribute () {
      return 'node ' + this.type + ' ' + this.textClass + (this.selected ? ' selected' : '')
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
      let x = 1.5 * this.size

      if (this.circular && this.x > 180) {
        // transform = 'rotate(180)'
        anchor = 'end'
        x = -1.5 * this.size
      }

      return this.type === 'inner'
        ? { x: x, y: -this.size / 3, 'text-anchor': anchor, 'font-size': this.size + 3 + 'px' }
        : { x: x, y: this.size / 3, 'text-anchor': anchor, 'font-size': this.size + 3 + 'px' }
    },
    showLabel () {
      return this.label !== null && this.label !== '' && this.type !== 'root'
    }

  },
  methods: {
    emitClick (e) {
      console.log('click')
      this.selected = !this.selected

      this.$emit(this.selected ? 'selectNode' : 'deselectNode', this.id)
    }
  }
}
</script>

<style scoped>

circle {
  stroke:darkblue;
  fill:steelblue
}

.root circle {
  stroke: yellowgreen;
  fill: greenyellow;
}

.selected circle {
  transition: all 0.5s;
  fill: red;
  stroke: brown;
  transform: scale(1.5);
}

.selected text {
  fill: red;
  font-weight: bold;
  transform: scale(1.5);
}

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

text {
  fill: black;
  font-family: 'Helvetica Neue, Helvetica, sans-serif'
}

</style>
