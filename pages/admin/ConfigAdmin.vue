<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <!-- Header -->
    <HeadersHeaderConfigAdmin />
    
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
    />

    <!-- Contenido Principal -->
    <div v-if="!isLoading" class="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-10 sm:pb-32">
      
      <!-- Header Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-start sm:items-center space-x-3 sm:space-x-4">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <span class="text-2xl sm:text-3xl">⚙️</span>
            </div>
            <div class="min-w-0 flex-1">
              <h1 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                Configuración del Sistema
              </h1>
              <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                Administra las configuraciones principales de MiSeguro
              </p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              @click="guardarConfiguraciones"
              :disabled="isSaving || !hayChanges"
              class="w-full sm:w-auto px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <div class="flex items-center justify-center">
                <div v-if="!isSaving" class="mr-2"></div>
                <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
              </div>
            </button>
          </div>
        </div> 
      </div>

      <!-- Configuration Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20 lg:mb-24">
        
        <!-- Card 1: Precios y Tarifas -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div class="flex items-center mb-4 sm:mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <span class="text-lg sm:text-2xl">💰</span>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                Precios y Tarifas
              </h3>
              <p class="text-[11px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                Configuración de precios
              </p>
            </div>
          </div>

          <div class="space-y-4 sm:space-y-5">
            <!-- Membresía -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio de Membresía
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">L.</span>
                <input
                  v-model.number="configuracionMembresia"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full pl-8 pr-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="250.00">
              </div>
            </div>

            <!-- Visita Técnica -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio de Visita Técnica
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">L.</span>
                <input
                  v-model.number="configuracionVisita"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full pl-8 pr-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="150.00">
              </div>
            </div>

            <!-- Monto Mínimo de Retiro -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto Mínimo de Retiro
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">L.</span>
                <input
                  v-model.number="configuracionRetiroMinimo"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full pl-8 pr-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="500.00">
              </div>
            </div>

            <!-- Período de Gracia para Créditos -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Días de Gracia para Créditos
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">📅</span>
                <input
                  v-model.number="configuracionDiasGracia"
                  type="number"
                  min="1"
                  step="1"
                  class="w-full pl-10 pr-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="14">
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Días de gracia después de vencida la membresía
              </p>
            </div>
          </div>
        </div>

        <!-- Card 2: Información de Empresa -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div class="flex items-center mb-4 sm:mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <span class="text-lg sm:text-2xl">🏢</span>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                Información de Empresa
              </h3>
              <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                Datos de contacto empresarial
              </p>
            </div>
          </div>

          <div class="space-y-4 sm:space-y-5">
            <!-- Teléfono -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Empresa
              </label>
              <input
                v-model="configuracionTelefono"
                type="text"
                class="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="99866626">
            </div>

            <!-- RTN -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                RTN de Empresa
              </label>
              <input
                v-model="configuracionRTN"
                type="text"
                class="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="XXXX-XXXX-XXXXXX">
            </div>

            <!-- Email -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo de Empresa
              </label>
              <input
                v-model="configuracionEmail"
                type="email"
                class="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="MiSeguro@gmail.com">
            </div>

            <!-- Referente Predeterminado -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300">
                  Referente Predeterminado
                </label>
                <button 
                  @click="abrirModalBuscarUsuario"
                  type="button"
                  class="-mt-1 -mr-1 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <span v-if="referidorPredeterminado" class="text-gray-900 dark:text-white">
                  {{ referidorPredeterminado.nombre || 'Sin nombre' }}
                </span>
                <span v-else class="text-gray-500 dark:text-gray-400">
                  No se ha configurado un referente predeterminado
                </span>
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Este es el usuario que se asigna por defecto cuando un nuevo usuario se registra sin código de referido
              </p>
            </div> 
          </div>
        </div>

        <!-- Card 3: Porcentajes del Sistema -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div class="flex items-center mb-4 sm:mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <span class="text-lg sm:text-2xl">📊</span>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                Porcentajes del Sistema
              </h3>
              <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                Configuración de comisiones
              </p>
            </div>
          </div>

          <div class="space-y-4 sm:space-y-5">
            <!-- Comisión por Servicio -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comisión por Servicio
              </label>
              <div class="relative">
                <input
                  v-model.number="configuracionComision"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  class="w-full pl-4 pr-10 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="10.00">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
            </div>

            <!-- Comisión por Paquete -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comisión por Paquete
              </label>
              <div class="relative">
                <input
                  v-model.number="configuracionComisionPaquete"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  class="w-full pl-4 pr-10 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="10.00">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
            </div>

            <!-- Descuento -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cashback por Membresía
              </label>
              <div class="relative">
                <input
                  v-model.number="configuracionDescuento"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full pl-4 pr-8 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="10">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
            </div>

            <!-- Descuento Especial -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cashback por Membresía Especial
              </label>
              <div class="relative">
                <input
                  v-model.number="configuracionDescuentoEspecial"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full pl-4 pr-8 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="15">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
            </div>

            <!-- Referido -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ganancia por Referido
              </label>
              <div class="relative">
                <input
                  v-model.number="configuracionReferido"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full pl-4 pr-8 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="10">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
            </div>

            <!-- Referido Paquete -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ganancia por Referido Paquete
              </label>
              <div class="relative">
                <input
                  v-model.number="configuracionReferidoPaquete"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full pl-4 pr-8 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="10">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
            </div>

            <!-- Retiro -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Porcentaje de Retiro
              </label>
              <div class="relative">
                <input
                  v-model.number="configuracionRetiro"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full pl-4 pr-8 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="99">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 4: Gestión de Cuentas Bancarias -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:col-span-2 xl:col-span-3">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 dark:bg-teal-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span class="text-lg sm:text-2xl">🏦</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Gestión de Cuentas Bancarias
                </h3>
                <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                  Administra las cuentas bancarias para retiros
                </p>
              </div>
            </div>
            <button 
              @click="nuevaCuenta()"
              class="px-4 py-2 text-sm bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors">
              + Nueva
            </button>
          </div>

          <!-- Filtros y búsqueda -->
          <div class="mb-4 sm:mb-6 flex flex-row gap-2 sm:gap-4">
            <div class="relative flex-1 min-w-0">
              <input
                v-model="filtroBusquedaCuentas"
                type="text"
                placeholder="Buscar cuentas..."
                class="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base transition-all"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Grid de cuentas bancarias -->
          <div v-if="cuentasCargando" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p>Cargando cuentas...</p>
          </div>
          
          <div v-else-if="cuentasFiltradas.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <span class="text-4xl mb-2 block">🏦</span>
            <p>No se encontraron cuentas bancarias</p>
          </div>
          
          <!-- Grid 2x2 incluso en móvil -->
          <div v-else class="grid grid-cols-2 gap-3 sm:gap-4">
            <div v-for="cuenta in cuentasPaginadas" :key="cuenta.id_cuenta" 
                 @click="abrirDetallesCuenta(cuenta)"
                 :class="{
                   'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 hover:border-green-300 dark:hover:border-green-600': cuenta.activo,
                   'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 hover:border-red-300 dark:hover:border-pink-600': !cuenta.activo
                 }"
                 class="cursor-pointer rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 min-h-[120px] sm:min-h-[140px] flex flex-col justify-between">
              
              <!-- Header de la tarjeta -->
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-sm">🏦</span>
                  </div>
                  <div class="min-w-0">
                    <h5 class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {{ cuenta.banco }}
                    </h5>
                  </div>
                </div>
               
              </div>

              <!-- Información de la cuenta -->
              <div class="space-y-1.5 flex-1">
                <div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">Número de cuenta</p>
                  <p class="text-xs sm:text-sm font-mono text-gray-900 dark:text-white truncate">{{ cuenta.num_cuenta }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">Tipo</p>
                  <p class="text-xs sm:text-sm text-gray-900 dark:text-white truncate">{{ cuenta.tipo }}</p>
                </div>
              </div>

              <!-- Footer de la tarjeta -->
              <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  ID: {{ cuenta.beneficiario }}
                </p>
              </div>
            </div>
          </div>

          <!-- Paginación para cuentas -->
          <div v-if="cuentasFiltradas.length > 0" class="mt-4 bg-white dark:bg-gray-800 p-2 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Página {{ paginacionCuentas.paginaActual }} de {{ paginacionCuentasCalculada.totalPaginas }}
              </div>
              <div class="flex items-center space-x-1">
                <button 
                  @click="$event => cambiarPaginaCuentas(paginacionCuentas.paginaActual - 1, $event)" 
                  :disabled="paginacionCuentas.paginaActual === 1 || cuentasCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ paginacionCuentas.paginaActual }} / {{ paginacionCuentasCalculada.totalPaginas }}
                </span>
                <button 
                  @click="$event => cambiarPaginaCuentas(paginacionCuentas.paginaActual + 1, $event)" 
                  :disabled="paginacionCuentas.paginaActual >= paginacionCuentasCalculada.totalPaginas || cuentasCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 5: Beneficios de Membresía -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:col-span-2 xl:col-span-3">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span class="text-lg sm:text-2xl">🎁</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Beneficios de Membresía
                </h3>
                <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                  Administra los beneficios disponibles para miembros de MiSeguro
                </p>
              </div>
            </div>
            <button 
              @click="nuevoBeneficio()"
              class="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
              + Nuevo
            </button>
          </div>

          <!-- Filtros y búsqueda -->
          <div class="mb-4 sm:mb-6 flex flex-row gap-2 sm:gap-4">
            <div class="relative flex-1 min-w-0">
              <input
                v-model="filtroBusquedaBeneficios"
                type="text"
                placeholder="Buscar beneficios..."
                class="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base transition-all"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Lista de beneficios -->
          <div class="space-y-3">
            <div v-if="beneficiosCargando" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p>Cargando beneficios...</p>
            </div>
            
            <div v-else-if="beneficiosFiltrados.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <span class="text-4xl mb-2 block">🎁</span>
              <p>No se encontraron beneficios</p>
            </div>
            
            <div v-for="beneficio in beneficiosPaginados" :key="beneficio.id_beneficio" 
                 class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg">🎁</span>
                  <div>
                    <h5 class="text-[13px] sm:text-xs md:text-base font-medium text-gray-900 dark:text-white">{{ beneficio.tipo_beneficio }}</h5>
                    <p class="text-[12px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {{ beneficio.descripcion || 'Sin descripción' }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <span class="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-1 rounded-full text-xs font-medium">
                    Mes {{ beneficio.mes_requerido }}
                  </span>
                </div>
              </div>
              
              <div class="flex flex-row gap-1.5 sm:gap-2 ml-2">
                <button 
                  @click="editarBeneficio(beneficio)"
                  class="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button 
                  @click="confirmarEliminarBeneficio(beneficio)"
                  class="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Paginación para beneficios -->
          <div v-if="beneficiosFiltrados.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Página {{ paginacionBeneficios.paginaActual }} de {{ paginacionBeneficiosCalculada.totalPaginas }}
              </div>
              <div class="flex items-center space-x-1">
                <button 
                  @click="$event => cambiarPaginaBeneficios(paginacionBeneficios.paginaActual - 1, $event)" 
                  :disabled="paginacionBeneficios.paginaActual === 1 || beneficiosCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ paginacionBeneficios.paginaActual }} / {{ paginacionBeneficiosCalculada.totalPaginas }}
                </span>
                <button 
                  @click="$event => cambiarPaginaBeneficios(paginacionBeneficios.paginaActual + 1, $event)" 
                  :disabled="paginacionBeneficios.paginaActual >= paginacionBeneficiosCalculada.totalPaginas || beneficiosCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 6: Gestión de Servicios -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:col-span-2 xl:col-span-3">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span class="text-lg sm:text-2xl">🔧</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Gestión de Servicios
                </h3>
                <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                  Administra los servicios disponibles en MiSeguro
                </p>
              </div>
            </div>
            <button 
              @click="nuevoServicio()"
              class="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
              + Nuevo
            </button>
          </div>

          <!-- Filtros y búsqueda -->
          <div class="mb-4 sm:mb-6 flex flex-col gap-0 relative z-20">
            <div class="relative w-full">
              <input
                v-model="filtroBusqueda"
                type="text"
                placeholder="Buscar..."
                class="w-full pl-9 pr-4 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div class="flex gap-4">
              <div class="w-1/2">
                <multiselect 
                  v-model="filtroEstadoObject"
                  :options="estadoOptions"
                  :searchable="false"
                  :close-on-select="true"
                  :show-labels="false"
                  placeholder="Estado"
                  label="label"
                  track-by="value"
                  class="multiselect-admin-filter w-full"
                  :custom-label="getEstadoLabel"
                  :options-limit="100"
                >
                  <template #singleLabel="{ option }">
                    <span class="text-xs truncate">{{ getEstadoLabel(option) }}</span>
                  </template>
                </multiselect>
              </div>
              <div class="w-1/2">
                <multiselect 
                  v-model="filtroCiudadServicio"
                  :options="ciudades"
                  :searchable="false"
                  :close-on-select="true"
                  :show-labels="false"
                  placeholder="Ciudad"
                  label="nombre"
                  track-by="id_ciudad"
                  class="multiselect-admin-filter w-full"
                >
                  <template #singleLabel="{ option }">
                    <span class="text-xs truncate">{{ option.nombre }}</span>
                  </template>
                </multiselect>
              </div>
            </div>
          </div>

          <!-- Lista de servicios -->
          <div class="space-y-3">
            <div v-if="serviciosCargando" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p>Cargando servicios...</p>
            </div>
            
            <div v-else-if="serviciosFiltrados.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <span class="text-4xl mb-2 block">🔧</span>
              <p>No se encontraron servicios</p>
            </div>
            
            <div v-for="servicio in serviciosPaginados" :key="servicio.id_servicio" 
                 @click="editarServicio(servicio)"
                 :class="{
                   'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 hover:border-green-300 dark:hover:border-green-600': servicio.estado,
                   'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 hover:border-red-300 dark:hover:border-pink-600': !servicio.estado
                 }"
                 class="cursor-pointer rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg">🔧</span>
                  <div>
                    <h5 class="text-[13px] sm:text-xs md:text-base font-medium text-gray-900 dark:text-white">{{ servicio.nombre }}</h5>
                    <p class="text-[12px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {{ servicio.descripcion || 'Sin descripción' }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span v-for="ciudad in servicio.ciudades" :key="ciudad.id_ciudad"
                    class="px-2 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full text-[10px] font-medium border border-indigo-100 dark:border-indigo-800">
                    {{ ciudad.nombre_ciudad }}
                  </span>
                </div>
              </div>
              
              <div class="flex flex-row gap-1.5 sm:gap-2 ml-2">
                <button 
                  @click.stop="editarServicio(servicio)"
                  class="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button 
                  v-if="servicio.estado"
                  @click.stop="confirmarCambioEstado(servicio, false)"
                  class="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Desactivar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
                
                <button 
                  v-else
                  @click.stop="confirmarCambioEstado(servicio, true)"
                  class="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Activar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </button>
                
                <button 
                  @click.stop="confirmarEliminarServicio(servicio)"
                  class="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Paginación -->
          <div v-if="serviciosFiltrados.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Página {{ paginacion.paginaActual }} de {{ paginacionCalculada.totalPaginas }}
              </div>
              <div class="flex items-center space-x-1">
                <button 
                  @click="$event => cambiarPagina(paginacion.paginaActual - 1, $event)" 
                  :disabled="paginacion.paginaActual === 1 || serviciosCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  :class="{ 'cursor-not-allowed': paginacion.paginaActual === 1 }">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ paginacion.paginaActual }} / {{ paginacionCalculada.totalPaginas }}
                </span>
                <button 
                  @click="$event => cambiarPagina(paginacion.paginaActual + 1, $event)" 
                  :disabled="paginacion.paginaActual >= paginacionCalculada.totalPaginas || serviciosCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  :class="{ 'cursor-not-allowed': paginacion.paginaActual >= paginacionCalculada.totalPaginas }">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 8: Gestión de Ciudades -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:col-span-2 xl:col-span-3">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span class="text-lg sm:text-2xl">🏙️</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Gestión de Ciudades
                </h3>
                <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                  Administra las ciudades disponibles en el sistema
                </p>
              </div>
            </div>
            <button 
              @click="nuevaCiudad()"
              class="px-4 py-2 text-sm bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
              + Nueva
            </button>
          </div>

          <!-- Filtros y búsqueda -->
          <div class="mb-4 sm:mb-6 flex flex-row gap-2 sm:gap-4">
            <div class="relative flex-1 min-w-0">
              <input
                v-model="filtroBusquedaCiudades"
                type="text"
                placeholder="Buscar ciudades..."
                class="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base transition-all"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Lista de ciudades -->
          <div class="space-y-3">
            <div v-if="ciudadesCargando" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p>Cargando ciudades...</p>
            </div>
            
            <div v-else-if="ciudadesFiltradas.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <span class="text-4xl mb-2 block">🏙️</span>
              <p>No se encontraron ciudades</p>
            </div>
            
            <div v-for="ciudad in ciudadesPaginadas" :key="ciudad.id_ciudad" 
                 class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg">🏙️</span>
                  <div>
                    <h5 class="text-[13px] sm:text-xs md:text-base font-medium text-gray-900 dark:text-white">{{ ciudad.nombre }}</h5>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-row gap-1.5 sm:gap-2 ml-2">
                <button 
                  @click="editarCiudad(ciudad)"
                  class="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button 
                  @click="confirmarEliminarCiudad(ciudad)"
                  class="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Paginación para ciudades -->
          <div v-if="ciudadesFiltradas.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Página {{ paginacionCiudades.paginaActual }} de {{ paginacionCiudadesCalculada.totalPaginas }}
              </div>
              <div class="flex items-center space-x-1">
                <button 
                  @click="$event => cambiarPaginaCiudades(paginacionCiudades.paginaActual - 1, $event)" 
                  :disabled="paginacionCiudades.paginaActual === 1 || ciudadesCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ paginacionCiudades.paginaActual }} / {{ paginacionCiudadesCalculada.totalPaginas }}
                </span>
                <button 
                  @click="$event => cambiarPaginaCiudades(paginacionCiudades.paginaActual + 1, $event)" 
                  :disabled="paginacionCiudades.paginaActual >= paginacionCiudadesCalculada.totalPaginas || ciudadesCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 7: Gestión de Paquetes -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:col-span-2 xl:col-span-3">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 dark:bg-amber-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span class="text-lg sm:text-2xl">📦</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Gestión de Paquetes
                </h3>
                <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                  Administra los paquetes de mantenimiento disponibles
                </p>
              </div>
            </div>
            <button 
              @click="nuevoPaquete"
              class="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
              + Nuevo
            </button>
          </div>

          <!-- Filtros y búsqueda -->
          <div class="mb-4 sm:mb-6 flex flex-col gap-0 relative z-20">
            <div class="relative w-full">
              <input
                v-model="filtroBusquedaPaquetes"
                type="text"
                placeholder="Buscar paquetes..."
                class="w-full pl-9 pr-4 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base transition-all"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div class="flex gap-4">
              <div class="w-1/2">
                <multiselect 
                  v-model="filtroEstadoPaquetesObject"
                  :options="estadoOptions"
                  :searchable="false"
                  :close-on-select="true"
                  :show-labels="false"
                  placeholder="Estado"
                  label="label"
                  track-by="value"
                  class="multiselect-admin-filter w-full"
                  :custom-label="getEstadoLabel"
                  :options-limit="100"
                >
                  <template #singleLabel="{ option }">
                    <span class="text-xs truncate">{{ getEstadoLabel(option) }}</span>
                  </template>
                </multiselect>
              </div>
              <div class="w-1/2">
                <multiselect 
                  v-model="filtroCiudadPaquete"
                  :options="ciudades"
                  :searchable="false"
                  :close-on-select="true"
                  :show-labels="false"
                  placeholder="Ciudad"
                  label="nombre"
                  track-by="id_ciudad"
                  class="multiselect-admin-filter w-full"
                >
                  <template #singleLabel="{ option }">
                    <span class="text-xs truncate">{{ option.nombre }}</span>
                  </template>
                </multiselect>
              </div>
            </div>
          </div>

          <!-- Lista de paquetes -->
          <div class="space-y-3">
            <div v-if="paquetesCargando" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p>Cargando paquetes...</p>
            </div>
            
            <div v-else-if="paquetesFiltrados.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <span class="text-4xl mb-2 block">📦</span>
              <p>No se encontraron paquetes</p>
            </div>
            
            <div v-for="paquete in paquetesPaginados" :key="paquete.id_paquete" 
                 @click="editarPaquete(paquete)"
                 :class="{
                   'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 hover:border-green-300 dark:hover:border-green-600': paquete.estado,
                   'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 hover:border-red-300 dark:hover:border-pink-600': !paquete.estado
                 }"
                 class="cursor-pointer rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg">📦</span>
                  <div>
                    <h5 class="text-[13px] sm:text-xs md:text-base font-medium text-gray-900 dark:text-white">
                      {{ paquete.nombre }}
                    </h5>
                    <p class="text-[12px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {{ paquete.descripcion || 'Sin descripción' }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-[10px] font-medium">
                    Crédito: {{ formatNumber(paquete.costo) }}
                  </span>
                  <span 
                    v-if="paquete.cantidad"
                    class="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-[10px] font-medium"
                    title="Usos disponibles"
                  >
                    {{ paquete.cantidad }} {{ paquete.cantidad === 1 ? 'uso' : 'usos' }}
                  </span>
                  <span 
                    v-else
                    class="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-[10px] font-medium"
                    title="Usos ilimitados"
                  >
                    Ilimitado
                  </span>
                  <span v-for="ciudad in paquete.ciudades" :key="ciudad.id_ciudad"
                    class="px-2 py-1 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded-full text-[10px] font-medium border border-amber-100 dark:border-amber-800">
                    {{ ciudad.nombre_ciudad }}
                  </span>
                </div>
              </div>
              
              <div class="flex flex-row gap-1.5 sm:gap-2 ml-2">
                <button 
                  @click.stop="editarPaquete(paquete)"
                  class="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button 
                  v-if="paquete.estado === 1 || paquete.estado === true"
                  @click.stop="cambiarEstadoPaquete(paquete, false)"
                  class="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Desactivar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                
                <button 
                  v-else-if="paquete.estado === 0 || paquete.estado === false"
                  @click.stop="cambiarEstadoPaquete(paquete, true)"
                  class="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Activar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                
                <button 
                  @click.stop="confirmarEliminarPaquete(paquete)"
                  class="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Paginación -->
          <div v-if="paquetesFiltrados.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Página {{ paginacionPaquetes.paginaActual }} de {{ paginacionPaquetesCalculada.totalPaginas }}
              </div>
              <div class="flex items-center space-x-1">
                <button 
                  @click="$event => cambiarPaginaPaquetes(paginacionPaquetes.paginaActual - 1, $event)" 
                  :disabled="paginacionPaquetes.paginaActual === 1 || paquetesCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ paginacionPaquetes.paginaActual }} / {{ paginacionPaquetesCalculada.totalPaginas }}
                </span>
                <button 
                  @click="$event => cambiarPaginaPaquetes(paginacionPaquetes.paginaActual + 1, $event)" 
                  :disabled="paginacionPaquetes.paginaActual >= paginacionPaquetesCalculada.totalPaginas || paquetesCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>  

        <!-- Card 8: Gestión de Notificaciones -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:col-span-2 xl:col-span-3">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span class="text-lg sm:text-2xl">🔔</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Gestión de Notificaciones
                </h3>
                <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                  Crear y administrar notificaciones del sistema
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button 
                @click="mostrarFormularioCrear = !mostrarFormularioCrear"
                class="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                {{ mostrarFormularioCrear ? 'Cancelar' : 'Crear' }}
              </button>
            </div>
          </div>

          <!-- Formulario para crear notificación -->
          <div v-if="mostrarFormularioCrear" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Crear Nueva Notificación</h4>
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título de la notificación</label>
                <input
                  v-model="nuevaNotificacion.titulo"
                  type="text"
                  class="w-full px-3 py-2 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 dark:text-white"
                  placeholder="Escribe el título de la notificación"
                  @keyup.enter="crearNotificacion">
              </div>
            </div>
            <div class="mt-4 flex gap-3">
              <button 
                @click="crearNotificacion"
                :disabled="!nuevaNotificacion.titulo || isCreatingNotification"
                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <div class="flex items-center">
                  <div v-if="isCreatingNotification" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {{ isCreatingNotification ? 'Creando...' : 'Crear Notificación' }}
                </div>
              </button>
              <button 
                @click="confirmarEliminarNotificacionesLeidas"
                :disabled="isDeletingRead"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50">
                <div class="flex items-center">
                  <div v-if="isDeletingRead" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {{ isDeletingRead ? 'Eliminando...' : 'Eliminar Leídas' }}
                </div>
              </button>
            </div>
          </div>

          <!-- Lista de notificaciones -->
          <div class="space-y-3">
            <div v-if="notificaciones.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <span class="text-4xl mb-2 block">📭</span>
              <p>No hay notificaciones manuales creadas</p>
            </div>
            
            <div v-for="notif in notificaciones" :key="notif.id_notificacion" 
                 class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg">
                    {{ '📢' }}
                  </span>
                  <div>
                    <h5 class="text-[13px] sm:text-xs md:text-base text-gray-900 dark:text-white">{{ notif.titulo }}</h5>
                    <p class="text-[12px] sm:text-xs md:text-base text-gray-500 dark:text-gray-400">
                      Creada por: {{ notif.creado_por }} • 
                      {{ formatearFecha(notif.fecha_creacion) }}
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-2 ml-0 sm:ml-4 mt-2 sm:mt-0">
                <button 
                  @click="mostrarFormularioEnvio(notif)"
                  class="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
                <button 
                  @click="confirmarEliminarNotificacion(notif.id_notificacion)"
                  class="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 9: Gestión de Correlativos de Facturación -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:col-span-2 xl:col-span-3">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 dark:bg-pink-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span class="text-lg sm:text-2xl">🔢</span>
              </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                Gestión de Correlativos
              </h3>
              <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                Administra la facturación
              </p>
            </div>
          </div>
          <button 
          @click="abrirModalNuevoCorrelativo"
          class="px-3 sm:px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center whitespace-nowrap">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Nuevo</span>
          </button>
        </div>

      <!-- Filtros y búsqueda -->
  <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
    <div class="relative flex-1 min-w-0">
      <input
        v-model="filtroBusquedaCorrelativos"
        type="text"
        placeholder="Buscar por CAI o rango..."
        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
    <div class="w-full sm:w-40">
      <select 
        v-model="filtroEstadoCorrelativo"
        class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 dark:text-white transition-colors">
        <option value="">Todos</option>
        <option value="ACTIVO">Activo</option>
        <option value="INACTIVO">Inactivo</option>
        <option value="AGOTADO">Agotado</option>
        <option value="VENCIDO">Vencido</option>
      </select>
    </div>
  </div>

  <!-- Lista de correlativos -->
  <div class="space-y-3">
    <div v-if="correlativosCargando" class="text-center py-8 text-gray-500 dark:text-gray-400">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
      <p>Cargando correlativos...</p>
    </div>
    
    <div v-else-if="correlativosFiltrados.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      <span class="text-4xl mb-2 block">📭</span>
      <p>No se encontraron correlativos</p>
    </div>
    
    <template v-else>
      <div v-for="correlativo in correlativosPaginados" :key="correlativo.id" 
           @click="editarCorrelativo(correlativo)"
           :class="getCorrelativoCardColor(correlativo)"
           class="cursor-pointer rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200">
        <div class="flex flex-col">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-lg">🔢</span>
              <h5 class="text-[13px] sm:text-xs md:text-base font-medium text-gray-900 dark:text-white">
                {{ correlativo.cai }}
              </h5>
            </div>
            <span 
              :class="{
                'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400': correlativo.estado === 'ACTIVO',
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400': correlativo.estado === 'AGOTADO',
                'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400': correlativo.estado === 'VENCIDO',
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400': correlativo.estado === 'INACTIVO'
              }"
              class="px-2 py-1 text-[10px] font-medium rounded-full whitespace-nowrap">
              {{ getEstadoCorrelativoLabel(correlativo.estado) }}
            </span>
          </div>
          
          <div class="mt-2 pl-8">
            <p class="text-[12px] sm:text-xs text-gray-600 dark:text-gray-400">
              <span class="font-medium">Rango:</span> 
                {{ correlativo.rango_inicio }} - {{ correlativo.rango_fin }} 
            </p>
            <p class="text-[12px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1">
              <span class="font-medium">Actual:</span> 
              {{ correlativo.prefijo }}{{ (correlativo.correlativo_actual || correlativo.rango_inicio).toString().padStart(8, '0') }}
            </p>
            <p class="text-[11px] text-gray-500 dark:text-gray-500 mt-2">
              Válido hasta: {{ formatDate(correlativo.fecha_vencimiento) }}
            </p>
          </div>
          
          <div class="flex justify-end mt-3 pt-2 border-t border-gray-100 dark:border-gray-600">
            <div class="flex gap-2">
              <button 
                @click.stop="editarCorrelativo(correlativo)"
                class="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                @click.stop="confirmarEliminarCorrelativo(correlativo)"
                class="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
                title="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- Paginación -->
  <div v-if="correlativosFiltrados.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
    <div class="flex items-center justify-between">
      <div class="text-xs text-gray-500 dark:text-gray-400">
        Página {{ paginacionCorrelativos.paginaActual }} de {{ paginacionCorrelativosCalculada.totalPaginas }}
      </div>
      <div class="flex items-center space-x-1">
        <button 
          @click="$event => cambiarPaginaCorrelativos(paginacionCorrelativos.paginaActual - 1, $event)" 
          :disabled="paginacionCorrelativos.paginaActual === 1 || correlativosCargando"
          class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
          {{ paginacionCorrelativos.paginaActual }} / {{ paginacionCorrelativosCalculada.totalPaginas }}
        </span>
        <button 
          @click="$event => cambiarPaginaCorrelativos(paginacionCorrelativos.paginaActual + 1, $event)" 
          :disabled="paginacionCorrelativos.paginaActual >= paginacionCorrelativosCalculada.totalPaginas || correlativosCargando"
          class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
    </div>
  </div>

  
        <!-- Card: Configuración de Notificaciones Push (Admin) -->
        <div v-if="isSupported" class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-all duration-300">
          <div class="flex items-center mb-4 sm:mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <span class="text-lg sm:text-2xl">🔔</span>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                {{ $t('profile.push_notifications') }}
              </h3>
              <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                {{ $t('profile.real_time_alerts') }}
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ isSubscribed ? 'Notificaciones Activas' : 'Notificaciones Desactivadas' }}
              </span>
              <!-- Toggle Switch -->
              <button 
                @click="handleToggleNotifications"
                :disabled="permission === 'denied'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                :class="isSubscribed ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
                  :class="isSubscribed ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
            
            <p class="text-xs text-gray-600 dark:text-gray-400">
              {{ $t('profile.notifications_description') }}
            </p>
            
            <p v-if="permission === 'denied'" class="mt-2 text-[10px] text-red-500 dark:text-red-400">
              ⚠️ {{ $t('profile.notifications_blocked') }}
            </p>
          </div>
        </div>

  <!-- App Version Display -->
  <div class="w-full flex justify-center mb-4">
    <div class="px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 flex items-center gap-3">
      <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Versión del Sistema</span>
      <span class="text-xs font-bold text-gray-900 dark:text-white">v{{ config.public.appVersion }}</span>
    </div>
  </div>

  <!-- Logout Button Section -->
  <div class="w-full flex justify-center pt-12 pb-18 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
    <button 
      @click="handleLogout"
      :disabled="isLoggingOut"
      class="flex items-center space-x-4 px-10 py-4 bg-white dark:bg-gray-800 border-2 border-red-500 text-red-600 dark:text-red-400 font-bold rounded-2xl transition-all hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white shadow-xl hover:shadow-red-200 dark:hover:shadow-red-900/30 disabled:opacity-50 group transform hover:-translate-y-1 active:scale-95"
    >
      <div v-if="!isLoggingOut" class="flex items-center">
        <span class="mr-3 text-2xl group-hover:rotate-12 transition-transform">🔒</span>
        <span class="text-xl">Cerrar Sesión</span>
      </div>
      <div v-else class="flex items-center">
        <div class="animate-spin rounded-full h-7 w-7 border-b-2 border-current mr-3"></div>
        <span class="text-xl">Cerrando sesión...</span>
      </div>
    </button>
  </div>

      </div>
    </div>
    
    <!-- Footer -->
    <FootersFooterAdmin />
    
    <!-- Modal para enviar notificación -->
    <Transition name="fade">
      <div v-if="mostrarModalEnvio" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarModalEnvio"></div>
        <Transition name="modal">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 relative z-10">
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Enviar notificación
              </h3>
                            <div class="space-y-4 relative">
                <div class="relative z-10">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Destinatario
                  </label>
                  <multiselect 
                    v-model="tipoEnvioObject"
                    :options="tipoEnvioOptions"
                    :searchable="false"
                    :close-on-select="true"
                    :show-labels="false"
                    placeholder="Seleccionar tipo"
                    label="label"
                    track-by="value"
                    class="multiselect-admin-filter"
                    :custom-label="getTipoEnvioLabel"
                    :options-limit="100"
                  >
                    <template #singleLabel="{ option }">
                      <span class="text-[11px] truncate">{{ getTipoEnvioLabel(option) }}</span>
                    </template>
                  </multiselect>
                </div>

                <div v-if="tipoEnvio === 'usuario'">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Buscar Usuario
                  </label>
                  <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                      <div 
                        @click="abrirModalBuscarUsuario()"
                        class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between"
                      >
                        <span class="truncate">
                          {{ usuarioSeleccionado ? (usuarioSeleccionado.nombre || `Usuario #${usuarioSeleccionado.id_usuario}`) : 'Haz clic para buscar usuario' }}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <input
                        v-model.number="idUsuarioDestino"
                        type="hidden"
                      >
                    </div>
                    <button
                      v-if="usuarioSeleccionado"
                      type="button"
                      @click="limpiarUsuarioSeleccionado"
                      class="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Limpiar selección"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div v-if="tipoEnvio === 'ciudad'" class="space-y-4">
                  <!-- Selector de ciudad -->
                  <div class="relative z-10">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ciudad
                    </label>
                    <multiselect 
                      v-model="ciudadSeleccionada"
                      :options="ciudades"
                    :searchable="false"
                      :loading="cargandoCiudades"
                      :close-on-select="true"
                      :show-labels="false"
                      placeholder="Seleccionar ciudad"
                      label="nombre"
                      track-by="id_ciudad"
                      class="multiselect-admin-filter"
                      :options-limit="100"
                    >
                      <template #singleLabel="{ option }">
                        <span class="text-[11px] truncate">{{ option.nombre }}</span>
                      </template>
                      <template #noResult>
                        <div class="p-2 text-xs text-gray-500">
                          No se encontraron ciudades. Intenta con otro término de búsqueda.
                        </div>
                      </template>
                    </multiselect>
                  </div>

                  <!-- Selector de rol opcional -->
                  <div class="relative z-0">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rol (opcional)
                    </label>
                    <multiselect 
                      v-model="rolCiudadSeleccionado"
                      :options="rolOptions"
                      :searchable="false"
                      :close-on-select="true"
                      :show-labels="false"
                      placeholder="Filtrar por rol (opcional)"
                      label="label"
                      track-by="value"
                      class="multiselect-admin-filter"
                      :options-limit="100"
                    >
                      <template #singleLabel="{ option }">
                        <span class="text-[11px] truncate">{{ option.label }}</span>
                      </template>
                    </multiselect>
                  </div>
                </div>

                <div v-if="tipoEnvio === 'rol'" class="relative z-0 mt-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rol
                  </label>
                  <multiselect 
                    v-model="nombreRolDestinoObject"
                    :options="rolOptions"
                    :searchable="false"
                    :close-on-select="true"
                    :show-labels="false"
                    placeholder="Seleccionar rol"
                    label="label"
                    track-by="value"
                    class="multiselect-admin-filter"
                    :custom-label="getRolLabel"
                    :options-limit="100"
                  >
                    <template #singleLabel="{ option }">
                      <span class="text-[11px] truncate">{{ getRolLabel(option) }}</span>
                    </template>
                  </multiselect>
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  @click="cerrarModalEnvio"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  @click="enviarNotificacion"
                  :disabled="!puedeEnviar || isSendingNotification"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isSendingNotification" class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                  <span v-else>Enviar</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal de confirmación para eliminar notificación -->
    <Transition name="fade">
      <div v-if="mostrarModalConfirmacionEliminar" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="mostrarModalConfirmacionEliminar = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative z-10">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Confirmar eliminación
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            ¿Estás seguro de que deseas eliminar esta notificación? Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="mostrarModalConfirmacionEliminar = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              @click="eliminarNotificacion"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de confirmación para eliminar notificaciones leídas -->
    <Transition name="fade">
      <div v-if="mostrarModalConfirmacionEliminarLeidas" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="mostrarModalConfirmacionEliminarLeidas = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative z-10">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Eliminar notificaciones leídas
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            ¿Estás seguro de que deseas eliminar todas las notificaciones leídas? Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="mostrarModalConfirmacionEliminarLeidas = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="isDeletingRead"
            >
              Cancelar
            </button>
            <button
              @click="eliminarNotificacionesLeidas"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
              :disabled="isDeletingRead"
            >
              <svg v-if="isDeletingRead" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isDeletingRead ? 'Eliminando...' : 'Eliminar leídas' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal para crear/editar servicio -->
    <Transition name="fade">
      <div v-if="mostrarModalNuevoServicio" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarModalServicio"></div>
        <Transition name="modal">
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">
                {{ servicioEditando ? 'Editar Servicio' : 'Nuevo Servicio' }}
              </h3>
              <button @click="cerrarModalServicio" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <form @submit.prevent="guardarServicio" class="space-y-4">
              <div>
                <label for="nombre" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del servicio <span class="text-red-500">*</span>
                </label>
                <input
                  id="nombre"
                  v-model="formServicio.nombre"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="Ej: Reparación eléctrica">
              </div>
              
              <div>
                <label for="descripcion" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  v-model="formServicio.descripcion"
                  rows="3"
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="Descripción detallada del servicio"></textarea>
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ciudades disponibles
                </label>
                <multiselect
                  v-model="formServicio.ciudades_seleccionadas"
                  :options="ciudades"
                  :searchable="false"
                  :multiple="true"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :preserve-search="true"
                  placeholder="Seleccionar ciudades"
                  label="nombre"
                  track-by="id_ciudad"
                  class="multiselect-admin-filter"
                  :show-labels="false"
                >
                  <template #tag="{ option, remove }">
                    <span class="multiselect__tag">
                      {{ option.nombre }}
                      <i class="multiselect__tag-icon" @click="remove(option)">✕</i>
                    </span>
                  </template>
                </multiselect>
              </div>

              <div class="flex items-center">
                <input
                  id="estado"
                  v-model="formServicio.estado"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded">
                <label for="estado" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Activo
                </label>
              </div>

              <!-- Buttons -->
              <div class="flex space-x-3 pt-2">
                <button
                  type="button"
                  @click="cerrarModalServicio"
                  class="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :disabled="guardandoServicio"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="guardandoServicio"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <svg v-if="guardandoServicio" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ guardandoServicio ? 'Guardando...' : (servicioEditando ? 'Actualizar' : 'Crear') }}
                </button>
              </div>
            </form>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal para crear/editar beneficio -->
    <Transition name="fade">
      <div v-if="mostrarModalNuevoBeneficio" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarModalBeneficio"></div>
        <Transition name="modal">
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">
                {{ beneficioEditando ? 'Editar Beneficio' : 'Nuevo Beneficio' }}
              </h3>
              <button @click="cerrarModalBeneficio" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <form @submit.prevent="guardarBeneficio" class="space-y-4">
              <div>
                <label for="mes_requerido" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mes requerido <span class="text-red-500">*</span>
                </label>
                <input
                  id="mes_requerido"
                  v-model.number="formBeneficio.mes_requerido"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white"
                  placeholder="1">
              </div>

              <div>
                <label for="tipo_beneficio" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de beneficio <span class="text-red-500">*</span>
                </label>
                <input
                  id="tipo_beneficio"
                  v-model="formBeneficio.tipo_beneficio"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white"
                  placeholder="Ej: Visita técnica gratis">
              </div>
              
              <div>
                <label for="descripcion_beneficio" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="descripcion_beneficio"
                  v-model="formBeneficio.descripcion"
                  rows="3"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white"
                  placeholder="Descripción detallada del beneficio"></textarea>
              </div>

              <!-- Buttons -->
              <div class="flex space-x-3 pt-2">
                <button
                  type="button"
                  @click="cerrarModalBeneficio"
                  class="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :disabled="guardandoBeneficio"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="guardandoBeneficio"
                  class="flex-1 py-2 px-4 bg-emerald-600 text-white font-medium text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <svg v-if="guardandoBeneficio" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ guardandoBeneficio ? 'Guardando...' : (beneficioEditando ? 'Actualizar' : 'Crear') }}
                </button>
              </div>
            </form>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal para crear/editar ciudad -->
    <Transition name="fade">
      <div v-if="mostrarModalNuevaCiudad" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarModalCiudad"></div>
        <Transition name="modal">
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">
                {{ ciudadEditando ? 'Editar Ciudad' : 'Nueva Ciudad' }}
              </h3>
              <button @click="cerrarModalCiudad" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <form @submit.prevent="guardarCiudad" class="space-y-4">
              <div>
                <label for="nombre" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre de la ciudad <span class="text-red-500">*</span>
                </label>
                <input
                  id="nombre"
                  v-model="formCiudad.nombre"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900 dark:text-white"
                  placeholder="Ej: Tegucigalpa">
              </div>

              <!-- Buttons -->
              <div class="flex space-x-3 pt-2">
                <button
                  type="button"
                  @click="cerrarModalCiudad"
                  class="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :disabled="guardandoCiudad"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="guardandoCiudad"
                  class="flex-1 py-2 px-4 bg-cyan-600 text-white font-medium text-sm rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <svg v-if="guardandoCiudad" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ guardandoCiudad ? 'Guardando...' : (ciudadEditando ? 'Actualizar' : 'Crear') }}
                </button>
              </div>
            </form>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal para crear/editar cuenta bancaria -->
    <Transition name="fade">
      <div v-if="mostrarModalNuevaCuenta" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarModalCuenta"></div>
        <Transition name="modal">
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">
                {{ cuentaEditando ? 'Editar Cuenta' : 'Nueva Cuenta' }}
              </h3>
              <button @click="cerrarModalCuenta" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <form @submit.prevent="guardarCuenta" class="space-y-4">
              <div>
                <label for="banco" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Banco <span class="text-red-500">*</span>
                </label>
                <input
                  id="banco"
                  v-model="formCuenta.banco"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                  placeholder="Ej: BAC, BANPAIS, FICOHSA">
              </div>

              <div>
                <label for="beneficiario" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Beneficiario (ID) <span class="text-red-500">*</span>
                </label>
                <input
                  id="beneficiario"
                  v-model="formCuenta.beneficiario"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                  placeholder="Ej: 1101200100595">
              </div>
              
              <div>
                <label for="num_cuenta" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número de Cuenta <span class="text-red-500">*</span>
                </label>
                <input
                  id="num_cuenta"
                  v-model="formCuenta.num_cuenta"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                  placeholder="Ej: 34567887">
              </div>

              <div>
                <label for="tipo" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Cuenta <span class="text-red-500">*</span>
                </label>
                <input
                  id="tipo"
                  v-model="formCuenta.tipo"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                  placeholder="Ej: Ahorro, Cheques, Dólares">
              </div>
              
              <div class="flex items-center">
                <input
                  id="activo_cuenta"
                  v-model="formCuenta.activo"
                  type="checkbox"
                  class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded">
                <label for="activo_cuenta" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Cuenta activa
                </label>
              </div>

              <!-- Buttons -->
              <div class="flex space-x-3 pt-2">
                <button
                  type="button"
                  @click="cerrarModalCuenta"
                  class="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :disabled="guardandoCuenta"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="guardandoCuenta"
                  class="flex-1 py-2 px-4 bg-teal-600 text-white font-medium text-sm rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <svg v-if="guardandoCuenta" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ guardandoCuenta ? 'Guardando...' : (cuentaEditando ? 'Actualizar' : 'Crear') }}
                </button>
              </div>
            </form>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal para ver detalles de cuenta bancaria -->
    <Transition name="fade">
      <div v-if="mostrarModalDetallesCuenta" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarDetallesCuenta"></div>
        <Transition name="modal">
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-md max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">
                Detalles de la Cuenta
              </h3>
              <button @click="cerrarDetallesCuenta" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4" v-if="cuentaSeleccionada">
            <!-- Información de la cuenta -->
            <div class="space-y-4 mb-6">
              <div class="flex items-center justify-center mb-4">
                <div class="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                  <span class="text-2xl">🏦</span>
                </div>
              </div>
              
              <div class="text-center mb-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ cuentaSeleccionada.banco }}</h4>
                <span 
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': cuentaSeleccionada.activo,
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': !cuentaSeleccionada.activo
                  }" 
                  class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ cuentaSeleccionada.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Beneficiario (ID)</label>
                  <p class="text-sm font-mono text-gray-900 dark:text-white">{{ cuentaSeleccionada.beneficiario }}</p>
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Número de Cuenta</label>
                  <p class="text-sm font-mono text-gray-900 dark:text-white">{{ cuentaSeleccionada.num_cuenta }}</p>
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tipo de Cuenta</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ cuentaSeleccionada.tipo }}</p>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex space-x-3">
              <button
                @click="editarCuenta(cuentaSeleccionada)"
                class="flex-1 py-2 px-4 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button
                @click="confirmarEliminarCuenta(cuentaSeleccionada)"
                class="flex-1 py-2 px-4 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal de Confirmación -->
    <Transition name="fade">
      <div v-if="mostrarModalConfirmacion" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="mostrarModalConfirmacion = false"></div>
        <Transition name="modal">
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">{{ tituloConfirmacion }}</h3>
              <button @click="mostrarModalConfirmacion = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <div class="text-center mb-6">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
                <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {{ mensajeConfirmacion }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Esta acción no se puede deshacer.
              </p>
            </div>
            
            <!-- Buttons -->
            <div class="flex space-x-3">
              <button 
                type="button"
                @click="mostrarModalConfirmacion = false"
                class="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button"
                @click="ejecutarAccionConfirmada"
                class="flex-1 py-2 px-4 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                Confirmar
              </button>
            </div>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>

  <!-- Modal de búsqueda de usuario -->
  <Transition name="fade" mode="out-in">
    <div v-if="mostrarModalBuscarUsuario" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="cerrarModalBuscarUsuario">
          <div class="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Buscar Usuario
                </h3>
                
                <div class="mt-2">
                  <div class="relative">
                    <input
                      v-model="terminoBusquedaUsuario"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white pr-10"
                      placeholder="Buscar por nombre"
                    />
                    <div class="absolute right-2 top-1/2 -translate-y-1/2">
                      <div v-if="buscandoUsuarios" class="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-500"></div>
                    </div>
                  </div>

                  <div v-if="buscandoUsuarios && usuariosEncontrados.length === 0" class="mt-4 text-center py-4">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Buscando usuarios...</p>
                  </div>

                  <div v-else-if="!buscandoUsuarios && usuariosEncontrados.length === 0 && terminoBusquedaUsuario" class="mt-4 text-center py-4">
                    <p class="text-sm text-gray-600 dark:text-gray-300">No se encontraron usuarios que coincidan con la búsqueda</p>
                  </div>

                  <ul v-else-if="usuariosEncontrados.length > 0" class="mt-4 max-h-60 overflow-y-auto">
                    <li 
                      v-for="usuario in usuariosEncontrados" 
                      :key="usuario.id_usuario"
                      class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer flex items-center"
                      @click="seleccionarUsuario(usuario)"
                    >
                      <div class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium">
                        {{ usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U' }}
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ usuario.nombre || 'Sin nombre' }}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="cerrarModalBuscarUsuario"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal para crear/editar correlativo -->
  <Transition name="fade">
    <div v-if="mostrarModalCorrelativo" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarModalCorrelativo"></div>
      <Transition name="modal">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 relative z-10">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ correlativoEditando ? 'Editar' : 'Nuevo' }} Correlativo
              </h3>
              <button 
                @click="cerrarModalCorrelativo"
                class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Formulario -->
          <div class="p-6">
            <form @submit.prevent="guardarCorrelativo" @submit="checkFormValidity" class="space-y-4">

              <!-- CAI -->
              <div>
                <label for="cai" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CAI <span class="text-red-500">*</span>
                  <span class="text-xs text-gray-500 ml-2">(Incluye guiones -)</span>
                </label>
                <input
                  id="cai"
                  v-model="correlativoForm.cai"
                  type="text"
                  required
                  maxlength="37"
                  minlength="37"
                  class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 dark:text-white"
                  placeholder="Ej: 123456-789012-345678-901234-567890-12345-67"
                  :disabled="guardandoCorrelativo"
                >
                <p v-if="correlativoForm.cai && correlativoForm.cai.length !== 37" class="text-xs text-red-500 mt-1">
                  El CAI debe tener máximo 37 caracteres (actual: {{ correlativoForm.cai.length }})
                </p>
              </div>

              <!-- Prefijo -->
              <div>
                <label for="prefijo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prefijo <span class="text-red-500">*</span>
                  <span class="text-xs text-gray-500 ml-2">(Formato: xxx-xxx-xx-)</span>
                </label>
                <input
                  id="prefijo"
                  v-model="correlativoForm.prefijo"
                  type="text"
                  required
                  maxlength="12"
                  pattern="[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}-[a-zA-Z0-9]{2}-"
                  class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 dark:text-white"
                  placeholder="Ej: ABC-123-XY-"
                  :disabled="guardandoCorrelativo"
                >
                <p v-if="correlativoForm.prefijo && !/^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}-[a-zA-Z0-9]{2}-$/.test(correlativoForm.prefijo)" class="text-xs text-red-500 mt-1">
                  El prefijo debe tener el formato xxx-xxx-xx-
                </p>
              </div>

              <!-- Rango Inicio -->
              <div>
                <label for="rango_inicio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rango Inicial <span class="text-red-500">*</span>
                </label>
                <input
                  id="rango_inicio"
                  v-model.number="correlativoForm.rango_inicio"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 dark:text-white"
                  placeholder="Número inicial del rango"
                  :disabled="guardandoCorrelativo"
                >
                <p v-if="correlativoForm.rango_inicio && correlativoForm.rango_fin && correlativoForm.rango_inicio >= correlativoForm.rango_fin" class="text-xs text-red-500 mt-1">
                  El rango inicial debe ser menor al rango final
                </p>
              </div>

              <!-- Rango Fin -->
              <div>
                <label for="rango_fin" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rango Final <span class="text-red-500">*</span>
                </label>
                <input
                  id="rango_fin"
                  v-model.number="correlativoForm.rango_fin"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 dark:text-white"
                  placeholder="Número final del rango"
                  :disabled="guardandoCorrelativo"
                >
                <p v-if="correlativoForm.rango_fin && correlativoForm.rango_inicio && correlativoForm.rango_fin <= correlativoForm.rango_inicio" class="text-xs text-red-500 mt-1">
                  El rango final debe ser mayor al rango inicial
                </p>
              </div>

              <!-- Fecha de Autorización -->
              <div>
                <label for="fecha_autorizacion" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha de Autorización <span class="text-red-500">*</span>
                </label>
                <input
                  id="fecha_autorizacion"
                  v-model="correlativoForm.fecha_autorizacion"
                  type="date"
                  required
                  class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 dark:text-white"
                  :disabled="guardandoCorrelativo"
                >
                <p v-if="correlativoForm.fecha_autorizacion && correlativoForm.fecha_vencimiento && correlativoForm.fecha_autorizacion !== '' && correlativoForm.fecha_vencimiento !== '' && new Date(correlativoForm.fecha_autorizacion) >= new Date(correlativoForm.fecha_vencimiento)" class="text-xs text-red-500 mt-1">
                  La fecha de autorización debe ser anterior a la fecha de vencimiento
                </p>
              </div>

              <!-- Fecha de Vencimiento -->
              <div>
                <label for="fecha_vencimiento" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha de Vencimiento <span class="text-red-500">*</span>
                </label>
                <input
                  id="fecha_vencimiento"
                  v-model="correlativoForm.fecha_vencimiento"
                  type="date"
                  required
                  class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 dark:text-white"
                  :disabled="guardandoCorrelativo"
                >
                <p v-if="correlativoForm.fecha_vencimiento && correlativoForm.fecha_autorizacion && correlativoForm.fecha_vencimiento !== '' && correlativoForm.fecha_autorizacion !== '' && new Date(correlativoForm.fecha_vencimiento) <= new Date(correlativoForm.fecha_autorizacion)" class="text-xs text-red-500 mt-1">
                  La fecha de vencimiento debe ser posterior a la fecha de autorización
                </p>
              </div>

              <!-- Estado (solo para edición) -->
              <div v-if="correlativoEditando">
                <label for="estado" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado
                </label>
                <select
                  id="estado"
                  v-model="correlativoForm.estado"
                  class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 dark:text-white"
                  :disabled="guardandoCorrelativo"
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="AGOTADO">Agotado</option>
                  <option value="VENCIDO">Vencido</option>
                </select>
              </div>

              <!-- Botones -->
              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  @click="cerrarModalCorrelativo"
                  class="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :disabled="guardandoCorrelativo"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 py-2 px-4 bg-pink-500 text-white font-medium text-sm rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-pink-500"
                  :disabled="guardandoCorrelativo || !esFormularioCorrelativoValido"
                  @click="!esFormularioCorrelativoValido || guardandoCorrelativo ? $event.preventDefault() : null"
                >
                  <div v-if="guardandoCorrelativo" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {{ guardandoCorrelativo ? 'Guardando...' : (correlativoEditando ? 'Actualizar' : 'Crear') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Modal para crear/editar paquete -->
  <Transition name="fade">
    <div v-if="mostrarModalNuevoPaquete" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarModalPaquete"></div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-auto relative z-10 max-h-[85vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ paqueteEditando ? 'Editar' : 'Nuevo' }} Paquete
            </h3>
            <button 
              @click="cerrarModalPaquete"
              class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Formulario -->
        <div class="p-4 sm:p-6">
          <form @submit.prevent="guardarPaquete" class="space-y-3 sm:space-y-4">
            <!-- Nombre -->
            <div>
              <label for="nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre <span class="text-red-500">*</span>
              </label>
              <input
                id="nombre"
                v-model="paqueteForm.nombre"
                type="text"
                required
                class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="Ej: Paquete Básico"
                :disabled="guardandoPaquete"
              >
            </div>

            <!-- Descripción -->
            <div>
              <label for="descripcion" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                v-model="paqueteForm.descripcion"
                rows="3"
                class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="Descripción detallada del paquete"
                :disabled="guardandoPaquete"
              ></textarea>
            </div> 

            <!-- Costo -->
            <div>
              <label for="costo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Costo (L.) <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">L.</span>
                <input
                  id="costo"
                  v-model.number="paqueteForm.costo"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  :disabled="guardandoPaquete"
                >
              </div>
            </div>

            <!-- Cantidad -->
            <div>
              <label for="cantidad" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cantidad (Vacío para ilimitado)
              </label>
              <div class="relative">
                <input
                  id="cantidad"
                  v-model.number="paqueteForm.cantidad"
                  type="number"
                  min="1"
                  step="1"
                  class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="Vacío para ilimitado"
                  :disabled="guardandoPaquete"
                >
              </div> 
            </div> 

            <!-- Grid: Ciudades e Imagen -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Ciudades -->
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Ciudades disponibles
                </label>
                <multiselect
                  v-model="paqueteForm.ciudades_seleccionadas"
                  :options="ciudades"
                  :searchable="false"
                  :multiple="true"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :preserve-search="true"
                  placeholder="Seleccionar ciudades"
                  label="nombre"
                  track-by="id_ciudad"
                  class="multiselect-admin-filter"
                  :show-labels="false"
                >
                  <template #tag="{ option, remove }">
                    <span class="multiselect__tag">
                      {{ option.nombre }}
                      <i class="multiselect__tag-icon" @click="remove(option)">✕</i>
                    </span>
                  </template>
                </multiselect>
              </div>

              <!-- Imagen del paquete -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Imagen del paquete
                </label>
                <div class="mt-1">
                  <label
                    class="cursor-pointer bg-white dark:bg-gray-700 py-1.5 px-2.5 sm:py-2 sm:px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs sm:text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-block w-full text-center"
                  >
                    <span>Seleccionar imagen</span>
                    <input
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="manejarCambioImagen"
                    >
                  </label>
                  <p v-if="paqueteForm.imagen" class="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {{ paqueteForm.imagen.name }}
                  </p>
                </div>
                <!-- Vista previa de la imagen -->
                <div v-if="paqueteForm.imagen_previa" class="mt-2">
                  <img :src="paqueteForm.imagen_previa" alt="Vista previa" class="w-full h-32 object-cover rounded-lg">
                  <button 
                    type="button"
                    @click="eliminarImagen"
                    class="mt-1 sm:mt-2 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Eliminar imagen
                  </button>
                </div>
              </div>
            </div>

            <!-- Estado -->
            <div class="flex items-center">
              <input
                id="estado"
                v-model="paqueteForm.estado"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                :disabled="guardandoPaquete"
              >
              <label for="estado" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Activo
              </label>
            </div>

            <!-- Botones -->
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="cerrarModalPaquete"
                class="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                :disabled="guardandoPaquete"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="flex-1 py-2 px-4 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                :disabled="guardandoPaquete || !paqueteForm.nombre || !paqueteForm.costo"
              >
                <div v-if="guardandoPaquete" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ guardandoPaquete ? 'Guardando...' : (paqueteEditando ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal de confirmación para eliminar paquete -->
  <Transition name="fade">
    <div v-if="mostrarModalConfirmacionEliminarPaquete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="mostrarModalConfirmacionEliminarPaquete = false"></div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative z-10">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Confirmar eliminación
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          ¿Estás seguro de que deseas eliminar el paquete "{{ paqueteAEliminar?.nombre }}"? Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
          <button
            @click="mostrarModalConfirmacionEliminarPaquete = false"
            class="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            :disabled="guardandoPaquete"
          >
            Cancelar
          </button>
          <button
            @click="eliminarPaquete"
            class="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
            :disabled="guardandoPaquete"
          >
            <div v-if="guardandoPaquete" class="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1.5 sm:mr-2"></div>
            {{ guardandoPaquete ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>

    <!-- Modales de Notificaciones Push -->
    <Transition name="fade">
      <div v-if="showUnsubscribeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] p-4 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-sm relative shadow-2xl border border-gray-100 dark:border-gray-700 text-center animate-slide-up">
          <div class="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            🔕
          </div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white mb-3">
            {{ $t('profile.notifications.disable_title') }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            {{ $t('profile.notifications.disable_desc') }}
          </p>
          
          <div class="space-y-3">
            <button 
              @click="confirmUnsubscribe"
              class="w-full py-4 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-bold rounded-2xl transition-all active:scale-95"
            >
              {{ $t('profile.notifications.confirm_disable') }}
            </button>
            <button 
              @click="showUnsubscribeModal = false"
              class="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-200 dark:shadow-none"
            >
              {{ $t('profile.notifications.keep_active') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showSubscribeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] p-4 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-sm relative shadow-2xl border border-gray-100 dark:border-gray-700 text-center animate-slide-up">
          <div class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            🔔
          </div>
          <h3 class="text-xl font-black text-gray-900 dark:text-white mb-3">
            {{ $t('profile.notifications.subscribe_title') }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            {{ $t('profile.notifications.subscribe_desc') }}
          </p>
          
          <div class="space-y-3">
            <button 
              @click="confirmSubscribe"
              class="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-200 dark:shadow-none"
            >
              {{ $t('profile.notifications.confirm_subscribe') }}
            </button>
            <button 
              @click="showSubscribeModal = false"
              class="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-all active:scale-95"
            >
              {{ $t('profile.notifications.not_now') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { debounce } from 'lodash-es'

// Función para validar formato de correo electrónico
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
import { useAuthStore } from '~/middleware/auth.store'
import { useHead, useCookie, useRuntimeConfig } from '#imports';
import { useRouter, useRoute } from 'vue-router'
import { usePushNotifications } from '~/composables/usePushNotifications'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// ===== CONFIGURACIÓN =====
const handleToggleNotifications = async () => {
  if (isSubscribed.value) {
    showUnsubscribeModal.value = true
  } else {
    showSubscribeModal.value = true
  }
}

const confirmSubscribe = async () => {
  try {
    showSubscribeModal.value = false
    const result = await subscribe()
    
    if (result.success) {
      showToastMessage(t('profile.messages.update_success'), 'success')
    } else if (result.error === 'denied') {
      showToastMessage(t('profile.notifications_blocked'), 'error')
    } else {
      showToastMessage(result.error || 'Error al activar notificaciones', 'error')
    }
  } catch (error) {
    console.error('Error al suscribir:', error)
    showToastMessage('Error inesperado al activar notificaciones', 'error')
  }
}

const confirmUnsubscribe = async () => {
  try {
    await unsubscribe()
    showUnsubscribeModal.value = false
    showToastMessage(t('profile.messages.update_success'), 'info')
  } catch (error) {
    console.error('Error al desactivar:', error)
  }
}
const { $api } = useNuxtApp();
const config = useRuntimeConfig()
const auth = useAuthStore()
const router = useRouter();
const route = useRoute();

// Componentes 
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'
import Multiselect from 'vue-multiselect' 

// SEO y Meta
useHead({
  title: 'MiSeguro - Configuraciones',
  meta: [
    { name: 'description', content: 'Configuraciones del sistema MiSeguro - Administrar configuraciones' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.9, user-scalable=no' }
  ]
})

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const isSaving = ref(false)
const referidorPredeterminado = ref(null)
const isLoggingOut = ref(false)

// Variables para el envío de notificaciones
const nombreRolDestinoObject = ref(null)
const notificacionAEnviar = ref(null)
const tipoEnvio = ref('')
const tipoEnvioObject = ref(null)
const idUsuarioDestino = ref(null)
const nombreRolDestino = ref('')

const mostrarModalEnvio = ref(false)
const mostrarModalBuscarUsuario = ref(false)
const mostrarModalConfirmacionEliminar = ref(false)
const mostrarModalConfirmacionEliminarLeidas = ref(false)
const mostrarModalConfirmacion = ref(false)
const mostrarModalNuevoServicio = ref(false)
const mostrarModalNuevoPaquete = ref(false)
const mostrarModalConfirmacionEliminarPaquete = ref(false)
const mostrarModalNuevoBeneficio = ref(false)
const mostrarModalNuevaCuenta = ref(false)
const mostrarModalDetallesCuenta = ref(false)
const mostrarModalNuevaCiudad = ref(false)
const mostrarModalCorrelativo = ref(false)
const showUnsubscribeModal = ref(false)
const showSubscribeModal = ref(false)
const { subscribe, unsubscribe, isSubscribed, isSupported, permission } = usePushNotifications()

const anyModalOpen = computed(() => {
  return mostrarModalEnvio.value || 
         mostrarModalBuscarUsuario.value || 
         mostrarModalConfirmacionEliminar.value || 
         mostrarModalConfirmacionEliminarLeidas.value || 
         mostrarModalConfirmacion.value || 
         mostrarModalNuevoServicio.value || 
         mostrarModalNuevoPaquete.value || 
         mostrarModalConfirmacionEliminarPaquete.value || 
         mostrarModalNuevoBeneficio.value || 
         mostrarModalNuevaCuenta.value || 
         mostrarModalDetallesCuenta.value || 
         mostrarModalNuevaCiudad.value || 
         mostrarModalCorrelativo.value ||
         showUnsubscribeModal.value ||
         showSubscribeModal.value
})

watch(anyModalOpen, (newValue) => {
  if (process.client) {
    const overflowValue = newValue ? 'hidden' : ''
    document.body.style.overflow = overflowValue
    document.documentElement.style.overflow = overflowValue
  }
})

// Variables para selección de ciudad
const ciudadSeleccionada = ref(null)
const rolCiudadSeleccionado = ref(null)
const cargandoCiudades = ref(false)

// Variables para búsqueda de usuarios
const terminoBusquedaUsuario = ref('')
const buscandoUsuarios = ref(false)
const usuariosEncontrados = ref([])
const usuarioSeleccionado = ref(null)

// Opciones para el selector de tipo de envío
const tipoEnvioOptions = [
  { value: 'rol', label: 'Por rol' },
  { value: 'usuario', label: 'Usuario específico' },
  { value: 'ciudad', label: 'Usuarios de una ciudad' }, 
  { value: 'global', label: 'Todos los usuarios de la Plataforma' }, 
]

// Watcher para el término de búsqueda con debounce
watch(terminoBusquedaUsuario, (newVal) => {
  if (newVal) {
    buscarUsuarios();
  } else {
    usuariosEncontrados.value = [];
  }
});

// Limpiar selecciones al cambiar el tipo de envío
watch(() => tipoEnvio.value, async (newValue) => {
  if (newValue !== 'usuario') {
    usuarioSeleccionado.value = null;
  }
  if (newValue === 'ciudad' && ciudades.value.length === 0) {
    await cargarCiudades();
  } else if (newValue !== 'ciudad') {
    ciudadSeleccionada.value = null;
  }
});

// Método para seleccionar un usuario para envío de notificación
const seleccionarUsuario = (usuario) => {
  usuarioSeleccionado.value = usuario;
  idUsuarioDestino.value = usuario.id_usuario;
  mostrarModalBuscarUsuario.value = false;
  terminoBusquedaUsuario.value = '';
  usuariosEncontrados.value = [];
};

// Método para limpiar la selección de usuario
const limpiarUsuarioSeleccionado = () => {
  usuarioSeleccionado.value = null;
  idUsuarioDestino.value = null;
  terminoBusquedaUsuario.value = '';
  usuariosEncontrados.value = [];
};

// Configurar el debounce para la búsqueda
const buscarUsuarios = debounce(async () => {
  if (!terminoBusquedaUsuario.value.trim()) {
    usuariosEncontrados.value = []
    return
  }

  buscandoUsuarios.value = true
  try {
    const response = await $api(`/usuarios/${encodeURIComponent(terminoBusquedaUsuario.value)}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    usuariosEncontrados.value = Array.isArray(response) ? response : [response];
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    showToastMessage('Error al buscar usuarios', 'error');
    usuariosEncontrados.value = [];
  } finally {
    buscandoUsuarios.value = false;
  }
}, 500); // 500ms de debounce

// ===== CONFIGURACIONES INDIVIDUALES =====
const configuracionMembresia = ref(0)
const configuracionVisita = ref(0)
const configuracionComision = ref(0)
const configuracionComisionPaquete = ref(0)
const configuracionTelefono = ref('')
const configuracionEmail = ref('')
const configuracionRTN = ref('')
const configuracionDescuento = ref(0)
const configuracionDescuentoEspecial = ref(0)
const configuracionReferido = ref(0)
const configuracionReferidoPaquete = ref(0)
const configuracionRetiro = ref(0)
const configuracionRetiroMinimo = ref(0)
const configuracionDiasGracia = ref(14) // Valor por defecto de 14 días 

// ===== VALORES ORIGINALES PARA DETECTAR CAMBIOS =====
const valoresOriginales = ref({})
const configuraciones = ref([])

// ===== VARIABLES PARA NOTIFICACIONES =====
const notificaciones = ref([])
const isLoadingNotifications = ref(false)
const mostrarFormularioCrear = ref(false)
const isCreatingNotification = ref(false)
const isDeletingRead = ref(false)

// Formulario nueva notificación
const nuevaNotificacion = ref({
  tipo: '',
  titulo: ''
})
 


// Función para etiquetar tipo de envío
const getTipoEnvioLabel = (option) => {
  if (!option) return ''
  return option.label
}   

// Opciones para el selector de rol
const rolOptions = [
  { value: 'usuario', label: 'Clientes' },
  { value: 'tecnico', label: 'Técnicos' },
  { value: 'admin', label: 'Administradores' }
]

// Función para etiquetar roles
const getRolLabel = (option) => {
  if (!option) return ''
  return option.label
}
const isSendingNotification = ref(false)

// Estados para los modales de confirmación
const notificacionAEliminar = ref(null)
const accionConfirmar = ref(null)
const servicioSeleccionado = ref(null)
const mensajeConfirmacion = ref('')
const tituloConfirmacion = ref('')

// Estados para gestión de servicios
const servicios = ref([]);
const serviciosCargando = ref(false);
const servicioEditando = ref(null);

// Estados para gestión de paquetes
const paquetes = ref([]);
const paquetesCargando = ref(false);
const paqueteEditando = ref(null);
const filtroBusquedaPaquetes = ref('');
const filtroEstadoPaquetesObject = ref(null);
const filtroCiudadPaquete = ref(null);
const paqueteAEliminar = ref(null);

// Formulario de paquete
// Estado para controlar la carga al guardar
const guardandoPaquete = ref(false);

const paqueteForm = ref({
  nombre: '',
  descripcion: '',
  costo: '',
  cantidad: null,
  estado: true,
  ciudades_seleccionadas: [],
  imagen: null,
  imagen_previa: null,
  imagen_public_id: null
});

// Paginación de paquetes
const paginacionPaquetes = reactive({
  paginaActual: 1,
  porPagina: 5
});
const guardandoServicio = ref(false);
const formServicio = ref({
  nombre: '',
  descripcion: '',
  estado: true,
  ciudades_seleccionadas: []
});
const filtroBusqueda = ref('')
const filtroEstado = ref('')
const filtroEstadoObject = ref(null)
const filtroCiudadServicio = ref(null)

// Opciones para el filtro de estado
const estadoOptions = [
  { value: '', label: 'Todos' },
  { value: '1', label: 'Activos' },
  { value: '0', label: 'Inactivos' }
]

// Función para etiquetar estados
const getEstadoLabel = (option) => {
  if (!option) return ''
  return option.label
}

// Estados para gestión de beneficios
const beneficios = ref([]);
const beneficiosCargando = ref(false);
const beneficioEditando = ref(null);
const guardandoBeneficio = ref(false);
const formBeneficio = ref({
  mes_requerido: 1,
  tipo_beneficio: '',
  descripcion: ''
});
const filtroBusquedaBeneficios = ref('')

// Estados para gestión de cuentas bancarias
const cuentas = ref([]);
const cuentasCargando = ref(false);
const cuentaEditando = ref(null);
const guardandoCuenta = ref(false);
const cuentaSeleccionada = ref(null);
const formCuenta = ref({
  banco: '',
  beneficiario: '',
  num_cuenta: '',
  tipo: '',
  activo: true
});
const filtroBusquedaCuentas = ref('')

// Estados para gestión de ciudades
const ciudades = ref([]);
const ciudadesCargando = ref(false);
const ciudadEditando = ref(null);
const guardandoCiudad = ref(false);
const formCiudad = ref({
  nombre: ''
});
const filtroBusquedaCiudades = ref('')

// Estados para gestión de correlativos
const correlativos = ref([]);
const correlativosCargando = ref(false);
const correlativoEditando = ref(null);
const guardandoCorrelativo = ref(false);
const correlativoForm = ref({
  cai: '',
  prefijo: '',
  rango_inicio: 0,
  rango_fin: 0,
  fecha_autorizacion: '',
  fecha_vencimiento: '',
  estado: 'ACTIVO'
});
const filtroBusquedaCorrelativos = ref('');
const filtroEstadoCorrelativo = ref('');

// Paginación
const paginacion = ref({
  paginaActual: 1,
  porPagina: 3, // Mostrar solo 3 elementos por página
  total: 0,
  totalPaginas: 1,
  paginas: [],
  desde: 0,
  hasta: 0
})

// Paginación para beneficios
const paginacionBeneficios = ref({
  paginaActual: 1,
  porPagina: 3,
  total: 0,
  totalPaginas: 1,
  paginas: [],
  desde: 0,
  hasta: 0
})

// Paginación para cuentas
const paginacionCuentas = ref({
  paginaActual: 1,
  porPagina: 4, // Mostrar 4 cuentas por página (2x2)
  total: 0,
  totalPaginas: 1,
  paginas: [],
  desde: 0,
  hasta: 0
})

// Paginación para ciudades
const paginacionCiudades = ref({
  paginaActual: 1,
  porPagina: 3, // Mostrar 3 ciudades por página
  total: 0,
  totalPaginas: 1,
  paginas: [],
  desde: 0,
  hasta: 0
})

// Paginación para correlativos
const paginacionCorrelativos = ref({
  paginaActual: 1,
  porPagina: 10, // Mostrar 10 correlativos por página
  total: 0,
  totalPaginas: 1,
  paginas: [],
  desde: 0,
  hasta: 0
})

// ===== COMPUTED PARA DETECTAR CAMBIOS =====
const hayChanges = computed(() => {
  return configuracionMembresia.value !== valoresOriginales.value.membresia ||
         configuracionVisita.value !== valoresOriginales.value.visita_tecnico ||
         configuracionComision.value !== valoresOriginales.value.comision_por_servicio ||
         configuracionComisionPaquete.value !== valoresOriginales.value.comision_por_paquete ||
         configuracionTelefono.value !== valoresOriginales.value.numero_empresa ||
         configuracionDiasGracia.value !== valoresOriginales.value.reset_credito ||
         configuracionEmail.value !== valoresOriginales.value.correo_empresa ||
         configuracionRTN.value !== valoresOriginales.value.rtn ||
         configuracionDescuento.value !== valoresOriginales.value.porcentaje_descuento ||
         configuracionDescuentoEspecial.value !== valoresOriginales.value.porcentaje_descuento_especial ||
         configuracionReferido.value !== valoresOriginales.value.porcentaje_referido ||
         configuracionReferidoPaquete.value !== valoresOriginales.value.porcentaje_referido_paquete ||
         configuracionRetiro.value !== valoresOriginales.value.porcentaje_retiro ||
         configuracionRetiroMinimo.value !== valoresOriginales.value.retiro_minimo
})

const puedeEnviar = computed(() => {
  if (!tipoEnvio.value) return false
  if (tipoEnvio.value === 'usuario') return !!idUsuarioDestino.value
  if (tipoEnvio.value === 'rol') return !!nombreRolDestino.value
  if (tipoEnvio.value === 'ciudad') return !!ciudadSeleccionada.value?.id_ciudad
  return true
})

// Computed para paquetes filtrados (sin paginación)
const paquetesFiltrados = computed(() => {
  let resultado = [...paquetes.value];
  
  // Aplicar filtro de búsqueda
  if (filtroBusquedaPaquetes.value) {
    const busqueda = filtroBusquedaPaquetes.value.toLowerCase();
    resultado = resultado.filter(paquete => 
      paquete.nombre.toLowerCase().includes(busqueda) || 
      (paquete.descripcion && paquete.descripcion.toLowerCase().includes(busqueda)) ||
      paquete.costo.toString().includes(busqueda)
    );
  }
  
  // Aplicar filtro de estado
  if (filtroEstadoPaquetesObject.value && filtroEstadoPaquetesObject.value.value !== '') {
    const estadoFiltro = filtroEstadoPaquetesObject.value.value === '1';
    resultado = resultado.filter(paquete => paquete.estado === estadoFiltro);
  }
  
  // Aplicar filtro de ciudad
  if (filtroCiudadPaquete.value) {
    const ciudadId = filtroCiudadPaquete.value.id_ciudad;
    resultado = resultado.filter(paquete => 
      paquete.ciudades && 
      paquete.ciudades.some(c => c.id_ciudad === ciudadId)
    );
  }
  
  return resultado;
});

// Computed para paquetes paginados
const paquetesPaginados = computed(() => {
  const inicio = (paginacionPaquetes.paginaActual - 1) * paginacionPaquetes.porPagina;
  const fin = inicio + paginacionPaquetes.porPagina;
  return paquetesFiltrados.value.slice(inicio, fin);
});

// Computed para la paginación de paquetes
const paginacionPaquetesCalculada = computed(() => {
  const total = paquetesFiltrados.value.length;
  const totalPaginas = Math.ceil(total / paginacionPaquetes.porPagina);
  const inicio = (paginacionPaquetes.paginaActual - 1) * paginacionPaquetes.porPagina;
  const fin = Math.min(inicio + paginacionPaquetes.porPagina, total);
  
  return {
    total,
    totalPaginas,
    inicio: total > 0 ? inicio + 1 : 0,
    fin: fin,
    hasPrevious: paginacionPaquetes.paginaActual > 1,
    hasNext: paginacionPaquetes.paginaActual < totalPaginas
  };
});

// Computed para servicios filtrados (sin paginación)
const serviciosFiltrados = computed(() => {
  let resultado = [...servicios.value]
  
  // Aplicar filtro de búsqueda
  if (filtroBusqueda.value) {
    const busqueda = filtroBusqueda.value.toLowerCase()
    resultado = resultado.filter(servicio => 
      servicio.nombre.toLowerCase().includes(busqueda) || 
      (servicio.descripcion && servicio.descripcion.toLowerCase().includes(busqueda))
    )
  }
  
  // Aplicar filtro de estado
  if (filtroEstadoObject.value && filtroEstadoObject.value.value !== '') {
    const estadoFiltro = filtroEstadoObject.value.value === '1'
    resultado = resultado.filter(servicio => servicio.estado === estadoFiltro)
  }
  
  // Aplicar filtro de ciudad
  if (filtroCiudadServicio.value) {
    const ciudadId = filtroCiudadServicio.value.id_ciudad;
    resultado = resultado.filter(servicio => 
      servicio.ciudades && 
      servicio.ciudades.some(c => c.id_ciudad === ciudadId)
    );
  }
  
  return resultado
})

// Computed para beneficios filtrados
const beneficiosFiltrados = computed(() => {
  let resultado = [...beneficios.value]
  
  // Aplicar filtro de búsqueda
  if (filtroBusquedaBeneficios.value) {
    const busqueda = filtroBusquedaBeneficios.value.toLowerCase()
    resultado = resultado.filter(beneficio => 
      beneficio.tipo_beneficio.toLowerCase().includes(busqueda) || 
      (beneficio.descripcion && beneficio.descripcion.toLowerCase().includes(busqueda))
    )
  }
  
  return resultado
})

// Computed para cuentas filtradas
const cuentasFiltradas = computed(() => {
  let resultado = [...cuentas.value]
  
  // Aplicar filtro de búsqueda
  if (filtroBusquedaCuentas.value) {
    const busqueda = filtroBusquedaCuentas.value.toLowerCase()
    resultado = resultado.filter(cuenta => 
      cuenta.banco.toLowerCase().includes(busqueda) || 
      cuenta.beneficiario.toLowerCase().includes(busqueda) ||
      cuenta.num_cuenta.toLowerCase().includes(busqueda) ||
      (cuenta.tipo && cuenta.tipo.toLowerCase().includes(busqueda))
    )
  }
  
  return resultado
})

// Computed para la paginación
const paginacionCalculada = computed(() => {
  const total = serviciosFiltrados.value.length
  const totalPaginas = Math.ceil(total / paginacion.value.porPagina) || 1
  const paginaActual = Math.min(paginacion.value.paginaActual, totalPaginas || 1)
  
  // Calcular índices para la paginación
  const inicio = (paginaActual - 1) * paginacion.value.porPagina
  const fin = inicio + paginacion.value.porPagina
  
  // Calcular páginas para la navegación
  let paginas = []
  if (totalPaginas > 0) {
    let paginaInicial = Math.max(1, paginaActual - 2)
    if (totalPaginas - paginaActual < 2) {
      paginaInicial = Math.max(1, totalPaginas - 4)
    }
    paginas = Array.from(
      { length: Math.min(5, totalPaginas) },
      (_, i) => Math.min(paginaInicial + i, totalPaginas)
    ).filter((pagina, index, array) => !index || pagina > array[index - 1])
  }
  
  return {
    total,
    totalPaginas,
    paginaActual,
    desde: total > 0 ? inicio + 1 : 0,
    hasta: Math.min(fin, total),
    paginas
  }
})

// Computed para la paginación de beneficios
const paginacionBeneficiosCalculada = computed(() => {
  const total = beneficiosFiltrados.value.length
  const totalPaginas = Math.ceil(total / paginacionBeneficios.value.porPagina) || 1
  const paginaActual = Math.min(paginacionBeneficios.value.paginaActual, totalPaginas || 1)
  
  const inicio = (paginaActual - 1) * paginacionBeneficios.value.porPagina
  const fin = inicio + paginacionBeneficios.value.porPagina
  
  let paginas = []
  if (totalPaginas > 0) {
    let paginaInicial = Math.max(1, paginaActual - 2)
    if (totalPaginas - paginaActual < 2) {
      paginaInicial = Math.max(1, totalPaginas - 4)
    }
    paginas = Array.from(
      { length: Math.min(5, totalPaginas) },
      (_, i) => Math.min(paginaInicial + i, totalPaginas)
    ).filter((pagina, index, array) => !index || pagina > array[index - 1])
  }
  
  return {
    total,
    totalPaginas,
    paginaActual,
    desde: total > 0 ? inicio + 1 : 0,
    hasta: Math.min(fin, total),
    paginas
  }
})

// Computed para ciudades filtradas
const ciudadesFiltradas = computed(() => {
  let resultado = [...ciudades.value]
  
  // Aplicar filtro de búsqueda
  if (filtroBusquedaCiudades.value) {
    const busqueda = filtroBusquedaCiudades.value.toLowerCase()
    resultado = resultado.filter(ciudad => 
      ciudad.nombre.toLowerCase().includes(busqueda)
    )
  }
  
  return resultado
})

// Computed para la paginación de ciudades
const paginacionCiudadesCalculada = computed(() => {
  const total = ciudadesFiltradas.value.length
  const totalPaginas = Math.ceil(total / paginacionCiudades.value.porPagina) || 1
  const paginaActual = Math.min(paginacionCiudades.value.paginaActual, totalPaginas || 1)
  
  const inicio = (paginaActual - 1) * paginacionCiudades.value.porPagina
  const fin = inicio + paginacionCiudades.value.porPagina
  
  let paginas = []
  if (totalPaginas > 0) {
    let paginaInicial = Math.max(1, paginaActual - 2)
    if (totalPaginas - paginaActual < 2) {
      paginaInicial = Math.max(1, totalPaginas - 4)
    }
    paginas = Array.from(
      { length: Math.min(5, totalPaginas) },
      (_, i) => Math.min(paginaInicial + i, totalPaginas)
    ).filter((pagina, index, array) => !index || pagina > array[index - 1])
  }
  
  return {
    total,
    totalPaginas,
    paginaActual,
    desde: total > 0 ? inicio + 1 : 0,
    hasta: Math.min(fin, total),
    paginas
  }
})

// Computed para correlativos filtrados
const correlativosFiltrados = computed(() => {
  let resultado = [...correlativos.value]
  
  // Aplicar filtro de búsqueda
  if (filtroBusquedaCorrelativos.value) {
    const busqueda = filtroBusquedaCorrelativos.value.toLowerCase()
    resultado = resultado.filter(correlativo => 
      correlativo.cai.toLowerCase().includes(busqueda) ||
      correlativo.id.toString().includes(busqueda)
    )
  }
  
  // Aplicar filtro de estado
  if (filtroEstadoCorrelativo.value) {
    resultado = resultado.filter(correlativo => correlativo.estado === filtroEstadoCorrelativo.value)
  }
  
  return resultado
})

// Computed para la paginación de correlativos
const paginacionCorrelativosCalculada = computed(() => {
  const total = correlativosFiltrados.value.length
  const totalPaginas = Math.ceil(total / paginacionCorrelativos.value.porPagina) || 1
  const paginaActual = Math.min(paginacionCorrelativos.value.paginaActual, totalPaginas || 1)
  
  const inicio = (paginaActual - 1) * paginacionCorrelativos.value.porPagina
  const fin = inicio + paginacionCorrelativos.value.porPagina
  
  let paginas = []
  if (totalPaginas > 0) {
    let paginaInicial = Math.max(1, paginaActual - 2)
    if (totalPaginas - paginaActual < 2) {
      paginaInicial = Math.max(1, totalPaginas - 4)
    }
    paginas = Array.from(
      { length: Math.min(5, totalPaginas) },
      (_, i) => Math.min(paginaInicial + i, totalPaginas)
    ).filter((pagina, index, array) => !index || pagina > array[index - 1])
  }
  
  return {
    total,
    totalPaginas,
    paginaActual,
    desde: total > 0 ? inicio + 1 : 0,
    hasta: Math.min(fin, total),
    paginas
  }
})

// Computed para la paginación de cuentas
const paginacionCuentasCalculada = computed(() => {
  const total = cuentasFiltradas.value.length
  const totalPaginas = Math.ceil(total / paginacionCuentas.value.porPagina) || 1
  const paginaActual = Math.min(paginacionCuentas.value.paginaActual, totalPaginas || 1)
  
  const inicio = (paginaActual - 1) * paginacionCuentas.value.porPagina
  const fin = inicio + paginacionCuentas.value.porPagina
  
  let paginas = []
  if (totalPaginas > 0) {
    let paginaInicial = Math.max(1, paginaActual - 2)
    if (totalPaginas - paginaActual < 2) {
      paginaInicial = Math.max(1, totalPaginas - 4)
    }
    paginas = Array.from(
      { length: Math.min(5, totalPaginas) },
      (_, i) => Math.min(paginaInicial + i, totalPaginas)
    ).filter((pagina, index, array) => !index || pagina > array[index - 1])
  }
  
  return {
    total,
    totalPaginas,
    paginaActual,
    desde: total > 0 ? inicio + 1 : 0,
    hasta: Math.min(fin, total),
    paginas
  }
})

// Servicios paginados
const serviciosPaginados = computed(() => {
  const inicio = (paginacionCalculada.value.paginaActual - 1) * paginacion.value.porPagina
  const fin = inicio + paginacion.value.porPagina
  return serviciosFiltrados.value.slice(inicio, fin)
})

// Beneficios paginados
const beneficiosPaginados = computed(() => {
  const inicio = (paginacionBeneficiosCalculada.value.paginaActual - 1) * paginacionBeneficios.value.porPagina
  const fin = inicio + paginacionBeneficios.value.porPagina
  return beneficiosFiltrados.value.slice(inicio, fin)
})

// Cuentas paginadas
const cuentasPaginadas = computed(() => {
  const inicio = (paginacionCuentasCalculada.value.paginaActual - 1) * paginacionCuentas.value.porPagina
  const fin = inicio + paginacionCuentas.value.porPagina
  return cuentasFiltradas.value.slice(inicio, fin)
})

// Ciudades paginadas
const ciudadesPaginadas = computed(() => {
  const inicio = (paginacionCiudadesCalculada.value.paginaActual - 1) * paginacionCiudades.value.porPagina
  const fin = inicio + paginacionCiudades.value.porPagina
  return ciudadesFiltradas.value.slice(inicio, fin)
})

// Correlativos paginados
const correlativosPaginados = computed(() => {
  const inicio = (paginacionCorrelativosCalculada.value.paginaActual - 1) * paginacionCorrelativos.value.porPagina
  const fin = inicio + paginacionCorrelativos.value.porPagina
  return correlativosFiltrados.value.slice(inicio, fin)
})

// Validación del formulario de correlativo
const esFormularioCorrelativoValido = computed(() => {
  // Verificar que los campos básicos no estén vacíos
  const camposBasicosValidos = correlativoForm.value.cai.trim() !== '' &&
         correlativoForm.value.cai.length === 37 &&
         correlativoForm.value.prefijo.trim() !== '' &&
         /^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}-[a-zA-Z0-9]{2}-$/.test(correlativoForm.value.prefijo) &&
         correlativoForm.value.rango_inicio > 0 &&
         correlativoForm.value.rango_fin > 0 &&
         correlativoForm.value.rango_inicio < correlativoForm.value.rango_fin &&
         correlativoForm.value.fecha_autorizacion !== '' &&
         correlativoForm.value.fecha_vencimiento !== '';

  // Si los campos básicos no son válidos, retornar false inmediatamente
  if (!camposBasicosValidos) return false;

  // Validar fechas solo si los campos básicos son válidos
  try {
    const fechaAutorizacion = new Date(correlativoForm.value.fecha_autorizacion);
    const fechaVencimiento = new Date(correlativoForm.value.fecha_vencimiento);
    
    // Verificar que las fechas sean válidas
    if (isNaN(fechaAutorizacion.getTime()) || isNaN(fechaVencimiento.getTime())) {
      return false;
    }
    
    // Verificar que la fecha de autorización sea anterior a la de vencimiento
    return fechaAutorizacion < fechaVencimiento;
  } catch (error) {
    return false;
  }
})

// Helper function for correlativo estado labels
const getEstadoCorrelativoLabel = (estado) => {
  const estados = {
    'ACTIVO': 'Activo',
    'INACTIVO': 'Inactivo', 
    'AGOTADO': 'Agotado',
    'VENCIDO': 'Vencido'
  }
  return estados[estado] || estado
}

// Helper function to determine card color based on state and alerts
const getCorrelativoCardColor = (correlativo) => {
  if (correlativo.estado !== 'ACTIVO') {
    return 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
  }
  
  // Check if correlativo has alerts (based on backend logic)
  const hoy = new Date();
  const unMesDespues = new Date();
  unMesDespues.setMonth(unMesDespues.getMonth() + 1);
  const fechaVencimiento = new Date(correlativo.fecha_vencimiento);
  
  // Check range usage
  const rangoTotal = correlativo.rango_fin - correlativo.rango_inicio + 1;
  const utilizado = (correlativo.correlativo_actual || correlativo.rango_inicio - 1) - correlativo.rango_inicio + 1;
  const porcentajeUtilizado = (utilizado / rangoTotal) * 100;
  
  // Alert conditions
  const rangoProximoAgotarse = porcentajeUtilizado >= 70;
  const fechaProximaVencer = fechaVencimiento <= unMesDespues;
  
  if (rangoProximoAgotarse || fechaProximaVencer) {
    return 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'
  }
  
  return 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
}

// Watchers para reiniciar la paginación cuando cambian los filtros

// Watch para sincronizar filtroEstado con filtroEstadoObject
watch(() => filtroEstado.value, (newValue) => {
  if (newValue !== undefined && newValue !== null) {
    const estadoObject = estadoOptions.find(option => option.value === newValue);
    if (estadoObject) {
      filtroEstadoObject.value = estadoObject;
    }
  } else {
    filtroEstadoObject.value = estadoOptions[0]; // "Todos" por defecto
  }
});

// Watch para sincronizar filtroEstadoObject con filtroEstado
watch(() => filtroEstadoObject.value, (newObject) => {
  if (newObject && newObject.value !== undefined) {
    filtroEstado.value = newObject.value;
  } else {
    filtroEstado.value = ''; // Valor por defecto
  }
});

// Watch para sincronizar nombreRolDestino con nombreRolDestinoObject
watch(() => nombreRolDestino.value, (newValue) => {
  if (newValue && rolOptions.length > 0) {
    const rolObject = rolOptions.find(option => option.value === newValue);
    if (rolObject) {
      nombreRolDestinoObject.value = rolObject;
    }
  } else {
    nombreRolDestinoObject.value = null;
  }
});

// Watch para sincronizar nombreRolDestinoObject con nombreRolDestino
watch(() => nombreRolDestinoObject.value, (newObject) => {
  if (newObject && newObject.value !== undefined) {
    nombreRolDestino.value = newObject.value;
  } else {
    nombreRolDestino.value = ''; // Valor por defecto
  }
});

// Watch para sincronizar tipoEnvio con tipoEnvioObject
watch(() => tipoEnvio.value, (newValue) => {
  if (newValue && tipoEnvioOptions.length > 0) {
    const tipoObject = tipoEnvioOptions.find(option => option.value === newValue);
    if (tipoObject) {
      tipoEnvioObject.value = tipoObject;
    }
  } else {
    tipoEnvioObject.value = null;
  }
});

// Watch para sincronizar tipoEnvioObject con tipoEnvio
watch(() => tipoEnvioObject.value, (newObject) => {
  if (newObject && newObject.value !== undefined) {
    tipoEnvio.value = newObject.value;
  } else {
    tipoEnvio.value = ''; // Valor por defecto
  }
});

watch([filtroBusqueda, filtroEstado], () => {
  paginacion.value.paginaActual = 1
})

watch([filtroBusquedaBeneficios], () => {
  paginacionBeneficios.value.paginaActual = 1
})

watch([filtroBusquedaCuentas], () => {
  paginacionCuentas.value.paginaActual = 1
})

watch([filtroBusquedaCiudades], () => {
  paginacionCiudades.value.paginaActual = 1
})

watch([filtroBusquedaCorrelativos, filtroEstadoCorrelativo], () => {
  paginacionCorrelativos.value.paginaActual = 1
})

// Watch para inicializar el formulario cuando se abre el modal de correlativo
watch(mostrarModalCorrelativo, (newVal) => {
  if (newVal) {
    nextTick(() => {
      inicializarFormularioCorrelativo();
    });
  }
})

// ===== TOAST NOTIFICATION =====
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
});

const showToastMessage = (message, type = 'success') => {
  toast.value = {
    show: true,
    message,
    type,
    duration: 5000
  };
};

// ===== ICONOS PARA TIPOS DE NOTIFICACIÓN =====
const tipoIcono = {
  'informacion': 'ℹ️',
  'advertencia': '⚠️',
  'urgente': '🚨',
  'mantenimiento': '🔧'
}

// ===== FUNCIONES PARA CIUDADES =====
const cargarCiudades = async () => {
  ciudadesCargando.value = true;
  try {
    const response = await $api('/ciudad', {
      method: 'GET'
    });

    if (response && Array.isArray(response)) {
      ciudades.value = response.map(ciudad => ({
        ...ciudad,
        nombre: ciudad.nombre_ciudad // Mapear nombre_ciudad a nombre
      }));
    } else {
      showToastMessage('Error al cargar las ciudades', 'error');
    }
  } catch (error) {
    console.error('Error al cargar ciudades:', error);
    showToastMessage('Error al cargar las ciudades', 'error');
  } finally {
    ciudadesCargando.value = false;
  }
}

const editarCiudad = (ciudad) => {
  // Primero cerramos el modal si está abierto
  mostrarModalNuevaCiudad.value = false;
  
  // Usamos nextTick para asegurarnos que el modal se cierre antes de abrirlo de nuevo
  nextTick(() => {
    ciudadEditando.value = ciudad.id_ciudad;
    formCiudad.value = {
      nombre: ciudad.nombre
    };
    // Abrimos el modal después de actualizar los datos
    mostrarModalNuevaCiudad.value = true;
  });
}

const nuevaCiudad = () => {
  ciudadEditando.value = null;
  formCiudad.value = {
    nombre: ''
  };
  mostrarModalNuevaCiudad.value = true;
}

const cerrarModalCiudad = () => {
  mostrarModalNuevaCiudad.value = false;
  // Usamos setTimeout para limpiar los datos después de que se cierre la animación del modal
  setTimeout(() => {
    ciudadEditando.value = null;
    formCiudad.value = {
      nombre: ''
    };
  }, 300);
}

const guardarCiudad = async () => {
  guardandoCiudad.value = true;
  try {
    let response;
    
    if (ciudadEditando.value) {
      // Actualizar ciudad existente
      response = await $api(`/ciudad/${ciudadEditando.value}`, {
        method: 'PUT',
        body: { nombre_ciudad: formCiudad.value.nombre }
      });
      
      if (response) {
        showToastMessage('Ciudad actualizada exitosamente', 'success');
      }
    } else {
      // Crear nueva ciudad
      response = await $api('/ciudad', {
        method: 'POST',
        body: { nombre_ciudad: formCiudad.value.nombre }
      });
      
      if (response) {
        showToastMessage('Ciudad creada exitosamente', 'success');
      }
    }

    // Cerrar modal y recargar lista
    cerrarModalCiudad();
    await cargarCiudades();
    
  } catch (error) {
    console.error('Error al guardar ciudad:', error);
    showToastMessage('Error al guardar la ciudad', 'error');
  } finally {
    guardandoCiudad.value = false;
  }
}

const confirmarEliminarCiudad = (ciudad) => {
  if (confirm(`¿Estás seguro de que deseas eliminar la ciudad "${ciudad.nombre}"? Esta acción no se puede deshacer.`)) {
    eliminarCiudad(ciudad.id_ciudad);
  }
}

const eliminarCiudad = async (idCiudad) => {
  try {
    await $api(`/ciudad/${idCiudad}`, {
      method: 'DELETE'
    });
    
    showToastMessage('Ciudad eliminada exitosamente', 'success');
    await cargarCiudades();
  } catch (error) {
    console.error('Error al eliminar ciudad:', error);
    showToastMessage('Error al eliminar la ciudad', 'error');
  }
}

const cambiarPaginaCiudades = (pagina, event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // Validar que la página esté en el rango correcto
  if (pagina < 1 || pagina > paginacionCiudadesCalculada.value.totalPaginas) {
    return;
  }
  
  paginacionCiudades.value.paginaActual = pagina;
}

// ===== FUNCIONES PARA CUENTAS BANCARIAS =====
const cargarCuentas = async () => {
  cuentasCargando.value = true;
  try {
    const response = await $api('/cuentas/todas', {
      method: 'GET'
    });

    if (Array.isArray(response)) {
      cuentas.value = response.map(cuenta => ({
        ...cuenta,
        // Asegurarse de que activo sea booleano
        activo: Boolean(cuenta.activo)
      }));
    } else {
      showToastMessage('Error al cargar las cuentas bancarias', 'error');
    }
  } catch (error) {
    console.error('Error al cargar cuentas:', error);
    showToastMessage('Error al cargar las cuentas bancarias', 'error');
  } finally {
    cuentasCargando.value = false;
  }
}

const abrirDetallesCuenta = (cuenta) => {
  cuentaSeleccionada.value = cuenta;
  mostrarModalDetallesCuenta.value = true;
}

const cerrarDetallesCuenta = () => {
  mostrarModalDetallesCuenta.value = false;
  setTimeout(() => {
    cuentaSeleccionada.value = null;
  }, 300);
}

const editarCuenta = (cuenta) => {
  // Cerrar modal de detalles si está abierto
  mostrarModalDetallesCuenta.value = false;
  
  // Usar nextTick para asegurarnos que el modal se cierre antes de abrir el de edición
  nextTick(() => {
    cuentaEditando.value = cuenta.id_cuenta;
    formCuenta.value = {
      banco: cuenta.banco,
      beneficiario: cuenta.beneficiario,
      num_cuenta: cuenta.num_cuenta,
      tipo: cuenta.tipo,
      activo: cuenta.activo
    };
    mostrarModalNuevaCuenta.value = true;
  });
}

const nuevaCuenta = () => {
  cuentaEditando.value = null;
  formCuenta.value = {
    banco: '',
    beneficiario: '',
    num_cuenta: '',
    tipo: '',
    activo: true
  };
  mostrarModalNuevaCuenta.value = true;
}

const cerrarModalCuenta = () => {
  mostrarModalNuevaCuenta.value = false;
  setTimeout(() => {
    cuentaEditando.value = null;
    formCuenta.value = {
      banco: '',
      beneficiario: '',
      num_cuenta: '',
      tipo: '',
      activo: true
    };
  }, 300);
}

const crearCuenta = async () => {
  try {
    const response = await $api('/cuentas', {
      method: 'POST',
      body: {
        banco: formCuenta.value.banco,
        beneficiario: formCuenta.value.beneficiario,
        num_cuenta: formCuenta.value.num_cuenta,
        tipo: formCuenta.value.tipo,
        activo: formCuenta.value.activo ? 1 : 0
      }
    });

    showToastMessage('Cuenta bancaria creada correctamente', 'success');
    return true;
  } catch (error) {
    console.error('Error al crear cuenta:', error);
    const errorMessage = error.data?.message || 'Error al crear la cuenta bancaria. Por favor, inténtalo de nuevo.';
    showToastMessage(errorMessage, 'error');
    return false;
  }
};

const actualizarCuenta = async () => {
  try {
    if (!cuentaEditando.value) {
      throw new Error('No se ha especificado la cuenta a actualizar');
    }

    const datosEnviar = {
      banco: formCuenta.value.banco,
      beneficiario: formCuenta.value.beneficiario,
      num_cuenta: formCuenta.value.num_cuenta,
      tipo: formCuenta.value.tipo,
      activo: formCuenta.value.activo ? 1 : 0
    }; 

    const response = await $api(`/cuentas/${cuentaEditando.value}`, {
      method: 'PUT',
      body: datosEnviar
    }); 

    showToastMessage('Cuenta bancaria actualizada correctamente', 'success');
    return true;
  } catch (error) {
    console.error('Error al actualizar cuenta:', error);
    const errorMessage = error.data?.message || 'Error al actualizar la cuenta bancaria. Por favor, inténtalo de nuevo.';
    showToastMessage(errorMessage, 'error');
    return false;
  }
};

const guardarCuenta = async () => {
  guardandoCuenta.value = true;
  
  try {
    const esEdicion = !!cuentaEditando.value;
    
    const resultado = esEdicion 
      ? await actualizarCuenta() 
      : await crearCuenta();
    
    if (resultado) {
      await cargarCuentas();
      cerrarModalCuenta();
    }
    
    return resultado;
  } catch (error) {
    console.error('Error en guardarCuenta:', error);
    showToastMessage('Ocurrió un error inesperado', 'error');
    return false;
  } finally {
    guardandoCuenta.value = false;
  }
}

const confirmarEliminarCuenta = (cuenta) => {
  // Cerrar modal de detalles si está abierto
  mostrarModalDetallesCuenta.value = false;
  
  servicioSeleccionado.value = cuenta.id_cuenta;
  tituloConfirmacion.value = 'Eliminar Cuenta Bancaria';
  mensajeConfirmacion.value = `¿Estás seguro de que deseas eliminar la cuenta ${cuenta.banco} - ${cuenta.num_cuenta}? Esta acción no se puede deshacer.`;
  accionConfirmar.value = () => eliminarCuenta(cuenta.id_cuenta);
  mostrarModalConfirmacion.value = true;
}

const eliminarCuenta = async (cuentaId) => {
  if (!cuentaId) {
    console.error('ID de cuenta no válido');
    showToastMessage('Error: No se pudo identificar la cuenta a eliminar', 'error');
    return false;
  }
  
  try {
    const response = await $api(`/cuentas/${cuentaId}`, {
      method: 'DELETE'
    });
    
    showToastMessage('Cuenta bancaria eliminada correctamente', 'success');
    await cargarCuentas();
    return true;
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    const errorMessage = error.data?.message || 'Error al eliminar la cuenta bancaria';
    showToastMessage(errorMessage, 'error');
    return false;
  }
}

const cambiarPaginaCuentas = (nuevaPagina, event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  if (nuevaPagina < 1 || nuevaPagina > paginacionCuentasCalculada.value.totalPaginas) {
    return false;
  }
  
  paginacionCuentas.value.paginaActual = nuevaPagina;
  
  const cuentasContainer = document.querySelector('.grid.grid-cols-2');
  if (cuentasContainer) {
    cuentasContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  return false;
}

// ===== FUNCIONES PARA CORRELATIVOS =====
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-HN', options);
}; 

const cargarCorrelativos = async (mostrarExito = false) => {
  try {
    correlativosCargando.value = true;
    const response = await $api('/facturas/correlativos', {
      method: 'GET'
    });
    if (response.success) {
      correlativos.value = response.data;
      
      // Mostrar alertas de correlativos próximos a vencer si existen
      if (response.alertas && response.alertas.length > 0) {
        response.alertas.forEach(alerta => {
          if (alerta.mensaje && typeof alerta.mensaje === 'string') {
            showToastMessage(alerta.mensaje, 'warning');
          }
        });
      }
      
      if (mostrarExito) {
        showToastMessage('Correlativos cargados correctamente', 'success');
      }
    }
  } catch (error) {
    console.error('Error al cargar correlativos:', error);
    showToastMessage('Error al cargar los correlativos', 'error');
  } finally {
    correlativosCargando.value = false;
  }
};

const abrirModalNuevoCorrelativo = () => {
  correlativoEditando.value = null;
  inicializarFormularioCorrelativo();
  mostrarModalCorrelativo.value = true;
};

const editarCorrelativo = (correlativo) => {
  correlativoEditando.value = { ...correlativo };
  inicializarFormularioCorrelativo();
  mostrarModalCorrelativo.value = true;
};

const cerrarModalCorrelativo = () => {
  mostrarModalCorrelativo.value = false;
  correlativoEditando.value = null;
};

const checkFormValidity = (event) => {
  if (!esFormularioCorrelativoValido.value || guardandoCorrelativo.value) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
  return true;
};

const inicializarFormularioCorrelativo = () => {
  if (correlativoEditando.value) {
    // Formatear fechas para el input type="date"
    const formatearFecha = (fecha) => {
      if (!fecha) return '';
      const date = new Date(fecha);
      return date.toISOString().split('T')[0];
    };
    
    correlativoForm.value = {
      ...correlativoEditando.value,
      fecha_autorizacion: formatearFecha(correlativoEditando.value.fecha_autorizacion),
      fecha_vencimiento: formatearFecha(correlativoEditando.value.fecha_vencimiento)
    };
  } else {
    correlativoForm.value = {
      cai: '',
      prefijo: '',
      rango_inicio: 0,
      rango_fin: 0,
      fecha_autorizacion: '',
      fecha_vencimiento: '',
      estado: 'ACTIVO'
    };
  }
};

const guardarCorrelativo = async () => {
  try {
    // Protección adicional: no ejecutar si ya está guardando o el formulario no es válido
    if (guardandoCorrelativo.value || !esFormularioCorrelativoValido.value) {
      return;
    }
    
    guardandoCorrelativo.value = true;
    
    // Validaciones
    if (!correlativoForm.value.cai) {
      throw new Error('El CAI es requerido');
    }
    
    if (!correlativoForm.value.prefijo) {
      throw new Error('El prefijo es requerido');
    }
    
    if (!/^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}-[a-zA-Z0-9]{2}-$/.test(correlativoForm.value.prefijo)) {
      throw new Error('El prefijo debe tener el formato xxx-xxx-xx-');
    }
    
    if (correlativoForm.value.rango_inicio >= correlativoForm.value.rango_fin) {
      throw new Error('El rango inicial debe ser menor al rango final');
    }
    
    if (!correlativoForm.value.fecha_autorizacion || !correlativoForm.value.fecha_vencimiento) {
      throw new Error('Las fechas de autorización y vencimiento son requeridas');
    }
    
    const url = correlativoEditando.value 
      ? `/facturas/correlativos/${correlativoEditando.value.id}`
      : '/facturas/correlativos';
      
    const method = correlativoEditando.value ? 'PUT' : 'POST';
    
    const response = await $api(url, {
      method,
      body: correlativoForm.value
    });
    
    if (response.success) {
      showToastMessage(
        correlativoEditando.value 
          ? 'Correlativo actualizado correctamente' 
          : 'Correlativo creado correctamente',
        'success'
      );
      
      await cargarCorrelativos(true); // Mostrar toast de éxito al recargar
      cerrarModalCorrelativo();
    }
  } catch (error) {
    console.error('=== ERROR AL GUARDAR CORRELATIVO ===');
    console.error('Error completo:', error);
    console.error('Status:', error.response?.status);
    console.error('StatusText:', error.response?.statusText);
    console.error('Data:', error.data);
    console.error('Message:', error.message);
    
    // Extraer mensaje de error específico si existe
    let errorMessage = 'Error al guardar el correlativo';
    if (error.data?.message) {
      errorMessage = error.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showToastMessage(errorMessage, 'error');
  } finally {
    guardandoCorrelativo.value = false;
  }
};

const confirmarEliminarCorrelativo = (correlativo) => {
  if (correlativo.estado === 'ACTIVO') {
    showToastMessage('No se puede eliminar un correlativo activo', 'error');
    return;
  }
  
  // Validar que el correlativo tenga un ID válido
  if (!correlativo.id || correlativo.id === undefined || correlativo.id === null) {
    showToastMessage('Error: No se pudo identificar el correlativo a eliminar', 'error');
    return;
  }
  
  servicioSeleccionado.value = correlativo.id;
  tituloConfirmacion.value = 'Eliminar Correlativo';
  mensajeConfirmacion.value = `¿Estás seguro de que deseas eliminar el correlativo con CAI: ${correlativo.cai}? Esta acción no se puede deshacer.`;
  accionConfirmar.value = () => eliminarCorrelativo(correlativo.id);
  mostrarModalConfirmacion.value = true;
};

const eliminarCorrelativo = async (id) => {
  // Validar que el ID sea válido
  if (!id || id === undefined || id === null || id === 'undefined') {
    console.error('ID de correlativo no válido:', id);
    showToastMessage('Error: No se pudo identificar el correlativo a eliminar', 'error');
    return;
  }
  
  try {
    const response = await $api(`/facturas/correlativos/${id}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      showToastMessage('Correlativo eliminado correctamente', 'success');
      await cargarCorrelativos(true); // Mostrar toast de éxito al recargar
    }
  } catch (error) {
    console.error('Error al eliminar correlativo:', error);
    showToastMessage('Error al eliminar el correlativo', 'error');
  }
};

const cambiarPaginaCorrelativos = (nuevaPagina, event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  if (nuevaPagina < 1 || nuevaPagina > paginacionCorrelativosCalculada.value.totalPaginas) {
    return false;
  }
  
  paginacionCorrelativos.value.paginaActual = nuevaPagina;
  
  const correlativosContainer = document.querySelector('.bg-amber-50');
  if (correlativosContainer) {
    correlativosContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  return false;
};

// ===== FUNCIONES PARA CONFIGURACIONES =====
const guardarConfiguraciones = async () => {
  try {
    isSaving.value = true
    
    // Detectar cambios y preparar datos para enviar
    const cambios = []
    
    // Función auxiliar para comparar valores
    const hasChanged = (current, original, isNumber = true) => {
      if (isNumber) {
        return Number(current || 0) !== Number(original || 0);
      }
      return String(current || '').trim() !== String(original || '').trim();
    };

    // Membresía (número)
    if (hasChanged(configuracionMembresia.value, valoresOriginales.value.membresia, true)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'membresia')?.id_config,
        tipo_config: 'membresia',
        valor: Number(configuracionMembresia.value) || 0
      })
    }
    
    // Visita técnica (número)
    if (hasChanged(configuracionVisita.value, valoresOriginales.value.visita_tecnico, true)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'visita_tecnico')?.id_config,
        tipo_config: 'visita_tecnico',
        valor: Number(configuracionVisita.value) || 0
      })
    }
    
    // Comisión por servicio (número)
    if (hasChanged(configuracionComision.value, valoresOriginales.value.comision_por_servicio, true)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'comision_por_servicio')?.id_config,
        tipo_config: 'comision_por_servicio',
        valor: Number(configuracionComision.value) || 0
      })
    }

    // Comisión por paquete (número)
    if (hasChanged(configuracionComisionPaquete.value, valoresOriginales.value.comision_por_paquete, true)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'comision_por_paquete')?.id_config,
        tipo_config: 'comision_por_paquete',
        valor: Number(configuracionComisionPaquete.value) || 0
      })
    }
    
    // Teléfono (texto)
    if (hasChanged(configuracionTelefono.value, valoresOriginales.value.numero_empresa, false)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'numero_empresa')?.id_config,
        tipo_config: 'numero_empresa',
        valor: String(configuracionTelefono.value || '').trim()
      })
    }
    
    // Días de gracia (número)
    if (hasChanged(configuracionDiasGracia.value, valoresOriginales.value.reset_credito, true)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'reset_credito')?.id_config || null,
        tipo_config: 'reset_credito',
        valor: Number(configuracionDiasGracia.value) || 14
      })
    }
    
    // Email (texto con validación especial)
    const emailValue = String(configuracionEmail.value || '').trim();
    if (hasChanged(emailValue, valoresOriginales.value.correo_empresa, false)) {
      if (emailValue && !isValidEmail(emailValue)) {
        throw new Error('El formato del correo electrónico no es válido');
      }
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'correo_empresa')?.id_config,
        tipo_config: 'correo_empresa',
        valor: emailValue
      })
    }
    
    // RTN (texto)
    if (hasChanged(configuracionRTN.value, valoresOriginales.value.rtn, false)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'rtn')?.id_config,
        tipo_config: 'rtn',
        valor: String(configuracionRTN.value || '').trim()
      })
    }
    
    // Porcentaje de descuento (número)
    if (hasChanged(configuracionDescuento.value, valoresOriginales.value.porcentaje_descuento, true)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'porcentaje_descuento')?.id_config,
        tipo_config: 'porcentaje_descuento',
        valor: Number(configuracionDescuento.value) || 0
      })
    }
    
    // Descuento especial (número)
    if (hasChanged(configuracionDescuentoEspecial.value, valoresOriginales.value.porcentaje_descuento_especial, true)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'porcentaje_descuento_especial')?.id_config,
        tipo_config: 'porcentaje_descuento_especial',
        valor: Number(configuracionDescuentoEspecial.value) || 0
      })
    }
    
    // Porcentaje referido (número)
    if (hasChanged(configuracionReferido.value, valoresOriginales.value.porcentaje_referido, true)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'porcentaje_referido')?.id_config,
        tipo_config: 'porcentaje_referido',
        valor: Number(configuracionReferido.value) || 0
      })
    }
    
    // Porcentaje referido paquete (número)
    if (hasChanged(configuracionReferidoPaquete.value, valoresOriginales.value.porcentaje_referido_paquete, true)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'porcentaje_referido_paquete')?.id_config,
        tipo_config: 'porcentaje_referido_paquete',
        valor: Number(configuracionReferidoPaquete.value) || 0
      })
    }
    
    // Porcentaje retiro (número)
    if (hasChanged(configuracionRetiro.value, valoresOriginales.value.porcentaje_retiro, true)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'porcentaje_retiro')?.id_config,
        tipo_config: 'porcentaje_retiro',
        valor: Number(configuracionRetiro.value) || 0
      })
    }

    // Retiro mínimo (número)
    if (hasChanged(configuracionRetiroMinimo.value, valoresOriginales.value.retiro_minimo, true)) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'retiro_minimo')?.id_config,
        tipo_config: 'retiro_minimo',
        valor: Number(configuracionRetiroMinimo.value) || 0
      })
    }

    if (cambios.length === 0) {
      showToastMessage('No hay cambios para guardar', 'info')
      return
    }

    // Hacer peticiones individuales para cada cambio
    const promesas = cambios.map(async (cambio) => {
      const payload = {
        tipo_config: cambio.tipo_config,
        valor: cambio.valor
      };
      
      // Si el cambio tiene un ID, es una actualización (PUT), de lo contrario es nuevo (POST)
      const url = cambio.id ? `/config/${cambio.id}` : '/config/crear';
      const method = cambio.id ? 'PUT' : 'POST';
      const fullUrl = `${config.public.apiBase}${url}`;
      
      try {
        const response = await $api(url, {
          method: method,
          body: payload
        });
        
        return response;
      } catch (error) {
        console.error(`❌ Error en ${method} ${url}:`, {
          message: error.message,
          status: error.status || error.response?.status,
          response: error.response?.data || 'No hay respuesta del servidor',
          stack: error.stack
        });
        
        // Mejorar el mensaje de error para el usuario
        let errorMessage = `Error al ${method === 'PUT' ? 'actualizar' : 'crear'} configuración ${cambio.tipo_config}`;
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        throw new Error(errorMessage);
      }
    })

    const resultados = await Promise.all(promesas)
    
    // Actualizar valores originales después de guardar exitosamente
    await cargarConfiguraciones()
    showToastMessage('Configuraciones guardadas exitosamente', 'success')
    
  } catch (error) {
    console.error('=== ERROR GENERAL AL GUARDAR CONFIGURACIONES ===', {
      message: error.message,
      status: error.status,
      response: error.response?.data || 'No hay respuesta del servidor',
      stack: error.stack
    })
    const errorMessage = error.response?.data?.message || error.message || 'Error al guardar las configuraciones'
    showToastMessage(errorMessage, 'error')
  } finally {
    isSaving.value = false
  }
}

