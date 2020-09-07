<template>
  <div id="app">
    <div id="tablerow">
      <div id="leftbox">
        <form>
          Display tree with right angles
          <input type="checkbox" v-model="rightAngle" />
          <br />
          <br />Display branch lengths
          <input type="checkbox" v-model="branchLengths" />
          <br />
          <br />
          <br />Display Labels
          <input type="checkbox" v-model="displayLabels" />
          <br />
          <br />
          <br />Display leaves
          <input type="checkbox" v-model="displayLeaves" />
          <br />
          <br />Display inner nodes
          <input type="checkbox" v-model="displayInnerNodes" />
          <br />
          <br />Label width:
          <input type="range" min="20" max="500" class="slider" v-model="labelWidth" />
          <br />
          <br />Circular layout:
          <input type="checkbox" v-model="circular" />
          <br />
          <br />Align Labels:
          <input type="checkbox" v-model="alignLabels" />
          <br />
          <br />Show pies:
          <input type="checkbox" v-model="showPies" />
          <br />
          <br />Selected node ids :
          <br />
          <input type="text" name="selection" v-model="selected" />
          <br />
          <br />Collapsed node ids :
          <br />
          <input type="text" name="collapse" v-model="collapsed" />
          <br />
          <br />
          <button @click.prevent="resetZoom">Reset Zoom</button>
          <br />
          <div v-if="treeType=='jsonExample'">
            <b>Metadata:</b>
            <br />Pies:
            <br />
            {{ this.metadatas.inputTree.pies }}
            <br />
            <br />Branch Styles:
            <br />
            {{ this.metadatas.inputTree.branchStyles }}
            <br />Node Styles:
            <br />
            {{ this.metadatas.inputTree.nodeStyles }}
            <br />Label Styles:
            <br />
            {{ this.metadatas.inputTree.labelStyles }}
            <br />
          </div>

          <br />Type of tree:
          <br />
          <input type="radio" name="treeType" v-model="treeType" value="jsonExample" />
          <label for="treeType">Json example (see source)</label>
          <br />

          <input type="radio" name="treeType" v-model="treeType" value="smallNewick" />
          <label for="treeType">Small newick</label>
          <br />

          <input type="radio" name="treeType" v-model="treeType" value="largeNewick" />
          <label for="treeType">Large newick</label>
          <br />Copy and paste newick:
          <textarea v-model="newick" rows="10" cols="40" />
        </form>
      </div>
      <div id="rightbox">
        <Phylogram
          v-if="! displayFromTreeObject"
          :key="phylogramKey"
          :width="1000"
          :height="600"
          ref="phylogramFromNewick"
          :newick="newick"
          :right-angle="rightAngle"
          :branch-lengths="branchLengths"
          :margin="margin"
          :displayLabels="displayLabels"
          :displayLeaves="displayLeaves"
          :displayInnerNodes="displayInnerNodes"
          :labelWidth="Number(labelWidth)"
          :circular="circular"
          :align-labels="alignLabels"
          :show-pies="showPies"
          :label-styles="metadata.labelStyles"
          :selected="selected"
          :collapsed="collapsed"
        ></Phylogram>
        <Phylogram
          v-else
          :key="phylogramKey"
          :width="1000"
          :height="600"
          ref="phylogramFromObject"
          :inputTree="tree"
          :right-angle="rightAngle"
          :branch-lengths="branchLengths"
          :margin="margin"
          :displayLabels="displayLabels"
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
        ></Phylogram>
      </div>
    </div>
  </div>
</template>

<script>
import Phylogram from './components/phylogram'

import { bigNewick } from './examples/bigNewick.js'

import { smallNewick } from './examples/smallNewick.js'

export default {
  name: 'App',
  components: {
    Phylogram
  },
  data () {
    return {
      displayLabels: true,
      displayLeaves: true,
      displayInnerNodes: false,
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
          }
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
      tree: {
        id: 'ABCDE',
        branchset: [
          {
            id: 'ABCD',
            length: 0.2,
            branchset: [
              {
                length: 0.3,
                id: 'AB',
                branchset: [
                  {
                    name: 'A',
                    id: 'A',
                    length: 0.2
                  },
                  {
                    id: 'B',
                    name: 'B',
                    length: 0.3
                  }
                ]
              },
              {
                length: 0.2,
                id: 'CD',
                name: 'CD',
                branchset: [
                  {
                    id: 'C',
                    name: 'C',
                    length: 0.5
                  },
                  {
                    id: 'D',
                    name: 'D',
                    length: 0.3
                  }
                ]
              }
            ]
          },
          {
            id: 'E',
            name: 'E',
            length: 0.7
          }
        ]
      },
      showPies: true,
      treeType: 'jsonExample',
      newickProxy: null,
      selected: 'AB,E',
      collapsed: 'AB'
    }
  },
  watch: {
    treeType () {
      this.newickProxy = null
    }
  },

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
      } else {
        return 2
      }
    }
  },
  methods: {
    resetZoom () {
      this.$refs.phylogram.resetZoom()
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
</style>
