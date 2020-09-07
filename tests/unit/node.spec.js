import { shallowMount } from '@vue/test-utils'
import Node from '@/components/node'

describe('Node component', () => {
  it('default node renders correctly', () => {
    const comp = shallowMount(Node)

    expect(comp.element).toMatchSnapshot()
  })
  it('node size set correctly', () => {
    const comp = shallowMount(Node, {
      propsData: {
        size: 10
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('node x set correctly', () => {
    const comp = shallowMount(Node, {
      propsData: {
        x: 100
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('node y set correctly', () => {
    const comp = shallowMount(Node, {
      propsData: {
        y: 100
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('node position in circular mode set correctly', () => {
    const comp = shallowMount(Node, {
      propsData: {
        circular: true
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('show mode set correctly', () => {
    const comp = shallowMount(Node, {
      propsData: {
        show: false
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('stroke color set correctly', () => {
    const comp = shallowMount(Node, {
      propsData: {
        strokeColor: 'black'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('fill color set correctly', () => {
    const comp = shallowMount(Node, {
      propsData: {
        fill: 'black'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('collapsed mode set correctly', () => {
    const comp = shallowMount(Node, {
      propsData: {
        collapsed: true
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
})