const cargarConfiguraciones = async () => {
  try {
    const response = await $api('/config', {
      method: 'GET'
    });

    if (Array.isArray(response)) {
      configuraciones.value = response;
      
      // Mapeo directo de la respuesta de la API a las variables
      response.forEach(item => {
        switch(item.tipo_config) {
          case 'membresia':
            configuracionMembresia.value = Number(item.valor) || 0;
            break;
          case 'visita_tecnico':
            configuracionVisita.value = Number(item.valor) || 0;
            break;
          case 'comision_por_servicio':
            configuracionComision.value = Number(item.valor) || 0;
            break;
          case 'comision_por_paquete':
            configuracionComisionPaquete.value = Number(item.valor) || 0;
            break;  
          case 'numero_empresa':
            configuracionTelefono.value = String(item.valor || '');
            break;
          case 'correo_empresa':
            configuracionEmail.value = String(item.valor || '');
            break;
          case 'rtn':
            configuracionRTN.value = String(item.valor || '');
            break;
          case 'porcentaje_descuento':
            configuracionDescuento.value = Number(item.valor) || 0;
            break;
          case 'porcentaje_descuento_especial':
            configuracionDescuentoEspecial.value = Number(item.valor) || 0;
            break;
          case 'porcentaje_referido':
            configuracionReferido.value = Number(item.valor) || 0;
            break;
          case 'porcentaje_referido_paquete':
            configuracionReferidoPaquete.value = Number(item.valor) || 0;
            break;
          case 'porcentaje_retiro':
            configuracionRetiro.value = Number(item.valor) || 0;
            break;
          case 'retiro_minimo':
            configuracionRetiroMinimo.value = Number(item.valor) || 0;
            break;
          case 'reset_credito':
            configuracionDiasGracia.value = Number(item.valor) || 14;
            break;
        }
      });

      // Guardar valores originales con los tipos correctos
      valoresOriginales.value = {
        membresia: Number(configuracionMembresia.value) || 0,
        visita_tecnico: Number(configuracionVisita.value) || 0,
        comision_por_servicio: Number(configuracionComision.value) || 0,
        comision_por_paquete: Number(configuracionComisionPaquete.value) || 0,
        numero_empresa: String(configuracionTelefono.value || ''),
        correo_empresa: String(configuracionEmail.value || ''),
        rtn: String(configuracionRTN.value || ''),
        porcentaje_descuento: Number(configuracionDescuento.value) || 0,
        porcentaje_descuento_especial: Number(configuracionDescuentoEspecial.value) || 0,
        porcentaje_referido: Number(configuracionReferido.value) || 0,
        porcentaje_referido_paquete: Number(configuracionReferidoPaquete.value) || 0,
        porcentaje_retiro: Number(configuracionRetiro.value) || 0,
        retiro_minimo: Number(configuracionRetiroMinimo.value) || 0,
        reset_credito: Number(configuracionDiasGracia.value) || 14
      };
    }
  } catch (error) {
    console.error('Error al cargar configuraciones:', error);
    showToastMessage('Error al cargar las configuraciones', 'error');
  }
};

