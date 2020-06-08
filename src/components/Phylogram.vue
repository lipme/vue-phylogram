<template>
  <div id="phylogram">
    <svg id="svgphylo" v-if="!error" :width="width" :height="height">
      <g :transform="translationString" id="groupphylo">
        <g transform="translate(10, 10)">
          <Link
            v-for="link in d3Links"
            :key="link.id"
            :source="link.source"
            :target="link.target"
            :selected="link.selected"
            :right-angle="rightAngle"
            :circular="circular"
            :stroke-width="link.selected ? linkWidth * 1.5 : linkWidth"
          />
        </g>
        <g transform="translate(10, 10)">
          <Node
            v-for="node in d3Nodes"
            :show="displayNodes"
            :key="node.id"
            :x="node.x"
            :y="node.y"
            :type="node.type"
            :circular="circular"
            :id="node.data.id"
            :selected="selectedNodes.includes(node)"
            :size="nodeWidth"
            @click.native="clickNode($event, node)"
          />
        </g>
        <g v-show="displayLabels" transform="translate(10, 10)">
          <Label
            v-for="node in d3Nodes"
            :key="node.id"
            :x="node.x"
            :y="alignLabels && node.type==='leaf' ? maxY : node.y"
            :type="node.type"
            :label="node.data.name"
            :circular="circular"
            :id="node.data.id"
            :selected="selectedNodes.includes(node)"
            :size="nodeWidth"
            @click.native="clickNode($event, node)"
            :color="getLabelColor(node)"
            :background="getBackgroundColor(node)"
            :borderWidth="getBorderWidth(node)"
            :borderColor="getBorderColor(node)"
          />
        </g>
        <g v-show="displayLabels && alignLabels" transform="translate(10, 10)">
          <Link
            v-for="node in d3Leaves"
            :key="node.id"
            :source="{x:node.x, y:node.y+nodeWidth}"
            :target="{x:node.x, y:maxY}"
            :right-angle="rightAngle"
            :circular="circular"
            :stroke-width="linkWidth/2"
            :dashed="true"
            stroke="grey"
          />
        </g>
        <g v-if="hasPieMetadata && showPies" transform="translate(10, 10)">
          <PieNode
            v-for="node in d3PieNodes"
            :key="node.id"
            :x="node.x"
            :y="node.y"
            :type="node.type"
            :circular="circular"
            :id="node.data.id"
            :selected="node.selected"
            :size="pies[node.data.id].size ? nodeWidth*pies[node.data.id].size : nodeWidth "
            :data="pies[node.data.id].data ? pies[node.data.id].data : []"
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
import Label from '@/components/Label.vue'
import PieNode from '@/components/PieNode.vue'

