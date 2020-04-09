<template>
  <div id="phylogram">
    <svg id="svgphylo" v-if="!error" :width="width" :height="height" >
      <g :transform="translationString" id="groupphylo">
      <g transform="translate(10, 10)">
        <Link v-for="link in d3Links" :key="link.id" :source="link.source" :target="link.target" :right-angle="rightAngle" :circular="circular" />
      </g>
      <g transform="translate(10, 10)">
        <node v-for="node in d3Nodes"
        :key="node.id"
        :x="node.x"
        :y="node.y"
        :type="node.type"
        :label="displayLabel ? node.data.name : ''"
        :circular="circular"
        :id="node.id.toString()"
         />
      </g>
      </g>
    </svg>
  </div>
</template>

<script>
import _ from 'lodash'
import Newick from '../../public/lib/newick.js'
import * as d3 from 'd3'
import * as svgPanZoom from 'svg-pan-zoom'

import Node from '@/components/Node.vue'
import Link from '@/components/Link.vue'

export default {
  components: {
    Node,
    Link
  },
  props: {
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 400
    },
    margin: {
      type: Object,
      default: () => {
        return {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        }
      }
    },
    labelWidth: {
      type: Number,
      default: 200
    },
    branchLengths: {
      type: Boolean,
      default: true
    },
    newick: {
      type: String,
      default: null
    },
    inputTree: {
      type: Object,
      default: null
    },
    rightAngle: {
      type: Boolean,
      default: true
    },
    error: {
      type: Boolean,
      default: false
    },
    displayLabel: {
      type: Boolean,
      default: true
    },
    circular: {
      type: Boolean,
      default: false
    },
    zoom: {
      type: Object,
      default: null
    }

  },
  data () {
    return {
      svg: null
    }
  },
  created () {
    if (_.isEmpty(this.newick) && _.isEmpty(this.inputTree)) {
      console.error('Needs newick or input-tree props')
      this.error = true
    }
  },
  mounted () {
    this.zoom = svgPanZoom('#svgphylo')
  },
  computed: {
    /**
     * Tree computed from the newick string
     */
    newickTree () {
      return Newick.parse(this.newick)
    },
    /**
     * Nodes created from the newick string
     */
    newickNodes () {
      const nodes = []
      function buildNewickNodes (node, callback) {
        nodes.push(node)
        if (node.branchset) {
          for (var i = 0; i < node.branchset.length; i++) {
            buildNewickNodes(node.branchset[i])
          }
        }
      }

      buildNewickNodes(this.newickTree)
      return nodes
    },
    /**
     * d3 root node
     */
    d3RootNode () {
      return d3.hierarchy(this.newickTree, function (node) {
        return node.branchset
      })
        .sum(function (d) { return d.branchset ? 1 : 0 })
        .sort(function (a, b) {
          return (a.value - b.value) || d3.descending(a.data.length, b.data.length)
        })
    },
    /**
     * Cluster function
     */
    d3Cluster () {
      if (this.circular === false) {
        return d3.cluster()
          .size([this.height - this.margin.top, this.width - this.margin.left - this.margin.right - this.labelWidth])
          .separation(function (a, b) { return 50 })
      } else {
        return d3.tree()
          .size([360, this.width / 2 - this.labelWidth])
          .separation(function (a, b) { return (a.parent === b.parent ? 1 : 2) / a.depth })
      }
    },
    /**
     * Array of d3 nodes
     */
    d3Nodes () {
      const root = this.d3RootNode
      let nodes = this.d3Cluster(root.sum(function (d) { return d.depth }))
        .descendants()
        .map((n, i) => {
          let type = 'leaf'
          if (n.children) {
            if (n.depth === 0) {
              type = 'root'
            } else {
              type = 'inner'
            }
          }
          n.type = type
          n.id = i
          return n
        })

      nodes = nodes.sort(function (a, b) {
        if (_.isEmpty(a.children)) {
          return 1
        }
        if (_.isEmpty(b.children)) {
          return -1
        }
        if (a.children.length > b.children.length) {
          return -1
        }
        return 1
      })

      if (this.branchLengths === true) {
        const visitPreOrder = function (node, callback) {
          callback(node)
          if (node.children) {
            for (let i = node.children.length - 1; i >= 0; i--) {
              visitPreOrder(node.children[i], callback)
            };
          }
        }
        visitPreOrder(nodes[0], function (node) {
          node.rootDist = (node.parent ? node.parent.rootDist : 0) + (node.data.length || 0)
        })

        const yScale = this.yScale(nodes)

        visitPreOrder(nodes[0], function (node) {
          node.y = yScale(node.rootDist)
        })
      }
      return nodes
    },
    /**
     * Array of d3 links
     */
    d3Links () {
      return this.d3Nodes.map(n => {
        if (n.parent) {
          return {
            source: { x: n.parent.x, y: n.parent.y },
            target: { x: n.x, y: n.y },
            id: n.id
          }
        } else { return null }
      }).filter((n) => n !== null)
    },
    /**
     * Translation string for the main svg
     */
    translationString () {
      if (this.circular === false) {
        return 'translate(' + this.margin.left + ',' + this.margin.top + ')'
      } else {
        return 'translate(' + (this.width / 2) + ',' + (this.height / 2) + ')'
      }
    }
  },
  methods: {
    /**
     * Returns yscale function
     */
    yScale (nodes) {
      if (this.branchLengths === true) {
        const rootDists = nodes.map(function (n) { return n.rootDist })
        return d3.scaleLinear()
          .domain([0, d3.max(rootDists)])
          .range([0, (this.circular ? this.width / 2 : this.width) - this.labelWidth])
      } else {
        return d3.scaleLinear()
          .domain([0, this.width])
          .range([0, this.width])
      }
    },
    zoomed () {
      console.log('zoom')
      this.svg.attr('transform', d3.event.transform)
    },
    resetZoom () {
      this.zoom.resetZoom()
    }
  }

}
</script>

<style>
</style>
