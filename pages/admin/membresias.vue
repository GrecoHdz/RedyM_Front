<template>
  <div class="min-h-screen bg-[#070b14] text-gray-100 font-['Outfit'] pb-20">
    <Toast 
      :show="toast.show"
      :message="toast.message" 
      :type="toast.type"
      @close="toast.show = false"
    />

    <LoadingSpinner :loading="isLoading" message="Cargando información..." />

    <!-- Header -->
    <header class="fixed top-0 inset-x-0 z-40 bg-[#070b14]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <i class="fas fa-shield-alt text-[#070b14] text-xl"></i>
        </div>
        <div>
          <h1 class="text-lg font-black uppercase tracking-tight leading-none">Admin Panel</h1>
          <p class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">{{ sectionTitle }}</p>
        </div>
      </div>
      
      <button @click="$router.push('/cliente/Perfil')" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
        <i class="fas fa-user-circle"></i>
      </button>
    </header>

    <main class="pt-24 px-4 max-w-4xl mx-auto">
      <!-- Main Section Navigation -->
      <nav class="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-[2rem] border border-white/10 shadow-2xl">
        <button v-for="sec in mainSections" :key="sec.id"
          @click="currentSection = sec.id"
          :class="`relative flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${currentSection === sec.id ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#070b14] shadow-xl scale-[1.02]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`">
          <!-- Pending Badge -->
          <div v-if="pendingCounts[sec.id] > 0" 
            class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-[#070b14] shadow-lg z-10 animate-pulse">
            {{ pendingCounts[sec.id] }}
          </div>
          <i :class="sec.icon"></i>
          <span class="hidden sm:inline">{{ sec.label }}</span>
        </button>
      </nav>

      <!-- Summary Cards (Only for Memberships now, or adapted per section) -->
      <section v-if="currentSection === 'membresias'" class="grid grid-cols-3 gap-3 mb-8">
        <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-4 text-center">
          <span class="block text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Recaudado</span>
          <span class="text-lg font-black text-white">${{ Number(estadisticas.total || 0).toFixed(2) }}</span>
        </div>
        <div class="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-4 text-center">
          <span class="block text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1">Pendientes</span>
          <span class="text-lg font-black text-white">{{ estadisticas.pendientes }}</span>
        </div>
        <div class="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-4 text-center">
          <span class="block text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">Activas</span>
          <span class="text-lg font-black text-white">{{ estadisticas.aprobados }}</span>
        </div>
      </section>

      <!-- Section: MEMBRESIAS -->
      <template v-if="currentSection === 'membresias'">
        <!-- Tabs Filter -->
        <div class="flex gap-2 mb-6 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button v-for="tab in membershipTabs" :key="tab.id"
            @click="activeMembershipTab = tab.id"
            :class="`relative flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMembershipTab === tab.id ? 'bg-emerald-500 text-[#070b14] shadow-lg' : 'text-gray-500 hover:text-white'}`">
            <div v-if="tab.id === 'pendiente' && pendingCounts.membresias > 0" 
              class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center border-2 border-[#070b14]">
              {{ pendingCounts.membresias }}
            </div>
            {{ tab.label }}
          </button>
        </div>

        <!-- Requests List -->
        <div class="space-y-4">
          <div v-if="filteredMembresias.length === 0" class="py-20 text-center opacity-40">
            <i class="fas fa-folder-open text-4xl mb-4"></i>
            <p class="text-xs font-bold uppercase tracking-widest">No hay membresías en esta categoría</p>
          </div>

          <TransitionGroup name="list" tag="div" class="grid grid-cols-2 gap-3 sm:gap-4">
            <div v-for="item in filteredMembresias" :key="item.id_membresia" 
                 class="bg-white/5 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-5 backdrop-blur-sm group hover:border-emerald-500/30 transition-all flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2 sm:gap-4">
                    <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 overflow-hidden cursor-zoom-in" @click="viewFullImage(item.usuario.imagen_url || `https://ui-avatars.com/api/?name=${item.usuario.nombre}&background=random&color=fff`)">
                      <img :src="item.usuario.imagen_url || `https://ui-avatars.com/api/?name=${item.usuario.nombre}&background=random&color=fff`" class="w-full h-full object-cover">
                    </div>
                    <div>
                      <h3 class="text-xs sm:text-sm font-black text-white uppercase tracking-tight">{{ item.usuario.nombre }}</h3>
                       <div class="flex items-center gap-1 sm:gap-2 mt-0.5">
                         <span class="text-[7px] sm:text-[9px] font-bold text-emerald-500">{{ formatDate(item.fecha) }}</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-5 pt-3 sm:pt-4 border-t border-white/5">
                  <div class="space-y-1">
                    <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest block">Banco Emisor</span>
                    <p class="text-[10px] sm:text-xs font-black text-white uppercase truncate">{{ item.cuenta?.banco || '---' }}</p>
                  </div>
                  <div class="space-y-1">
                    <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest block">
                      {{ item.pagador ? 'Enviado por' : 'Comprobante' }}
                    </span>
                    <p class="text-[10px] sm:text-xs font-black text-emerald-400 select-all truncate">
                      {{ item.pagador ? item.pagador.nombre : (item.num_comprobante || '---') }}
                    </p>
                  </div>
                  <div class="space-y-1">
                    <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest block">Monto Pagado</span>
                    <p class="text-[10px] sm:text-xs font-black text-white">${{ Number(item.monto || 0).toFixed(2) }}</p>
                  </div>
                  <div class="space-y-1">
                    <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest block">N° Comprobante</span>
                    <p class="text-[10px] sm:text-xs font-black text-gray-400">#{{ item.num_comprobante }}</p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div v-if="item.estado === 'pendiente'" class="grid grid-cols-2 gap-2 pt-3 sm:pt-4 border-t border-white/5">
                <button @click="confirmAction(item, 'rechazar', 'membresia')" 
                  class="py-2 sm:py-3 px-2 sm:px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest border border-red-500/20 transition-all flex items-center justify-center gap-1 sm:gap-2">
                  <i class="fas fa-times"></i>
                  Rechazar
                </button>
                <button @click="confirmAction(item, 'aprobar', 'membresia')" 
                  class="py-2 sm:py-3 px-2 sm:px-4 bg-emerald-500 text-[#070b14] rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest border border-emerald-500 transition-all flex items-center justify-center gap-1 sm:gap-2 shadow-lg shadow-emerald-500/20">
                  <i class="fas fa-check"></i>
                  Aprobar
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </template>

      <!-- Section: SOLICITUDES DE NIVEL -->
      <template v-if="currentSection === 'solicitudes_nivel'">
        <!-- Tabs Filter -->
        <div class="flex gap-2 mb-6 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button v-for="tab in levelTabs" :key="tab.id"
            @click="activeLevelTab = tab.id"
            :class="`relative flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeLevelTab === tab.id ? 'bg-emerald-500 text-[#070b14] shadow-lg' : 'text-gray-500 hover:text-white'}`">
            <div v-if="tab.id === 'pendiente' && pendingCounts.solicitudes_nivel > 0" 
              class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center border-2 border-[#070b14]">
              {{ pendingCounts.solicitudes_nivel }}
            </div>
            {{ tab.label }}
          </button>
        </div>

        <!-- Requests List -->
        <div class="space-y-4">
          <div v-if="filteredSolicitudesNivel.length === 0" class="py-20 text-center opacity-40">
            <i class="fas fa-folder-open text-4xl mb-4"></i>
            <p class="text-xs font-bold uppercase tracking-widest">No hay solicitudes de nivel en esta categoría</p>
          </div>

          <TransitionGroup name="list" tag="div" class="grid grid-cols-2 gap-3 sm:gap-4">
            <div v-for="item in filteredSolicitudesNivel" :key="item.id_solicitud" 
                 class="bg-white/5 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-5 backdrop-blur-sm group hover:border-emerald-500/30 transition-all flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2 sm:gap-4">
                    <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 overflow-hidden cursor-zoom-in" @click="viewFullImage(item.usuario.imagen_url || `https://ui-avatars.com/api/?name=${item.usuario.nombre}&background=random&color=fff`)">
                      <img :src="item.usuario.imagen_url || `https://ui-avatars.com/api/?name=${item.usuario.nombre}&background=random&color=fff`" class="w-full h-full object-cover">
                    </div>
                    <div>
                      <h3 class="text-xs sm:text-sm font-black text-white uppercase tracking-tight">{{ item.usuario.nombre }}</h3>
                       <div class="flex items-center gap-1 sm:gap-2 mt-0.5">
                         <span class="text-[7px] sm:text-[9px] font-bold text-emerald-500">{{ formatDate(item.fecha) }}</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-5 pt-3 sm:pt-4 border-t border-white/5">
                  <div class="space-y-1">
                    <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest block">Banco Emisor</span>
                    <p class="text-[10px] sm:text-xs font-black text-white uppercase truncate">{{ item.cuenta?.banco || '---' }}</p>
                  </div>
                  <div class="space-y-1">
                    <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest block">Nivel Objetivo</span>
                    <p class="text-[10px] sm:text-xs font-black text-emerald-400 select-all truncate">
                      Nivel {{ item.nivel_destino }}
                    </p>
                  </div>
                  <div class="space-y-1">
                    <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest block">Monto Pagado</span>
                    <p class="text-[10px] sm:text-xs font-black text-white">${{ Number(item.monto || 0).toFixed(2) }}</p>
                  </div>
                  <div class="space-y-1">
                    <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest block">Comprobante</span>
                    <p class="text-[10px] sm:text-xs font-black text-gray-400 select-all truncate">{{ item.num_comprobante || '---' }}</p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div v-if="item.estado === 'pendiente'" class="grid grid-cols-2 gap-2 pt-3 sm:pt-4 border-t border-white/5">
                <button @click="confirmAction(item, 'rechazar', 'solicitudes_nivel')" 
                  class="py-2 sm:py-3 px-2 sm:px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest border border-red-500/20 transition-all flex items-center justify-center gap-1 sm:gap-2">
                  <i class="fas fa-times"></i>
                  Rechazar
                </button>
                <button @click="confirmAction(item, 'aprobar', 'solicitudes_nivel')" 
                  class="py-2 sm:py-3 px-2 sm:px-4 bg-emerald-500 text-[#070b14] rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest border border-emerald-500 transition-all flex items-center justify-center gap-1 sm:gap-2 shadow-lg shadow-emerald-500/20">
                  <i class="fas fa-check"></i>
                  Aprobar
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </template>

      <!-- Section: PUBLICACIONES (Gestión de Publicaciones) -->
      <template v-if="currentSection === 'publicaciones'">
        <!-- Info Banner -->
        <div class="mb-6 bg-violet-500/10 border border-violet-500/20 rounded-3xl p-4 flex items-start gap-3">
          <span class="text-2xl">📢</span>
          <div>
            <p class="text-[11px] font-black text-white uppercase tracking-widest mb-1">Gestión de Publicaciones</p>
            <p class="text-[10px] text-gray-400 leading-relaxed">Revisa los comprobantes de pago de cada publicación. Al aprobar, la publicación se activará y aparecerá en el feed.</p>
          </div>
        </div>

        <!-- Tabs Filter -->
        <div class="flex gap-2 mb-6 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button v-for="tab in publicacionTabs" :key="tab.id"
            @click="activePublicacionTab = tab.id"
            :class="`relative flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePublicacionTab === tab.id ? 'bg-violet-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`">
            <div v-if="tab.id === 'pendiente' && pendingCounts.publicaciones > 0" 
              class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center border-2 border-[#070b14]">
              {{ pendingCounts.publicaciones }}
            </div>
            {{ tab.label }}
          </button>
        </div>

        <div class="space-y-4">
          <div v-if="filteredPublicaciones.length === 0" class="py-20 text-center opacity-40">
            <i class="fas fa-check-circle text-4xl mb-4 text-emerald-500"></i>
            <p class="text-xs font-bold uppercase tracking-widest">No hay publicaciones en esta categoría</p>
          </div>

          <TransitionGroup name="list" tag="div" 
            class="grid grid-cols-2 gap-2 sm:gap-4">
            <div v-for="pub in filteredPublicaciones" :key="pub.id_publicacion"
              @click="openPubDetail(pub)"
              class="bg-white/5 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden backdrop-blur-sm group hover:border-violet-500/30 transition-all flex flex-col cursor-pointer">
              
              <!-- Header: User info + Status -->
              <div class="flex items-center justify-between px-3 sm:px-5 pt-3 sm:pt-4 pb-1.5 sm:pb-2">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 overflow-hidden cursor-zoom-in flex-shrink-0" @click="viewFullImage(pub.usuario?.imagen_url || `https://ui-avatars.com/api/?name=${pub.usuario?.nombre}&background=random&color=fff`)">
                    <img :src="pub.usuario?.imagen_url || `https://ui-avatars.com/api/?name=${pub.usuario?.nombre}&background=random&color=fff`" class="w-full h-full object-cover">
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-[10px] sm:text-xs font-black text-white uppercase tracking-tight truncate">{{ pub.usuario?.nombre }}</h3>
                    <div class="flex items-center gap-1 mt-0.5">
                      <span class="text-[7px] sm:text-[8px] font-bold text-violet-400">{{ formatDate(pub.fecha) }}</span>
                    </div>
                  </div>
                </div>
                <span class="hidden sm:inline-block text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" :class="getPublicacionStatusClass(pub.estado)">
                  {{ getPublicacionStatusLabel(pub) }}
                </span>
              </div>

              <!-- Content preview -->
              <div v-if="pub.content" class="px-3 sm:px-5 pb-2 sm:pb-3">
                <p class="text-[9px] sm:text-[11px] text-gray-300 leading-relaxed line-clamp-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">{{ pub.content }}</p>
              </div>

              <!-- Media preview -->
              <div v-if="pub.media && pub.media.length > 0" class="px-3 sm:px-5 pb-2 sm:pb-3">
                <div class="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <div v-for="(mediaItem, idx) in pub.media" :key="idx" 
                       class="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-black/40 border border-white/10 cursor-pointer active:scale-95 transition-transform"
                       :class="mediaItem.type === 'image' ? 'cursor-zoom-in' : ''"
                       @click.stop="mediaItem.type === 'image' ? viewFullImage(mediaItem.url) : viewFullVideo(mediaItem.url)">
                    <img v-if="mediaItem.type === 'image'" :src="mediaItem.url" class="w-full h-full object-cover">
                    <div v-else class="relative w-full h-full bg-black">
                      <video :src="mediaItem.url + '#t=0.1'" class="w-full h-full object-cover pointer-events-none" preload="metadata" muted></video>
                      <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span class="text-[10px] sm:text-sm">🎥</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-auto">
                <!-- Budget bar (only for active) -->
                <div v-if="pub.estado === 'activa'" class="px-3 sm:px-5 pb-3 sm:pb-4">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest">Resto</span>
                    <span class="text-[8px] sm:text-[9px] font-black" :class="getBudgetColor(pub)">
                      ${{ Number(pub.presupuesto_restante || 0).toFixed(0) }} / ${{ Number(pub.presupuesto || 0).toFixed(0) }}
                    </span>
                  </div>
                  <div class="w-full h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all" :class="getBudgetBarClass(pub)" :style="{ width: getBudgetPercent(pub) + '%' }"></div>
                  </div>
                </div>

                <!-- Stats row for active publications -->
                <div v-if="pub.estado === 'activa'" class="flex items-center gap-0 border-t border-white/5 divide-x divide-white/5">
                  <div class="flex-1 py-1.5 sm:py-2 text-center">
                    <p class="text-[6px] sm:text-[7px] font-black text-gray-600 uppercase tracking-widest">Vistas</p>
                    <p class="text-[10px] sm:text-xs font-black text-white">{{ pub.vistas || 0 }}</p>
                  </div>
                  <div class="flex-1 py-1.5 sm:py-2 text-center">
                    <p class="text-[6px] sm:text-[7px] font-black text-gray-600 uppercase tracking-widest">Int.</p>
                    <p class="text-[10px] sm:text-xs font-black text-white">{{ pub.total_interacciones || 0 }}</p>
                  </div>
                  <div class="flex-1 py-1.5 sm:py-2 text-center">
                    <p class="text-[6px] sm:text-[7px] font-black text-gray-600 uppercase tracking-widest">Likes</p>
                    <p class="text-[10px] sm:text-xs font-black text-white">{{ pub.likes || 0 }}</p>
                  </div>
                </div>

                <!-- Payment details grid (for pending) -->
                <div v-if="pub.estado === 'verificando_pago'" class="px-5 pb-4">
                  <div class="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                    <div class="space-y-0.5">
                      <span class="text-[7px] font-black text-gray-500 uppercase tracking-widest block">Monto</span>
                      <p class="text-xs font-black text-white">$ {{ Number(pub.presupuesto || 0).toFixed(2) }}</p>
                    </div>
                    <div class="space-y-0.5">
                      <span class="text-[7px] font-black text-gray-500 uppercase tracking-widest block">Comprobante</span>
                      <p class="text-[9px] font-black text-violet-400 select-all truncate">{{ pub.num_comprobante || '—' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Actions (only for pending) -->
                <div v-if="pub.estado === 'verificando_pago'" class="px-5 pb-5">
                  <div class="grid grid-cols-2 gap-2 pt-4 border-t border-white/5">
                    <button @click="confirmAction(pub, 'rechazar', 'publicacion')"
                      class="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-500/20 transition-all flex items-center justify-center gap-1.5">
                      <i class="fas fa-times text-[10px]"></i> Rechazar
                    </button>
                    <button @click="confirmAction(pub, 'aprobar', 'publicacion')"
                      class="py-2 px-3 bg-emerald-500 text-[#070b14] rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20">
                      <i class="fas fa-check text-[10px]"></i> Activar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Pagination Controls for Publications -->
          <div v-if="pubTotalPages > 1" class="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm mt-8 p-1">
            <button 
              @click="pubPage > 1 && pubPage--" 
              :disabled="pubPage === 1"
              class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none active:scale-95"
            >
              <i class="fas fa-chevron-left text-xs"></i>
            </button>
            
            <div class="flex flex-col items-center">
              <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest">Página</span>
              <span class="text-[11px] font-black text-white mt-0.5">{{ pubPage }} <span class="text-gray-600">/</span> {{ pubTotalPages }}</span>
            </div>

            <button 
              @click="pubPage < pubTotalPages && pubPage++" 
              :disabled="pubPage === pubTotalPages"
              class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none active:scale-95"
            >
              <i class="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      </template>

      <!-- Section: IDENTIDAD -->
      <template v-if="currentSection === 'identidad'">
        <!-- Tabs Filter -->
        <div class="flex gap-2 mb-6 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button v-for="tab in identityTabs" :key="tab.id"
            @click="activeIdentityTab = tab.id"
            :class="`relative flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeIdentityTab === tab.id ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`">
            <div v-if="tab.id === 'pendiente' && pendingCounts.identidad > 0" 
              class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center border-2 border-[#070b14]">
              {{ pendingCounts.identidad }}
            </div>
            {{ tab.label }}
          </button>
        </div>

        <div class="space-y-4">
          <div v-if="filteredIdentidades.length === 0" class="py-20 text-center opacity-40">
            <i class="fas fa-id-card text-4xl mb-4"></i>
            <p class="text-xs font-bold uppercase tracking-widest">No hay identidades por revisar</p>
          </div>

          <TransitionGroup name="list" tag="div" class="grid grid-cols-2 gap-3 sm:gap-4">
            <div v-for="user in filteredIdentidades" :key="user.id_usuario" 
                 class="bg-white/5 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-5 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-5">
                  <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 overflow-hidden cursor-zoom-in" @click="viewFullImage(user.imagen_url || `https://ui-avatars.com/api/?name=${user.nombre}&background=random&color=fff`)">
                    <img :src="user.imagen_url || `https://ui-avatars.com/api/?name=${user.nombre}&background=random&color=fff`" class="w-full h-full object-cover">
                  </div>
                  <div>
                    <h3 class="text-xs sm:text-sm font-black text-white uppercase tracking-tight">{{ user.nombre }}</h3>
                    <p class="text-[7px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-widest">DNI: {{ user.identidad || 'No provisto' }}</p>
                  </div>
                </div>

                <div class="aspect-video bg-black/40 rounded-[1rem] sm:rounded-2xl border border-white/5 overflow-hidden mb-3 sm:mb-5 relative group cursor-zoom-in" @click="viewFullImage(user.identidad_url)">
                  <img :src="user.identidad_url" class="w-full h-full object-contain">
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i class="fas fa-search-plus text-2xl text-white"></i>
                  </div>
                </div>
              </div>

              <div v-if="!user.verificado" class="grid grid-cols-2 gap-2">
                <button @click="confirmAction(user, 'rechazar', 'identidad')" 
                  class="py-2 sm:py-3 px-2 sm:px-4 bg-red-500/10 text-red-500 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase border border-red-500/20 text-center">
                  Rechazar
                </button>
                <button @click="confirmAction(user, 'aprobar', 'identidad')" 
                  class="py-2 sm:py-3 px-2 sm:px-4 bg-blue-500 text-white rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase shadow-lg shadow-blue-500/20 text-center">
                  Aprobar
                </button>
              </div>
              <div v-else class="py-2 sm:py-3 px-2 sm:px-4 bg-emerald-500/10 text-emerald-500 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase text-center border border-emerald-500/20 flex items-center justify-center gap-1 sm:gap-2">
                <i class="fas fa-check-circle"></i>
                Verificado
              </div>
            </div>
          </TransitionGroup>
        </div>
      </template>

      <!-- Section: RETIROS -->
      <template v-if="currentSection === 'retiros'">
        <!-- Tabs Filter -->
        <div class="flex gap-2 mb-6 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button v-for="tab in withdrawTabs" :key="tab.id"
            @click="activeWithdrawTab = tab.id"
            :class="`relative flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeWithdrawTab === tab.id ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`">
            <div v-if="tab.id === 'pendiente' && pendingCounts.retiros > 0" 
              class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center border-2 border-[#070b14]">
              {{ pendingCounts.retiros }}
            </div>
            {{ tab.label }}
          </button>
        </div>

        <div class="space-y-4">
          <div v-if="filteredRetiros.length === 0" class="py-20 text-center opacity-40">
            <i class="fas fa-money-bill-wave text-4xl mb-4"></i>
            <p class="text-xs font-bold uppercase tracking-widest">No hay retiros en esta categoría</p>
          </div>

          <TransitionGroup name="list" tag="div" class="grid grid-cols-2 gap-3 sm:gap-4">
            <div v-for="retiro in filteredRetiros" :key="retiro.id_retiro" 
                 class="bg-white/5 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-5 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 sm:mb-4">
                  <div class="flex items-center gap-2 sm:gap-4">
                    <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 overflow-hidden cursor-zoom-in" @click="viewFullImage(retiro.usuario.imagen_url || `https://ui-avatars.com/api/?name=${retiro.usuario.nombre}&background=random&color=fff`)">
                      <img :src="retiro.usuario.imagen_url || `https://ui-avatars.com/api/?name=${retiro.usuario.nombre}&background=random&color=fff`" class="w-full h-full object-cover">
                    </div>
                    <div>
                      <h3 class="text-xs sm:text-sm font-black text-white uppercase tracking-tight truncate max-w-[80px] sm:max-w-none">{{ retiro.usuario.nombre }}</h3>
                      <p class="text-[7px] sm:text-[9px] font-bold text-emerald-500">{{ formatDate(retiro.fecha) }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-sm font-black text-white">$ {{ Number(retiro.monto).toFixed(2) }}</span>
                    <p :class="`text-[7px] sm:text-[8px] font-black uppercase tracking-widest ${getStatusClass(retiro.estado)}`">{{ retiro.estado }}</p>
                  </div>
                </div>

                <div class="bg-black/20 rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-white/5 mb-3 sm:mb-5">
                  <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-1">Detalles</span>
                  <p class="text-[10px] sm:text-xs font-bold text-gray-300 leading-relaxed truncate">{{ retiro.detalles_cuenta }}</p>
                </div>
              </div>

              <div v-if="retiro.estado === 'pendiente'" class="grid grid-cols-2 gap-2">
                <button @click="confirmAction(retiro, 'rechazado', 'retiro')" 
                  class="py-2 sm:py-3 px-2 sm:px-4 bg-red-500/10 text-red-500 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase border border-red-500/20 text-center">
                  Rechazar
                </button>
                <button @click="confirmAction(retiro, 'aprobado', 'retiro')" 
                  class="py-2 sm:py-3 px-2 sm:px-4 bg-purple-500 text-white rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase shadow-lg shadow-purple-500/20 text-center">
                  Aprobar
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </template>
    </main>

    <!-- ====== MODAL DE ESTADÍSTICAS SEGMENTADAS ====== -->
    <Transition name="fade">
      <div v-if="showStatsModal" @click.self="showStatsModal = false"
        class="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-6 w-full max-w-md shadow-2xl animate-modal-in max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-black text-white uppercase tracking-tight">Estadísticas de Audiencia</h3>
              <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Segmentación detallada</p>
            </div>
            <button @click="showStatsModal = false" class="text-gray-500 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div v-if="loadingStats" class="py-12 flex flex-col items-center justify-center gap-4">
            <svg class="animate-spin h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            <p class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Cargando métricas...</p>
          </div>

          <div v-else-if="selectedPubStats" class="space-y-8">
            
            <!-- Resumen Rápido -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
                <p class="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Vistas Totales</p>
                <p class="text-2xl font-black text-white">{{ selectedPubStats.totalVistas }}</p>
              </div>
              <div class="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
                <p class="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Interacciones</p>
                <p class="text-2xl font-black text-emerald-500">{{ selectedPubStats.totalInteracciones }}</p>
              </div>
            </div>

            <!-- Desglose de Interacciones -->
            <div class="space-y-3">
              <h4 class="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-4 h-px bg-emerald-500/30"></span> Tipos de Interacción
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div v-if="selectedPubStats.desgloseInteracciones.like > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">❤️</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Likes</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.like }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.share > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">↗️</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Compartidos</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.share }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.visita_whatsapp > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">📱</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">WhatsApp</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.visita_whatsapp }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.visita_web > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">🌐</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Web</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.visita_web }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.poll > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">📊</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Encuestas</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.poll }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.video_view > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">🎥</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Vistas Video</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.video_view }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.click > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">🖱️</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Clicks</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.click }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.vista > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">👁️</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Vistas</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.vista }}</p>
                </div>
              </div>
            </div>

            <!-- Por Ciudad -->
            <div class="space-y-3">
              <h4 class="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-4 h-px bg-violet-500/30"></span> Alcance por Ciudad
              </h4>
              <div class="space-y-3">
                <div v-for="c in selectedPubStats.vistasPorCiudad" :key="c.nombre" class="space-y-1.5">
                  <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span class="text-gray-300">{{ c.nombre }}</span>
                    <span class="text-white">{{ c.total }}</span>
                  </div>
                  <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-violet-500 rounded-full transition-all duration-1000" 
                      :style="{ width: ((selectedPubStats.totalVistas + selectedPubStats.totalInteracciones) > 0 ? (c.total / (selectedPubStats.totalVistas + selectedPubStats.totalInteracciones) * 100) : 0) + '%' }"></div>
                  </div>
                </div>
                <p v-if="selectedPubStats.vistasPorCiudad.length === 0" class="text-center text-[9px] text-gray-600 font-bold uppercase py-4">Sin datos de ubicación</p>
              </div>
            </div>

            <!-- Por Género -->
            <div class="space-y-3">
              <h4 class="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-4 h-px bg-emerald-500/30"></span> Alcance por Género
              </h4>
              <div class="flex items-center gap-4">
                <div v-for="g in selectedPubStats.interaccionesPorGenero" :key="g.genero" 
                  v-show="g.total > 0"
                  class="flex-1 text-center space-y-1">
                  <div class="text-[8px] font-black text-gray-500 uppercase tracking-tighter">{{ g.genero }}</div>
                  <div class="text-lg font-black text-white">{{ g.total }}</div>
                  <div class="text-[8px] font-bold text-gray-600">{{ ((selectedPubStats.totalInteracciones + selectedPubStats.totalVistas) > 0 ? Math.round(g.total / (selectedPubStats.totalInteracciones + selectedPubStats.totalVistas) * 100) : 0) }}%</div>
                </div>
                <p v-if="selectedPubStats.totalInteracciones === 0 && selectedPubStats.totalVistas === 0" class="w-full text-center text-[9px] text-gray-600 font-bold uppercase py-4">Sin datos de género</p>
              </div>
            </div>

            <!-- Por Edad -->
            <div class="space-y-3">
              <h4 class="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-4 h-px bg-blue-500/30"></span> Alcance por Edad
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="e in selectedPubStats.vistasPorEdad" :key="e.rango" 
                  v-show="e.total > 0"
                  class="flex items-center gap-3">
                  <span class="text-[9px] font-black text-gray-500 w-10 shrink-0">{{ e.rango }}</span>
                  <div class="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full" :style="{ width: ((selectedPubStats.totalVistas + selectedPubStats.totalInteracciones) > 0 ? (e.total / (selectedPubStats.totalVistas + selectedPubStats.totalInteracciones) * 100) : 0) + '%' }"></div>
                  </div>
                  <span class="text-[9px] font-black text-white shrink-0">{{ e.total }}</span>
                </div>
              </div>
              <p v-if="(selectedPubStats.totalVistas + selectedPubStats.totalInteracciones) === 0" class="text-center text-[9px] text-gray-600 font-bold uppercase py-4">Sin datos de edad</p>
            </div>

          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirmation Modal -->
    <Transition name="fade">
      <div v-if="modal.show" @click.self="modal.show = false" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-modal-in text-center">
          <div :class="`w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center text-3xl shadow-xl ${['aprobar', 'aprobado'].includes(modal.type) ? 'bg-emerald-500 text-[#070b14]' : 'bg-red-500 text-white'}`">
            <i :class="`fas ${['aprobar', 'aprobado'].includes(modal.type) ? 'fa-check' : 'fa-times'}`"></i>
          </div>
          <h3 class="text-xl font-black text-white mb-2 uppercase tracking-tight">{{ modal.title }}</h3>
          <p class="text-xs text-gray-500 mb-8 font-medium">{{ modalPrompt }}</p>
          
          <div class="flex flex-col gap-3">
            <button @click="processAction" 
              :disabled="isProcessing"
              :class="`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${['aprobar', 'aprobado'].includes(modal.type) ? 'bg-emerald-500 text-[#070b14]' : 'bg-red-500 text-white'}`">
              <i v-if="isProcessing" class="fas fa-circle-notch fa-spin"></i>
              Confirmar Acción
            </button>
            <button @click="modal.show = false" class="w-full py-3 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Cancelar</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Full Image Viewer Modal -->
    <Transition name="fade">
      <div v-if="fullImageUrl" @click="fullImageUrl = null" class="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4">
        <img :src="fullImageUrl" class="max-w-full max-h-full object-contain rounded-xl shadow-2xl">
        <button class="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl active:scale-90 transition-transform">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </Transition>

    <!-- Full Video Viewer Modal -->
    <Transition name="fade">
      <div v-if="fullVideoUrl" @click.self="fullVideoUrl = null" class="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4">
        <video :src="fullVideoUrl" controls autoplay class="max-w-[95vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"></video>
        <button @click="fullVideoUrl = null" class="absolute top-6 right-6 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </Transition>

    <!-- Publicación Detail Modal -->
    <Transition name="fade">
      <div v-if="showPubDetailModal" @click.self="showPubDetailModal = false" class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2rem] w-full max-w-lg shadow-2xl animate-modal-in overflow-hidden flex flex-col max-h-[90vh]">
          
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0f172a] z-10">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <img :src="selectedPubDetail.usuario?.imagen_url || `https://ui-avatars.com/api/?name=${selectedPubDetail.usuario?.nombre}&background=random&color=fff`" class="w-full h-full object-cover">
              </div>
              <div>
                <h3 class="text-sm font-black text-white uppercase tracking-tight">{{ selectedPubDetail.usuario?.nombre }}</h3>
                <span class="text-[9px] font-bold text-violet-400 uppercase tracking-widest">{{ formatDate(selectedPubDetail.fecha) }}</span>
              </div>
            </div>
            <button @click="showPubDetailModal = false" class="w-8 h-8 rounded-full bg-white/5 text-gray-400 flex items-center justify-center hover:text-white transition-colors">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto custom-scrollbar space-y-6">
            <!-- Status Badge -->
            <div class="flex justify-center">
              <span class="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full" :class="getPublicacionStatusClass(selectedPubDetail.estado)">
                {{ getPublicacionStatusLabel(selectedPubDetail) }}
              </span>
            </div>

            <!-- Content -->
            <div class="bg-white/5 border border-white/5 rounded-2xl p-4">
              <p class="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{{ selectedPubDetail.content }}</p>
            </div>

            <!-- Media Section -->
            <div v-if="selectedPubDetail.media && selectedPubDetail.media.length > 0" class="space-y-3">
              <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contenido Multimedia</p>
              <div class="grid grid-cols-2 gap-3">
                <div v-for="(mediaItem, idx) in selectedPubDetail.media" :key="idx" 
                     class="aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10 cursor-pointer group relative"
                     @click.stop="mediaItem.type === 'image' ? viewFullImage(mediaItem.url) : viewFullVideo(mediaItem.url)">
                  <img v-if="mediaItem.type === 'image'" :src="mediaItem.url" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                  <div v-else class="relative w-full h-full bg-black">
                    <video :src="mediaItem.url + '#t=0.1'" class="w-full h-full object-cover pointer-events-none" preload="metadata" muted></video>
                    <div class="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                      <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xl group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6 text-white fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats & Budget -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Budget Info -->
              <div class="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
                <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Presupuesto</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-400">Total:</span>
                  <span class="text-sm font-black text-white">$ {{ Number(selectedPubDetail.presupuesto || 0).toFixed(2) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-400">Restante:</span>
                  <span class="text-sm font-black" :class="getBudgetColor(selectedPubDetail)">$ {{ Number(selectedPubDetail.presupuesto_restante || 0).toFixed(2) }}</span>
                </div>
                <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                  <div class="h-full rounded-full transition-all" :class="getBudgetBarClass(selectedPubDetail)" :style="{ width: getBudgetPercent(selectedPubDetail) + '%' }"></div>
                </div>
              </div>

              <!-- Metrics -->
              <div v-if="selectedPubDetail.estado === 'activa'" class="bg-white/5 border border-white/5 rounded-2xl p-4 grid grid-cols-2 gap-4">
                <div class="text-center p-2 col-span-2 pt-3">
                  <p class="text-[8px] font-black text-gray-600 uppercase tracking-widest">Interacciones Totales</p>
                  <p class="text-lg font-black text-violet-400">{{ selectedPubDetail.total_interacciones || 0 }}</p>
                </div>
                <button @click="verEstadisticas(selectedPubDetail)" class="col-span-2 mt-2 py-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-500/20 transition-all">
                  <i class="fas fa-chart-pie mr-2"></i> Ver Segmentación Detallada
                </button>
              </div>

              <!-- Payment Info (for pending) -->
              <div v-if="selectedPubDetail.estado === 'verificando_pago'" class="bg-violet-500/5 border border-violet-500/10 rounded-2xl p-4 col-span-1 sm:col-span-2">
                <p class="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-3">Información de Pago</p>
                <div class="flex justify-between items-center py-2 border-b border-white/5">
                  <span class="text-xs text-gray-400">N° Comprobante:</span>
                  <span class="text-xs font-black text-white select-all">{{ selectedPubDetail.num_comprobante || '—' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer (Actions) -->
          <div v-if="selectedPubDetail.estado === 'verificando_pago'" class="p-6 border-t border-white/5 bg-white/5 sticky bottom-0 z-10">
            <div class="grid grid-cols-2 gap-4">
              <button @click="showPubDetailModal = false; confirmAction(selectedPubDetail, 'rechazar', 'publicacion')"
                class="py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-500/20 transition-all">
                Rechazar
              </button>
              <button @click="showPubDetailModal = false; confirmAction(selectedPubDetail, 'aprobar', 'publicacion')"
                class="py-4 bg-emerald-500 text-[#070b14] rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20">
                Aprobar / Activar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <BottomNav :badges="{ '/admin/membresias': totalPendingCount }" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import BottomNav from '~/components/footers/BottomNav.vue'

const { $api } = useNuxtApp()

// SEO and Meta
useHead({
  title: 'PubliGana - Gestión de Membresías',
  meta: [
    { name: 'description', content: 'Gestión de membresías de PubliGana.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.9, user-scalable=no' }
  ]
})

// --- ESTADOS ---
const isLoading = ref(true)
const isProcessing = ref(false)
const currentSection = ref('membresias') // 'membresias', 'publicaciones', 'identidad', 'retiros'

// Data
const membresias = ref([])
const solicitudesNivel = ref([])
const identidades = ref([])
const retiros = ref([])
const publicacionesPendientes = ref([])
const estadisticas = ref({ total: 0, pendientes: 0, aprobados: 0 })

// Tabs
const activeMembershipTab = ref('pendiente')
const activeLevelTab = ref('pendiente')
const activeIdentityTab = ref('pendiente')

// Total pending count for BottomNav
const totalPendingCount = computed(() => {
  return Object.values(pendingCounts.value).reduce((a, b) => a + b, 0)
})
const activeWithdrawTab = ref('pendiente')

const mainSections = [
  { id: 'membresias', label: 'Membresías', icon: 'fas fa-id-badge' },
  { id: 'solicitudes_nivel', label: 'Solicitudes Nivel', icon: 'fas fa-layer-group' },
  { id: 'publicaciones', label: 'Publicaciones', icon: 'fas fa-bullhorn' },
  { id: 'identidad', label: 'Identidad', icon: 'fas fa-fingerprint' },
  { id: 'retiros', label: 'Retiros', icon: 'fas fa-hand-holding-usd' }
]

const membershipTabs = [
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'activa', label: 'Aprobadas' },
  { id: 'rechazada', label: 'Rechazadas' }
]

const levelTabs = [
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'aprobada', label: 'Aprobadas' },
  { id: 'rechazada', label: 'Rechazadas' }
]

const identityTabs = [
  { id: 'pendiente', label: 'Por Revisar' },
  { id: 'verificado', label: 'Verificados' }
]

const withdrawTabs = [
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'aprobado', label: 'Completados' },
  { id: 'rechazado', label: 'Rechazados' }
]

// Publicaciones tabs
const activePublicacionTab = ref('pendiente')
const publicacionTabs = [
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'historial', label: 'Historial' }
]

// Pagination for publications
const pubPage = ref(1)
const pubLimit = ref(6)
const pubTotal = ref(0)
const pubPendingCount = ref(0)
const pubTotalPages = computed(() => Math.ceil(pubTotal.value / pubLimit.value) || 1)

// Modal de detalle de publicación
const selectedPubDetail = ref(null)
const showPubDetailModal = ref(false)

// Stats modal state
const showStatsModal = ref(false)
const selectedPubStats = ref(null)
const loadingStats = ref(false)

const openPubDetail = (pub) => {
  selectedPubDetail.value = pub
  showPubDetailModal.value = true
}

const verEstadisticas = async (pub) => {
  selectedPubStats.value = null
  showStatsModal.value = true
  loadingStats.value = true
  try {
    const res = await $api(`/publicaciones/${pub.id_publicacion}/stats`)
    if (res?.success) {
      selectedPubStats.value = res.data
    }
  } catch (e) {
    console.error(e)
    showMsg('Error al cargar estadísticas', 'error')
  } finally {
    loadingStats.value = false
  }
}

// Modal & Toast
const toast = ref({ show: false, message: '', type: 'info' })
const modal = ref({ show: false, title: '', type: '', item: null, category: '' })
const fullImageUrl = ref(null)
const fullVideoUrl = ref(null)

const viewFullImage = (url) => { fullImageUrl.value = url }
const viewFullVideo = (url) => { fullVideoUrl.value = url }

// --- COMPUTED ---
const sectionTitle = computed(() => {
  const map = { membresias: 'Gestión de Membresías', solicitudes_nivel: 'Solicitudes de Nivel de Red', publicaciones: 'Gestión de Publicaciones', identidad: 'Revisión de Identidad', retiros: 'Solicitudes de Retiro' }
  return map[currentSection.value]
})

const modalPrompt = computed(() => {
  if (!modal.value.item) return ''
  const name = modal.value.category === 'identidad' ? modal.value.item.nombre : (modal.value.item.usuario?.nombre || 'Usuario')
  return `¿Seguro que deseas marcar esta solicitud de ${name} como ${modal.value.type}?`
})

const filteredMembresias = computed(() => membresias.value.filter(m => m.estado === activeMembershipTab.value))
const filteredSolicitudesNivel = computed(() => solicitudesNivel.value.filter(s => s.estado === activeLevelTab.value))
const filteredRetiros = computed(() => retiros.value.filter(r => r.estado === activeWithdrawTab.value))

const filteredPublicaciones = computed(() => publicacionesPendientes.value)

const filteredIdentidades = computed(() => {
  if (activeIdentityTab.value === 'pendiente') {
    return identidades.value.filter(u => u.identidad_url && !u.verificado)
  }
  return identidades.value.filter(u => u.verificado)
})

const pendingCounts = computed(() => ({
  membresias: membresias.value.filter(m => m.estado === 'pendiente').length,
  solicitudes_nivel: solicitudesNivel.value.filter(s => s.estado === 'pendiente').length,
  publicaciones: pubPendingCount.value,
  identidad: identidades.value.filter(u => u.identidad_url && !u.verificado).length,
  retiros: retiros.value.filter(r => r.estado === 'pendiente').length
}))

// --- WATCHERS ---
watch(currentSection, () => {
  fetchData()
})

watch(activePublicacionTab, () => {
  pubPage.value = 1
  fetchPublicacionesPendientes()
})

watch(pubPage, () => {
  fetchPublicacionesPendientes()
})

// --- FUNCIONES ---
const showMsg = (message, type = 'info') => {
  toast.value = { show: true, message, type }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    if (currentSection.value === 'membresias') await fetchMembresias()
    else if (currentSection.value === 'solicitudes_nivel') await fetchSolicitudesNivel()
    else if (currentSection.value === 'publicaciones') await fetchPublicacionesPendientes()
    else if (currentSection.value === 'identidad') await fetchIdentidades()
    else if (currentSection.value === 'retiros') await fetchRetiros()
  } catch (e) {
    console.error('Error fetching data:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  const route = useRoute()
  if (route.query.section) {
    currentSection.value = route.query.section
  }
  if (route.query.tab && currentSection.value === 'publicaciones') {
    activePublicacionTab.value = route.query.tab
  }
  
  isLoading.value = true
  try {
    // Cargar todo al inicio para mostrar los contadores de pendientes
    await Promise.all([
      fetchMembresias(),
      fetchSolicitudesNivel(),
      fetchPublicacionesPendientes(),
      fetchPubPendingCount(),
      fetchIdentidades(),
      fetchRetiros()
    ])
  } catch (error) {
    console.error("Error al cargar datos iniciales:", error)
  } finally {
    isLoading.value = false
  }
})

const fetchMembresias = async () => {
  const res = await $api('/membresia')
  if (res && res.success) {
    membresias.value = res.data
    estadisticas.value = res.estadisticas
  }
}

const fetchSolicitudesNivel = async () => {
  const res = await $api('/red-solicitudes')
  if (res.success) {
    solicitudesNivel.value = res.data
  }
}

const fetchPublicacionesPendientes = async () => {
  const params = {
    limit: pubLimit.value,
    offset: (pubPage.value - 1) * pubLimit.value
  }
  
  if (activePublicacionTab.value === 'pendiente') {
    params.estado = 'verificando_pago'
  }
  
  const res = await $api('/publicaciones/admin/pendientes', { params })
  
  if (res.success) {
    publicacionesPendientes.value = res.data
    pubTotal.value = res.total || 0
    if (activePublicacionTab.value === 'pendiente') {
      pubPendingCount.value = res.total || 0
    } else {
      fetchPubPendingCount()
    }
  }
}

const fetchPubPendingCount = async () => {
  try {
    const res = await $api('/publicaciones/admin/pendientes', {
      params: { estado: 'verificando_pago', limit: 1, offset: 0 }
    })
    if (res.success) {
      pubPendingCount.value = res.total || 0
    }
  } catch (e) {
    console.error("Error fetching pub pending count", e)
  }
}

const fetchIdentidades = async () => {
  const res = await $api('/usuarios?tieneIdentidad=true')
  if (res.success) identidades.value = res.data
}

const fetchRetiros = async () => {
  const res = await $api('/retiros')
  if (res.success) retiros.value = res.data
}

const confirmAction = (item, type, category) => {
  modal.value = {
    show: true,
    type,
    item,
    category,
    title: `Confirmar ${type}`
  }
}

const processAction = async () => {
  isProcessing.value = true
  const { item, type, category } = modal.value
  
  try {
    let res
    if (category === 'membresia') {
      if (type === 'aprobar') res = await $api(`/membresia/aprobar/${item.id_membresia}`, { method: 'POST' })
      else res = await $api(`/membresia/rechazar/${item.id_membresia}`, { method: 'POST' })
    } else if (category === 'solicitudes_nivel') {
      res = await $api(`/red-solicitudes/procesar/${item.id_solicitud}`, {
        method: 'POST',
        body: { estado: type === 'aprobar' ? 'aprobada' : 'rechazada' }
      })
    } else if (category === 'publicacion') {
      if (type === 'aprobar') res = await $api(`/publicaciones/admin/aprobar/${item.id_publicacion}`, { method: 'POST' })
      else res = await $api(`/publicaciones/admin/rechazar/${item.id_publicacion}`, { method: 'POST' })
    } else if (category === 'identidad') {
      if (type === 'aprobar') {
        res = await $api(`/usuarios/${item.id_usuario}`, { method: 'PUT', body: { verificado: true } })
      } else {
        res = await $api(`/usuarios/identidad-foto/${item.id_usuario}`, { method: 'DELETE' })
      }
    } else if (category === 'retiro') {
      res = await $api(`/retiros/${item.id_retiro}/estado`, { method: 'PUT', body: { estado: type } })
    }

    if (res.success) {
      showMsg('¡Acción completada!', 'success')
      await fetchData()
      // Refresh publication counts if we processed a publication
      if (category === 'publicacion') {
        fetchPubPendingCount()
      }
    }
  } catch (error) {
    showMsg(error.response?._data?.message || 'Error al procesar', 'error')
  } finally {
    isProcessing.value = false
    modal.value.show = false
  }
}

// Trigger HMR update
const formatDate = (dateString) => {
  const d = new Date(dateString)
  return d.toLocaleDateString('es-HN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const getStatusClass = (status) => {
  const map = {
    activa: 'text-emerald-500 bg-emerald-500/10',
    aprobado: 'text-emerald-500 bg-emerald-500/10',
    pendiente: 'text-amber-500 bg-amber-500/10',
    rechazada: 'text-red-500 bg-red-500/10',
    rechazado: 'text-red-500 bg-red-500/10'
  }
  return map[status] || 'text-gray-500 bg-gray-500/10'
}

// Funciones helper para publicaciones
const getPublicacionStatusLabel = (pub) => {
  const estado = pub.estado
  const map = {
    pendiente_pago: '💳 Pendiente de Pago',
    verificando_pago: '⏳ Verificando Pago',
    activa: '🟢 Activa',
    borrada: pub.fecha_finalizacion ? `⚫ Finalizada (${formatDate(pub.fecha_finalizacion)})` : '⚫ Finalizada',
    rechazada: '🔴 Rechazada',
    reportada: '🚩 Reportada'
  }
  return map[estado] || estado
}

const getPublicacionStatusClass = (estado) => {
  const map = {
    pendiente_pago: 'bg-amber-500/20 text-amber-400',
    verificando_pago: 'bg-blue-500/20 text-blue-400',
    activa: 'bg-emerald-500/20 text-emerald-400',
    borrada: 'bg-gray-500/20 text-gray-400',
    rechazada: 'bg-red-500/20 text-red-400',
    reportada: 'bg-orange-500/20 text-orange-400'
  }
  return map[estado] || 'bg-gray-500/20 text-gray-400'
}

const getBudgetPercent = (pub) => {
  const total = parseFloat(pub.presupuesto || 0)
  const remaining = parseFloat(pub.presupuesto_restante || 0)
  if (total <= 0) return 0
  return Math.max(0, Math.min(100, (remaining / total) * 100))
}

const getBudgetColor = (pub) => {
  const pct = getBudgetPercent(pub)
  if (pct > 60) return 'text-emerald-400'
  if (pct > 25) return 'text-amber-400'
  return 'text-red-400'
}

const getBudgetBarClass = (pub) => {
  const pct = getBudgetPercent(pub)
  if (pct > 60) return 'bg-gradient-to-r from-emerald-500 to-teal-500'
  if (pct > 25) return 'bg-gradient-to-r from-amber-400 to-orange-500'
  return 'bg-gradient-to-r from-red-500 to-red-600'
}
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(20px); }

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-modal-in { animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

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
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>


