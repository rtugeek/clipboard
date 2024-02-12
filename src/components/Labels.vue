<script setup lang="ts">
import { type PropType, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Plus } from '@icon-park/vue-next'

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue'])

const dynamicTags = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
function handleClose(tag: string) {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

function showInput() {
  ElMessageBox.prompt('请输入标签名', '新建标签', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    appendTo: '.clipboard',
    inputPattern: /^[\u4E00-\u9FA5_a-zA-Z0-9]{1,10}$/,
    inputErrorMessage: '最多10个字符，只能包含中文、英文、数字和下划线',
    inputValidator: (value: string) => {
      if (dynamicTags.value.includes(value)) {
        return '标签名重复'
      }
      return true
    },
  }).then(({ value }) => {
    dynamicTags.value.push(value)
  })
}
</script>

<template>
  <div class="labels">
    <slot />
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      closable
      effect="light"
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-button v-if="dynamicTags.length < 3" size="small" type="primary" plain @click="showInput">
      <Plus />
      新标签
    </el-button>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/theme';

.labels {
  display: flex;
  gap: 0.5rem;
}
</style>
