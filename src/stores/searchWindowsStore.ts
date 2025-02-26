import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TransitionPresets } from '@vueuse/core'
import { BrowserWindowApi } from '@widget-js/core'
import { useWindowAnimationY } from '@widget-js/vue3'

export const useSearchWindowStore = defineStore('searchWindowStore', () => {
  const windowWidth = ref(700)
  const windowHeight = ref(44)
  const showing = ref(false)
  const maxY = ref(0)
  const minY = ref(maxY.value - windowHeight.value)
  let hideTimerId = -1

  function clearHideTimer() {
    clearTimeout(hideTimerId)
  }

  function startHideTimer() {
    clearHideTimer()
    hideTimerId = window.setTimeout(() => {
      // eslint-disable-next-line ts/no-use-before-define
      hide()
    }, 3000)
  }

  async function isHide() {
    const pos = await BrowserWindowApi.getPosition()
    return pos.y <= minY.value
  }

  const animateY = useWindowAnimationY({
    duration: 500,
    transition: TransitionPresets.easeOutCubic,
    onStart: async () => {
      await BrowserWindowApi.showInactive()
    },
    onComplete: async () => {
      const hidden = await isHide()
      BrowserWindowApi.setBounds({ height: windowHeight.value })
      if (hidden) {
        showing.value = false
        await BrowserWindowApi.hide()
      }
    },
  })

  const show = async () => {
    await BrowserWindowApi.setAlwaysOnTop(true)
    await BrowserWindowApi.showInactive()
    animateY.animate(maxY.value)
    showing.value = true
    startHideTimer()
  }

  const hide = async () => {
    animateY.animate(minY.value)
  }

  async function setup() {
    await BrowserWindowApi.setup({
      width: windowWidth.value,
      height: windowHeight.value,
      maxHeight: windowHeight.value,
      maxWidth: windowWidth.value,
      movable: false,
      resizable: false,
      alwaysOnTop: true,
    })
    await BrowserWindowApi.alignToScreen('top-center')
    await BrowserWindowApi.setPosition({ y: maxY.value })
    startHideTimer()
  }

  return { show, showing, hide, isHide, clearHideTimer, startHideTimer, setup }
})
