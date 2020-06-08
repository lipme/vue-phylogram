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
          <br />
         Label width:
           <input type="range" min=20 max=500 class="slider" v-model="labelWidth" />
           <br />
          <br />
           Circular layout:
         <input type="checkbox" v-model="circular" />
          <br />
          <br />
           Align Labels:
         <input type="checkbox" v-model="alignLabels" />
          <br />
          <br />
           Display tree from an object (inputTree prop):
         <input type="checkbox" v-model="displayFromTreeObject" />
          <br />
          <br />
            Show pies:
         <input type="checkbox" v-model="showPies" />
          <br />
          <br />
          <button @click.prevent="resetZoom">Reset Zoom</button>
          <br />
          <br />
          Copy and paste newick:
          <textarea v-model="newick" rows="10" cols="40" />
        </form>
      </div>
      <div id="rightbox">
        <Phylogram v-if="! displayFromTreeObject"
        :width=1000
          ref="phylogram"
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
        ></Phylogram>
        <Phylogram v-else
        :width=1000
          ref="phylogram"
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
        ></Phylogram>
      </div>
    </div>
  </div>
</template>

<script>
import Phylogram from './components/Phylogram'

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
      displayFromTreeObject: false,
      margin: {
        top: 20,
        bottom: 20,
        right: 20,
        left: 20
      },
      rightAngle: true,
      branchLengths: true,
      metadatas: {
        inputTree:
      {
        pies: {
          node1: {
            data: [{ label: 'A', value: 10, color: 'blue' },
              { label: 'B', value: 20, color: 'green' },
              { label: 'C', value: 30, color: 'red' }],
            size: 5
          },
          node4: {
            data: [{ label: 'A', value: 50, color: 'blue' },
              { label: 'B', value: 80, color: 'green' },
              { label: 'C', value: 50, color: 'red' }],
            size: 1.2
          },
          node2: {
            data: [{ label: 'A', value: 90, color: 'blue' },
              { label: 'B', value: 10, color: 'green' }
            ],
            size: 1
          }
        }
      }
      },
      newick:
        '(((Crotalus_oreganus_oreganus_cytochrome_b:0.00800,Crotalus_horridus_cytochrome_b:0.05866):0.04732,(Thamnophis_elegans_terrestris_cytochrome_b:0.00366,Thamnophis_atratus_cytochrome_b:0.00172):0.06255):0.00555,(Pituophis_catenifer_vertebralis_cytochrome_b:0.00552,Lampropeltis_getula_cytochrome_b:0.02035):0.05762,((Diadophis_punctatus_cytochrome_b:0.06486,Contia_tenuis_cytochrome_b:0.05342):0.01037,Hypsiglena_torquata_cytochrome_b:0.05346):0.00779)',
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
      showPies: true
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
  padding:20px;
}
#rightbox {
  display: table-cell;
  background-color: rgb(226, 215, 236);
  padding: 20px;
}
</style>
