<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Toast Notification -->
    <Toast 
      v-if="toast.show"
      :key="toast.message + Date.now()"
      :message="toast.message" 
      :type="toast.type"
      :duration="toast.duration"
      @close="toast.show = false"
    />
    
    <!-- Loading Spinner -->
    <LoadingSpinner 
      :loading="isLoading" 
      :message="'Cargando usuarios...'"
    />

    <!-- Contenido principal -->
    <div v-if="!isLoading">
      <HeadersHeaderUsuariosAdmin />

      <!-- Content Container -->
      <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
        <div class="pb-24">
          <!-- Main Content -->
          <main class="pb-4">

            <!-- Page Header -->
            <section class="px-3 sm:px-6 py-3 sm:py-6">
              <div class="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-3 sm:p-6 text-white relative overflow-hidden">
                <!-- Background decoration -->
                <div class="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl"></div>
                <div class="absolute -bottom-6 -left-6 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-lg"></div>
                
                <div class="relative">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center">
                        <span class="text-lg sm:text-2xl">👥</span>
                      </div>
                      <div>
                        <h1 class="text-base sm:text-2xl font-black">Gestión de Usuarios</h1>
                        <p class="text-white/90 font-medium text-xs sm:text-sm">{{ stats.totalUsuarios }} usuarios registrados</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Quick Stats -->
                  <div class="grid grid-cols-3 gap-2">
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 text-center">
                      <div v-if="loadingStats" class="h-5 flex items-center justify-center">
                        <div class="w-3 h-3 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div v-else class="text-[12px] sm:text-base font-black">{{ stats.totalUsuarios }}</div>
                      <div class="text-[11px] text-white/80">Usuarios Totales</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 text-center">
                      <div v-if="loadingStats" class="h-5 flex items-center justify-center">
                        <div class="w-3 h-3 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div v-else class="text-[12px] sm:text-base font-black">{{ stats.totalReferidos }}</div>
                      <div class="text-[11px] text-white/80">Referidos</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 text-center">
                      <div v-if="loadingStats" class="h-5 flex items-center justify-center">
                        <div class="w-3 h-3 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div v-else class="text-[11px] sm:text-base font-black">L. {{ formatCurrency(stats.totalCreditos) }}</div>
                      <div class="text-[11px] text-white/80">Créditos</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- SECCIÓN: Centro de Verificación Rápida -->
            <section class="px-3 sm:px-6 mb-3 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-3">
                <!-- Header con título -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-2">
                    <div class="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg">
                      <span class="text-blue-600 dark:text-blue-400 text-sm">🆔</span>
                    </div>
                    <h2 class="text-sm font-black text-gray-900 dark:text-white">Centro de Verificación Rápida</h2>
                  </div>
                </div>

                <!-- Resumen de Contadores -->
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 mb-3 border border-gray-100 dark:border-gray-600/50">
                  <div class="flex justify-center text-center">
                    <div>
                      <div class="text-sm font-black text-gray-900 dark:text-white">{{ pendingVerificationUsers.length }}</div>
                      <div class="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-medium">Usuarios Pendientes</div>
                    </div>
                  </div>
                </div>

                <!-- Botón de acción -->
                <button 
                  v-if="pendingVerificationUsers.length > 0"
                  @click="openNextPendingVerification"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold text-xs shadow-sm transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  <span>🚀 Comenzar Verificación Rápida</span>
                  <span class="bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px]">{{ pendingVerificationUsers.length }}</span>
                </button>
                <div v-else class="text-center py-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-200 dark:border-gray-600">
                  <p class="text-xs text-gray-500 dark:text-gray-400">No hay usuarios pendientes de verificar identidad.</p>
                </div>
              </div>
            </section>

            <!-- Filters and Search -->
            <section class="px-3 sm:px-6 mb-3 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex flex-col space-y-2">
                  <!-- Search -->
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-3 w-3 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                      </div>
                      <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Buscar por nombre..."
                        class="w-full pl-8 pr-8 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                        :disabled="isSearching"
                      >
                      <div v-if="isSearching" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Status and City Filters -->
                  <div class="flex space-x-2">
                    <div class="flex-1">
                      <multiselect
                        v-model="selectedService"
                        :options="availableServices"
                        :searchable="false"
                        :close-on-select="true"
                        :show-labels="false"
                        placeholder="Servicio"
                        label="nombre"
                        track-by="id_servicio"
                        class="multiselect-custom"
                        :class="{ 'multiselect--active': selectedService }"
                        :select-label="''"
                        :deselect-label="''"
                        :selected-label="''"
                        :no-options="'No hay servicios'"
                        :no-result="'No se encontraron resultados'"
                        @search-change="$event && $event.stopPropagation()"
                        @search-focus="(e) => e && e.target && e.target.blur()"
                        @touchstart.native.stop
                        @click.native.stop
                        ref="serviceSelect"
                        :options-limit="100"
                      >
                        <template #singleLabel="{ option }">
                          <span class="text-[12px] truncate">{{ option.nombre }}</span>
                        </template>
                        <template #option="{ option }">
                          <span class="text-[12px]">{{ option.nombre }}</span>
                        </template>
                      </multiselect>
                    </div>
                    
                    <div class="flex-1">
                      <multiselect
                        v-model="selectedCity"
                        :options="availableCities.map(city => ({ id: city.id_ciudad, value: city.nombre_ciudad, label: city.nombre_ciudad }))"
                        :searchable="false"
                        :close-on-select="true"
                        :show-labels="false"
                        placeholder="Ciudad"
                        label="label"
                        track-by="id"
                        class="multiselect-custom"
                        :class="{ 'multiselect--active': selectedCity }"
                        :select-label="''"
                        :deselect-label="''"
                        :selected-label="''"
                        :no-options="'No hay ciudades'"
                        :no-result="'No se encontraron resultados'"
                        @search-change="$event && $event.stopPropagation()"
                        @search-focus="(e) => e && e.target && e.target.blur()"
                        @touchstart.native.stop
                        @click.native.stop
                        ref="citySelect"
                        :options-limit="100"
                      >
                        <template #singleLabel="{ option }">
                          <span class="text-[12px] truncate">{{ option.value || 'Ciudad' }}</span>
                        </template>
                        <template #option="{ option }">
                          <span class="text-[12px]">{{ option.value || 'Ciudad' }}</span>
                        </template>
                      </multiselect>
                    </div>
                  </div>
                </div>
                
                <!-- Clear Filters -->
                <div v-if="hasActiveFilters" class="mt-2">
                  <button 
                    @click="clearFilters"
                    class="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline"
                  >
                    🗑️ Limpiar filtros
                  </button>
                </div>
              </div>
            </section>

            <!-- Usuarios Section -->
            <section class="px-3 sm:px-6 mb-3 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between mb-3">
                  <h2 class="text-sm sm:text-xl font-black text-gray-900 dark:text-white flex items-center">
                    👤 Usuarios ({{ totalUsers }})
                  </h2>
                  <div class="flex space-x-1">
                    <button 
                      @click="showTopCredits"
                      class="text-[11px] xs:text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md font-bold hover:bg-green-200 dark:hover:bg-green-900/50 whitespace-nowrap"
                    >
                      💰Top Créditos
                    </button>
                    <button 
                      @click="showTopReferrals"
                      class="text-[11px] xs:text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 whitespace-nowrap"
                    >
                      👥Top Referidos
                    </button>
                  </div>
                </div>

                <!-- Loading State for Users -->
                <div v-if="loadingUsers" class="text-center py-8">
                  <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p class="text-gray-600 dark:text-gray-400 text-xs">Cargando usuarios...</p>
                </div>

                <!-- Empty State -->
                <div v-else-if="users.length === 0" class="text-center py-6">
                  <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span class="text-lg">👤</span>
                  </div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">No se encontraron usuarios</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-xs">
                    {{ searchQuery ? 'Intenta ajustar tus filtros de búsqueda' : 'No hay usuarios registrados' }}
                  </p>
                </div>

                <!-- Users List -->
                <div v-else>
                  <div class="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <div 
                      v-for="user in users" 
                      :key="user.id_usuario"
                      @click="editUser(user)"
                      class="group rounded-lg p-2 transition-all duration-200 cursor-pointer border"
                      :class="{
                        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50': user.estado === 'deshabilitado' || user.estado === 'inactivo',
                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md': user.estado === 'activo'
                      }"
                    >
                      <!-- User Header -->
                      <div class="flex items-start justify-between w-full">
                        <div class="flex items-center space-x-2">
                          <div class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700">
                            <img 
                              v-if="user.imagen_url" 
                              :src="user.imagen_url" 
                              class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              :alt="user.nombre"
                              @click.stop="showImagePreview(user.imagen_url)"
                            />
                            <div v-else class="w-full h-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                                 :class="user.estado === 'deshabilitado' || user.estado === 'inactivo' ? 'bg-red-500' : 'bg-green-500'">
                              {{ getUserInitial(user.nombre) }}
                            </div>
                          </div>
                          <div class="min-w-0">
                            <h3 class="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white truncate max-w-[90px] sm:max-w-[120px] mb-0.5">
                              {{ truncateName(user.nombre) }}
                            </h3>
                            <div class="flex">
                              <span class="text-[7px] px-1.5 py-0.5 rounded-full font-medium"
                                    :class="user.estado === 'deshabilitado' || user.estado === 'inactivo'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'">
                                {{ getStatusText(user.estado) }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-1">
                          <button 
                            @click.stop="showServiceHistory(user)"
                            class="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            :class="{
                              'text-red-400 hover:text-red-500': user.estado === 'deshabilitado' || user.estado === 'inactivo',
                              'text-gray-400 hover:text-blue-500': user.estado === 'activo'
                            }"
                            title="Historial"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h9.586a1 1 0 00.707-.293l2.414-2.414A1 1 0 0018 16.586V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                          </button>
                          <button 
                            @click.stop="editUser(user)"
                            class="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            :class="{
                              'text-red-400 hover:text-red-500': user.estado === 'deshabilitado' || user.estado === 'inactivo',
                              'text-gray-400 hover:text-blue-500': user.estado === 'activo'
                            }"
                            title="Editar"
                          >
                            <svg class="w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button> 
                          <button 
                            @click.stop="confirmDeleteUser(user)"
                            class="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Eliminar"
                          >
                            <svg class="w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Stats -->
                      <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div class="grid grid-cols-2 gap-2">
                          <!-- Referidos -->
                          <div 
                            @click.stop="user.total_referidos >= 0 ? showReferrals(user) : null"
                            :class="{
                              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30': user.total_referidos > 0,
                              'bg-red-50 dark:bg-red-900/20': user.estado === 'deshabilitado' || user.estado === 'inactivo',
                              'bg-gray-50 dark:bg-gray-700/50': user.estado === 'activo'
                            }"
                            class="rounded-lg p-1 text-center transition-colors"
                          >
                            <div class="text-[9px] text-gray-500 dark:text-gray-400">Ver Referidos</div>
                            <div class="flex items-center justify-center space-x-1">
                              <span 
                                class="text-xs font-medium"
                                :class="user.estado === 'deshabilitado' || user.estado === 'inactivo' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'"
                              >
                                {{ user.total_referidos || 0 }}
                              </span>
                            </div>
                          </div>
                          
                          <!-- Créditos -->
                          <div 
                            @click.stop="(user.credito?.monto || 0) > 0 ? showCredits(user) : null"
                            :class="{
                              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30': (user.credito?.monto || 0) > 0,
                              'bg-red-50 dark:bg-red-900/20': user.estado === 'deshabilitado' || user.estado === 'inactivo',
                              'bg-gray-50 dark:bg-gray-700/50': user.estado === 'activo'
                            }"
                            class="rounded-lg p-1 text-center transition-colors"
                          >
                            <div class="text-[9px] text-gray-500 dark:text-gray-400">Ver Créditos</div>
                            <div class="flex items-center justify-center space-x-1">
                              <span class="text-xs font-medium"
                                    :class="user.estado === 'deshabilitado' || user.estado === 'inactivo' ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                                L {{ formatCompactCurrency(user.credito?.monto || 0) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Paginación Usuarios -->
                  <div v-if="totalUsers > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        Página {{ usersCurrentPage }} de {{ usersTotalPages }}
                      </div>
                      <div class="flex items-center space-x-1">
                        <button 
                          @click="loadUsers(usersCurrentPage - 1)" 
                          :disabled="usersCurrentPage === 1 || loadingMoreUsers"
                          class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                          :class="{ 'cursor-not-allowed': usersCurrentPage === 1 }"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                          {{ usersCurrentPage }} / {{ usersTotalPages }}
                        </span>
                        <button 
                          @click="loadUsers(usersCurrentPage + 1)" 
                          :disabled="!hasMoreUsers || loadingMoreUsers"
                          class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                          :class="{ 'cursor-not-allowed': !hasMoreUsers }"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Técnicos Section -->
            <section class="px-3 sm:px-6 mb-3 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between mb-3">
                  <h2 class="text-sm sm:text-xl font-black text-gray-900 dark:text-white flex items-center">
                    🔧 Técnicos ({{ totalTechnicians }})
                  </h2>
                  <div class="flex space-x-1">
                    <button 
                      @click="showTopTechniciansCredits"
                      class="text-[11px] xs:text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md font-bold hover:bg-yellow-200 dark:hover:bg-yellow-900/50 whitespace-nowrap"
                    >
                      💰Top Saldos
                    </button>
                    <button 
                      @click="showTopRatings"
                      class="text-[11px] xs:text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 whitespace-nowrap"
                    >
                      ⭐ Calificaciones
                    </button>
                    <button 
                      @click="deactivateTechnicians"
                      :disabled="deactivatingTechnicians"
                      class="text-[11px] xs:text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md font-bold hover:bg-red-200 dark:hover:bg-red-900/50 whitespace-nowrap flex items-center space-x-1"
                    >
                      <span v-if="deactivatingTechnicians" class="w-3 h-3 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></span>
                      <span>{{ deactivatingTechnicians ? 'Procesando...' : '📴' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Loading State -->
                <div v-if="loadingTechnicians" class="text-center py-8">
                  <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p class="text-gray-600 dark:text-gray-400 text-xs">Cargando técnicos...</p>
                </div>

                <!-- Technicians Grid -->
                <div v-else>
                  <div v-if="technicians.length > 0" class="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <div 
                      v-for="technician in technicians" 
                      :key="technician.id_usuario"
                      @click="editUser(technician)"
                      class="group rounded-lg p-2 transition-all duration-200 cursor-pointer border"
                      :class="{
                        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50': technician.estado === 'inactivo' || technician.estado === 'deshabilitado',
                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md': technician.estado === 'activo',
                        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50': !technician.estado
                      }"
                    >
                      <!-- Header -->
                      <div class="flex items-start justify-between">
                        <div class="flex items-center space-x-2">
                          <div class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <img 
                              v-if="technician.imagen_url" 
                              :src="technician.imagen_url" 
                              :alt="'Foto de ' + (technician.nombre || 'técnico')"
                              class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              @click.stop="showImagePreview(technician.imagen_url)"
                              onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\'w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500\'><span class=\'text-xs\'>' + (this.alt.split(' ').map(n => n[0]).join('').toUpperCase() || 'T') + '</span></div>';"
                            />
                            <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">
                              <span class="text-xs">{{ (technician.nombre || 'T')[0].toUpperCase() }}</span>
                            </div>
                          </div>
                          <div class="min-w-0">
                            <h3 class="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white truncate max-w-[80px] sm:max-w-[120px]" :title="technician.nombre">
                  {{ technician.nombre?.length > 12 ? technician.nombre.substring(0, 12) + '...' : (technician.nombre || 'Técnico sin nombre') }}
                </h3>
                            <div class="flex items-center space-x-1">
                              <span 
                                class="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                                :class="getStatusColor(technician.estado || 'activo')"
                              >
                                {{ getStatusText(technician.estado || 'activo') }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-1">
                          <button 
                            @click.stop="showOfferedServices(technician)"
                            class="p-1 text-gray-400 hover:text-green-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            :class="{
                              'text-red-400 hover:text-red-500': technician.estado === 'inactivo',
                              'text-gray-400 hover:text-green-500': technician.estado === 'activo' || !technician.estado
                            }"
                            title="Servicios"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button 
                            @click.stop="editUser(technician)"
                            class="p-1 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            :class="{
                              'text-red-400 hover:text-red-500': technician.estado === 'inactivo',
                              'text-gray-400 hover:text-blue-500': technician.estado === 'activo' || !technician.estado
                            }"
                            title="Editar"
                          >
                            <svg class="w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button> 
                          <button 
                            @click.stop="confirmDeleteUser(technician)"
                            class="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Eliminar"
                          >
                            <svg class="w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Stats -->
                      <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div class="grid grid-cols-2 gap-2">
                          <!-- Saldo -->
                          <div 
                            @click.stop="showCredits(technician)"
                            :class="{
                              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30': true,
                              'bg-red-50 dark:bg-red-900/20': technician.estado === 'inactivo',
                              'bg-gray-50 dark:bg-gray-700/50': technician.estado === 'activo' || !technician.estado
                            }"
                            class="rounded-lg p-1 text-center transition-colors"
                          >
                            <div class="text-[10px] text-gray-500 dark:text-gray-400">Ver Saldo</div>
                            <div class="flex items-center justify-center space-x-1">
                              <span class="text-xs font-medium"
                                    :class="technician.estado === 'inactivo' ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                                L. {{ formatCurrency(technician.saldo_total || 0) }}
                              </span>
                            </div>
                          </div>
                          
                          <!-- Calificaciones -->
                          <div 
                            @click.stop="showTechnicianServices(technician)"
                            :class="{
                              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30': true,
                              'bg-red-50 dark:bg-red-900/20': technician.estado === 'inactivo',
                              'bg-gray-50 dark:bg-gray-700/50': technician.estado === 'activo' || !technician.estado
                            }"
                            class="rounded-lg p-1 text-center transition-colors"
                          >
                            <div class="text-[9px] text-gray-500 dark:text-gray-400">Ver Servicios</div>
                            <div class="flex items-center justify-center space-x-1">
                              <span class="text-xs font-medium"
                                    :class="technician.estado === 'inactivo' ? 'text-red-500 dark:text-red-400' : 'text-yellow-500 dark:text-yellow-400'">
                                ⭐ {{ (technician.promedio_calificacion || 0).toFixed(1) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                
                  <!-- Paginación Técnicos -->
                  <div v-if="totalTechnicians > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        Página {{ techniciansCurrentPage }} de {{ techniciansTotalPages }}
                      </div>
                      <div class="flex items-center space-x-1">
                        <button 
                          @click="changeTechniciansPage(techniciansCurrentPage - 1)" 
                          :disabled="techniciansCurrentPage === 1 || loadingTechnicians"
                          class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                          :class="{ 'cursor-not-allowed': techniciansCurrentPage === 1 }"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                          {{ techniciansCurrentPage }} / {{ techniciansTotalPages }}
                        </span>
                        <button 
                          @click="changeTechniciansPage(techniciansCurrentPage + 1)" 
                          :disabled="techniciansCurrentPage >= techniciansTotalPages || loadingTechnicians"
                          class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                          :class="{ 'cursor-not-allowed': techniciansCurrentPage >= techniciansTotalPages }"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div v-else class="text-center py-6">
                    <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span class="text-lg">🔧</span>
                    </div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">No se encontraron técnicos</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-xs">
                      {{ searchQuery ? 'Intenta ajustar tus filtros de búsqueda' : 'No hay técnicos registrados' }}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Administradores Section -->
            <section class="px-3 sm:px-6 mb-3 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between mb-3">
                  <h2 class="text-sm sm:text-xl font-black text-gray-900 dark:text-white flex items-center">
                    👑 Administradores ({{ totalAdmins }})
                  </h2>
                </div>

                <!-- Loading State -->
                <div v-if="loadingUsers && administrators.length === 0" class="text-center py-8">
                  <div class="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Cargando administradores...</p>
                </div>

                <!-- Empty State -->
                <div v-else-if="administrators.length === 0" class="text-center py-8">
                  <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                    <span class="text-2xl">👥</span>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">No hay administradores</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No se encontraron administradores registrados.</p>
                </div>

                <!-- Administrators List -->
                <div v-else>
                  <div v-if="administrators.length > 0" class="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <div 
                      v-for="admin in administrators" 
                      :key="admin.id_usuario"
                      @click="editUser(admin)"
                      class="group rounded-lg p-2 transition-all duration-200 cursor-pointer border"
                      :class="{
                        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50': admin.estado === 'inactivo' || admin.estado === 'deshabilitado',
                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md': admin.estado === 'activo',
                        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50': !admin.estado
                      }"
                    >
                      <!-- Header -->
                      <div class="flex items-start justify-between">
                        <div class="flex items-center space-x-2">
                          <div class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs shadow-sm"
                               :class="admin.estado === 'inactivo' || admin.estado === 'deshabilitado' ? 'bg-red-500' : 'bg-blue-500'">
                            <span>👑</span>
                          </div>
                          <div class="min-w-0">
                            <h3 class="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[100px] sm:max-w-[120px]">
                              {{ admin.nombre || 'Administrador' }}
                            </h3>
                            <div class="flex items-center space-x-1">
                              <span 
                                class="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                                :class="getStatusColor(admin.estado || 'activo')"
                              >
                                {{ getStatusText(admin.estado || 'activo') }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-1">
                          <button 
                            @click.stop="editUser(admin)"
                            class="p-1 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            :class="{
                              'text-red-400 hover:text-red-500': admin.estado === 'inactivo',
                              'text-gray-400 hover:text-blue-500': admin.estado === 'activo' || !admin.estado
                            }"
                            title="Editar"
                          >
                            <svg class="w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button> 
                          <button 
                            @click.stop="confirmDeleteUser(admin)"
                            class="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Eliminar"
                          >
                            <svg class="w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Admin Info -->
                      <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div class="space-y-1"> 
                          
                          <!-- Phone -->
                          <div class="flex items-center text-xs text-gray-600 dark:text-gray-300">
                            <svg class="w-3 h-3 mr-1.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{{ admin.telefono || 'Sin teléfono' }}</span>
                          </div>
                          
                          <!-- City -->
                          <div v-if="admin.ciudad?.nombre_ciudad" class="flex items-center text-xs text-gray-600 dark:text-gray-300">
                            <svg class="w-3 h-3 mr-1.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{{ admin.ciudad.nombre_ciudad }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Paginación -->
                <div v-if="totalAdmins > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Página {{ adminsCurrentPage }} de {{ Math.ceil(totalAdmins / adminsItemsPerPage) }}
                    </div>
                    <div class="flex items-center space-x-1">
                      <button 
                        @click="changeAdminsPage(adminsCurrentPage - 1)" 
                        :disabled="adminsCurrentPage === 1 || loadingUsers"
                        class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        :class="{ 'cursor-not-allowed': adminsCurrentPage === 1 }"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                        {{ adminsCurrentPage }} / {{ Math.ceil(totalAdmins / adminsItemsPerPage) }}
                      </span>
                      <button 
                        @click="changeAdminsPage(adminsCurrentPage + 1)" 
                        :disabled="adminsCurrentPage * adminsItemsPerPage >= totalAdmins || loadingUsers"
                        class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        :class="{ 'cursor-not-allowed': adminsCurrentPage * adminsItemsPerPage >= totalAdmins }"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>  
              </div>
            </section>

          </main>
        </div>
      </div>

      <FootersFooterAdmin />
    </div>

    <!-- Edit User Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">Editar Usuario</h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Form Content -->
          <div class="p-3">
            <form @submit.prevent="saveUser" class="space-y-3">
              <!-- Información del Usuario (solo lectura) -->
              <div class="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg space-y-3">
                <div class="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-600 pb-2 mb-3">
                  <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/20 flex-shrink-0">
                    <img 
                      v-if="userForm.imagen_url" 
                      :src="userForm.imagen_url" 
                      class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      :alt="userForm.nombre"
                      @click="showImagePreview(userForm.imagen_url)"
                    />
                    <div v-else class="w-full h-full bg-blue-500 flex items-center justify-center text-white font-black text-xl">
                      {{ getUserInitial(userForm.nombre) }}
                    </div>
                  </div>
                  <div>
                    <h4 class="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Información del Usuario
                    </h4>
                    <p class="text-[10px] text-gray-500">ID: {{ userForm.id_usuario }}</p>
                  </div>
                </div>
                
                <!-- Nombre -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    Nombre Completo
                  </label>
                  <div class="text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                    {{ userForm.nombre }}
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    Correo Electrónico
                  </label>
                  <div class="text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                    {{ userForm.email }}
                  </div>
                </div>

                <!-- Identidad -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    Número de Identidad
                  </label>
                  <div class="flex gap-2 h-[38px]">
                    <div class="w-full flex items-center justify-between text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 px-3 rounded border border-gray-200 dark:border-gray-600 h-full">
                      <span class="truncate">{{ userForm.identidad || 'No especificado' }}</span>
                      <span 
                        v-if="userForm.verificado" 
                        @click="showIdentityViewModal = true"
                        class="text-green-500 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform p-1" 
                        title="Ver Identidad"
                      >
                        <svg class="w-4 h-4 text-green-500 font-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Teléfono -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    Teléfono
                  </label>
                  <div class="text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                    {{ userForm.telefono || 'No especificado' }}
                  </div>
                </div>

                <!-- Ciudad y Fecha en la misma línea -->
                <div class="grid grid-cols-2 gap-3">
                  <!-- Ciudad -->
                  <div>
                    <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                      Ciudad
                    </label>
                    <div class="text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded border border-gray-200 dark:border-gray-600 truncate">
                      {{ userForm.ciudad?.nombre_ciudad || 'No especificada' }}
                    </div>
                  </div>

                  <!-- Fecha de Registro -->
                  <div>
                    <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                      Fecha de registro
                    </label>
                    <div class="text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded border border-gray-200 dark:border-gray-600 truncate">
                      {{ userForm.fecha_registro ? formatDate(userForm.fecha_registro) : 'No disponible' }}
                    </div>
                  </div>
                </div>
              </div> 

                <!-- Rol y Estado en una línea -->
                <div class="grid grid-cols-2 gap-3">
                  <!-- Rol -->
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rol
                    </label>
                    <multiselect
                      v-model="userForm.rol"
                      :options="roles"
                      :searchable="false"
                      :close-on-select="true"
                      :show-labels="false"
                      placeholder="Seleccionar rol"
                      label="nombre_rol"
                      track-by="id_rol"
                      class="multiselect-custom"
                      :class="{ 'multiselect--active': userForm.rol }"
                      :select-label="''"
                      :deselect-label="''"
                      :selected-label="''"
                      :no-options="loadingRoles ? 'Cargando roles...' : 'No hay roles disponibles'"
                      :no-result="'No se encontraron resultados'"
                      :loading="loadingRoles"
                      :disabled="loadingRoles || !roles.length"
                      :custom-label="getRoleLabel"
                      @search-change="$event && $event.stopPropagation()"
                      @search-focus="(e) => e && e.target && e.target.blur()"
                      @touchstart.native.stop
                      @click.native.stop
                      :options-limit="100"
                    >
                      <template #singleLabel="{ option }">
                        <span class="text-[12px] sm:text-xs truncate">{{ getRoleLabel(option) }}</span>
                      </template>
                      <template #option="{ option }">
                        <span class="text-[12px] sm:text-xs">{{ getRoleLabel(option) }}</span>
                      </template>
                    </multiselect>
                  </div>

                  <!-- Estado -->
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estado
                    </label>
                    <multiselect
                      v-model="userForm.estado"
                      :options="[
                        { value: 'activo', label: 'Activo' },
                        { value: 'inactivo', label: 'Inactivo' },
                        { value: 'deshabilitado', label: 'Deshabilitado' }
                      ]"
                      :searchable="false"
                      :close-on-select="true"
                      :show-labels="false"
                      placeholder="Estado"
                      label="label"
                      track-by="value"
                      class="multiselect-custom"
                      :class="{ 'multiselect--active': userForm.estado }"
                      :select-label="''"
                      :deselect-label="''"
                      :selected-label="''"
                      :no-options="'No hay opciones'"
                      :no-result="'No se encontraron resultados'"
                      :custom-label="getStatusLabel"
                      @search-change="$event && $event.stopPropagation()"
                      @search-focus="(e) => e && e.target && e.target.blur()"
                      @touchstart.native.stop
                      @click.native.stop
                      :options-limit="100"
                    >
                      <template #singleLabel="{ option }">
                        <span class="text-[12px] truncate">{{ getStatusLabel(option) }}</span>
                      </template>
                      <template #option="{ option }">
                        <span class="text-[12px]">{{ getStatusLabel(option) }}</span>
                      </template>
                    </multiselect>
                  </div>
                </div>

              <!-- Progreso de Membresía (solo para no técnicos) -->
              <div v-if="!isTechnician" class="border border-gray-200 dark:border-gray-600 rounded-lg p-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Membresía:</span>
                  <div v-if="loadingMembresiaProgreso" class="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  <span v-else-if="membresiaProgreso.status === 'success'" class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ membresiaProgreso.mesesProgreso }} {{ membresiaProgreso.mesesProgreso === 1 ? 'mes pagado' : 'meses pagados' }}
                  </span>
                  <span v-else class="text-xs text-gray-500">-</span>
                </div>
              </div>
              <!-- Botón de cambio de contraseña -->
              <div class="pt-2">
                <button 
                  type="button"
                  @click="showPasswordModal = true"
                  class="w-full py-2 mb-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Cambiar Contraseña</span>
                </button>
              </div>

              <!-- Botón de eliminar (solo visible si se está editando un usuario existente) -->
              <div class="pt-2">
                <button 
                  type="button"
                  @click="confirmDeleteUser(userForm)"
                  class="w-full py-2 mb-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                  :disabled="isDeleting"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>{{ isDeleting ? 'Eliminando...' : 'Eliminar Usuario' }}</span>
                </button>
              </div>

              <!-- Botones de acción -->
              <div class="flex space-x-2 pt-1">
                <button 
                  type="button"
                  @click="closeModal"
                  class="w-1/3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  :disabled="isSaving"
                  class="w-2/3 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs"
                >
                  {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </Transition>

    <!-- Top Credits Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showTopCreditsModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTopCreditsModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">💰 Top 5 Usuarios con más Créditos</h3>
              <button @click="showTopCreditsModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="space-y-2">
              <div v-for="(user, index) in topBalances" :key="index" class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-xs">{{ user.name }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ user.city }}</p>
                    </div>
                  </div>
                  <p class="text-sm font-bold text-green-600 dark:text-green-400">L. {{ formatCurrency(user.balance) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Unified Top Referrals Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showTopReferralsModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTopReferralsModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-md max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <div class="p-3">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4 border-b dark:border-gray-700 pb-2">
              <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">🏆 Ranking de Referidos</h3>
              <button @click="showTopReferralsModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Dashboard Style Sections -->
            <div class="space-y-5">
              <!-- Section 1: Quantity -->
              <div>
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-lg">👥</span>
                  <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Top 3 por Cantidad</p>
                </div>
                <div class="space-y-1.5">
                  <div v-for="(user, index) in topReferrals" :key="'q-'+index" class="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                    <div class="flex items-center space-x-2 min-w-0">
                      <span class="w-5 h-5 flex-shrink-0 bg-blue-500 text-white rounded-md flex items-center justify-center text-[10px] font-black">{{ index + 1 }}</span>
                      <div class="min-w-0">
                        <p class="font-bold text-gray-900 dark:text-white text-[11px] truncate">{{ user.name }}</p>
                        <p class="text-[9px] text-gray-500 dark:text-gray-400 truncate">{{ user.city }}</p>
                      </div>
                    </div>
                    <div class="text-right ml-2">
                      <p class="text-[12px] font-black text-blue-600 dark:text-blue-400 leading-none">{{ user.total }}</p>
                      <p class="text-[8px] text-blue-400 font-bold uppercase">Refs</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 2: Earnings -->
              <div>
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-lg">💰</span>
                  <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Top 3 por Ganancia</p>
                </div>
                <div class="space-y-1.5">
                  <div v-for="(user, index) in topEarnings" :key="'e-'+index" class="p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30 flex items-center justify-between">
                    <div class="flex items-center space-x-2 min-w-0">
                      <span class="w-5 h-5 flex-shrink-0 bg-amber-500 text-white rounded-md flex items-center justify-center text-[10px] font-black">{{ index + 1 }}</span>
                      <div class="min-w-0">
                        <p class="font-bold text-gray-900 dark:text-white text-[11px] truncate">{{ user.name }}</p>
                        <p class="text-[9px] text-gray-500 dark:text-gray-400 truncate">{{ user.city }}</p>
                      </div>
                    </div>
                    <div class="text-right ml-2">
                      <p class="text-[12px] font-black text-amber-600 dark:text-amber-400 leading-none">L. {{ formatCurrency(user.total) }}</p>
                      <p class="text-[8px] text-amber-400 font-bold uppercase">Total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Top Referrals Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showReferralsModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showReferralsModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">👥 Referidos de {{ selectedUser?.nombre }}</h3>
              <button @click="showReferralsModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <!-- Contenido simplificado -->
            <div class="space-y-2 mb-3">
              <div v-if="userReferrals.length === 0" class="text-center py-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">No se encontraron referidos</p>
              </div>
              <div v-else>
                <div v-for="referral in userReferrals" :key="referral.id" class="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg mb-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-xs">{{ referral.name }}</p> 
                    </div>
                    <span class="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-green-100 text-green-800">
                      {{ referral.status }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Registrado: {{ formatDate(referral.createdAt) }}</p>
                </div>
              </div>
            </div>
            
            <!-- Paginación -->
            <div v-if="referralsTotalPages > 1" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ Math.min(referralsCurrentPage * 5, totalReferrals) }} de {{ totalReferrals }}
                </div>
                <div class="flex items-center space-x-1">
                  <button 
                    @click="changeReferralsPage(referralsCurrentPage - 1)" 
                    :disabled="referralsCurrentPage === 1"
                    class="p-1.5 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'cursor-not-allowed': referralsCurrentPage === 1 }"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <span class="text-xs text-gray-700 dark:text-gray-300 px-2">
                    {{ referralsCurrentPage }} / {{ referralsTotalPages }}
                  </span>
                  
                  <button 
                    @click="changeReferralsPage(referralsCurrentPage + 1)" 
                    :disabled="referralsCurrentPage >= referralsTotalPages"
                    class="p-1.5 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'cursor-not-allowed': referralsCurrentPage >= referralsTotalPages }"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Credits Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showCreditsModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showCreditsModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">💰 Créditos de {{ selectedUser?.nombre }}</h3>
              <button @click="showCreditsModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <!-- Filtro y Saldo en una línea -->
            <div class="flex items-center justify-between mb-3 gap-2">

              <!-- Filtro de fecha -->
              <div class="flex-1 relative">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Filtrar por mes</label>
                <div class="relative">
                  <input 
                    type="month"
                    v-model="creditsFilterMonth"
                    @change="filterCredits"
                    class="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white appearance-none"
                    :class="{ 'text-transparent': !creditsFilterMonth }"
                  />
                </div>
              </div>
              
              <!-- Saldo -->
              <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 flex-1">
                <p class="text-sm font-bold text-green-600 dark:text-green-400">
                  L. {{ formatCurrency(creditsResponse?.saldoDisponible || 0) }}
                </p>
                <p class="text-xs text-green-600 dark:text-green-400">
                  Saldo disponible
                </p>
              </div>
            </div>
            
            <div class="space-y-2 mb-3">
              <div v-if="filteredCredits.length === 0" class="text-center py-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">No se encontraron transacciones</p>
              </div>
              <div v-else>
                <div v-for="transaction in paginatedCredits" :key="transaction.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-1.5 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <p class="font-medium text-gray-900 dark:text-white text-xs">
                          {{ transaction.description.includes('Retiro a cuenta bancaria') ? 'Retiro' : transaction.description }}
                        </p>
                        <div class="flex items-center space-x-1">
                          <template v-if="transaction.reference && transaction.reference.startsWith('COT-')">
                            <button 
                              @click.stop="openQuoteModal(transaction)"
                              class="flex-shrink-0 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                              title="Ver detalles de la cotización"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </template>
                          <template v-if="transaction.originalDescription && transaction.originalDescription.includes('Retiro a cuenta bancaria')">
                            <button 
                              @click.stop="openWithdrawalModal(transaction)"
                              class="flex-shrink-0 text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                              title="Ver detalles del retiro"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </template>
                        </div>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ formatDate(transaction.date) }}</p> 
                    </div>
                    <div class="text-right">
                      <p 
                        :class="{
                          'text-green-600': transaction.type === 'credit',
                          'text-red-600': transaction.type === 'debit',
                          'text-blue-500': transaction.type === 'info'
                        }" 
                        class="font-bold text-sm"
                      >
                        {{ transaction.type === 'credit' ? '+' : (transaction.type === 'debit' ? '-' : '') }}L. {{ formatCurrency(transaction.amount) }}
                      </p>
                      <span :class="{
                        'bg-green-100 text-green-800': transaction.status === 'Completado',
                        'bg-yellow-100 text-yellow-800': transaction.status === 'Pendiente',
                        'bg-red-100 text-red-800': transaction.status === 'Rechazado'
                      }" class="text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block">
                        {{ transaction.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Paginación créditos -->
            <div v-if="creditsTotalPages > 1" class="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400"> 
                </div>
                <div class="flex items-center space-x-2">
                  <button 
                    type="button"
                    @click="changeCreditsPage(creditsCurrentPage - 1)" 
                    :disabled="creditsCurrentPage === 1"
                    class="p-2 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    :class="{ 'cursor-not-allowed': creditsCurrentPage === 1 }"
                    aria-label="Página anterior"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Página {{ creditsCurrentPage }} de {{ creditsTotalPages }}
                  </span>
                  
                  <button 
                    type="button"
                    @click="changeCreditsPage(creditsCurrentPage + 1)" 
                    :disabled="creditsCurrentPage >= creditsTotalPages"
                    class="p-2 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    :class="{ 'cursor-not-allowed': creditsCurrentPage >= creditsTotalPages }"
                    aria-label="Siguiente página"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Service History Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showServiceHistoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showServiceHistoryModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">
                {{ selectedUser?.rol?.nombre_rol === 'usuario' ? '📋' : '🔧' }} 
                {{ selectedUser?.rol?.nombre_rol === 'usuario' ? 'Historial de ' : 'Servicios de ' }}
                {{ selectedUser?.nombre }}
              </h3>
              <button @click="showServiceHistoryModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <!-- Filtro y Contador en una línea -->
            <div class="flex items-center justify-between mb-3 gap-2">
            
              <!-- Filtro de fecha -->
              <div class="flex-1 relative">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Filtrar por mes</label>
                <div class="relative">
                  <input 
                    type="month"
                    v-model="servicesFilterDate"
                    @change="handleFilterServices"
                    class="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white appearance-none"
                    :class="{ 'text-transparent': !servicesFilterDate }"
                  />
                </div>
              </div>
              
              <!-- Contador de servicios -->
              <div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700 flex-1">
                <p class="text-sm font-bold text-purple-600 dark:text-purple-400">{{ userServiceHistory.length }}</p>
                <p class="text-xs text-purple-600 dark:text-purple-400">Servicios</p>
              </div>
            </div>
            
            <div class="space-y-2 mb-3">
              <div v-if="userServiceHistory.length === 0" class="text-center py-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">No se encontraron servicios</p>
              </div>
              <div v-else>
                <div v-for="(service, index) in paginatedServices" :key="`${service.id}-${index}`" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-1.5 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
                  <div class="flex items-start justify-between">
                    <div class="w-full">
                      <div class="grid grid-cols-2 gap-1">
                        <!-- Top Left: Service Name -->
                        <div class="font-medium text-gray-900 dark:text-white text-xs">
                          {{ service.name }}
                        </div>
                        
                        <!-- Top Right: Service ID -->
                        <div class="text-right text-xs text-gray-500 dark:text-gray-400">
                          #{{ service.id }}
                        </div>
                        
                        <!-- Bottom Left: Colonia -->
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ service.colonia }}
                        </div>
                        
                        <!-- Bottom Right: Icono de comentario y Fecha en la misma línea -->
                        <div class="flex items-center justify-end space-x-2">
                          <!-- Icono de comentario si existe -->
                          <span v-if="service.comentario && service.comentario.trim() !== ''" 
                                class="flex items-center text-blue-500 hover:text-blue-600 cursor-pointer text-xs font-medium"
                                @click.stop="showComment(service.comentario, service.calificacion, service.cliente)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Ver
                          </span>
                          
                          <!-- Fecha -->
                          <span class="text-xs text-gray-500 dark:text-gray-400">
                            {{ formatDate(service.date) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Paginación servicios -->
            <div v-if="servicesTotalPages > 1" class="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ servicesStartItem }}-{{ servicesEndItem }} de {{ userServiceHistory.length }}
                </div>
                <div class="flex items-center space-x-1">
                  <button 
                    @click="changeServicesPage(servicesCurrentPage - 1)" 
                    :disabled="servicesCurrentPage === 1"
                    class="p-1.5 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'cursor-not-allowed': servicesCurrentPage === 1 }"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div class="flex items-center space-x-0.5">
                    <template v-if="servicesTotalPages <= 5">
                      <button 
                        v-for="page in servicesTotalPages" 
                        :key="page"
                        @click="changeServicesPage(page)"
                        class="w-6 h-6 text-xs rounded-full flex items-center justify-center"
                        :class="{
                          'bg-blue-600 text-white': servicesCurrentPage === page,
                          'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700': servicesCurrentPage !== page
                        }"
                      >
                        {{ page }}
                      </button>
                    </template>
                    <template v-else>
                      <!-- Mostrar primeros 2 botones -->
                      <button 
                        v-for="page in Math.min(2, servicesTotalPages)" 
                        :key="page"
                        @click="changeServicesPage(page)"
                        class="w-6 h-6 text-xs rounded-full flex items-center justify-center"
                        :class="{
                          'bg-blue-600 text-white': servicesCurrentPage === page,
                          'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700': servicesCurrentPage !== page
                        }"
                      >
                        {{ page }}
                      </button>
                      
                      <!-- Puntos suspensivos si es necesario -->
                      <span v-if="servicesCurrentPage > 3" class="px-1 text-gray-500">...</span>
                      
                      <!-- Botones alrededor de la página actual -->
                      <template v-if="servicesCurrentPage > 2 && servicesCurrentPage < servicesTotalPages - 1">
                        <button 
                          v-if="servicesCurrentPage > 3"
                          @click="changeServicesPage(servicesCurrentPage - 1)"
                          class="w-6 h-6 text-xs rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {{ servicesCurrentPage - 1 }}
                        </button>
                        <button 
                          @click="changeServicesPage(servicesCurrentPage)"
                          class="w-6 h-6 text-xs rounded-full bg-blue-600 text-white"
                        >
                          {{ servicesCurrentPage }}
                        </button>
                        <button 
                          v-if="servicesCurrentPage < servicesTotalPages - 2"
                          @click="changeServicesPage(servicesCurrentPage + 1)"
                          class="w-6 h-6 text-xs rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {{ servicesCurrentPage + 1 }}
                        </button>
                      </template>
                      
                      <!-- Puntos suspensivos si es necesario -->
                      <span v-if="servicesCurrentPage < servicesTotalPages - 2" class="px-1 text-gray-500">...</span>
                      
                      <!-- Últimos 2 botones -->
                      <button 
                        v-for="page in [servicesTotalPages - 1, servicesTotalPages]" 
                        :key="page"
                        @click="changeServicesPage(page)"
                        class="w-6 h-6 text-xs rounded-full flex items-center justify-center"
                        :class="{
                          'bg-blue-600 text-white': servicesCurrentPage === page,
                          'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700': servicesCurrentPage !== page
                        }"
                      >
                        {{ page }}
                      </button>
                    </template>
                  </div>
                  
                  <button 
                    @click="changeServicesPage(servicesCurrentPage + 1)" 
                    :disabled="servicesCurrentPage >= servicesTotalPages"
                    class="p-1.5 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'cursor-not-allowed': servicesCurrentPage >= servicesTotalPages }"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Offered Services Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showOfferedServicesModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showOfferedServicesModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
              <h3 class="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span class="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">🛠️</span>
                Servicios que Ofrece
              </h3>
              <button @click="showOfferedServicesModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Técnico Info -->
            <div class="mb-4 flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div class="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {{ getUserInitial(selectedUser?.nombre) }}
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-gray-900 dark:text-white truncate">{{ selectedUser?.nombre }}</p>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 truncate">{{ selectedUser?.email }}</p>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loadingOfferedServices" class="text-center py-8">
              <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-gray-600 dark:text-gray-400 text-xs font-medium">Cargando servicios ofrecidos...</p>
            </div>

            <!-- Services List -->
            <div v-else>
              <div v-if="offeredServices.length === 0" class="text-center py-10 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-600">
                <div class="text-3xl mb-2">📋</div>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium px-4">Este técnico no tiene servicios asignados en su perfil todavía.</p>
              </div>
              <div v-else class="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                <div v-for="service in offeredServices" :key="service.id_tecnico_servicio" class="group p-3 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 flex items-center gap-3">
                  <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">
                    🔧
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-bold text-gray-900 dark:text-white text-[11px] leading-tight">{{ service.nombre }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Action -->
            <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button 
                @click="showOfferedServicesModal = false"
                class="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl text-xs hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal para Verificar Identidad -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showVerifyIdentityModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showVerifyIdentityModal = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-md max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">Verificar Identidad</h3>
              <button @click="showVerifyIdentityModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="p-4 space-y-4">
            <!-- Identity number -->
             <div class="text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Número de Identidad</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ userForm.identidad || 'No especificado' }}</p>
            </div>

            <!-- Identity Photo -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900/50">
              <span class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Fotografía del documento</span>
              <div v-if="userForm.identidad_url" class="relative w-full aspect-video rounded-lg overflow-hidden bg-black/5 flex items-center justify-center cursor-pointer" @click="showImagePreview(userForm.identidad_url)">
                <img :src="userForm.identidad_url" alt="Identidad" class="w-full h-full object-contain hover:scale-105 transition-transform" />
              </div>
              <div v-else class="w-full aspect-video rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <span class="text-gray-400 text-sm">No hay fotografía subida</span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex space-x-2 pt-2">
              <button 
                type="button"
                @click="rejectIdentity"
                :disabled="isVerifyingIdentity"
                class="flex-1 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-bold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-xs disabled:opacity-50"
              >
                {{ isVerifyingIdentity ? 'Borrando...' : 'Borrar Imagen' }}
              </button>
              <button 
                type="button"
                @click="verifyIdentity"
                :disabled="isVerifyingIdentity || !userForm.identidad_url || userForm.verificado"
                class="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors text-xs disabled:opacity-50 disabled:bg-green-300 dark:disabled:bg-green-800"
              >
                <div class="flex items-center justify-center gap-1">
                  <svg v-if="userForm.verificado" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>{{ userForm.verificado ? 'Verificado' : 'Verificar Identidad' }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Cambio de Contraseña -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showPasswordModal = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">Cambiar Contraseña</h3>
              <button @click="showPasswordModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Contenido -->
          <div class="p-4">
            <form @submit.prevent="updatePassword" class="space-y-4">
              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva Contraseña</label>
                <input
                  id="newPassword"
                  v-model="newPassword"
                  type="password"
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-sm"
                  placeholder="Ingresa la nueva contraseña"
                  required
                  minlength="6"
                >
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Mínimo 6 caracteres</p>
              </div>
              
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Contraseña</label>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-sm"
                  placeholder="Confirma la nueva contraseña"
                  required
                  :class="{'border-red-500 dark:border-red-400': passwordMismatch}"
                >
                <p v-if="passwordMismatch" class="mt-1 text-xs text-red-600 dark:text-red-400">Las contraseñas no coinciden</p>
              </div>
              
              <div class="flex space-x-3 pt-2">
                <button
                  type="button"
                  @click="showPasswordModal = false"
                  class="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                  :disabled="isUpdatingPassword"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                  :disabled="isUpdatingPassword || passwordMismatch"
                >
                  <span v-if="isUpdatingPassword" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </span>
                  <span v-else>Actualizar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Comentario -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showCommentModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showCommentModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] max-w-sm relative z-10">
          <div class="p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Comentario del Cliente</h3>
              <button @click="showCommentModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Cliente</p>
                <p class="text-sm text-gray-900 dark:text-white">{{ currentClient }}</p>
              </div>
              
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Calificación</p>
                <div class="flex items-center">
                  <span class="text-yellow-500 text-sm mr-1">{{ currentRating }}</span>
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
              
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Comentario</p>
                <p class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  {{ currentComment }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Top Saldos Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showTopBalancesModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTopBalancesModal = false"></div>
        <Transition
          enter-active-class="modal-content-enter-active"
          leave-active-class="modal-content-leave-active"
          enter-from-class="modal-content-enter-from"
          leave-to-class="modal-content-leave-to"
        >
          <div v-if="showTopBalancesModal" class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] max-w-sm max-h-[90vh] overflow-y-auto relative z-10">
            <div class="p-3">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-black text-gray-900 dark:text-white">🏆 Top 5 Técnicos con Más Crédito</h3>
                <button @click="showTopBalancesModal = false" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <!-- Loading State -->
              <div v-if="isLoadingTopBalances" class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
              </div>
              
              <!-- Empty State -->
              <div v-else-if="topBalances.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
                No hay técnicos con crédito disponible
              </div>
              
              <!-- Data -->
              <div v-else class="space-y-2">
                <div v-for="(tech, index) in topBalances" :key="tech.id" class="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <span class="w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white text-xs">{{ tech.name }}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">{{ tech.city }}</p>
                      </div>
                    </div>
                    <p class="text-sm font-bold text-yellow-600 dark:text-yellow-400">L. {{ formatCurrency(tech.balance) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Top Calificaciones Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showTopRatingsModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTopRatingsModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] max-w-sm max-h-[90vh] overflow-y-auto relative z-10">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">⭐ Top 5 Técnicos Mejor Calificados</h3>
              <button @click="showTopRatingsModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div v-if="isLoadingTopRatings" class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
            <div v-else-if="topRatings.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
              No hay técnicos calificados aún
            </div>
            <div v-else class="space-y-2">
              <div v-for="(tech, index) in topRatings" :key="tech.id" class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-xs">{{ tech.name }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ tech.city }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-1">
                    <span class="text-sm font-bold text-purple-600 dark:text-purple-400">{{ tech.rating.toFixed(1) }}</span>
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-xs text-gray-500 dark:text-gray-400">({{ tech.reviews }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Detalles del Monto -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showAmountDetailsModal" class="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-3">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showAmountDetailsModal = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[90%] sm:w-[92%] max-w-[300px] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Detalles del Monto</h3>
              <button @click="showAmountDetailsModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-3">
            <div v-if="currentQuote" class="space-y-3">
              <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <h4 class="font-medium text-green-800 dark:text-green-200 text-xs sm:text-sm mb-2">Detalles de la Cotización</h4>
                <div class="text-xs sm:text-sm space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Solicitud:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ currentQuote.id_solicitud }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Mano de obra:</span>
                    <span class="font-medium text-gray-900 dark:text-white">L. {{ currentQuote.monto_manodeobra || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Crédito usado:</span>
                    <span class="font-medium text-green-600 dark:text-green-400">-L. {{ currentQuote.credito_usado || 0 }}</span>
                  </div>
                  <hr class="border-gray-200 dark:border-gray-600">
                  <div class="flex justify-between font-bold">
                    <span class="text-gray-900 dark:text-white">Total pagado:</span>
                    <span class="text-gray-900 dark:text-white">L. {{ (currentQuote.monto_manodeobra - (currentQuote.credito_usado || 0)).toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Cashback:</span>
                    <span class="font-medium text-blue-600 dark:text-blue-400">L. {{ currentQuote.descuento_membresia || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de detalles de cotización -->
    <div v-if="showQuoteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Detalles de la cotización
                  </h3>
                  <button 
                    @click="showQuoteModal = false"
                    class="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
                  >
                    <span class="sr-only">Cerrar</span>
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div v-if="quoteLoading" class="mt-4 py-8 flex justify-center">
                  <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
                
                <div v-else-if="currentQuote" class="mt-4 space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Número de cotización</p>
                      <p class="mt-1 text-sm text-gray-900 dark:text-white">COT-{{ currentQuote.id_cotizacion }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha</p>
                      <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(currentQuote.fecha_creacion) }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</p>
                      <span :class="{
                        'bg-green-100 text-green-800': currentQuote.estado === 'aprobada',
                        'bg-yellow-100 text-yellow-800': currentQuote.estado === 'pendiente',
                        'bg-red-100 text-red-800': currentQuote.estado === 'rechazada' || currentQuote.estado === 'cancelada',
                        'bg-blue-100 text-blue-800': currentQuote.estado === 'completada'
                      }" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ currentQuote.estado }}
                      </span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Monto total</p>
                      <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">L. {{ formatCurrency(currentQuote.monto_total || 0) }}</p>
                    </div>
                  </div>
                  
                  <div v-if="currentQuote.descripcion">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Descripción</p>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-line">{{ currentQuote.descripcion }}</p>
                  </div>
                  
                  <div v-if="currentQuote.servicios && currentQuote.servicios.length > 0">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Servicios</p>
                    <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Servicio</th>
                            <th scope="col" class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cantidad</th>
                            <th scope="col" class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Precio</th>
                            <th scope="col" class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          <tr v-for="(item, index) in currentQuote.servicios" :key="index">
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.nombre_servicio || 'Servicio' }}</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">{{ item.cantidad || 1 }}</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">L. {{ formatCurrency(item.precio_unitario || 0) }}</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right">L. {{ formatCurrency((item.cantidad || 1) * (item.precio_unitario || 0)) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="showQuoteModal = false"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para ver detalles de retiro -->
  <div v-if="showWithdrawalModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showWithdrawalModal = false"></div>
    <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[85vw] max-w-sm max-h-[85vh] overflow-y-auto relative z-10">
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-lg sm:rounded-t-xl">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center text-base sm:text-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              💸
            </div>
            <div class="min-w-0">
              <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                {{ currentWithdrawal?.status === 'Pendiente' ? 'Solicitud de Retiro' : 'Detalles del Retiro' }}
              </h3>
              <p class="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">
                {{ formatDate(currentWithdrawal?.date) }}
              </p>
            </div>
          </div>
          <button @click="showWithdrawalModal = false" class="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="p-4 text-sm">
        <div class="space-y-4">
          <div class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg relative h-32">
            <!-- Fila superior -->
            <div class="absolute top-4 left-0 right-0 flex justify-between px-4">
              <!-- ID -->
              <div class="w-1/2 text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">ID</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">#{{ currentWithdrawal?.id || 'N/A' }}</p>
              </div>
              
              <!-- Cantidad -->
              <div class="w-1/2 text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">Cantidad</p>
                <p class="text-sm font-medium text-red-600">L. {{ formatCurrency(currentWithdrawal?.amount || 0) }}</p>
              </div>
            </div>
            
            <!-- Fila inferior -->
            <div class="absolute bottom-4 left-0 right-0 flex justify-between px-4">
              <!-- Estado -->
              <div class="w-1/2 text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Estado</p>
                <span 
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': currentWithdrawal?.status === 'Completado',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': currentWithdrawal?.status === 'Pendiente',
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': currentWithdrawal?.status === 'Rechazado'
                  }" 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ currentWithdrawal?.status || 'Pendiente' }}
                </span>
              </div>
              
              <!-- Fecha -->
              <div class="w-1/2 text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">Fecha</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(currentWithdrawal?.date) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Detalles del Retiro</h4>
            <div class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {{ currentWithdrawal?.description || 'Sin detalles adicionales' }}
            </div>
          </div>
        </div>

        <div class="mt-6">
          <button 
            @click="showWithdrawalModal = false"
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de vista previa de imagen -->
  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="imagePreview.show" 
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      @click.self="closeImagePreview"
    >
      <div class="relative max-w-4xl w-full max-h-[90vh]">
        <button 
          @click="closeImagePreview"
          class="absolute -top-3 -right-3 text-white hover:text-gray-300 transition-colors bg-black/80 hover:bg-black rounded-full p-2 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img 
          :src="imagePreview.url" 
          alt="Vista previa"
          class="max-w-full max-h-[80vh] mx-auto object-contain"
        />
      </div>
    </div>
  </Transition>

  <!-- Modal para ver Identificación -->
  <Transition
    enter-active-class="backdrop-enter-active"
    leave-active-class="backdrop-leave-active"
    enter-from-class="backdrop-enter-from"
    leave-to-class="backdrop-leave-to"
  >
    <div v-if="showIdentityViewModal" class="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showIdentityViewModal = false"></div>
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[90%] sm:max-w-md overflow-hidden relative z-10 mx-auto border border-gray-200 dark:border-gray-700">
        <!-- Header -->
        <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-xl">🪪</span>
            <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Documento de Identidad</h3>
          </div>
          <button @click="showIdentityViewModal = false" class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-4 space-y-4">
          <!-- Info Badge -->
          <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30">
            <p class="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Número de Identidad</p>
            <p class="text-base font-black text-gray-900 dark:text-white tracking-wider">{{ userForm.identidad || 'No especificado' }}</p>
          </div>

          <!-- Image Container -->
          <div class="space-y-2">
            <p class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">Fotografía del Documento</p>
            <div class="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-[4/3] border border-gray-200 dark:border-gray-700 group">
              <img 
                v-if="userForm.identidad_url" 
                :src="userForm.identidad_url" 
                class="w-full h-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                @click="showImagePreview(userForm.identidad_url)"
              />
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <svg class="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p class="text-xs font-bold">Sin imagen disponible</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
          <button 
            @click="showIdentityViewModal = false"
            class="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Estilos personalizados para vue-multiselect */
:deep(.multiselect-custom) {
  @apply min-w-[140px] text-xs;
}

:deep(.multiselect-custom .multiselect__tags) {
  @apply min-h-[36px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500;
  padding: 6px 30px 6px 10px;
  transition: all 0.2s ease;
}

:deep(.multiselect-custom .multiselect__single) {
  @apply m-0 p-0 bg-transparent text-gray-900 dark:text-white text-xs;
  line-height: 1.25rem;
}

:deep(.multiselect-custom .multiselect__input) {
  @apply m-0 p-0 bg-transparent text-gray-900 dark:text-white text-xs placeholder-gray-400;
  @apply focus:ring-0 focus:border-transparent;
  min-height: 20px;
  line-height: 1.25rem;
}

:deep(.multiselect-custom .multiselect__placeholder) {
  @apply m-0 p-0 text-gray-400 text-xs;
  line-height: 1.25rem;
  margin-top: 1px;
}

:deep(.multiselect-custom .multiselect__select) {
  @apply h-full w-6 right-0 top-0 flex items-center justify-center;
  background: transparent;
  padding: 0;
}

:deep(.multiselect-custom .multiselect__select:before) {
  @apply border-t-gray-400 dark:border-t-gray-400;
  border-width: 5px 5px 0;
  margin-top: 0;
  top: 55%;
}

:deep(.multiselect-custom .multiselect__content-wrapper) {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 z-50;
  min-width: 100%;
  width: auto !important;
}

:deep(.multiselect-custom .multiselect__option) {
  @apply text-xs text-gray-900 dark:text-white;
  padding: 8px 12px;
  line-height: 1.25rem;
}

:deep(.multiselect-custom .multiselect__option--highlight) {
  @apply bg-transparent text-gray-900 dark:text-white;
}

:deep(.multiselect-custom .multiselect__option--selected) {
  @apply bg-transparent text-gray-900 dark:text-white;
}

:deep(.multiselect-custom .multiselect__option--selected.multiselect__option--highlight) {
  @apply bg-transparent text-gray-900 dark:text-white;
}

:deep(.multiselect-custom .multiselect__tag) {
  @apply bg-blue-500 text-white text-xs rounded;
  padding: 2px 6px;
  margin: 2px 4px 2px 0;
}

:deep(.multiselect-custom .multiselect__tag-icon) {
  @apply hover:bg-blue-600 text-white;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

:deep(.multiselect__tag) {
  @apply bg-blue-500 text-white text-xs;
}

:deep(.multiselect__tag-icon) {
  @apply hover:bg-blue-600 text-white;
}

:deep(.multiselect__tag-icon:after) {
  @apply text-white text-sm;
}

:deep(.multiselect__spinner) {
  @apply bg-transparent;
}

:deep(.multiselect__spinner:before, .multiselect__spinner:after) {
  @apply border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent;
}

/* ===== ANIMACIONES PARA MODALES ===== */
/* Animación de fondo (backdrop) */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Animación del contenido del modal */
.modal-content-enter-active {
  animation: modal-enter 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.modal-content-leave-active {
  animation: modal-leave 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes modal-enter {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes modal-leave {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
}

/* Transiciones para el componente Transition de Vue */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
}

/* Estilos generales */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.6);
}

button, input, textarea, select {
  min-height: 44px;
}

input, textarea, select {
  font-size: 16px;
}

/* Asegurar que los modales tengan un ancho máximo del 85% en móviles */
@media (max-width: 640px) {
  .max-w-sm {
    max-width: 85% !important;
  }
}
</style>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { debounce } from 'lodash-es'
import Multiselect from 'vue-multiselect'
import { useHead, useCookie } from '#imports'
import { useRouter, useRoute } from 'vue-router'

import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

// ===== CONFIGURACIÓN =====
const { $api } = useNuxtApp();

const userCookie = useCookie('user')
const router = useRouter()
const route = useRoute()

// SEO y Meta
useHead({
  title: 'MiSeguro - Gestión de Usuarios',
  meta: [
    { name: 'description', content: 'Gestión de usuarios del sistema MiSeguro - Administrar usuarios, técnicos y administradores' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.9, user-scalable=no'}
  ]
})

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const loadingUsers = ref(false)
const loadingMoreUsers = ref(false)
const loadingTechnicians = ref(false)
const loadingRoles = ref(false)
const loadingCities = ref(false)
const loadingServices = ref(false)
const loadingStats = ref(false)
const isSaving = ref(false)
const isEditing = ref(false)
const isDeleting = ref(false) // Added missing reactive reference
const deactivatingTechnicians = ref(false)

// Estado para la vista previa de imágenes
const imagePreview = ref({
  show: false,
  url: ''
})

// Estadísticas
const stats = ref({
  totalUsuarios: 0,
  totalReferidos: 0,
  totalCreditos: 0
})

// Datos
const users = ref([])
const technicians = ref([])
const administrators = ref([])
const roles = ref([])
const availableCities = ref([])
const availableServices = ref([])
const cities = ref([])
const hasMoreUsers = ref(false)
const totalAdmins = ref(0)
const pendingVerificationUsers = ref([])
const loadingPendingVerification = ref(false)

// Modales
const showTopEarningsModal = ref(false)
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const showVerifyIdentityModal = ref(false)
const isVerifyingIdentity = ref(false)
const showReferralsModal = ref(false) 
const showServiceHistoryModal = ref(false)
const selectedUserType = ref('') // 'user' o 'technician'
const showCommentModal = ref(false)
const showTopCreditsModal = ref(false)
const showTopReferralsModal = ref(false)
const showTopBalancesModal = ref(false)
const showTopRatingsModal = ref(false)
const showCreditsModal = ref(false)
const showQuoteModal = ref(false)
const showAmountDetailsModal = ref(false)
const showWithdrawalModal = ref(false)
const showOfferedServicesModal = ref(false)
const showIdentityViewModal = ref(false)
const offeredServices = ref([])
const loadingOfferedServices = ref(false)

const anyModalOpen = computed(() => {
  return showEditModal.value || 
         showPasswordModal.value || 
         showVerifyIdentityModal.value || 
         showReferralsModal.value || 
         showServiceHistoryModal.value || 
         showCommentModal.value || 
         showTopCreditsModal.value || 
         showTopReferralsModal.value || 
         showTopBalancesModal.value || 
         showTopRatingsModal.value || 
         showTopEarningsModal.value ||
         showCreditsModal.value ||
         showQuoteModal.value ||
         showAmountDetailsModal.value ||
          showWithdrawalModal.value ||
          showOfferedServicesModal.value ||
          showIdentityViewModal.value ||
         imagePreview.value.show
})

watch(anyModalOpen, (newValue) => {
  if (process.client) {
    const overflowValue = newValue ? 'hidden' : ''
    document.body.style.overflow = overflowValue
    document.documentElement.style.overflow = overflowValue
  }
})

// Estados para el cambio de contraseña
const newPassword = ref('')
const confirmPassword = ref('')
const isUpdatingPassword = ref(false)

// ===== VARIABLES DE PAGINACIÓN =====
const itemsPerPage = 6
const techniciansPerPage = ref(6)
const adminsItemsPerPage = 6
const modalItemsPerPage = 5

// Cache para almacenar páginas ya cargadas (incluye filtros en la clave)
const usersCache = {}
const techniciansCache = {}  // Cache for technicians data

// Paginación principal
const usersCurrentPage = ref(1)
const techniciansCurrentPage = ref(1)
const adminsCurrentPage = ref(1)
const totalUsers = ref(0)
const totalTechnicians = ref(0)

// Paginación modales
const referralsCurrentPage = ref(1)
const creditsCurrentPage = ref(1)
const creditsTotalPages = ref(1)
const servicesCurrentPage = ref(1)

// ===== VARIABLES DE FILTROS =====
const searchQuery = ref('') 
const selectedService = ref(null)
const selectedCity = ref('')
const isSearching = ref(false)

// Watchers para los filtros
watch([selectedService, selectedCity], () => {
  // Reiniciar a la primera página cuando cambian los filtros
  adminsCurrentPage.value = 1
  techniciansCurrentPage.value = 1
  usersCurrentPage.value = 1
  
  // Cargar datos con los nuevos filtros
  loadAdministrators(1)
  loadTechnicians(1)
  loadUsers(1)
}, { deep: true })

// Función para cargar datos con debounce
const debouncedLoadData = debounce(async () => {
  isSearching.value = true
  try {
    // Reiniciar a la primera página al buscar
    adminsCurrentPage.value = 1
    techniciansCurrentPage.value = 1
    usersCurrentPage.value = 1
    
    // Cargar datos con el nuevo término de búsqueda
    await Promise.all([
      loadAdministrators(1),
      loadTechnicians(1),
      loadUsers(1)
    ])
  } finally {
    isSearching.value = false
  }
}, 1500)

// Watcher para el buscador con debounce
watch(searchQuery, () => {
  debouncedLoadData()
}) 

// Opciones de filtros
const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'deshabilitado', label: 'Deshabilitado' }
]

// ===== VARIABLES DE DATOS TEMPORALES =====
const selectedUser = ref(null)
const userReferrals = ref([])
const userCreditHistory = ref([])
const userServiceHistory = ref([])

// Variables para tops
const topBalances = ref([])
const topReferrals = ref([])
const topRatings = ref([])
const topEarnings = ref([])
const isLoadingTopBalances = ref(false)
const isLoadingTopReferrals = ref(false)
const isLoadingTopRatings = ref(false)
const isLoadingTopEarnings = ref(false)

// Variables para el formulario de usuario
const userForm = ref({
  id_usuario: null,
  id_ciudad: null,
  id_rol: null,
  rol: null,
  nombre: '',
  identidad: '',
  email: '',
  telefono: '',
  estado: 'activo',
  ciudad: null,
  fecha_registro: null,
  imagen_url: null,
  identidad_url: null,
  verificado: false
}) 

// Variables para filtros de modales
const referralsFilterMonth = ref('')
const creditsFilterMonth = ref('') 

// Variables de paginación para referidos
const totalReferrals = ref(0)
const referralsTotalPages = ref(1)

// Cache para almacenar referidos por usuario y página
const referralsCache = ref({})

// Variables para comentarios
const currentComment = ref('')
const currentRating = ref('')
const currentClient = ref('') 

// Variables para el modal de créditos 
const creditsLoading = ref(false)  
const totalCreditsCount = ref(0)

// Variables para el modal de cotización
const currentQuote = ref(null)

// Variables para el progreso de membresía
const membresiaProgreso = ref({
  status: '',
  mesesProgreso: 0,
  montoTotal: 0,
  valorMembresia: '0'
})
const loadingMembresiaProgreso = ref(false)
const quoteLoading = ref(false)

// Cargar detalles de la cotización
const loadQuoteDetails = async (quoteId) => {
  try {
    quoteLoading.value = true
    const response = await $api(`/cotizaciones/${quoteId}`, {
      method: 'GET'
    })
    
    if (response && response.success) {
      currentQuote.value = response.data
      showQuoteModal.value = true
    } else {
      showError(response?.message || 'No se pudieron cargar los detalles de la cotización')
    }
  } catch (error) {
    console.error('Error al cargar la cotización:', error)
    showError('Error al cargar la cotización. Por favor, intente nuevamente.')
  } finally {
    quoteLoading.value = false
  }
}

// Abrir modal de cotización
const openQuoteModal = (transaction) => {
  if (transaction.cotizacionData) {
    currentQuote.value = transaction.cotizacionData
    showAmountDetailsModal.value = true
  } else if (transaction.reference && transaction.reference.startsWith('COT-')) {
    const quoteId = transaction.reference.replace('COT-', '')
    loadQuoteDetails(quoteId)
  }
}

// Cache para créditos
const creditsCache = ref({})

// Variables para el modal de retiro
const currentWithdrawal = ref(null)

// Abrir modal de retiro
const openWithdrawalModal = (transaction) => {
  // Extraer los detalles del retiro de la descripción original
  const description = transaction.originalDescription || transaction.description;
  const match = description.match(/Retiro a cuenta bancaria: (.+?), (?:numero|numeor) de cuenta[>: ]+([^,]+), mi id (.+)/i);
  
  currentWithdrawal.value = {
    id: transaction.id,
    bank: match ? match[1].trim() : 'No especificado',
    accountNumber: match ? match[2].trim() : 'No especificado',
    userId: match ? match[3].trim() : 'No especificado',
    amount: transaction.amount,
    date: transaction.date,
    status: transaction.status,
    description: description
  }
  showWithdrawalModal.value = true
}

// Respuesta de la API de créditos
const creditsResponse = ref(null)

// Variables para el modal de detalles de monto
// Generar clave única para el cache
const getCacheKey = (userId, page, month) => {
  return `${userId}-${page}-${month || 'all'}`
}

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
})

// ===== WATCHER PARA REINICIAR PAGINACIÓN AL CAMBIAR FILTROS =====
watch([selectedService, selectedCity], () => {
  usersCurrentPage.value = 1
  techniciansCurrentPage.value = 1
  adminsCurrentPage.value = 1
  
  // Limpiar cache cuando cambien los filtros
  Object.keys(usersCache).forEach(key => delete usersCache[key])
  
  // Recargar datos cuando cambien los filtros
  loadUsers(1)
  loadTechnicians(1)
}) 

// ===== COMPUTED PROPERTIES =====
// Para administradores seguimos filtrando en frontend
const hasActiveFilters = computed(() => {
  return !!(
    searchQuery.value || 
    selectedService.value || 
    selectedCity.value
  );
});

const filteredAdmins = computed(() => {
  if (!users.value) return [];
  
  return users.value.filter(user => {
    // Filter by search query
    const searchQuery = searchQuery.value?.toLowerCase() || '';
    const matchesSearch = !searchQuery || 
      (user.nombre && user.nombre.toLowerCase().includes(searchQuery)) ||
      (user.email && user.email.toLowerCase().includes(searchQuery)) ||
      (user.telefono && user.telefono.includes(searchQuery));
    
    // Filter by service
    const matchesService = !selectedService.value || 
      (user.servicios && user.servicios.some(s => s.id_servicio === selectedService.value.id_servicio));
    
    // Filter by city
    const matchesCity = !selectedCity.value || 
      (user.ciudad && user.ciudad.id_ciudad === selectedCity.value);
    
    return matchesSearch && matchesService && matchesCity;
  });
});

// Paginación principal - Los usuarios y técnicos ahora muestran lo que viene del backend
const paginatedAdmins = computed(() => {
  const start = (adminsCurrentPage.value - 1) * adminsItemsPerPage
  const end = start + adminsItemsPerPage
  return filteredAdmins.value.slice(start, end)
})

// Calcular el total de páginas
const usersTotalPages = computed(() => {
  if (hasMoreUsers.value) {
    return usersCurrentPage.value + 1
  }
  return Math.max(usersCurrentPage.value, 1)
})

const techniciansTotalPages = computed(() => Math.ceil(totalTechnicians.value / techniciansPerPage.value))
const adminsTotalPages = computed(() => Math.ceil(filteredAdmins.value.length / adminsItemsPerPage))

const adminsStartItem = computed(() => (adminsCurrentPage.value - 1) * adminsItemsPerPage + 1)
const adminsEndItem = computed(() => Math.min(adminsCurrentPage.value * adminsItemsPerPage, filteredAdmins.value.length))

// Filtros modales
const filteredReferrals = computed(() => {
  if (!referralsFilterMonth.value) return userReferrals.value
  
  return userReferrals.value.filter(referral => {
    const referralDate = new Date(referral.createdAt)
    const referralMonth = `${referralDate.getFullYear()}-${String(referralDate.getMonth() + 1).padStart(2, '0')}`
    return referralMonth === referralsFilterMonth.value
  })
})

const filteredCredits = computed(() => {
  if (!creditsFilterMonth.value) return userCreditHistory.value
  
  return userCreditHistory.value.filter(credit => {
    const creditMonth = new Date(credit.date).toISOString().slice(0, 7)
    return creditMonth === creditsFilterMonth.value
  })
})

// Paginación modales
const paginatedReferrals = computed(() => {
  const start = (referralsCurrentPage.value - 1) * modalItemsPerPage
  const end = start + modalItemsPerPage
  return filteredReferrals.value.slice(start, end)
})
 
const paginatedCredits = computed(() => {
  return userCreditHistory.value
})

// Filtro de mes para servicios
const servicesFilterDate = ref('')

// Filtrar servicios por mes
const filterServices = async () => {
  try {
    if (!selectedUser.value) return
    
    const params = new URLSearchParams({
      id_tecnico: selectedUser.value.id_usuario
    })
    
    if (servicesFilterDate.value) {
      params.append('month', servicesFilterDate.value)
    }
    
    const url = `/solicitudservicio?${params.toString()}`
    
    const data = await $api(url, {
      method: 'GET'
    }) 
    
    // Mapear la respuesta al formato esperado por la interfaz
    userServiceHistory.value = data.data.map(solicitud => ({
      id: solicitud.id_solicitud,
      name: solicitud.servicio?.nombre || 'Servicio sin nombre',
      date: solicitud.fecha_solicitud,
      status: solicitud.estado,
      descripcion: solicitud.descripcion || 'Sin descripción',
      estado: solicitud.estado,
      comentario: solicitud.calificacion?.comentario || '',
      calificacion: solicitud.calificacion?.calificacion || 0,
      colonia: solicitud.colonia || '',
      cotizacion: solicitud.cotizacion || null,
      pagoVisita: solicitud.pagoVisita || null,
      cliente: solicitud.cliente?.nombre || 'Cliente no disponible'
    }))
    
  } catch (error) {
    console.error('Error al filtrar servicios:', error)
    showError('No se pudieron cargar los servicios filtrados')
  }
}

// Filtrar servicios por mes para USUARIOS
const filterUserServices = async () => {
  try {
    if (!selectedUser.value) return
    
    const params = new URLSearchParams({
      id_usuario: selectedUser.value.id_usuario
    })
    
    if (servicesFilterDate.value) {
      params.append('month', servicesFilterDate.value)
    }
    
    const url = `/solicitudservicio?${params.toString()}`
    
    const data = await $api(url, {
      method: 'GET'
    }) 
    
    // Mapear la respuesta al formato esperado por la interfaz
    userServiceHistory.value = data.data.map(solicitud => ({
      id: solicitud.id_solicitud,
      name: solicitud.servicio?.nombre || 'Servicio sin nombre',
      date: solicitud.fecha_solicitud,
      status: solicitud.estado,
      descripcion: solicitud.descripcion || 'Sin descripción',
      estado: solicitud.estado,
      comentario: solicitud.calificacion?.comentario || '',
      calificacion: solicitud.calificacion?.calificacion || 0,
      colonia: solicitud.colonia || '',
      cotizacion: solicitud.cotizacion || null,
      pagoVisita: solicitud.pagoVisita || null,
      cliente: solicitud.cliente?.nombre || 'Cliente no disponible'
    }))
    
  } catch (error) {
    console.error('Error al filtrar servicios de usuario:', error)
    showError('No se pudieron cargar los servicios del usuario')
  }
}

// Función intermedia para manejar el filtro según el tipo de usuario
const handleFilterServices = async () => {
  if (!selectedUser.value) return
  
  // Verificar el tipo de usuario usando selectedUserType primero, luego verificar rol.nombre_rol
  const isTechnician = selectedUserType.value === 'technician' || 
                       (selectedUser.value.rol?.nombre_rol === 'tecnico') ||
                       (selectedUser.value.rol?.nombre_rol === 'técnico')
  
  if (isTechnician) {
    await filterServices()
  } else {
    await filterUserServices()
  }
}

const filteredServices = computed(() => userServiceHistory.value)

const paginatedServices = computed(() => {
  const start = (servicesCurrentPage.value - 1) * modalItemsPerPage
  const end = start + modalItemsPerPage
  return filteredServices.value.slice(start, end)
})

const servicesTotalPages = computed(() => Math.ceil(filteredServices.value.length / modalItemsPerPage))

const servicesStartItem = computed(() => (servicesCurrentPage.value - 1) * modalItemsPerPage + 1)
const servicesEndItem = computed(() => Math.min(servicesCurrentPage.value * modalItemsPerPage, filteredServices.value.length))

// Validar si las contraseñas coinciden
const passwordMismatch = computed(() => {
  return newPassword.value && confirmPassword.value && 
         newPassword.value !== confirmPassword.value
})

// Actualizar contraseña del usuario
const updatePassword = async () => {
  try {
    // Validar que las contraseñas coincidan
    if (passwordMismatch.value) {
      showToast({
        type: 'error',
        message: 'Las contraseñas no coinciden',
        duration: 3000
      });
      return;
    }
    
    // Validar longitud mínima
    if (newPassword.value.length < 6) {
      showToast({
        type: 'error',
        message: 'La contraseña debe tener al menos 6 caracteres',
        duration: 3000
      });
      return;
    }
    
    isUpdatingPassword.value = true;
    
    const response = await $api(`/usuarios/cambio-clave/${userForm.value.id_usuario}`, {
      method: 'PUT',
      body: {
        currentPassword: '',  // No requerido para admin
        newPassword: newPassword.value
      }
    });
    
    // Cerrar el modal de contraseña
    showPasswordModal.value = false;
    
    // Limpiar los campos
    newPassword.value = '';
    confirmPassword.value = '';
    
    // Mostrar mensaje de éxito
    showToast({
      type: 'success',
      message: 'Contraseña actualizada correctamente',
      duration: 3000
    });
    
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    showToast({
      type: 'error',
      message: error.data?.message || 'Error al actualizar la contraseña',
      duration: 3000
    });
  } finally {
    isUpdatingPassword.value = false;
  }
}

// Verificar si el usuario seleccionado es un técnico
const isTechnician = computed(() => {
  if (!selectedUser.value) return false;
  
  // Verificar diferentes formatos de rol
  const roleName = selectedUser.value.rol?.nombre_rol?.toLowerCase() || 
                  selectedUser.value.rol?.toLowerCase() || 
                  selectedUser.value.role?.toLowerCase() || 
                  '';
  
  return roleName.includes('tecnico') || roleName.includes('técnico');
})

// ===== FUNCIONES PARA VISTA PREVIA DE IMAGEN =====
const showImagePreview = (imageUrl) => {
  if (!imageUrl) return
  imagePreview.value = {
    show: true,
    url: imageUrl
  }
}

const closeImagePreview = () => {
  imagePreview.value = {
    show: false,
    url: ''
  }
}

// ===== FUNCIONES DE UTILIDAD =====
const getUserInitial = (name) => {
  if (!name) return 'U'
  return name.charAt(0).toUpperCase()
}

const formatCompactCurrency = (value) => {
  if (!value) return '0'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}

const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'L. 0'
  return new Intl.NumberFormat('es-HN', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Nunca'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

const getStatusColor = (status) => {
  const colors = {
    activo: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pagado: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    aceptado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    inactivo: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    deshabilitado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
}

const getStatusText = (status) => {
  const statusMap = {
    'activo': 'Activo',
    'inactivo': 'Inactivo',
    'deshabilitado': 'Deshabilitado'
  }
  return statusMap[status] || status
}

const getStatusLabel = (status) => {
  if (!status) return 'Estado'
  if (typeof status === 'string') {
    return getStatusText(status)
  }
  return status.label || getStatusText(status.value)
}

const getRoleLabel = (role) => {
  if (!role) return 'Seleccionar rol'
  if (typeof role === 'string') {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }
  return role.nombre_rol ? 
    role.nombre_rol.charAt(0).toUpperCase() + role.nombre_rol.slice(1) : 
    'Seleccionar rol'
}

const truncateName = (name) => {
  if (!name) return ''
  return name.length > 12 ? name.substring(0, 12) + '...' : name
}

const showToast = (options) => {
  toast.value.show = false
  
  nextTick(() => {
    toast.value = {
      show: true,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 5000
    }
  })
}

const showSuccess = (message) => {
  showToast({
    message,
    type: 'success',
    duration: 3000
  })
}

const showError = (message) => {
  console.error('Error:', message)
  showToast({
    message: typeof message === 'string' ? message : 'Ocurrió un error inesperado',
    type: 'error',
    duration: 5000
  })
}

const resetUserForm = () => {
  userForm.value = {
    id_usuario: null,
    id_ciudad: null,
    id_rol: null,
    rol: null,
    nombre: '',
    identidad: '',
    email: '',
    telefono: '',
    estado: 'activo',
    ciudad: null,
    imagen_url: null,
    identidad_url: null,
    verificado: false
  }
  
  // Resetear campos de contraseña
  newPassword.value = ''
  confirmPassword.value = ''
  isUpdatingPassword.value = false
}



// ===== FUNCIONES DE PAGINACIÓN =====
const changeReferralsPage = (page) => {
  if (page < 1 || page > referralsTotalPages.value) return
  showReferrals(selectedUser.value, page)
}

const changeCreditsPage = async (page) => {
  if (page < 1 || page > creditsTotalPages.value) return
  
  // Hacer nueva petición para la página solicitada
  if (selectedUser.value) {
    await showCredits(selectedUser.value, page)
  }
}

const changeServicesPage = (page) => {
  if (page < 1 || page > servicesTotalPages.value) return
  servicesCurrentPage.value = page
}

const changeTechniciansPage = (page) => {
  if (page < 1 || page > techniciansTotalPages.value) return
  techniciansCurrentPage.value = page
  loadTechnicians(page)
}

const changeAdminsPage = (page) => {
  adminsCurrentPage.value = page
  loadAdministrators(page)
}

// Métodos para manejar los filtros
const clearFilters = () => {
  searchQuery.value = ''
  selectedService.value = null
  selectedCity.value = null
  
  // Reiniciar a la primera página
  usersCurrentPage.value = 1
  adminsCurrentPage.value = 1
  
  // Limpiar caché
  Object.keys(usersCache).forEach(key => delete usersCache[key])
  
  // Recargar usuarios y administradores
  loadUsers(1)
  loadAdministrators(1)
}

const filterReferrals = () => {
  referralsCurrentPage.value = 1
}

const updateServicesFilterDate = (dateString) => {
  if (!dateString) {
    servicesFilterDate.value = ''
    return
  }
  
  // Parse the date string and format it as YYYY-MM-DD
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    servicesFilterDate.value = ''
    return
  }
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  servicesFilterDate.value = `${year}-${month}-${day}`
}

const filterCredits = async () => {
  // Reset to first page and reload credits with the new filter
  creditsCurrentPage.value = 1
  
  // If no month filter is selected, clear any date range and reload with full balance
  if (!creditsFilterMonth.value) {
    if (selectedUser.value) {
      // Clear the credits response to force a full reload
      creditsResponse.value = null
      // Clear any cached data for this user
      Object.keys(creditsCache.value).forEach(key => {
        if (key.startsWith(`user-${selectedUser.value.id_usuario}`)) {
          delete creditsCache.value[key]
        }
      })
       
      try {
        const response = await $api(`/movimientos/creditos/${selectedUser.value.id_usuario}?page=${creditsCurrentPage.value}&limit=${modalItemsPerPage}`, {
          method: 'GET'
        })
        
        if (response && response.success) {
          // Update the creditsResponse with the latest data
          creditsResponse.value = response
          
          // Update the transactions list
          userCreditHistory.value = response.data.map(tx => ({
            id: tx.id_movimiento,
            description: tx.descripcion,
            amount: Math.abs(parseFloat(tx.monto)),
            type: tx.tipo === 'ingreso_referido' ? 'info' : 
                  (['ingreso', 'cashback', 'retiro_referido'].includes(tx.tipo) ? 'credit' : 'debit'),
            status: tx.estado === 'completado' ? 'Completado' : 
                    tx.estado === 'pendiente' ? 'Pendiente' : 'Rechazado',
            reference: 'SIN-REF',
            date: tx.fecha,
            cotizacionData: tx.cotizacion
          }))
          
          // Update pagination
          creditsTotalPages.value = response.pagination?.totalPages || 1
          totalCreditsCount.value = response.pagination?.total || 0
        }
      } catch (error) {
        console.error('Error al cargar el saldo actualizado:', error)
        showError('No se pudo actualizar el saldo')
      }
    }
    return
  }
  
  // Get current date
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() // 0-11
  
  // Parse the selected month and year
  const [year, month] = creditsFilterMonth.value.split('-').map(Number)
  
  // Ensure we have a valid year (in case of invalid input)
  const validYear = year || currentYear
  const validMonth = month || currentMonth + 1 // Convert to 1-12
  
  // Create date range for the selected month
  const startDate = new Date(validYear, validMonth - 1, 1)
  const endDate = new Date(validYear, validMonth, 0) // Last day of the month
  
  // Format dates as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  // Call showCredits with the user and page number
  if (selectedUser.value) {
    showCredits(selectedUser.value, 1, {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    })
  }
}

// ===== FUNCIONES DE MODALES =====
const closeModal = () => {
  showEditModal.value = false
  showPasswordModal.value = false
  showCreditsModal.value = false
  showOfferedServicesModal.value = false
  showVerifyIdentityModal.value = false
  showIdentityViewModal.value = false
  offeredServices.value = []
  resetUserForm()
  selectedUser.value = null
  creditsResponse.value = null
  isEditing.value = false
  isUpdatingPassword.value = false
  if (isDeleting) {
    isDeleting.value = false
  }
} 

const showCredits = async (user, page = 1, dateRange = null) => {
  try {
    // Reset creditsResponse when showing credits for a new user
    if (selectedUser.value?.id_usuario !== user.id_usuario) {
      creditsResponse.value = null
    }
    
    selectedUser.value = user
    creditsCurrentPage.value = page
    
    // Generate cache key including date range
    const cacheKey = dateRange 
      ? `user-${user.id_usuario}-page-${page}-${dateRange.startDate || ''}-${dateRange.endDate || ''}`
      : getCacheKey(user.id_usuario, page, creditsFilterMonth.value)
    
    // Check cache only if not using custom date range
    if (!dateRange && creditsCache.value[cacheKey]) {
      const cachedData = creditsCache.value[cacheKey]
      userCreditHistory.value = cachedData.data
      creditsTotalPages.value = cachedData.pagination?.totalPages || 1
      totalCreditsCount.value = cachedData.pagination?.total || 0
      showCreditsModal.value = true
      return
    }
    
    // Show loading state
    creditsLoading.value = true
    
    // Build query params
    const params = new URLSearchParams({
      page: page.toString(),
      limit: modalItemsPerPage.toString()
    })
    
    // Handle date range
    if (dateRange?.startDate && dateRange?.endDate) {
      params.append('startDate', dateRange.startDate)
      params.append('endDate', dateRange.endDate)
    } 
    // Fall back to month filter if no date range is provided
    else if (creditsFilterMonth.value) {
      const [year, month] = creditsFilterMonth.value.split('-').map(Number)
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0) // Last day of the month
      
      params.append('startDate', startDate.toISOString().split('T')[0])
      params.append('endDate', endDate.toISOString().split('T')[0])
    }
    
    const url = `/movimientos/creditos/${user.id_usuario}?${params.toString()}`
    
    // Make the API request
    const response = await $api(url, {
      method: 'GET'
    })
    
    if (response && response.success) {
      // Store the full response for balance display
      creditsResponse.value = response
      
      // Mapear la respuesta de la API al formato del frontend
      const transactions = response.data.map(tx => {
        // Formatear la descripción según el tipo de transacción
        let description = tx.descripcion;
        let showQuoteButton = false;
        
        // Verificar si es una transacción con cotización
        if (tx.cotizacion) {
          // Si la transacción tiene un monto de mano de obra, asumimos que es una cotización
          if (tx.cotizacion.monto_manodeobra !== undefined) {
            showQuoteButton = true;
          }
        }
        
        // Si es una comisión por referido
        if (tx.descripcion.includes('Comisión por referido')) {
          const nombre = tx.descripcion.split('- ')[1] || '';
          description = `Comisión - ${nombre.trim()}`;
        } 
        // Si es un retiro a cuenta bancaria
        const isWithdrawal = tx.descripcion.includes('Retiro a cuenta bancaria');
        if (isWithdrawal) {
          description = 'Retiro a cuenta';
        }
        
        return {
          id: tx.id_movimiento,
          description: description,
          originalDescription: tx.descripcion, // Guardar la descripción original
          amount: Math.abs(parseFloat(tx.monto)),
          type: tx.tipo === 'ingreso_referido' ? 'info' : 
                (['ingreso', 'cashback', 'retiro_referido'].includes(tx.tipo) ? 'credit' : 'debit'),
          status: tx.estado === 'completado' ? 'Completado' : 
                  tx.estado === 'pendiente' ? 'Pendiente' : 'Rechazado',
          reference: showQuoteButton ? `COT-${tx.id_movimiento}` : 'SIN-REF',
          date: tx.fecha,
          cotizacionData: tx.cotizacion // Guardamos la información de la cotización
        };
      });
      
      // Actualizar la vista
      userCreditHistory.value = transactions;
      
      // Actualizar información de paginación
      creditsTotalPages.value = response.pagination?.totalPages || 1;
      totalCreditsCount.value = response.pagination?.total || 0;
      
      // Save to cache only if not using custom date range
      if (!dateRange) {
        creditsCache.value[cacheKey] = {
          data: [...transactions],
          pagination: {
            totalPages: creditsTotalPages.value,
            total: totalCreditsCount.value
          },
          timestamp: Date.now()
        }
      }
      
      // Limpiar caché antiguo (más de 1 hora)
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      Object.keys(creditsCache.value).forEach(key => {
        if (creditsCache.value[key].timestamp < oneHourAgo) {
          delete creditsCache.value[key];
        }
      });
      
      // Ensure current page doesn't exceed total pages
      if (creditsCurrentPage.value > creditsTotalPages.value) {
        creditsCurrentPage.value = creditsTotalPages.value
      }
      
      // Mostrar el modal después de cargar los datos
      showCreditsModal.value = true
      
      // Desplazarse al inicio del modal
      nextTick(() => {
        const modalContent = document.querySelector('.credits-modal-content')
        if (modalContent) {
          modalContent.scrollTop = 0
        }
      })
      
    } else {
      const errorMessage = response?.error || 'No se pudieron cargar las transacciones de crédito'
      console.error('Error loading credits:', errorMessage)
      showError(errorMessage)
      userCreditHistory.value = []
      creditsTotalPages.value = 1
      totalCreditsCount.value = 0
    }
  } catch (error) {
    console.error('Error al cargar el historial de créditos:', error)
    showError('Error al cargar el historial de créditos. Por favor, intente nuevamente.')
    userCreditHistory.value = []
    creditsTotalPages.value = 1
    totalCreditsCount.value = 0
  } finally {
    creditsLoading.value = false
  }
}

const showReferrals = async (user, page = 1) => {
  try {
    selectedUser.value = user
    
    // Establecer la página actual
    referralsCurrentPage.value = page
    
    // Limpiar referidos anteriores
    userReferrals.value = []
    
    // Mostrar el modal inmediatamente para feedback visual
    showReferralsModal.value = true
    
    // Crear una clave única para el cache (usuario + página)
    const cacheKey = `${user.id_usuario}_${page}`
    
    // Verificar si los datos ya están en caché
    if (referralsCache.value[cacheKey]) {
      const cachedData = referralsCache.value[cacheKey]
      userReferrals.value = cachedData.referrals
      totalReferrals.value = cachedData.total
      referralsTotalPages.value = cachedData.totalPages
      return
    }
    
    // Hacer la petición a la API con paginación
    const response = await $api(`/referidos/${user.id_usuario}`, {
      method: 'GET',
      params: {
        page: page,
        limit: 5
      }
    })
    
    if (response && response.success && Array.isArray(response.data)) {
      // Mapear la respuesta al formato esperado
      userReferrals.value = response.data.map((referral, index) => ({
        id: index + 1,
        name: referral.nombre || `Referido ${index + 1}`,
        email: referral.email || '',
        status: referral.estado,
        createdAt: referral.fecha || new Date().toISOString()
      }))
      
      // Actualizar la información de paginación desde el objeto pagination
      let total = 0
      let totalPages = 1
      
      if (response.pagination) {
        total = response.pagination.total || 0
        totalPages = response.pagination.totalPages || 1
        referralsCurrentPage.value = response.pagination.page || 1
      } else {
        // Fallback en caso de que no venga el objeto pagination
        total = response.data.length
        totalPages = 1
      }
      
      // Almacenar en caché
      const cacheKey = `${user.id_usuario}_${page}`
      referralsCache.value[cacheKey] = {
        referrals: userReferrals.value,
        total: total,
        totalPages: totalPages
      }
      
      // Actualizar los valores reactivos
      totalReferrals.value = total
      referralsTotalPages.value = totalPages 
    } else {
      showError('Error al cargar los referidos: Formato de respuesta inesperado')
    }
  } catch (error) {
    console.error('Error al cargar referidos:', error)
    showError('Error al cargar los referidos. Por favor, intente nuevamente.')
  }
}

const showServiceHistory = async (user) => {
  try {
    selectedUser.value = user
    selectedUserType.value = 'user'
    servicesCurrentPage.value = 1
    servicesFilterDate.value = '' // Reset filter when opening modal
    
    await filterUserServices()
    showServiceHistoryModal.value = true
  } catch (error) {
    console.error('Error al cargar el historial del usuario:', error)
    showError('No se pudieron cargar los servicios del usuario. Intente de nuevo.')
  }
}

const showTechnicianServices = async (technician) => {
  try {
    selectedUser.value = technician
    selectedUserType.value = 'technician'
    servicesCurrentPage.value = 1 
    servicesFilterDate.value = '' // Reset filter when opening modal
    
    await filterServices()
    showServiceHistoryModal.value = true
  } catch (error) {
    console.error('Error al cargar los servicios del técnico:', error)
    showError('No se pudieron cargar los servicios del técnico. Intente de nuevo.')
  } 
}

const showOfferedServices = async (technician) => {
  try {
    selectedUser.value = technician
    loadingOfferedServices.value = true
    showOfferedServicesModal.value = true
    
    const response = await $api(`/tecnicoServicio/${technician.id_usuario}`, {
      method: 'GET'
    })
    
    if (response && response.success) {
      offeredServices.value = response.data
    } else {
      showError(response?.error || 'No se pudieron cargar los servicios ofrecidos')
    }
  } catch (error) {
    console.error('Error al cargar servicios ofrecidos:', error)
    showError('Error al cargar los servicios ofrecidos. Por favor, intente nuevamente.')
  } finally {
    loadingOfferedServices.value = false
  }
}

const showComment = (comment, rating, client) => {
  currentComment.value = comment
  currentRating.value = rating
  currentClient.value = client
  showCommentModal.value = true
}

// ===== FUNCIONES Obtener top 5 tecnicos con mas creditos =====
const showTopTechniciansCredits = async () => {
  try {
    isLoadingTopBalances.value = true
    showTopBalancesModal.value = true
    
    const response = await $api('/movimientos/toptecnicos/creditos', {
      method: 'GET'
    })
    
    if (response && response.success) {
      topBalances.value = response.data.map(tecnico => ({
        name: tecnico.nombre || 'Técnico sin nombre',
        balance: parseFloat(tecnico.saldo_total) || 0
      }))
    } else {
      showError(response?.error || 'No se pudieron cargar los técnicos con más créditos')
    }
  } catch (error) {
    console.error('Error al cargar los técnicos con más créditos:', error)
    showError(`Error: ${error.message || 'No se pudieron cargar los técnicos con más créditos'}`)
  } finally {
    isLoadingTopBalances.value = false
  }
}

const showTopCredits = async () => {
  try {
    isLoadingTopBalances.value = true
    showTopCreditsModal.value = true
    
    // Obtener el ID del rol de Usuario
    const rolesResponse = await $api('/roles', {
      method: 'GET'
    })
    
    const rolUsuario = Array.isArray(rolesResponse) 
      ? rolesResponse.find(r => r.nombre_rol.toLowerCase() === 'usuario')
      : null
    
    if (!rolUsuario) {
      throw new Error('No se encontró el rol de Usuario')
    }
    
    const response = await $api('/credito/tops', {
      method: 'GET',
      params: {
        id_rol: rolUsuario.id_rol
      }
    })
    
    if (response && response.success) {
      topBalances.value = response.data.map(usuario => ({ 
        name: usuario.nombre || 'Usuario sin nombre',
        email: '', 
        city: usuario.ciudad || 'Sin ciudad',
        balance: parseFloat(usuario.monto_credito) || 0
      }))
    } else {
      showError(response?.error || 'No se pudieron cargar los usuarios con más crédito')
    }
  } catch (error) {
    console.error('Error al cargar los usuarios con más crédito:', error)
    showError(`Error: ${error.message || 'No se pudieron cargar los usuarios con más crédito'}`)
  } finally {
    isLoadingTopBalances.value = false
  }
}

const showTopReferrals = async () => {
  try {
    isLoadingTopReferrals.value = true
    showTopReferralsModal.value = true
    
    const [referralsResponse, earningsResponse] = await Promise.all([
      $api('/referidos/top/usuarios', { method: 'GET' }),
      $api('/movimientos/referidos/top/ingresos', { method: 'GET' })
    ])

    if (referralsResponse && referralsResponse.success) {
      topReferrals.value = referralsResponse.data.map(item => ({
        name: item.nombre,
        city: item.ciudad,
        total: item.cantidad_referidos
      }))
    }

    if (earningsResponse && earningsResponse.success) {
      topEarnings.value = earningsResponse.data.map(item => ({
        name: item.name,
        city: item.city,
        total: item.total
      }))
    }
  } catch (error) {
    console.error('Error al cargar rankings de referidos:', error)
    showError(`Error: ${error.message || 'No se pudieron cargar los rankings'}`)
  } finally {
    isLoadingTopReferrals.value = false
  }
}

const showTopBalances = async () => {
  try {
    isLoadingTopBalances.value = true
    showTopBalancesModal.value = true
    
    // Obtener el ID del rol de Técnico
    const rolesResponse = await $api('/roles', {
      method: 'GET'
    })
    
    const rolTecnico = Array.isArray(rolesResponse) 
      ? rolesResponse.find(r => r.nombre_rol.toLowerCase() === 'tecnico')
      : null
    
    if (!rolTecnico) {
      throw new Error('No se encontró el rol de Técnico')
    }
    
    const response = await $api('/credito/tops', {
      method: 'GET',
      params: {
        id_rol: rolTecnico.id_rol
      }
    })
    
    if (response && response.success) {
      topBalances.value = response.data.map(tecnico => ({
        id: tecnico.nombre,
        name: tecnico.nombre,
        city: tecnico.ciudad,
        balance: parseFloat(tecnico.monto_credito) || 0
      }))
    } else {
      showError(response?.error || 'No se pudieron cargar los técnicos con más crédito')
    }
  } catch (error) {
    console.error('Error al cargar los técnicos con más crédito:', error)
    showError(`Error: ${error.message || 'No se pudieron cargar los técnicos con más crédito'}`)
  } finally {
    isLoadingTopBalances.value = false
  }
}

const showTopRatings = async () => {
  try {
    isLoadingTopRatings.value = true
    showTopRatingsModal.value = true
    
    const response = await $api('/calificaciones/top-tecnicos', {
      method: 'GET'
    })

    if (response.success) {
      topRatings.value = response.data.map(tecnico => ({
        id: tecnico.id_usuario,
        name: tecnico.nombre,
        city: tecnico.ciudad,
        rating: parseFloat(tecnico.promedio_calificacion),
        reviews: tecnico.total_calificaciones
      }))
    } else {
      showError('No se pudieron cargar los técnicos mejor calificados')
    }
  } catch (error) {
    console.error('Error al obtener los técnicos mejor calificados:', error)
    showError('Error al cargar los técnicos mejor calificados')
  } finally {
    isLoadingTopRatings.value = false
  }
}

// Watch for search query changes
watch(searchQuery, debounce((newQuery) => {
  if (newQuery !== undefined) {
    loadUsers(1) // Reiniciar a la primera página al buscar
  }
}, 500))

// Watch for changes in the selected role to keep id_rol in sync
watch(() => userForm.value.rol, (newRole) => {
  if (newRole && newRole.id_rol) {
    userForm.value.id_rol = newRole.id_rol
  }
}, { deep: true })

const loadMembresiaProgreso = async (idUsuario) => {
  try {
    loadingMembresiaProgreso.value = true
    const response = await $api(`/membresia/progreso/${idUsuario}`, {
      method: 'GET'
    })
    
    if (response.status === 'success') {
      membresiaProgreso.value = {
        status: response.status,
        mesesProgreso: response.mesesProgreso,
        montoTotal: response.montoTotal,
        valorMembresia: response.valorMembresia
      }
    }
  } catch (error) {
    console.error('Error cargando progreso de membresía:', error)
    membresiaProgreso.value = {
      status: 'error',
      mesesProgreso: 0,
      montoTotal: 0,
      valorMembresia: '0'
    }
  } finally {
    loadingMembresiaProgreso.value = false
  }
}

const editUser = (user) => {
  // Establecer el usuario seleccionado primero
  selectedUser.value = user;
  
  // Encontrar el rol por nombre
  const roleName = user.rol?.nombre_rol || user.rol
  let userRole = null
  
  if (roleName) {
    // Find the role by name in the roles list to get the full role object with ID
    userRole = roles.value.find(r => 
      (r.nombre_rol && r.nombre_rol.toLowerCase() === roleName.toLowerCase()) ||
      (r.nombre && r.nombre.toLowerCase() === roleName.toLowerCase())
    )
  }
  
  // If we still don't have a role, try to get it from the user's ID if available
  if (!userRole && user.id_rol) {
    userRole = roles.value.find(r => r.id_rol === user.id_rol) || null
  }

  // Mapear los campos del usuario al formulario
  userForm.value = {
    id_usuario: user.id_usuario || user.id,
    id_ciudad: user.id_ciudad || null,
    id_rol: userRole?.id_rol || user.id_rol || null,
    rol: userRole || { 
      id_rol: user.id_rol,
      nombre_rol: roleName || '' 
    },
    nombre: user.nombre || user.name || '',
    identidad: user.identidad || '',
    email: user.email || '',
    telefono: user.telefono || user.phone || '',
    estado: user.estado || user.status || 'activo',
    ciudad: user.ciudad || null,
    fecha_registro: user.fecha_registro || null,
    imagen_url: user.imagen_url || null,
    identidad_url: user.identidad_url || null,
    verificado: user.verificado || false
  }

  showEditModal.value = true
  
  // Cargar progreso de membresía si el usuario tiene rol de cliente
  const userId = user.id_usuario || user.id
  if (userId) {
    loadMembresiaProgreso(userId)
  }
}

const saveUser = async () => {
  try {
    isSaving.value = true;
    
    // Asegurarse de que tenemos un rol seleccionado
    if (!userForm.value.rol) {
      showError('Por favor selecciona un rol');
      isSaving.value = false;
      return;
    }

    // Obtener el ID del rol del objeto de rol seleccionado
    const roleId = userForm.value.rol.id_rol || userForm.value.rol.value;
    
    if (!roleId) {
      showError('No se pudo determinar el ID del rol seleccionado');
      isSaving.value = false;
      return;
    }

    // Obtener el nombre del rol
    const selectedRole = roles.value.find(r => r.id_rol === parseInt(roleId));
    if (!selectedRole) {
      showError('El rol seleccionado no es válido');
      isSaving.value = false;
      return;
    }

    // Preparar los datos para enviar
    const userData = { 
      id_rol: parseInt(roleId),
      estado: typeof userForm.value.estado === 'object' 
        ? userForm.value.estado.value 
        : userForm.value.estado
    };

    const response = await $api(`usuarios/${userForm.value.id_usuario}`, {
      method: 'PUT',
      body: userData
    });

    // Función para actualizar el usuario en una lista
    const updateUserInList = (list) => {
      return list.map(user => {
        if (user.id_usuario === userForm.value.id_usuario) {
          return {
            ...user,
            id_rol: parseInt(roleId),
            rol: {
              id_rol: parseInt(roleId),
              nombre_rol: selectedRole.nombre_rol
            },
            estado: userData.estado
          };
        }
        return user;
      });
    };

    // Actualizar las listas reactivas
    users.value = updateUserInList(users.value);
    technicians.value = updateUserInList(technicians.value);
    administrators.value = updateUserInList(administrators.value);

    // Forzar actualización de la UI
    await nextTick();

    // Cerrar el modal
    closeModal();

    // Limpiar la cache de usuarios y técnicos
    for (const key in usersCache) {
      delete usersCache[key];
    }
    for (const key in techniciansCache) {
      delete techniciansCache[key];
    }

    // Recargar los datos del servidor para asegurar consistencia
    await Promise.all([
      loadUsers(usersCurrentPage.value),
      loadTechnicians(techniciansCurrentPage.value),
      loadAdministrators(adminsCurrentPage.value) 
    ]);

    showSuccess(`Usuario actualizado correctamente`);
    
  } catch (error) {
    console.error('Error al actualizar el usuario:', {
      error: error,
      response: error.data,
      message: error.message
    });
    const errorMessage = error.data?.message || 'Error al actualizar el usuario';
    showError(errorMessage);
  } finally {
    isSaving.value = false;
  }
};

// Confirmar eliminación de usuario
const confirmDeleteUser = (user) => {
  if (!user) return
  
  const userName = user.nombre || 'este usuario'
  if (confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${userName}? Esta acción no se puede deshacer y borrará todos sus datos asociados.`)) {
    deleteUser(user.id_usuario || user.id)
  }
}

// Eliminar usuario permanentemente
const deleteUser = async (userId) => {
  if (!userId) {
    showError('No se pudo identificar al usuario para eliminar')
    return
  }

  try {
    isDeleting.value = true
    
    const response = await $api(`/usuarios/${userId}`, {
      method: 'DELETE'
    })
    
    if (response) {
      showSuccess('Usuario eliminado exitosamente')
      
      // Cerrar el modal de edición si estaba abierto para este usuario
      if (showEditModal.value && userForm.value.id_usuario === userId) {
        closeModal()
      }
      
      // Limpiar caches
      Object.keys(usersCache).forEach(key => delete usersCache[key])
      Object.keys(techniciansCache).forEach(key => delete techniciansCache[key])
      
      // Recargar todas las listas para reflejar el cambio
      await Promise.all([
        loadUsers(usersCurrentPage.value),
        loadTechnicians(techniciansCurrentPage.value),
        loadAdministrators(adminsCurrentPage.value),
        fetchStatistics()
      ])
      
    } else {
      showError('No se pudo eliminar el usuario')
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    const errorMessage = error.data?.message || 'Error al intentar eliminar el usuario'
    showError(errorMessage)
  } finally {
    isDeleting.value = false
  }
}

// Función para cargar usuarios pendientes de verificación
const loadPendingVerificationUsers = async () => {
  try {
    loadingPendingVerification.value = true
    const response = await $api('/usuarios/pendientes-verificar', {
      method: 'GET'
    })
    
    if (response.success) {
      pendingVerificationUsers.value = response.data || []
    }
  } catch (error) {
    console.error('Error al cargar usuarios pendientes de verificación:', error)
  } finally {
    loadingPendingVerification.value = false
  }
}

// Abrir el modal de verificación para el siguiente usuario
const openNextPendingVerification = () => {
  if (pendingVerificationUsers.value.length > 0) {
    const userToVerify = pendingVerificationUsers.value[0]
    
    userForm.value = {
      ...userForm.value,
      id_usuario: userToVerify.id_usuario,
      nombre: userToVerify.nombre,
      identidad: userToVerify.identidad,
      email: userToVerify.email,
      identidad_url: userToVerify.identidad_url,
      verificado: false
    }
    
    showVerifyIdentityModal.value = true
  }
}

// Verificar identidad del usuario
const verifyIdentity = async () => {
  try {
    isVerifyingIdentity.value = true;
    
    await $api(`usuarios/${userForm.value.id_usuario}`, {
      method: 'PUT',
      body: {
        verificado: true
      }
    });
    
    userForm.value.verificado = true;
    showSuccess('Identidad verificada exitosamente');
    
    // Actualizar al usuario en las listas
    updateUserVerificationInLists(userForm.value.id_usuario, true, userForm.value.identidad_url);
    
    // Enviar notificación de éxito
    try {
      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: {
          titulo: 'Identidad Verificada',
          id_usuario: userForm.value.id_usuario,
          tipo: 'verificacion'
        }
      });
    } catch (notifError) {
      console.error('Error al enviar notificación:', notifError);
    }
    
    showVerifyIdentityModal.value = false;
    loadPendingVerificationUsers();
  } catch (error) {
    console.error('Error al verificar identidad:', error);
    showError(error.data?.message || 'Error al verificar la identidad');
  } finally {
    isVerifyingIdentity.value = false;
  }
};

const rejectIdentity = async () => {
  try {
    isVerifyingIdentity.value = true;
    
    await $api(`usuarios/identidad-foto/${userForm.value.id_usuario}`, {
      method: 'DELETE'
    });
    
    userForm.value.verificado = false;
    userForm.value.identidad_url = null;
    showSuccess('Fotografía de identidad borrada y validación revocada');
    
    // Actualizar al usuario en las listas
    updateUserVerificationInLists(userForm.value.id_usuario, false, null);
    
    // Enviar notificación de rechazo
    try {
      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: {
          titulo: 'Verificación Fallida',
          id_usuario: userForm.value.id_usuario,
          tipo: 'verificacion'
        }
      });
    } catch (notifError) {
      console.error('Error al enviar notificación:', notifError);
    }
    
    showVerifyIdentityModal.value = false;
    loadPendingVerificationUsers();
  } catch (error) {
    console.error('Error al rechazar identidad:', error);
    showError(error.data?.message || 'Error al borrar identidad');
  } finally {
    isVerifyingIdentity.value = false;
  }
};

const updateUserVerificationInLists = (userId, verificado, identidad_url) => {
  const updateFn = (list) => {
    return list.map(user => {
      if (user.id_usuario === userId || user.id === userId) {
        return { ...user, verificado, identidad_url };
      }
      return user;
    });
  };

  users.value = updateFn(users.value);
  technicians.value = updateFn(technicians.value);
  administrators.value = updateFn(administrators.value);
};

// Actualizar la contraseña del usuario
const updateUserPassword = async () => {
  try {
    isSaving.value = true
    
    // Validar que las contraseñas coincidan
    if (newPassword.value !== confirmPassword.value) {
      showError('Las contraseñas no coinciden')
      return
    }
    
    // Validar longitud mínima de la contraseña
    if (newPassword.value.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    // Llamar a la API para actualizar la contraseña
    await $api(`usuarios/${userForm.value.id_usuario}/cambiar-clave`, {
      method: 'PUT',
      body: {
        nuevaClave: newPassword.value
      }
    })
    
    // Mostrar mensaje de éxito
    showSuccess('Contraseña actualizada correctamente')
    
    // Cerrar el modal y limpiar los campos
    showPasswordModal.value = false
    newPassword.value = ''
    confirmPassword.value = ''
    
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error)
    const errorMessage = error.data?.message || 'Error al actualizar la contraseña'
    showError(errorMessage)
  } finally {
    isSaving.value = false
  }
}

// ===== FUNCIONES PARA CARGAR DATOS DE APIS ===== 

// Función para cargar usuarios desde la API con filtros aplicados en backend
const loadUsers = async (page = 1) => {
  try {
    loadingUsers.value = true
    
    // Generar clave de caché que incluya filtros
    const filtersKey = JSON.stringify({ 
      search: searchQuery.value || '',
      service: selectedService.value?.id_servicio || '',
      city: selectedCity.value?.value || ''
    })
    const cacheKey = `${page}_${filtersKey}`
    
    // Verificar si ya tenemos la página con estos filtros en caché
    if (usersCache[cacheKey]) {
      const cachedData = usersCache[cacheKey]
      users.value = cachedData.usuarios
      hasMoreUsers.value = cachedData.hasMore
      totalUsers.value = cachedData.total
      usersCurrentPage.value = page
      return cachedData
    }
    
    // Pedir un elemento extra para ver si hay más páginas
    const limit = itemsPerPage + 1
    const offset = (page - 1) * itemsPerPage
    
    // Construir parámetros de consulta con filtros
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    }) 
    
    // Agregar búsqueda por nombre si existe
    if (searchQuery.value) {
      params.append('nombre', searchQuery.value)
    }
    
    if (selectedService.value?.id_servicio) {
      params.append('id_servicio', selectedService.value.id_servicio.toString())
    }
    
    if (selectedCity.value?.value) {
      // Buscar el ID de la ciudad por nombre
      const ciudad = availableCities.value.find(c => c.nombre_ciudad === selectedCity.value.value)
      if (ciudad) {
        params.append('id_ciudad', ciudad.id_ciudad.toString())
      }
    }
    
    const response = await $api(`/usuarios/usuarios?${params.toString()}`, {
      method: 'GET'
    })
    
    if (response && response.usuarios) {
      // Verificar si hay más páginas disponibles
      const hasMore = response.usuarios.length > itemsPerPage
      
      // Tomar solo los elementos necesarios (el último es solo para verificar)
      const usuariosAMostrar = hasMore 
        ? response.usuarios.slice(0, -1) 
        : response.usuarios
      
      // Actualizar la lista de usuarios
      users.value = usuariosAMostrar
      hasMoreUsers.value = hasMore
      totalUsers.value = response.total || 0
      usersCurrentPage.value = page
      
      // Guardar en caché con la clave que incluye filtros
      usersCache[cacheKey] = {
        usuarios: usuariosAMostrar,
        hasMore,
        total: response.total || 0
      }
      
      // Calcular estadísticas con los usuarios actuales
      const usuariosActivos = usuariosAMostrar.filter(u => u.rol?.nombre_rol?.toLowerCase() === 'usuario')
      stats.value.totalReferrals = usuariosActivos.reduce((sum, u) => sum + (u.total_referidos || 0), 0)
      stats.value.totalCredits = usuariosActivos.reduce((sum, u) => sum + ((u.credito?.monto || 0)), 0)
    }
    
    return response
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
    showError('No se pudieron cargar los usuarios')
    return { usuarios: [], total: 0 }
  } finally {
    loadingUsers.value = false
    loadingMoreUsers.value = false
  }
}

// Función para cargar técnicos desde la API con filtros
const loadTechnicians = async (page = 1) => {
  try {
    loadingTechnicians.value = true
    const offset = (page - 1) * techniciansPerPage.value
    
    // Generar clave de caché que incluya filtros
    const filtersKey = JSON.stringify({ 
      search: searchQuery.value || '',
      service: selectedService.value?.id_servicio || '',
      city: selectedCity.value?.id || selectedCity.value?.value || selectedCity.value || ''
    })
    const cacheKey = `${page}_${filtersKey}`
    
    // Verificar si ya tenemos la página con estos filtros en caché
    if (techniciansCache[cacheKey]) {
      const cachedData = techniciansCache[cacheKey]
      technicians.value = cachedData.tecnicos
      totalTechnicians.value = cachedData.total
      techniciansCurrentPage.value = page
      return cachedData
    }
    
    // Construir parámetros con filtros
    const params = new URLSearchParams({
      limit: techniciansPerPage.value.toString(),
      offset: offset.toString()
    })
    
    // Agregar filtros si están definidos
    if (searchQuery.value) {
      params.append('nombre', searchQuery.value)
    }
    
    // Manejar el filtro de servicio
    if (selectedService.value?.id_servicio) {
      params.append('id_servicio', selectedService.value.id_servicio.toString())
    }
    
    // Manejar el filtro de ciudad
    if (selectedCity.value) {
      if (typeof selectedCity.value === 'object' && selectedCity.value.id) {
        params.append('id_ciudad', selectedCity.value.id.toString())
      } else if (selectedCity.value?.value) {
        // Buscar el ID de la ciudad por nombre
        const ciudad = availableCities.value.find(c => c.nombre_ciudad === selectedCity.value.value)
        if (ciudad) {
          params.append('id_ciudad', ciudad.id_ciudad.toString())
        }
      } else if (typeof selectedCity.value === 'string' || typeof selectedCity.value === 'number') {
        params.append('id_ciudad', selectedCity.value.toString())
      }
    }

    const response = await $api(`/usuarios/tecnicos?${params.toString()}`, {
      method: 'GET'
    })

    // Guardar en caché
    techniciansCache[cacheKey] = {
      tecnicos: response.data || [],
      total: response.total || 0
    }

    technicians.value = response.data || []
    totalTechnicians.value = response.total || 0
    techniciansCurrentPage.value = page
    return response
  } catch (error) {
    console.error('Error al cargar técnicos:', error)
    showError('No se pudieron cargar los técnicos')
    return { tecnicos: [], total: 0 }
  } finally {
    loadingTechnicians.value = false
  }
}

// Función para cargar administradores con filtros
const loadAdministrators = async (page = 1) => {
  try {
    loadingUsers.value = true
    const limit = adminsItemsPerPage
    const offset = (page - 1) * limit

    // Construir objeto de consulta con los filtros actuales
    const query = {
      limit,
      offset,
      ...(searchQuery.value && { nombre: searchQuery.value })
    }
    
    // Manejar el filtro de servicio
    if (selectedService.value?.id_servicio) {
      query.id_servicio = selectedService.value.id_servicio
    }
    
    // Manejar el filtro de ciudad
    if (selectedCity.value) {
      if (typeof selectedCity.value === 'object' && selectedCity.value.id) {
        query.id_ciudad = selectedCity.value.id
      } else if (typeof selectedCity.value === 'string' || typeof selectedCity.value === 'number') {
        query.id_ciudad = selectedCity.value
      }
    }
    
    // Eliminar propiedades vacías del query
    Object.keys(query).forEach(key => {
      if (query[key] === '' || query[key] === null || query[key] === undefined) {
        delete query[key]
      }
    })

    const queryString = new URLSearchParams(query).toString()
    const url = `/usuarios/administradores?${queryString}`

    const response = await $api(url, {
      method: 'GET'
    })

    if (response.success) {
      administrators.value = response.administradores || []
      totalAdmins.value = response.total || 0
      adminsCurrentPage.value = page
    } else {
      console.error('❌ Error in response:', response.error || 'Unknown error')
      showError('Error al cargar los administradores')
    }
  } catch (error) {
    console.error('Error al cargar administradores:', error)
    showError('No se pudieron cargar los administradores')
    } finally {
    loadingUsers.value = false
  }
}

const loadServices = async () => {
  try {
    loadingServices.value = true
    const response = await $api('/servicios/activos', {
      method: 'GET'
    })
    
    availableServices.value = Array.isArray(response) ? response : (response?.data || [])
      
    return availableServices.value
  } catch (error) {
    console.error('Error al cargar servicios:', error)
    showError('No se pudieron cargar los servicios')
    return []
  } finally {
    loadingServices.value = false
  }
}

const loadCities = async () => {
  try {
    loadingCities.value = true
    const response = await $api('/ciudad', {
      method: 'GET'
    })
    
    availableCities.value = Array.isArray(response) 
      ? response.map(ciudad => ({
          id_ciudad: ciudad.id_ciudad,
          nombre_ciudad: ciudad.nombre_ciudad
        }))
      : []
      
    return availableCities.value
  } catch (error) {
    console.error('Error al cargar ciudades:', error)
    showError('No se pudieron cargar las ciudades')
    return []
  } finally {
    loadingCities.value = false
  }
}

const loadRoles = async () => {
  try {
    loadingRoles.value = true
    
    // Cargar roles desde la API siguiendo el estándar de peticiones HTTP del proyecto
    const response = await $api('/roles', {
      method: 'GET'
    })

    // Verificar si la respuesta es un array (formato directo) o un objeto con propiedad data
    if (Array.isArray(response)) {
      roles.value = response
    } else if (response?.data && Array.isArray(response.data)) {
      roles.value = response.data
    } else if (response?.success && Array.isArray(response.data)) {
      roles.value = response.data
    } 
     
  } catch (error) {
    console.error('Error al cargar roles:', error)
    showError(`Error al cargar roles: ${error.message || 'Intente nuevamente'}`)
    
  } finally {
    loadingRoles.value = false
  }
}

const fetchStatistics = async () => {
  try {
    loadingStats.value = true
    const response = await $api('/usuarios/estadisticas', {
      method: 'GET'
    })

    if (response.success && response.data) {
      stats.value = {
        totalUsuarios: response.data.totalUsuarios || 0,
        totalReferidos: response.data.totalReferidos || 0,
        totalCreditos: response.data.totalCreditos || 0
      }
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
    showError('No se pudieron cargar las estadísticas')
    } finally {
    loadingStats.value = false
  }
}

// Función para desactivar todos los técnicos activos
const deactivateTechnicians = async () => {
  if (!confirm('¿Estás seguro de que deseas poner a todos los técnicos ACTIVOS en estado INACTIVO?\nEsta acción afectará a todos los técnicos del sistema.')) return
  
  try {
    deactivatingTechnicians.value = true
    
    // 1. Obtener todos los técnicos activos
    // Usamos un límite alto para asegurarnos de capturar a todos
    const response = await $api('/usuarios/tecnicos?limit=2000', {
      method: 'GET'
    })
    
    if (!response || !response.data) {
      showError('No se pudo obtener la lista de técnicos')
      return
    }
    
    const activeTechnicians = response.data.filter(t => (t.estado || 'activo') === 'activo')
    
    if (activeTechnicians.length === 0) {
      showSuccess('No se encontraron técnicos activos para desactivar')
      return
    }
    
    // 2. Desactivar cada uno
    // Usamos Promise.all para mayor rapidez, pero si son demasiados podría saturar
    // Si hay más de 50, tal vez convenga hacerlo en bloques, pero por ahora vamos así
    const updates = activeTechnicians.map(t => 
      $api(`usuarios/${t.id_usuario}`, {
        method: 'PUT',
        body: { estado: 'inactivo' }
      })
    )
    
    await Promise.all(updates)
    
    // 3. Limpiar caché y recargar
    for (const key in techniciansCache) {
      delete techniciansCache[key]
    }
    
    await loadTechnicians(1)
    await fetchStatistics()
    
    showSuccess(`${activeTechnicians.length} técnicos han sido puestos en estado Inactivo`)
    
  } catch (error) {
    console.error('Error deactivating technicians:', error)
    showError('Error al desactivar los técnicos. Por favor, intente nuevamente.')
  } finally {
    deactivatingTechnicians.value = false
  }
}

// ===== INICIALIZACIÓN =====
onMounted(async () => {
  try {
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) {
      window.location.reload()
      return
    }

    await Promise.all([
      loadRoles(),
      loadUsers(),
      loadTechnicians(),
      loadAdministrators(),
      loadCities(),
      loadServices(),
      fetchStatistics(),
      loadPendingVerificationUsers()
    ])
  } catch (error) {
    window.location.reload()
  } finally {
    isLoading.value = false
  }
})
</script>