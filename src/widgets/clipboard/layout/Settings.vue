<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/stores/settings';
import { WidgetBindShortcutField } from '@widget-js/vue3';
import { watch } from 'vue';
import { ShortcutApi } from '@widget-js/core';

const settingStore = useSettingsStore();
const { shortcut, historyExpiredHours } = storeToRefs(settingStore);
watch(shortcut, (value, oldValue) => {
  ShortcutApi.unregister(oldValue);
  if (value) {
    ShortcutApi.register(value);
  }
});
</script>

<template>
  <div class="settings">
    <el-card shadow="never" style="--el-color-primary: #6365ff">
      <el-form>
        <el-form-item label="快捷键">
          <WidgetBindShortcutField :clearable="false" v-model="shortcut" />
        </el-form-item>
        <el-tooltip content="记录数过多可能导致卡顿、加载缓慢">
          <el-form-item label="记录保留时长：">
            <el-radio-group v-model="historyExpiredHours">
              <el-radio :label="12"> 12小时</el-radio>
              <el-radio :label="24"> 24小时</el-radio>
              <el-radio :label="48"> 48小时</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-tooltip>
        <router-link to="/clipboard">
          <el-button type="primary">返回</el-button>
        </router-link>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.settings {
  flex: 1;
  padding: 16px;
  height: 100%;

  .el-form-item:last-child {
    margin-bottom: 0;
  }
}

a {
  text-decoration: none;
}
</style>
