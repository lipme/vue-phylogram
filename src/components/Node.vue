<template>
<g :class="classAttribute" :transform="transformAttribute" style="transition:transform 0.5s ease-out">
    <circle :r="type === 'inner' ? size/3 : size/2"
     :stroke-width="strokeWidth"
     >
     </circle>
    </g>
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
    type: {
      type: String,
      default: ''
    },
    circular: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    strokeWidth () {
      return this.size / 5
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
    }
  }
}
</script>

<style scoped>

circle {
  transition: all 0.5s;
  opacity: 100%;
  stroke:darkblue;
  fill:steelblue
}

.root circle {
  stroke: yellowgreen;
  fill: greenyellow;
}

.inner circle {
  opacity: 0%;
  fill:lightsalmon;
  stroke: coral;
}

.selected circle {
  opacity: 100%;
  transition: all 0.5s;
  fill: red;
  stroke: brown;
  transform: scale(1.5);
}

circle:hover {
  transition: all 0.5s;
  transform: scale(1.5);
  opacity: 100%;
}

</style>
