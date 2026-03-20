<template>
  <div class="min-h-screen bg-[#070b14] text-gray-100 font-['Outfit'] selection:bg-emerald-500/30 selection:text-emerald-400 pb-10">
    <!-- Toast Notification -->
    <Toast 
      :show="toast.show"
      :message="toast.message" 
      :type="toast.type"
      :duration="toast.duration"
      @close="toast.show = false"
    />
    
    <!-- Loading Spinner -->
    <LoadingSpinner 
      :loading="isLoading || isLoggingOut" 
      :message="isLoggingOut ? 'Cerrando sesión...' : 'Cargando Perfil...'"
    />
    
    <!-- Animated background (matching landing) -->
    <div class="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-[#070b14] to-[#070b14]"></div>
    <div class="fixed inset-0 -z-10 opacity-20">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
    </div>

    <!-- Header -->
    <MobileHeader :earnings="totalEarnings" />

    <main v-if="!isLoading" class="pt-20 pb-12 px-4 max-w-2xl mx-auto"> 

      <!-- Profile Header Section -->
      <section class="flex flex-col items-center mb-4 animate-fade-in">
        <div class="relative group">
          <div class="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-2xl shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-500">
            <div @click="isPhotoModalOpen = true" class="w-full h-full rounded-[1.4rem] bg-[#070b14] flex items-center justify-center overflow-hidden cursor-pointer group/avatar relative">
              <img v-if="user.imagen_url" :src="user.imagen_url" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
              <div v-else class="flex flex-col items-center gap-1 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-emerald-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span class="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/40">Subir Foto</span>
              </div>
              <!-- Hover overlay -->
              <div class="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex items-center justify-center">
                <svg class="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
            </div>
          </div>
          <button @click="isPhotoModalOpen = true" class="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-[#070b14] active:scale-90 transition-transform hover:bg-emerald-400 z-10">
            <svg class="w-4 h-4 text-[#070b14]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        
        <div class="mt-3 text-center">
          <div class="flex flex-col items-center gap-1">
            <h2 class="text-2xl font-black text-white leading-tight tracking-tight">{{ user.nombre || 'Usuario' }}</h2>
            <div class="flex items-center gap-1.5">
              <span 
                class="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border flex items-center gap-1"
                :class="user.identidad_url ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'"
              >
                <svg v-if="user.identidad_url" class="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <svg v-else class="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                {{ user.identidad_url ? 'Verificado' : 'No Verificado' }}
              </span>
            </div>
          </div> 
        </div> 
      </section>

      <!-- Stats Grid -->
      <section class="grid grid-cols-2 gap-2 mb-4">
        <div class="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm flex flex-col items-center">
          <div class="flex flex-col items-center gap-1.5 mb-2">
            <div class="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-sm">
              💰
            </div>
            <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest text-center">Saldo Total</span>
          </div>
          <div class="text-base font-black text-white text-center">L. {{ totalEarnings.toFixed(2) }}</div>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm flex flex-col items-center">
          <div class="flex flex-col items-center gap-1.5 mb-2">
            <div class="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm">
              🏙️
            </div>
            <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest text-center">Ciudad</span>
          </div>
          <div class="text-sm font-black text-white truncate text-center w-full">{{ user.ciudad || 'No especificada' }}</div>
        </div>
        <div class="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-sm">
              📅
            </div>
            <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Registrado</span>
          </div>
          <div class="text-xs font-black text-white capitalize">{{ formatShortDate(user.fecha_registro) }}</div>
        </div>
      </section>

      <!-- Membership Card -->
      <section class="mb-4">
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br transition-all duration-300 p-4 shadow-xl shadow-emerald-900/20 group"
          :class="{
            'from-blue-600 to-indigo-700': isMembershipActive,
            'from-amber-500 to-orange-600': isMembershipPending,
            'from-red-600 to-pink-700': isMembershipExpired,
            'from-gray-700 to-gray-800': isMembershipInactive
          }">
          <!-- Background decoration -->
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
          
          <div class="relative z-10 flex flex-col h-full">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-white/70 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">
                  {{ isMembershipActive ? 'Membresía Activa' : membershipStatus }}
                </h3>
                <h4 class="text-xl font-black text-white tracking-tight">
                  {{ isMembershipActive ? 'PLAN VIP' : (isMembershipInactive ? 'Sin Membresía' : 'PENDIENTE') }}
                </h4>
              </div>
              <div class="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 text-xl">
                  {{ isMembershipActive ? '🏆' : (isMembershipPending ? '⏳' : (isMembershipExpired ? '⚠️' : '🔒')) }}
              </div>
            </div>

            <div v-if="isMembershipActive || isMembershipPending || isMembershipExpired" class="mb-4">
              <div class="w-full bg-white/20 rounded-full h-1.5 mb-1">
                <div 
                  class="h-1.5 rounded-full bg-white transition-all duration-500"
                  :style="`width: ${membershipProgress}%`"
                ></div>
              </div>
              <p class="text-[9px] text-white/60 font-medium">
                {{ isMembershipActive ? `${membershipProgress}% del periodo transcurrido` : '' }}
              </p>
            </div>

            <div class="mt-auto flex items-center justify-between gap-4">
              <div>
                <p class="text-white/60 text-[9px] font-bold uppercase tracking-widest">
                  {{ isMembershipActive ? 'Vence el' : (isMembershipPending ? 'Enviado el' : 'Estado') }}
                </p>
                <p class="text-white font-black text-sm">
                  {{ isMembershipActive ? formatShortDate(membershipData.fechaVencimiento) : (isMembershipInactive ? 'Activa tu plan' : formatShortDate(membershipData.fechaInicio)) }}
                </p>
              </div>
              <button 
                @click="renovarMembresia"
                :disabled="isMembershipPending"
                class="bg-white text-[#070b14] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isMembershipActive ? 'Renovar' : (isMembershipInactive || isMembershipExpired ? 'Activar' : 'Pendiente') }}
              </button>
            </div>
          </div>
        </div>
      </section>
 
      <!-- Personal Information Form -->
      <section class="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-sm">
        <h3 class="text-base font-black text-white mb-4 flex items-center gap-2">
          <span class="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xs">👤</span>
          Información Personal
        </h3>
        
        <div class="space-y-3">
          <div class="space-y-1">
            <label class="block text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre Completo</label>
            <input 
              v-model="user.nombre"
              type="text" 
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-white font-bold text-sm"
              placeholder="Tu nombre completo"
            >
          </div>
          
          <div class="space-y-1">
            <label class="block text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
            <input 
              v-model="user.email"
              type="email" 
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-white font-bold text-sm"
              placeholder="tu@email.com"
            >
          </div>
          
          <div class="space-y-1">
            <label class="block text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Identidad (DNI)</label>
            <input 
              v-model="user.identidad"
              type="text" 
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-white font-bold text-sm"
              placeholder="Número de identidad"
            >
          </div>
          
          <div class="space-y-1">
            <label class="block text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Teléfono</label>
            <input 
              v-model="user.telefono"
              type="tel" 
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-white font-bold text-sm"
              placeholder="+504 9999-9999"
            >
          </div>
          


          <div class="flex flex-col gap-2 pt-2">
            <button 
              @click="saveProfile"
              :disabled="!hasChanges || isSaving"
              class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
              <i v-if="isSaving" class="fas fa-circle-notch fa-spin"></i>
              <span>{{ isSaving ? 'Guardando...' : 'Actualizar Perfil' }}</span>
            </button>
            
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="isPasswordModalOpen = true"
                class="py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all text-[10px] flex items-center justify-center gap-2">
                <i class="fas fa-key text-amber-500"></i>
                Cambiar Contraseña
              </button>
              
              <button 
                @click="isIdentityModalOpen = true"
                class="py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all text-[10px] flex items-center justify-center gap-2">
                <i class="fas fa-id-card text-blue-500"></i>
                {{ user.identidad_url ? 'ID ✅' : 'Verificar Identidad' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Push Notifications -->
      <section v-if="isSupported" class="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-base">
              🔔
            </div>
            <div>
              <h3 class="text-xs font-black text-white uppercase tracking-tight">Notificaciones</h3>
              <p class="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Alertas en tiempo real</p>
            </div>
          </div>
          
          <button 
            @click="handleToggleNotifications"
            :disabled="permission === 'denied'"
            class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none"
            :class="isSubscribed ? 'bg-emerald-500' : 'bg-white/10'"
          >
            <span
              class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg"
              :class="isSubscribed ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>
        <p v-if="permission === 'denied'" class="mt-4 text-[10px] text-red-400 font-bold uppercase text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
          ⚠️ Permisos bloqueados. Habilítalos en los ajustes de tu navegador.
        </p>
      </section>

      <!-- Legal & Footer Menu -->
      <section class="bg-white/5 border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden backdrop-blur-sm mb-4">
        <button 
          @click="isTerminosModalOpen = true"
          class="w-full px-4 py-3 flex items-center justify-between group active:bg-white/5 transition-colors">
          <div class="flex items-center gap-3 text-left">
            <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-all text-base">
              📜
            </div>
            <div>
              <span class="block text-xs font-bold text-gray-200">Términos y Condiciones</span>
              <span class="block text-[8px] text-gray-500 font-medium capitalize">Contrato de uso</span>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button 
          @click="isPrivacidadModalOpen = true"
          class="w-full px-4 py-3 flex items-center justify-between group active:bg-white/5 transition-colors">
          <div class="flex items-center gap-3 text-left">
            <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-all text-base">
              🔒
            </div>
            <div>
              <span class="block text-xs font-bold text-gray-200">Privacidad</span>
              <span class="block text-[8px] text-gray-500 font-medium capitalize">Protección de datos</span>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button 
          @click="isAcercaModalOpen = true"
          class="w-full px-4 py-3 flex items-center justify-between group active:bg-white/5 transition-colors">
          <div class="flex items-center gap-3 text-left">
            <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-all text-base">
              🏢
            </div>
            <div>
              <span class="block text-xs font-bold text-gray-200">Sobre RedYMercadeo</span>
              <span class="block text-[8px] text-gray-500 font-medium capitalize">Info de la empresa</span>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button @click="handleLogout" 
                class="w-full px-4 py-4 flex items-center gap-3 group hover:bg-red-500/10 transition-colors">
          <div class="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-all">
            <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div class="text-left">
            <span class="block text-xs font-black text-red-400 uppercase tracking-widest">Cerrar Sesión</span>
            <span class="block text-[8px] text-red-500/60 font-medium uppercase">Finalizar sesión</span>
          </div>
        </button>
      </section>

      <footer class="mt-8 text-center px-6">
        <p class="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">RedYMercadeo v1.0.5</p>
      </footer>
    </main>

    <!-- Modals -->
    
    <!-- Modal Cambio de Contraseña -->
    <Transition name="fade">
      <div v-if="isPasswordModalOpen" @click.self="isPasswordModalOpen = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-modal-in">
          <h3 class="text-xl font-black text-white mb-6">Nueva Contraseña</h3>
          <form @submit.prevent="updatePassword" class="space-y-4">
            <div class="space-y-1">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contraseña Actual</label>
              <input v-model="currentPassword" type="password" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 transition-all text-white">
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nueva Contraseña</label>
              <input v-model="newPassword" type="password" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 transition-all text-white">
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirmar</label>
              <input v-model="confirmPassword" type="password" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 transition-all text-white" :class="{'border-red-500': passwordMismatch}">
            </div>
            <p v-if="passwordMismatch" class="text-[10px] text-red-400 font-bold uppercase text-center">Las contraseñas no coinciden</p>
            <div class="flex flex-col gap-3 pt-2">
              <button type="submit" :disabled="isUpdatingPassword || passwordMismatch" class="w-full py-4 bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-50">
                {{ isUpdatingPassword ? 'Haciendo magia...' : 'Actualizar Llave' }}
              </button>
              <button @click="isPasswordModalOpen = false" type="button" class="w-full py-3 text-gray-500 font-bold uppercase tracking-widest text-xs">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal Gestión de Foto de Perfil -->
    <Transition name="fade">
      <div v-if="isPhotoModalOpen" @click.self="isPhotoModalOpen = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-modal-in text-center">
          <div class="w-32 h-32 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mx-auto mb-6 overflow-hidden">
            <img v-if="user.imagen_url" :src="user.imagen_url" class="w-full h-full object-cover">
            <span v-else class="text-4xl">📸</span>
          </div>
          <h3 class="text-xl font-black text-white mb-2">Tu Avatar</h3>
          <p class="text-xs text-gray-500 mb-8 font-medium">Sube una foto donde te veas genial</p>
          
          <div class="space-y-3">
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileChange">
            <button @click="$refs.fileInput.click()" class="w-full py-4 bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest rounded-2xl shadow-lg active:scale-95 transition-all">
              {{ isUploading ? 'Subiendo...' : 'Subir Nueva Foto' }}
            </button>
            <button v-if="user.imagen_url" @click="deleteProfileImage" class="w-full py-4 bg-red-500/10 text-red-400 font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all">
              Eliminar Actual
            </button>
            <button @click="isPhotoModalOpen = false" class="w-full py-2 text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">Cerrar</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Verificación ID -->
    <Transition name="fade">
      <div v-if="isIdentityModalOpen" @click.self="isIdentityModalOpen = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-modal-in">
          <h3 class="text-2xl font-black text-white mb-4 flex items-center gap-3">
            <span class="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-sm">🛡️</span>
            Verificación ID
          </h3>
          <p class="text-sm text-gray-400 mb-8 leading-relaxed">Sube una foto clara de tu DNI o Identificación Nacional para obtener el check de verificado.</p>
          
          <div v-if="user.identidad_url" class="aspect-video bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-8">
            <img :src="user.identidad_url" class="w-full h-full object-cover">
          </div>
          <div v-else class="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center mb-8 gap-3 group">
            <span class="text-3xl grayscale group-hover:grayscale-0 transition-all">📇</span>
            <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sin documento</p>
          </div>

          <div class="grid grid-cols-1 gap-3">
            <input type="file" ref="identityFileInput" class="hidden" accept="image/*" @change="onIdentityFileChange">
            <button @click="$refs.identityFileInput.click()" class="w-full py-4 bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest rounded-2xl shadow-lg active:scale-95 transition-all">
              {{ user.identidad_url ? 'Actualizar Documento' : 'Subir DNI' }}
            </button>
            <button v-if="user.identidad_url" @click="deleteIdentityImage" class="w-full py-3 text-red-400 font-bold uppercase tracking-widest text-[10px] hover:underline">Eliminar documento</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Renovación Membresía -->
    <Transition name="fade">
      <div v-if="showRenewalModal" @click.self="showRenewalModal = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-modal-in max-h-[90vh] overflow-y-auto">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🏆</div>
            <h3 class="text-xl font-black text-white uppercase tracking-tight">Activar Plan VIP</h3>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Disfruta beneficios exclusivos</p>
          </div>

          <div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-6 text-center">
            <span class="text-[10px] text-blue-400 font-black uppercase tracking-widest block mb-1">Costo Mensual</span>
            <span class="text-2xl font-black text-white">L. {{ Number(membershipCost).toFixed(2) }}</span>
          </div>

          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Selecciona Banco</label>
              <multiselect
                v-model="selectedAccountObject"
                :options="bankAccounts"
                :searchable="false"
                label="banco"
                track-by="id_cuenta"
                class="multiselect-custom-dark"
                placeholder="-- Elige una cuenta --"
              />
            </div>

            <div v-if="selectedAccountObject" class="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
              <div class="flex justify-between items-center text-[10px] uppercase font-bold">
                <span class="text-gray-500">Banco:</span>
                <span class="text-white">{{ selectedAccountObject.banco }}</span>
              </div>
              <div class="flex justify-between items-center text-[10px] uppercase font-bold">
                <span class="text-gray-500">N° Cuenta:</span>
                <span class="text-white select-all">{{ selectedAccountObject.num_cuenta }}</span>
              </div>
              <div class="flex justify-between items-center text-[10px] uppercase font-bold">
                <span class="text-gray-500">Titular:</span>
                <span class="text-white">{{ selectedAccountObject.beneficiario }}</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">N° Comprobante</label>
              <input v-model="comprobante" type="text" placeholder="Ej: 9812739" class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-white font-bold">
            </div>

            <div class="flex flex-col gap-3 pt-4">
              <button 
                @click="confirmRenewal"
                :disabled="isRenewing || !selectedAccount || !comprobante"
                class="w-full py-4 bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/40 active:scale-95 transition-all disabled:opacity-50">
                {{ isRenewing ? 'Procesando...' : 'Confirmar y Enviar' }}
              </button>
              <button @click="showRenewalModal = false" class="w-full py-2 text-gray-500 font-bold uppercase tracking-widest text-xs">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Confirmación Unsubscribe -->
    <Transition name="fade">
      <div v-if="showUnsubscribeModal" @click.self="showUnsubscribeModal = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-red-500/20 rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-modal-in text-center">
          <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔕</div>
          <h3 class="text-xl font-black text-white mb-2">¿En serio?</h3>
          <p class="text-xs text-gray-500 mb-8 font-medium">Te perderás las mejores alertas de ganancias y servicios en tiempo real.</p>
          <div class="flex flex-col gap-3">
            <button @click="confirmUnsubscribe" class="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all shadow-lg shadow-red-900/20">Sí, desactivar</button>
            <button @click="showUnsubscribeModal = false" class="w-full py-4 bg-white/5 text-white font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all">Mejor las dejo</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Términos y Condiciones -->
    <Transition name="fade">
      <div v-if="isTerminosModalOpen" @click.self="isTerminosModalOpen = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl animate-modal-in flex flex-col max-h-[85vh]">
          <h3 class="text-2xl font-black text-white mb-6 uppercase tracking-tight">Términos y Condiciones</h3>
          <div class="overflow-y-auto flex-1 pr-4 custom-scrollbar space-y-6 text-gray-400 text-sm">
            <section>
              <h4 class="text-white font-black uppercase text-xs mb-2 tracking-widest">1. Uso de la Plataforma</h4>
              <p>RedYMercadeo es un ecosistema diseñado para maximizar tus ingresos mediante una red de servicios y referidos. Al usarla, aceptas ser un crack.</p>
            </section>
            <section>
              <h4 class="text-white font-black uppercase text-xs mb-2 tracking-widest">2. Membresías</h4>
              <p>Los periodos duran 30 días. Si no renuevas, pierdes los beneficios VIP, pero sigues siendo parte de la comunidad.</p>
            </section>
            <section>
              <h4 class="text-white font-black uppercase text-xs mb-2 tracking-widest">3. Garantías</h4>
              <p>Todos los servicios gestionados tienen el respaldo de RedYMercadeo por 1 mes completo.</p>
            </section>
          </div>
          <button @click="isTerminosModalOpen = false" class="w-full mt-8 py-4 bg-white text-[#070b14] font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all">He leído todo</button>
        </div>
      </div>
    </Transition>

    <!-- Modal Acerca de -->
    <Transition name="fade">
      <div v-if="isAcercaModalOpen" @click.self="isAcercaModalOpen = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-modal-in text-center">
          <div class="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl shadow-emerald-900/40">🚀</div>
          <h3 class="text-2xl font-black text-white mb-2 tracking-tight uppercase">RedYMercadeo</h3>
          <p class="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mb-6">Innova • Conecta • Gana</p>
          <p class="text-sm text-gray-400 mb-8 leading-relaxed">Somos la red de servicios y mercadeo más grande de la región, enfocada en la libertad financiera y soluciones digitales.</p>
          <div class="space-y-3 mb-8">
            <div class="flex items-center justify-center gap-3 text-xs text-gray-300 font-bold">
              <span>📧</span>
              <span class="lowercase">{{ contactInfo.find(c => c.type === 'email')?.value || 'info@redymercadeo.com' }}</span>
            </div>
            <div class="flex items-center justify-center gap-3 text-xs text-gray-300 font-bold">
              <span>📱</span>
              <span>{{ contactInfo.find(c => c.type === 'phone')?.value || '+504 9999-9999' }}</span>
            </div>
          </div>
          <button @click="isAcercaModalOpen = false" class="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all">Cerrar</button>
        </div>
      </div>
    </Transition>

    <!-- Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from '~/middleware/auth.store'
import MobileHeader from '~/components/headers/MobileHeader.vue'
import BottomNav from '~/components/footers/BottomNav.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'
import Multiselect from 'vue-multiselect'
import { usePushNotifications } from '~/composables/usePushNotifications'

const auth = useAuthStore()
const config = useRuntimeConfig()
const { $api } = useNuxtApp()
const { subscribe, unsubscribe, isSubscribed, checkSubscription, isSupported, permission } = usePushNotifications()

// --- ESTADOS ---
const isLoading = ref(true)
const isLoggingOut = ref(false)
const isSaving = ref(false)
const isUploading = ref(false)
const isDeleting = ref(false)
const isUpdatingPassword = ref(false)
const isRenewing = ref(false)

const totalEarnings = ref(125.50)
const totalReferrals = ref(24)

// Modals
const isPhotoModalOpen = ref(false)
const isIdentityModalOpen = ref(false)
const isPasswordModalOpen = ref(false)
const showRenewalModal = ref(false)
const showUnsubscribeModal = ref(false)
const isTerminosModalOpen = ref(false)
const isPrivacidadModalOpen = ref(false)
const isAcercaModalOpen = ref(false)

// Form Data
const userCookie = useCookie('user')
const user = ref({
  id_usuario: userCookie.value?.id_usuario || null,
  nombre: userCookie.value?.nombre || '',
  email: userCookie.value?.email || '',
  telefono: userCookie.value?.telefono || '',
  id_ciudad: userCookie.value?.id_ciudad || null,
  ciudad: userCookie.value?.ciudad || '',
  role: userCookie.value?.role || 'usuario',
  imagen_url: userCookie.value?.imagen_url || null,
  identidad: userCookie.value?.identidad || '',
  identidad_url: userCookie.value?.identidad_url || null,
  identidad_public_id: userCookie.value?.identidad_public_id || null,
  fecha_registro: userCookie.value?.fecha_registro || null
})
const originalUserData = ref({...user.value})

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')



// Membresía
const membershipData = ref({
  status: 'inactiva',
  progress: 0,
  fechaInicio: null,
  fechaVencimiento: null
})
const membershipCost = ref(0)
const bankAccounts = ref([])
const selectedAccount = ref('')
const selectedAccountObject = ref(null)
const comprobante = ref('')

// Toast
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 5000
})

