<script setup lang="ts">
import Header from '@/views/layout/Header.vue';
import ClipboardList from '@/views/layout/ClipboardList.vue';
import ClipboardDetail from '@/views/layout/ClipboardDetail.vue';
import Settings from "@/views/layout/Settings.vue";
</script>

<template>
  <div class="clipboard" id="clipboard">
    <Header />
    <main>
      <ClipboardList model-value="" />
      <ClipboardDetail />
      <Settings/>
    </main>
  </div>
</template>
<style scoped lang="scss">
@use '@/assets/theme';

.clipboard {
  width: 800px;
  height: 500px;
  background-color: theme.$app-background-color;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  position: relative;
  flex-direction: column;
  color: theme.$app-text-color;
  overflow: hidden;
  main {
    height: 100%;
    display: flex;
    background-color: #f0f4f5;
    overflow: hidden;
    border-radius: 0 0 16px 16px;
    border-bottom: 2px solid theme.$app-border-color;
    border-left: 2px solid theme.$app-border-color;
    border-right: 2px solid theme.$app-border-color;
  }
}
</style>
