import { ref } from 'vue'
import { useAuthStore } from '~/middleware/auth.store'

export const usePostsLoader = (options = {}) => {
  const { $api } = useNuxtApp()
  const auth = useAuthStore()
  
  const posts = ref([])
  const page = ref(1)
  const limit = options.limit || 10
  const hasMore = ref(true)
  const isLoading = ref(false)
  const error = ref(null)
  const isLocked = ref(false)
  
  const CACHE_EXPIRATION = 1000 * 60 * 5 // 5 minutos

  // La clave de caché se evalúa dinámicamente para evitar problemas de timing
  // cuando auth.user aún es null al momento de crear el composable (arranque PWA)
  const getCacheKey = () => `posts_cache_${auth.user?.id_usuario || 'guest'}`

  const loadFromCache = () => {
    if (typeof localStorage === 'undefined') return false
    const CACHE_KEY = getCacheKey()
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
          posts.value = data
          return true
        }
      } catch (e) {
        console.error('Error al cargar caché:', e)
      }
    }
    return false
  }

  const saveToCache = (data) => {
    if (typeof localStorage === 'undefined') return
    const CACHE_KEY = getCacheKey()
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch (e) {
      console.error('Error al guardar caché:', e)
    }
  }

  // Función de mapeo para estandarizar el objeto de publicación
  const mapPost = (p, rewardsConfig) => {
    const postDate = new Date(p.fecha)
    const diffMs = Date.now() - postDate
    const diffMin = Math.round(diffMs / 60000)
    let timeLabel = 'Hace un momento'
    
    if (diffMin >= 1440) {
      const days = Math.floor(diffMin / 1440)
      timeLabel = `Hace ${days} ${days === 1 ? 'día' : 'días'}`
    } else if (diffMin >= 60) {
      const hours = Math.floor(diffMin / 60)
      timeLabel = `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
    } else if (diffMin > 0) {
      timeLabel = `Hace ${diffMin} ${diffMin === 1 ? 'min' : 'mins'}`
    }

    const poll = p.poll_data ? {
        question: p.poll_data.question,
        options: p.poll_data.options,
        correctAnswer: p.poll_data.options[p.poll_data.correct_index],
        answered: p.answered || false
    } : null

    return {
      id: p.id_publicacion,
      author: p.usuario?.nombre || 'Usuario',
      userAvatar: p.usuario?.imagen_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      verified: p.usuario?.verificado || false,
      time: timeLabel,
      media: p.media || [],
      content: p.content || '',
      likes: p.likes || 0,
      liked: p.liked || false,
      canEarn: p.media?.some(m => m.type === 'video'),
      gain: (rewardsConfig?.valor_video || 1.50).toFixed(2),
      poll: poll,
      link: p.external_url,
      whatsapp_active: p.whatsapp_active,
      phone: p.whatsapp_number || p.usuario?.telefono,
      hasVideo: p.media?.some(m => m.type === 'video'),
      videoCompleted: p.videoCompleted || false
    }
  }

  let debounceTimer = null

  const fetchPosts = async (reset = false, rewardsConfig = null) => {
    if (isLocked.value || (!hasMore.value && !reset)) return
    
    // Debounce de 300ms para evitar peticiones rápidas accidentales
    if (debounceTimer) clearTimeout(debounceTimer)
    
    return new Promise((resolve) => {
      debounceTimer = setTimeout(async () => {
        isLocked.value = true
        isLoading.value = true
        error.value = null

        if (reset) {
          page.value = 1
          hasMore.value = true
        }

        try {
          const response = await $api('/publicaciones', {
            params: {
              page: page.value,
              limit: limit,
              uid: auth.user?.id_usuario
            }
          })

          if (response.success && response.data) {
            const mappedData = response.data.map(p => mapPost(p, rewardsConfig))
            
            if (reset) {
              posts.value = mappedData
            } else {
              // Evitar duplicados por ID
              const existingIds = new Set(posts.value.map(p => p.id))
              const uniqueNewPosts = mappedData.filter(p => !existingIds.has(p.id))
              posts.value = [...posts.value, ...uniqueNewPosts]
            }
            
            hasMore.value = mappedData.length >= limit
            if (mappedData.length > 0) page.value++
            
            if (reset || posts.value.length <= limit) {
              saveToCache(posts.value)
            }
          } else {
            error.value = 'No se pudieron cargar las publicaciones'
          }
        } catch (err) {
          error.value = 'Error de conexión con el servidor'
          console.error('Fetch error:', err)
        } finally {
          isLoading.value = false
          isLocked.value = false
          resolve()
        }
      }, 300)
    })
  }

  return {
    posts,
    isLoading,
    hasMore,
    error,
    fetchPosts,
    loadFromCache
  }
}
