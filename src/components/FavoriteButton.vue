<script setup lang="ts">
import { Star } from '@icon-park/vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

function handleClick() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <el-tooltip class="box-item" effect="dark" content="收藏后，记录不会被清理" placement="top">
    <div class="favorite-button" @click="handleClick">
      <Star v-if="modelValue" theme="filled" fill="#fbb414" />
      <Star v-else theme="outline" fill="#ccc" />
    </div>
  </el-tooltip>
</template>

<style scoped lang="scss">
$size: 1.3em;
.favorite-button {
  position: relative;
  cursor: pointer;
  width: $size;
  height: $size;

  .i-icon {
    font-size: 1.3em;
  }
}
</style>
