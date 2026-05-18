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
                  {{ isMembershipActive ? '🏆' : (isMembershipPending ? '⏳' : (isMembershipExpired ? '⚠️' : '🔒')) }}
                </div>
                <div>
                  <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-1">Tu Membresía</h3>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full animate-pulse"
                      :class="{
                        'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]': isMembershipActive,
                        'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]': isMembershipPending,
                        'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]': isMembershipExpired,
                        'bg-gray-500': isMembershipInactive
                      }"></span>
                    <p class="text-[10px] font-black uppercase tracking-[0.2em]"
                       :class="{
                         'text-blue-400': isMembershipActive,
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
                     {{ isMembershipActive ? 'Vencimiento' : (isMembershipPending ? 'Enviado el' : 'Estado') }}
                   </p>
                   <p class="text-xs font-black text-white">
                     {{ isMembershipActive ? formatShortDate(membershipData.fechaVencimiento) : (isMembershipInactive ? 'No activada' : formatShortDate(membershipData.fechaInicio)) }}
                   </p>
               </div>
               <div v-else class="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-center space-y-1">
                  <p class="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Tipo de Cuenta</p>
                  <p class="text-xs font-black text-white italic">Cuenta Administradora</p>
               </div>

               <!-- Activation Button -->
               <div class="flex items-center">
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
               </div>
            </div>

            <!-- Progress Indicator -->
            <div v-if="isMembershipActive && !membershipData.isRoot" class="space-y-3">
              <div class="flex justify-between items-end px-1">
                <div class="flex flex-col">
                  <p class="text-[9px] text-gray-500 font-black uppercase tracking-widest">Progreso del Periodo</p>
                  <p v-if="daysRemaining !== null" class="text-[8px] text-indigo-300 font-bold uppercase tracking-wider">
                    {{ daysRemaining }} {{ daysRemaining === 1 ? 'día' : 'días' }} restante{{ daysRemaining === 1 ? '' : 's' }}
                  </p>
                </div>
                <p class="text-[11px] font-black text-indigo-400">{{ membershipProgress }}%</p>
              </div>
              <div class="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                <div 
                  class="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  :style="`width: ${membershipProgress}%`"
                ></div>
              </div>
            </div>

            <!-- Integrated Benefits (More Explanatory) -->
            <div class="space-y-3 pt-2">
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80 px-1">Tus Beneficios Activos:</p>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="group/benefit bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-[1.5rem] flex items-start gap-4 transition-all hover:bg-white/10 hover:border-emerald-500/30">
                  <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover/benefit:scale-110 transition-transform">
                    <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-white uppercase tracking-tight mb-1">Ganancias Duplicadas (x2)</h4>
                    <p class="text-[10px] text-gray-400 font-medium leading-relaxed">
                      Multiplica x2 el valor de cada interacción publicitaria que realices.
                    </p>
                  </div>
                </div>

                <div class="group/benefit bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-[1.5rem] flex items-start gap-4 transition-all hover:bg-white/10 hover:border-indigo-500/30">
                  <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover/benefit:scale-110 transition-transform">
                     <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-white uppercase tracking-tight mb-1">Acceso Total a Matrix</h4>
                    <p class="text-[10px] text-gray-400 font-medium leading-relaxed">
                      Desbloquea los 5 niveles de tu red y cobra bonos por el crecimiento del equipo.
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


      <!-- Network Matrix Stats -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-black text-xl text-gray-900 dark:text-white">Estado de la Agencia</h3>
          <span class="text-[9px] font-bold px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-300 dark:border-gray-700 uppercase tracking-widest">
            Bono de Equipo Activo
          </span>
        </div>

        <div class="grid grid-cols-1 gap-3">
          <div v-for="level in dynamicLevels" :key="level.id" 
               class="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex flex-col gap-3 transition-all hover:border-emerald-500/30 group relative overflow-hidden">
            
            <!-- Minimal Overlay for Locked Levels -->
            <div v-if="!isLevelUnlocked(level.id)" class="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
              <!-- Barely there background to keep numbers perfectly readable -->
              <div class="absolute inset-0 bg-white/5 dark:bg-gray-900/10"></div>
              
              <!-- Compact Floating Price Button -->
              <button 
                @click.stop="intentarDesbloqueo(level)"
                class="relative z-30 flex items-center gap-3 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-2xl active:scale-95 transition-all group/btn">
                <div class="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div class="flex flex-col items-start leading-none gap-0.5">
                  <span class="text-[7px] font-black uppercase tracking-widest opacity-60">Activar Nivel</span>
                  <span class="text-xs font-black">{{ formatCurrency(level.cost) }}</span>
                </div>
              </button>
            </div>

            <!-- Content (Fully visible but slightly transparent to indicate inactive status) -->
            <div :class="{ 'opacity-100': isLevelUnlocked(level.id), 'opacity-60': !isLevelUnlocked(level.id) }">
              

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div :class="`w-10 h-10 rounded-full bg-gradient-to-br from-${level.color}-500 to-${level.color}-600 flex items-center justify-center text-white font-black shadow-lg shadow-${level.color}-500/20` ">
                    {{ level.id }}
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 dark:text-white">{{ level.label }}</p>
                    <div class="flex items-center gap-1.5 font-bold uppercase tracking-tighter">
                      <span class="text-[10px] text-emerald-500">{{ formatCurrency(level.cost) }}</span>
                      <span class="text-[10px] text-gray-300">/</span>
                      <span class="text-[10px] text-gray-400">Expansión</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Potencial</p>
                  <p class="text-lg font-black text-emerald-500 transition-transform origin-right">{{ formatCurrency(level.totalCommission) }}</p>
                </div>
              </div>

              <!-- Progress Bar (Crystal Clear) -->
              <div class="space-y-1.5 mt-2">
                <div class="flex justify-between items-end px-1">
                  <p class="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                    {{ userMatrixInfo.conteos[level.id] || 0 }} <span class="text-gray-400 font-bold">/ {{ level.people }} Asociados</span>
                  </p>
                  <p class="text-[10px] font-black text-indigo-500">{{ Math.round(((userMatrixInfo.conteos[level.id] || 0) / level.people) * 100) }}%</p>
                </div>
                <div class="h-1.5 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                  <div class="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                       :style="{ width: `${((userMatrixInfo.conteos[level.id] || 0) / level.people) * 100}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- How it works -->
        <div class="mt-8 space-y-6">
          <div class="flex items-center justify-between px-1">
            <h3 class="font-black text-xl text-gray-900 dark:text-white">¿Cómo funciona la red?</h3>
            <span class="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-lg tracking-widest">Guía de Ganancias</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <!-- Option A: Direct -->
            <div class="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.5rem] p-4 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
              <div class="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
              <div class="relative z-10">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <span class="font-black text-[10px] uppercase tracking-wider">Crecimiento Directo</span>
                </div>
                <h4 class="text-sm font-black mb-1">Gana el 100%</h4>
                <p class="text-[10px] text-indigo-100 leading-tight">
                  Recibes el <span class="font-bold underline decoration-white/50">100% de la membresía</span> al instante por cada invitado.
                </p>
              </div>
            </div>

            <!-- Option B: Passive -->
            <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[1.5rem] p-4 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
              <div class="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
              <div class="relative z-10">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <span class="font-black text-[10px] uppercase tracking-wider">Crecimiento en Equipo</span>
                </div>
                <h4 class="text-sm font-black mb-1">Desempeño Global</h4>
                <p class="text-[10px] text-emerald-100 leading-tight">
                  Recibe asociados automáticamente y <span class="font-bold">cobra bonos</span> por desarrollo de equipo.
                </p>
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
      :total-balance="totalEarnings"
      :show-withdraw-button="true"
      :min-withdrawal="minWithdrawal"
      @close="showHistory = false"
      @withdraw="isWithdrawalModalOpen = true"
    />

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
const membershipCost = ref(0)
const bankAccounts = ref([])
const selectedAccount = ref('')
const selectedAccountObject = ref(null)
const isRenewing = ref(false)
const showRenewalModal = ref(false)
const empresaPhoneNumber = ref('')

