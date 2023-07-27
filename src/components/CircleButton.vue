<script setup lang="ts">
import { CopyOne } from '@icon-park/vue-next';
import { computed } from 'vue';
import Color from 'color';

const props = defineProps({
  background: {
    type: String,
    default: '#6365ff',
  },
});

const halfOpacity = computed(() => {
  return Color(props.background).lighten(0.2);
});
</script>

<template>
  <div class="circle-button">
    <slot>
      <copy-one theme="outline" />
    </slot>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/theme';

.circle-button {
  cursor: pointer;
  width: 48px;
  height: 48px;
  border: 3px solid v-bind(halfOpacity);
  box-sizing: border-box;
  border-radius: 50%;
  display: flex;
  place-content: center;
  place-items: center;
  background-color: v-bind(background);
  color: white;
  font-size: 1.5em;
}
</style>