// ===== FUNCIONES PARA BENEFICIOS =====
const cargarBeneficios = async () => {
  beneficiosCargando.value = true;
  try {
    const response = await $api('/membresiabeneficios', {
      method: 'GET'
    });

    if (response && response.beneficios) {
      beneficios.value = response.beneficios.map(beneficio => ({
        ...beneficio,
        id_beneficio: beneficio.id_beneficio || beneficio.id
      }));
    } else {
      showToastMessage('Error al cargar los beneficios', 'error');
    }
  } catch (error) {
    console.error('Error al cargar beneficios:', error);
    showToastMessage('Error al cargar los beneficios', 'error');
  } finally {
    beneficiosCargando.value = false;
  }
}

const editarBeneficio = (beneficio) => {
  // Primero cerramos el modal si está abierto
  mostrarModalNuevoBeneficio.value = false;
  
  // Usamos nextTick para asegurarnos que el modal se cierre antes de abrirlo de nuevo
  nextTick(() => {
    beneficioEditando.value = beneficio.id_beneficio;
    formBeneficio.value = {
      mes_requerido: beneficio.mes_requerido,
      tipo_beneficio: beneficio.tipo_beneficio,
      descripcion: beneficio.descripcion
    };
    // Abrimos el modal después de actualizar los datos
    mostrarModalNuevoBeneficio.value = true;
  });
}

