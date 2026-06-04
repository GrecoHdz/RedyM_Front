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
                    <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest block">ID Usuario</span>
                    <p class="text-[10px] sm:text-xs font-black text-gray-400">#{{ item.usuario.id_usuario }}</p>
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

      <!-- Section: PUBLICACIONES (Pagos pendientes) -->
      <template v-if="currentSection === 'publicaciones'">
        <div class="mb-6 bg-violet-500/10 border border-violet-500/20 rounded-3xl p-4 flex items-start gap-3">
          <span class="text-2xl">📢</span>
          <div>
            <p class="text-[11px] font-black text-white uppercase tracking-widest mb-1">Verificación de Pagos</p>
            <p class="text-[10px] text-gray-400 leading-relaxed">Revisa los comprobantes de pago de cada publicación. Al aprobar, la publicación se activará y aparecerá en el feed.</p>
          </div>
        </div>

        <div class="space-y-4">
          <div v-if="publicacionesPendientes.length === 0" class="py-20 text-center opacity-40">
            <i class="fas fa-check-circle text-4xl mb-4 text-emerald-500"></i>
            <p class="text-xs font-bold uppercase tracking-widest">No hay publicaciones pendientes de verificación</p>
          </div>

          <TransitionGroup name="list" tag="div" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="pub in publicacionesPendientes" :key="pub.id_publicacion"
              class="bg-white/5 border border-white/10 rounded-[2rem] p-5 backdrop-blur-sm group hover:border-violet-500/30 transition-all flex flex-col justify-between">
              
              <div>
                <!-- User info -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 overflow-hidden cursor-zoom-in" @click="viewFullImage(pub.usuario?.imagen_url || `https://ui-avatars.com/api/?name=${pub.usuario?.nombre}&background=random&color=fff`)">
                      <img :src="pub.usuario?.imagen_url || `https://ui-avatars.com/api/?name=${pub.usuario?.nombre}&background=random&color=fff`" class="w-full h-full object-cover">
                    </div>
                    <div>
                      <h3 class="text-sm font-black text-white uppercase tracking-tight">{{ pub.usuario?.nombre }}</h3>
                      <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-[9px] font-bold text-gray-500">{{ pub.usuario?.telefono }}</span>
                        <div class="w-1 h-1 rounded-full bg-gray-700"></div>
                        <span class="text-[9px] font-bold text-violet-400">{{ formatDate(pub.fecha) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400">En Revisión</div>
                </div>

                <!-- Content preview -->
                <div v-if="pub.content" class="mb-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                  <p class="text-xs text-gray-300 leading-relaxed" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">{{ pub.content }}</p>
                </div>

                <!-- Media preview -->
                <div v-if="pub.media && pub.media.length > 0" class="flex gap-2 mb-4 overflow-x-auto pb-1">
                  <div v-for="(mediaItem, idx) in pub.media" :key="idx" 
                       class="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10"
                       :class="mediaItem.type === 'image' ? 'cursor-zoom-in' : ''"
                       @click="mediaItem.type === 'image' && viewFullImage(mediaItem.url)">
                    <img v-if="mediaItem.type === 'image'" :src="mediaItem.url" class="w-full h-full object-cover">
                    <div v-else class="w-full h-full flex items-center justify-center text-xl">🎥</div>
                  </div>
                </div>

                <!-- Payment details grid -->
                <div class="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-white/5">
                  <div class="space-y-1">
                    <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Presupuesto</span>
                    <p class="text-sm font-black text-white">$ {{ Number(pub.presupuesto || 0).toFixed(2) }}</p>
                  </div>
                  <div class="space-y-1">
                    <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest block">N° Comprobante</span>
                    <p class="text-xs font-black text-violet-400 select-all">{{ pub.num_comprobante || '—' }}</p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                <button @click="confirmAction(pub, 'rechazar', 'publicacion')"
                  class="py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 transition-all flex items-center justify-center gap-2">
                  <i class="fas fa-times"></i> Rechazar
                </button>
                <button @click="confirmAction(pub, 'aprobar', 'publicacion')"
                  class="py-3 px-4 bg-emerald-500 text-[#070b14] rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                  <i class="fas fa-check"></i> Activar
                </button>
              </div>
            </div>
          </TransitionGroup>
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
                    <p class="text-xs sm:text-lg font-black text-white">${{ Number(retiro.monto).toFixed(2) }}</p>
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
        <img :src="fullImageUrl" class="max-w-full max-h-full object-contain rounded-xl">
        <button class="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </Transition>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import BottomNav from '~/components/footers/BottomNav.vue'

const { $api } = useNuxtApp()

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

// Modal & Toast
const toast = ref({ show: false, message: '', type: 'info' })
const modal = ref({ show: false, title: '', type: '', item: null, category: '' })
const fullImageUrl = ref(null)

// --- COMPUTED ---
const sectionTitle = computed(() => {
  const map = { membresias: 'Gestión de Membresías', solicitudes_nivel: 'Solicitudes de Nivel de Red', publicaciones: 'Pagos de Publicaciones', identidad: 'Revisión de Identidad', retiros: 'Solicitudes de Retiro' }
  return map[currentSection.value]
})

const modalPrompt = computed(() => {
  if (!modal.value.item) return ''
  const name = modal.value.category === 'identidad' ? modal.value.item.nombre : modal.value.item.usuario.nombre
  return `¿Seguro que deseas marcar esta solicitud de ${name} como ${modal.value.type}?`
})

const filteredMembresias = computed(() => membresias.value.filter(m => m.estado === activeMembershipTab.value))
const filteredSolicitudesNivel = computed(() => solicitudesNivel.value.filter(s => s.estado === activeLevelTab.value))
const filteredRetiros = computed(() => retiros.value.filter(r => r.estado === activeWithdrawTab.value))
const filteredIdentidades = computed(() => {
  if (activeIdentityTab.value === 'pendiente') {
    return identidades.value.filter(u => u.identidad_url && !u.verificado)
  }
  return identidades.value.filter(u => u.verificado)
})

const pendingCounts = computed(() => ({
  membresias: membresias.value.filter(m => m.estado === 'pendiente').length,
  solicitudes_nivel: solicitudesNivel.value.filter(s => s.estado === 'pendiente').length,
  publicaciones: publicacionesPendientes.value.length,
  identidad: identidades.value.filter(u => u.identidad_url && !u.verificado).length,
  retiros: retiros.value.filter(r => r.estado === 'pendiente').length
}))

// --- WATCHERS ---
watch(currentSection, () => {
  fetchData()
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
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const fetchMembresias = async () => {
  const res = await $api('/membresia')
  if (res.success) {
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
  const res = await $api('/publicaciones/admin/pendientes')
  if (res.success) publicacionesPendientes.value = res.data
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
    }
  } catch (error) {
    showMsg(error.response?._data?.message || 'Error al procesar', 'error')
  } finally {
    isProcessing.value = false
    modal.value.show = false
  }
}

const viewFullImage = (url) => {
  fullImageUrl.value = url
}

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

onMounted(async () => {
  isLoading.value = true
  try {
    // Cargar todo al inicio para mostrar los contadores de pendientes
    await Promise.all([
      fetchMembresias(),
      fetchSolicitudesNivel(),
      fetchPublicacionesPendientes(),
      fetchIdentidades(),
      fetchRetiros()
    ])
  } catch (error) {
    console.error("Error al cargar datos iniciales:", error)
  } finally {
    isLoading.value = false
  }
})
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
</style>


