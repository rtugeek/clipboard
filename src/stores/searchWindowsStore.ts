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

export const useSearchWindowStore = defineStore('searchWindowStore', () => {
  const windowWidth = ref(600);
  const windowHeight = ref(56);
  const showing = ref(false);
  const maxY = ref(0);
  const minY = ref(maxY.value - windowHeight.value);
  let hideTimerId = -1;

  function clearHideTimer() {
    clearTimeout(hideTimerId);
  }

  function startHideTimer() {
    clearHideTimer();
    hideTimerId = window.setTimeout(() => {
      hide();
    }, 3000);
  }

  async function isHide() {
    const pos = await BrowserWindowApi.getPosition();
    return pos.y <= minY.value;
  }

  const animateY = useWindowAnimationY({
    duration: 500,
    transition: TransitionPresets.easeOutCubic,
    onStarted: async () => {
      await BrowserWindowApi.showInactive();
    },
    onFinished: async () => {
      const hidden = await isHide();
      if (hidden) {
        showing.value = false;
        await BrowserWindowApi.hide();
      }
    },
  });

  const show = async () => {
    await BrowserWindowApi.showInactive();
    animateY.animate(maxY.value);
    showing.value = true;
    startHideTimer();
  };

  const hide = async () => {
    animateY.animate(minY.value);
  };

  async function setup() {
    await BrowserWindowApi.setup({
      width: windowWidth.value,
      height: windowHeight.value,
      maxHeight: windowHeight.value,
      maxWidth: windowWidth.value,
      movable: false,
      resizable: false,
      alwaysOnTop: true,
    });
    await BrowserWindowApi.alignToScreen('top-center');
    await BrowserWindowApi.setPosition({ y: maxY.value });
    startHideTimer();
  }

  return { show, showing, hide, isHide, clearHideTimer, startHideTimer, setup };
});
