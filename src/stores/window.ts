import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';
import { TransitionPresets } from '@vueuse/core';
import { BrowserWindowApi, ClipboardApi, DeviceApi } from '@widget-js/core';
import { useWindowAnimationY } from '@widget-js/vue3';
import { delay } from '@/utils/TimeUtils';
import type { ClipboardData } from '@/model/ClipboardData';
import consola from 'consola';
import { clipboardDataRepository } from '@/model/ClipboardDataRepository';
import dayjs from 'dayjs';
import { useSettingsStore } from '@/stores/settings';

export const useWindowStore = defineStore('windowStore', () => {
  const windowWidth = ref(500);
  const windowHeight = ref(400);
  const showing = ref(false);
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const maxY = ref(screenHeight);
  const minY = ref(screenHeight - windowHeight.value - 54);
  const minX = ref((screenWidth - windowWidth.value) / 2);

  async function isHide() {
    const pos = await BrowserWindowApi.getPosition();
    consola.log('hide2', pos.y, screenHeight, pos.y >= screenHeight);
    return pos.y >= screenHeight;
  }

  const animateY = useWindowAnimationY({
    duration: 500,
    transition: TransitionPresets.easeOutCubic,
    onStarted: async () => {
      await BrowserWindowApi.restore();
      await BrowserWindowApi.show();
      await BrowserWindowApi.focus();
    },
    onFinished: async () => {
      const hidden = await isHide();
      consola.log(animateY.positionY);
      if (hidden) {
        consola.info('hide');
        await BrowserWindowApi.minimize();
        showing.value = false;
      }
    },
  });

  const show = async () => {
    animateY.animate(minY.value);
    const settingsStore = useSettingsStore();
    clipboardDataRepository.clear(dayjs().subtract(settingsStore.historyExpiredHours, 'hour').toDate());
    showing.value = true;
  };

  const hide = async () => {
    animateY.animate(maxY.value);
  };

  async function submit(item: ClipboardData) {
    hide();
    console.log(item.content);
    ClipboardApi.writeText(item.content);
    await delay(1000);
    DeviceApi.sendCtrlV();
    item.useCount++;
    item.latestUseTime = new Date();
    clipboardDataRepository.update(toRaw(item));
  }

  async function setup() {
    await BrowserWindowApi.setPosition({ x: (screenWidth - windowWidth.value) / 2, y: maxY.value });
    await BrowserWindowApi.setup({
      width: windowWidth.value,
      height: windowHeight.value,
      movable: true,
      alwaysOnTop: true,
    });
  }

  return { show, showing, hide, isHide, setup, submit };
});
