<script setup lang="ts">
import { IconPark } from '@icon-park/vue-next/es/all';
import { computed } from 'vue';
import Color from 'color';

const props = defineProps({
  background: {
    type: String,
    default: 'rgb(99,101,255)',
  },
  icon: {
    type: String,
    required: true,
  },
});

const bgOpacity20 = computed(() => {
  return Color(props.background).lighten(0.2);
});
</script>

<template>
  <div class="circle-button">
    <slot>
      <icon-park :type="icon" />
    </slot>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/theme';

.circle-button {
  --bg-color: v-bind(background);
  --bg-color-opacity-20: v-bind(bgOpacity20);
  cursor: pointer;
  width: 44px;
  height: 44px;
  box-sizing: border-box;
  border-radius: 50%;
  display: flex;
  place-content: center;
  place-items: center;
  background-color: v-bind(background);
  color: white;
  font-size: 1.5em;
  transition: all 0.2s ease-in-out;
  &:active{
    transform: scale(0.9);
    box-shadow: 0 7px 20px 0 var(--bg-color-opacity-20);
  }
  &:hover {
    box-shadow: 0 7px 29px 0 var(--bg-color-opacity-20);
  }
}
</style>
