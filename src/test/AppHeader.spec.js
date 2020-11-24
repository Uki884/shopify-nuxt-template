import { mount } from '@vue/test-utils'
import AppHeader from '@/components/AppHeader.vue'

describe('AppHeader', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
