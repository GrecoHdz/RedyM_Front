import { ref, computed } from 'vue'
import { useAuthStore } from '~/middleware/auth.store'

// Global state outside the composable to act as a cache across all components
const globalHistoryCache = ref([])
const hasMoreFromApi = ref(true)
const offset = ref(0)
const isLoading = ref(false)
const currentPage = ref(0)
const needsRefresh = ref(false)
const limit = 5

export const useInteractionHistory = () => {
  const { $api } = useNuxtApp()
  const authStore = useAuthStore()

  /**
   * Fetch interaction history (already includes missions!)
   */
  const fetchHistory = async (reset = false) => {
    if (!authStore.userId) return

    if (reset) {
      offset.value = 0
      globalHistoryCache.value = []
      hasMoreFromApi.value = true
      currentPage.value = 0
    }

    if (!hasMoreFromApi.value || isLoading.value) return

    isLoading.value = true
    try {
      const interRes = await $api(`/interacciones/usuario/${authStore.userId}?limit=${limit}&offset=${offset.value}`)

      if (interRes.success) {
        globalHistoryCache.value.push(...interRes.data)
        if (interRes.data.length < limit) {
          hasMoreFromApi.value = false
        } else {
          offset.value += limit
        }
      }
    } catch (e) {
      console.error('Error fetching history:', e)
    } finally {
      isLoading.value = false
    }
  }

  const markAsStale = () => {
    needsRefresh.value = true
  }

  const loadInitial = async (force = false) => {
    // Cargamos si: se fuerza, o el caché está marcado como sucio, o el caché está vacío y hay más por cargar
    if (force || needsRefresh.value || (globalHistoryCache.value.length === 0 && hasMoreFromApi.value)) {
      await fetchHistory(true)
      needsRefresh.value = false
    }
  }

  /**
   * Sort interaction history (already includes missions)
   */
  const sortedHistory = computed(() => {
    return [...globalHistoryCache.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  })

  const paginatedHistory = computed(() => {
    const start = currentPage.value * limit
    return sortedHistory.value.slice(start, start + limit)
  })

  const hasNextPage = computed(() => {
    const startNext = (currentPage.value + 1) * limit
    return startNext < sortedHistory.value.length || hasMoreFromApi.value
  })

  const hasPrevPage = computed(() => {
    return currentPage.value > 0
  })

  const nextPage = async () => {
    if (!hasNextPage.value) return
    const startNext = (currentPage.value + 1) * limit
    // If we don't have enough cached items, fetch more from the API
    if (startNext >= globalHistoryCache.value.length && hasMoreFromApi.value) {
      await fetchHistory()
    }
    if ((currentPage.value + 1) * limit < sortedHistory.value.length || sortedHistory.value.length % limit !== 0 || !hasMoreFromApi.value) {
      if (sortedHistory.value.slice((currentPage.value + 1) * limit).length > 0) {
        currentPage.value++
      }
    } else {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      currentPage.value--
    }
  }

  return {
    history: paginatedHistory,
    isLoading,
    hasNextPage,
    hasPrevPage,
    currentPage,
    markAsStale,
    fetchHistory,
    loadInitial,
    nextPage,
    prevPage
  }
}
