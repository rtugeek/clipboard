<script setup lang="ts">
import { Search } from '@icon-park/vue-next'
import { computed, ref, watch } from 'vue'
import { ElInput } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useClipboardWindowStore } from '@/stores/clipboardWindowStore'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])
const searchInputRef = ref<InstanceType<typeof ElInput>>()
const windowStore = useClipboardWindowStore()
const { showing } = storeToRefs(windowStore)
const keyword = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

watch(showing, (value) => {
  if (value) {
    searchInputRef.value?.focus()
  }
})
</script>

<template>
  <div class="search-box">
    <ElInput
      ref="searchInputRef"
      v-model="keyword"
      autofocus
      clearable
      style="--el-input-border-radius: 18px;"
      placeholder="输入关键词搜索"
    >
      <template #prefix>
        <Search />
      </template>
    </ElInput>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/theme';

.search-box {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1rem;
  font-size: 1.2rem;
}
</style>
