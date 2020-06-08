<template>
  <g
    :class="classAttribute"
    :transform="transformAttribute"
  >
    <rect
      v-if="isSurrounded"
      :fill="background"
      :fill-opacity="rectFillOpacity"
      :x="rectX"
      :y="rectY"
      :height="fontSize+rectMargin"
      :stroke-width="rectBorderWidth"
      :stroke="borderColor"
      :width="rectWidth"
    >
     <animateTransform attributeName="transform"
             type="scale"
             from="0 0"
             to="1 1"
             begin="0s"
             dur="1s"
        />
    </rect>
    <text
      ref="text"
      :dx="optionsLabel.x"
      :dy="optionsLabel.y"
      :text-anchor="optionsLabel['text-anchor']"
      :font-size="optionsLabel['font-size']"
      :transform="optionsLabel.transform"
      :fill="labelColor"
    >
      {{this.label}}
      <animateTransform attributeName="transform"
             type="scale"
             from="0 0"
             to="1 1"
             begin="0s"
             dur="1s"
        />
    </text>
  </g>
</template>

<script>
export default {
  name: 'Label',
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
    circular: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: null
    },
    selected: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'black'
    },
    background: {
      type: String,
      default: ''
    },
    borderWidth: {
      type: Number,
      default: 0
    },
    borderColor: {
      type: String,
      default: 'black'
    }
  },
  data () {
    return {
      rectWidth: 0
    }
  },
  mounted () {
    this.updateRect()
  },
  updated () {
    this.updateRect()
  },

  computed: {
    fontSize () {
      return this.size * 1.5
    },
    textClass () {
      if (this.circular && this.x > 180) {
        return 'reverse'
      }
      return 'normal'
    },
    classAttribute () {
      return 'nodeLabel ' + this.textClass + (this.selected ? ' selected' : '')
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
        anchor = 'end'
        x = -1.5 * this.size
      }

      return {
        x: x,
        y: 0 + this.size / 2,
        'text-anchor': anchor,
        'font-size': this.fontSize + 'px'
      }
    },
    labelColor () {
      return this.selected ? 'red' : this.color
    },
    isSurrounded () {
      return this.background !== '' || this.rectBorderWidth > 0
    },
    rectMargin () {
      return this.fontSize / 5
    },
    rectBorderWidth () {
      return this.fontSize / 10 * this.borderWidth
    },
    rectY () {
      return this.optionsLabel.y - this.fontSize + this.rectMargin / 2
    },
    rectX () {
      // const margin = (this.circular && this.x > 180) ? this.optionsLabel.x - this.rectMargin * 3 : this.rectMargin * 2
      // return this.optionsLabel.x - margin
      return (this.circular && this.x > 180) ? this.rectMargin * 3 : this.optionsLabel.x - this.rectMargin * 2
    },
    rectFillOpacity () {
      return this.background ? '100%' : '0%'
    }

  },
  methods: {
    updateRect () {
      this.rectWidth = this.$refs.text.getComputedTextLength() + this.size * 1.2
    }
  }
}
</script>

<style scoped>
.selected text {
  font-weight: bold;
  transform: scale(1.5);
}

.selected rect {
  transform: scale(1.5);
}

.nodeLabel:hover text {
  transition: all 0.5s;
  transform: scale(1.5);
}

.nodeLabel:hover rect {
  transition: all 0.5s;
  transform: scale(1.5);
}

.reverse:hover text {
  transition: all 0.5s;
  transform: scale(1.5) rotate(180deg);
}

.reverse text {
  transform: rotate(180deg);
}

text {
  font-family: "Helvetica Neue, Helvetica, sans-serif";
}
</style>
