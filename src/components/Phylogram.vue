<template>
  <div id="phylogram">
    <svg id="svgphylo" v-if="!error" :width="width" :height="height" >
      <g :transform="translationString" id="groupphylo">
        <g transform="translate(10, 10)">
          <Link v-for="link in d3Links" :key="link.id" :source="link.source" :target="link.target" :right-angle="rightAngle" :circular="circular" :stroke-width="linkWidth" />
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
          :selected="node.selected"
          :size="nodeWidth"
          @click.native="clickNode($event, node)"
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
    }
  },
  data () {
    return {
      svg: null,
      zoom: null,
      selectedNodes: []
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
     * d3 root node
     */
    d3RootNode () {
      const rootNode = d3.hierarchy(this.newickTree, function (node) {
        return node.branchset
      })
        .sum(function (d) { return d.branchset ? 1 : 0 })
        .sort(function (a, b) {
          return (a.value - b.value) || d3.descending(a.data.length, b.data.length)
        })

      rootNode.each((n) => { n.selected = false })

      return rootNode
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
    },
    linkWidth () {
      const scale = d3.scaleLog().domain([3, 500]).range([3, 0.01])
      return scale(this.d3Nodes.length)
    },
    nodeWidth () {
      const scale = d3.scaleLog().domain([3, 500]).range([10, 0.1])
      return scale(this.d3Nodes.length)
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
    resetZoom () {
      this.zoom.reset()
    },
    clickNode (e, node) {
      if (node.selected === false) {
        this.selectNode(node)
      } else {
        this.deselectNode(node)
      }
    },
    selectNode (node) {
      const descendants = node.descendants()
      descendants.forEach((n) => {
        const ind = this.d3Nodes.indexOf(n)
        n.selected = true
        this.$set(this.d3Nodes, ind, n)
        if (this.selectedNodes.indexOf(n) === -1) { this.selectedNodes.push(n) }
      })

      this.$emit('select-nodes', this.selectedNodes)

      // I don't knwow why but the reactivity does not work here...
      this.$forceUpdate()
    },
    deselectNode (node) {
      const descendants = node.descendants()
      descendants.forEach((n) => {
        let ind = this.d3Nodes.indexOf(n)
        n.selected = false
        this.$set(this.d3Nodes, ind, n)
        ind = this.selectedNodes.indexOf(n)
        this.selectedNodes.splice(ind, 1)
      })

      this.$emit('select-nodes', this.selectedNodes)
    },
    getD3Node (id) {
      const elts = this.d3Nodes.filter((n) => n.id === id)
      if (elts.length === 0) {
        return null
      } else {
        return elts[0]
      }
    }

  }

}
</script>

<style>
</style>
