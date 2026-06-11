<template>
  <div class="min-h-screen bg-[#070b14] text-gray-100 font-['Outfit'] pb-24">
    <!-- Notifications -->
    <Toast 
      :show="toast.show" 
      :message="toast.message" 
      :type="toast.type" 
      @close="toast.show = false" 
    />
    
    <LoadingSpinner :loading="isLoading" message="Sincronizando comunidad..." />

    <!-- Header Fijo -->
    <header class="fixed top-0 inset-x-0 z-40 bg-[#070b14]/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
          <i class="fas fa-users text-white text-sm"></i>
        </div>
        <div class="min-w-0">
          <h1 class="text-sm font-black uppercase tracking-tight leading-none">Comunidad</h1>
          <p class="hidden sm:block text-[9px] text-blue-500 font-bold uppercase tracking-widest mt-0.5">Gestión de Roles</p>
        </div>
      </div>
      <div class="flex items-center gap-1.5 flex-shrink-0">
        <div class="flex flex-col items-end gap-1">
          <button 
            @click="actualizarRed" 
            class="h-8 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/30 flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/10 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            :disabled="isUpdatingRed"
          >
            <i class="fas" :class="isUpdatingRed ? 'fa-spinner fa-spin' : 'fa-sync-alt'"></i>
            <span class="inline">{{ isUpdatingRed ? 'Actualizando...' : 'Actualizar Red' }}</span>
          </button>
          <!-- Próximo vencimiento -->
          <Transition name="fade">
            <div v-if="proximaFechaVencimiento" class="flex items-center gap-1 text-[7px] font-bold text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded-lg px-1.5 py-0.5">
              <i class="fas fa-calendar-exclamation text-[6px]"></i>
              <span class="hidden sm:inline">Próx. vto: </span><span class="font-black text-amber-300">{{ formatDate(proximaFechaVencimiento) }}</span>
            </div>
          </Transition>
        </div> 
      </div>
    </header>

    <main class="pt-20 px-4 max-w-2xl mx-auto">
      <!-- Stats Overview -->
      <div class="grid grid-cols-2 pt-2 gap-3 mb-2">
        <div class="bg-white/5 border border-white/10 rounded-[2rem] p-5 backdrop-blur-sm relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Usuarios</p>
          <div class="flex items-end gap-2">
            <span class="text-3xl font-black text-white">{{ stats.usuarios }}</span>
            <span class="text-[10px] text-emerald-500 font-bold mb-1.5 flex items-center gap-0.5">
              <i class="fas fa-check-circle"></i> Miembros
            </span>
          </div>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-[2rem] p-5 backdrop-blur-sm relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
          <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Equipo</p>
          <div class="flex items-end gap-2">
            <span class="text-3xl font-black text-white">{{ stats.admins }}</span>
            <span class="text-[10px] text-indigo-400 font-bold mb-1.5 flex items-center gap-0.5">
              <i class="fas fa-shield-alt"></i> Staff
            </span>
          </div>
        </div>
      </div>

      <!-- Search & Tabs -->
      <div class="sticky top-[84px] z-30 bg-[#070b14] pt-2 pb-6 space-y-4">
        <!-- Search bar -->
        <div class="relative group">
          <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors"></i>
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="Buscar por nombre o identidad..."
            class="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-12 pr-6 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
          >
        </div>

        <!-- Role Tabs -->
        <div class="flex bg-white/5 border border-white/5 rounded-2xl p-1.5 p-1">
          <button 
            v-for="role in roles" 
            :key="role.id"
            @click="activeRole = role.id"
            class="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative overflow-hidden"
            :class="activeRole === role.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'"
          >
            <!-- Highlight background -->
            <div 
              v-if="activeRole === role.id" 
              class="absolute inset-0 bg-gradient-to-r transition-all duration-500"
              :class="role.id === 1 ? 'from-blue-600 to-blue-400' : 'from-indigo-600 to-indigo-400'"
            ></div>
            <span class="relative z-10 flex items-center justify-center gap-2">
              <i :class="role.icon"></i>
              {{ role.label }}
            </span>
          </button>
        </div>
      </div>

      <!-- Users List -->
      <div v-if="paginatedUsers.length > 0" class="space-y-6">
        <div class="grid grid-cols-3 gap-2">
          <TransitionGroup name="list">
            <div 
              v-for="user in paginatedUsers" 
              :key="user.id_usuario"
              @click="openDetails(user)"
              class="bg-white/5 border border-white/10 rounded-[2rem] p-3 backdrop-blur-sm flex flex-col items-center text-center group hover:border-white/20 transition-all cursor-pointer active:scale-95"
            >
              <!-- Avatar -->
              <div class="relative mb-3">
                <div class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10 bg-gray-900 flex items-center justify-center">
                  <img v-if="user.imagen_url" :src="user.imagen_url" class="w-full h-full object-cover">
                  <span v-else class="text-lg font-black text-gray-700">{{ user.nombre?.[0] }}</span>
                </div>
                <!-- Status indicator -->
                <div 
                  class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#070b14] flex items-center justify-center"
                  :class="user.estado === 'activo' ? 'bg-emerald-500' : 'bg-red-500'"
                ></div>
              </div>

              <!-- Info -->
              <div class="min-w-0 w-full">
                <h3 class="text-[11px] font-black text-white truncate px-1">{{ user.nombre }}</h3>
                <div class="flex flex-col items-center gap-1 mt-1">
                  <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest">{{ user.identidad }}</span>
                  <span v-if="user.verificado" class="text-[7px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <i class="fas fa-check-circle"></i> V.
                  </span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Controles de Paginación -->
        <div v-if="totalPages > 1" class="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          >
            <i class="fas fa-chevron-left text-xs"></i>
          </button>
          
          <div class="flex flex-col items-center">
            <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Página</span>
            <span class="text-xs font-black text-white mt-0.5">{{ currentPage }} <span class="text-gray-600">/</span> {{ totalPages }}</span>
          </div>

          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          >
            <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isSearching" class="text-center py-20 bg-white/3 border border-dashed border-white/10 rounded-[3rem]">
        <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-user-slash text-3xl text-gray-600"></i>
        </div>
        <h3 class="text-xl font-black text-white mb-2">Sin coincidencias</h3>
        <p class="text-sm text-gray-500 max-w-[250px] mx-auto">No encontramos miembros en esta categoría que coincidan con tu búsqueda.</p>
      </div>

      <!-- Loading State (Búsqueda local, sin bloquear la UI) -->
      <div v-else class="text-center py-16 bg-white/3 border border-white/5 rounded-[3rem] backdrop-blur-sm flex flex-col items-center justify-center">
        <div class="relative w-10 h-10 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full border-4 border-blue-500/10"></div>
          <div class="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
        </div>
        <h4 class="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-4">Buscando...</h4>
      </div>
    </main>

    <!-- Navigation -->
    <BottomNav />

    <!-- User Details Sheet (Modal) -->
    <Transition name="bottom-sheet">
      <div v-if="selectedUser" class="fixed inset-0 z-[100] flex flex-col justify-end">
        <div class="absolute inset-0 bg-[#070b14]/90 backdrop-blur-sm" @click="selectedUser = null"></div>
        <div class="relative w-full bg-[#0d121f] rounded-t-[3rem] p-6 border-t border-white/10 max-h-[90vh] overflow-y-auto">
          <div class="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6"></div>
          
          <!-- Avatar + Name -->
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 flex-shrink-0 shadow-xl">
              <img v-if="selectedUser.imagen_url" :src="selectedUser.imagen_url" class="w-full h-full object-cover">
              <div v-else class="w-full h-full bg-blue-600 flex items-center justify-center text-2xl font-black text-white">
                {{ selectedUser.nombre?.[0] }}
              </div>
            </div>
            <div class="min-w-0">
              <h2 class="text-xl font-black text-white truncate">{{ selectedUser.nombre }}</h2>
              <p class="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">{{ selectedUser.rol?.nombre_rol }}</p>
              <div class="flex items-center gap-1.5 mt-1">
                <span class="w-2 h-2 rounded-full" :class="selectedUser.estado === 'activo' ? 'bg-emerald-400' : 'bg-red-400'"></span>
                <span class="text-[9px] font-bold uppercase tracking-wider" :class="selectedUser.estado === 'activo' ? 'text-emerald-400' : 'text-red-400'">{{ selectedUser.estado }}</span>
                <span v-if="selectedUser.verificado" class="ml-2 text-[8px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">✓ Verificado</span>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-3 gap-2 mb-6">
            <div class="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 text-center">
              <p class="text-[7px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Créditos</p>
              <p class="text-sm font-black text-white">${{ parseFloat(selectedUser.credito?.monto_credito || 0).toFixed(0) }}</p>
            </div>
            <div class="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-center">
              <p class="text-[7px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">Membresías</p>
              <p class="text-sm font-black text-white">{{ selectedUser.stats?.membresiasPagadas || 0 }}</p>
            </div>
            <div class="bg-purple-500/10 p-3 rounded-2xl border border-purple-500/20 text-center">
              <p class="text-[7px] font-black text-purple-400 uppercase tracking-widest mb-0.5">Posts</p>
              <p class="text-sm font-black text-white">{{ selectedUser.stats?.totalPublicaciones || 0 }}</p>
            </div>
          </div>

          <!-- Section Buttons Grid -->
          <div class="grid grid-cols-4 gap-2 mb-6">
            <button @click="activeDetailModal = 'personal'" class="flex flex-col items-center gap-1.5 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
              <div class="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center group-hover:bg-blue-500/25 transition-colors">
                <i class="fas fa-user text-blue-400 text-sm"></i>
              </div>
              <span class="text-[8px] font-black text-gray-400 uppercase tracking-tight">Personal</span>
            </button>
            <button @click="activeDetailModal = 'red'" class="flex flex-col items-center gap-1.5 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group">
              <div class="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center group-hover:bg-amber-500/25 transition-colors">
                <i class="fas fa-sitemap text-amber-400 text-sm"></i>
              </div>
              <span class="text-[8px] font-black text-gray-400 uppercase tracking-tight">Red</span>
            </button>
            <button @click="activeDetailModal = 'finanzas'" class="flex flex-col items-center gap-1.5 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
                <i class="fas fa-dollar-sign text-emerald-400 text-sm"></i>
              </div>
              <span class="text-[8px] font-black text-gray-400 uppercase tracking-tight">Finanzas</span>
            </button>
            <button @click="activeDetailModal = 'publicaciones'" class="flex flex-col items-center gap-1.5 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
              <div class="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center group-hover:bg-purple-500/25 transition-colors">
                <i class="fas fa-photo-video text-purple-400 text-sm"></i>
              </div>
              <span class="text-[8px] font-black text-gray-400 uppercase tracking-tight">Posts</span>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2">
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="toggleVerification(selectedUser)"
                class="py-3 rounded-2xl font-black uppercase tracking-wider text-[9px] flex items-center justify-center gap-2 transition-all"
                :class="selectedUser.verificado ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500 text-black'"
              >
                <i :class="selectedUser.verificado ? 'fas fa-undo' : 'fas fa-check-shield'"></i>
                {{ selectedUser.verificado ? 'Quitar V.' : 'Verificar' }}
              </button>
              <button 
                @click="toggleStatus(selectedUser)"
                class="py-3 rounded-2xl font-black uppercase tracking-wider text-[9px] flex items-center justify-center gap-2 transition-all border"
                :class="selectedUser.estado === 'activo' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'"
              >
                <i :class="selectedUser.estado === 'activo' ? 'fas fa-user-slash' : 'fas fa-user-check'"></i>
                {{ selectedUser.estado === 'activo' ? 'Suspender' : 'Reactivar' }}
              </button>
            </div>
            <!-- Cambiar Contraseña + Eliminar -->
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="openChangePasswordModal"
                class="py-3 rounded-2xl font-black uppercase tracking-wider text-[9px] flex items-center justify-center gap-2 transition-all bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 active:scale-95"
              >
                <i class="fas fa-key"></i>
                Cambiar Clave
              </button>
              <button 
                @click="openDeleteModal"
                class="py-3 rounded-2xl font-black uppercase tracking-wider text-[9px] flex items-center justify-center gap-2 transition-all bg-red-500/5 text-red-500 border border-red-500/20 hover:bg-red-500/15 active:scale-95"
              >
                <i class="fas fa-trash-alt"></i>
                Eliminar
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </Transition>

    <!-- ====================================== -->
    <!-- SUB-MODAL: Información Personal        -->
    <!-- ====================================== -->
    <Transition name="fade">
      <div v-if="activeDetailModal === 'personal'" class="fixed inset-0 z-[200] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="activeDetailModal = null"></div>
        <div class="relative w-full max-w-lg bg-[#0d121f] rounded-t-[2.5rem] p-6 border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center"><i class="fas fa-user text-blue-400 text-xs"></i></div>
              <h3 class="text-sm font-black text-white uppercase tracking-widest">Info Personal</h3>
            </div>
            <button @click="activeDetailModal = null" class="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-white"><i class="fas fa-times text-xs"></i></button>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
              <span class="text-[10px] font-bold text-gray-500 uppercase">Nombre Completo</span>
              <span class="text-[11px] font-black text-white">{{ selectedUser?.nombre }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
              <span class="text-[10px] font-bold text-gray-500 uppercase">Email</span>
              <span class="text-[10px] font-black text-white truncate max-w-[180px]">{{ selectedUser?.email }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
              <span class="text-[10px] font-bold text-gray-500 uppercase">Teléfono</span>
              <span class="text-[11px] font-black text-white">{{ selectedUser?.telefono || 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
              <span class="text-[10px] font-bold text-gray-500 uppercase">Identidad</span>
              <span class="text-[11px] font-black text-white">{{ selectedUser?.identidad || 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
              <span class="text-[10px] font-bold text-gray-500 uppercase">Ciudad</span>
              <span class="text-[11px] font-black text-white">{{ selectedUser?.ciudad?.nombre_ciudad || 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
              <span class="text-[10px] font-bold text-gray-500 uppercase">Rol</span>
              <span class="text-[11px] font-black text-blue-400">{{ selectedUser?.rol?.nombre_rol }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
              <span class="text-[10px] font-bold text-gray-500 uppercase">Registro</span>
              <span class="text-[10px] font-black text-white">{{ formatDate(selectedUser?.fecha_registro) }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
              <span class="text-[10px] font-bold text-gray-500 uppercase">Estado</span>
              <span class="text-[10px] font-black uppercase" :class="selectedUser?.estado === 'activo' ? 'text-emerald-400' : 'text-red-400'">{{ selectedUser?.estado }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
              <span class="text-[10px] font-bold text-gray-500 uppercase">Verificado</span>
              <span class="text-[10px] font-black" :class="selectedUser?.verificado ? 'text-blue-400' : 'text-gray-600'">{{ selectedUser?.verificado ? '✓ Sí' : '✗ No' }}</span>
            </div>

            <!-- Identity Document -->
            <div v-if="selectedUser?.identidad_url" class="mt-4">
              <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Documento de Identidad</p>
              <div class="relative group rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video">
                <img :src="selectedUser.identidad_url" class="w-full h-full object-contain">
                <button @click="showIdentityLarge = true" class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <i class="fas fa-search-plus text-white text-2xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ====================================== -->
    <!-- SUB-MODAL: Red                         -->
    <!-- ====================================== -->
    <Transition name="fade">
      <div v-if="activeDetailModal === 'red'" class="fixed inset-0 z-[200] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="activeDetailModal = null"></div>
        <div class="relative w-full max-w-lg bg-[#0d121f] rounded-t-[2.5rem] p-6 border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center"><i class="fas fa-sitemap text-amber-400 text-xs"></i></div>
              <h3 class="text-sm font-black text-white uppercase tracking-widest">Información de Red</h3>
            </div>
            <button @click="activeDetailModal = null" class="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-white"><i class="fas fa-times text-xs"></i></button>
          </div>

          <div v-if="selectedUser?.nodoRed" class="space-y-4">
            <!-- Basic network info -->
            <div class="space-y-2">
              <div class="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                <span class="text-[10px] font-bold text-gray-500 uppercase">Nivel Actual</span>
                <span class="text-xs font-black text-white bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/20">Nivel {{ selectedUser.nodoRed.nivel_actual }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                <span class="text-[10px] font-bold text-gray-500 uppercase">Patrocinador</span>
                <span class="text-xs font-black text-white italic">{{ selectedUser.nodoRed.patrocinador?.nombre || 'Directo' }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                <span class="text-[10px] font-bold text-gray-500 uppercase">Padre en Red</span>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-black text-white truncate max-w-[120px]">{{ selectedUser.nodoRed.nivel_actual === 0 ? 'Sin posicionar' : (selectedUser.nodoRed.padre?.nombre || 'Raíz') }}</span>
                </div>
              </div>
            </div>

            <!-- Matrix Levels -->
            <div>
              <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 px-1">Progreso de Matriz</p>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="level in [
                  { id: 1, people: 3, color: 'blue' },
                  { id: 2, people: 9, color: 'indigo' },
                  { id: 3, people: 27, color: 'purple' },
                  { id: 4, people: 81, color: 'teal' },
                  { id: 5, people: 243, color: 'emerald' }
                ]" :key="level.id" class="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col gap-2">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                      <div :class="`w-6 h-6 rounded-lg bg-${level.color}-500/20 flex items-center justify-center text-${level.color}-500 text-[10px] font-black`">{{ level.id }}</div>
                      <span class="text-[9px] font-black text-gray-300 uppercase">Nv. {{ level.id }}</span>
                    </div>
                    <span class="text-[8px] font-black text-gray-500">{{ selectedUser.stats?.matrixConteos?.[level.id] || 0 }}/{{ level.people }}</span>
                  </div>
                  <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000" :class="`bg-${level.color}-500`"
                      :style="`width: ${Math.min(100, ((selectedUser.stats?.matrixConteos?.[level.id] || 0) / level.people) * 100)}%`"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Explore button -->
            <button 
              @click="openNetworkModal({ ...selectedUser, name: selectedUser.nombre, id: selectedUser.id_usuario, level: selectedUser.nodoRed.nivel_actual })"
              class="w-full py-4 bg-amber-500 text-black rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <i class="fas fa-sitemap"></i>
              Explorar Visualización de Red
            </button>
          </div>
          <div v-else class="text-center py-10">
            <p class="text-[10px] font-black text-gray-600 uppercase">Usuario no registrado en la red</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ====================================== -->
    <!-- SUB-MODAL: Finanzas                    -->
    <!-- ====================================== -->
    <Transition name="fade">
      <div v-if="activeDetailModal === 'finanzas'" class="fixed inset-0 z-[200] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="activeDetailModal = null"></div>
        <div class="relative w-full max-w-lg bg-[#0d121f] rounded-t-[2.5rem] p-6 border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center"><i class="fas fa-dollar-sign text-emerald-400 text-xs"></i></div>
              <h3 class="text-sm font-black text-white uppercase tracking-widest">Finanzas</h3>
            </div>
            <button @click="activeDetailModal = null" class="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-white"><i class="fas fa-times text-xs"></i></button>
          </div>

          <!-- Balance card -->
          <div class="bg-gradient-to-br from-emerald-900/40 to-teal-900/20 border border-emerald-500/20 rounded-3xl p-5 mb-5 flex items-center justify-between">
            <div>
              <p class="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Saldo Actual</p>
              <p class="text-3xl font-black text-white">${{ parseFloat(selectedUser?.credito?.monto_credito || 0).toFixed(2) }}</p>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
              <i class="fas fa-wallet text-emerald-400 text-xl"></i>
            </div>
          </div>

          <!-- Membership history -->
          <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 px-1">Historial de Membresías (últimas {{ selectedUser?.membresias?.length || 0 }})</p>
          <div v-if="selectedUser?.membresias?.length > 0" class="grid grid-cols-2 gap-2">
            <div v-for="m in selectedUser.membresias" :key="m.id_membresia" class="flex items-center justify-between p-2.5 bg-white/5 rounded-2xl border border-white/5">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="{
                  'bg-emerald-500': m.estado === 'activa',
                  'bg-amber-500': m.estado === 'pendiente',
                  'bg-red-500': m.estado === 'rechazada',
                  'bg-gray-500': m.estado === 'vencida'
                }"></div>
                <div class="min-w-0">
                  <p class="text-[9px] font-black text-white uppercase truncate">{{ m.estado }}</p>
                  <p class="text-[8px] text-gray-500 truncate">{{ formatDate(m.fecha) }}</p>
                </div>
              </div>
              <span class="text-[10px] font-black text-gray-300 flex-shrink-0">${{ parseFloat(m.monto).toFixed(0) }}</span>
            </div>
          </div>
          <div v-else class="text-center py-8 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <p class="text-[10px] font-bold text-gray-600">Sin historial de pagos</p>
          </div>

          <!-- Breakdown by type (from Stats) -->
          <div class="mt-8">
            <div class="flex items-center justify-between mb-3 px-1">
              <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Resumen de Actividad</p>
              <span class="text-[8px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{{ selectedUser?.stats?.totalInteracciones || 0 }} total</span>
            </div>
            <div v-if="selectedUser?.stats?.interaccionStats && Object.keys(selectedUser.stats.interaccionStats).length > 0" class="grid grid-cols-4 gap-2">
              <div v-for="(val, type) in selectedUser.stats.interaccionStats" :key="type" class="bg-white/5 p-2 rounded-xl border border-white/5 text-center">
                <p class="text-xs font-black text-white">{{ val }}</p>
                <p class="text-[6px] text-gray-500 uppercase font-black truncate">{{ formatType(type) }}</p>
              </div>
            </div>
          </div>

          <!-- Interaction History (Like InteractionHistoryModal) -->
          <div class="mt-8">
            <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 px-1">Historial de Ganancias</p>
            <div v-if="selectedUser?.stats?.historialInteracciones?.length > 0" class="grid grid-cols-2 gap-2">
              <div v-for="item in selectedUser.stats.historialInteracciones" :key="item.id_interaccion" class="bg-white/5 border border-white/5 p-2 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all group min-w-0">
                <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                  <img v-if="item.publicacion?.media?.[0]?.url" :src="item.publicacion.media[0].url" class="w-full h-full object-cover">
                  <div v-else class="text-[10px]">{{ getInteractionIcon(item.tipo) }}</div>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-[8px] font-black text-white truncate uppercase">{{ getInteractionLabel(item.tipo) }}</h4>
                  <p class="text-[7px] text-emerald-400 font-black">+{{ item.monto_ganado }}</p>
                  <p class="text-[6px] text-gray-500 font-medium truncate">{{ formatDate(item.fecha) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-6 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
              <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">No hay ganancias registradas</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ====================================== -->
    <!-- SUB-MODAL: Publicaciones               -->
    <!-- ====================================== -->
    <Transition name="fade">
      <div v-if="activeDetailModal === 'publicaciones'" class="fixed inset-0 z-[200] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="activeDetailModal = null"></div>
        <div class="relative w-full max-w-lg bg-[#0d121f] rounded-t-[2.5rem] p-6 border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center"><i class="fas fa-photo-video text-purple-400 text-xs"></i></div>
              <h3 class="text-sm font-black text-white uppercase tracking-widest">Publicaciones</h3>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[8px] font-black text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">{{ selectedUser?.stats?.totalPublicaciones || 0 }} totales</span>
              <button @click="activeDetailModal = null" class="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-white"><i class="fas fa-times text-xs"></i></button>
            </div>
          </div>

          <div v-if="selectedUser?.publicaciones?.length > 0" class="space-y-2">
            <div v-for="p in selectedUser.publicaciones" :key="p.id_publicacion" class="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
              <div class="w-14 h-14 rounded-xl bg-gray-900 border border-white/10 overflow-hidden flex-shrink-0">
                <img v-if="p.media && p.media.length > 0 && p.media[0].type?.startsWith('image')" :src="p.media[0].url" class="w-full h-full object-cover" @error="$event.target.style.display='none'">
                <div v-else-if="p.media && p.media.length > 0" class="w-full h-full flex items-center justify-center"><i class="fas fa-play-circle text-gray-500 text-xl"></i></div>
                <div v-else class="w-full h-full flex items-center justify-center"><i class="fas fa-image text-gray-700 text-xl"></i></div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[10px] font-black text-white truncate">{{ p.content || '(Sin contenido)' }}</p>
                <p class="text-[9px] text-gray-500 mt-0.5">{{ formatDate(p.fecha) }}</p>
                <div class="flex items-center gap-3 mt-1">
                  <span class="text-[8px] text-gray-500"><i class="fas fa-eye mr-1"></i>{{ p.vistas || 0 }}</span>
                  <span class="text-[8px] text-gray-500"><i class="fas fa-heart mr-1"></i>{{ p.likes || 0 }}</span>
                  <span class="text-[8px] text-gray-500"><i class="fas fa-mouse-pointer mr-1"></i>{{ p.total_interacciones || 0 }}</span>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-[10px] font-black text-emerald-500">${{ parseFloat(p.presupuesto || 0).toFixed(0) }}</p>
                <span class="text-[8px] font-black uppercase" :class="{
                  'text-emerald-400': p.estado === 'activa',
                  'text-amber-400': p.estado === 'verificando_pago' || p.estado === 'pendiente_pago',
                  'text-red-400': p.estado === 'rechazada' || p.estado === 'borrada',
                  'text-gray-500': !p.estado
                }">{{ p.estado?.replace(/_/g, ' ') }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <p class="text-[10px] font-bold text-gray-600">Sin publicaciones registradas</p>
          </div>
        </div>
      </div>
    </Transition>


    <!-- ====================================== -->
    <!-- SUB-MODAL: Eliminar Usuario            -->
    <!-- ====================================== -->
    <Transition name="fade">
      <div v-if="activeDetailModal === 'deleteUser'" class="fixed inset-0 z-[200] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="activeDetailModal = null"></div>
        <div class="relative w-full max-w-lg bg-[#0d121f] rounded-t-[2.5rem] p-6 border-t border-red-500/20">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
                <i class="fas fa-trash-alt text-red-400 text-xs"></i>
              </div>
              <h3 class="text-sm font-black text-white uppercase tracking-widest">Eliminar Usuario</h3>
            </div>
            <button @click="activeDetailModal = null" class="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-white">
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>

          <!-- Warning Card -->
          <div class="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-5 flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i class="fas fa-exclamation-triangle text-red-400 text-xs"></i>
            </div>
            <div>
              <p class="text-[11px] font-black text-red-300 mb-1">Esta acción es irreversible</p>
              <p class="text-[10px] text-red-400/70 leading-relaxed">Se eliminará permanentemente el usuario y toda su información asociada. Esta acción <span class="font-black text-red-300">no se puede deshacer</span>.</p>
            </div>
          </div>

          <!-- User Preview -->
          <div class="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl mb-5">
            <div class="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-gray-900 flex-shrink-0">
              <img v-if="selectedUser?.imagen_url" :src="selectedUser.imagen_url" class="w-full h-full object-cover">
              <div v-else class="w-full h-full bg-red-900/40 flex items-center justify-center text-sm font-black text-red-300">{{ selectedUser?.nombre?.[0] }}</div>
            </div>
            <div class="min-w-0">
              <p class="text-[11px] font-black text-white truncate">{{ selectedUser?.nombre }}</p>
              <p class="text-[9px] text-gray-500 truncate">{{ selectedUser?.email }}</p>
            </div>
            <span class="ml-auto text-[8px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg uppercase flex-shrink-0">Eliminar</span>
          </div>

          <!-- Confirm input -->
          <div class="mb-4">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block px-1">
              Escribe <span class="text-red-400">ELIMINAR</span> para confirmar
            </label>
            <input
              v-model="deleteModal.confirmText"
              type="text"
              placeholder="ELIMINAR"
              class="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm font-black text-white tracking-widest focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
              :class="{ 'border-red-500/50': deleteModal.confirmText && deleteModal.confirmText !== 'ELIMINAR' }"
            >
          </div>

          <!-- Actions -->
          <div class="grid grid-cols-2 gap-2">
            <button 
              @click="activeDetailModal = null"
              class="py-3.5 rounded-2xl font-black uppercase tracking-wider text-[9px] bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
            >
              <i class="fas fa-arrow-left mr-1"></i> Cancelar
            </button>
            <button 
              @click="deleteUser"
              :disabled="deleteModal.confirmText !== 'ELIMINAR' || deleteModal.isLoading"
              class="py-3.5 rounded-2xl font-black uppercase tracking-wider text-[9px] bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              <i :class="deleteModal.isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-trash-alt'"></i>
              {{ deleteModal.isLoading ? 'Eliminando...' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ====================================== -->
    <!-- SUB-MODAL: Cambiar Contraseña          -->
    <!-- ====================================== -->
    <Transition name="fade">
      <div v-if="activeDetailModal === 'changePassword'" class="fixed inset-0 z-[200] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeChangePasswordModal"></div>
        <div class="relative w-full max-w-lg bg-[#0d121f] rounded-t-[2.5rem] p-6 border-t border-white/10">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <i class="fas fa-key text-violet-400 text-xs"></i>
              </div>
              <div>
                <h3 class="text-sm font-black text-white uppercase tracking-widest">Cambiar Contraseña</h3>
                <p class="text-[9px] text-gray-500 font-bold mt-0.5 truncate max-w-[200px]">{{ selectedUser?.nombre }}</p>
              </div>
            </div>
            <button @click="closeChangePasswordModal" class="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-white">
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>

          <!-- Form -->
          <div class="space-y-3">
            <!-- Nueva contraseña -->
            <div class="relative group">
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block px-1">Nueva Contraseña</label>
              <div class="relative">
                <i class="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-violet-400 transition-colors text-xs"></i>
                <input 
                  v-model="passwordForm.newPassword"
                  :type="passwordForm.showNew ? 'text' : 'password'"
                  placeholder="Escribe la nueva contraseña"
                  class="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-12 text-sm font-medium text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                  :class="{ 'border-red-500/50': passwordForm.error }"
                >
                <button @click="passwordForm.showNew = !passwordForm.showNew" type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  <i :class="passwordForm.showNew ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Confirmar contraseña -->
            <div class="relative group">
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block px-1">Confirmar Contraseña</label>
              <div class="relative">
                <i class="fas fa-lock-open absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-violet-400 transition-colors text-xs"></i>
                <input 
                  v-model="passwordForm.confirmPassword"
                  :type="passwordForm.showConfirm ? 'text' : 'password'"
                  placeholder="Repite la contraseña"
                  class="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-12 text-sm font-medium text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                  :class="{ 'border-red-500/50': passwordForm.error }"
                >
                <button @click="passwordForm.showConfirm = !passwordForm.showConfirm" type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  <i :class="passwordForm.showConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Match indicator -->
            <div v-if="passwordForm.newPassword && passwordForm.confirmPassword" class="flex items-center gap-2 px-1">
              <div class="w-2 h-2 rounded-full flex-shrink-0" :class="passwordForm.newPassword === passwordForm.confirmPassword ? 'bg-emerald-500' : 'bg-red-500'"></div>
              <span class="text-[9px] font-bold" :class="passwordForm.newPassword === passwordForm.confirmPassword ? 'text-emerald-400' : 'text-red-400'">
                {{ passwordForm.newPassword === passwordForm.confirmPassword ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden' }}
              </span>
            </div>

            <!-- Error message -->
            <div v-if="passwordForm.error" class="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <i class="fas fa-exclamation-circle text-red-400 text-xs flex-shrink-0"></i>
              <p class="text-[10px] text-red-400 font-bold">{{ passwordForm.error }}</p>
            </div>

            <!-- Submit -->
            <button 
              @click="changePassword"
              :disabled="passwordForm.isLoading || !passwordForm.newPassword || !passwordForm.confirmPassword"
              class="w-full py-4 mt-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-violet-500/20 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              <i :class="passwordForm.isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-save'"></i>
              {{ passwordForm.isLoading ? 'Guardando...' : 'Guardar Contraseña' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>


    <!-- Large Identity Viewer Overlay -->
    <Transition name="fade">
      <div v-if="showIdentityLarge" class="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4" @click="showIdentityLarge = false">
        <img :src="selectedUser?.identidad_url" class="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl">
        <button class="absolute top-8 right-8 text-white text-2xl">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </Transition>

    <!-- Network Modal (Recursive Browsing) -->
    <Transition name="fade">
      <div v-if="networkModal.show" class="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeNetworkModal"></div>
        
        <div class="relative w-full max-w-sm bg-[#0d121f] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
          <div class="p-6 flex flex-col items-center">
            <!-- Modal Header -->
            <div class="w-full flex justify-between items-center mb-6 gap-2">
              <div class="flex items-center gap-2 flex-shrink-0">
                <button v-if="networkModal.history.length > 0" @click="goBackInNetwork" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <i class="fas fa-chevron-left text-xs"></i>
                </button>
                <button v-if="networkModal.currentIdPadre" @click="goUpInNetwork" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400 hover:text-blue-300 transition-colors" title="Subir de nivel">
                  <i class="fas fa-arrow-up text-xs"></i>
                </button>
              </div>
              <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center px-2 flex-1 truncate">Red de {{ networkModal.currentUser?.name }}</h4>
              <button @click="closeNetworkModal" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors flex-shrink-0">
                <i class="fas fa-times text-xs"></i>
              </button>
            </div>

            <!-- Parent Info -->
            <div class="flex flex-col items-center mb-8">
              <div class="w-20 h-20 rounded-3xl border-4 border-blue-600 p-0.5 mb-3 overflow-hidden shadow-xl bg-gray-900">
                <img :src="networkModal.currentUser?.imagen_url || `https://ui-avatars.com/api/?name=${networkModal.currentUser?.name}&background=1d4ed8&color=fff`" class="w-full h-full object-cover" />
              </div>
              <span class="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Nivel {{ networkModal.currentUser?.level }}</span>
              <div class="w-0.5 h-6 bg-gradient-to-b from-blue-600 to-transparent mt-2"></div>
            </div>

            <!-- Children Grid -->
            <div v-if="networkModal.isLoading" class="flex justify-center py-12">
              <i class="fas fa-circle-notch fa-spin text-2xl text-blue-500"></i>
            </div>
            <div v-else-if="networkModal.currentChildren.length > 0" class="grid grid-cols-3 gap-4 w-full px-2 mb-8">
              <div v-for="hijo in networkModal.currentChildren" :key="hijo.id_usuario" 
                   @click="openNetworkModal({ ...hijo, name: hijo.nombre, id: hijo.id_usuario, level: (networkModal.currentUser?.level || 0) + 1 }, true)"
                   class="flex flex-col items-center cursor-pointer active:scale-95 transition-transform group">
                <div class="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden mb-2 shadow-sm ring-4 ring-transparent group-hover:ring-blue-500/20 transition-all">
                  <img :src="hijo.imagen_url || `https://ui-avatars.com/api/?name=${hijo.nombre}&background=334155&color=fff`" class="w-full h-full object-cover" />
                </div>
                <span class="text-[9px] font-bold text-gray-400 truncate w-full text-center">{{ hijo.nombre }}</span>
              </div>
              
              <!-- Empty slots if less than 3 (optional, for matrix feel) -->
              <div v-for="i in Math.max(0, 3 - networkModal.currentChildren.length)" :key="'empty'+i" class="flex flex-col items-center opacity-20">
                <div class="w-14 h-14 rounded-2xl border border-dashed border-white/20 flex items-center justify-center">
                  <i class="fas fa-plus text-[10px] text-white"></i>
                </div>
                <span class="text-[8px] font-black text-gray-600 uppercase mt-2">Libre</span>
              </div>
            </div>
            <div v-else class="py-8 text-center bg-white/3 w-full rounded-3xl border border-dashed border-white/10 mb-8">
              <p class="text-[9px] text-gray-500 font-black uppercase tracking-widest">Sin asociados directos en matriz</p>
            </div>

            <p class="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] text-center max-w-[200px]">
              Explora los niveles inferiores tocando los avatares de los socios
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/middleware/auth.store'
import BottomNav from '~/components/footers/BottomNav.vue'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const { $api } = useNuxtApp()
const auth = useAuthStore()

// State
const isLoading = ref(true)
 const isSearching = ref(false)
const allUsers = ref([])
const activeRole = ref(1) // 1: Usuario, 2: Admin
const stats = ref({ usuarios: 0, admins: 0 })
const toast = ref({ show: false, message: '', type: 'success' })
const selectedUser = ref(null)
const showIdentityLarge = ref(false)
const activeDetailModal = ref(null)
const isUpdatingRed = ref(false)

// Password change state
const passwordForm = ref({
  newPassword: '',
  confirmPassword: '',
  showNew: false,
  showConfirm: false,
  isLoading: false,
  error: ''
})

const openChangePasswordModal = () => {
  passwordForm.value = { newPassword: '', confirmPassword: '', showNew: false, showConfirm: false, isLoading: false, error: '' }
  activeDetailModal.value = 'changePassword'
}

const closeChangePasswordModal = () => {
  activeDetailModal.value = null
}

// Delete user state
const deleteModal = ref({
  confirmText: '',
  isLoading: false
})

const openDeleteModal = () => {
  deleteModal.value = { confirmText: '', isLoading: false }
  activeDetailModal.value = 'deleteUser'
}

const deleteUser = async () => {
  if (deleteModal.value.confirmText !== 'ELIMINAR') return
  deleteModal.value.isLoading = true
  try {
    const res = await $api(`/usuarios/${selectedUser.value.id_usuario}`, {
      method: 'DELETE'
    })
    if (res.success) {
      showMsg(`Usuario ${selectedUser.value.nombre} eliminado correctamente`)
      activeDetailModal.value = null
      selectedUser.value = null
      clearCache()
      await fetchPaginatedData(true)
    } else {
      showMsg(res.error || 'Error al eliminar el usuario', 'error')
      activeDetailModal.value = null
    }
  } catch (e) {
    showMsg('Error de conexión al intentar eliminar', 'error')
    activeDetailModal.value = null
  } finally {
    deleteModal.value.isLoading = false
  }
}

const changePassword = async () => {
  const { newPassword, confirmPassword } = passwordForm.value
  if (newPassword !== confirmPassword) {
    passwordForm.value.error = 'Las contraseñas no coinciden.'
    return
  }
  passwordForm.value.error = ''
  passwordForm.value.isLoading = true
  try {
    const res = await $api(`/usuarios/${selectedUser.value.id_usuario}`, {
      method: 'PUT',
      body: { password: newPassword }
    })
    if (res.success) {
      showMsg('Contraseña actualizada correctamente ✅')
      closeChangePasswordModal()
    } else {
      passwordForm.value.error = res.error || 'Error al cambiar la contraseña.'
    }
  } catch (e) {
    passwordForm.value.error = 'Error de conexión. Intenta de nuevo.'
  } finally {
    passwordForm.value.isLoading = false
  }
}
const proximaFechaVencimiento = ref(null)

// Network Visualization State
const networkModal = ref({
  show: false,
  currentUser: null,
  currentChildren: [],
  isLoading: false,
  history: [],
  currentIdPadre: null,
  currentParent: null
})

// Scroll lock
watch([selectedUser, activeDetailModal, () => networkModal.value.show, showIdentityLarge], ([u, m, n, i]) => {
  if (u || m || n || i) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const filters = ref({
  search: ''
})

const roles = [
  { id: 1, label: 'Usuarios', icon: 'fas fa-user', color: 'blue' },
  { id: 2, label: 'Admins', icon: 'fas fa-shield-alt', color: 'indigo' }
]



// Pagination & Cache State
const currentPage = ref(1)
const PAGE_SIZE = 9

// Estructura de caché: "rol_búsqueda_página" -> Array de usuarios
const cache = ref({})
// Total de items en la búsqueda/filtro actual (retornado por count de la API)
const totalItems = ref(0)

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / PAGE_SIZE) || 1
})

// Clave única basada en los filtros activos
const cacheKey = computed(() => {
  const cleanSearch = (filters.value.search || '').trim().toLowerCase()
  return `${activeRole.value}_${cleanSearch}_${currentPage.value}`
})

const paginatedUsers = computed(() => {
  return cache.value[cacheKey.value] || []
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchPaginatedData()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchPaginatedData()
  }
}

// Limpiar todo el caché cuando se actualice o sane la red
const clearCache = () => {
  cache.value = {}
}

let searchTimeout = null

// Cambios de rol ocurren al instante
watch(activeRole, () => {
  currentPage.value = 1
  fetchPaginatedData()
})

// Cambios en la búsqueda esperan 1 segundo antes de disparar la consulta
watch(() => filters.value.search, () => {
  isSearching.value = true // Mostrar el spinner local sin bloquear la UI
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchPaginatedData()
  }, 1000)
})

// Methods
const showMsg = (message, type = 'success') => {
  toast.value = { show: true, message, type }
}

const actualizarRed = async () => {
  if (isUpdatingRed.value) return
  isUpdatingRed.value = true
  try {
    const res = await $api('/red/rebuild', {
      method: 'POST'
    })
    if (res.success) {
      if (res.proximaFechaVencimiento) {
        proximaFechaVencimiento.value = res.proximaFechaVencimiento
        const fecha = formatDate(res.proximaFechaVencimiento)
        showMsg(`Red sanada ✅ — Próximo vencimiento: ${fecha}`)
      } else {
        showMsg('Red actualizada y sanada correctamente ✅')
      }
      clearCache()
      await fetchPaginatedData(true) // Forzar recarga de contadores globales e iniciales
    } else {
      showMsg(res.error || 'Error al actualizar la red', 'error')
    }
  } catch (e) {
    showMsg('Error de conexión al actualizar la red', 'error')
  } finally {
    isUpdatingRed.value = false
  }
}

const fetchPaginatedData = async (forceUpdateStats = false) => {
  const key = cacheKey.value
  
  // Si ya tenemos esta página y filtro en caché, no llamamos a la API
  if (cache.value[key]) {
    isSearching.value = false
    // Si se requiere forzar el update de contadores generales (ej. después de rebuild), no retornamos inmediatamente
    if (!forceUpdateStats) return
  }

  isLoading.value = true
  try {
    const offset = (currentPage.value - 1) * PAGE_SIZE
    const cleanSearch = (filters.value.search || '').trim()
    
    const query = {
      rol: activeRole.value,
      limit: PAGE_SIZE,
      offset: offset
    }
    
    if (cleanSearch) {
      query.search = cleanSearch
    }

    const res = await $api('/usuarios', { params: query })
    if (res.success) {
      cache.value[key] = res.data
      totalItems.value = res.count
      
      // Actualizar estadísticas globales (Admins y Miembros totales)
      if (forceUpdateStats || stats.value.usuarios === 0) {
        await updateStatsFromServer()
      }
    }
  } catch (e) {
    showMsg('Error al sincronizar usuarios', 'error')
  } finally {
    isLoading.value = false
    isSearching.value = false
  }
}

const updateStatsFromServer = async () => {
  try {
    // Hacemos dos counts rápidos y ligeros o cargamos un resumen
    const [resUsers, resAdmins] = await Promise.all([
      $api('/usuarios', { params: { rol: 1, limit: 1 } }),
      $api('/usuarios', { params: { rol: 2, limit: 1 } })
    ])
    if (resUsers.success) stats.value.usuarios = resUsers.count
    if (resAdmins.success) stats.value.admins = resAdmins.count
  } catch (e) {
    console.error("Error updating stats:", e)
  }
}

// Reemplazo de fetchAll original por la carga paginada inicial
const fetchAll = async () => {
  clearCache()
  await Promise.all([
    fetchPaginatedData(true),
    fetchProximoVencimiento()
  ])
}

const fetchProximoVencimiento = async () => {
  try {
    const res = await $api('/red/proximo-vencimiento')
    if (res.success && res.proximaFechaVencimiento) {
      proximaFechaVencimiento.value = res.proximaFechaVencimiento
    }
  } catch (e) {
    console.error("Error al cargar próximo vencimiento:", e)
  }
}

const updateStats = () => {
  stats.value.usuarios = allUsers.value.filter(u => u.id_rol === 1).length
  stats.value.admins = allUsers.value.filter(u => u.id_rol === 2 || u.id_rol === 4).length // Including SA
}

const openDetails = async (user) => {
  isLoading.value = true
  try {
    const res = await $api(`/usuarios/${user.id_usuario}`)
    if (res.success) {
      selectedUser.value = res.data
    }
  } catch (e) {
    showMsg('Error al obtener detalles del usuario', 'error')
  } finally {
    isLoading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-HN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const toggleVerification = async (user) => {
  const newStatus = !user.verificado
  try {
    const res = await $api(`/usuarios/${user.id_usuario}`, {
      method: 'PUT',
      body: { verificado: newStatus }
    })
    if (res.success) {
      user.verificado = newStatus
      showMsg(newStatus ? 'Usuario verificado ✅' : 'Verificación removida')
    }
  } catch (e) {
    showMsg('Error al actualizar estado', 'error')
  }
}

const toggleStatus = async (user) => {
  const newStatus = user.estado === 'activo' ? 'deshabilitado' : 'activo'
  try {
    const res = await $api(`/usuarios/${user.id_usuario}`, {
      method: 'PUT',
      body: { estado: newStatus }
    })
    if (res.success) {
      user.estado = newStatus
      showMsg(`Usuario ${newStatus === 'activo' ? 'activado' : 'suspendido'}`)
    }
  } catch (e) {
    showMsg('Error al actualizar estado', 'error')
  }
}

const formatType = (type) => {
  const map = {
    'like': 'Me gusta',
    'poll': 'Encuesta',
    'share': 'Compartir',
    'video_view': 'Video',
    'click': 'Clic',
    'visita_web': 'Web',
    'visita_whatsapp': 'WhatsApp'
  }
  return map[type] || type
}

const getInteractionLabel = (type) => {
  const labels = {
    like: 'Me gusta publicitario',
    poll: 'Respuesta a encuesta',
    share: 'Contenido compartido',
    video_view: 'Video publicitario visto',
    click: 'Clic en anuncio',
    visita_web: 'Visita a sitio web',
    visita_whatsapp: 'Contacto por WhatsApp'
  }
  return labels[type] || 'Interacción'
}

const getInteractionIcon = (type) => {
  const icons = {
    like: '❤️',
    poll: '📊',
    share: '🔗',
    video_view: '🎥',
    click: '🖱️',
    visita_web: '🌐',
    visita_whatsapp: '💬'
  }
  return icons[type] || '✨'
}

// Network Logic
const openNetworkModal = async (user, isRecursive = false) => {
  if (isRecursive && user.level > 5) return 
  
  if (isRecursive && networkModal.value.currentUser) {
    networkModal.value.history.push({
      user: networkModal.value.currentUser,
      children: networkModal.value.currentChildren,
      id_padre: networkModal.value.currentIdPadre,
      parent: networkModal.value.currentParent
    })
  } else if (!isRecursive) {
    networkModal.value.history = []
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
      networkModal.value.currentIdPadre = response.data.id_padre
      networkModal.value.currentParent = response.data.padre
    }
  } catch (error) {
    console.error("Error al cargar red:", error)
  } finally {
    networkModal.value.isLoading = false
  }
}

const goBackInNetwork = () => {
  if (networkModal.value.history.length > 0) {
    const prev = networkModal.value.history.pop()
    networkModal.value.currentUser = prev.user
    networkModal.value.currentChildren = prev.children
    networkModal.value.currentIdPadre = prev.id_padre
    networkModal.value.currentParent = prev.parent
  }
}

const goUpInNetwork = async () => {
  if (!networkModal.value.currentIdPadre) return
  
  const parentObj = networkModal.value.currentParent || { 
    id: networkModal.value.currentIdPadre, 
    id_usuario: networkModal.value.currentIdPadre,
    nombre: '...Cargando' 
  }
  
  await openNetworkModal({
    ...parentObj,
    name: parentObj.nombre,
    id: parentObj.id_usuario,
    level: Math.max(1, (networkModal.value.currentUser?.level || 1) - 1)
  }, true)
}

const closeNetworkModal = () => {
  networkModal.value.show = false
  networkModal.value.currentUser = null
  networkModal.value.currentChildren = []
  networkModal.value.history = []
}

onMounted(() => {
  fetchAll()
})

useHead({
  title: 'Usuarios | PubliGana Admin',
  meta: [{ name: 'description', content: 'Gestión de miembros y administradores.' }]
})
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from { opacity: 0; transform: translateY(15px) scale(0.95); }
.list-leave-to { opacity: 0; transform: scale(0.95); }

.bottom-sheet-enter-active { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.bottom-sheet-leave-active { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse; }

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