const isMembershipActive = computed(() => membershipData.value.status === 'activa')
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
  const map = { activa: 'Activa', pendiente: 'Pendiente', vencida: 'Vencida', inactiva: 'Inactiva', rechazada: 'Rechazada' }
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
const history = ref([])
const isLoadingHistory = ref(false)
const minWithdrawal = ref(0)
const route = useRoute()

const openHistory = () => {
  showHistory.value = true
  fetchHistory()
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

const fetchHistory = async () => {
  if (!authStore.userId) return
  isLoadingHistory.value = true
  try {
    const res = await $api(`/interacciones/usuario/${authStore.userId}`)
    if (res.success) {
      history.value = res.data
    }
  } catch (e) {
    console.error('Error fetching history:', e)
  } finally {
    isLoadingHistory.value = false
  }
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

const fetchConfig = async () => {
  try {
    const keys = networkStructure.map(l => l.configKey).join(',')
    const response = await $api(`/config/multi?tipos=${keys}`)
    if (response.success && response.data) {
      configPrices.value = { ...configPrices.value, ...response.data }
      if (response.data.valor_membresia) {
        giftCost.value = parseFloat(response.data.valor_membresia)
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
        status: (progreso >= 100 && m.estado === 'activa' && m.id_membresia !== 0) ? 'vencida' : m.estado,
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

const sendWhatsAppMessage = async (amount, receiptNumber, membershipId, bankName) => {
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
      `*ID de Membresía:* ${formattedDate}-${membershipId || 'N/A'}\n` +
      `*Tipo de pago:* Pago de Membresía\n` + 
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
    const res = await $api('/membresia', {
      method: 'POST',
      body: {
        id_usuario: authStore.userId,
        id_cuenta: selectedAccount.value,
        num_comprobante: comprobante.value,
        monto: membershipCost.value,
      }
    })
    
    showRenewalModal.value = false
    
    if (isUpgradeFromTransfer.value) {
      showMsg('¡Solicitud de upgrade enviada! El admin revisará tu comprobante.', 'success')
    } else {
      showMsg('¡Pago de membresía enviado para revisión!', 'success')
    }
    
    // Notificación por WhatsApp
    await sendWhatsAppMessage(
      membershipCost.value, 
      comprobante.value, 
      res.id_membresia,
      selectedAccountObject.value?.banco
    );

    isUpgradeFromTransfer.value = false
    upgradeTargetLevel.value = null
    comprobante.value = ''
    
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
  return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(val)
}

onMounted(async () => {
  await authStore.initAuth()
  if (!authStore.user) {
    await authStore.fetchUser()
  }
  
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

useHead({
  title: 'Mi Red | RedPlus'
})
</script>

<style scoped>
/* Estilos globales para multiselect en modo oscuro */
.multiselect-custom-dark :deep(.multiselect__tags) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important;
  color: white !important;
  min-height: 52px !important;
  padding: 8px 40px 0 12px !important;
}

.multiselect-custom-dark :deep(.multiselect__single), 
.multiselect-custom-dark :deep(.multiselect__input) {
  background: transparent !important;
  color: white !important;
  font-weight: 700 !important;
  font-size: 14px !important;
}

.multiselect-custom-dark :deep(.multiselect__content-wrapper) {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
  z-index: 100 !important;
}

.multiselect-custom-dark :deep(.multiselect__option) {
  padding: 12px 16px !important;
}

.multiselect-custom-dark :deep(.multiselect__option--highlight) {
  background: transparent !important;
  color: white !important;
}

.multiselect-custom-dark :deep(.multiselect__option--selected) {
  background: rgba(16, 185, 129, 0.1) !important;
  color: #10b981 !important;
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
