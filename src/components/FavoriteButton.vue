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
  <div class="favorite-button" @click="handleClick">
    <Star v-if="modelValue" theme="filled" fill="#fbb414" />
    <Star v-else theme="outline" fill="#ccc" />
  </div>
</template>

<style scoped lang="scss">
$size: 1.3em;
.favorite-button {
  position: relative;
  cursor: pointer;
  width: $size;
  height: $size;
  .i-icon {
    font-size: $size;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
