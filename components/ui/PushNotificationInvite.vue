<template>
  <transition name="fade">
    <div 
      v-if="isVisible" 
      class="fixed inset-0 z-[200] flex items-center justify-center px-6 bg-[#070b14]/80 backdrop-blur-md"
    >
      <div class="relative w-full max-w-sm bg-gray-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden group">
        <!-- Decoración de fondo -->
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        
        <div class="relative z-10 flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/30 mb-6 animate-bounce">
            🔔
          </div>
          
          <h2 class="text-2xl font-black text-white mb-2 tracking-tight">¡No te pierdas de nada!</h2>
          <p class="text-gray-400 text-sm leading-relaxed mb-8 px-2">
            Activa las notificaciones para recibir alertas sobre tus misiones, ganancias y nuevas oportunidades en tiempo real.
          </p>
          
          <div class="w-full space-y-3">
            <button 
              @click="handleSubscribe"
              class="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              Activar Notificaciones
            </button>
            
            <button 
              @click="dismiss"
              class="w-full py-4 text-gray-500 hover:text-white font-bold text-[12px] uppercase tracking-widest transition-colors"
            >
              Quizás más tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { usePushNotifications } from '~/composables/usePushNotifications';
import { useAuthStore } from '~/middleware/auth.store';

const { isSupported, isSubscribed, permission, isChecking, subscribe, checkSubscription } = usePushNotifications();
const auth = useAuthStore();
const isDismissed = ref(false);
const isReady = ref(false);

const isVisible = computed(() => {
  const visible = auth.user && 
         isReady.value &&
         !isChecking.value &&
         isSupported.value && 
         !isSubscribed.value && 
         permission.value !== 'denied' && 
         !isDismissed.value;
  
  if (process.client) {
    console.log('📱 [PushInvite] Status:', {
      auth: !!auth.user,
      isReady: isReady.value,
      isChecking: isChecking.value,
      isSupported: isSupported.value,
      isSubscribed: isSubscribed.value,
      permission: permission.value,
      isDismissed: isDismissed.value,
      finalResult: visible
    });
  }
  
  return visible;
});


const handleSubscribe = async () => {
  const result = await subscribe();
  if (result.success) {
    // Si se suscribe con éxito, el isVisible cambiará automáticamente
  }
};

const dismiss = () => {
  isDismissed.value = true;
  if (process.client) {
    // Guardamos que lo cerró para que no vuelva a molestar por un tiempo
    localStorage.setItem('push_invite_dismissed', Date.now().toString());
  }
};

const initialize = async () => {
  if (process.client) {
    const lastDismissed = localStorage.getItem('push_invite_dismissed');
    if (lastDismissed) {
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(lastDismissed) < threeDays) {
        isDismissed.value = true;
      }
    }
  }
  
  await checkSubscription();
  
  // Dar un pequeño tiempo para que todo se estabilice
  setTimeout(() => {
    isReady.value = true;
  }, 1000);
};

// Esperar a que auth esté listo
watch(() => auth.isInitialized, async (initialized) => {
  if (initialized && auth.user) {
    await initialize();
  }
}, { immediate: true });

// Si auth ya está inicializado al montar
onMounted(async () => {
  if (auth.isInitialized && auth.user) {
    await initialize();
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
