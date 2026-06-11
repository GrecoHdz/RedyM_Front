<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white selection:bg-emerald-500/30 overflow-x-hidden pb-24 relative">
    <LoadingSpinner :loading="isLoading" />
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div class="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 class="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">Mi Red</h1>
        <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        </div>
      </div>
    </header>
    <!-- Toast Notification -->
    <Toast 
      :show="toast.show"
      :message="toast.message" 
      :type="toast.type"
      :duration="toast.duration"
      @close="toast.show = false"
    />
    <main class="max-w-2xl mx-auto pt-20 px-4 space-y-6">
      
      <!-- Unified Membership Panel -->
      <section class="mb-8">
        <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900 via-slate-900 to-black border border-white/10 p-6 shadow-2xl group transition-all duration-500 hover:shadow-indigo-500/10">
          <!-- Premium Animated Glows -->
          <div class="absolute -right-24 -top-24 w-80 h-80 blur-[100px] opacity-20 pointer-events-none transition-all duration-1000 group-hover:opacity-40"
            :class="{
              'bg-blue-500': isMembershipActive,
              'bg-amber-500': isMembershipPending,
              'bg-red-500': isMembershipExpired,
              'bg-gray-500': isMembershipInactive
            }"></div>
          <div class="absolute -left-24 -bottom-24 w-80 h-80 blur-[100px] opacity-10 pointer-events-none transition-all duration-1000 group-hover:opacity-30 bg-emerald-500"></div>
          
          <div class="relative z-10 space-y-6">
            <!-- Header: Status & Balance -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center text-3xl border border-white/10 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                  {{ isMembershipActive ? (isMembershipGrace ? '⚠️' : '🏆') : (isMembershipPending ? '⏳' : (isMembershipExpired ? '⚠️' : '🔒')) }}
                </div>
                <div>
                  <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-1">Tu Membresía</h3>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full animate-pulse"
                      :class="{
                        'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]': isMembershipActive && !isMembershipGrace,
                        'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]': isMembershipGrace,
                        'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]': isMembershipPending,
                        'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]': isMembershipExpired,
                        'bg-gray-500': isMembershipInactive
                      }"></span>
                    <p class="text-[10px] font-black uppercase tracking-[0.2em]"
                       :class="{
                         'text-blue-400': isMembershipActive && !isMembershipGrace,
                         'text-amber-500': isMembershipGrace,
                         'text-amber-400': isMembershipPending,
                         'text-red-400': isMembershipExpired,
                         'text-gray-500': isMembershipInactive
                       }">
                      {{ membershipStatus }}
                    </p>
                  </div>
                </div>
              </div>
              <!-- Retirable Balance Card -->
              <button @click="openHistory" class="flex flex-col items-end gap-1 group/balance active:scale-95 transition-all">
                <p class="text-[9px] text-indigo-300 font-bold uppercase tracking-widest group-hover/balance:text-emerald-400 transition-colors">Saldo Retirable</p>
                <div class="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 group-hover/balance:border-emerald-500/30 rounded-2xl transition-all shadow-lg group-hover/balance:bg-white/10">
                  <span class="text-xl font-black text-white group-hover/balance:text-emerald-400 transition-colors">{{ formatCurrency(totalEarnings) }}</span>
                  <svg class="w-4 h-4 text-emerald-500/50 group-hover/balance:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </button>
            </div>
            <!-- Dashboard Grid: Stats & Actions -->
            <div class="grid grid-cols-2 gap-4">
               <!-- Validity Info -->
               <div v-if="!membershipData.isRoot" class="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex flex-col justify-center space-y-1">
                  <p class="text-[9px] text-gray-500 font-black uppercase tracking-widest">
                     {{ isMembershipGrace ? 'Periodo de Gracia' : (isMembershipActive ? 'Vencimiento' : (isMembershipPending ? 'Enviado el' : 'Estado')) }}
                   </p>
                   <p class="text-xs font-black" :class="isMembershipGrace ? 'text-amber-500' : 'text-white'">
                     {{ isMembershipActive ? formatShortDate(membershipData.fechaVencimiento) : (isMembershipInactive ? 'No activada' : formatShortDate(membershipData.fechaInicio)) }}
                   </p>
               </div>
               <div v-else class="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-center space-y-1">
                  <p class="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Tipo de Cuenta</p>
                  <p class="text-xs font-black text-white italic">Cuenta Administradora</p>
               </div>
                <!-- Activation Button -->
                <div class="flex flex-col gap-2">
                  <button 
                   v-if="!membershipData.isRoot"
                    @click="renovarMembresia"
                    :disabled="isMembershipPending"
                    class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-emerald-500/20">
                    {{ isMembershipActive ? 'Renovar Plan' : (isMembershipInactive || isMembershipExpired ? 'Activar Ahora' : 'Pendiente') }}
                  </button>
                  <div v-else class="w-full flex items-center justify-center p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                     <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Acceso Ilimitado</span>
                  </div>
                  <button 
                    v-if="!membershipData.isRoot"
                    @click="openMembershipHistory" 
                    class="w-full py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-wider transition-all active:scale-95">
                    Ver Historial
                  </button>
                </div>
            </div>
            <!-- Progress Indicator -->
            <div v-if="isMembershipActive && !membershipData.isRoot" class="space-y-3">
              <div class="flex justify-between items-end px-1">
                <div class="flex flex-col">
                  <p class="text-[9px] font-black uppercase tracking-widest" :class="isMembershipGrace ? 'text-amber-500' : 'text-gray-500'">
                    {{ isMembershipGrace ? 'Días de Gracia Restantes' : 'Progreso del Periodo' }}
                  </p>
                  <p v-if="isMembershipGrace" class="text-[8px] text-amber-500 font-bold uppercase tracking-wider">
                    {{ Math.max(0, graceDays - Math.floor((new Date() - new Date(membershipData.fechaVencimiento)) / (1000 * 60 * 60 * 24))) }} {{ Math.max(0, graceDays - Math.floor((new Date() - new Date(membershipData.fechaVencimiento)) / (1000 * 60 * 60 * 24))) === 1 ? 'día' : 'días' }} para bloqueo
                  </p>
                  <p v-else-if="daysRemaining !== null" class="text-[8px] text-indigo-300 font-bold uppercase tracking-wider">
                    {{ daysRemaining }} {{ daysRemaining === 1 ? 'día' : 'días' }} restante{{ daysRemaining === 1 ? '' : 's' }}
                  </p>
                </div>
                <p class="text-[11px] font-black" :class="isMembershipGrace ? 'text-amber-500' : 'text-indigo-400'">
                  {{ isMembershipGrace ? 'Expirado' : `${membershipProgress}%` }}
                </p>
              </div>
              <div class="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                <div 
                  class="h-full rounded-full transition-all duration-1000 ease-out"
                  :class="isMembershipGrace ? 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]'"
                  :style="`width: ${isMembershipGrace ? '100' : membershipProgress}%`"
                ></div>
              </div>
            </div>
            <!-- Integrated Benefits (More Explanatory) -->
            <div class="space-y-3 pt-2">
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80 px-1">Beneficios de la Membresia:</p>
              
              <div class="grid grid-cols-2 gap-2">
                <div class="group/benefit bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-[1.5rem] flex items-start gap-4 transition-all hover:bg-white/10 hover:border-emerald-500/30">
                  <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover/benefit:scale-110 transition-transform">
                    <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-white uppercase tracking-tight mb-1">Interacciones x2</h4>
                    <p class="text-[10px] text-gray-400 font-medium leading-relaxed">
                      Multiplica x2 el valor de cada interacción publicitaria que realices.
                    </p>
                  </div>
                </div>
                <div class="group/benefit bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-[1.5rem] flex items-start gap-4 transition-all hover:bg-white/10 hover:border-indigo-500/30">
                  <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover/benefit:scale-110 transition-transform">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-white uppercase tracking-tight mb-1">Acceso a todas las misiones especiales</h4>
                    <p class="text-[10px] text-gray-400 font-medium leading-relaxed">
                      Participa en todas las misiones especiales disponibles sin restricciones.
                    </p>
                  </div>
                </div>
                <div class="group/benefit bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-[1.5rem] flex items-start gap-4 transition-all hover:bg-white/10 hover:border-purple-500/30">
                  <div class="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover/benefit:scale-110 transition-transform">
                    <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-white uppercase tracking-tight mb-1">Ganancia por Referido Directo</h4>
                    <p class="text-[10px] text-gray-400 font-medium leading-relaxed">
                      Gana el 100% de la membresía de cada persona que invites con tu link.
                    </p>
                  </div>
                </div>
                <div class="group/benefit bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-[1.5rem] flex items-start gap-4 transition-all hover:bg-white/10 hover:border-teal-500/30">
                  <div class="w-10 h-10 rounded-2xl bg-teal-500/10 flex items-center justify-center shrink-0 group-hover/benefit:scale-110 transition-transform">
                    <svg class="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-white uppercase tracking-tight mb-1">Ganancia por Derrame</h4>
                    <p class="text-[10px] text-gray-400 font-medium leading-relaxed">
                      Gana por derrame incluso si no invitas a nadie, recibiendo comisiones de niveles inferiores.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Invitation Link Integrated -->
            <div class="pt-4 border-t border-white/5">
              <div class="flex items-center justify-between mb-3 px-1">
                <p class="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Tu Link de Referido</p>
                <div v-if="copied" class="text-[8px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">¡Copiado con éxito!</div>
              </div>
              <div class="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/5 group/link hover:border-indigo-500/30 transition-all">
                <div class="flex-1 truncate px-2 text-[11px] font-bold text-gray-300">
                  {{ referralLink }}
                </div>
                <button @click="copyLink" class="px-5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-wider transition-all">
                  Copiar
                </button>
              </div>
            </div>
            <!-- Gift Button -->
            <div v-if="totalEarnings >= giftCost" class="pt-4 flex justify-center">
              <button @click="isGiftModalOpen = true" class="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 text-emerald-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7z" /></svg>
                Regalar Membresía
              </button>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Global Network Access Control Container -->
      <div class="relative space-y-6 transition-all duration-700" :class="{ 'pointer-events-none select-none': !isMembershipActive }">
        
        <!-- Blurred Content Area -->
        <div :class="{ 'grayscale opacity-50 transition-all duration-700': !isMembershipActive }">
      <!-- Summary of Earnings Section -->
      <section class="grid grid-cols-2 gap-2">
        <!-- Direct Referral Earnings Card -->
        <div class="bg-gradient-to-br from-indigo-500/10 to-blue-500/5 backdrop-blur-md rounded-3xl p-5 border border-indigo-500/15 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
          <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition-all"></div>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-all">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <p class="text-[9px] text-indigo-300/80 font-black uppercase tracking-[0.2em]">Ganado Directo (Membresías)</p>
              <h4 class="text-2xl font-black text-white leading-tight mt-0.5">{{ formatCurrency(directReferralEarnings) }}</h4>
              <p class="text-[10px] text-gray-400 font-bold mt-1">
                {{ realReferidos.filter(r => r.nivel_actual > 0).length }} referidos directos activos
              </p>
            </div>
          </div>
        </div>
        <!-- Network Expansion Earnings Card -->
        <div class="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 backdrop-blur-md rounded-3xl p-5 border border-emerald-500/15 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all"></div>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-all">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <p class="text-[9px] text-emerald-300/80 font-black uppercase tracking-[0.2em]">Ganado en Red (Upgrades)</p>
              <h4 class="text-2xl font-black text-white leading-tight mt-0.5">{{ formatCurrency(networkExpansionEarnings) }}</h4>
              <p class="text-[10px] text-gray-400 font-bold mt-1">
                {{ totalInNetwork }} usuarios activos en red
              </p>
            </div>
          </div>
        </div>
      </section>
      <!-- Network Matrix Stats -->
      <section class="space-y-4">
        <!-- How it works -->
        <div class="mt-8 space-y-6">
          <div class="flex items-center justify-between px-1">
            <h3 class="font-black text-xl text-gray-900 dark:text-white">¿Cómo cobras en la red?</h3>
            <span class="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-lg tracking-widest">Reglas Claras</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Nivel 1 (Hijos) -->
            <div class="bg-black/35 backdrop-blur-md rounded-[1.5rem] p-5 border border-purple-500/10 relative overflow-hidden">
              <div class="flex items-center gap-3 mb-2.5">
                <span class="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs">1</span>
                <h4 class="text-xs font-black uppercase text-white tracking-wider">Tus Hijos (Nivel 1)</h4>
              </div>
              <p class="text-[10.5px] text-gray-400 font-medium leading-relaxed">
                Solo obtienes beneficio si tú los invitaste directamente con tu link. Si tus hijos cayeron por derrame (invitados de tu patrocinador arriba), tú ganas <span class="text-white font-black">$0</span> y la comisión del 100% va para quien los invitó.
              </p>
            </div>
            <!-- Nivel 2 (Nietos) -->
            <div class="bg-black/35 backdrop-blur-md rounded-[1.5rem] p-5 border border-indigo-500/10 relative overflow-hidden">
              <div class="flex items-center gap-3 mb-2.5">
                <span class="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs">2</span>
                <h4 class="text-xs font-black uppercase text-white tracking-wider">Tus Nietos (Nivel 2)</h4>
              </div>
              <p class="text-[10.5px] text-gray-400 font-medium leading-relaxed">
                Tus nietos son los invitados de tus hijos. Cobras <span class="text-emerald-400 font-black">$40 por cada uno</span> de ellos, sin importar quién los invitó, en el momento exacto en el que ellos paguen para subir a su Nivel 2.
              </p>
            </div>
            <!-- Nivel 3 (Bisnietos) -->
            <div class="bg-black/35 backdrop-blur-md rounded-[1.5rem] p-5 border border-blue-500/10 relative overflow-hidden">
              <div class="flex items-center gap-3 mb-2.5">
                <span class="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs">3</span>
                <h4 class="text-xs font-black uppercase text-white tracking-wider">Tus Bisnietos (Nivel 3)</h4>
              </div>
              <p class="text-[10.5px] text-gray-400 font-medium leading-relaxed">
                Tus bisnietos son el tercer nivel en tu matriz. Cobras <span class="text-emerald-400 font-black">$160 por cada uno</span> cuando decidan hacer su expansión para subir a su Nivel 3.
              </p>
            </div>
            <!-- Regla de Calificación -->
            <div class="bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-[1.5rem] p-5 border border-amber-500/15 relative overflow-hidden">
              <div class="flex items-center gap-3 mb-2.5">
                <span class="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">⚠️</span>
                <h4 class="text-xs font-black uppercase text-white tracking-wider">Calificación de Red</h4>
              </div>
              <p class="text-[10.5px] text-gray-400 font-medium leading-relaxed">
                Para cobrar comisiones de tus Nietos (N2), Bisnietos (N3), etc., tú debes estar en el mismo nivel o superior. Si no lo estás, la comisión se saltará tu posición hacia arriba.
              </p>
            </div>
          </div>     
        </div>
        
        <div class="flex items-center justify-between">
          <h3 class="font-black text-xl text-gray-900 dark:text-white">Estado de la Matriz</h3>
          <span class="text-[9px] font-bold px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-300 dark:border-gray-700 uppercase tracking-widest">
            Bono de Equipo Activo
          </span>
        </div>
        <!-- Upgrade Notification Banner -->
        <Transition name="fade">
          <div v-if="upgradeNotification" class="relative overflow-hidden rounded-[1.5rem] border p-5 shadow-lg transition-all bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
            <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none bg-amber-500"></div>
            <div class="relative z-10 flex items-start gap-4">
              <div class="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-black uppercase tracking-wide text-amber-500 mb-1">
                  ¡Ya puedes desbloquear tu Nivel {{ upgradeNotification.nextLevel }}!
                </p>
                <p class="text-[10.5px] text-gray-400 font-bold leading-relaxed">
                  Ya tienes los invitados necesarios pero te faltan <span class="text-white underline">{{ formatCurrency(upgradeNotification.deficit) }}</span> para desbloquearlo. Ten cuidado, ya que si tus Nietos o Bisnietos suben de nivel antes de que tú lo hagas, perderás sus comisiones.
                </p>
                <div class="mt-3 flex items-center justify-between border-t border-amber-500/10 pt-2.5">
                  <span class="text-[9px] text-gray-500 font-black uppercase tracking-widest">
                    Sigue invitando o paga por transferencia
                  </span>
                  <span class="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                    {{ upgradeNotification.referrals }} Directos Activos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <div class="grid grid-cols-1 gap-4">
          <div v-for="level in dynamicLevels" :key="level.id" 
               class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:border-emerald-500/30 group relative shadow-sm">

            <!-- Locked Overlay -->
            <div v-if="!isLevelUnlocked(level.id)" class="absolute inset-0 z-20 flex items-center justify-center">
              <div class="absolute inset-0 bg-white/40 dark:bg-gray-900/60 backdrop-blur-[2px]"></div>
              <button 
                @click.stop="canUnlockLevel(level.id) ? intentarDesbloqueo(level) : null"
                :disabled="!canUnlockLevel(level.id)"
                :class="canUnlockLevel(level.id)
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl active:scale-95 cursor-pointer'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed border border-gray-300 dark:border-gray-700'"
                class="relative z-30 flex items-center gap-3 px-6 py-3 rounded-2xl transition-all">
                <div :class="canUnlockLevel(level.id) ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-400/20 text-gray-400'"
                     class="w-8 h-8 rounded-xl flex items-center justify-center">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div class="flex flex-col items-start leading-tight">
                  <span class="text-[9px] font-black uppercase tracking-widest opacity-70">Activar Nivel</span>
                  <span class="text-sm font-black">{{ formatCurrency(level.cost) }}</span>
                </div>
              </button>
            </div>

            <!-- Header -->
            <div :class="`bg-gradient-to-r from-${level.color}-500/10 to-transparent`"
                 class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center gap-4">
              <div :class="`w-12 h-12 rounded-2xl bg-gradient-to-br from-${level.color}-500 to-${level.color}-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-${level.color}-500/30`">
                {{ level.id }}
              </div>
              <div>
                <h4 class="text-base font-black text-gray-900 dark:text-white leading-tight">{{ level.label }}</h4>
                <p class="text-xs font-bold text-gray-500 mt-0.5">
                  Costo: <span :class="`text-${level.color}-500`">{{ formatCurrency(level.cost) }}</span>
                </p>
              </div>
            </div>

            <div :class="{ 'opacity-50 grayscale-[50%]': !isLevelUnlocked(level.id) }" class="p-5 flex flex-col gap-4">
              
              <!-- Ganancias Highlight -->
              <div class="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Tus Ganancias
                  </span>
                  <p class="text-2xl font-black text-emerald-500 mt-1">
                    {{ formatCurrency((userMatrixInfo.pagados[level.id] || 0) * level.cost) }}
                  </p>
                </div>
                <div class="text-right flex flex-col items-end">
                  <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Potencial Máx.</span>
                  <span class="text-sm font-black text-gray-400">{{ formatCurrency(level.totalCommission) }}</span>
                </div>
              </div>

              <!-- Matrix Status Simple List -->
              <div class="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-gray-800">
                
                <div class="flex justify-between items-center">
                  <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Usuarios en este nivel</span>
                  <span class="text-sm font-black text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    {{ userMatrixInfo.conteos[level.id] || 0 }} <span class="text-gray-400 text-xs">/ {{ level.people }}</span>
                  </span>
                </div>

                <div class="pl-3 border-l-2 border-gray-200 dark:border-gray-700 space-y-2">
                  <!-- Directos/Comisionables -->
                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span class="text-xs font-bold text-gray-600 dark:text-gray-400">Por tu invitación <span class="text-[9px] text-emerald-500 uppercase tracking-wider ml-1">(Pagan comisión)</span></span>
                    </div>
                    <span class="text-xs font-black text-emerald-600 dark:text-emerald-400">{{ userMatrixInfo.pagados[level.id] || 0 }}</span>
                  </div>
                  
                  <!-- Derrame -->
                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <span class="text-xs font-bold text-gray-500 dark:text-gray-500">Por derrame <span class="text-[9px] text-gray-400 uppercase tracking-wider ml-1">(Sin comisión)</span></span>
                    </div>
                    <span class="text-xs font-black text-gray-500">{{ Math.max(0, (userMatrixInfo.conteos[level.id] || 0) - (userMatrixInfo.pagados[level.id] || 0)) }}</span>
                  </div>
                </div>

                <div class="pt-3 mt-1 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Espacios Libres</span>
                  <span class="text-sm font-black text-indigo-500">{{ level.people - (userMatrixInfo.conteos[level.id] || 0) }}</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Network Visualization (Matrix Team) -->
      <section class="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 mt-6 overflow-hidden">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Equipo en Matriz</h3>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Nivel 1 (Directos en Matrix)</p>
          </div>
          <div class="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
            <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Total Red: {{ totalInNetwork }}</span>
          </div>
        </div>
        
        <div class="relative flex flex-col items-center">
          <!-- Root (You) -->
          <div class="flex flex-col items-center mb-8 relative z-10">
            <div class="w-16 h-16 rounded-full border-4 border-emerald-500 bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden shadow-xl">
               <img :src="authStore.user?.imagen_url || `https://ui-avatars.com/api/?name=${authStore.userName || 'Yo'}&background=10b981&color=fff`" class="w-full h-full object-cover" />
            </div>
            <span class="text-[10px] font-black mt-2 text-emerald-500 uppercase tracking-tighter">Tú</span>
            <div class="w-0.5 h-8 bg-gradient-to-b from-emerald-500 to-indigo-500 mt-1"></div>
          </div>
          <!-- Level 1 Children (In Matrix) -->
          <div class="grid grid-cols-3 gap-6 w-full max-w-xs mb-4">
            <div v-for="hijo in realHijos" :key="hijo.id_usuario"
                 @click="openNetworkModal({ ...hijo, name: hijo.nombre, level: 2, id: hijo.id_usuario })"
                 class="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform">
              <div class="w-14 h-14 rounded-full border-2 border-indigo-500 bg-white dark:bg-gray-700 overflow-hidden shadow-md ring-4 ring-indigo-500/10 group-hover:ring-indigo-500/30 transition-all flex items-center justify-center relative">
                <img :src="hijo.imagen_url || `https://ui-avatars.com/api/?name=${hijo.nombre}&background=random&color=fff`" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
              </div>
              <span class="text-[10px] font-bold mt-2 text-gray-700 dark:text-gray-300 truncate w-full text-center">{{ hijo.nombre }}</span>
              <span class="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">Nivel {{ hijo.nivel_actual }}</span>
            </div>
            <!-- Empty spots in matrix -->
            <div v-for="i in (3 - realHijos.length)" :key="'empty-'+i" 
                 class="flex flex-col items-center opacity-40">
              <div class="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              </div>
              <span class="text-[9px] font-bold mt-2 text-gray-400 uppercase">Disponible</span>
            </div>
          </div>
          <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-4">Estos son tus socios directos en la matriz (Derrame)</p>
        </div>
      </section>
      <!-- Direct Referrals (Everyone you invited) -->
      <section class="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 mt-6">
        <h3 class="font-black text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
          <div class="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
          Invitados con tu Link ({{ realReferidos.length }})
        </h3>
        
        <div class="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          <div v-for="ref in realReferidos" :key="ref.id_usuario" 
               class="flex flex-col items-center shrink-0 w-20 group">
            <div class="relative">
              <div class="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm group-hover:border-indigo-500 transition-colors">
                <img :src="ref.imagen_url || `https://ui-avatars.com/api/?name=${ref.nombre}&background=random&color=fff`" class="w-full h-full object-cover" />
              </div>
              <!-- Status dot -->
              <div :class="`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${ref.nivel_actual > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`"></div>
            </div>
            <span class="text-[9px] font-bold text-gray-600 dark:text-gray-400 mt-2 truncate w-full text-center">{{ ref.nombre || 'Invitado' }}</span>
            <span v-if="!ref.nivel_actual || ref.nivel_actual == 0" class="text-[8px] font-black text-amber-500 uppercase tracking-tighter">Pendiente</span>
            <span v-else class="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Nivel {{ ref.nivel_actual }}</span>
          </div>
          <!-- Empty state -->
          <div v-if="realReferidos.length === 0" class="w-full py-4 text-center">
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Aún no tienes invitados directos. ¡Comparte tu link!</p>
          </div>
        </div>
      </section>
    </div><!-- End of Blurred Area -->
  </div><!-- End of Access Control Container -->
      <!-- Network Modal (Recursive Browsing) -->
      <Transition name="fade">
        <div v-if="networkModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeNetworkModal"></div>
          
          <div class="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
            <div class="p-6 flex flex-col items-center">
              <!-- Modal Header with Back navigation if deep -->
              <div class="w-full flex justify-between items-center mb-6">
                <button v-if="networkModal.history.length > 0" @click="goBackInNetwork" class="text-gray-400 hover:text-white">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div v-else class="w-6"></div>
                <h4 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Red de {{ networkModal.currentUser?.name }}</h4>
                <button @click="closeNetworkModal" class="text-gray-400 hover:text-white">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <!-- Parent Info -->
              <div class="flex flex-col items-center mb-8">
                <div class="w-16 h-16 rounded-full border-4 border-indigo-500 p-0.5 mb-2 overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                  <img :src="networkModal.currentUser?.imagen_url || `https://ui-avatars.com/api/?name=${networkModal.currentUser?.name}&background=random&color=fff`" class="rounded-full w-full h-full object-cover" />
                </div>
                <span class="text-xs font-black text-indigo-500 uppercase tracking-tighter">Nivel {{ networkModal.currentUser?.level }}</span>
                <div class="w-0.5 h-6 bg-gray-200 dark:bg-gray-800 mt-2"></div>
              </div>
              <!-- Children Grid -->
              <div v-if="networkModal.isLoading" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
              <div v-else-if="networkModal.currentChildren.length > 0" class="grid grid-cols-3 gap-6 w-full px-4 mb-8">
                <div v-for="hijo in networkModal.currentChildren" :key="hijo.id_usuario" 
                     @click="openNetworkModal({ ...hijo, name: hijo.nombre, id: hijo.id_usuario, level: (networkModal.currentUser?.level || 0) + 1 })"
                     class="flex flex-col items-center cursor-pointer active:scale-95 transition-transform group">
                  <div class="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden mb-2 shadow-sm ring-4 ring-transparent group-hover:ring-blue-500/20 transition-all">
                    <img :src="hijo.imagen_url || `https://ui-avatars.com/api/?name=${hijo.nombre}&background=random&color=fff`" class="w-full h-full object-cover" />
                  </div>
                  <span class="text-[9px] font-bold text-gray-500 truncate w-full text-center">{{ hijo.nombre }}</span>
                </div>
              </div>
              <div v-else class="py-8 text-center">
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sin asociados en este nivel</p>
              </div>
              <p v-if="networkModal.currentUser?.level < 5" class="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center">Puedes seguir navegando clicando en los hijos hasta llegar al nivel 5</p>
            </div>
          </div>
        </div>
      </Transition>
    </main>
    <!-- Modal Solicitar Retiro -->
    <Transition name="fade">
      <div v-if="isWithdrawalModalOpen" @click.self="isWithdrawalModalOpen = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-modal-in">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">💰</div>
            <h3 class="text-xl font-black text-white uppercase tracking-tight">Solicitar Retiro</h3>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Transfiere tus ganancias a tu banco</p>
          </div>
          <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl mb-6 text-center">
            <span class="text-[10px] text-emerald-400 font-black uppercase tracking-widest block mb-1">Monto a Retirar</span>
            <span class="text-2xl font-black text-white">{{ formatCurrency(totalEarnings) }}</span>
          </div>
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Datos de tu Cuenta</label>
              <textarea 
                v-model="withdrawalDetails" 
                placeholder="Ingresa los datos de tu cuenta bancaria (Banco, Número de cuenta, Nombre del titular, etc...)" 
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 transition-all text-white font-bold text-xs min-h-[120px] resize-none"
              ></textarea>
            </div>
            <div class="flex flex-col gap-3 pt-4">
              <button 
                @click="handleWithdrawalRequest"
                :disabled="isRequestingWithdrawal || !withdrawalDetails"
                class="w-full py-4 bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/40 active:scale-95 transition-all disabled:opacity-50">
                {{ isRequestingWithdrawal ? 'Procesando...' : 'Confirmar Retiro' }}
              </button>
              <button @click="isWithdrawalModalOpen = false" class="w-full py-2 text-gray-500 font-bold uppercase tracking-widest text-xs">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <!-- Modal Renovación Membresía (Moved from Perfil) -->
    <Transition name="fade">
      <div v-if="showRenewalModal" @click.self="showRenewalModal = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-modal-in max-h-[90vh] overflow-y-auto">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              {{ isUpgradeFromTransfer ? '🚀' : '🏆' }}
            </div>
            <h3 class="text-xl font-black text-white uppercase tracking-tight">
              {{ isUpgradeFromTransfer ? `Desbloquear Nivel ${upgradeTargetLevel?.id}` : 'Activar Membresía' }}
            </h3>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              {{ isUpgradeFromTransfer ? 'Realiza el pago para subir de nivel' : 'Disfruta beneficios exclusivos' }}
            </p>
          </div>
          <div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-6 text-center">
            <span class="text-[10px] text-blue-400 font-black uppercase tracking-widest block mb-1">Total a Pagar</span>
            <span class="text-2xl font-black text-white">{{ formatCurrency(membershipCost) }}</span>
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
                placeholder="-- Elige una opción --"
                :show-pointer="false"
                select-label=""
                deselect-label=""
                selected-label=""
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
              <div class="flex justify-between items-center text-[10px] uppercase font-bold">
                <span class="text-gray-500">Tipo:</span>
                <span class="text-white">{{ selectedAccountObject.tipo }}</span>
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
              <button @click="showRenewalModal = false; isUpgradeFromTransfer = false; upgradeTargetLevel = null" class="w-full py-2 text-gray-500 font-bold uppercase tracking-widest text-xs">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <!-- Modal Regalar Membresía -->
    <Transition name="fade">
      <div v-if="isGiftModalOpen" @click.self="closeGiftModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-modal-in">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🎁</div>
            <h3 class="text-xl font-black text-white uppercase tracking-tight">Regalar Membresía</h3>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Activa a un amigo usando tu saldo</p>
          </div>
          <div class="space-y-6">
            <!-- Search field -->
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identidad del Beneficiario</label>
              <div class="flex gap-2">
                <input 
                  v-model="searchIdentidad" 
                  type="text" 
                  placeholder="Ej: 0801199912345" 
                  class="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 transition-all text-white font-bold text-xs"
                  @keyup.enter="buscarUsuario"
                >
                <button 
                  @click="buscarUsuario"
                  :disabled="isSearchingUser || !searchIdentidad"
                  class="px-4 bg-emerald-500 text-[#070b14] rounded-xl font-black text-[10px] disabled:opacity-50 transition-all">
                  {{ isSearchingUser ? '...' : 'BUSCAR' }}
                </button>
              </div>
            </div>
            <!-- Found User -->
            <div v-if="foundUser" class="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 animate-fade-in">
              <div class="w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/30">
                <img :src="foundUser.imagen_url || `https://ui-avatars.com/api/?name=${foundUser.nombre}&background=10b981&color=fff`" class="w-full h-full object-cover">
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-xs font-black text-white truncate">{{ foundUser.nombre }}</h4>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">{{ foundUser.identidad }}</span>
                </div>
              </div>
              <div class="text-right flex flex-col gap-1">
                 <span class="text-[7px] font-black text-gray-500 uppercase tracking-widest">Membresía</span>
                 <div :class="`px-2 py-0.5 rounded-lg text-center ${foundUser.estado_membresia === 'activa' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`">
                   <span class="text-[8px] font-black uppercase">{{ foundUser.estado_membresia === 'ninguna' ? 'Inactiva' : foundUser.estado_membresia }}</span>
                 </div>
              </div>
            </div>
            <!-- Error/Not Found -->
            <div v-if="searchError" class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              <p class="text-[10px] font-bold text-red-400">{{ searchError }}</p>
            </div>
            <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center">
              <span class="text-[10px] text-emerald-400 font-black uppercase tracking-widest block mb-1">Costo de Regalo</span>
              <span class="text-2xl font-black text-white">{{ formatCurrency(giftCost) }}</span>
            </div>
            <div class="flex flex-col gap-3 pt-4">
              <button 
                @click="confirmGift"
                :disabled="!foundUser || isSendingGift || totalEarnings < giftCost || foundUser.estado_membresia === 'activa' || foundUser.estado_membresia === 'pendiente'"
                class="w-full py-4 bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/40 active:scale-95 transition-all disabled:opacity-50">
                <span v-if="isSendingGift">Enviando...</span>
                <span v-else-if="foundUser && (foundUser.estado_membresia === 'activa' || foundUser.estado_membresia === 'pendiente')">Ya posee Membresía</span>
                <span v-else-if="totalEarnings < giftCost">Saldo Insuficiente</span>
                <span v-else>Confirmar Regalo</span>
              </button>
              <button @click="closeGiftModal" class="w-full py-2 text-gray-500 font-bold uppercase tracking-widest text-xs">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <!-- Interactions History Modal -->
    <InteractionHistoryModal 
      :show="showHistory"
      :history="history"
      :loading="isLoadingHistory"
      :has-next-page="hasNextPage"
      :has-prev-page="hasPrevPage"
      :total-balance="totalEarnings"
      :show-withdraw-button="true"
      :min-withdrawal="minWithdrawal"
      @close="showHistory = false"
      @withdraw="handleWithdraw"
      @next-page="nextPage"
      @prev-page="prevPage"
    />
    <!-- Membership History Modal -->
    <Transition name="fade">
      <div v-if="showMembershipHistoryModal" @click.self="showMembershipHistoryModal = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="relative w-full max-w-sm bg-[#0f172a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-modal-in">
          <!-- Header -->
          <div class="p-6 border-b border-white/5 flex items-center justify-between bg-[#0f172a]/50 backdrop-blur-xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl">
                💳
              </div>
              <div>
                <h3 class="text-sm font-black text-white uppercase tracking-wider">Historial de Membresías</h3>
                <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Tus compras y activaciones</p>
              </div>
            </div>
            <button @click="showMembershipHistoryModal = false" class="p-2 text-gray-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar no-scrollbar">
            <div v-if="isLoadingMembershipHistory" class="flex flex-col items-center justify-center py-12 space-y-4">
              <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cargando historial...</p>
            </div>
            
            <template v-else-if="membershipHistory.length > 0">
              <div v-for="item in membershipHistory" :key="item.id_membresia" class="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all group">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-white">
                      Membresía {{ item.estado === 'activa' ? 'Activa' : (item.estado === 'pendiente' ? 'Pendiente' : (item.estado === 'vencida' ? 'Vencida' : 'Rechazada')) }}
                    </span>
                    <span v-if="item.id_pagador && item.id_pagador !== authStore.userId" class="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-wider">
                      Regalo 🎁
                    </span>
                    <span v-else-if="item.id_pagador && item.id_pagador === authStore.userId" class="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-wider">
                      Tú Regalaste
                    </span>
                  </div>
                  <p class="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                    {{ item.id_pagador && item.id_pagador !== authStore.userId ? 'Regalado por patrocinador' : 'Pago directo / Saldo' }}
                  </p>
                  <p class="text-[8px] text-gray-500 font-medium mt-0.5">{{ formatShortDate(item.fecha) }}</p>
                </div>
                <div class="text-right shrink-0">
                  <span class="text-xs font-black text-white">{{ formatCurrency(item.monto) }}</span>
                  <p class="text-[7px]" :class="{
                    'text-emerald-400': item.estado === 'activa',
                    'text-amber-400': item.estado === 'pendiente',
                    'text-red-400': item.estado === 'vencida' || item.estado === 'rechazada'
                  }">{{ item.estado.toUpperCase() }}</p>
                </div>
              </div>
            </template>
            <div v-else class="flex flex-col items-center justify-center py-12 text-center">
              <div class="text-4xl mb-4 opacity-20">💳</div>
              <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">No hay registros de membresías</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from '~/components/footers/BottomNav.vue'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Multiselect from 'vue-multiselect'
