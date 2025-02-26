import { useStorage, watchDebounced } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { AiConfig } from '@widget-js/ai-component'
import { AiChatApi } from '@widget-js/ai-component'

export const useAiConfigStore = defineStore('ai-config', () => {
  const aiConfig = useStorage<AiConfig>('ai-config', {
    apiKey: '',
    url: '',
    model: '',
  })
  const selectedService = useStorage('selected-ai-service', 'deepseek')
  const isConfigured = computed(() => {
    return aiConfig.value.apiKey !== '' && aiConfig.value.url !== '' && aiConfig.value.model !== ''
  })

  function updateConfig(config: AiConfig) {
    AiChatApi.updateConfig(config)
  }

  function configToUrlParams(): string {
    return `apiKey=${aiConfig.value.apiKey}&apiBaseUrl=${encodeURIComponent(aiConfig.value.url)}&model=${aiConfig.value.model}`
  }

  updateConfig(aiConfig.value)

  watchDebounced(aiConfig, (config) => {
    updateConfig(config)
  }, { debounce: 500, deep: true })
  return { aiConfig, selectedService, configToUrlParams, isConfigured }
})
