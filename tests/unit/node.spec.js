import { shallowMount } from '@vue/test-utils'
import Node from '@/components/Node.vue'

describe('Node component', () => {
  it('root node renders correctly', () => {
    const comp = shallowMount(Node, {
      propsData: {
        type: 'root',
        size: 5,
        stroke_width: 3,
        x: 30,
        y: 10,
        label: 'root',
        stroke: 'blue',
        fill: 'red'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('inner node renders correctly', () => {
    const comp = shallowMount(Node, {
      propsData: {
        type: 'inner',
        size: 5,
        stroke_width: 3,
        x: 50,
        y: 80,
        label: 'inner',
        stroke: 'red',
        fill: 'yellow'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('leave node renders correctly', () => {
    const comp = shallowMount(Node, {
      propsData: {
        type: 'inner',
        size: 3,
        stroke_width: 3,
        x: 100,
        y: 120,
        label: 'leave',
        stroke: 'yellow',
        fill: 'blue'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
})
