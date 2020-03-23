import { shallowMount } from '@vue/test-utils'
import Node from '@/components/Node.vue'

describe('Node component', () => {
  it('root node renders correctly', () => {
    const comp = shallowMount(Node, {
      propsData: { type: 'root', size: 5 }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('inner node renders correctly', () => {
    const comp = shallowMount(Node, {
      propsData: { type: 'inner', size: 3 }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('leave node renders correctly', () => {
    const comp = shallowMount(Node, {
      propsData: { type: 'inner', size: 3 }
    })

    expect(comp.element).toMatchSnapshot()
  })
})
