<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, toRaw, watch } from 'vue'
import dayjs from 'dayjs'
import { useDebounceFn } from '@vueuse/core'
import FavoriteButton from '@/components/FavoriteButton.vue'
import type { ClipboardData } from '@/model/ClipboardData'
import { clipboardDataRepository } from '@/model/ClipboardDataRepository'

const props = defineProps({
  modelValue: {
    type: Object as PropType<ClipboardData>,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
})

const time = computed(() => {
  return dayjs(props.modelValue.createdAt).format('YYYY-MM-DD HH:mm')
})

const debouncedSave = useDebounceFn(() => {
  clipboardDataRepository.update(toRaw(props.modelValue))
}, 1000)

watch(
  () => props.modelValue,
  (newVal) => {
    debouncedSave()
  },
  { deep: true },
)
</script>

<template>
  <div class="clipboard-item" :class="{ active }">
    <div class="info">
      <div class="content">
        {{ modelValue.content }}
      </div>
      <div class="created-at">
        {{ time }}
      </div>
    </div>
    <FavoriteButton v-model="modelValue.favorite" />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/theme';

$active-color: theme.$app-secondary-color;
.clipboard-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
  cursor: pointer;
  margin: 8px 12px;
  border-radius: 1rem;
  position: relative;
  background-color: theme.$app-card-color;
  transition: all 0.2s ease-in-out;
  border: 4px solid rgba(255, 255, 255, 0.5);

  &:hover {
    border: 4px solid rgba(255, 168, 125, 0.32);
  }

  &.active:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 6px;
    width: 4px;
    height: 70%;
    margin: auto;
    background-color: $active-color;
    border-radius: 1rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    user-select: none;
    line-height: 1.6rem;

    .content {
      font-size: 1em;
      font-weight: bold;
    }

    .created-at {
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