const contactInfo = ref([
  { type: 'email', value: 'contactomisegurohn@gmail.com', configKey: 'correo_empresa' },
  { type: 'phone', value: '+504 9451-7811', configKey: 'numero_empresa' }
])

// --- COMPUTED ---
const hasChanges = computed(() => {
  if (!originalUserData.value) return false
  return (
    user.value.nombre !== originalUserData.value.nombre ||
    user.value.email !== originalUserData.value.email ||
    user.value.telefono !== originalUserData.value.telefono ||
    user.value.identidad !== originalUserData.value.identidad
  )
})

const passwordMismatch = computed(() => {
  return newPassword.value && confirmPassword.value && newPassword.value !== confirmPassword.value
})

const isMembershipActive = computed(() => membershipData.value.status === 'activa')
const isMembershipPending = computed(() => membershipData.value.status === 'pendiente')
const isMembershipExpired = computed(() => membershipData.value.status === 'vencida')
const isMembershipInactive = computed(() => ['inactiva', 'rechazada'].includes(membershipData.value.status) || !membershipData.value.status)
const membershipProgress = computed(() => membershipData.value.progress)
const membershipStatus = computed(() => {
  const map = { activa: 'Activa', pendiente: 'Pendiente', vencida: 'Vencida', inactiva: 'Inactiva', rechazada: 'Rechazada' }
  return map[membershipData.value.status] || 'Inactiva'
})



