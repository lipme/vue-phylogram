<template>
  <div id="phylogram">
    <svg v-if="!error" :width="width" :height="height" :transform="translationString">
      <g transform="translate(10, 10)">
        <Link v-for="link in d3Links" :key="link.id" :source="link.source" :target="link.target" :right-angle="rightAngle" />
      </g>
      <g transform="translate(10, 10)">
        <node v-for="node in d3Nodes"
        :key="node.id"
        :x="node.x"
        :y="node.y"
        :type="node.type"
        :label="node.data.name"
         />
      </g>
    </svg>
  </div>
</template>

<script>
import _ from 'lodash'
import Newick from '../../public/lib/newick.js'
import * as d3Hierarchy from 'd3-hierarchy'
import * as d3Array from 'd3-array'
import * as d3Scale from 'd3-scale'

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
          right: 200,
          bottom: 10,
          left: 10
        }
      }
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
    }
  },
  created () {
    if (_.isEmpty(this.newick) && _.isEmpty(this.inputTree)) {
      console.log('Needs newick or input-tree props')
      this.error = true
    }
  },
  mounted () {},
  computed: {
    newickTree () {
      return Newick.parse(this.newick)
    },
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
      console.log({ nodes })
      return nodes
    },
    d3RootNode () {
      return d3Hierarchy.hierarchy(this.newickTree, function (node) {
        return node.branchset
      })
        .sum(function (d) { return d.branchset ? 1 : 0 })
        .sort(function (a, b) {
          return (a.value - b.value) || d3Array.descending(a.data.length, b.data.length)
        })
    },
    /**
     * Cluster function
     */
    d3Cluster () {
      return d3Hierarchy.cluster()
        .size([this.height - this.margin.top, this.width - this.margin.left - this.margin.right])
        .separation(function (a, b) { return 50 })
    },
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

      console.log({ nodes })

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
      console.log(nodes)
      return nodes
    },
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
    translationString () {
      return 'translate(' + this.margin.left + ',' + this.margin.top + ')'
    }
  },
  methods: {
    yScale (nodes) {
      if (this.branchLengths === true) {
        const rootDists = nodes.map(function (n) { return n.rootDist })
        console.log({ rootDists })
        return d3Scale.scaleLinear()
          .domain([0, d3Array.max(rootDists)])
          .range([0, this.width - this.margin.right])
      } else {
        return d3Scale.scaleLinear()
          .domain([0, this.width - this.margin.right])
          .range([0, this.width - this.margin.right])
      }
    }

  }
}
</script>

<style>
</style>
