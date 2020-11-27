// Copyright 2020 [LIPM]
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
//    limitations under the License.
<template>
  <path
    class="link"
    :d="path"
    fill="none"
    :stroke="stroke"
    :stroke-width="strokeWidth"
    :stroke-dasharray="dashAttribute"
  >
    <animate
      attributeName="stroke-width"
      attributeType="XML"
      from="0"
      :to="strokeWidth"
      begin="0s"
      dur="2s"
    />
  </path>
</template>

<script>
import * as d3Shape from 'd3-shape'

export default {
  props: {
    stroke: {
      type: String,
      default: 'black'
    },
    strokeWidth: {
      type: Number,
      default: 0.3
    },
    rightAngle: {
      type: Boolean,
      default: true
    },
    circular: {
      type: Boolean,
      default: false
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
      type: Object,
      default: () => {
        return {
          x: 40,
          y: 60
        }
      }
    },
    dashed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    path () {
      if (this.rightAngle === false) {
        if (this.circular === false) {
          return this.linkHorizontal()
        } else {
          return this.linkRadial()
        }
      }

      const pair = { source: this.source, target: this.target }
      if (this.circular === false) {
        return this.rightAngleDiagonal()(pair)
      } else {
        return this.radialRightAngleDiagonal()(pair)
      }
    },
    dashAttribute () {
      const step = this.strokeWidth * 5
      return this.dashed ? step + ',' + step : ''
    }
  },
  methods: {
    rightAngleDiagonal () {
      /**
       * From d3.phylogram.js
       * https://gist.github.com/biovisualize/5437184
       */
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

      return diagonal
    },
    radialRightAngleDiagonal () {
      const elt = this

      return this.rightAngleDiagonal()
        .path(function (pathData) {
          const src = pathData[0]
          const mid = pathData[1]
          const dst = pathData[2]
          const radius = Math.sqrt(src[0] * src[0] + src[1] * src[1])
          const srcAngle = elt.coordinateToAngle(src, radius)
          const midAngle = elt.coordinateToAngle(mid, radius)
          const clockwise =
            Math.abs(midAngle - srcAngle) > Math.PI
              ? midAngle <= srcAngle
              : midAngle > srcAngle
          const rotation = 0
          const largeArc = 0
          const sweep = clockwise ? 0 : 1
          return (
            'M' +
            src +
            ' ' +
            'A' +
            [radius, radius] +
            ' ' +
            rotation +
            ' ' +
            largeArc +
            ',' +
            sweep +
            ' ' +
            mid +
            'L' +
            dst
          )
        })
        .projection(function (d) {
          const r = d.y
          var a = ((d.x - 90) / 180) * Math.PI
          return [r * Math.cos(a), r * Math.sin(a)]
        })
    },
    coordinateToAngle (coord, radius) {
      const wholeAngle = 2 * Math.PI
      const quarterAngle = wholeAngle / 4

      const coordQuad =
        coord[0] >= 0 ? (coord[1] >= 0 ? 1 : 2) : coord[1] >= 0 ? 4 : 3
      const coordBaseAngle = Math.abs(Math.asin(coord[1] / radius))

      // Since this is just based on the angle of the right triangle formed
      // by the coordinate and the origin, each quad will have different
      // offsets
      let coordAngle

      switch (coordQuad) {
        case 1:
          coordAngle = quarterAngle - coordBaseAngle
          break
        case 2:
          coordAngle = quarterAngle + coordBaseAngle
          break
        case 3:
          coordAngle = 2 * quarterAngle + quarterAngle - coordBaseAngle
          break
        case 4:
          coordAngle = 3 * quarterAngle + coordBaseAngle
      }
      return coordAngle
    },
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
    },
    linkRadial () {
      const o = {
        source: this.source,
        target: this.target
      }

      const link = d3Shape
        .linkRadial()
        .angle(function (d) {
          return (d.x / 180) * Math.PI
        })
        .radius(function (d) {
          return d.y
        })

      return link(o)
    }
  }
}
</script>

<style scoped>
path:hover {
  transition: all 0.5s;
  stroke: red;
}
</style>