watch(selectedAccountObject, (newVal) => {
  selectedAccount.value = newVal ? newVal.id_cuenta : ''
})

// --- FUNCIONES ---
const showMsg = (message, type = 'info') => {
  toast.value.show = false
  nextTick(() => {
    toast.value = { show: true, message, type, duration: 5000 }
  })
}

const fetchUserData = async () => {
  try {
    const response = await $api(`/usuarios/${auth.user.id_usuario}`)
    if (response && response.success && response.data) {
      const u = response.data
      user.value = {
        id_usuario: u.id_usuario,
        nombre: u.nombre || '',
        email: u.email || '',
        telefono: u.telefono || '',
        identidad: u.identidad || '',
        id_ciudad: u.id_ciudad || null,
        ciudad: u.ciudad?.nombre_ciudad || u.ciudad || '',
        role: u.rol?.nombre_rol || u.role || 'usuario',
        imagen_url: u.imagen_url,
        identidad_url: u.identidad_url,
        identidad_public_id: u.identidad_public_id,
        fecha_registro: u.fecha_registro
      }
      originalUserData.value = { ...user.value }
      // Update cookie to keep it synced
      const userCookie = useCookie('user')
      userCookie.value = { ...userCookie.value, ...user.value }
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    showMsg('Error al cargar perfil', 'error')
  }
}



const fetchMembershipData = async () => {
  try {
    const data = await $api(`/membresia/${auth.user.id_usuario}`)
    if (data && data.status === 'success' && data.data) {
      const m = data.data
      const fechaInicio = new Date(m.fecha)
      const fechaFin = new Date(m.fecha)
      fechaFin.setDate(fechaFin.getDate() + 30)
      
      // Calcular progreso
      const hoy = new Date()
      const total = fechaFin - fechaInicio
      const transcurrido = hoy - fechaInicio
      let progreso = Math.min(100, Math.max(0, Math.round((transcurrido / total) * 100)))
      
      membershipData.value = {
        status: (progreso >= 100 && m.estado === 'activa') ? 'vencida' : m.estado,
        progress: progreso,
        fechaInicio: fechaInicio,
        fechaVencimiento: fechaFin
      }
    }
  } catch (error) {
    console.error('Error membership:', error)
    showMsg('Error al cargar membresía', 'error')
  }
}

const fetchBankAccounts = async () => {
  try {
    const data = await $api('/cuentas')
    if (data) bankAccounts.value = data
  } catch (error) {
    console.error('Error bank accounts:', error)
    showMsg('Error al cargar cuentas bancarias', 'error')
  }
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    await $api(`/usuarios/${user.value.id_usuario}`, {
      method: 'PUT',
      body: {
        nombre: user.value.nombre,
        email: user.value.email,
        telefono: user.value.telefono,
        identidad: user.value.identidad,
        id_ciudad: user.value.id_ciudad
      }
    })
    originalUserData.value = { ...user.value }
    await auth.fetchUser()
    showMsg('¡Perfil actualizado!', 'success')
  } catch (error) {
    let errorMessage = 'Error al guardar cambios'
    if (error.response && error.response._data) {
      errorMessage = error.response._data.message || errorMessage
    }
    showMsg(errorMessage, 'error')
  } finally {
    isSaving.value = false
  }
}

