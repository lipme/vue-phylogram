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
import TreeLink from '@/components/link'

describe('TreeLink component', () => {
  it('default link renders correctly', () => {
    const comp = shallowMount(TreeLink, {
      propsData: {
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('color set correctly', () => {
    const comp = shallowMount(TreeLink, {
      propsData: {
        stroke: 'red'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('width set correctly', () => {
    const comp = shallowMount(TreeLink, {
      propsData: {
        strokeWidth: 1
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('smooth mode set correctly', () => {
    const comp = shallowMount(TreeLink, {
      propsData: {
        rightAngle: false
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('circular mode set correctly', () => {
    const comp = shallowMount(TreeLink, {
      propsData: {
        circular: true
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('circular mode and smooth mode set correctly', () => {
    const comp = shallowMount(TreeLink, {
      propsData: {
        circular: true,
        rightAngle: false
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('source set correctly', () => {
    const comp = shallowMount(TreeLink, {
      propsData: {
        source: {
          x: 2,
          y: 1
        }
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('target set correctly', () => {
    const comp = shallowMount(TreeLink, {
      propsData: {
        target: {
          x: 4,
          y: 6
        }
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('dashed mode set correctly', () => {
    const comp = shallowMount(TreeLink, {
      propsData: {
        dashed: true
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
})
