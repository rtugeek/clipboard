import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { ClipboardData } from '@/model/ClipboardData';
import { clipboardDataRepository } from '@/model/ClipboardDataRepository';
import { watchDebounced } from '@vueuse/core';

export const useClipboardStore = defineStore('clipboard', () => {
  const clipboardList = reactive<ClipboardData[]>([]);
  const inited = ref<boolean>(false);
  const selectedData = ref<ClipboardData>();

  const page = ref(1);
  const pageSize = ref(10);
  const hasMore = ref(true);
  const keyword = ref('');

  const refresh = async () => {
    page.value = 0;
    const res = await clipboardDataRepository.search({
      keyword: keyword.value,
      page: 1,
      size: pageSize.value,
    });
    clipboardList.splice(0);
    for (const item of res) {
      clipboardList.push(ClipboardData.fromJson(item));
    }
    if (!inited.value) {
      inited.value = true;
      if (clipboardList.length > 0) {
        selectedData.value = clipboardList[0];
      }
    }
    page.value++;
    hasMore.value = true;
  };

  watchDebounced(
    keyword,
    () => {
      refresh();
    },
    { debounce: 300 },
  );

  const loadMore = async () => {
    page.value++;
    clipboardDataRepository
      .search({
        keyword: keyword.value,
        page: page.value,
        size: pageSize.value,
      })
      .then((res) => {
        if (res.length == 0) {
          hasMore.value = false;
        }
        for (const item of res) {
          clipboardList.push(ClipboardData.fromJson(item));
        }
      });
  };

  const clear = () => {
    clipboardDataRepository.clear();
  };

  refresh();
  clipboardDataRepository.addDataChangeListener({
    onDataChanged(newData: ClipboardData, action: 'delete' | 'update' | 'save') {
      if (action == 'save') {
        refresh();
      } else if (action == 'delete') {
        const index = clipboardList.findIndex((item) => item.id == newData.id);
        if (index > -1) {
          clipboardList.splice(index, 1);
          //选择上一个记录
          selectedData.value = clipboardList[Math.max(0, index - 1)];
        }
      } else if (action == 'update') {
        const index = clipboardList.findIndex((item) => item.id == newData.id);
        clipboardList[index] = newData;
      }
    },
  });

  return {
    clipboardList,
    refresh,
    inited,
    selectedData,
    loadMore,
    hasMore,
    page,
    pageSize,
    clear,
    keyword,
  };
});