const updatePassword = async () => {
  isUpdatingPassword.value = true
  const payload = {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value
  }
  console.log('--- ENVIANDO AL BACKEND ---', payload)

  try {
    const response = await $api(`/usuarios/cambio-clave/${user.value.id_usuario}`, {
      method: 'PUT',
      body: payload
    })
    console.log('--- RESPUESTA DEL SERVIDOR ---', response)
    isPasswordModalOpen.value = false
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    showMsg('¡Contraseña actualizada!', 'success')
  } catch (error) {
    console.error('--- ERROR EN RESPUESTA DEL SERVIDOR ---', error)
    let errorMessage = 'Error al actualizar contraseña'
    
    if (error.response && error.response._data) {
      console.log('Cuerpo del error:', error.response._data)
      errorMessage = error.response._data.message || errorMessage
    }
    
    showMsg(errorMessage, 'error')
  } finally {
    isUpdatingPassword.value = false
  }
}

// Subida de archivos
const onFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) return showMsg('Máximo 5MB', 'error')
  
  isUploading.value = true
  try {
    const fd = new FormData()
    fd.append('imagen', file)
    const res = await $api(`/usuarios/imagen-perfil/${user.value.id_usuario}`, { method: 'POST', body: fd })
    if (res.success) {
      user.value.imagen_url = res.data.imagen_url
      await auth.fetchUser()
      showMsg('Foto actualizada', 'success')
      isPhotoModalOpen.value = false
    }
  } catch (error) {
    let errorMessage = 'Error al subir foto'
    if (error.response && error.response._data) {
      errorMessage = error.response._data.message || errorMessage
    }
    showMsg(errorMessage, 'error')
  } finally {
    isUploading.value = false
  }
}

