<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, toRaw, watch } from 'vue';
import dayjs from 'dayjs';
import { useDebounceFn } from '@vueuse/core';
import FavoriteButton from '@/components/FavoriteButton.vue';
import { Delete } from '@icon-park/vue-next';
import type { ClipboardData } from '@/model/ClipboardData';
import { clipboardDataRepository } from '@/model/ClipboardDataRepository';

const props = defineProps({
  modelValue: {
    type: Object as PropType<ClipboardData>,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const time = computed(() => {
  return dayjs(props.modelValue.latestUseTime).format('MM-DD HH:mm');
});

const isFavorite = computed({
  get: () => props.modelValue.favorite,
  set: (value) => {
    props.modelValue.favorite = value;
    clipboardDataRepository.update(toRaw(props.modelValue));
  },
});

const deleteData = () => {
  clipboardDataRepository.delete(props.modelValue.id);
};
const emits = defineEmits(['click']);
</script>

<template>
  <div class="clipboard-item" @click.self="emits('click')" :class="{ active }">
    <div class="info" @click="emits('click')">
      <div class="content">
        {{ modelValue.getPreview() }}
      </div>
      <div class="desc">
        <span>最近使用：{{ time }}</span>
        <span>使用次数：{{ modelValue.useCount }}</span>
      </div>
    </div>
    <div class="actions">
      <FavoriteButton v-model="isFavorite" />
      <el-popconfirm
        title="确定删除该记录？"
        width="200"
        cancel-button-text="取消"
        confirm-button-text="确定"
        @confirm="deleteData">
        <template #reference>
          <delete />
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/theme';

$active-color: theme.$app-secondary-color;

.clipboard-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  margin: 8px 8px;
  border-radius: 0.5rem;
  position: relative;
  background-color: theme.$app-card-color;
  transition: all 0.2s ease-in-out;
  border: 4px solid rgba(255, 255, 255, 0.5);

  &:hover {
    border: 4px solid rgba(255, 168, 125, 0.32);
  }

  &.active {
    border: 4px solid $active-color;
  }

  .actions {
    display: flex;
    gap: 12px;
    align-items: center;

    .i-icon {
      font-size: 1.2em;
    }
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    user-select: none;
    gap: 0.5rem;
    width: 70%;
    line-height: 1.2rem;
    .content {
      font-size: 1.2em;
      font-weight: bold;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .desc {
      font-size: 14px;
      color: #999;
      display: flex;
      gap: 1rem;
    }
  }
}
</style>
