<template>
  <circle :r="size/2" :style="circleStyle" :transform="transformAttribute">
    <title v-if="showLabel">{{ label }}</title>
    <animateTransform attributeName="transform"
             type="scale"
             from="0 0"
             to="1 1"
             begin="0s"
             dur="1s"
        />
  </circle>
</template>

<script>

import { glyph } from '@/mixins/glyph'

export default {
  mixins: [glyph],

  computed: {
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
