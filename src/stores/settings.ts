import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settingsStore', {
  state() {
    return {
      historyExpiredHours: 12,
      shortcut: 'Meta+Alt+V',
      enableQuickSearch: true,
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'settings',
        storage: localStorage,
      },
    ],
  },
})
