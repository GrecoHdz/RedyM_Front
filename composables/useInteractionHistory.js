import { ref, computed } from 'vue'
import { useAuthStore } from '~/middleware/auth.store'

// Global state outside the composable to act as a cache across all components
const globalHistoryCache = ref([])
const hasMoreFromApi = ref(true)
const offset = ref(0)
const isLoading = ref(false)
const currentPage = ref(0)
const limit = 5

export const useInteractionHistory = () => {
  const { $api } = useNuxtApp()
  const authStore = useAuthStore()

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
      const res = await $api(`/interacciones/usuario/${authStore.userId}?limit=${limit}&offset=${offset.value}`)
      if (res.success) {
        if (res.data.length < limit) {
          hasMoreFromApi.value = false
        }
        globalHistoryCache.value.push(...res.data)
        offset.value += limit
      }
    } catch (e) {
      console.error('Error fetching history:', e)
    } finally {
      isLoading.value = false
    }
  }

  const loadInitial = async () => {
    // Solo carga si el cache está vacío y aún hay más por cargar
    if (globalHistoryCache.value.length === 0 && hasMoreFromApi.value) {
      await fetchHistory()
    }
  }

  const paginatedHistory = computed(() => {
    const start = currentPage.value * limit
    return globalHistoryCache.value.slice(start, start + limit)
  })

  const hasNextPage = computed(() => {
    const startNext = (currentPage.value + 1) * limit
    return startNext < globalHistoryCache.value.length || hasMoreFromApi.value
  })

  const hasPrevPage = computed(() => {
    return currentPage.value > 0
  })

  const nextPage = async () => {
    if (!hasNextPage.value) return
    const startNext = (currentPage.value + 1) * limit
    // Si no tenemos suficientes datos cacheados para la siguiente página, fetch
    if (startNext >= globalHistoryCache.value.length && hasMoreFromApi.value) {
      await fetchHistory()
    }
    // Verificamos de nuevo por si el fetch no trajo más datos (ej. si justo eran multiplos de 5 y ya no hay más)
    if ((currentPage.value + 1) * limit < globalHistoryCache.value.length || globalHistoryCache.value.length % limit !== 0 || !hasMoreFromApi.value) {
        // Solo avanzamos la pagina si realmente hay datos para mostrar o si ya estamos listos
        if (globalHistoryCache.value.slice((currentPage.value + 1) * limit).length > 0) {
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
    fetchHistory,
    loadInitial,
    nextPage,
    prevPage
  }
}
