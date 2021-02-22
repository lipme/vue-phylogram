<template>
  <rect :height="size" :width="size" :style="glyphStyle" :transform="transformAttribute">
    <title v-if="showLabel" style="text-align:left">
      {{ label }}
    </title>
    <animateTransform attributeName="transform"
             type="scale"
             from="0 0"
             to="1 1"
             begin="0s"
             dur="1s"
        />
  </rect>
</template>

<script>
import { glyph } from '@/mixins/glyph'

export default {
  mixins: [glyph],
  computed: {
    transformAttribute () {
      if (this.circular === false) {
        const y = this.y - this.size / 2
        const x = this.x - this.size / 2
        return 'translate(' + y + ' ' + x + ')'
      } else {
        const y = this.y - this.size / 2
        const x = this.x
        return 'rotate(' + (x - 90) + ')translate(' + y + ' ' + (-this.size / 2) + ')'
      }
    }
  }
}
</script>
