<template>
  <div id="phylogram"
  @click="hideMenu  "
   >
    <svg id="svgphylo" v-if="!error" :width="width" :height="height">
      <g :transform="translationString" id="groupphylo">
        <g transform="translate(10, 10)">
          <Link
            v-for="link in d3Links"
            :key="link.id"
            :source="link.source"
            :target="link.target"
            :right-angle="rightAngle"
            :circular="circular"
            :stroke-width="link.selected ? linkWidth * 1.5 : linkWidth"
            :stroke="getBranchColor(link)"
          />
        </g>
        <g transform="translate(10, 10)">
          <Node
            v-for="node in d3Nodes"
            :show="getNodeShow(node)"
            :key="node.id"
            :x="node.x"
            :y="node.y"
            :type="node.type"
            :circular="circular"
            :id="node.data.id"
            :selected="selectedNodes.includes(node.data.id)"
            :size="getNodeSize(node)"
            :fill="getNodeFillColor(node)"
            :stroke-color="getNodeStrokeColor(node)"
            @click.native.stop="clickNode($event, node)"
            :collapsed="isCollapsed(node)"
          />
        </g>
        <g v-show="displayLabels" transform="translate(10, 10)">
          <Label
            v-for="node in d3Nodes"
            :key="node.id"
            :x="node.x"
            :y="alignLabels && node.type==='leaf' ? maxY : node.y+getNodeSize(node)*2"
            :type="node.type"
            :label="node.data.name"
            :circular="circular"
            :id="node.data.id"
            :selected="selectedNodes.includes(node.data.id)"
            :size="getNodeSize(node)"
            @click.native.stop="clickNode($event, node)"
            :color="getLabelColor(node)"
            :background="getLabelBackgroundColor(node)"
            :borderWidth="getLabelBorderWidth(node)"
            :borderColor="getLabelBorderColor(node)"
            :font-weight="getLabelFontWeight(node)"
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
            @click.native.stop="clickNode($event, node)"
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
    <div @click="hideMenu" v-show="showMenu" class="menu" ref="menu"
     :style="{position:'absolute', left:currentNodePosition.x+'px', top:currentNodePosition.y+'px'}">
        <ul>
            <li>
                <a @click.prevent="toggleSelect(currentNode)">
                    Select/Deselect
                </a>
            </li>
            <li v-show="currentNode != null && (currentNode.type!=='leaf' || isCollapsed(currentNode))">
                <a @click.prevent="toggleCollapse(currentNode)">
                    Collapse/Expand
                </a>
            </li>
        </ul>
        </div>
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
    },
    branchStyles: {
      type: Object,
      default: () => {}
    },
    nodeStyles: {
      type: Object,
      default: () => {}
    },
    selected: {
      type: String,
      default: ''
    },
    collapsed: {
      type: String,
      default: ''
    }

  },
  data () {
    return {
      svg: null,
      zoom: null,
      selectedNodes: [],
      currentNode: null,
      currentNodePosition: { x: 0, y: 0 },
      showMenu: false,
      d3RootNodeProxy: null,
      newickTreeProxy: null,
      collapsedNodes: []
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
    this.selectFromProp()
    this.collapseFromProp()
  },
  watch: {
    newick () {
      this.newickTreeProxy = null
    },
    inputTree () {
      this.newickTreeProxy = null
    },
    selected () {
      this.deselectAll()
      this.selectFromProp()
    },
    collapsed () {
      this.expandAll()
      this.collapseFromProp()
    }
  },
  computed: {
    /**
     * Tree computed from the newick string
     * or set with inputTree
     */
    newickTree: {
      get: function () {
        if (this.newickTreeProxy !== null) {
          return this.newickTreeProxy
        } else {
          if (this.newick) {
            return Newick.parse(this.newick)
          } else {
            return this.inputTree
          }
        }
      },
      set: function (tree) {
        this.newickTreeProxy = tree
      }
    },
    /**
     * d3 root node
     */
    d3RootNode: {
      get: function () {
        if (this.d3RootNodeProxy !== null) {
          return this.d3RootNodeProxy
        } else {
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

          let i = 0
          rootNode.each(n => {
            i++
            n.selected = false
            n.data.id = n.data.id ? n.data.id : i
          })

          return rootNode
        }
      },
      set: function (rootNode) {
        this.d3RootNodeProxy = rootNode
      }
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
            if (this.selectedNodes.includes(n.data.id) &&
            this.selectedNodes.includes(n.parent.data.id)) {
              selected = true
            }

            return {
              source: { x: n.parent.x, y: n.parent.y, selected: n.parent.selected, data: n.parent.data },
              target: { x: n.x, y: n.y, selected: n.selected, data: n.data },
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
    },
    hasBranchStyles () {
      return !(!this.branchStyles || this.branchStyles.length === 0)
    },
    hasNodeStyles () {
      return !(!this.nodeStyles || this.nodeStyles.length === 0)
    }
    // selectedNodes: {
    //   get: function () {
    //     if (this.selectedNodesProxy !== null) {
    //       return this.selectedNodesProxy
    //     } else {
    //       console.log('select :' + this.select.split(','))
    //       return this.select.split(',')
    //     }
    //   },
    //   set: function (selected) {
    //     console.log('set selected nodes')
    //     this.selectedNodesProxy = selected
    //   }
    // }
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
      this.currentNode = node
      this.currentNodePosition = { x: e.pageX + 10, y: e.pageY + 10 }
      this.displayMenu()
    },
    toggleSelect (node) {
      this.hideMenu()

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
        if (this.selectedNodes.indexOf(n.data.id) === -1) {
          this.selectedNodes.push(n.data.id)
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
        const ind = this.selectedNodes.indexOf(n.data.id)
        this.selectedNodes.splice(ind, 1)
      })

      this.$emit('select-nodes', this.selectedNodes)
    },
    deselectAll (node) {
      this.deselectNode(this.d3RootNode)
    },
    getD3Node (id) {
      const elts = this.d3Nodes.filter(n => n.data.id === id)
      if (elts.length === 0) {
        return null
      } else {
        return elts[0]
      }
    },
    isSelected (node) {
      return this.selectedNodes.includes(node.data.id)
    },
    getLabelColor (node) {
      if (this.isSelected(node)) {
        return 'red'
      }

      if (this.hasLabelStyles) {
        if (node.data.id in this.labelStyles) {
          if ('color' in this.labelStyles[node.data.id]) {
            return this.labelStyles[node.data.id].color
          }
        }
      }
      return 'black'
    },
    getLabelBackgroundColor (node) {
      if (this.hasLabelStyles) {
        if (node.data.id in this.labelStyles) {
          if ('background' in this.labelStyles[node.data.id]) {
            return this.labelStyles[node.data.id].background
          }
        }
      }
      return ''
    },
    getLabelBorderWidth (node) {
      if (this.hasLabelStyles) {
        if (node.data.id in this.labelStyles) {
          if ('borderWidth' in this.labelStyles[node.data.id]) {
            return this.labelStyles[node.data.id].borderWidth
          }
        }
      }
      return 0
    },
    getLabelBorderColor (node) {
      if (this.hasLabelStyles) {
        if (node.data.id in this.labelStyles) {
          if ('borderColor' in this.labelStyles[node.data.id]) {
            return this.labelStyles[node.data.id].borderColor
          }
        }
      }
      return 'black'
    },
    getLabelFontWeight (node) {
      return this.isSelected(node) ? 'bold' : 'normal'
    },
    getBranchColor (link) {
      if (link.selected) {
        return 'red'
      }

      if (this.hasBranchStyles) {
        if (link.target.data.id in this.branchStyles) {
          const spec = this.branchStyles[link.target.data.id]
          if ('color' in spec &&
          (('type' in spec && (spec.type === 'to' || spec.type === 'both')) ||
          (!('type' in spec)))) {
            return spec.color
          }
        } else if (link.source.data.id in this.branchStyles) {
          const spec = this.branchStyles[link.source.data.id]
          if ('color' in spec &&
          (('type' in spec && (spec.type === 'from' || spec.type === 'both')) ||
          (!('type' in spec)))) {
            return spec.color
          }
        }
      }
      return 'black'
    },
    getNodeFillColor (node) {
      if (this.selectedNodes.includes(node.data.id)) {
        return 'red'
      }

      if (this.hasNodeStyles) {
        if (node.data.id in this.nodeStyles) {
          if ('color' in this.nodeStyles[node.data.id]) {
            return this.nodeStyles[node.data.id].color
          }
        }
      }
      if (node.type === 'root') { return 'greenyellow' }
      if (node.type === 'inner') { return 'lightsalmon' }
      return 'steelblue'
    },
    getNodeStrokeColor (node) {
      if (this.selectedNodes.includes(node.data.id)) {
        return 'brown'
      }
    },
    getNodeSize (node) {
      const baseWidth = this.nodeWidth

      if (this.hasNodeStyles) {
        if (node.data.id in this.nodeStyles) {
          if ('size' in this.nodeStyles[node.data.id]) {
            return this.nodeStyles[node.data.id].size * baseWidth
          }
        }
      }

      return this.nodeWidth
    },
    getNodeShow (node) {
      if (node.type === 'root') {
        return true
      }
      return this.displayNodes
    },
    toggleCollapse (node) {
      this.showMenu = false

      if (node.children) {
        this.collapse(node)
      } else if (node.data._branchset) {
        this.expand(node)
      }
    },
    collapse (node) {
      this.newickTree = this._collapseNode(node.data.id, this.newickTree, false)
      this.collapsedNodes.push(node.data.id)
      this.$emit('collapse-nodes', this.collapsedNodes)
    },
    _collapseNode (id, node, collapseChildren) {
      if (node.id === id) {
        collapseChildren = true
      }
      if (node.branchset) {
        node.branchset.forEach(n => this._collapseNode(id, n, collapseChildren))
      }
      if (node.branchset && collapseChildren) {
        node._branchset = node.branchset
        node.branchset = null
      }
      return node
    },
    expand (node) {
      this.newickTree = this._expandNode(node.data.id, this.newickTree, false)
      const ind = this.collapsedNodes.indexOf(node.data.id)
      this.collapsedNodes.splice(ind, 1)
      this.$emit('collapse-nodes', this.collapsedNodes)
    },
    _expandNode (id, node, expandChildren) {
      if (node.id === id) {
        expandChildren = true
      }
      const selected = this.selectedNodes.includes(node.id)

      if (node.branchset) {
        node.branchset.forEach((n) => {
          if (selected) this.selectedNodes.push(n.id)
          this._expandNode(id, n, expandChildren)
        })
      }
      if (node._branchset) {
        node._branchset.forEach((n) => {
          if (selected) this.selectedNodes.push(n.id)
          this._expandNode(id, n, expandChildren)
        })
      }
      if (node._branchset && expandChildren) {
        node.branchset = node._branchset
        node._branchset = null
      }
      return node
    },
    expandAll () {
      this.expand(this.d3RootNode)
    },
    toggleMenu () {
      this.showMenu = !this.showMenu
    },
    hideMenu () {
      this.showMenu = false
    },
    displayMenu () {
      this.showMenu = true
    },
    isCollapsed (node) {
      return !!node.data._branchset
    },
    selectFromProp () {
      const nodeIds = this.selected.split(',')
      nodeIds.forEach(id => {
        const node = this.getD3Node(id)
        if (node !== null) {
          this.selectNode(node)
        }
      })
    },
    collapseFromProp () {
      const nodeIds = this.collapsed.split(',')
      nodeIds.forEach(id => {
        const node = this.getD3Node(id)
        if (node !== null) {
          this.collapse(node)
        }
      })
    }

  }
}
</script>

<style scoped>

.menu{
  border:3px solid #afb1b2;
  border-radius:0px 10px 10px 10px;
  -moz-border-radius:0px 10px 10px 10px;
  -webkit-border-radius:0px 10px 10px 10px;
 -webkit-box-shadow:17px 10px 17px 0px #5a5353 ;
  -moz-box-shadow:17px 10px 17px 0px #5a5353 ;
  box-shadow:17px 10px 17px 0px #5a5353 ;
  padding:0px;
  background-color: white;
}

  /* CSS by GenerateCSS.com */
.menu ul{
  list-style-type: none;
  list-style-position: outside;
  }
.menu li {
  padding: 0px;
  margin: 0px 5px 0px -25px;
  font-size:12px;
}

.menu li:hover
{
  font-weight: bold  ;
}

</style>
