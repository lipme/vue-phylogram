import { shallowMount } from '@vue/test-utils'
import Phylogram from '@/components/phylogram'
const jsonTree = {
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
}

const newick = '(((A:0.2, B:0.3):0.3,(C:0.5, D:0.3):0.2):0.3, E:0.7):1.0'

describe('Phylogram component', () => {
  it('does not render if no props inputTree or newick', () => {
    const comp = shallowMount(Phylogram, {
      propsData: {
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('Tree from inputTree works', () => {
    const comp = shallowMount(Phylogram, {
      propsData: {
        inputTree: jsonTree
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('Tree from newick works', () => {
    const comp = shallowMount(Phylogram, {
      propsData: {
        newick: newick
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
})
