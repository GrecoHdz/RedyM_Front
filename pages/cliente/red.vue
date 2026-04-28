<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white selection:bg-emerald-500/30 overflow-x-hidden pb-24 relative">
    
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div class="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 class="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">Mi Red</h1>
        <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        </div>
      </div>
    </header>

    <main class="max-w-2xl mx-auto pt-20 px-4 space-y-6">
      
      <!-- Premium Membership Banner -->
      <section class="relative bg-gradient-to-br from-indigo-900 via-gray-900 to-black rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-900/20 overflow-hidden border border-white/10">
        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <button @click="refreshAll" :disabled="isLoading" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 transition-all active:scale-95 disabled:opacity-50">
                <i :class="`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`"></i>
              </button>
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <i class="fas fa-network-wired text-[#070b14] text-xl"></i>
              </div>
              <div>
                <h2 class="text-xl font-black tracking-tight">{{ hasMembership ? 'Afiliado Premium' : 'Afiliado Básico' }}</h2>
                <p class="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-0.5">Membresía {{ hasMembership ? 'Activa' : 'Inactiva' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-indigo-200 font-bold uppercase tracking-widest mb-0.5">Saldo Retirable</p>
              <p class="text-xl font-black text-white bg-white/10 px-3 py-1 rounded-xl backdrop-blur-sm border border-white/5">{{ formatCurrency(totalEarnings) }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex flex-col gap-2">
              <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <p class="text-[10px] font-bold text-gray-300 leading-tight">Ganancias<br>Multiplicadas</p>
              <p class="text-[9px] text-gray-500 leading-tight">Interacciones con publicidad pagan el doble</p>
            </div>
            <div class="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex flex-col gap-2">
              <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <p class="text-[10px] font-bold text-gray-300 leading-tight">Agencia y<br>Referidos</p>
              <p class="text-[9px] text-gray-500 leading-tight">Acceso a comisiones de red y bonos</p>
            </div>
          </div>

          <!-- Invitation Link Integrated -->
          <div class="bg-black/40 rounded-2xl p-4 border border-white/5">
            <div class="flex items-center justify-between mb-2">
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tu Link de Integración</p>
              <span class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div class="flex items-center gap-2 bg-black/50 p-1.5 rounded-xl border border-white/10">
              <div class="flex-1 truncate px-2 text-xs font-medium text-gray-300">
                {{ referralLink }}
              </div>
              <button @click="copyLink" class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/30 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all">
                {{ copied ? 'Copiado!' : 'Copiar' }}
              </button>
            </div>
          </div>
        </div>
      </section>

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
            
            <!-- Level Status Indicator -->
            <div v-if="userMatrixInfo.mi_nivel >= level.id" class="absolute top-0 right-0">
              <div class="bg-emerald-500 text-white text-[8px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-sm tracking-widest">Desbloqueado</div>
            </div>

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
                <p class="text-lg font-black text-emerald-500 group-hover:scale-110 transition-transform origin-right">{{ formatCurrency(level.totalCommission) }}</p>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="space-y-1.5">
              <div class="flex justify-between items-end px-1">
                <p class="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                  {{ userMatrixInfo.conteos[level.id] || 0 }} <span class="text-gray-400 font-bold">/ {{ level.people }} Asociados</span>
                </p>
                <p class="text-[10px] font-black text-indigo-500">{{ Math.round(((userMatrixInfo.conteos[level.id] || 0) / level.people) * 100) }}%</p>
              </div>
              <div class="h-1.5 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                <div class="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                     :style="{ width: `${((userMatrixInfo.conteos[level.id] || 0) / level.people) * 100}%` }"></div>
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

          <!-- Step by Step Upgrade Logic -->
          <div class="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 space-y-4">
            <h4 class="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Ruta de Crecimiento</h4>
            <div class="space-y-4">
              <div v-for="level in dynamicLevels.slice(0, 3)" :key="'step-'+level.id" class="flex gap-4">
                <div :class="`shrink-0 w-8 h-8 rounded-full bg-${level.color}-500 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-${level.color}-500/30` ">
                  {{ level.id }}
                </div>
                <p v-if="level.id === 1" class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pt-1">
                  Entras con <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(level.cost) }}</span>. Recuperas tu inversión con tu primer invitado directo o por derrame.
                </p>
                <p v-else-if="level.id === 2" class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pt-1">
                  Desbloqueas el <span class="font-bold text-gray-900 dark:text-white">{{ level.label }} ({{ formatCurrency(level.cost) }})</span>. Ahora cobras upgrades de tus {{ level.people }} invitados en el segundo nivel.
                </p>
                <p v-else class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pt-1">
                  ¡El límite es tu ambición! Repite el proceso hasta el <span class="font-bold text-gray-900 dark:text-white">Nivel 5</span>.
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

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from '~/components/footers/BottomNav.vue'
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
const hasMembership = ref(false)
const realHijos = ref([])
const realReferidos = ref([])

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
    }
  } catch (error) {
    console.error('Error fetching credit:', error)
  }
}

const fetchMembershipStatus = async () => {
  try {
    if (!authStore.userId) return
    const res = await $api(`/membresia/${authStore.userId}`)
    if (res && res.status === 'success' && res.data) {
       hasMembership.value = res.data.estado === 'activa'
    }
  } catch (e) {
    console.error('Error fetching membership:', e)
  }
}

const refreshAll = async () => {
  isLoading.value = true
  await Promise.all([
    fetchUserProgress(),
    fetchNetworkData(),
    fetchCreditBalance(),
    fetchMembershipStatus()
  ])
  isLoading.value = false
}

onMounted(async () => {
  await Promise.all([
    fetchConfig(),
    fetchUserProgress(),
    fetchNetworkData(),
    fetchCreditBalance(),
    fetchMembershipStatus()
  ])
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

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

useHead({
  title: 'Mi Red | RedPlus'
})
</script>

<style scoped>
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
