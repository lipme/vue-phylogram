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
           <br />Display Label
          <input type="checkbox" v-model="displayLabel" />
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
          <button @click.prevent="resetZoom">Reset Zoom</button>
          <br />
          <br />
          Copy and paste newick:
          <textarea v-model="newick" rows="10" cols="40" />
        </form>
      </div>
      <div id="rightbox">
        <Phylogram
        :width=1000
          ref="phylogram"
          :newick="newick"
          :right-angle="rightAngle"
          :branch-lengths="branchLengths"
          :margin="margin"
          :displayLabel="displayLabel"
          :labelWidth="Number(labelWidth)"
          :circular="circular"
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
      displayLabel: true,
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
      newick:
        '(((Crotalus_oreganus_oreganus_cytochrome_b:0.00800,Crotalus_horridus_cytochrome_b:0.05866):0.04732,(Thamnophis_elegans_terrestris_cytochrome_b:0.00366,Thamnophis_atratus_cytochrome_b:0.00172):0.06255):0.00555,(Pituophis_catenifer_vertebralis_cytochrome_b:0.00552,Lampropeltis_getula_cytochrome_b:0.02035):0.05762,((Diadophis_punctatus_cytochrome_b:0.06486,Contia_tenuis_cytochrome_b:0.05342):0.01037,Hypsiglena_torquata_cytochrome_b:0.05346):0.00779)',
      tree: {
        id: 'node0',
        name: 'node 0',
        branchset: [
          {
            id: 'node1',
            name: 'node 1',
            branchLength: 0.1,
            branchset: [
              {
                id: 'node2',
                name: 'node 2',
                branchLength: 0.05
              },
              {
                id: 'node3',
                name: 'node 3',
                branchLength: 0.07
              }
            ]
          },
          {
            id: 'node4',
            name: 'node 4',
            branchLength: 0.15,
            branchset: [
              {
                id: 'node5',
                name: 'node 5',
                branchLength: 0.2
              },
              {
                id: 'node6',
                name: 'node 6',
                branchLength: 0.07
              }
            ]
          }
        ]
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
  padding:20px;
}
#rightbox {
  display: table-cell;
  background-color: rgb(226, 215, 236);
  padding: 20px;
}
</style>
