<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import dayjs from 'dayjs'
import { Delete } from '@icon-park/vue-next'
import { useVModel } from '@vueuse/core'
import FavoriteButton from '@/components/FavoriteButton.vue'
import type { ClipboardData } from '@/model/ClipboardData'

const props = defineProps({
  modelValue: {
    type: Object as PropType<ClipboardData>,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['click', 'delete', 'update:favorite'])
const time = computed(() => {
  return dayjs(props.modelValue.latestUseTime).format('MM-DD HH:mm')
})

const favoriteModel = useVModel(props, 'favorite', emits)
</script>

<template>
  <div class="clipboard-item" :class="{ active }" @click.self="emits('click')">
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
      <FavoriteButton v-model="favoriteModel" />
      <Delete />
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
      font-size: 1rem;
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
