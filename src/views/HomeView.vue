<script setup lang="ts">
import { ref } from 'vue';
import SearchBox from '@/components/SearchBox.vue';
import ClipboardItem from '@/components/ClipboardItem.vue';
import { SettingTwo, Clear } from '@icon-park/vue-next';
import CircleButton from '@/components/CircleButton.vue';

const keyword = ref('');
</script>

<template>
  <div class="clipboard">
    <aside>
      <header>
        <SearchBox v-model="keyword" />
        <Clear />
        <SettingTwo theme="outline" />
      </header>
      <div class="items">
        <ClipboardItem />
        <ClipboardItem />
        <ClipboardItem />
      </div>
    </aside>
    <main>
      <div class="content">
        <div class="title">标记阿斯顿</div>
        <div class="content">标记阿斯顿</div>
      </div>
      <CircleButton />
      <CircleButton background="#0f0" />
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
  border: 2px solid theme.$app-border-color;
  overflow: hidden;
  color: theme.$app-text-color;

  aside {
    width: 600px;
    height: 100%;
    display: flex;
    flex: 4;
    flex-direction: column;
    border-right: 2px solid theme.$app-border-color;

    header {
      padding: 16px;
      display: flex;
      background-color: #6365ff;
      justify-items: center;
      align-items: center;
      gap: 1rem;

      .i-icon {
        color: white;
        cursor: pointer;
        font-size: 1.5em;
      }
    }

    .items {
      flex: 5;
      overflow-y: auto;
    }
  }

  main {
    flex: 6;
    background-color: #f0f4f5;
    padding: 16px;
  }
}
</style>
