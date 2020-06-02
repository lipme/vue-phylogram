<template>
<g :class="classAttribute" :transform="transformAttribute" style="transition:transform 0.5s ease-out">
    <text :dx="optionsLabel.x"
    :dy="optionsLabel.y" :text-anchor="optionsLabel['text-anchor']"
    :font-size="optionsLabel['font-size']"
    :transform="optionsLabel.transform" >
    {{this.label}}
    <animate attributeType="XML" attributeName="font-size" from="0" :to="optionsLabel['font-size']" dur="0.8s" />
    </text></g>
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
    },
    selected: {
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
        anchor = 'end'
        x = -1.5 * this.size
      }

      return this.type === 'inner'
        ? { x: x, y: -this.size / 3, 'text-anchor': anchor, 'font-size': this.size * 1.5 + 'px' }
        : { x: x, y: this.size / 3, 'text-anchor': anchor, 'font-size': this.size * 1.5 + 'px' }
    }
  }
}
</script>

<style scoped>

.selected text {
  fill: red;
  font-weight: bold;
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
