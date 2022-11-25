
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
  <div id="app">
    <header>
      <h1 class="title">Vue-phylogram</h1>
      <h2 class="title">Vue component for displaying phylogenetic trees</h2>
    </header>
      <nav>
        <form>
          <div class="tabs">
            <div class="tab">
              <input class="tab-input" name="accordion" type="radio" id="data">
              <label class="tab-label" for="data">Input data</label>
              <div class="tab-content">
                Load an example:
                <br />
                <input
                  type="radio"
                  name="treeType"
                  v-model="treeType"
                  value="jsonExample"
                />
                <label for="treeType">Json example (see source)</label>
                <br />
                <input
                  type="radio"
                  name="treeType"
                  v-model="treeType"
                  value="smallNewick"
                />
                <label for="treeType">Small newick example</label>
                <br />
                <input
                  type="radio"
                  name="treeType"
                  v-model="treeType"
                  value="largeNewick"
                />
                <label for="treeType">Large newick example</label>
                <br /><br />
                Or your own newick file:<br /><br />
                <file-upload-field label button-label="Load newick file" @load="loadNewick"></file-upload-field>
              </div>
            </div>

            <div class="tab">
              <input class="tab-input" name="accordion" type="radio" id="links">
              <label class="tab-label" for="links">Branch options</label>
              <div class="tab-content">
                Right angle links
                <input type="checkbox" v-model="rightAngle" />
                <br />Display branch lengths
                <input type="checkbox" v-model="branchLengths" />
                <br />Display support values
                <input type="checkbox" v-model="displaySupport" />
              </div>
            </div>

            <div class="tab">
              <input class="tab-input" name="accordion" type="radio" id="nodes">
              <label class="tab-label" for="nodes">Node options</label>
              <div class="tab-content">
                Display leaves
                <input type="checkbox" v-model="displayLeaves" />
                <br />Display inner nodes
                <input type="checkbox" v-model="displayInnerNodes" />
              </div>
            </div>

            <div class="tab">
              <input class="tab-input" name="accordion" type="radio" id="labels">
              <label class="tab-label" for="labels">Label options</label>
              <div class="tab-content">
                Display Leaf Labels
                <input type="checkbox" v-model="displayLeafLabels" />
                <br />Display inner Labels
                <input type="checkbox" v-model="displayInnerLabels" />
                <br />Label width:
                <input
                  type="range"
                  min="20"
                  max="500"
                  class="slider"
                  v-model="labelWidth"
                />
                <br />Align Labels:
                <input type="checkbox" v-model="alignLabels" />

              </div>
            </div>

          <div class="tab">
            <input class="tab-input" name="accordion" type="radio" id="layout">
            <label class="tab-label" for="layout">Layout options</label>
            <div class="tab-content">
              Circular layout:
              <input type="checkbox" v-model="circular" />
              <select name="" id="layoutMode" v-model='layoutMode'>
                <option value="0">Branches not ordered</option>
                <option value="1">Branches ordered by ascending length</option>
                <option value="2">Branches ordered by descending length</option>
              </select>

            </div>
          </div>

          <div class="tab">
            <input class="tab-input" name="accordion" type="radio" id="metadata">
            <label class="tab-label" for="metadata">Metadata</label>
            <div class="tab-content">
              <b>Only on the json example</b> <br/>
              Show pies:
              <input type="checkbox" v-model="showPies" />
              <br />Show glyphs:
              <input type="checkbox" v-model="showGlyphs" />
              <br />Type glyphs:
              <select name="" id="glyphType" v-model='glyphType'>
                <option value="rectangle">rectangle</option>
                <option value="circle">circle</option>
              </select>
          </div>
        </div>

        <div class="tab">
          <input class="tab-input" name="accordion" type="radio" id="selected">
          <label class="tab-label" for="selected">Selected nodes</label>
          <div class="tab-content">
            <input type="text" name="selection" v-model="selected" />
          </div>
        </div>

        <div class="tab">
          <input class="tab-input" name="accordion" type="radio" id="collapsed">
          <label class="tab-label" for="collapsed">Collapsed nodes</label>
          <div class="tab-content">
            <input type="text" name="collapse" v-model="collapsed" />
          </div>
        </div>

        <div class="tab">
          <input class="tab-input" name="accordion" type="radio" id="nodeColors">
          <label class="tab-label" for="nodeColors">Default node fill colors</label>
          <div class="tab-content">
            Choose a default fill color for nodes according to their types
            <table>
              <tr><td>Leaves</td><td><input type="color" name="leaveFillColor" v-model="leaveFillColor" /></td></tr>
              <tr><td>Inner nodes</td><td><input type="color" name="innerNodeFillColor" v-model="innerNodeFillColor" /></td></tr>
              <tr><td>Root</td><td><input type="color" name="rootFillColor" v-model="rootFillColor" /></td></tr>
              <tr><td>Selected nodes</td><td><input type="color" name="selectedFillColor" v-model="selectedFillColor" /></td></tr>
            </table>
          </div>
        </div>

        <div class="tab">
          <input class="tab-input" name="accordion" type="radio" id="nodeOutlineColors">
          <label class="tab-label" for="nodeOutlineColors">Default node outline colors</label>
          <div class="tab-content">
            Choose a default outline color for nodes according to their types
            <table>
              <tr>
                <td>Leaves</td>
                <td><input type="color" name="leaveStrokeColor" v-model="leaveStrokeColor" /></td>
              </tr>
              <tr>
                <td>Inner nodes</td>
                <td><input type="color" name="innerNodeStrokeColor" v-model="innerNodeStrokeColor" /></td>
              </tr>
              <tr>
                <td>Root</td>
                <td><input type="color" name="rootStrokeColor" v-model="rootStrokeColor" /></td>
              </tr>
              <tr>
                <td>Selected nodes</td>
                <td><input type="color" name="selectedStrokeColor" v-model="selectedStrokeColor" /></td>
              </tr>
            </table>
          </div>
        </div>

        <div class="tab">
          <input class="tab-input" name="accordion" type="radio" id="labelColors">
          <label class="tab-label" for="labelColors">Default label colors</label>
          <div class="tab-content">
            Choose a default outline color for labels
            <table>
              <tr>
                <td>All labels</td>
                <td><input type="color" name="labelColor" v-model="labelColor" /></td>
              </tr>
              <tr>
                <td>Labels of selected nodes</td>
                <td><input type="color" name="selectedLabelColor" v-model="selectedLabelColor" /></td>
              </tr>
            </table>
          </div>
        </div>

        <div class="tab">
          <input class="tab-input" name="accordion" type="radio" id="branchColors">
          <label class="tab-label" for="branchColors">Default branch colors</label>
          <div class="tab-content">
            Choose a default color for branches
            <table>
              <tr>
                <td>All branches</td>
                <td><input type="color" name="branchColor" v-model="branchColor" /></td>
              </tr>
              <tr>
                <td>Selected branches</td>
                <td><input type="color" name="selectedBranchColor" v-model="selectedBranchColor" /></td>
              </tr>
            </table>
          </div>
        </div>

        <div class="tab" v-if="displayFromTreeObject">
          <input class="tab-input" name="accordion" type="radio" id="nodeStyles">
          <label class="tab-label" for="nodeStyles">Specific node styles (node-styles props)</label>
          <div class="tab-content">
            <code>{{ metadatas.inputTree.nodeStyles }}</code>
          </div>
        </div>
        <div class="tab" >
          <input class="tab-input" name="accordion" type="radio" id="labelStyles">
          <label class="tab-label" for="labelStyles">Specific label styles (label-styles props)</label>
          <div class="tab-content">
            <code > {{ metadata.labelStyles }}</code>
          </div>
        </div>
        <div class="tab" v-if="displayFromTreeObject">
          <input class="tab-input" name="accordion" type="radio" id="branchStyles">
          <label class="tab-label" for="branchStyles">Specific branch styles (branch-styles props)</label>
          <div class="tab-content">
            <code>{{ metadatas.inputTree.branchStyles }}</code>
          </div>
        </div>
      </div>
      </form>
    </nav>
    <main>
      <Phylogram
        class="phylogram"
        v-if="!displayFromTreeObject"
        :key="phylogramKey"
        :width="1000"
        :height="600"
        ref="phylo"
        :newick="newick"
        :right-angle="rightAngle"
        :branch-lengths="branchLengths"
        :margin="margin"
        :displayInnerLabels="displayInnerLabels"
        :displayLeafLabels="displayLeafLabels"
        :displayLeaves="displayLeaves"
        :displayInnerNodes="displayInnerNodes"
        :labelWidth="Number(labelWidth)"
        :circular="circular"
        :align-labels="alignLabels"
        :show-pies="showPies"
        :label-styles="metadata.labelStyles"
        :selected="selected"
        :collapsed="collapsed"
        :layout-mode="layoutMode"
        :displaySupport="displaySupport"
        :defaultColors="defaultColors"
        @click-node="clickNodeFn"
        @click-outside="clickOutside"
      ></Phylogram>
      <Phylogram
        class="phylogram"
        v-else
        :key="phylogramKey"
        :width="1000"
        :height="600"
        ref="phylo"
        :inputTree="tree"
        :right-angle="rightAngle"
        :branch-lengths="branchLengths"
        :margin="margin"
        :displayInnerLabels="displayInnerLabels"
        :displayLeafLabels="displayLeafLabels"
        :displayLeaves="displayLeaves"
        :displayInnerNodes="displayInnerNodes"
        :labelWidth="Number(labelWidth)"
        :circular="circular"
        :align-labels="alignLabels"
        :pies="metadatas.inputTree.pies"
        :show-pies="showPies"
        :label-styles="metadatas.inputTree.labelStyles"
        :branch-styles="metadatas.inputTree.branchStyles"
        :node-styles="metadatas.inputTree.nodeStyles"
        :selected="selected"
        :collapsed="collapsed"
        :layout-mode="layoutMode"
        :glyphs="metadatas.inputTree.glyphs"
        :glyphType="glyphType"
        :showGlyphs="showGlyphs"
        :displaySupport="displaySupport"
        :defaultColors="defaultColors"
        @click-node="clickNodeFn"
        @click-outside="clickOutside"
      ></Phylogram>
    </main>
  </div>