const nuevoBeneficio = () => {
  beneficioEditando.value = null;
  formBeneficio.value = {
    mes_requerido: 1,
    tipo_beneficio: '',
    descripcion: ''
  };
  mostrarModalNuevoBeneficio.value = true;
}

const cerrarModalBeneficio = () => {
  mostrarModalNuevoBeneficio.value = false;
  // Usamos setTimeout para limpiar los datos después de que se cierre la animación del modal
  setTimeout(() => {
    beneficioEditando.value = null;
    formBeneficio.value = {
      mes_requerido: 1,
      tipo_beneficio: '',
      descripcion: ''
    };
  }, 300);
}

const crearBeneficio = async () => {
  try {
    const url = '/membresiabeneficios';
    const method = 'POST';
    
    const response = await $api(url, {
      method,
      body: {
        mes_requerido: formBeneficio.value.mes_requerido,
        tipo_beneficio: formBeneficio.value.tipo_beneficio,
        descripcion: formBeneficio.value.descripcion
      }
    });

    showToastMessage('Beneficio creado correctamente', 'success');
    return true;
  } catch (error) {
    console.error('Error al crear beneficio:', error);
    const errorMessage = error.data?.message || 'Error al crear el beneficio. Por favor, inténtalo de nuevo.';
    showToastMessage(errorMessage, 'error');
    return false;
  }
};