export default {
  components: {
    Node,
    Link,
    Label,
    PieNode
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
    displayLabels: {
      type: Boolean,
      default: true
    },
    circular: {
      type: Boolean,
      default: false
    },
    alignLabels: {
      type: Boolean,
      default: false
    },
    pies: {
      type: Object,
      default: () => {}
    },
    showPies: {
      type: Boolean,
      default: true
    },
    displayNodes: {
      type: Boolean,
      default: true
    },
    labelStyles: {
      type: Object,
      default: () => {}
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
    if (!_.isEmpty(this.newick) && !_.isEmpty(this.inputTree)) {
      console.error('newick and input-tree props can not coexist')
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
      if (this.newick) {
        return Newick.parse(this.newick)
      } else {
        return this.inputTree
      }
    },
    /**
     * d3 root node
     */
    d3RootNode () {
      const rootNode = d3
        .hierarchy(this.newickTree, function (node) {
          return node.branchset
        })
        .sum(function (d) {
          return d.branchset ? 1 : 0
        })
        .sort(function (a, b) {
          return (
            a.value - b.value || d3.descending(a.data.length, b.data.length)
          )
        })

      rootNode.each(n => {
        n.selected = false
        n.data.id = n.data.id ? n.data.id : n.data.name
      })

      return rootNode
    },
    /**
     * Cluster function
     */
    d3Cluster () {
      if (this.circular === false) {
        return d3
          .cluster()
          .size([
            this.height - this.margin.top,
            this.width - this.margin.left - this.margin.right - this.labelWidth
          ])
          .separation(function (a, b) {
            return 50
          })
      } else {
        return d3
          .tree()
          .size([360, this.width / 2 - this.labelWidth])
          .separation(function (a, b) {
            return (a.parent === b.parent ? 1 : 2) / a.depth
          })
      }
    },
    /**
     * Array of d3 nodes
     */
    d3Nodes () {
      const root = this.d3RootNode
      let nodes = this.d3Cluster(
        root.sum(function (d) {
          return d.depth
        })
      )
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
            }
          }
        }
        visitPreOrder(nodes[0], function (node) {
          node.rootDist =
            (node.parent ? node.parent.rootDist : 0) + (node.data.length || 0)
        })

        const yScale = this.yScale(nodes)

        visitPreOrder(nodes[0], function (node) {
          node.y = yScale(node.rootDist)
        })
      }
      return nodes
    },
    d3Leaves () {
      return this.d3Nodes.filter(n => n.type === 'leaf')
    },
    /**
     * Array of d3 links
     */
    d3Links () {
      return this.d3Nodes
        .map(n => {
          if (n.parent) {
            let selected = false
            if (this.selectedNodes.includes(n) && this.selectedNodes.includes(n.parent)) {
              selected = true
            }

            return {
              source: { x: n.parent.x, y: n.parent.y, selected: n.parent.selected },
              target: { x: n.x, y: n.y, selected: n.parent.selected },
              id: n.id,
              selected: selected
            }
          } else {
            return null
          }
        })
        .filter(n => n !== null)
    },
    /**
     * Translation string for the main svg
     */
    translationString () {
      if (this.circular === false) {
        return 'translate(' + this.margin.left + ',' + this.margin.top + ')'
      } else {
        return 'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      }
    },
    linkWidth () {
      const scale = d3
        .scaleLog()
        .domain([3, 500])
        .range([3, 0.02])
      return scale(this.d3Nodes.length)
    },
    nodeWidth () {
      const scale = d3
        .scaleLog()
        .domain([3, 500])
        .range([10, 0.1])
      return scale(this.d3Nodes.length)
    },
    maxY () {
      return d3.max(this.d3Nodes.map(n => n.y))
    },
    hasPieMetadata () {
      if (!this.pies || this.pies.length === 0) {
        return false
      }
      return true
    },
    d3PieNodes () {
      return this.hasPieMetadata ? this.d3Nodes.filter(n => n.data.id in this.pies) : []
    },
    hasLabelStyles () {
      return !(!this.labelStyles || this.labelStyles.length === 0)
    }
  },
  methods: {
    /**
     * Returns yscale function
     */
    yScale (nodes) {
      if (this.branchLengths === true) {
        const rootDists = nodes.map(function (n) {
          return n.rootDist
        })
        return d3
          .scaleLinear()
          .domain([0, d3.max(rootDists)])
          .range([
            0,
            (this.circular ? this.width / 2 : this.width) - this.labelWidth
          ])
      } else {
        return d3
          .scaleLinear()
          .domain([0, this.width])
          .range([0, this.width])
      }
    },
    resetZoom () {
      this.zoom.reset()
    },
    clickNode (e, node) {
      if (this.isSelected(node) === false) {
        this.selectNode(node)
      } else {
        this.deselectNode(node)
      }
    },
    selectNode (node) {
      const descendants = node.descendants()

      descendants.forEach(n => {
        // const ind = this.d3Nodes.indexOf(n)
        // n.selected = true
        // this.$set(this.d3Nodes, ind, n)
        // this.$set(this.d3Nodes[ind], 'selected', true)
        if (this.selectedNodes.indexOf(n) === -1) {
          this.selectedNodes.push(n)
        }
      })

      this.$emit('select-nodes', this.selectedNodes)

      // I don't knwow why but the reactivity does not work here...
      // this.$forceUpdate()
    },
    deselectNode (node) {
      const descendants = node.descendants()
      descendants.forEach(n => {
        // let ind = this.d3Nodes.indexOf(n)
        // this.$set(this.d3Nodes, ind, n)
        // this.$set(this.d3Nodes[ind], 'selected', false)
        const ind = this.selectedNodes.indexOf(n)
        this.selectedNodes.splice(ind, 1)
      })

      this.$emit('select-nodes', this.selectedNodes)
    },
    getD3Node (id) {
      const elts = this.d3Nodes.filter(n => n.id === id)
      if (elts.length === 0) {
        return null
      } else {
        return elts[0]
      }
    },
    isSelected (node) {
      return this.selectedNodes.includes(node)
    },
    getLabelColor (node) {
      if (this.hasLabelStyles) {
        if (node.data.id in this.labelStyles) {
          if ('color' in this.labelStyles[node.data.id]) {
            return this.labelStyles[node.data.id].color
          }
        }
      }
      return 'black'
    },
    getBackgroundColor (node) {
      if (this.hasLabelStyles) {
        if (node.data.id in this.labelStyles) {
          if ('background' in this.labelStyles[node.data.id]) {
            return this.labelStyles[node.data.id].background
          }
        }
      }
      return ''
    },
    getBorderWidth (node) {
      if (this.hasLabelStyles) {
        if (node.data.id in this.labelStyles) {
          if ('borderWidth' in this.labelStyles[node.data.id]) {
            return this.labelStyles[node.data.id].borderWidth
          }
        }
      }
      return 0
    },
    getBorderColor (node) {
      if (this.hasLabelStyles) {
        if (node.data.id in this.labelStyles) {
          if ('borderColor' in this.labelStyles[node.data.id]) {
            return this.labelStyles[node.data.id].borderColor
          }
        }
      }
      return 'black'
    }
  }
}
</script>

<style>
</style>
