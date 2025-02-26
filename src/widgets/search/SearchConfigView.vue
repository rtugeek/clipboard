<script lang="ts" setup>
import { useWidget } from '@widget-js/vue3'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { searchActionList } from '@/widgets/search/model/ClipboardAction'
import ClipboardSearchWidget from '@/widgets/search/ClipboardSearch.widget'
import '@widget-js/ai-component/dist/ai-component.css'
import { useAiConfigStore } from '@/stores/useAiConfigStore'
import { ElMessage } from 'element-plus'

const shortcut = useStorage(`${ClipboardSearchWidget.name}.shortcut`, 'Meta+Alt+S')
const activeTab = ref('common')
const aiConfigStore = useAiConfigStore()
const searchPlatform = useStorage(`${ClipboardSearchWidget.name}.platform`, 'google')

useWidget()

function onAiConfigSave() {
  ElMessage.success('已保存')
}
</script>

<template>
  <WidgetBaseDialog
    title="设置"
  >
    <template #body>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="常用设置" name="common">
          <el-alert type="info" :closable="false">
            按下快捷键搜索剪贴板内容，不用鼠标点击搜索框
          </el-alert>
          <el-form style="margin-top: 12px">
            <el-form-item label="搜索快捷键">
              <WidgetBindShortcutField v-model="shortcut" />
            </el-form-item>
            <el-form-item label="搜索平台">
              <el-radio-group v-model="searchPlatform">
                <el-radio v-for="platform in searchActionList" :key="platform.value" :label="platform.value">
                  {{ platform.title }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="AI设置" name="ai">
          <AiConfigForm v-model="aiConfigStore.aiConfig" v-model:value="aiConfigStore.selectedService" @submit="onAiConfigSave" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </WidgetBaseDialog>
</template>

<style scoped>

</style>
