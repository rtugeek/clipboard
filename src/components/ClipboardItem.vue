<script setup lang="ts">
import FavoriteButton from '@/components/FavoriteButton.vue';
import { ref } from 'vue';

const favorite = ref(false);
</script>

<template>
  <div class="clipboard-item">
    <div class="info">
      <div class="content">标记阿斯顿</div>
      <div class="created-at">2023年7月22日 15点17分</div>
    </div>
    <FavoriteButton v-model="favorite" />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/theme';

$active-color: rgb(255, 168, 125);
.clipboard-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  margin: 8px 12px;
  border-radius: 1rem;
  position: relative;
  background-color: theme.$app-card-color;
  transition: all 0.2s ease-in-out;
  border: 4px solid rgba(255, 255, 255, 0.5);

  &:hover {
    border: 4px solid rgba(255, 168, 125, 0.32);

    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 6px;
      width: 4px;
      height: 60%;
      margin: auto;
      background-color: $active-color;
      border-radius: 1rem;
    }
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
