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
<g :transform="transformAttribute">
    <circle v-if="!collapsed" :class="{transparent: !show}" :r="size/2"
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
    circular: {
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

.transparent {
  opacity:0;
}

circle:hover,polygon:hover {
  transition: all 0.5s;
  transform: scale(2);
  opacity: 1;
}

</style>
