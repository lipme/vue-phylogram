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

const jsonTreeWithOtherLengthKey = {
  id: 'ABCDE',
  branchset: [
    {
      id: 'ABCD',
      branchLength: 0.2,
      branchset: [
        {
          branchLength: 0.3,
          id: 'AB',
          branchset: [
            {
              name: 'A',
              id: 'A',
              branchLength: 0.2
            },
            {
              id: 'B',
              name: 'B',
              branchLength: 0.3
            }
          ]
        },
        {
          branchLength: 0.2,
          id: 'CD',
          name: 'CD',
          branchset: [
            {
              id: 'C',
              name: 'C',
              branchLength: 0.5
            },
            {
              id: 'D',
              name: 'D',
              branchLength: 0.3
            }
          ]
        }
      ]
    },
    {
      id: 'E',
      name: 'E',
      branchLength: 0.7
    }
  ]
}

const jsonTreeWithOtherBranchKey = {
  id: 'ABCDE',
  children: [
    {
      id: 'ABCD',
      length: 0.2,
      children: [
        {
          length: 0.3,
          id: 'AB',
          children: [
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
          children: [
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
  it('Tree from inputTree with different length key works', () => {
    const comp = shallowMount(Phylogram, {
      propsData: {
        inputTree: jsonTreeWithOtherLengthKey,
        branchLengthKey: 'branchLength'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('Tree from inputTree with different branch key works', () => {
    const comp = shallowMount(Phylogram, {
      propsData: {
        inputTree: jsonTreeWithOtherBranchKey,
        branchKey: 'children'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
})