const actualizarBeneficio = async () => {
  try {
    if (!beneficioEditando.value) {
      throw new Error('No se ha especificado el beneficio a actualizar');
    }

    const url = `/membresiabeneficios/${beneficioEditando.value}`;
    
    const response = await $api(url, {
      method: 'PUT',
      body: {
        mes_requerido: formBeneficio.value.mes_requerido,
        tipo_beneficio: formBeneficio.value.tipo_beneficio,
        descripcion: formBeneficio.value.descripcion,
        _method: 'PUT' // Para compatibilidad con Laravel
      }
    }); 
    showToastMessage('Beneficio actualizado correctamente', 'success');
    return true;
  } catch (error) {
    console.error('Error al actualizar beneficio:', error);
    const errorMessage = error.data?.message || 'Error al actualizar el beneficio. Por favor, inténtalo de nuevo.';
    showToastMessage(errorMessage, 'error');
    return false;
  }
};

const guardarBeneficio = async () => {
  guardandoBeneficio.value = true;
  
  try {
    const esEdicion = !!beneficioEditando.value;
    
    // Llamar a la función correspondiente
    const resultado = esEdicion 
      ? await actualizarBeneficio() 
      : await crearBeneficio();
    
    if (resultado) {
      await cargarBeneficios();
      cerrarModalBeneficio();
    }
    
    return resultado;
  } catch (error) {
    console.error('Error en guardarBeneficio:', error);
    showToastMessage('Ocurrió un error inesperado', 'error');
    return false;
  } finally {
    guardandoBeneficio.value = false;
  }
}

