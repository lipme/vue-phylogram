
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
    <div id="tablerow">
      <div id="leftbox">
        <form>
          <fieldset>
            <legend>Data</legend>
            <file-upload-field
              label
              button-label="Load newick file"
              @load="loadNewick"
            ></file-upload-field>
            <br />Type of tree:
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
          </fieldset>

          <fieldset>
            <legend>Links</legend>
            Right angle links
            <input type="checkbox" v-model="rightAngle" />
            <br />Display branch lengths
            <input type="checkbox" v-model="branchLengths" />
            <br />Display support values
            <input type="checkbox" v-model="displaySupport" />
          </fieldset>

          <fieldset>
            <legend>Nodes</legend>
            Display leaves
            <input type="checkbox" v-model="displayLeaves" />
            <br />Display inner nodes
            <input type="checkbox" v-model="displayInnerNodes" />
          </fieldset>

          <fieldset>
            <legend>Labels</legend>
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
          </fieldset>

          <fieldset>
            <legend>Layout</legend>
            Circular layout:
            <input type="checkbox" v-model="circular" />
            <select name="" id="layoutMode" v-model='layoutMode'>
              <option value="0">Branches not ordered</option>
              <option value="1">Branches ordered by ascending length</option>
              <option value="2">Branches ordered by descending length</option>
            </select>
          </fieldset>

          <fieldset>
            <legend>Metadata</legend>
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
          </fieldset>

          <fieldset>
            <legend>Selected nodes</legend>
            <input type="text" name="selection" v-model="selected" />
          </fieldset>

          <fieldset>
            <legend>Collapsed nodes</legend>
            <input type="text" name="collapse" v-model="collapsed" />
          </fieldset>
        </form>
      </div>
      <div id="rightbox">
        <Phylogram
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
          @click-node="clickNodeFn"
        ></Phylogram>
        <Phylogram
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
          @click-node="clickNodeFn"
          @click-outside="clickOutside"
        ></Phylogram>
      </div>
    </div>
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
              color: 'orange'
            },
            B: {
              size: 0.5
            },
            AB: {
              size: 2
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

<style>
#app {
  color: #2c3e50;
  margin-top: 60px;
  width: 100%;
  display: table;
}
#tablerow {
  display: table-row;
  width: 100%;
}
#leftbox {
  vertical-align: top;
  width: 25%;
  display: table-cell;
  background-color: beige;
  padding: 20px;
}
#rightbox {
  display: table-cell;
  background-color: rgb(226, 215, 236);
  padding: 20px;
}
legend {
  font-weight: bold;
}

</style>
