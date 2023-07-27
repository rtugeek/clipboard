<script setup lang="ts">
import { Star } from '@icon-park/vue-next';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);
const handleClick = () => {
  emit('update:modelValue', !props.modelValue);
};
</script>

<template>
  <div class="favorite-button" @click="handleClick">
    <star theme="filled" fill="#fbb414" v-if="modelValue" />
    <Star theme="outline" fill="#ccc" v-else />
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
