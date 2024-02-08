<script lang="ts" setup>
import { useAppBroadcast, useShortcutListener } from '@widget-js/vue3';
import { BrowserWindowApi, BrowserWindowApiEvent, ClipboardApiEvent, ShortcutApi } from '@widget-js/core';
import { ref, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type { SearchEngine } from '@/widgets/search/model/SearchPlatform';
import { search, searchPlatformList } from '@/widgets/search/model/SearchPlatform';
import { useSearchWindowStore } from '@/stores/searchWindowsStore';
import ClipboardSearchWidget from '@/widgets/search/ClipboardSearch.widget'

const data = ref('');
const searchWindowStore = useSearchWindowStore();

searchWindowStore.setup();

useAppBroadcast([ClipboardApiEvent.CHANGED, BrowserWindowApiEvent.FOCUS], async (broadcast) => {
  if (broadcast.event == ClipboardApiEvent.CHANGED) {
    data.value = broadcast.payload.content as string;
    await BrowserWindowApi.setAlwaysOnTop(true);
    searchWindowStore.show()
  }
});

const shortcut = useLocalStorage(`${ClipboardSearchWidget.name}.shortcut`, 'Meta+Alt+S', { listenToStorageChanges: true });
const searchPlatform = useLocalStorage<SearchEngine>(`${ClipboardSearchWidget.name}.platform`, 'google', {
  listenToStorageChanges: true,
});

watch(shortcut, (newShortcut, oldValue) => {
  ShortcutApi.unregister(oldValue);
  ShortcutApi.register(newShortcut);
});

ShortcutApi.register(shortcut.value);

useShortcutListener(() => {
  if (data.value) {
    search(searchPlatform.value, data.value);
  }
});

</script>

<template>
  <div class="hover-wrapper" @mouseenter="searchWindowStore.clearHideTimer()" @mouseleave="searchWindowStore.startHideTimer()">
    <div class="content">
      {{ data }}
    </div>
    <div class="actions">
      <div
        v-for="platform in searchPlatformList"
        :key="platform.value"
        class="search-engine"
        @click="search(platform.value, data)">
        <img :src="platform.icon" :alt="platform.title" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hover-wrapper {
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