const confirmarEliminarBeneficio = (beneficio) => {
  servicioSeleccionado.value = beneficio.id_beneficio;
  tituloConfirmacion.value = 'Eliminar Beneficio';
  mensajeConfirmacion.value = `¿Estás seguro de que deseas eliminar el beneficio "${beneficio.tipo_beneficio}"? Esta acción no se puede deshacer.`;
  accionConfirmar.value = () => eliminarBeneficio(beneficio.id_beneficio);
  mostrarModalConfirmacion.value = true;
}

const eliminarBeneficio = async (beneficioId) => {
  if (!beneficioId) {
    console.error('ID de beneficio no válido');
    showToastMessage('Error: No se pudo identificar el beneficio a eliminar', 'error');
    return false;
  }
  
  try {
    const response = await $api(`/membresiabeneficios/${beneficioId}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      showToastMessage('Beneficio eliminado correctamente', 'success');
      await cargarBeneficios();
      return true;
    } else {
      throw new Error(response.message || 'Error al eliminar el beneficio');
    }
  } catch (error) {
    console.error('Error al eliminar beneficio:', error);
    const errorMessage = error.data?.message || error.message || 'Error al eliminar el beneficio';
    showToastMessage(errorMessage, 'error');
    return false;
  }
}

const cambiarPaginaBeneficios = (nuevaPagina, event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  if (nuevaPagina < 1 || nuevaPagina > paginacionBeneficiosCalculada.value.totalPaginas) {
    return false;
  }
  
  paginacionBeneficios.value.paginaActual = nuevaPagina;
  
  const beneficiosContainer = document.querySelector('.space-y-3');
  if (beneficiosContainer) {
    beneficiosContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  return false;
}

// ===== FUNCIONES PARA OBTENER CIUDADES =====
const obtenerCiudades = async () => {
  if (ciudades.value.length > 0) return; // Ya tenemos las ciudades cargadas
  
  cargandoCiudades.value = true;
  try {
    const response = await $api('/ciudades', {
      method: 'GET'
    });
    ciudades.value = Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error al obtener ciudades:', error);
    showToastMessage('Error al cargar la lista de ciudades', 'error');
  } finally {
    cargandoCiudades.value = false;
  }
};

// ===== FUNCIONES PARA BÚSQUEDA DE USUARIOS =====
const abrirModalBuscarUsuario = () => {
  mostrarModalBuscarUsuario.value = true
  terminoBusquedaUsuario.value = ''
  usuariosEncontrados.value = []
  // Forzar la actualización del DOM si es necesario
  nextTick(() => {
    const searchInput = document.querySelector('input[placeholder="Buscar por nombre"]')
    if (searchInput) {
      searchInput.focus()
    }
  })
}

const cerrarModalBuscarUsuario = () => {
  mostrarModalBuscarUsuario.value = false
  terminoBusquedaUsuario.value = ''
  usuariosEncontrados.value = []
  buscandoUsuarios.value = false
}

const seleccionarReferentePredeterminado = async (usuario) => {
  try {
    // Primero obtenemos el ID de la configuración existente
    const configResponse = await $api('/config/valor/referidor_predeterminado', {
      method: 'GET'
    });

    const configId = configResponse?.id_config;
    
    if (!configId) {
      throw new Error('No se encontró la configuración existente');
    }
    
    // Actualizar el referidor predeterminado en el backend
    const response = await $api(`/config/${configId}`, {
      method: 'PUT',
      body: {
        tipo_config: 'referidor_predeterminado',
        valor: usuario.id_usuario.toString()
      }
    });

    // Actualizar el referidor predeterminado localmente
    referidorPredeterminado.value = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre
    };

    showToastMessage('Referente predeterminado actualizado correctamente', 'success');
    cerrarModalBuscarUsuario();
  } catch (error) {
    console.error('Error al actualizar el referente predeterminado:', error);
    showToastMessage('Error al actualizar el referente predeterminado', 'error');
  }
}

// ===== FUNCIONES PARA NOTIFICACIONES =====
const cargarNotificaciones = async () => {
  isLoadingNotifications.value = true
  try {
    const response = await $api('/notificaciones/manuales', {
      method: 'GET'
    })

    if (response.success) {
      notificaciones.value = response.data
    } else {
      showToastMessage('Error al cargar las notificaciones', 'error')
    }
  } catch (error) {
    console.error('Error al cargar notificaciones:', error)
    showToastMessage('Error al cargar las notificaciones', 'error')
  } finally {
    isLoadingNotifications.value = false
  }
}

const crearNotificacion = async () => {
  if (!nuevaNotificacion.value.titulo?.trim()) {
    showToastMessage('Por favor escribe un título para la notificación', 'error')
    return
  }

  isCreatingNotification.value = true
  try {
    const response = await $api('/notificaciones', {
      method: 'POST',
      body: {
        tipo: 'manual',
        titulo: nuevaNotificacion.value.titulo.trim(),
        creado_por: auth.user?.nombre || 'Administrador'
      }
    })

    if (response.success) {
      showToastMessage('Notificación creada exitosamente', 'success')
      // Resetear formulario
      nuevaNotificacion.value = { titulo: '' }
      mostrarFormularioCrear.value = false
      // Recargar lista
      await cargarNotificaciones()
    } else {
      showToastMessage('Error al crear la notificación', 'error')
    }
  } catch (error) {
    console.error('Error al crear notificación:', error)
    showToastMessage('Error al crear la notificación', 'error')
  } finally {
    isCreatingNotification.value = false
  }
}

const mostrarFormularioEnvio = (notificacion) => {
  notificacionAEnviar.value = notificacion
  mostrarModalEnvio.value = true
  resetearFormularioEnvio()
}

const cerrarModalEnvio = () => {
  mostrarModalEnvio.value = false
  notificacionAEnviar.value = null
  resetearFormularioEnvio()
}

const resetearFormularioEnvio = () => {
  idUsuarioDestino.value = null
  nombreRolDestino.value = ''
  nombreRolDestinoObject.value = null
  tipoEnvio.value = ''
  tipoEnvioObject.value = null
  ciudadSeleccionada.value = null
  rolCiudadSeleccionado.value = null
}

const enviarNotificacion = async () => {
  if (!tipoEnvio.value) {
    showToastMessage('Por favor selecciona un tipo de envío', 'error')
    return
  }
  
  if (!puedeEnviar.value) {
    showToastMessage('Por favor completa la información de destino', 'error')
    return
  }

  isSendingNotification.value = true
  
  try {
    const payload = {
      id_notificacion: notificacionAEnviar.value.id_notificacion
    }

    // Configurar según el tipo de envío
    if (tipoEnvio.value === 'usuario') {
      payload.id_usuario = idUsuarioDestino.value
    } else if (tipoEnvio.value === 'rol') {
      payload.nombre_rol = nombreRolDestinoObject.value.value
    } else if (tipoEnvio.value === 'ciudad') {
      payload.id_ciudad = ciudadSeleccionada.value.id_ciudad
      // Si se seleccionó un rol para filtrar, lo agregamos al payload
      if (rolCiudadSeleccionado.value) {
        payload.nombre_rol = rolCiudadSeleccionado.value.value
      }
    } else if (tipoEnvio.value === 'global') {
      payload.global = true
    }

    const response = await $api('/notificaciones/enviar', {
      method: 'POST',
      body: payload
    })

    if (response.success) {
      // Mensaje mejorado con información del tipo de envío
      const tipoEnvioTexto = response.data.tipo_envio || 
        (tipoEnvio.value === 'usuario' ? 'usuario individual' : 
         tipoEnvio.value === 'rol' ? `rol ${nombreRolDestinoObject.value?.label || ''}` : 
         tipoEnvio.value === 'ciudad' ? 
           (ciudadSeleccionada.value?.nombre ? 
             `ciudad ${ciudadSeleccionada.value.nombre}${rolCiudadSeleccionado.value ? ` (rol: ${rolCiudadSeleccionado.value.label})` : ''}` : 
             'ciudad') : 
         'todos los usuarios')
      
      showToastMessage(
        `Notificación enviada exitosamente a ${response.data.cantidad_destinatarios} destinatario(s) - ${tipoEnvioTexto}`, 
        'success'
      )
      
      cerrarModalEnvio()
      
      // Opcional: Recargar lista de notificaciones si existe la función
      if (typeof obtenerNotificaciones === 'function') {
        await obtenerNotificaciones()
      }
    } else {
      showToastMessage(response.message || 'Error al enviar la notificación', 'error')
    }
  } catch (error) {
    console.error('Error al enviar notificación:', error)
    
    // Manejo mejorado de errores
    let errorMessage = 'Error al enviar la notificación'
    
    if (error.data?.message) {
      errorMessage = error.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    showToastMessage(errorMessage, 'error')
  } finally {
    isSendingNotification.value = false
  }
}

// Mostrar modal de confirmación para eliminar notificación individual
const confirmarEliminarNotificacion = (idNotificacion) => {
  notificacionAEliminar.value = idNotificacion
  mostrarModalConfirmacionEliminar.value = true
}

// Eliminar notificación después de confirmación
const eliminarNotificacion = async () => {
  try {
    const response = await $api(`/notificaciones/${notificacionAEliminar.value}`, {
      method: 'DELETE'
    });

    if (response.success) {
      showToastMessage('Notificación eliminada exitosamente', 'success')
      await cargarNotificaciones()
    } else {
      showToastMessage('Error al eliminar la notificación', 'error')
    }
  } catch (error) {
    console.error('Error al eliminar notificación:', error)
    showToastMessage('Error al eliminar la notificación', 'error')
  } finally {
    mostrarModalConfirmacionEliminar.value = false
    notificacionAEliminar.value = null
  }
}

// Mostrar modal de confirmación para eliminar notificaciones leídas
const confirmarEliminarNotificacionesLeidas = () => {
  mostrarModalConfirmacionEliminarLeidas.value = true
}

// Eliminar notificaciones leídas después de confirmación
const eliminarNotificacionesLeidas = async () => {
  isDeletingRead.value = true
  try {
    const response = await $api('/notificaciones/eliminar/leidas', {
      method: 'DELETE'
    })

    if (response.success) {
      showToastMessage(response.message, 'success')
      await cargarNotificaciones()
    } else {
      showToastMessage('Error al eliminar notificaciones leídas', 'error')
    }
  } catch (error) {
    console.error('Error al eliminar notificaciones leídas:', error)
    showToastMessage('Error al eliminar notificaciones leídas', 'error')
  } finally {
    isDeletingRead.value = false
    mostrarModalConfirmacionEliminarLeidas.value = false
  }
}

// ===== FUNCIONES PARA GESTIÓN DE SERVICIOS =====

// Mostrar confirmación para eliminar servicio
function confirmarEliminarServicio(servicio) {
  servicioSeleccionado.value = servicio.id_servicio;
  tituloConfirmacion.value = 'Eliminar Servicio';
  mensajeConfirmacion.value = `¿Estás seguro de que deseas eliminar el servicio "${servicio.nombre}"? Esta acción no se puede deshacer.`;
  accionConfirmar.value = () => eliminarServicio(servicio.id_servicio);
  mostrarModalConfirmacion.value = true;
}

// Eliminar un servicio
async function eliminarServicio(servicioId) {
  if (!servicioId) {
    console.error('ID de servicio no válido');
    showToastMessage('Error: No se pudo identificar el servicio a eliminar', 'error');
    return false;
  }
  
  try {
    const auth = useAuthStore();
    
    const response = await $api(`/servicios/${servicioId}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      showToastMessage('Servicio eliminado correctamente', 'success');
      await cargarServicios();
      return true;
    } else {
      throw new Error(response.message || 'Error al eliminar el servicio');
    }
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    const errorMessage = error.data?.message || error.message || 'Error al eliminar el servicio';
    showToastMessage(errorMessage, 'error');
    return false;
  }
}