const deleteProfileImage = async () => {
  if (!confirm('¿Eliminar foto?')) return
  try {
    const res = await $api(`/usuarios/imagen-perfil/${user.value.id_usuario}`, { method: 'DELETE' })
    if (res.success) {
      user.value.imagen_url = null
      await auth.fetchUser()
      showMsg('Foto eliminada', 'success')
      isPhotoModalOpen.value = false
    }
  } catch (error) {
    let errorMessage = 'Error al eliminar foto'
    if (error.response && error.response._data) {
      errorMessage = error.response._data.message || errorMessage
    }
    showMsg(errorMessage, 'error')
  }
}

const onIdentityFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  isUploading.value = true
  try {
    const fd = new FormData()
    fd.append('imagen', file)
    const res = await $api(`/usuarios/identidad-foto/${user.value.id_usuario}`, { method: 'POST', body: fd })
    if (res.success) {
      user.value.identidad_url = res.data.identidad_url
      user.value.identidad_public_id = res.data.identidad_public_id
      showMsg('Identidad subida', 'success')
      isIdentityModalOpen.value = false
    }
  } catch (error) {
    let errorMessage = 'Error al subir ID'
    if (error.response && error.response._data) {
      errorMessage = error.response._data.message || errorMessage
    }
    showMsg(errorMessage, 'error')
  } finally {
    isUploading.value = false
  }
}

