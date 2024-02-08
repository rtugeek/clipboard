<script setup lang="ts">
import { Clear, Close, SettingTwo } from '@icon-park/vue-next';
import SearchBox from '@/components/SearchBox.vue';
import { useClipboardStore } from '@/stores/clipboard';
import { storeToRefs } from 'pinia';

const emits = defineEmits(['close']);
const clipboardStore = useClipboardStore();
const { keyword } = storeToRefs(clipboardStore);


</script>

<template>
  <header v-drag-window>
    <SearchBox v-model="keyword" />
<!--    <SortAmountDown />-->
    <el-popconfirm
      title="确定清空所有未收藏记录？"
      width="200"
      cancel-button-text="取消"
      confirm-button-text="确定"
      @confirm="clipboardStore.clear">
      <template #reference>
        <Clear />
      </template>
    </el-popconfirm>
    <router-link to="/clipboard/settings">
      <SettingTwo theme="outline" />
    </router-link>
    <Close style="margin-left: auto" @click="emits('close')" />
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/theme';

header {
  padding: 8px 12px;
  display: flex;
  background-color: #6365ff;
  justify-items: center;
  align-items: center;
  gap: 0.5rem;
  border-radius: theme.$app-border-radius theme.$app-border-radius 0 0;
  box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.3);

  .i-icon {
    color: white;
    cursor: pointer;
    font-size: 1.2em;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: rgba(255, 255, 255, 0.23);
    }
  }
}
</style>
