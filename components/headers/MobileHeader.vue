<template>
  <div>
    <header class="fixed top-0 left-0 right-0 z-50 bg-[#070b14]/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <span class="text-white font-black text-lg">P</span>
        </div>
        <h1 class="font-black text-lg tracking-tight text-white">PubliGana</h1>
      </div>

      <div class="flex items-center gap-2">
        <!-- Earnings Counter (Replaces Search) -->
        <div 
          @click="openHistory"
          class="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-inner cursor-pointer active:scale-95 transition-all"
        >
          <div class="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <span class="text-[10px] text-white font-black">$</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[13px] font-black text-emerald-400 tracking-tight">
              {{ earnings.toFixed(2) }}
            </span>
            <div v-if="hasMembership" class="flex items-center justify-center bg-blue-500 text-[#070b14] text-[8px] font-black w-4 h-4 rounded-md shadow-sm shadow-blue-500/30">
              x2
            </div>
          </div>
        </div>

        <button @click="openNotifications" class="relative p-2 text-gray-400 hover:text-emerald-400 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <div v-if="unreadCount > 0" class="absolute top-1.5 right-1.5 flex items-center justify-center">
            <div class="relative">
              <div class="absolute -inset-0.5 bg-rose-500/20 rounded-full blur-sm animate-pulse"></div>
              <div class="relative bg-gradient-to-br from-rose-500 to-red-600 text-white text-[8px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg shadow-rose-500/30">
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </div>
            </div>
          </div>
        </button>
      </div>
    </header>

    <!-- Interactions History Modal -->
    <InteractionHistoryModal 
      :show="showHistory"
      :history="history"
      :loading="isLoading"
      :has-next-page="hasNextPage"
      :has-prev-page="hasPrevPage"
      :total-balance="earnings"
      :show-withdraw-button="true"
      :min-withdrawal="minWithdrawal"
      @close="showHistory = false"
      @withdraw="handleWithdraw"
      @next-page="nextPage"
      @prev-page="prevPage"
    />

    <!-- Notifications Modal -->
    <NotificationsModal 
      :show="showNotifications"
      :notifications="notifications"
      :loading="isLoadingNotifications"
      :has-next-page="hasNextNotificationsPage"
      :has-prev-page="hasPrevNotificationsPage"
      @close="showNotifications = false"
      @next-page="nextNotificationsPage"
      @prev-page="prevNotificationsPage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/middleware/auth.store'
import InteractionHistoryModal from '~/components/ui/InteractionHistoryModal.vue'
import NotificationsModal from '~/components/ui/NotificationsModal.vue'
import { useInteractionHistory } from '~/composables/useInteractionHistory'

const { $api } = useNuxtApp()
const authStore = useAuthStore()

const props = defineProps({
  earnings: {
    type: Number,
    default: 0
  },
  hasMembership: {
    type: Boolean,
    default: false
  }
})

const showHistory = ref(false)
const showNotifications = ref(false)
const minWithdrawal = ref(0)
const unreadCount = ref(0)
const notifications = ref([])
const isLoadingNotifications = ref(false)
const currentNotificationsPage = ref(1)
const totalNotificationsPages = ref(1)
const hasNextNotificationsPage = ref(false)
const hasPrevNotificationsPage = ref(false)

const { history, isLoading, hasNextPage, hasPrevPage, loadInitial, nextPage, prevPage } = useInteractionHistory()

const openHistory = () => {
  showHistory.value = true
  loadInitial()
  fetchMinWithdrawal()
}

const fetchMinWithdrawal = async () => {
  try {
    const res = await $api('/config/multi?tipos=retiro_minimo')
    if (res.success && res.data.retiro_minimo) {
      minWithdrawal.value = parseFloat(res.data.retiro_minimo)
    }
  } catch (e) {
    console.error('Error fetching min withdrawal:', e)
  }
}

const handleWithdraw = () => {
  showHistory.value = false
  navigateTo('/cliente/red?withdraw=true')
}

const updateUnreadCount = async () => {
  if (!authStore.user?.id_usuario) return
  try {
    const res = await $api(`/notificaciones/usuario/${authStore.user.id_usuario}?page=1&limit=1`)
    if (res.success && res.unreadCount !== undefined) {
      unreadCount.value = res.unreadCount
    }
  } catch (e) {
    console.error('Error updating unread count:', e)
  }
}

const loadNotifications = async () => {
  if (!authStore.user?.id_usuario) return
  isLoadingNotifications.value = true
  try {
    const res = await $api(`/notificaciones/usuario/${authStore.user.id_usuario}?page=${currentNotificationsPage.value}&limit=10`)
    if (res.success) {
      notifications.value = res.data || []
      if (res.unreadCount !== undefined) {
        unreadCount.value = res.unreadCount
      }
      if (res.pagination) {
        totalNotificationsPages.value = res.pagination.totalPages || res.pagination.pages || 1
        hasNextNotificationsPage.value = res.pagination.hasNextPage || currentNotificationsPage.value < totalNotificationsPages.value
        hasPrevNotificationsPage.value = res.pagination.hasPrevPage || currentNotificationsPage.value > 1
      }
    }
  } catch (e) {
    console.error('Error loading notifications:', e)
  } finally {
    isLoadingNotifications.value = false
  }
}

const openNotifications = async () => {
  currentNotificationsPage.value = 1
  showNotifications.value = true
  
  if (authStore.user?.id_usuario) {
    try {
      await $api('/notificaciones/marcar/leidas', {
        method: 'PUT',
        body: { id_usuario: authStore.user.id_usuario }
      })
      unreadCount.value = 0
    } catch (e) {
      console.error('Error marking as read:', e)
    }
  }
  
  loadNotifications()
}

const nextNotificationsPage = () => {
  if (!hasNextNotificationsPage.value) return
  currentNotificationsPage.value++
  loadNotifications()
}

const prevNotificationsPage = () => {
  if (!hasPrevNotificationsPage.value) return
  currentNotificationsPage.value--
  loadNotifications()
}

const handlePageShow = () => {
  if (document.visibilityState === 'visible') {
    updateUnreadCount()
  }
}

onMounted(() => {
  updateUnreadCount()
  document.addEventListener('visibilitychange', handlePageShow)
  window.addEventListener('focus', handlePageShow)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handlePageShow)
  window.removeEventListener('focus', handlePageShow)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