// Cargar lista de servicios
async function cargarServicios() {
  let data;
  try {
    serviciosCargando.value = true;
    
    const response = await $api('/servicios', {
      method: 'GET'
    });
    
    if (!response) {
      throw new Error('La respuesta del servidor está vacía');
    }
    
    data = response;
    
    if (!Array.isArray(data)) {
      console.warn('Se esperaba un arreglo de servicios, se recibió:', data);
      data = [];
    }
    
    servicios.value = data.map(servicio => ({
      ...servicio,
      // Asegurarse de que el estado sea booleano
      estado: Boolean(servicio.estado)
    }));
    
    return data;
  } catch (error) {
    console.error('Error en cargarServicios:', {
      error: error.message,
      response: data,
      stack: error.stack
    });
    showToastMessage('Error al cargar los servicios', 'error');
    throw error; // Relanzar el error para que pueda ser manejado por el llamador
  } finally {
    serviciosCargando.value = false;
  }
}

// Abrir modal para nuevo servicio
function nuevoServicio() {
  servicioEditando.value = null
  formServicio.value = {
    nombre: '',
    descripcion: '',
    estado: true,
    ciudades_seleccionadas: []
  }
  mostrarModalNuevoServicio.value = true
}

// Abrir modal para editar servicio
function editarServicio(servicio) {
  servicioEditando.value = servicio.id_servicio
  formServicio.value = {
    nombre: servicio.nombre,
    descripcion: servicio.descripcion || '',
    estado: servicio.estado,
    ciudades_seleccionadas: servicio.ciudades ? servicio.ciudades.map(c => ({ ...c, nombre: c.nombre_ciudad })) : []
  }
  mostrarModalNuevoServicio.value = true
}

// Cerrar modal de servicio
function cerrarModalServicio() {
  mostrarModalNuevoServicio.value = false
  setTimeout(() => {
    servicioEditando.value = null
    formServicio.value = {
      nombre: '',
      descripcion: '',
      estado: true,
      ciudades_seleccionadas: []
    }
  }, 300)
}

// Guardar o actualizar servicio
async function guardarServicio() {
  try {
    guardandoServicio.value = true;
    const auth = useAuthStore();
    
    const url = servicioEditando.value 
      ? `/servicios/${servicioEditando.value}`
      : '/servicios';
    
    const method = servicioEditando.value ? 'PUT' : 'POST';
    
    const response = await $api(url, {
      method: method,
      body: {
        nombre: formServicio.value.nombre,
        descripcion: formServicio.value.descripcion || null,
        estado: formServicio.value.estado ? 1 : 0,
        id_ciudades: formServicio.value.ciudades_seleccionadas.map(c => c.id_ciudad)
      }
    });

    // Usar el mensaje del backend si está disponible
    const successMessage = response?.message || 
      (servicioEditando.value ? 'Servicio actualizado correctamente' : 'Servicio creado correctamente');
    
    showToastMessage(successMessage, 'success');
    
    await cargarServicios();
    cerrarModalServicio();
    
    return true;
    
  } catch (error) {
    console.error('Error al guardar servicio:', error);
    
    // Mostrar mensaje de error detallado
    const errorMessage = error.data?.message || 
                         error.response?._data?.message || 
                         'Error al guardar el servicio';
    
    showToastMessage(errorMessage, 'error');
    return false;
  } finally {
    guardandoServicio.value = false;
  }
}

// Mostrar confirmación para cambiar estado
// Función para ejecutar la acción confirmada
async function ejecutarAccionConfirmada() {
  if (accionConfirmar.value) {
    try {
      await accionConfirmar.value();
      showToastMessage('Operación realizada con éxito', 'success');
    } catch (error) {
      console.error('Error al ejecutar la acción:', error);
      showToastMessage('Ocurrió un error al realizar la operación', 'error');
    } finally {
      mostrarModalConfirmacion.value = false;
      accionConfirmar.value = null;
      servicioSeleccionado.value = null;
    }
  }
}