const deleteIdentityImage = async () => {
  if (!confirm('¿Eliminar documento?')) return
  try {
    await $api(`/usuarios/identidad-foto/${user.value.id_usuario}`, { method: 'DELETE' })
    user.value.identidad_url = null
    user.value.identidad_public_id = null
    showMsg('Identidad eliminada', 'success')
    isIdentityModalOpen.value = false
  } catch (error) {
    let errorMessage = 'Error al eliminar ID'
    if (error.response && error.response._data) {
      errorMessage = error.response._data.message || errorMessage
    }
    showMsg(errorMessage, 'error')
  }
}

const renovarMembresia = async () => {
  showRenewalModal.value = true
  await fetchBankAccounts()
  const data = await $api('/config/valor/membresia')
  if (data) membershipCost.value = data.valor
}

const confirmRenewal = async () => {
  isRenewing.value = true
  try {
    const res = await $api('/membresia', {
      method: 'POST',
      body: {
        id_usuario: user.value.id_usuario,
        id_cuenta: selectedAccount.value,
        num_comprobante: comprobante.value,
        monto: membershipCost.value
      }
    })
    showRenewalModal.value = false
    await fetchMembershipData()
    showMsg('¡Pago enviado para revisión!', 'success')
  } catch (error) {
    let errorMessage = 'Error al enviar pago'
    if (error.response && error.response._data) {
      errorMessage = error.response._data.message || errorMessage
    }
    showMsg(errorMessage, 'error')
  } finally {
    isRenewing.value = false
  }
}

