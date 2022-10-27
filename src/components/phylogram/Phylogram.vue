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
  <div id="phylogram" @click="clickOutside">
    <SvgPanZoom
      @svgpanzoom="registerSvgPanZoom"
      :style="svgStyle"
      :zoomEnabled="true"
      :fit="true"
      :center="true"
      :maxZoom="50"
    >
      <svg
        id="svgphylo"
        ref="svgphylo"
        v-if="!error"
        :width="width"
        :height="height"
      >
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
              :stroke="link.color"
              :support="link.support"
              :supportFontSize="nodeWidth"
              :id="link.id"
            />
          </g>
          <g transform="translate(10, 10)">
            <Node
              v-for="node in d3Nodes"
              :show="node.show"
              :key="node.id"
              :x="node.x"
              :y="node.y"
              :circular="circular"
              :id="node.data.id"
              :size="node.sizeFactor * nodeWidth"
              :fill="node.fill"
              :stroke-color="node.strokeColor"
              @contextmenu.native.prevent="rightClickNode($event, node)"
              @click.native.prevent="clickNode($event, node)"
              @mouseover.native.prevent="hoverNode($event, node)"
              :collapsed="node.collapsed"
            />
          </g>
          <g
            transform="translate(10, 10)"
            v-if="displayLeafLabels || displayInnerLabels"
          >
            <Label
              v-for="node in nodesWithDisplayedLabel"
              v-show="node.displayLabel"
              :key="node.id"
              :x="node.x"
              :y="positionLabel(node)"
              :label="node.data.name"
              :circular="circular"
              :id="node.data.id"
              :size="node.sizeFactor * nodeWidth"
              @contextmenu.native.prevent="rightClickLabel($event, node)"
              @click="clickLabel($event, node)"
              @mouseover.native.prevent="hoverLabel($event, node)"
              :color="node.labelColor"
              :background="node.labelBackgroundColor"
              :borderWidth="node.labelBorderWidth"
              :borderColor="node.labelBorderColor"
              :font-weight="node.labelFontWeight"
              :offsetX="nodeWidth * 1.5"
            />
          </g>
          <g
            v-if="alignLabels && displayLeafLabels"
            transform="translate(10, 10)"
          >
            <Link
              v-for="node in d3Leaves"
              :key="node.id"
              :source="{ x: node.x, y: node.y + nodeWidth * 1.5 }"
              :target="{ x: node.x, y: maxY + nodeWidth }"
              :right-angle="rightAngle"
              :circular="circular"
              :stroke-width="linkWidth / 2"
              :dashed="true"
              stroke="grey"
            />
          </g>
          <g v-if="hasPieMetadata && showPies" transform="translate(10, 10)">
            <PieNode
              @contextmenu.native.prevent="rightClickNode($event, node)"
              @click.native.prevent="clickNode($event, node)"
              @mouseover.native.prevent="hoverNode($event, node)"
              v-for="node in d3PieNodes"
              :key="node.id"
              :x="node.x"
              :y="node.y"
              :type="node.type"
              :circular="circular"
              :id="node.data.id"
              :selected="node.selected"
              :size="
                pies[node.data.id].size
                  ? nodeWidth * pies[node.data.id].size
                  : nodeWidth
              "
              :data="pies[node.data.id].data ? pies[node.data.id].data : []"
            />
          </g>
          <g v-if="hasGlyphs && showGlyphs" transform="translate(10, 10)">
            <template v-for="node in d3Leaves">
                <component v-for="(glyph, glyphIndex) in node.glyphs"
                  :is="glyphComponent"
                  :key="node.data.id + glyphIndex"
                  :x="node.x"
                  :y="positionGlyph(node, glyphIndex)"
                  :glyphStyle="glyph.style"
                  :label="glyph.label"
                  :size="nodeWidth"
                  :show-label="showGlyphLabels"
                  :circular="circular"
                ></component>
            </template>
          </g>
        </g>
      </svg>
    </SvgPanZoom>
  </div>
</template>

<script>
import _ from 'lodash'
import Newick from '@/lib/newick.js'
import * as d3 from 'd3'
import SvgPanZoom from 'vue-svg-pan-zoom'

