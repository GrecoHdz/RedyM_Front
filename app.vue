<template>
  <div>
      <!-- Pantalla de Puente para Facebook/Instagram -->
    <div v-if="isIAB" class="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
        <span class="text-6xl mb-6">🌐</span>
        <h1 class="text-xl font-black mb-8 max-w-xs leading-snug text-white">
            Para una mejor experiencia ábrelo en tu navegador
        </h1>
        <a
            :href="getExternalBrowserLink()"
            class="w-full max-w-sm py-5 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-3"
            target="_blank"
        >
            Abrir en mi navegador
        </a>
    </div>
    
    <VitePwaManifest />
    <UiPushNotificationInvite />
    <NuxtPage />
  </div>
</template>

<script setup>
import { useIABDetector } from '~/composables/useIABDetector';
import { useAuthStore } from '~/middleware/auth.store';

const auth = useAuthStore();
const { isIAB, isIOS, getExternalBrowserLink } = useIABDetector();
const route = useRoute();
// SEO and Meta
useHead({
  title: 'PubliGana',
  meta: [
    { name: 'description', content: 'PubliGana es la plataforma donde compartes y ganas.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover' }
  ]
})
</script>

<style>
/* Bloquear zoom en móviles globalmente */
html {
  touch-action: manipulation;
  -ms-touch-action: manipulation;
}
</style>
