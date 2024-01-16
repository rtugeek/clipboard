<script setup lang="ts">
import { Clear, Close, SettingTwo } from '@icon-park/vue-next'
import { ref } from 'vue'
import SearchBox from '@/components/SearchBox.vue'

const keyword = ref('')

function close() {
  window.close()
}
</script>

<template>
  <header>
    <SearchBox v-model="keyword" />
    <Clear />
    <SettingTwo theme="outline" />
    <Close style="margin-left: auto" />
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/theme';

header {
  padding: 8px 12px;
  display: flex;
  background-color: #6365ff;
  justify-items: center;
  align-items: center;
  gap: 0.5rem;
  border-radius: theme.$app-border-radius theme.$app-border-radius 0 0;
  box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.3);

  .i-icon {
    color: white;
    cursor: pointer;
    font-size: 1.2em;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: rgba(255, 255, 255, 0.23);
    }
  }
}
</style>
