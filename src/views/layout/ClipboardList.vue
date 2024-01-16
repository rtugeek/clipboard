<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import ClipboardItem from '@/components/ClipboardItem.vue'
import type { ClipboardData } from '@/model/ClipboardData'
import { useClipboardStore } from '@/stores/clipboard'
import Spin from '@/components/Spin.vue'

function itemClick(item: ClipboardData) {
  selectedData.value = item
}

const spinner = ref()
const clipboardStore = useClipboardStore()
const { clipboardList, selectedData, hasMore, pageSize } = storeToRefs(clipboardStore)
const spinnerIsVisible = useElementVisibility(spinner)
watch(spinnerIsVisible, (value) => {
  console.log(value)
  if (value) {
    clipboardStore.loadMore()
  }
})
</script>

<template>
  <aside>
    <ElScrollbar>
      <div class="items">
        <template v-for="item in clipboardList" :key="item.id">
          <ClipboardItem :model-value="item" :active="selectedData.id == item.id" @click="itemClick(item)" />
        </template>
        <template v-if="clipboardList.length >= pageSize">
          <Spin v-if="hasMore" ref="spinner" />
          <div v-else class="no-more">
            没有更多了
          </div>
        </template>
      </div>
    </ElScrollbar>
  </aside>
</template>

<style scoped lang="scss">
@use '@/assets/theme';

aside {
  width: theme.$app-aside-width;
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  flex-direction: column;
  border-right: 2px solid theme.$app-border-color;

  .items {
    flex: 5;
  }

  .no-more {
    text-align: center;
    color: theme.$app-text-color;
    font-size: 12px;
    padding: 8px;
    margin-bottom: 8px;
  }
}
</style>
