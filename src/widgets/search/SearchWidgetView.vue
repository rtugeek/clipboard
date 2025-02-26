<script lang="ts" setup>
import { useAppBroadcast, useShortcutListener } from '@widget-js/vue3'
import { BrowserWindowApi, ClipboardApiEvent, ShortcutApi, WidgetApi } from '@widget-js/core'
import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import type { SearchEngine } from '@/widgets/search/model/ClipboardAction'
import { useSearchWindowStore } from '@/stores/searchWindowsStore'
import ClipboardSearchWidget from '@/widgets/search/ClipboardSearch.widget'
import ActionIcon from '@/widgets/search/components/ActionIcon.vue'
import { SearchUtils } from '@/utils/SearchUtils'
import { useAiConfigStore } from '@/stores/useAiConfigStore'

const data = ref('')
const searchWindowStore = useSearchWindowStore()
const aiConfigStore = useAiConfigStore()
searchWindowStore.setup()

useAppBroadcast([ClipboardApiEvent.CHANGED], async (broadcast) => {
  if (broadcast.event == ClipboardApiEvent.CHANGED) {
    data.value = broadcast.payload.content as string
    if (data.value) {
      await BrowserWindowApi.setAlwaysOnTop(true)
      searchWindowStore.show()
    }
  }
})

const shortcut = useStorage(`${ClipboardSearchWidget.name}.shortcut`, 'Meta+Alt+S')
const searchPlatform = useStorage<SearchEngine>(`${ClipboardSearchWidget.name}.platform`, 'google')

watch(shortcut, (newShortcut, oldValue) => {
  ShortcutApi.unregister(oldValue)
  ShortcutApi.register(newShortcut)
})

ShortcutApi.register(shortcut.value)

useShortcutListener(() => {
  if (data.value) {
    SearchUtils.search(searchPlatform.value, data.value)
  }
})

function onMindmapClick() {
  const url = `https://widgetjs.cn/ai/page/mindmap?content=${data.value}&${aiConfigStore.configToUrlParams()}`
  BrowserWindowApi.openUrl(url, {
    center: true,
    width: 800,
    minWidth: 800,
    minHeight: 800,
    frame: true,
    resizable: true,
    transparent: false,
    height: 600,
  })
}
</script>

<template>
  <div class="hover-wrapper" @mouseenter="searchWindowStore.clearHideTimer()" @mouseleave="searchWindowStore.startHideTimer()">
    <div class="content">
      {{ data }}
    </div>
    <div class="actions">
      <ActionIcon emoji="🤯" label="思维导图" @click="onMindmapClick" />
      <ActionIcon emoji="🔍" label="搜索" @click="SearchUtils.search(searchPlatform, data)" />
      <ActionIcon emoji="⚙️" label="设置" @click="WidgetApi.openConfigPage()" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.hover-wrapper {
  height: 44px;
  display: flex;
  background-color: white;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  padding: 8px 16px;
  margin: 0 4px 4px 4px;
  gap: 12px;
  align-items: center;
  box-sizing: border-box;
  border-image: linear-gradient(221deg, #a8a8a8 0%, rgba(168, 168, 168, 0) 70%) 1;
  backdrop-filter: blur(40px);
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);

  .content {
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
    overflow: hidden;
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    gap: 12px;

    .search-engine {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      cursor: pointer;
      justify-content: center;

      img {
        width: 24px;
        height: 24px;
        background: transparent;
      }
      &:hover {
        box-sizing: border-box;
        border-radius: 4px;
        background-color: #d9d9d9;
      }
    }
  }
}
</style>
