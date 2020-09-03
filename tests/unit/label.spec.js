import { shallowMount } from '@vue/test-utils'
import Label from '@/components/Label.vue'

describe('Label component', () => {
  it('default label renders correctly', () => {
    const comp = shallowMount(Label, {
      propsData: {
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('size set correctly', () => {
    const comp = shallowMount(Label, {
      propsData: {
        size: 1
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('x set correctly', () => {
    const comp = shallowMount(Label, {
      propsData: {
        x: 1
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('y set correctly', () => {
    const comp = shallowMount(Label, {
      propsData: {
        y: 1
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('label set correctly', () => {
    const comp = shallowMount(Label, {
      propsData: {
        label: 'label'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('circular mode set correctly', () => {
    const comp = shallowMount(Label, {
      propsData: {
        circular: true
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('color set correctly', () => {
    const comp = shallowMount(Label, {
      propsData: {
        color: 'red'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('background not set when length label is null', () => {
    const comp = shallowMount(Label, {
      propsData: {
        background: 'red'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('background set correctly', () => {
    const comp = shallowMount(Label, {
      propsData: {
        background: 'red',
        label: 'label'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('borderWidth has no effect when no label', () => {
    const comp = shallowMount(Label, {
      propsData: {
        borderWidth: 10
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('borderWidth set correctly', () => {
    const comp = shallowMount(Label, {
      propsData: {
        borderWidth: 10,
        label: 'label'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('borderColor has no effect when no label', () => {
    const comp = shallowMount(Label, {
      propsData: {
        borderColor: 'red'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('borderColor set correctly', () => {
    const comp = shallowMount(Label, {
      propsData: {
        borderColor: 'red',
        borderWidth: 10,
        label: 'label'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
  it('font-weight set correctly', () => {
    const comp = shallowMount(Label, {
      propsData: {
        fontWeight: 'bold'
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
})