</template>

<script>
import Phylogram from './components/phylogram'

import FileUploadField from '@/components/file/FileGetContentField'

import { bigNewick } from './examples/bigNewick.js'

import { smallNewick } from './examples/smallNewick.js'

export default {
  name: 'App',
  components: {
    Phylogram,
    FileUploadField
  },
  data () {
    return {
      displayInnerLabels: false,
      displayLeafLabels: true,
      displayLeaves: true,
      displayInnerNodes: false,
      displaySupport: false,
      alignLabels: false,
      labelWidth: 200,
      circular: false,
      margin: {
        top: 20,
        bottom: 20,
        right: 20,
        left: 20
      },
      rightAngle: true,
      branchLengths: true,
      layoutMode: '0',
      showGlyphs: true,
      glyphType: 'rectangle',
      leaveFillColor: '#B0C4DE',
      innerNodeFillColor: '#6495ED',
      rootFillColor: '#32CD32',
      selectedFillColor: '#B22222',
      leaveStrokeColor: '#4682B4',
      innerNodeStrokeColor: '#4169E1',
      rootStrokeColor: '#556B2F',
      selectedStrokeColor: '#FF0000',
      branchColor: '#000000',
      selectedBranchColor: '#FF0000',
      labelColor: '#000000',
      selectedLabelColor: '#FF0000',
      metadatas: {
        inputTree: {
          pies: {
            A: {
              data: [
                { label: 'value 1', value: 10, color: 'blue' },
                { label: 'value 2', value: 20, color: 'green' },
                { label: 'value 3', value: 30, color: 'red' }
              ],
              size: 5
            },
            ABCD: {
              data: [
                { label: 'value 1', value: 50, color: 'blue' },
                { label: 'value 2', value: 80, color: 'green' },
                { label: 'value 3', value: 50, color: 'red' }
              ],
              size: 3
            },
            CD: {
              data: [
                { label: 'value 1', value: 90, color: 'blue' },
                { label: 'value 2', value: 10, color: 'green' }
              ],
              size: 2
            }
          },
          branchStyles: {
            CD: {
              color: 'green',
              type: 'from'
            },
            ABCD: {
              color: 'orange',
              type: 'to'
            },
            AB: {
              color: 'brown',
              type: 'both'
            }
          },
          labelStyles: {
            A: {
              color: 'orange',
              background: 'darkgreen',
              borderWidth: 2
            },
            C: {
              background: 'yellow'
            },
            D: {
              borderWidth: 1
            },
            E: {
              borderWidth: 4,
              borderColor: 'red'
            },
            CD: {
              borderWidth: 4,
              borderColor: 'red'
            }
          },
          nodeStyles: {
            C: {
              size: 3,
              fill: 'orange'
            },
            B: {
              size: 0.5
            },
            AB: {
              size: 2
            },
            D: {
              stroke: 'darkgreen'
            }
          },
          glyphs: [
            {
              label: 'Good/Bad',
              categories: [
                {
                  label: 'good',
                  style: { fill: 'green' },
                  ids: ['A', 'C']
                },
                {
                  label: 'bad',
                  style: { fill: 'red' },
                  ids: ['D', 'E']
                }
              ]
            },
            {
              label: 'Yes/No',
              categories: [
                {
                  label: 'yes',
                  style: { fill: 'cyan' },
                  ids: ['B']
                },
                {
                  label: 'no',
                  style: { fill: 'purple' },
                  ids: ['A', 'E']
                }
              ]
            }
          ]
        },
        smallNewick: {
          labelStyles: {
            Crotalus_oreganus_oreganus_cytochrome_b: {
              color: 'white',
              background: 'grey',
              borderWidth: 2
            },
            Crotalus_horridus_cytochrome_b: {
              color: 'orange',
              background: 'darkgreen'
            },
            Lampropeltis_getula_cytochrome_b: {
              color: 'white',
              background: 'black'
            }
          }
        },
        bigNewick: {
          labelStyles: {
            Nanoarchaeum_equitans: {
              color: 'white',
              background: 'brown'
            }
          }
        }
      },
      bigNewick: bigNewick,

      smallNewick: smallNewick,
      tree: `{
        "id": "ABCDE",
        "branchset": [
          {
            "id": "ABCD",
            "length": 0.2,
            "branchset": [
              {
                "length": 0.3,
                "id": "AB",
                "name": "AB",
                "branchset": [
                  {
                    "name": "A",
                    "id": "A",
                    "length": 0.2
                  },
                  {
                    "id": "B",
                    "name": "B",
                    "length": 0.3
                  }
                ]
              },
              {
                "length": 0.2,
                "id": "CD",
                "name": "CD",
                "branchset": [
                  {
                    "id": "C",
                    "name": "C",
                    "length": 0.5
                  },
                  {
                    "id": "D",
                    "name": "D",
                    "length": 0.3
                  }
                ]
              }
            ]
          },
          {
            "id": "E",
            "name": "E",
            "length": 0.7
          }
        ]
      }`,
      showPies: true,
      treeType: 'jsonExample',
      newickProxy: null,
      selected: 'AB,E',
      collapsed: 'AB'
    }
  },
  // watch: {
  //   treeType () {
  //     this.newickProxy = null
  //   }
  // },

  computed: {
    displayFromTreeObject () {
      return this.treeType === 'jsonExample'
    },
    newick: {
      get: function () {
        if (this.newickProxy !== null) {
          return this.newickProxy
        } else {
          return this.treeType === 'smallNewick'
            ? this.smallNewick
            : this.bigNewick
        }
      },
      set: function (n) {
        this.newickProxy = n
      }
    },
    metadata () {
      if (this.treeType === 'jsonExample') {
        return this.metadatas.inputTree
      } else if (this.treeType === 'smallNewick') {
        return this.metadatas.smallNewick
      } else {
        return this.metadatas.bigNewick
      }
    },
    phylogramKey () {
      if (this.treeType === 'jsonExample') {
        return 0
      } else if (this.treeType === 'smallNewick') {
        return 1
      } else if (this.treeType === 'bigNewick') {
        return 2
      } else {
        return 3
      }
    },
    defaultColors () {
      return {
        leaf_fill: this.leaveFillColor,
        inner_fill: this.innerNodeFillColor,
        root_fill: this.rootFillColor,
        selected_fill: this.selectedFillColor,
        leaf_stroke: this.leaveStrokeColor,
        inner_stroke: this.innerNodeStrokeColor,
        root_stroke: this.rootStrokeColor,
        selected_stroke: this.selectedStrokeColor,
        branch: this.branchColor,
        selected_branch: this.selectedBranchColor,
        label_color: this.labelColor,
        selected_label_color: this.selectedLabelColor
      }
    }
  },
  methods: {
    clickNodeFn (e, node) {
      this.$refs.phylo.deselectAll()
      this.$refs.phylo.selectNode(node)
    },
    clickOutside () {
      this.$refs.phylo.deselectAll()
    },
    loadNewick (newick) {
      console.log({ load: newick })
      this.newick = newick
      this.treeType = 'upload'
    }
  }
}
</script>

