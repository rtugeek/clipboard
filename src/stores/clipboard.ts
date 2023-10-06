import { defineStore } from 'pinia';
import { ClipboardData } from '@/model/ClipboardData';
import { clipboardDataRepository } from '@/model/ClipboardDataRepository';
import { reactive, ref } from 'vue';

export const useClipboardStore = defineStore('clipboard', () => {
  const clipboardList = reactive<ClipboardData[]>([]);
  const inited = ref<boolean>(false);
  const selectedData = ref<ClipboardData>();

  const clipboardData = new ClipboardData();
  clipboardData.content='test';
  clipboardDataRepository.save(clipboardData);
  const page = ref(1);
  const pageSize = ref(10);
  const hasMore = ref(true);
  const refresh = async () => {
    clipboardDataRepository.load(1, pageSize.value).then((res) => {
      clipboardList.splice(0);
      for (let item of res) {
        clipboardList.push(ClipboardData.fromJson(item));
      }
      if (!inited.value) {
        inited.value = true;
        if (clipboardList.length > 0) {
          selectedData.value = clipboardList[0];
        }
      }
    });
    page.value++;
    hasMore.value = true;
  };

  const loadMore = async () => {
    page.value++;
    clipboardDataRepository.load(page.value, pageSize.value).then((res) => {
      if(res.length == 0){
        hasMore.value = false;
      }
      for (let item of res) {
        clipboardList.push(ClipboardData.fromJson(item));
      }
    });
  }

  refresh();
  return { clipboardList, refresh, inited,selectedData ,loadMore,hasMore,page,pageSize};
});
