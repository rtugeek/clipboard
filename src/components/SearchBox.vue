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
    <ElInput v-model="keyword" clearable style="--el-input-border-radius:18px"  placeholder="输入关键词搜索">
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

}
</style>