function confirmarCambioEstado(servicio, activar) {
  servicioSeleccionado.value = servicio.id_servicio;
  tituloConfirmacion.value = activar ? 'Activar Servicio' : 'Desactivar Servicio';
  mensajeConfirmacion.value = `¿Estás seguro de que deseas ${activar ? 'activar' : 'desactivar'} el servicio "${servicio.nombre}"?`;
  accionConfirmar.value = () => cambiarEstadoServicio(servicio.id_servicio, activar);
  mostrarModalConfirmacion.value = true;
}

// Cambiar estado de un servicio
async function cambiarEstadoServicio(servicioId, activar) { 
  
  if (servicioId === undefined || servicioId === null || servicioId === '') {
    console.error('ID de servicio no válido (undefined/null/vacío):', servicioId);
    showToastMessage('Error: No se pudo identificar el servicio seleccionado', 'error');
    return false;
  }
  
  try {
    const auth = useAuthStore();
    
    // Realizar la petición al servidor
    const response = await $api(`/servicios/${servicioId}`, {
      method: 'PUT',
      body: {
        estado: activar ? 1 : 0
      }
    });
    
    // Usar el mensaje del backend si está disponible
    const successMessage = response?.message || 
      `Servicio ${activar ? 'activado' : 'desactivado'} correctamente`;
    
    showToastMessage(successMessage, 'success');
    
    // Actualizar el estado local
    const index = servicios.value.findIndex(s => s.id_servicio === servicioId);
    if (index !== -1) {
      // Crear un nuevo array para asegurar la reactividad
      servicios.value = [
        ...servicios.value.slice(0, index),
        { 
          ...servicios.value[index], 
          estado: activar,
          // Asegurar que se actualice la fecha de actualización si existe
          updatedAt: new Date().toISOString()
        },
        ...servicios.value.slice(index + 1)
      ];
    }
    
    return true;
    
  } catch (error) {
    console.error('Error al cambiar estado del servicio:', error);
    
    // Mostrar mensaje de error detallado
    const errorMessage = error.data?.message || 
                        error.response?._data?.message || 
                        'Error al cambiar el estado del servicio';
    
    showToastMessage(errorMessage, 'error');
    return false;
  }
}

// Cambiar de página
function cambiarPagina(nuevaPagina, event) {
  // Prevenir el comportamiento por defecto del botón
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // Validar que la página esté dentro de los límites
  if (nuevaPagina < 1 || nuevaPagina > paginacionCalculada.value.totalPaginas) {
    return false;
  }
  
  // Actualizar solo la página actual en el estado reactivo
  paginacion.value.paginaActual = nuevaPagina;
  
  // Desplazamiento suave al principio de la lista de servicios
  const serviciosContainer = document.querySelector('.space-y-3');
  if (serviciosContainer) {
    serviciosContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  return false;
}

// ===== FUNCIONES PARA GESTIÓN DE PAQUETES =====

// Función para formatear números con separadores de miles
function formatNumber(value) {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('es-HN').format(value);
}

// Cargar lista de paquetes
async function cargarPaquetes() {
  let data;
  try {
    paquetesCargando.value = true;
    
    const response = await $api('/paquetes', {
      method: 'GET'
    });
    
    if (!response) {
      throw new Error('La respuesta del servidor está vacía');
    }
    
    data = response;
    
    if (!Array.isArray(data)) {
      console.warn('Se esperaba un arreglo de paquetes, se recibió:', data);
      data = [];
    }
    
    paquetes.value = data.map(paquete => ({
      ...paquete,
      // Asegurarse de que el estado sea booleano
      estado: Boolean(paquete.estado),
      // Asegurarse de que el costo sea un número
      costo: parseFloat(paquete.costo) || 0
    }));
    
    return data;
  } catch (error) {
    console.error('Error en cargarPaquetes:', {
      error: error.message,
      response: data,
      stack: error.stack
    });
    showToastMessage('Error al cargar los paquetes', 'error');
    throw error;
  } finally {
    paquetesCargando.value = false;
  }
}

// Abrir modal para nuevo paquete
function nuevoPaquete() {
  paqueteEditando.value = null;
  paqueteForm.value = {
    nombre: '',
    descripcion: '',
    costo: '',
    cantidad: null,
    estado: true,
    ciudades_seleccionadas: [],
    imagen: null,
    imagen_previa: null,
    imagen_public_id: null
  };
  mostrarModalNuevoPaquete.value = true;
}

// Abrir modal para editar paquete
function editarPaquete(paquete) {
  paqueteEditando.value = paquete;
  paqueteForm.value = {
    nombre: paquete.nombre,
    descripcion: paquete.descripcion || '',
    costo: paquete.costo,
    cantidad: paquete.cantidad || null,
    estado: paquete.estado,
    ciudades_seleccionadas: paquete.ciudades ? paquete.ciudades.map(c => ({ ...c, nombre: c.nombre_ciudad })) : [],
    imagen: null,
    imagen_previa: paquete.imagen_url || null,
    imagen_public_id: paquete.imagen_public_id || null
  };
  mostrarModalNuevoPaquete.value = true;
}

// Cerrar modal de paquete
function cerrarModalPaquete() {
  mostrarModalNuevoPaquete.value = false;
  paqueteEditando.value = null;
  paqueteForm.value = {
    nombre: '',
    descripcion: '',
    costo: '',
    cantidad: null,
    estado: true
  };
}

// Función para manejar la selección de imagen
function manejarCambioImagen(event) {
  const file = event.target.files[0];
  if (file) {
    // Validar tipo de archivo
    if (!file.type.match('image.*')) {
      showToastMessage('Por favor, selecciona un archivo de imagen válido', 'error');
      return;
    }
    
    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToastMessage('La imagen no debe superar los 10MB', 'error');
      return;
    }
    
    // Actualizar el formulario
    paqueteForm.value.imagen = file;
    
    // Crear vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      paqueteForm.value.imagen_previa = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Función para eliminar la imagen seleccionada
async function eliminarImagen() {
  try {
    // Si estamos editando un paquete y tiene una imagen en el backend
    if (paqueteEditando.value && paqueteEditando.value.imagen_public_id) {
      const auth = useAuthStore();
      
      // Enviar petición para eliminar la imagen del backend
      await $api(`/paquetes/imagen/${paqueteEditando.value.id_paquete}`, {
        method: 'DELETE',
        body: {
          public_id: paqueteEditando.value.imagen_public_id
        }
      });
      
      // Actualizar el paquete en el frontend
      paqueteEditando.value.imagen_url = null;
      paqueteEditando.value.imagen_public_id = null;
    }
    
    // Limpiar el formulario
    paqueteForm.value.imagen = null;
    paqueteForm.value.imagen_previa = null;
    paqueteForm.value.imagen_public_id = null;
    
    // Limpiar el input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
    
    showToastMessage('Imagen eliminada correctamente', 'success');
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    const errorMessage = error.data?.message || 
                        error.response?._data?.message || 
                        'Error al eliminar la imagen';
    showToastMessage(errorMessage, 'error');
  }
}

// Guardar o actualizar paquete
async function guardarPaquete() {
  if (guardandoPaquete.value) return;
  guardandoPaquete.value = true;
  
  try {
    // Validar campos obligatorios
    if (!paqueteForm.value.nombre || !paqueteForm.value.costo) {
      showToastMessage('El nombre y el costo son campos obligatorios', 'error');
      return;
    }

    // Validar que el costo sea un número válido
    const costo = parseFloat(paqueteForm.value.costo);
    if (isNaN(costo) || costo < 0) {
      showToastMessage('El costo debe ser un número válido mayor o igual a cero', 'error');
      return;
    }

    const auth = useAuthStore();
    const url = paqueteEditando.value 
      ? `/paquetes/${paqueteEditando.value.id_paquete}`
      : '/paquetes';
    
    const method = paqueteEditando.value ? 'PUT' : 'POST';
    
    // Crear FormData para enviar archivos
    const formData = new FormData();
    
    // Función auxiliar para agregar campos al FormData manejando valores nulos
    const appendFormData = (key, value) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    };

    // Agregar campos al FormData
    appendFormData('nombre', paqueteForm.value.nombre.trim());
    appendFormData('descripcion', paqueteForm.value.descripcion.trim());
    appendFormData('costo', costo);
    
    // Manejar cantidad: si está vacío, no se envía el campo (el backend lo manejará como null)
    if (paqueteForm.value.cantidad) {
      appendFormData('cantidad', parseInt(paqueteForm.value.cantidad, 10));
    }
    
    // Estado siempre como booleano
    appendFormData('estado', paqueteForm.value.estado === true || paqueteForm.value.estado === 'true');
    
    // Agregar ciudades seleccionadas
    if (paqueteForm.value.ciudades_seleccionadas && paqueteForm.value.ciudades_seleccionadas.length > 0) {
      paqueteForm.value.ciudades_seleccionadas.forEach((ciudad, index) => {
        formData.append(`id_ciudades[${index}]`, ciudad.id_ciudad);
      });
    }
    
    // Agregar la imagen si existe
    if (paqueteForm.value.imagen) {
      // Usamos 'imagen' como nombre de campo para que coincida con el backend
      formData.append('imagen', paqueteForm.value.imagen);
    } else if (paqueteEditando.value && paqueteForm.value.imagen_public_id) {
      // Si estamos editando y no hay una nueva imagen, pero hay un public_id, lo enviamos
      formData.append('imagen_public_id', paqueteForm.value.imagen_public_id);
    }

    // Realizar la petición
    const response = await $api(url, {
      method: method,
      body: formData
    });

    if (!response) {
      throw new Error('No se recibió respuesta del servidor');
    }

    // Mostrar mensaje de éxito
    showToastMessage(
      paqueteEditando.value 
        ? 'Paquete actualizado correctamente' 
        : 'Paquete creado correctamente',
      'success'
    );
    
    // Recargar la lista de paquetes
    await cargarPaquetes();
    
    // Cerrar el modal
    cerrarModalPaquete();
    
    return true;
  } catch (error) {
    console.error('Error al guardar el paquete:', error);
    
    // Mostrar mensaje de error detallado
    const errorMessage = error.data?.message || 
                         error.response?._data?.message || 
                         'Error al guardar el paquete';
    
    showToastMessage(errorMessage, 'error');
    return false;
  } finally {
    guardandoPaquete.value = false;
  }
}

// Mostrar confirmación para eliminar paquete
function confirmarEliminarPaquete(paquete) {
  paqueteAEliminar.value = paquete;
  mostrarModalConfirmacionEliminarPaquete.value = true;
}

// Eliminar un paquete
async function eliminarPaquete() {
  if (!paqueteAEliminar.value) {
    showToastMessage('No se ha seleccionado ningún paquete para eliminar', 'error');
    return false;
  }

  try {
    const auth = useAuthStore();
    const response = await $api(`/paquetes/${paqueteAEliminar.value.id_paquete}`, {
      method: 'DELETE'
    });

    if (!response) {
      throw new Error('No se recibió respuesta del servidor');
    }

    // Mostrar mensaje de éxito
    showToastMessage('Paquete eliminado correctamente', 'success');
    
    // Recargar la lista de paquetes
    await cargarPaquetes();
    
    // Cerrar el modal de confirmación
    mostrarModalConfirmacionEliminarPaquete.value = false;
    paqueteAEliminar.value = null;
    
    return true;
  } catch (error) {
    console.error('Error al eliminar el paquete:', error);
    
    // Mostrar mensaje de error detallado
    const errorMessage = error.data?.message || 
                         error.response?._data?.message || 
                         'Error al eliminar el paquete';
    
    showToastMessage(errorMessage, 'error');
    return false;
  }
}

// Confirmar cambio de estado de un paquete
function confirmarCambioEstadoPaquete(paquete, activar) {
  paqueteAEliminar.value = paquete; // Reutilizamos esta variable para el paquete seleccionado
  tituloConfirmacion.value = activar ? 'Activar Paquete' : 'Desactivar Paquete';
  mensajeConfirmacion.value = `¿Estás seguro de que deseas ${activar ? 'activar' : 'desactivar'} el paquete "${paquete.nombre}"?`;
  accionConfirmar.value = () => cambiarEstadoPaquete(paquete, activar);
  mostrarModalConfirmacion.value = true;
}

// Cambiar estado de un paquete
async function cambiarEstadoPaquete(paqueteOrId, activar) { 
  const paqueteId = typeof paqueteOrId === 'object' ? paqueteOrId.id_paquete : paqueteOrId;
  
  if (paqueteId === undefined || paqueteId === null || paqueteId === '') {
    console.error('ID de paquete no válido (undefined/null/vacío):', paqueteId);
    showToastMessage('Error: No se pudo identificar el paquete seleccionado', 'error');
    return false;
  }
  
  try {
    const auth = useAuthStore();
    const response = await $api(`/paquetes/desactivar/${paqueteId}`, {
      method: 'PUT',
      body: {
        estado: activar
      }
    });

    if (response && response.success) {
      showToastMessage(activar ? 'Paquete activado correctamente' : 'Paquete desactivado correctamente', 'success');
      await cargarPaquetes();
      return true;
    } else {
      showToastMessage(response.message || 'Error al actualizar el estado del paquete', 'error');
      return false;
    }
  } catch (error) {
    console.error('Error al cambiar el estado del paquete:', error);
    showToastMessage('Error al actualizar el estado del paquete. Por favor, inténtalo de nuevo.', 'error');
    return false;
  }
}

// Cambiar de página en la paginación de paquetes
function cambiarPaginaPaquetes(nuevaPagina, event) {
  // Prevenir el comportamiento por defecto del botón
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // Validar que la página esté dentro de los límites
  if (nuevaPagina < 1 || nuevaPagina > paginacionPaquetesCalculada.value.totalPaginas) {
    return false;
  }
  
  // Actualizar solo la página actual en el estado reactivo
  paginacionPaquetes.paginaActual = nuevaPagina;
  
  // Desplazamiento suave al principio de la lista de paquetes
  const paquetesContainer = document.querySelector('.paquetes-container');
  if (paquetesContainer) {
    paquetesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  return false;
}

// ===== UTILIDADES =====
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Cargar referidor predeterminado
const cargarReferidorPredeterminado = async () => {
  try {
    const response = await $api('/config/valor/referidor_predeterminado', {
      method: 'GET'
    });
    
    if (response && response.usuario) {
      referidorPredeterminado.value = {
        id_usuario: response.usuario.id_usuario,
        nombre: response.usuario.nombre
      };
    } else {
      referidorPredeterminado.value = null;
    }
  } catch (error) {
    console.error('Error al cargar el referidor predeterminado:', error);
    referidorPredeterminado.value = null;
  }
};

// ===== INICIALIZACIÓN =====

onMounted(async () => {
  try {
    // Verificar autenticación
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) {
      window.location.reload()
      return
    }

    // Inicializar filtroEstadoObject con la primera opción
    filtroEstadoObject.value = estadoOptions[0]
    
    await Promise.all([
      cargarConfiguraciones(),
      cargarCuentas().catch(() => showToastMessage('Error al cargar las cuentas bancarias', 'error')),
      cargarBeneficios().catch(() => showToastMessage('Error al cargar los beneficios', 'error')),
      cargarServicios().catch(() => showToastMessage('Error al cargar los servicios', 'error')),
      cargarCiudades().catch(() => showToastMessage('Error al cargar las ciudades', 'error')),
      cargarNotificaciones().catch(() => showToastMessage('Error al cargar las notificaciones', 'error')),
      cargarCorrelativos().catch(() => showToastMessage('Error al cargar los correlativos', 'error')),
      cargarReferidorPredeterminado().catch(() => showToastMessage('Error al cargar el referidor predeterminado', 'error')),
      cargarPaquetes().catch(() => showToastMessage('Error al cargar los paquetes', 'error'))
    ])
  } catch (error) {
    window.location.reload()
  } finally {
    isLoading.value = false
  }
})

// Función para manejar el cierre de sesión
const handleLogout = async () => {
  try {
    isLoggingOut.value = true;
    await auth.logout();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    if (process.client) {
       window.location.replace('/');
    }
  } finally {
    isLoggingOut.value = false;
  }
}

</script>

<style scoped>
/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(1rem) scale(0.95);
}

/* Estilos generales */
input, select, textarea {
  font-size: 14px;
}

/* Personalizar scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.6);
}

/* Transiciones suaves */
* {
  transition: colors 0.3s ease;
}

/* Asegurar que el contenido principal tome el espacio disponible */
.flex-1 {
  flex: 1 1 0%;
}

/* Mejorar espaciado en móvil */
@media (max-width: 640px) {
  .space-y-4 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 1rem;
  }
  
  .space-y-5 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 1.25rem;
  }
}

/* Estilos para vue-multiselect en filtros de admin */
.multiselect-admin-filter {
  position: relative;
  z-index: auto;
}

.multiselect-admin-filter :deep(.multiselect__tags) {
  min-height: 40px; /* Ajustado para coincidir con el input de búsqueda (40px) */
  padding: 5px 40px 5px 12px;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  font-size: 12px;
  transition: all 0.2s ease;
  color: #111827;
  display: flex;
  align-items: center; /* Centrar items verticalmente */
  flex-wrap: wrap;
  gap: 4px;
}

.multiselect-admin-filter :deep(.multiselect__tag) {
  background: #1e40af; /* Azul más oscuro para mejor contraste */
  color: white;
  border-radius: 0.375rem; /* 6px - para coincidir con otros bordes redondeados */
  padding: 0.25rem 0.5rem; /* 4px 8px */
  margin: 0.125rem; /* 2px */
  font-size: 0.75rem; /* 12px */
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  border: 1px solid #1e3a8a; /* Borde sutil */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.multiselect-admin-filter :deep(.multiselect__tag:hover) {
  background: #1e3a8a; /* Un tono ligeramente más oscuro al pasar el mouse */
}

.multiselect-admin-filter :deep(.multiselect__tag-icon) {
  margin-left: 0.375rem; /* 6px */
  cursor: pointer;
  opacity: 0.8;
  font-style: normal;
  font-size: 0.625rem; /* 10px */
  line-height: 1;
  transition: all 0.2s ease;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: -2px;
}

.multiselect-admin-filter :deep(.multiselect__tag-icon:hover) {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

/* Estilos para el modo oscuro */
.dark .multiselect-admin-filter :deep(.multiselect__tag) {
  background: #1e3a8a;
  border-color: #1e3a8a;
  color: #f3f4f6;
}

.dark .multiselect-admin-filter :deep(.multiselect__tag:hover) {
  background: #1e3a8a;
  border-color: #1e3a8a;
}

.dark .multiselect-admin-filter :deep(.multiselect__tag-icon:hover) {
  background: rgba(255, 255, 255, 0.3);
}

.multiselect-admin-filter :deep(.multiselect__select) {
  top: 50%;
  transform: translateY(-50%);
  right: 8px;
  width: 20px;
  height: 20px;
  background-size: 10px;
}

.dark .multiselect-admin-filter :deep(.multiselect__tags) {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.multiselect-admin-filter :deep(.multiselect__content-wrapper) {
  position: absolute;
  z-index: 9999;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-top: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  min-width: 200px;
}

.dark .multiselect-admin-filter :deep(.multiselect__content-wrapper) {
  background: #374151;
  border-color: #4b5563;
}

.multiselect-admin-filter :deep(.multiselect__content) {
  max-height: 200px;
  overflow-y: auto;
}

.multiselect-admin-filter :deep(.multiselect__element) {
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.multiselect-admin-filter :deep(.multiselect__element:hover) {
  background-color: #f3f4f6;
}

.dark .multiselect-admin-filter :deep(.multiselect__element:hover) {
  background-color: #4b5563;
}

.multiselect-admin-filter :deep(.multiselect__element--selected) {
  background-color: #3b82f6;
  color: white;
}

.multiselect-admin-filter :deep(.multiselect__element--selected:hover) {
  background-color: #2563eb;
}
</style>