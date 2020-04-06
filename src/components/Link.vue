<template>
  <path class="link" :d="path" :fill="fill" :stroke="stroke" :stroke-width="strokeWidth"></path>
</template>

<script>
import * as d3Shape from 'd3-shape'

export default {
  props: {
    fill: {
      type: String,
      default: 'none'
    },
    stroke: {
      type: String,
      default: '#aaa'
    },
    strokeWidth: {
      type: Number,
      default: 2
    },
    rightAngle: {
      type: Boolean,
      default: true
    },
    source: {
      type: Object,
      default: () => {
        return {
          x: 20,
          y: 10
        }
      }
    },
    target: {
      default: () => {
        return {
          x: 40,
          y: 60
        }
      }
    }
  },
  computed: {
    path () {
      if (this.rightAngle === false) {
        return this.linkHorizontal()
      }
      /**
       * From d3.phylogram.js
       * https://gist.github.com/biovisualize/5437184
       */
      const pair = { source: this.source, target: this.target }
      let projection = function (d) {
        return [d.y, d.x]
      }

      let path = function (pathData) {
        return 'M' + pathData[0] + ' ' + pathData[1] + ' ' + pathData[2]
      }

      function diagonal (diagonalPath, i) {
        const source = diagonalPath.source
        const target = diagonalPath.target
        let pathData = [source, { x: target.x, y: source.y }, target]
        pathData = pathData.map(projection)
        return path(pathData)
      }

      diagonal.projection = function (x) {
        if (!arguments.length) return projection
        projection = x
        return diagonal
      }

      diagonal.path = function (x) {
        if (!arguments.length) return path
        path = x
        return diagonal
      }

      return diagonal(pair)
    }
  },
  methods: {
    linkHorizontal () {
      const o = {
        source: this.source,
        target: this.target
      }

      const link = d3Shape
        .linkHorizontal()
        .x(function (d) {
          return d.y
        })
        .y(function (d) {
          return d.x
        })

      return link(o)
    }
  }
}
</script>

<style>
</style>