<style lang="scss">
$midnight: #2c3e50;
$clouds: #ecf0f1;

#app {
  color: $midnight;
  display: grid;
    grid-template-rows: 1fr 5fr;
    grid-template-columns: 2fr 8fr;
    grid-template-areas:
      "header header"
      "nav main";
    grid-gap: .25em;
}

header {
  grid-area: header;
  background-color: $midnight;
  color: $clouds;
  height: 100%;
  // display: flex;
  // align-items: center;
}

.title {
    margin: auto;
}

nav {
  grid-area: nav;
  background-color: $midnight;
}

main {
  grid-area: main;
  background-color: $clouds;
}

// General
body {
  background-color: $clouds;
  color: $midnight;
  padding: 0 1em 1em;
}

h1 {
  margin: 0;
  line-height: 2;
  text-align: center;
}

h2 {
  margin: 0 0 .5em;
  font-weight: normal;
  text-align: center;
}

.tab-input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.row {
  display: flex;
  .col {
    flex: 1;

    &:last-child {
      margin-left: 1em;
    }
  }
}

/* Accordion styles */
.tabs {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 4px -2px rgba(0, 0, 0, 0.5);
}

.tab {
  width: 100%;
  color: white;
  overflow: hidden;

  &-label {
    display: flex;
    justify-content: space-between;
    padding: 1em;
    background: $midnight;
    font-weight: bold;
    cursor: pointer;

    /* Icon */
    &:hover {
      background: darken($midnight, 10%);
    }

    &::after {
      content: "\276F";
      width: 1em;
      height: 1em;
      text-align: center;
      transition: all .35s;
    }
  }

  &-content {
    max-height: 0;
    padding: 0 1em;
    color: $midnight;
    background: white;
    transition: all .35s;
  }

  &-close {
    display: flex;
    justify-content: flex-end;
    padding: 1em;
    font-size: 0.75em;
    background: $midnight;
    cursor: pointer;

    &:hover {
      background: darken($midnight, 10%);
    }
  }
}

.tab-input:checked {
  +.tab-label {
    background: darken($midnight, 10%);

    &::after {
      transform: rotate(90deg);
    }
  }

  ~.tab-content {
    max-height: 100vh;
    padding: 1em;
  }

}

.phylogram {
  border: solid;
  width: 1000px;
  height: 600px;
}
</style>
