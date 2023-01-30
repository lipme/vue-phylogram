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
import TreeNode from '@/components/node'

describe('TreeNode component', () => {
  it('default node renders correctly', () => {
    const comp = shallowMount(TreeNode)

    expect(comp.element).toMatchSnapshot()
  })
  it('node size set correctly', () => {
    const comp = shallowMount(TreeNode, {
      propsData: {
        size: 10
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('node x set correctly', () => {
    const comp = shallowMount(TreeNode, {
      propsData: {
        x: 100
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('node y set correctly', () => {
    const comp = shallowMount(TreeNode, {
      propsData: {
        y: 100
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('node position in circular mode set correctly', () => {
    const comp = shallowMount(TreeNode, {
      propsData: {
        circular: true
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('show mode set correctly', () => {
    const comp = shallowMount(TreeNode, {
      propsData: {
        show: false
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('stroke color set correctly', () => {
    const comp = shallowMount(TreeNode, {
      propsData: {
        strokeColor: 'black'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('fill color set correctly', () => {
    const comp = shallowMount(TreeNode, {
      propsData: {
        fill: 'black'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('collapsed mode set correctly', () => {
    const comp = shallowMount(TreeNode, {
      propsData: {
        collapsed: true
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
})
