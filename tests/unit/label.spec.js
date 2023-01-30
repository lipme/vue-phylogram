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
import TreeLabel from '@/components/label'

describe('Label component', () => {
  it('default label renders correctly', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('size set correctly', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        size: 1
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('x set correctly', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        x: 1
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('y set correctly', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        y: 1
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('label set correctly', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        label: 'label'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('circular mode set correctly', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        circular: true
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('color set correctly', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        color: 'red'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('background not set when length label is null', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        background: 'red'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('background set correctly', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        background: 'red',
        label: 'label'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('borderWidth has no effect when no label', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        borderWidth: 10
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('borderWidth set correctly', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        borderWidth: 10,
        label: 'label'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('borderColor has no effect when no label', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        borderColor: 'red'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('borderColor set correctly', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        borderColor: 'red',
        borderWidth: 10,
        label: 'label'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('font-weight set correctly', () => {
    const comp = shallowMount(TreeLabel, {
      propsData: {
        fontWeight: 'bold'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
})
