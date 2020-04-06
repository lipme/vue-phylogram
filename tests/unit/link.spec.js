import { shallowMount } from '@vue/test-utils'
import Link from '@/components/Link.vue'

describe('Link component', () => {
  it('link renders correctly', () => {
    const comp = shallowMount(Link, {
      propsData: {
      }
    })

    expect(comp.element).toMatchSnapshot()
  })
})
