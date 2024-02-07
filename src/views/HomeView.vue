<script setup lang="ts">
import Header from '@/views/layout/Header.vue';
import { useAppBroadcast, useShortcutListener } from '@widget-js/vue3';
import { onMounted, watch } from 'vue';
import { ClipboardApiEvent, ShortcutApi } from '@widget-js/core';
import { onKeyStroke } from '@vueuse/core';
import { useSettingsStore } from '@/stores/settings';
import { delay } from '@/utils/TimeUtils';
import { useRoute, useRouter } from 'vue-router';
import { useWindowStore } from '@/stores/window';
import { clipboardDataRepository } from '@/model/ClipboardDataRepository';
import { ClipboardData } from '@/model/ClipboardData';

const windowStore = useWindowStore();
const settingsStore = useSettingsStore();
ShortcutApi.register(settingsStore.shortcut);
useShortcutListener(async (shortcut) => {
  if (shortcut == settingsStore.shortcut) {
    if (await windowStore.isHide()) {
      windowStore.show();
    } else {
      windowStore.hide();
    }
  }
});

useAppBroadcast([ClipboardApiEvent.CHANGED], async (broadcast) => {
  if (broadcast.event == ClipboardApiEvent.CHANGED) {
    const text = broadcast.payload.content as string;

    if (!(await clipboardDataRepository.exists(text))) {
      const clipboardData = new ClipboardData();
      clipboardData.content = text;
      clipboardData.type = 'text';
      clipboardDataRepository.save(clipboardData);
    }
  }
});

onMounted(async () => {
  await windowStore.setup();
  await delay(500);
  windowStore.show();
});

const router = useRouter();
const route = useRoute();
onKeyStroke(['Escape'], (e) => {
  if (e.code == 'Escape') {
    if (route.path == '/') {
      windowStore.hide();
    } else {
      router.back();
    }
  }
  e.preventDefault();
});
</script>

<template>
  <div id="clipboard" class="clipboard">
    <Header @close="windowStore.hide" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/theme';

.clipboard {
  width: calc(100vw - 32px);
  height: calc(100vh - 32px);
  background-color: theme.$app-background-color;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  position: relative;
  flex-direction: column;
  color: theme.$app-text-color;
  overflow: hidden;

  main {
    display: flex;
    background-color: #f0f4f5;
    overflow: hidden;
    height: 100%;
    border-radius: 0 0 16px 16px;
    border-bottom: 2px solid theme.$app-border-color;
    border-left: 2px solid theme.$app-border-color;
    border-right: 2px solid theme.$app-border-color;
  }
}
</style>