import InteractionHistoryModal from '~/components/ui/InteractionHistoryModal.vue'
import { useInteractionHistory } from '~/composables/useInteractionHistory'
import { useAuthStore } from '~/middleware/auth.store'
const { $api } = useNuxtApp()
const authStore = useAuthStore()
// Link de Referido Dinámico
const copied = ref(false)
const referralLink = computed(() => {
  if (process.server) return ''
  const baseUrl = window.location.origin
  return `${baseUrl}/?ref=${authStore.userId || '1'}`
})
const copyToClipboard = async (text) => {
  try {
    if (!text) return
    
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.left = "-9999px"
    textArea.style.top = "0"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch (err) {
    console.error('Error al copiar:', err)
    return false
  }
}
const copyLink = async () => {
  if (process.client) {
    const success = await copyToClipboard(referralLink.value)
    if (success) {
      copied.value = true
      setTimeout(() => copied.value = false, 2000)
    }
  }
}
// Precios dinámicos cargados desde el backend
const configPrices = ref({
  valor_membresia: "20.00",
  nivel2_costo: "40.00",
  nivel3_costo: "160.00",
  nivel4_costo: "320.00",
  nivel5_costo: "640.00"
})
const isLoading = ref(true)
const userMatrixInfo = ref({
  conteos: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  pagados: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  mi_nivel: 0
})
const totalEarnings = ref(0)
const realHijos = ref([])
const realReferidos = ref([])
// Membresía
const membershipData = ref({
  status: 'inactiva',
  progress: 0,
  fechaInicio: null,
  fechaVencimiento: null
})
const graceDays = ref(5) // Valor por defecto
const membershipCost = ref(0)
const bankAccounts = ref([])
const selectedAccount = ref('')
const selectedAccountObject = ref(null)
const isRenewing = ref(false)
const showRenewalModal = ref(false)
const empresaPhoneNumber = ref('')
const comprobante = ref('')
const isMembershipActive = computed(() => ['activa', 'gracia'].includes(membershipData.value.status))
const isMembershipGrace = computed(() => membershipData.value.status === 'gracia')
const isMembershipPending = computed(() => membershipData.value.status === 'pendiente')
const isMembershipExpired = computed(() => membershipData.value.status === 'vencida')
const isMembershipInactive = computed(() => ['inactiva', 'rechazada'].includes(membershipData.value.status) || !membershipData.value.status)
const membershipProgress = computed(() => membershipData.value.progress)
const daysRemaining = computed(() => {
  if (!membershipData.value.fechaVencimiento || membershipData.value.isRoot) return null
  const hoy = new Date()
  const vencimiento = new Date(membershipData.value.fechaVencimiento)
  const diffTime = vencimiento - hoy
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
})
const membershipStatus = computed(() => {
  const map = { activa: 'Activa', gracia: 'Periodo Gracia ⚠️', pendiente: 'Pendiente', vencida: 'Vencida', inactiva: 'Inactiva', rechazada: 'Rechazada' }
  if (membershipData.value.isRoot) return 'Vitalicia'
  return map[membershipData.value.status] || 'Inactiva'
})
// Legacy hasMembership for compatibility
const hasMembership = computed(() => isMembershipActive.value)
watch(selectedAccountObject, (newVal) => {
  selectedAccount.value = newVal ? newVal.id_cuenta : ''
})
// Withdrawal State
const isWithdrawalModalOpen = ref(false)
const withdrawalDetails = ref('')
const isRequestingWithdrawal = ref(false)
// Utils
const isLevelUnlocked = (lId) => {
  if (lId === 1 && (isMembershipActive.value || membershipData.value.isRoot)) return true
  return userMatrixInfo.value.mi_nivel >= lId
}
// Verifica si el usuario tiene los referidos necesarios para poder desbloquear el nivel (nivel previo completo)
const canUnlockLevel = (lId) => {
  if (lId === 1) return true // Nivel 1 = activar membresía, siempre habilitado
  const networkStructureMap = { 1: 3, 2: 9, 3: 27, 4: 81, 5: 243 }
  const prevLevel = lId - 1
  const required = networkStructureMap[prevLevel] || 3
  const current = userMatrixInfo.value.conteos?.[prevLevel] || 0
  return current >= required
}
// Level Upgrade State
const isUpgrading = ref(false)
const upgradeTargetLevel = ref(null)
const isUpgradeFromTransfer = ref(false)
// Gift State
const isGiftModalOpen = ref(false)
const searchIdentidad = ref('')
const foundUser = ref(null)
const isSearchingUser = ref(false)
const searchError = ref('')
const isSendingGift = ref(false)
const giftCost = ref(20) // Default membership cost
// Toast
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 5000
})
// History State
const showHistory = ref(false)