const handleToggleNotifications = async () => {
  if (isSubscribed.value) {
    showUnsubscribeModal.value = true
  } else {
    try {
      const res = await subscribe()
      if (res.success) showMsg('¡Notificaciones activas!', 'success')
    } catch (e) {
      showMsg('Error al activar alertas', 'error')
    }
  }
}

const confirmUnsubscribe = async () => {
  await unsubscribe()
  showUnsubscribeModal.value = false
  showMsg('Notificaciones desactivadas', 'info')
}

const handleLogout = async () => {
  if (confirm('¿Cerrar sesión?')) {
    isLoggingOut.value = true
    await auth.logout()
    navigateTo('/')
  }
}

const formatShortDate = (d) => {
  if (!d) return '--/--/----'
  return new Date(d).toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  if (!auth.isAuthenticated) return navigateTo('/')
  
  await Promise.all([
    fetchUserData(),
    fetchMembershipData(),
    checkSubscription()
  ])
  
  isLoading.value = false
})

useHead({
  title: 'Mi Perfil | RedYMercadeo',
  meta: [
    { name: 'description', content: 'Gestiona tu perfil y ganancias en RedYMercadeo.' }
  ]
})
</script>

<style>
/* Estilos globales para multiselect en modo oscuro */
.multiselect-custom-dark .multiselect__tags {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important;
  color: white !important;
  min-height: 52px !important;
  padding: 8px 40px 0 12px !important;
}

.multiselect-custom-dark .multiselect__single, 
.multiselect-custom-dark .multiselect__input {
  background: transparent !important;
  color: white !important;
  font-weight: 700 !important;
  font-size: 14px !important;
}

.multiselect-custom-dark .multiselect__content-wrapper {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
}

.multiselect-custom-dark .multiselect__option--highlight {
  background: #10b981 !important;
  color: #070b14 !important;
  font-weight: 900 !important;
}

.multiselect-custom-dark .multiselect__option--selected {
  background: rgba(16, 185, 129, 0.2) !important;
  color: #10b981 !important;
}

.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.animate-modal-in {
  animation: modalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
