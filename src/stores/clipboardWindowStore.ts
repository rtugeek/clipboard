import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'
import { TransitionPresets } from '@vueuse/core'
import { BrowserWindowApi, ClipboardApi, DeviceApi } from '@widget-js/core'
import { useWindowAnimationY } from '@widget-js/vue3'
import dayjs from 'dayjs'
import { delay } from '@/utils/TimeUtils'
import type { ClipboardData } from '@/model/ClipboardData'
import { clipboardDataRepository } from '@/model/ClipboardDataRepository'
import { useSettingsStore } from '@/stores/settings'

export const useClipboardWindowStore = defineStore('clipboardWindowStore', () => {
  const windowWidth = ref(500)
  const windowHeight = ref(400)
  const showing = ref(false)
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height

  const maxY = ref(screenHeight)
  const minY = ref(screenHeight - windowHeight.value - (screenHeight * 0.05))

  async function isHide() {
    const pos = await BrowserWindowApi.getPosition()
    return pos.y >= screenHeight
  }

  const animateY = useWindowAnimationY({
    duration: 500,
    transition: TransitionPresets.easeOutCubic,
    onStart: async () => {
      await BrowserWindowApi.restore()
      await BrowserWindowApi.show()
      await BrowserWindowApi.focus()
    },
    onComplete: async () => {
      const hidden = await isHide()
      if (hidden) {
        await BrowserWindowApi.setBounds({ height: windowHeight.value })
        await BrowserWindowApi.minimize()
        showing.value = false
      }
    },
  })

  const show = async () => {
    animateY.animate(minY.value)
    const settingsStore = useSettingsStore()
    clipboardDataRepository.clear(dayjs().subtract(settingsStore.historyExpiredHours, 'hour').toDate())
    showing.value = true
  }

  const hide = async () => {
    animateY.animate(maxY.value)
  }

  async function submit(item: ClipboardData) {
    hide()
    ClipboardApi.writeText(item.content)
    await delay(1000)
    DeviceApi.sendCtrlV()
    item.useCount++
    item.latestUseTime = new Date()
    clipboardDataRepository.update(toRaw(item))
  }

  async function setup() {
    await BrowserWindowApi.setPosition({ x: (screenWidth - windowWidth.value) / 2, y: maxY.value })
    await BrowserWindowApi.setup({
      width: windowWidth.value,
      height: windowHeight.value,
      maxHeight: windowHeight.value,
      movable: true,
      resizable: false,
      alwaysOnTop: true,
    })
  }

  return { show, showing, hide, isHide, setup, submit }
})
