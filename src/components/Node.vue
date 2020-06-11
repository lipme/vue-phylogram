<template>
<g :class="classAttribute" :transform="transformAttribute">
    <circle :class="{transparent: !show && type !== 'root'}" :r="type === 'inner' ? size/3 : size/2"
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
}

.transparent {
  opacity:0%;
}

.root circle {
  stroke: yellowgreen;
}

.inner circle {
  opacity: 0%;
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
