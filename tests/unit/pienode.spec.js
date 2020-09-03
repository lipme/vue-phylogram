import { shallowMount } from '@vue/test-utils'
import PieNode from '@/components/PieNode.vue'

const validator = PieNode.props.data.validator

describe('PieNode component', () => {
  it('does not render if no data', () => {
    const comp = shallowMount(PieNode, {
      propsData: {
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('data set correctly', () => {
    const comp = shallowMount(PieNode, {
      propsData: {
        data: [{ value: 10, color: 'green', label: 'value 1' }]
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('error when value key not set', () => {
    expect(validator([{ color: 'green', label: 'value 1' }])).toBe(false)
  })
  it('error when color key not set', () => {
    expect(validator([{ value: 10, label: 'value 1' }])).toBe(false)
  })
  it('error when label key not set', () => {
    expect(validator([{ color: 'green', value: 10 }])).toBe(false)
  })
  it('error when value key is not a number', () => {
    expect(validator([{ value: 'tuc', color: 'green', label: 'value 1' }])).toBe(false)
  })
  it('size set correctly', () => {
    const comp = shallowMount(PieNode, {
      propsData: {
        data: [{ value: 10, color: 'green', label: 'value 1' }],
        size: 1
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('x set correctly', () => {
    const comp = shallowMount(PieNode, {
      propsData: {
        data: [{ value: 10, color: 'green', label: 'value 1' }],
        x: 1
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('y set correctly', () => {
    const comp = shallowMount(PieNode, {
      propsData: {
        data: [{ value: 10, color: 'green', label: 'value 1' }],
        y: 1
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('circular mode set correctly', () => {
    const comp = shallowMount(PieNode, {
      propsData: {
        data: [{ value: 10, color: 'green', label: 'value 1' }],
        circular: true
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
})
