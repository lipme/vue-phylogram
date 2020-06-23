<template>
<g :class="classAttribute" :transform="transformAttribute">
    <circle v-if="!collapsed" :class="{transparent: !show && type !== 'root'}" :r="type === 'inner' ? size/3 : size/2"
     :stroke-width="strokeWidth" :stroke="strokeColor" :fill="fill"
     >
      <animateTransform attributeName="transform"
             type="scale"
             from="0 0"
             to="1 1"
             begin="0s"
             dur="1s"
        />
     </circle>
       <polygon v-else :points="triangleCoords" :fill="fill" :stroke-width="strokeWidth" :stroke="strokeColor"/>
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
    },
    strokeColor: {
      type: String,
      default: 'darkblue'
    },
    fill: {
      type: String,
      default: 'steelblue'
    },
    collapsed: {
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
      return 'node ' + this.type +
      (this.selected ? ' selected' : '')
    },
    transformAttribute () {
      if (this.circular === false) {
        return 'translate(' + this.y + ' ' + this.x + ')'
      } else {
        return 'rotate(' + (this.x - 90) + ')translate(' + this.y + ')'
      }
    },
    triangleCoords () {
      const coords = [
        { x: 0, y: 0 },
        {
          x: this.size * 2,
          y: -this.size * 2
        },
        {
          x: this.size * 2,
          y: this.size * 2
        }
      ]

      return `${coords[0].x} ${coords[0].y},${coords[1].x} ${coords[1].y}, ${coords[2].x} ${coords[2].y}`
    }
  }
}
</script>

<style scoped>

circle,polygon {
  opacity: 100%;
  stroke:darkblue;
}

.transparent {
  opacity:0%;
}

.root circle,polygon {
  stroke: yellowgreen;
}

.inner circle {
  opacity: 0%;
}

.selected circle,.selected polygon {
  fill: red;
  stroke: brown;
}

circle:hover,polygon:hover {
  transition: all 0.5s;
  transform: scale(3);
  opacity: 100%;
}

</style>
