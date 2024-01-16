import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { ClipboardData } from '@/model/ClipboardData'
import { clipboardDataRepository } from '@/model/ClipboardDataRepository'

export const useClipboardStore = defineStore('clipboard', () => {
  const clipboardList = reactive<ClipboardData[]>([])
  const inited = ref<boolean>(false)
  const selectedData = ref<ClipboardData>()

  const clipboardData = new ClipboardData()
  clipboardData.content = 'test'
  clipboardDataRepository.save(clipboardData)
  const page = ref(1)
  const pageSize = ref(10)
  const hasMore = ref(true)
  const refresh = async () => {
    clipboardDataRepository.load(1, pageSize.value).then((res) => {
      clipboardList.splice(0)
      for (const item of res) {
        clipboardList.push(ClipboardData.fromJson(item))
      }
      if (!inited.value) {
        inited.value = true
        if (clipboardList.length > 0) {
          selectedData.value = clipboardList[0]
        }
      }
    })
    page.value++
    hasMore.value = true
  }

  const loadMore = async () => {
    page.value++
    clipboardDataRepository.load(page.value, pageSize.value).then((res) => {
      if (res.length == 0) {
        hasMore.value = false
      }
      for (const item of res) {
        clipboardList.push(ClipboardData.fromJson(item))
      }
    })
  }

  refresh()
  return { clipboardList, refresh, inited, selectedData, loadMore, hasMore, page, pageSize }
})