const { history, isLoading: isLoadingHistory, hasNextPage, hasPrevPage, loadInitial, nextPage, prevPage } = useInteractionHistory()
const minWithdrawal = ref(0)
const route = useRoute()
// Membership History State
const showMembershipHistoryModal = ref(false)
const membershipHistory = ref([])
const isLoadingMembershipHistory = ref(false)
const openMembershipHistory = () => {
  showMembershipHistoryModal.value = true
  fetchMembershipHistory()
}
const fetchMembershipHistory = async () => {
  if (!authStore.userId) return
  isLoadingMembershipHistory.value = true
  try {
    const res = await $api(`/membresia/historial/${authStore.userId}`)
    if (res.status === 'success') {
      membershipHistory.value = res.data
    }
  } catch (e) {
    console.error('Error fetching membership history:', e)
  } finally {
    isLoadingMembershipHistory.value = false
  }
}
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
const showMsg = (message, type = 'info') => {
  toast.value.show = false
  nextTick(() => {
    toast.value = { show: true, message, type, duration: 5000 }
  })
}
// Configuración de la estructura (personas por nivel)
const networkStructure = [
  { id: 1, label: 'Nivel 1', people: 3, configKey: 'valor_membresia', color: 'purple' },
  { id: 2, label: 'Nivel 2', people: 9, configKey: 'nivel2_costo', color: 'indigo' },
  { id: 3, label: 'Nivel 3', people: 27, configKey: 'nivel3_costo', color: 'blue' },
  { id: 4, label: 'Nivel 4', people: 81, configKey: 'nivel4_costo', color: 'teal' },
  { id: 5, label: 'Nivel 5', people: 243, configKey: 'nivel5_costo', color: 'emerald' }
]
// Calcular niveles dinámicos basados en la configuración recibida
const dynamicLevels = computed(() => {
  return networkStructure.map(level => {
    const cost = parseFloat(configPrices.value[level.configKey] || 0)
    return {
      ...level,
      cost: cost,
      totalCommission: cost * level.people
    }
  })
})
const totalInNetwork = computed(() => {
  if (!userMatrixInfo.value.conteos) return 0
  return Object.values(userMatrixInfo.value.conteos).reduce((a, b) => a + b, 0)
})
// Ganancias por invitaciones directas (referidos directos activos * membresía)
const directReferralEarnings = computed(() => {
  const activeReferrals = realReferidos.value.filter(r => r.nivel_actual > 0).length
  const cost = parseFloat(configPrices.value.valor_membresia || 20)
  return activeReferrals * cost
})
// Ganancias acumuladas por upgrades de red
const networkExpansionEarnings = computed(() => {
  if (!userMatrixInfo.value.pagados || !dynamicLevels.value) return 0
  return dynamicLevels.value.reduce((total, level) => {
    const activeCount = userMatrixInfo.value.pagados[level.id] || 0
    return total + (activeCount * level.cost)
  }, 0)
})
// Notification: user qualifies for next level by referrals but lacks balance
const upgradeNotification = computed(() => {
  if (!isMembershipActive.value && !membershipData.value.isRoot) return null
  const currentLevel = userMatrixInfo.value.mi_nivel
  if (currentLevel === undefined || currentLevel < 1 || currentLevel >= 5) return null
  const nextLevel = currentLevel + 1
  if (!canUnlockLevel(nextLevel)) return null
  const nextLevelData = dynamicLevels.value.find(l => l.id === nextLevel)
  if (!nextLevelData) return null
  const cost = nextLevelData.cost
  const balance = totalEarnings.value
  
  // ONLY show if they DON'T have enough balance to trigger automatic upgrade
  if (balance >= cost) return null
  const deficit = Math.max(0, cost - balance)
  const referrals = userMatrixInfo.value.conteos[1] || 0
  return { nextLevel, cost, deficit, referrals }
})
const fetchConfig = async () => {
  try {
    const keys = networkStructure.map(l => l.configKey).join(',') + ',dias_gracia_membresia'
    const response = await $api(`/config/multi?tipos=${keys}`)
    if (response.success && response.data) {
      configPrices.value = { ...configPrices.value, ...response.data }
      if (response.data.valor_membresia) {
        giftCost.value = parseFloat(response.data.valor_membresia)
      }
      if (response.data.dias_gracia_membresia) {
        graceDays.value = parseInt(response.data.dias_gracia_membresia, 10) || 5
      }
    }
  } catch (error) {
    console.error("Error cargando configuración de precios:", error)
  }
}
const fetchUserProgress = async () => {
  try {
    if (!authStore.userId) return
    const response = await $api(`/red/progreso/${authStore.userId}`)
    if (response.success) {
      userMatrixInfo.value = response.data
    }
  } catch (error) {
    console.error("Error al obtener progreso:", error)
  }
}
const fetchNetworkData = async () => {
  try {
    if (!authStore.userId) return
    const response = await $api(`/red/mi-red/${authStore.userId}`)
    console.log('[RedPage] Datos de red recibidos:', response)
    if (response.success) {
      realHijos.value = response.data.hijos || []
      realReferidos.value = response.data.referidosDirectos || []
      console.log('[RedPage] Referidos directos procesados:', realReferidos.value)
    }
  } catch (error) {
    console.error("Error al obtener datos de red:", error)
  }
}
const fetchCreditBalance = async () => {
  try {
    if (!authStore.userId) return
    const res = await $api(`/credito/usuario/${authStore.userId}`)
    if (res && res.success && res.data) {
      totalEarnings.value = parseFloat(res.data.monto_credito || 0)
      
      // Check for automatic upgrades after updating balance
      await checkAutoUpgrade()
    }
  } catch (error) {
    console.error('Error fetching credit:', error)
  }
}
const upgradeLevel = async () => {
  if (isUpgrading.value) return
  isUpgrading.value = true
  try {
    const response = await $api('/red/upgrade', {
      method: 'POST',
      body: { id_usuario: authStore.userId }
    })
    
    if (response.success) {
      showMsg(`¡Felicidades! Has subido al Nivel ${response.nivel_nuevo}`, 'success')
      await refreshAll()
    } else {
      showMsg(response.error || 'No se pudo realizar el upgrade', 'error')
    }
  } catch (error) {
    console.error('Error upgrade:', error)
    showMsg('Error al procesar el upgrade', 'error')
  } finally {
    isUpgrading.value = false
  }
}
const checkAutoUpgrade = async () => {
  if (!isMembershipActive.value && !membershipData.value.isRoot) return
  if (!userMatrixInfo.value || userMatrixInfo.value.mi_nivel === undefined) return
  const currentLevel = userMatrixInfo.value.mi_nivel
  // Auto-upgrade only for L2+ because L1 is linked to membership status/approval
  if (currentLevel < 1 || currentLevel >= 5) return
  // Regla: Para subir al Nivel 2, debe tener al menos 3 personas en su Nivel 1
  if (currentLevel === 1) {
    const hijosL1 = userMatrixInfo.value.conteos[1] || 0
    if (hijosL1 < 3) return
  }
  const nextLevelId = currentLevel + 1
  const nextLevel = dynamicLevels.value.find(l => l.id === nextLevelId)
  
  if (nextLevel && totalEarnings.value >= nextLevel.cost) {
    console.log(`[AutoUpgrade] Saldo suficiente ($${totalEarnings.value}) para Nivel ${nextLevelId} ($${nextLevel.cost})`)
    await upgradeLevel()
  }
}
const intentarDesbloqueo = (level) => {
  if (level.id === 1) {
    renovarMembresia()
    return
  }
  if (totalEarnings.value >= level.cost) {
    // Si tiene saldo, se intenta el upgrade directo
    upgradeLevel()
  } else {
    // Si no tiene saldo, se abre el modal de transferencia
    upgradeTargetLevel.value = level
    isUpgradeFromTransfer.value = true
    membershipCost.value = level.cost
    selectedAccountObject.value = null
    comprobante.value = ''
    showRenewalModal.value = true
    fetchBankAccounts()
  }
}
const refreshAll = async () => {
  isLoading.value = true
  await Promise.all([
    fetchUserProgress(),
    fetchNetworkData(),
    fetchCreditBalance(),
    fetchMembershipData()
  ])
  isLoading.value = false
}
const fetchMembershipData = async () => {
  try {
    const data = await $api(`/membresia/${authStore.userId}`)
    console.log('[Membresía] Datos crudos de membresía recibidos:', data)
    if (data && data.status === 'success' && data.data) {
      const m = data.data
      const fechaInicio = new Date(m.fecha)
      const fechaFin = new Date(m.fecha)
      
      // Ajustado exactamente a 30 días, sin días de gracia adicionales para el progreso visible
      fechaFin.setDate(fechaFin.getDate() + 30)
      
      // Calcular progreso
      const hoy = new Date()
      const total = 30 * 24 * 60 * 60 * 1000 // 30 días exactos en ms
      const transcurrido = hoy - fechaInicio
      let progreso = Math.min(100, Math.max(0, Math.round((transcurrido / total) * 100)))
      
      console.log(`[Membresía] Hoy: ${hoy.toISOString()} | Fin ciclo 30 días: ${fechaFin.toISOString()}`)
      console.log(`[Membresía] Progreso calculado: ${progreso}% | Estado BD: ${m.estado}`)
      
      // Si ya pasaron los 30 días pero la membresía sigue 'activa' en el backend porque está dentro de los días de gracia
      let statusCalculado = m.estado
      if (progreso >= 100 && m.estado === 'activa' && m.id_membresia !== 0) {
        const diasDesdeFin = Math.floor((hoy - fechaFin) / (1000 * 60 * 60 * 24))
        const diasGraciaRestantes = Math.max(0, graceDays.value - diasDesdeFin)
        
        console.log(`[Membresía] Días de gracia configurados: ${graceDays.value}`)
        console.log(`[Membresía] Días transcurridos desde vencimiento: ${diasDesdeFin}`)
        console.log(`[Membresía] Días de gracia restantes para el usuario: ${diasGraciaRestantes}`)
        
        if (diasDesdeFin <= graceDays.value) {
          statusCalculado = 'gracia'
        } else {
          statusCalculado = 'vencida'
        }
      }
      
      membershipData.value = {
        status: statusCalculado,
        progress: m.id_membresia === 0 ? 0 : progreso,
        fechaInicio: fechaInicio,
        fechaVencimiento: m.id_membresia === 0 ? null : fechaFin,
        isRoot: m.id_membresia === 0
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
const renovarMembresia = async () => {
  selectedAccountObject.value = null
  comprobante.value = ''
  showRenewalModal.value = true
  await fetchBankAccounts()
  try {
    const data = await $api('/config/multi?tipos=valor_membresia')
    if (data && data.success && data.data) {
      membershipCost.value = Number(data.data.valor_membresia) || 0
    }
  } catch (error) {
    console.error("Error al obtener precio membresia:", error)
    membershipCost.value = 0
  }
}
const buscarUsuario = async () => {
  if (!searchIdentidad.value) return
  isSearchingUser.value = true
  searchError.value = ''
  foundUser.value = null
  try {
    const res = await $api(`/usuarios/identidad/${searchIdentidad.value}`)
    if (res && res.success) {
      foundUser.value = res.data
      if (foundUser.value.id_usuario === authStore.userId) {
        foundUser.value = null
        searchError.value = 'No puedes regalarte a ti mismo'
      }
    }
  } catch (error) {
    searchError.value = error.response?._data?.message || 'Usuario no encontrado'
  } finally {
    isSearchingUser.value = false
  }
}
const confirmGift = async () => {
  if (!foundUser.value || isSendingGift.value) return
  isSendingGift.value = true
  try {
    const response = await $api('/membresia/regalar', {
      method: 'POST',
      body: {
        id_usuario_destino: foundUser.value.id_usuario,
        id_usuario_pagador: authStore.userId,
        monto: giftCost.value
      }
    })
    
    if (response && response.success) {
      showMsg('¡Regalo enviado! Tu saldo ha sido retenido para aprobación.', 'success')
      closeGiftModal()
      await refreshAll()
    }
  } catch (error) {
    showMsg(error.response?._data?.message || 'Error al enviar regalo', 'error')
  } finally {
    isSendingGift.value = false
  }
}
const closeGiftModal = () => {
  isGiftModalOpen.value = false
  searchIdentidad.value = ''
  foundUser.value = null
  searchError.value = ''
}
const sendWhatsAppMessage = async (amount, receiptNumber, membershipId, bankName, isUpgrade = false) => {
  try {
    if (!empresaPhoneNumber.value) {
      await fetchEmpresaPhoneNumber();
    }
    
    // Obtener la fecha actual en formato DDMMYY
    const today = new Date();
    const formattedDate = [
      String(today.getDate()).padStart(2, '0'),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getFullYear()).slice(-2)
    ].join('');
    
    const message = `*Comprobante de Pago*\n\n` +
      `*${isUpgrade ? 'ID de Solicitud' : 'ID de Membresía'}:* ${formattedDate}-${membershipId || 'N/A'}\n` +
      `*Tipo de pago:* ${isUpgrade ? `Upgrade Nivel ${upgradeTargetLevel.value?.id}` : 'Pago de Membresía'}\n` + 
      `*N° de comprobante:* ${receiptNumber}\n` +
      `*Banco destino:* ${bankName || 'N/A'}\n` +
      `*Monto:* $${Number(amount).toFixed(2)}\n\n` +
      `Adjunto una captura del comprobante de pago para su verificación.`;
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = empresaPhoneNumber.value;
    
    window.open(`https://wa.me/+504${phoneNumber}?text=${encodedMessage}`, '_blank');
  } catch (error) {
    console.error('Error al preparar el mensaje de WhatsApp:', error);
  }
};
const fetchEmpresaPhoneNumber = async () => {
  try {
    const response = await $api('/config/valor/numero_empresa', { method: 'GET' });
    if (response && response.valor) {
      empresaPhoneNumber.value = response.valor;
    } else {
      empresaPhoneNumber.value = '1234567890';
    }
  } catch (error) {
    console.error('Error al obtener el número de teléfono de la empresa:', error);
    empresaPhoneNumber.value = '1234567890';
  }
};
const confirmRenewal = async () => {
  isRenewing.value = true
  try {
    let res
    const isUpgrade = isUpgradeFromTransfer.value
    const targetLevelId = upgradeTargetLevel.value?.id
    if (isUpgrade) {
      res = await $api('/red-solicitudes', {
        method: 'POST',
        body: {
          id_usuario: authStore.userId,
          id_cuenta: selectedAccount.value,
          num_comprobante: comprobante.value,
          monto: membershipCost.value,
          nivel_destino: targetLevelId
        }
      })
    } else {
      res = await $api('/membresia', {
        method: 'POST',
        body: {
          id_usuario: authStore.userId,
          id_cuenta: selectedAccount.value,
          num_comprobante: comprobante.value,
          monto: membershipCost.value,
        }
      })
    }
    
    showRenewalModal.value = false
    
    if (isUpgrade) {
      showMsg('¡Solicitud de upgrade enviada! El admin revisará tu comprobante.', 'success')
    } else {
      showMsg('¡Pago de membresía enviado para revisión!', 'success')
    }
    
    // Notificación por WhatsApp
    await sendWhatsAppMessage(
      membershipCost.value, 
      comprobante.value, 
      isUpgrade ? res.data?.id_solicitud : res.id_membresia,
      selectedAccountObject.value?.banco,
      isUpgrade
    );
    isUpgradeFromTransfer.value = false
    upgradeTargetLevel.value = null
    comprobante.value = ''
    selectedAccountObject.value = null
    
    await fetchMembershipData()
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
const formatShortDate = (d) => {
  if (!d) return '--/--/----'
  return new Date(d).toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: 'numeric' })
}
const handleWithdrawalRequest = async () => {
  if (!withdrawalDetails.value) {
    return showMsg('Por favor ingresa los datos de tu cuenta', 'error')
  }
  
  isRequestingWithdrawal.value = true
  try {
    const response = await $api('/retiros', {
      method: 'POST',
      body: {
        id_usuario: authStore.userId,
        monto: totalEarnings.value,
        detalles_cuenta: withdrawalDetails.value
      }
    })
    
    if (response && response.success) {
      isWithdrawalModalOpen.value = false
      withdrawalDetails.value = ''
      await fetchCreditBalance()
      showMsg('¡Solicitud de retiro enviada correctamente!', 'success')
    }
  } catch (error) {
    console.error("Error al solicitar retiro:", error)
    let errorMessage = 'Error al solicitar retiro'
    if (error.response && error.response._data) {
      errorMessage = error.response._data.message || errorMessage
    }
    showMsg(errorMessage, 'error')
  } finally {
    isRequestingWithdrawal.value = false
  }
}
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}
onMounted(async () => {
  await authStore.initAuth()
  if (!authStore.user) {
    await authStore.fetchUser()
  }
  
  // Esperar primero a que cargue la configuración de gracia para tener graceDays.value disponible
  await fetchConfig()
  
  await Promise.all([
    fetchUserProgress(),
    fetchNetworkData(),
    fetchCreditBalance(),
    fetchMembershipData(),
    fetchMinWithdrawal()
  ])
  // Check for withdraw redirect
  if (route.query.withdraw === 'true') {
    isWithdrawalModalOpen.value = true
  }
  isLoading.value = false
})
const levelsData = [
  { id: 1, label: 'Nivel 1', count: 3, guests: ['Ana', 'Luis', 'Mía'], color: 'indigo' },
]
// Modal Logic for recursive browsing
const networkModal = ref({
  show: false,
  currentUser: null,
  currentChildren: [],
  isLoading: false,
  history: []
})
const openNetworkModal = async (user) => {
  if (user.level > 5) return // Limite de la matriz
  
  // Guardar en historial si ya había alguien
  if (networkModal.value.currentUser) {
    networkModal.value.history.push({
      user: networkModal.value.currentUser,
      children: networkModal.value.currentChildren
    })
  }
  
  networkModal.value.currentUser = user
  networkModal.value.show = true
  networkModal.value.isLoading = true
  networkModal.value.currentChildren = []
  try {
    const userId = user.id || user.id_usuario
    const response = await $api(`/red/mi-red/${userId}`)
    if (response.success) {
      networkModal.value.currentChildren = response.data.hijos || []
    }
  } catch (error) {
    console.error("Error al cargar hijos en el modal:", error)
  } finally {
    networkModal.value.isLoading = false
  }
}
const goBackInNetwork = () => {
  if (networkModal.value.history.length > 0) {
    const prev = networkModal.value.history.pop()
    networkModal.value.currentUser = prev.user
    networkModal.value.currentChildren = prev.children
  }
}
const closeNetworkModal = () => {
  networkModal.value.show = false
  networkModal.value.currentUser = null
  networkModal.value.currentChildren = []
  networkModal.value.history = []
}
// SEO and Meta
useHead({
  title: 'PubliGana - Mi Red',
  meta: [
    { name: 'description', content: 'Gestiona tu red y comisiones en la comunidad PubliGana.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.9, user-scalable=no' }
  ]
})
</script>
<style scoped>
/* Estilos globales para multiselect en modo oscuro */
.multiselect-custom-dark :deep(.multiselect__tags) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important;
  padding-top: 10px !important;
  min-height: 44px !important;
  transition: all 0.3s ease !important;
}
.multiselect-custom-dark :deep(.multiselect__single), 
.multiselect-custom-dark :deep(.multiselect__input) {
  background: transparent !important;
  color: #fff !important;
  font-size: 0.875rem !important;
  font-weight: 700 !important;
}
.multiselect-custom-dark :deep(.multiselect__content-wrapper) {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important;
  margin-top: 5px !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
  z-index: 100 !important;
}
.multiselect-custom-dark :deep(.multiselect__option) {
  padding: 12px 16px !important;
  color: white !important;
}
.multiselect-custom-dark :deep(.multiselect__option--highlight) {
  background: transparent !important;
  color: white !important;
}
.multiselect-custom-dark :deep(.multiselect__option--selected) {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
}
.fade-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>