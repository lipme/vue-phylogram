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
      :height="fontSize+2*rectMargin"
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
      id="text"
      :dx="optionsLabel.x"
      :dy="optionsLabel.y"
      :text-anchor="optionsLabel['text-anchor']"
      :font-size="optionsLabel['font-size']"
      :transform="optionsLabel.transform"
      :fill="color"
      :font-weight="fontWeight"
      :textLength="textLength"
      lengthAdjust="spacingAndGlyphs"
      @mouseover="mouseover"
      @mouseleave="mouseleave"
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
  name: 'TreeLabel',
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
      default: ''
    },
    circular: {
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
    },
    fontWeight: {
      type: String,
      default: 'normal'
    },
    offsetX: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      hover: false
    }
  },
  computed: {
    transformText () {
      const translationX = -2 * this.offsetX - this.textLength
      const translationY = 0 - this.rectMargin
      return this.textClass === 'reverse' ? 'rotate(180)translate(' + translationX + ',' + translationY + ')' : ''
    },

    fontSize () {
      return this.hover ? this.size * 2 * 1.2 : this.size * 1.2
    },
    textClass () {
      if (this.circular && this.x > 180) {
        return 'reverse'
      }
      return 'normal'
    },
    classAttribute () {
      return 'nodeLabel ' + this.textClass
    },
    transformAttribute () {
      if (this.circular === false) {
        return 'translate(' + this.y + ' ' + this.x + ')'
      } else {
        return 'rotate(' + (this.x - 90) + ')translate(' + this.y + ')'
      }
    },
    optionsLabel () {
      // const anchor = (this.circular && this.x > 180) ? 'end' : 'start'
      const anchor = 'start'

      return {
        // x: (this.circular && this.x > 180) ? -this.offsetX : this.offsetX,
        x: this.offsetX,
        y: this.size / 2,
        'text-anchor': anchor,
        'font-size': this.fontSize + 'px',
        transform: this.transformText
      }
    },

    isSurrounded () {
      return this.label !== null && this.label !== '' && (this.background !== '' || this.rectBorderWidth > 0)
    },
    rectMargin () {
      return this.fontSize / 5
    },
    rectBorderWidth () {
      return this.fontSize / 10 * this.borderWidth
    },
    rectY () {
      return this.optionsLabel.y - this.fontSize
    },
    rectX () {
      // const margin = (this.circular && this.x > 180) ? this.optionsLabel.x - this.rectMargin * 3 : this.rectMargin * 2
      // return this.optionsLabel.x - margin
      const x = this.optionsLabel.x
      return x - this.rectMargin - this.rectBorderWidth
      // return (this.circular && this.x > 180) ? this.offsetX : this.optionsLabel.x - this.rectMargin - this.rectBorderWidth
    },
    rectFillOpacity () {
      return this.background ? '100%' : '0%'
    },
    textLength () {
      return 2 * this.fontSize * this.label.length / 4
    },
    rectWidth () {
      return this.textLength + 2 * (this.rectBorderWidth + this.rectMargin)
    }

  },
  methods: {
    mouseover () {
      this.hover = true
    },
    mouseleave () {
      this.hover = false
    }
  }
}
</script>

<style scoped>

text {
  font-family: "Helvetica Neue, Helvetica, sans-serif";
}
</style>
