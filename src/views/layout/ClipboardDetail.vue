<script setup lang="ts">
import CircleButton from '@/components/CircleButton.vue';
import { useClipboardStore } from '@/stores/clipboard';
import { storeToRefs } from 'pinia';
import { History } from '@icon-park/vue-next';
import Labels from '@/components/Labels.vue';
import { clipboardDataRepository } from '@/model/ClipboardDataRepository';

const clipboardStore = useClipboardStore();
const { selectedData, clipboardList } = storeToRefs(clipboardStore);

const deleteData = async () => {
  await clipboardDataRepository.delete(selectedData.value!.id);
  const length = clipboardList.value.length;
  if (length > 1) {
    const index = clipboardList.value.indexOf(selectedData.value!);
    clipboardList.value.splice(index, 1);
    if (index >= clipboardList.value.length) {
      selectedData.value = clipboardList.value[index - 1];
    } else {
      selectedData.value = clipboardList.value[index];
    }
  } else {
    selectedData.value = undefined;
    clipboardList.value = [];
  }
};
</script>

<template>
  <div class="clipboard-detail" v-if="selectedData">
    <div class="content">
      <el-input
        v-model="selectedData.content"
        input-style="height: 100%;resize: none;border: none;outline: none;"
        type="textarea"
        :maxlength="50000"
        placeholder="Please input"
        show-word-limit />
    </div>
    <Labels v-model="selectedData.labels">
      <el-tag>
        <History />
        使用{{ selectedData.useCount }}次
      </el-tag>
    </Labels>
    <div class="buttons">
      <el-popconfirm
        title="确定删除该记录？"
        width="200"
        cancel-button-text="取消"
        confirm-button-text="确定"
        @confirm="deleteData">
        <template #reference>
          <CircleButton icon="delete" background="#FF6363" />
        </template>
      </el-popconfirm>
      <CircleButton icon="copy-one" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.clipboard-detail {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
  gap: 16px;

  .content {
    flex: 1;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    width: 100%;
    place-items: center;
    place-content: center;
  }
}
</style>
