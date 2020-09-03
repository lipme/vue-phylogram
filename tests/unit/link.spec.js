import { shallowMount } from '@vue/test-utils'
import Link from '@/components/Link.vue'

describe('Link component', () => {
  it('default link renders correctly', () => {
    const comp = shallowMount(Link, {
      propsData: {
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('color set correctly', () => {
    const comp = shallowMount(Link, {
      propsData: {
        stroke: 'red'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('width set correctly', () => {
    const comp = shallowMount(Link, {
      propsData: {
        strokeWidth: 1
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('smooth mode set correctly', () => {
    const comp = shallowMount(Link, {
      propsData: {
        rightAngle: false
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('circular mode set correctly', () => {
    const comp = shallowMount(Link, {
      propsData: {
        circular: true
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('circular mode and smooth mode set correctly', () => {
    const comp = shallowMount(Link, {
      propsData: {
        circular: true,
        rightAngle: false
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('source set correctly', () => {
    const comp = shallowMount(Link, {
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
    const comp = shallowMount(Link, {
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
    const comp = shallowMount(Link, {
      propsData: {
        dashed: true
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
})