import Node from '@/components/node'
import Link from '@/components/link'
import Label from '@/components/label'
import PieNode from '@/components/pieNode'
import GlyphCircle from '@/components/glyph/GlyphCircle.vue'
import GlyphRect from '@/components/glyph/GlyphRect.vue'

export default {
  name: 'VuePhylogram',
  components: {
    Node,
    Link,
    Label,
    PieNode,
    SvgPanZoom,
    GlyphCircle,
    GlyphRect
  },
  props: {
    branchLengthKey: {
      type: String,
      default: 'length'
    },
    branchKey: {
      type: String,
      default: 'branchset'
    },
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
      type: String,
      default: ''
    },
    rightAngle: {
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
    displayLeaves: {
      type: Boolean,
      default: true
    },
    displayInnerNodes: {
      type: Boolean,
      default: false
    },
    displayLeafLabels: {
      type: Boolean,
      default: true
    },
    displayInnerLabels: {
      type: Boolean,
      default: false
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
    },
    layoutMode: {
      type: String,
      default: '0',
      validator: function (value) {
        return ['0', '1', '2'].indexOf(value) !== -1
      }
    },
    glyphs: {
      type: Array,
      default: () => []
    },
    showGlyphs: {
      type: Boolean,
      default: true
    },
    showGlyphLabels: {
      type: Boolean,
      default: true
    },
    glyphType: {
      type: String,
      default: 'rectangle',
      validator: function (value) {
        return ['circle', 'rectangle'].indexOf(value) !== -1
      }
    },
    displaySupport: {
      type: Boolean,
      default: true
    }

  },
  data () {
    return {
      selectedNodes: [],
      d3RootNodeProxy: null,
      newickTreeProxy: null,
      collapsedNodes: [],
      error: false

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
    if (this.error === false) {
      this.selectFromProp()
      this.collapseFromProp()
    }
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
    collapsed (v) {
      this.expandAll()
      this.collapseFromProp()
    },
    collapsedNodes (v) {
      this.$emit('collapse-nodes', v)
    }
  },
  computed: {
    svgStyle () {
      return 'width: ' + this.width + 'px; height: ' + this.height + 'px;'
    },
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
            return JSON.parse(this.inputTree)
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
        const component = this
        if (this.d3RootNodeProxy !== null) {
          return this.d3RootNodeProxy
        } else {
          let rootNode = d3
            .hierarchy(this.newickTree, function (node) {
              return node[component.branchKey]
            })
            .sum(function (d) {
              return d[component.branchKey] ? 1 : 0
            })
          if (this.layoutMode !== '0') {
            rootNode = rootNode.sort((a, b) => {
              return (
                //
                this.layoutMode === '1'
                  ? b.value - a.value ||
                      d3.descending(
                        b.data[this.branchLengthKey],
                        a.data[this.branchLengthKey]
                      )
                  : a.value - b.value ||
                      d3.descending(
                        a.data[this.branchLengthKey],
                        b.data[this.branchLengthKey]
                      )
              )
            })
          }
          let i = 0
          rootNode.each((n) => {
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
            this.height,
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
          if (n.children || n._children) {
            if (n.depth === 0) {
              type = 'root'
            } else {
              type = 'inner'
            }
          }
          n.type = type
          n.id = i

          n.sizeFactor = this.getNodeSizeFactor(n)

          n.fill = this.getNodeFillColor(n)

          n.strokeColor = this.getNodeStrokeColor(n)

          n.collapsed = this.collapsedNodes.includes(n.data.id)

          n.show = this.getNodeShow(n)

          n.displayLabel = this.getDisplayLabel(n)

          n.labelColor = this.getLabelColor(n)

          n.labelBackgroundColor = this.getLabelBackgroundColor(n)

          n.labelBorderWidth = this.getLabelBorderWidth(n)

          n.labelBorderColor = this.getLabelBorderColor(n)

          n.labelFontWeight = this.getLabelFontWeight(n)

          n.glyphs = []
          if (this.hasGlyphs) {
            this.glyphs.forEach((glyph, glyphIndex) => {
              glyph.categories.forEach(c => {
                const ids = c.ids
                if (ids.includes(n.data.id)) {
                  const glyphNode = { label: c.label, style: c.style, idx: glyphIndex }
                  n.glyphs.push(glyphNode)
                }
              })
            })
          }

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

        const root = nodes.find((n) => {
          return n.type === 'root'
        })
        if (root) {
          visitPreOrder(root, (node) => {
            let branchLength = 0
            if (node.data && this.branchLengthKey in node.data) {
              branchLength =
                node.data[this.branchLengthKey] > 0
                  ? node.data[this.branchLengthKey]
                  : 0
            }
            node.rootDist = 0
            if (node.parent) {
              if (node.parent.rootDist) {
                node.rootDist = node.parent.rootDist
              }
            }

            node.rootDist += branchLength
          })

          const yScale = this.yScale(nodes)

          visitPreOrder(root, function (node) {
            node.y = yScale(node.rootDist)
          })
        }
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
      const links = this.d3Nodes
        .map((n) => {
          let link = null
          if (n.parent) {
            let selected = false
            if (
              this.selectedNodes.includes(n.data.id) &&
              this.selectedNodes.includes(n.parent.data.id)
            ) {
              selected = true
            }

            link = {
              source: {
                x: n.parent.x,
                y: n.parent.y,
                selected: n.parent.selected,
                data: n.parent.data
              },
              target: { x: n.x, y: n.y, selected: n.selected, data: n.data },
              id: n.id + '__' + n.parent.id,
              selected: selected,
              support: this.displaySupport ? n.parent.data.support : ''
            }

            link.color = this.getBranchColor(link)
          }
          return link
        })
        .filter((n) => n !== null)

      return links
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
      return this.nodeWidth / 4
    },
    nodeWidth () {
      return this.d3Leaves.length < 10
        ? 10
        : this.height / this.d3Leaves.length / 1.5
    },
    maxY () {
      return d3.max(this.d3Nodes.map((n) => n.y + n.sizeFactor * this.nodeWidth))
    },
    hasPieMetadata () {
      if (!this.pies || this.pies.length === 0) {
        return false
      }
      return true
    },
    d3PieNodes () {
      return this.hasPieMetadata
        ? this.d3Nodes.filter((n) => n.data.id in this.pies)
        : []
    },
    hasLabelStyles () {
      return !(!this.labelStyles || this.labelStyles.length === 0)
    },
    hasBranchStyles () {
      return !(!this.branchStyles || this.branchStyles.length === 0)
    },
    hasNodeStyles () {
      return !(!this.nodeStyles || this.nodeStyles.length === 0)
    },
    nodesWithDisplayedLabel () {
      return this.d3Nodes.filter((node) => this.getDisplayLabel(node))
    },
    hasGlyphs () {
      return this.glyphs && this.glyphs.length > 0
    },
    glyphComponent () {
      return this.glyphType === 'circle' ? 'GlyphCircle' : 'GlyphRect'
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
        return d3.scaleLinear().domain([0, this.width]).range([0, this.width])
      }
    },
    toggleSelect (node) {
      if (this.isSelected(node) === false) {
        this.selectNode(node)
      } else {
        this.deselectNode(node)
      }
    },
    selectNode (node) {
      const descendants = node.descendants()

      descendants.forEach((n) => {
        // const ind = this.d3Nodes.indexOf(n)
        // n.selected = true
        // this.$set(this.d3Nodes, ind, n)
        // this.$set(this.d3Nodes[ind], 'selected', true)
        if (this.selectedNodes.indexOf(n.data.id) === -1) {
          this.selectedNodes.push(n.data.id)
        }
      })

      this.$emit('select-nodes', this.selectedNodes)
    },
    deselectNode (node) {
      const descendants = node.descendants()
      descendants.forEach((n) => {
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
      const elts = this.d3Nodes.filter((n) => n.data.id === id)
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
    getDisplayLabel (node) {
      return node.children
        ? this.displayInnerLabels
        : this.displayLeafLabels
    },
    getBranchColor (link) {
      if (link.selected) {
        return 'red'
      }

      if (this.hasBranchStyles) {
        if (link.target.data.id in this.branchStyles) {
          const spec = this.branchStyles[link.target.data.id]
          if (
            'color' in spec &&
            (('type' in spec && (spec.type === 'to' || spec.type === 'both')) ||
              !('type' in spec))
          ) {
            return spec.color
          }
        } else if (link.source.data.id in this.branchStyles) {
          const spec = this.branchStyles[link.source.data.id]
          if (
            'color' in spec &&
            (('type' in spec &&
              (spec.type === 'from' || spec.type === 'both')) ||
              !('type' in spec))
          ) {
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
      if (node.type === 'root') {
        return 'greenyellow'
      }
      if (node.type === 'inner') {
        return 'lightsalmon'
      }
      return 'steelblue'
    },
    getNodeStrokeColor (node) {
      if (this.selectedNodes.includes(node.data.id)) {
        return 'brown'
      }
    },
    getNodeSizeFactor (node) {
      if (this.hasNodeStyles) {
        if (node.data.id in this.nodeStyles) {
          if ('size' in this.nodeStyles[node.data.id]) {
            return this.nodeStyles[node.data.id].size
          }
        }
      }

      return 1
    },
    getNodeShow (node) {
      if (node.type === 'root') {
        return true
      }
      return node.children
        ? this.displayInnerNodes
        : this.displayLeaves
    },
    toggleCollapse (node) {
      if (node.children) {
        this.collapse(node)
      } else if (node._children) {
        this.expand(node)
      }
    },
    collapse (node) {
      if (node.children && !this.collapsedNodes.includes(node.data.id)) {
        node._children = node.children
        node.children = null
        this.collapsedNodes.push(node.data.id)
      }
    },
    expand (node) {
      if (node._children && this.collapsedNodes.includes(node.data.id)) {
        node.children = node._children
        node._children = null
        const ind = this.collapsedNodes.indexOf(node.data.id)
        this.collapsedNodes.splice(ind, 1)
      }
    },
    expandAll () {
      this.collapsedNodes.forEach((id) => {
        const node = this.getD3Node(id)
        if (node !== null) { this.expand(node) }
      })
    },
    isCollapsed (node) {
      return !!node._children
    },
    selectFromProp () {
      const nodeIds = this.selected.split(',')
      nodeIds.forEach((id) => {
        const node = this.getD3Node(id)
        if (node !== null) {
          this.selectNode(node)
        }
      })
    },
    collapseFromProp () {
      const v = this.collapsed.split(',')
      v.forEach((id) => {
        const node = this.getD3Node(id)
        if (node !== null) {
          this.collapse(node)
        }
      })
    },
    positionLabel (node) {
      const offset = this.hasGlyphs && this.showGlyphs ? this.glyphs.length * this.nodeWidth : 0

      return (this.alignLabels && node.type === 'leaf'
        ? (this.maxY + this.nodeWidth)
        : node.y + this.nodeWidth * node.sizeFactor + this.nodeWidth) + offset
    },
    positionGlyph (node, index) {
      const offset = index * this.nodeWidth
      return (this.alignLabels && node.type === 'leaf'
        ? (this.maxY + this.nodeWidth)
        : node.y + this.nodeWidth * node.sizeFactor + this.nodeWidth) + offset
    },
    registerSvgPanZoom (svgpanzoom) {
      this.svgpanzoom = svgpanzoom
    },
    zoomOut () {
      this.svgpanzoom.zoomOut()
    },
    zoomIn () {
      this.svgpanzoom.zoomIn()
    },
    reset () {
      this.svgpanzoom.reset()
    },
    left () {
      this.svgpanzoom.panBy({ x: -5, y: 0 })
    },
    right () {
      this.svgpanzoom.panBy({ x: 5, y: 0 })
    },
    down () {
      this.svgpanzoom.panBy({ x: 0, y: 5 })
    },
    up () {
      this.svgpanzoom.panBy({ x: 0, y: -5 })
    },
    // events
    clickNode (e, node) {
      this.$emit('click-node', e, node)
    },
    clickOutside (e) {
      if (e.target.id === 'svgphylo') {
        this.$emit('click-outside', e)
      }
    },
    rightClickNode (e, node) {
      this.$emit('right-click-node', e, node)
    },
    hoverNode (e, node) {
      this.$emit('hover-node', e, node)
    },
    clickLabel (e, node) {
      this.$emit('click-label', e, node)
    },
    rightClickLabel (e, node) {
      this.$emit('right-click-label', e, node)
    },
    hoverLabel (e, node) {
      this.$emit('hover-label', e, node)
    }
  }
}
</script>
