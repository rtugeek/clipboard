<script setup lang="ts">
import { Search } from '@icon-park/vue-next';
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);
const keyword = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>

<template>
  <div class="search-box">
    <input v-model="keyword" />
    <Search />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/theme';

.search-box {
  width: 100%;
  height: 36px;
  background-color: white;
  border-radius: 45px;
  border: 2px solid theme.$app-border-color;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  .i-icon {
    font-size: 1.3em;
    color: theme.$app-icon-color;
  }

  input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 0.9em;
    font-weight: 500;
    color: #333;

    &::placeholder {
      color: #999;
    }
  }
}
</style>
