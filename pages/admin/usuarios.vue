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
    <header class="fixed top-0 inset-x-0 z-40 bg-[#070b14]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <i class="fas fa-users text-white text-xl"></i>
        </div>
        <div>
          <h1 class="text-lg font-black uppercase tracking-tight leading-none">Comunidad</h1>
          <p class="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Gestión de Roles</p>
        </div>
      </div>
      
      <button @click="$router.push('/admin/DashboardAdmin')" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
        <i class="fas fa-chevron-left text-sm"></i>
      </button>
    </header>

    <main class="pt-24 px-4 max-w-2xl mx-auto">
      <!-- Stats Overview -->
      <div class="grid grid-cols-2 gap-3 mb-6">
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
      <div v-if="filteredUsers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TransitionGroup name="list">
          <div 
            v-for="user in filteredUsers" 
            :key="user.id_usuario"
            class="bg-white/5 border border-white/10 rounded-[2.5rem] p-5 backdrop-blur-sm flex items-center justify-between group hover:border-white/20 transition-all"
          >
            <div class="flex items-center gap-4">
              <!-- Avatar -->
              <div class="relative">
                <div class="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/10 bg-gray-900 flex items-center justify-center">
                  <img v-if="user.imagen_url" :src="user.imagen_url" class="w-full h-full object-cover">
                  <span v-else class="text-xl font-black text-gray-700">{{ user.nombre?.[0] }}</span>
                </div>
                <!-- Status indicator -->
                <div 
                  class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#070b14] flex items-center justify-center"
                  :class="user.estado === 'activo' ? 'bg-emerald-500' : 'bg-red-500'"
                ></div>
              </div>

              <!-- Info -->
              <div class="min-w-0">
                <h3 class="text-sm font-black text-white truncate">{{ user.nombre }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">{{ user.identidad }}</span>
                  <span v-if="user.verificado" class="text-[8px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <i class="fas fa-check-circle"></i> Verificado
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <button 
                @click="openDetails(user)"
                class="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
              >
                <i class="fas fa-ellipsis-v text-xs"></i>
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 bg-white/3 border border-dashed border-white/10 rounded-[3rem]">
        <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-user-slash text-3xl text-gray-600"></i>
        </div>
        <h3 class="text-xl font-black text-white mb-2">Sin coincidencias</h3>
        <p class="text-sm text-gray-500 max-w-[250px] mx-auto">No encontramos miembros en esta categoría que coincidan con tu búsqueda.</p>
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
            <button @click="selectedUser = null" class="w-full py-3 text-gray-500 font-bold uppercase tracking-widest text-[9px]">
              Cerrar Panel
            </button>
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
              <span class="text-[10px] font-black text-white">{{ formatDate(selectedUser?.createdAt) }}</span>
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
                  <span class="text-xs font-black text-white truncate max-w-[120px]">{{ selectedUser.nodoRed.padre?.nombre || 'Raíz' }}</span>
                  <button 
                    v-if="selectedUser.nodoRed.id_padre"
                    @click="openNetworkModal({ id: selectedUser.nodoRed.id_padre, name: selectedUser.nodoRed.padre?.nombre, level: selectedUser.nodoRed.nivel_actual - 1 })"
                    class="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                    title="Ver hermanos"
                  ><i class="fas fa-external-link-alt text-[10px]"></i></button>
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
          <div v-if="selectedUser?.membresias?.length > 0" class="space-y-2">
            <div v-for="m in selectedUser.membresias" :key="m.id_membresia" class="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full flex-shrink-0" :class="{
                  'bg-emerald-500': m.estado === 'activa',
                  'bg-amber-500': m.estado === 'pendiente',
                  'bg-red-500': m.estado === 'rechazada',
                  'bg-gray-500': m.estado === 'vencida'
                }"></div>
                <div>
                  <p class="text-[10px] font-black text-white uppercase">{{ m.estado }}</p>
                  <p class="text-[9px] text-gray-500">{{ formatDate(m.fecha) }}</p>
                </div>
              </div>
              <span class="text-[11px] font-black text-gray-300">${{ parseFloat(m.monto).toFixed(2) }}</span>
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
            <div class="w-full flex justify-between items-center mb-6">
              <button v-if="networkModal.history.length > 0" @click="goBackInNetwork" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <i class="fas fa-chevron-left text-xs"></i>
              </button>
              <div v-else class="w-8"></div>
              <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Red de {{ networkModal.currentUser?.name }}</h4>
              <button @click="closeNetworkModal" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
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
const allUsers = ref([])
const activeRole = ref(1) // 1: Usuario, 3: Admin
const stats = ref({ usuarios: 0, admins: 0 })
const toast = ref({ show: false, message: '', type: 'success' })
const selectedUser = ref(null)
const showIdentityLarge = ref(false)
const activeDetailModal = ref(null)

// Scroll lock
watch([selectedUser, activeDetailModal, () => networkModal.value.show, showIdentityLarge], ([u, m, n, i]) => {
  if (u || m || n || i) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Network Visualization State
const networkModal = ref({
  show: false,
  currentUser: null,
  currentChildren: [],
  isLoading: false,
  history: []
})

const filters = ref({
  search: ''
})

const roles = [
  { id: 1, label: 'Usuarios', icon: 'fas fa-user', color: 'blue' },
  { id: 3, label: 'Admins', icon: 'fas fa-shield-alt', color: 'indigo' }
]

// Computed
const filteredUsers = computed(() => {
  return allUsers.value.filter(u => {
    const matchesRole = u.id_rol === activeRole.value
    const matchesSearch = !filters.value.search || 
                        u.nombre.toLowerCase().includes(filters.value.search.toLowerCase()) ||
                        u.identidad.includes(filters.value.search)
    return matchesRole && matchesSearch
  })
})

// Methods
const showMsg = (message, type = 'success') => {
  toast.value = { show: true, message, type }
}

const fetchAll = async () => {
  isLoading.value = true
  try {
    const res = await $api('/usuarios')
    if (res.success) {
      allUsers.value = res.data
      updateStats()
    }
  } catch (e) {
    showMsg('Error al sincronizar usuarios', 'error')
  } finally {
    isLoading.value = false
  }
}

const updateStats = () => {
  stats.value.usuarios = allUsers.value.filter(u => u.id_rol === 1).length
  stats.value.admins = allUsers.value.filter(u => u.id_rol === 3 || u.id_rol === 4).length // Including SA
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
      children: networkModal.value.currentChildren
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
  }
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
  title: 'Usuarios | RedPlus Admin',
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
