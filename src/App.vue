<template>
  <div id="app">
    <svg width="500" height="500">
    <node :size=30 stroke="blue" fill="red" :stroke_width=3
    :x=50 :y=80 label="test" type="inner"></node>
    <node :size=20 stroke="blue" fill="red" :stroke_width=3
    :x=100 :y=120 label="leave" type="leave"></node>
    </svg>
  </div>
</template>

<script>
import Node from './components/Node'
export default {
  name: 'App',
  components: {
    Node
  },
  data () {
    return {
      newick: '(((EELA:0.150276,CONGERA:0.213019):0.230956,(EELB:0.263487,CONGERB:0.202633):0.246917):0.094785,((CAVEFISH:0.451027,(GOLDFISH:0.340495,ZEBRAFISH:0.390163):0.220565):0.067778,((((((NSAM:0.008113,NARG:0.014065):0.052991,SPUN:0.061003,(SMIC:0.027806,SDIA:0.015298,SXAN:0.046873):0.046977):0.009822,(NAUR:0.081298,(SSPI:0.023876,STIE:0.013652):0.058179):0.091775):0.073346,(MVIO:0.012271,MBER:0.039798):0.178835):0.147992,((BFNKILLIFISH:0.317455,(ONIL:0.029217,XCAU:0.084388):0.201166):0.055908,THORNYHEAD:0.252481):0.061905):0.157214,LAMPFISH:0.717196,((SCABBARDA:0.189684,SCABBARDB:0.362015):0.282263,((VIPERFISH:0.318217,BLACKDRAGON:0.109912):0.123642,LOOSEJAW:0.397100):0.287152):0.140663):0.206729):0.222485,(COELACANTH:0.558103,((CLAWEDFROG:0.441842,SALAMANDER:0.299607):0.135307,((CHAMELEON:0.771665,((PIGEON:0.150909,CHICKEN:0.172733):0.082163,ZEBRAFINCH:0.099172):0.272338):0.014055,((BOVINE:0.167569,DOLPHIN:0.157450):0.104783,ELEPHANT:0.166557):0.367205):0.050892):0.114731):0.295021)',
      tree: {
        id: 'node0',
        name: 'node 0',
        branchset: [{
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
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
