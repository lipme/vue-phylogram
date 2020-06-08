<template>
<g :class="classAttribute" :transform="transformAttribute" style="transition:transform 0.5s ease-out">
    <circle :class="{transparent: !show && type !== 'root'}" :r="type === 'inner' ? size/3 : size/2"
     :stroke-width="strokeWidth"
     >
     </circle>
    </g>
</template>

<script>
export default {
  name: 'node',
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
    },
    show: {
      type: Boolean,
      default: true
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
      return 'node ' + this.type +
      (this.selected ? ' selected' : '')
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
  opacity: 100%;
  stroke:darkblue;
  fill:steelblue
}

.transparent {
  opacity:0%;
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
