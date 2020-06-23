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
          <br />Display nodes
          <input type="checkbox" v-model="displayNodes" />
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
          <br />
          <button @click.prevent="resetZoom">Reset Zoom</button>
          <br />
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
          :displayNodes="displayNodes"
          :labelWidth="Number(labelWidth)"
          :circular="circular"
          :align-labels="alignLabels"
          :show-pies="showPies"
          :label-styles="metadata.labelStyles"
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
          :displayNodes="displayNodes"
          :labelWidth="Number(labelWidth)"
          :circular="circular"
          :align-labels="alignLabels"
          :pies="metadatas.inputTree.pies"
          :show-pies="showPies"
          :label-styles="metadatas.inputTree.labelStyles"
          :branch-styles="metadatas.inputTree.branchStyles"
          :node-styles="metadatas.inputTree.nodeStyles"
          selected="node1,node6"
        ></Phylogram>
      </div>
    </div>
  </div>
</template>

<script>
import Phylogram from './components/Phylogram'

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
      displayNodes: true,
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
            node1: {
              data: [
                { label: 'A', value: 10, color: 'blue' },
                { label: 'B', value: 20, color: 'green' },
                { label: 'C', value: 30, color: 'red' }
              ],
              size: 5
            },
            node4: {
              data: [
                { label: 'A', value: 50, color: 'blue' },
                { label: 'B', value: 80, color: 'green' },
                { label: 'C', value: 50, color: 'red' }
              ],
              size: 1.2
            },
            node2: {
              data: [
                { label: 'A', value: 90, color: 'blue' },
                { label: 'B', value: 10, color: 'green' }
              ],
              size: 1
            }
          },
          branchStyles: {
            node0: {
              color: 'green',
              type: 'from'
            },
            node2: {
              color: 'orange',
              type: 'to'
            },
            node4: {
              color: 'brown',
              type: 'both'
            }

          },
          labelStyles: {
            node5: {
              color: 'orange',
              background: 'darkgreen',
              borderWidth: 2
            },
            node3: {
              background: 'yellow'
            },
            node6: {
              borderWidth: 1
            },
            node4: {
              borderWidth: 4,
              borderColor: 'red'
            }
          },
          nodeStyles: {
            node6: {
              color: 'orange'
            },
            node5: {
              size: 3
            },
            node1: {
              size: 0.5
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
        id: 'node0',
        name: 'node 0',
        branchset: [
          {
            id: 'node1',
            name: 'node 1',
            length: 0.08,
            branchset: [
              {
                id: 'node2',
                name: 'node 2',
                length: 0.05
              },
              {
                id: 'node3',
                name: 'node 3',
                length: 0.07
              }
            ]
          },
          {
            id: 'node4',
            name: 'node 4',
            length: 0.05,
            branchset: [
              {
                id: 'node5',
                name: 'node 5',
                length: 0.02
              },
              {
                id: 'node6',
                name: 'node 6',
                length: 0.07
              }
            ]
          }
        ]
      },
      showPies: true,
      treeType: 'jsonExample',
      newickProxy: null
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
