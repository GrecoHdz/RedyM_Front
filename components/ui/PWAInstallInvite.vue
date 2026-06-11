<template>
  <transition
    enter-active-class="transition ease-out duration-500"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isVisible" 
      class="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl"
    >
      <!-- Animación de fondo -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <div 
        class="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden flex flex-col items-center text-center gap-6"
      >
        <!-- Estado 1: Pregunta inicial (Pre-Invite) -->
        <template v-if="showingPreInvite">
          <div class="relative">
            <div class="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 scale-150"></div>
            <div class="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center text-5xl shadow-lg border border-white/20 relative z-10 animate-bounce-slow">
              ✨
            </div>
          </div>
          
          <div class="space-y-3 relative z-10">
            <h2 class="text-2xl font-black text-slate-800 dark:text-white leading-tight">
              ¿Quieres instalar la app?
            </h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Instálala para una experiencia más rápida y sin interrupciones
            </p>
          </div>

          <div class="w-full space-y-3 relative z-10">
            <button 
              @click="showingPreInvite = false"
              class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl text-base font-black hover:translate-y-[-2px] hover:shadow-xl transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
            >
              <span>Sí, quiero instalarla</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button 
              @click="handleDecline"
              class="w-full py-4 rounded-2xl text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all active:scale-[0.98] shadow-sm"
            >
              Ahora no
            </button>
          </div>
        </template>

        <!-- Estado 2: Pasos de instalación (Contenido original) -->
        <template v-else>
          <!-- Botón de Cerrar (Solo para Admin/SA o si no es forzado) -->
          <button 
            v-if="canClose"
            @click="dismissed = true"
            class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90 z-20"
            title="Cerrar"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="relative">
            <div class="absolute inset-0 bg-blue-500 blur-2xl opacity-20 scale-150"></div>
            <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl flex items-center justify-center text-5xl shadow-lg border border-white/20 relative z-10 animate-bounce-slow">
              📲
            </div>
          </div>
          
          <div class="space-y-3 relative z-10">
            <h2 class="text-2xl font-black text-slate-800 dark:text-white leading-tight">
              Instala PubliGana <br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">en tu pantalla de inicio</span>
            </h2>
            <p class="text-slate-500 dark:text-slate-400 text-base px-2">
              {{ isIOS ? 'Sigue estos pasos para instalar la app en tu iPhone/iPad:' : 'Sigue estos pasos para instalar la app en tu Android:' }}
            </p>
          </div>
          
          <div class="w-full space-y-4 pt-2 relative z-10">
            <!-- Botón para Android/Chrome (Si el navegador lo permite) -->
            <button 
              v-if="!isIOS && canInstall"
              @click="handleInstall"
              class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-5 rounded-3xl text-lg font-extrabold hover:translate-y-[-2px] hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 group shadow-lg shadow-blue-500/20"
            >
              <span>Instalar app</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <!-- Instrucciones manuales para Android -->
            <div v-else-if="!isIOS && !canInstall" class="space-y-4">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-sm text-blue-700 dark:text-blue-300 flex flex-col gap-3">
                <div class="flex items-center gap-3 text-left">
                  <span class="bg-blue-500 text-white w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Toca el menú <strong>(⋮)</strong> <svg class="inline w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v.01M12 12v.01M12 19v.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> de tu navegador</span>
                </div>
                <div class="flex items-center gap-3 text-left">
                  <span class="bg-blue-500 text-white w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">2</span>
                  <span>Selecciona <strong>"Añadir a pantalla de inicio"</strong></span>
                </div>
              </div>
            </div>

            <!-- Instrucciones para iOS -->
            <div v-else-if="isIOS" class="space-y-4">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-sm text-blue-700 dark:text-blue-300 flex flex-col gap-3">
                <div class="flex items-center gap-3 text-left">
                  <span class="bg-blue-500 text-white w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Toca el botón <strong>compartir</strong> <svg class="inline w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 15V3m0 0l-4 4m4-4l4 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                </div>
                <div class="flex items-center gap-3 text-left">
                  <span class="bg-blue-500 text-white w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">2</span>
                  <span>Selecciona <strong>"Agregar a Inicio"</strong> <svg class="inline w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/><path d="M12 8v8m-4-4h8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                </div>
              </div>
            </div>
            
            <p class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
              Instalación obligatoria para continuar
            </p>
          </div>
        </template>

        <!-- Decoración interior -->
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useAppPWA } from '~/composables/useAppPWA';
import { useAuthStore } from '~/middleware/auth.store';

const { isInstalled, isIOS, canInstall, isMobile, installApp, initPWA, checkInstallState } = useAppPWA();
const authStore = useAuthStore();
const route = useRoute();
const showDelayed = ref(false);
const dismissed = ref(false);
const showingPreInvite = ref(true);

const canClose = computed(() => {
  const role = authStore.user?.role;
  return role === 'sa' || role === 'admin';
});

const checkInviteCooldown = () => {
  if (process.client) {
    const nextInvite = localStorage.getItem('pwa_next_invite');
    if (nextInvite && Date.now() < parseInt(nextInvite)) {
      console.log('📱 [PWAInvite] Still in cooldown');
      return false; // Aún estamos en cooldown
    }
  }
  return true;
};

const handleDecline = () => {
  dismissed.value = true;
  if (process.client) {
    // Guardar timestamp para dentro de 1 día (24 horas)
    const tomorrow = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('pwa_next_invite', tomorrow.toString());
  }
};

const isVisible = computed(() => {
  const shouldHide = dismissed.value || isInstalled.value || route.path === '/';
  
  console.log('📱 [PWAInvite] isVisible check:', {
    shouldHide,
    dismissed: dismissed.value,
    isInstalled: isInstalled.value,
    routePath: route.path,
    cooldownReady: checkInviteCooldown(),
    timeReady: showDelayed.value,
    platformReady: isMobile.value,
    isMobile: isMobile.value,
    isIOS: isIOS.value
  });
  
  if (shouldHide) {
    return false;
  }
  
  // Lógica normal con cooldown de 1 día
  const cooldownReady = checkInviteCooldown();
  const timeReady = showDelayed.value;
  // Mostrar para cualquier móvil (iOS o Android), no solo cuando canInstall es true
  const platformReady = isMobile.value;
  
  return cooldownReady && timeReady && platformReady;
});

const handleInstall = async () => {
  await installApp();
};

const initialize = async () => {
  console.log('📱 [PWAInvite] Initializing...');
  
  initPWA();
  await nextTick();
  checkInstallState();
  
  // Reducir el tiempo de espera para que se muestre más rápido
  setTimeout(() => {
    console.log('📱 [PWAInvite] Setting showDelayed to true');
    showDelayed.value = true;
  }, 1000); // 1 segundo en lugar de 2
};

// Esperar a que auth esté listo
watch(() => authStore.isInitialized, async (initialized) => {
  if (initialized) {
    await initialize();
  }
}, { immediate: true });

onMounted(async () => {
  if (authStore.isInitialized) {
    await initialize();
  }
});

const emit = defineEmits(['installed']);

watch(isInstalled, (newVal) => {
  if (newVal && process.client) {
    localStorage.removeItem('pwa_next_invite'); // Ya se instaló, no necesita cooldown
    emit('installed');
  }
});
</script>

<style scoped>
.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-10%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
