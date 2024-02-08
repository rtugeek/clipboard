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

  const initGuide = () => {
    const guide = localStorage.getItem('clipboard_guide_5');
    if (!guide) {
      localStorage.setItem('clipboard_guide', '1');
      const clipboardData1 = new ClipboardData();
      clipboardData1.content = '按下 Win+Alt+V 呼出窗口，快捷键在设置⚙里可以修改';
      clipboardData1.favorite = true;

      const clipboardData4 = new ClipboardData();
      clipboardData4.content = '点击⭐可以收藏内容，收藏的内容不会被清理';
      clipboardData4.favorite = true;

      const clipboardData2 = new ClipboardData();
      clipboardData2.content = '点击内容直接复制到剪贴板';
      clipboardData2.favorite = false;

      const clipboardData3 = new ClipboardData();
      clipboardData3.content = '按上下键可以选择内容，按下回车复制';
      clipboardData3.favorite = true;

      clipboardDataRepository.save(clipboardData1);
      clipboardDataRepository.save(clipboardData2);
      clipboardDataRepository.save(clipboardData3);
      clipboardDataRepository.save(clipboardData4);
      return true;
    }
    return false;
  };

  initGuide();

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
