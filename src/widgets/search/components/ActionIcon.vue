<script setup lang="ts">
defineProps({
  emoji: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="icon">
    <div class="emoji">
      {{ emoji }}
    </div>
    <span class="label">{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
.icon{
  border-radius: 16px;
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 1;
  background-color: #f1efed;
  box-sizing: border-box;
  cursor: pointer;
  .label{
    width: 0;
    color: #323131;
    font-size: 0.8rem;
    font-weight: bold;
    opacity: 0;
  }
  .emoji{
    font-size: 1.3rem;
  }
  &:hover {
    width: fit-content;
    padding-left: 4px;
    padding-right: 8px;
    background-color: #d9d9d9;
    .label{
      width: auto;
      opacity: 1;
      display: block;
    }
  }
}
</style>
