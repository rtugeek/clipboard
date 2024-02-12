<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { onKeyStroke, useElementVisibility, useThrottleFn } from '@vueuse/core'
import { ElMessageBox, ElScrollbar } from 'element-plus'
import ClipboardItem from '@/components/ClipboardItem.vue'
import type { ClipboardData } from '@/model/ClipboardData'
import { useClipboardStore } from '@/stores/clipboard'
import Spin from '@/components/Spin.vue'
import { useClipboardWindowStore } from '@/stores/clipboardWindowStore'
import { clipboardDataRepository } from '@/model/ClipboardDataRepository'
import 'element-plus/es/components/message-box/style/index'
import 'element-plus/es/components/message/style/index'
import { delay } from '@/utils/TimeUtils'

const spinner = ref()
const innerRef = ref<HTMLDivElement>()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const clipboardStore = useClipboardStore()
const windowStore = useClipboardWindowStore()
const { clipboardList, selectedData, hasMore, pageSize } = storeToRefs(clipboardStore)
const { showing } = storeToRefs(windowStore)
const spinnerIsVisible = useElementVisibility(spinner)
let showDeleteConfirm = false

watch(spinnerIsVisible, (value) => {
  if (value) {
    clipboardStore.loadMore()
  }
})

watch(showing, async (value) => {
  if (value) {
    await clipboardStore.refresh()
    selectedData.value = clipboardList.value[0]
    scrollbarRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

function scrollToClipboardItem(data: ClipboardData) {
  const element = document.querySelector<HTMLDivElement>(`#item-${data.id}`)
  scrollbarRef.value?.scrollTo({ top: element?.offsetTop ?? 0, behavior: 'smooth' })
}

const throttledKeyboardCallBack = useThrottleFn((e) => {
  let index = clipboardList.value.findIndex(it => it.id == selectedData.value?.id)
  if (e.code == 'ArrowUp') {
    index--
    index = index < 0 ? 0 : index
    selectedData.value = clipboardList.value[index]
    scrollToClipboardItem(selectedData.value)
  }
  else if (e.code == 'ArrowDown') {
    index++
    index = index > clipboardList.value.length - 1 ? clipboardList.value.length - 1 : index
    selectedData.value = clipboardList.value[index]
    scrollToClipboardItem(selectedData.value)
  }
  else if (e.code == 'Enter') {
    if (showDeleteConfirm) {
      ElMessageBox.close()
      clipboardDataRepository.delete(selectedData.value!.id)
    }
    else {
      windowStore.submit(selectedData.value!)
    }
  }
  else if (e.code == 'Delete' && !showDeleteConfirm) {
    deleteItem(selectedData.value!)
  }
}, 100)

function deleteItem(data: ClipboardData) {
  showDeleteConfirm = true
  ElMessageBox.confirm('确定删除该记录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnPressEscape: true,
    type: 'warning',
    appendTo: '#clipboard',
  })
    .then(() => {
      clipboardDataRepository.delete(data.id)
    })
    .finally(async () => {
      await delay(300)
      showDeleteConfirm = false
    })
}

onKeyStroke(['ArrowUp', 'ArrowDown', 'Enter', 'Delete'], throttledKeyboardCallBack)

function itemClick(item: ClipboardData) {
  selectedData.value = item
  windowStore.submit(item)
}
</script>

<template>
  <aside>
    <ElScrollbar ref="scrollbarRef">
      <div ref="innerRef" class="items">
        <template v-for="item in clipboardList" :key="`key-${item.id}-${item.updateTime}`">
          <ClipboardItem
            :id="`item-${item.id}`"
            v-model:favorite="item.favorite"
            :model-value="item"
            :active="selectedData?.id == item.id"
            @delete="deleteItem(item)"
            @click="itemClick(item)"
          />
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
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  flex-direction: column;

  .items {
    flex: 5;
    position: relative;
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
