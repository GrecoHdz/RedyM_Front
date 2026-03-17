<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading Spinner -->
    <LoadingSpinner 
      :loading="isLoading" 
      :message="'Cargando Dashboard...'"
    />

    <!-- Contenido principal (oculto hasta completar autenticación) -->
    <div v-if="!isLoading">
      <HeadersHeaderDashboard />

      <!-- Content Container with max-w-2xl -->
      <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
        <!-- Toast Component -->
        <Toast 
          v-if="toast.show"
          :message="toast.message" 
          :type="toast.type"
          @close="toast.show = false"
        />
      <!-- Add padding at the bottom to prevent content from being hidden behind the fixed footer -->
      <div class="pb-20">
        <!-- Main Content -->
        <main class="pb-4">
      
      <!-- Invitación a notificaciones push -->
      <UiPushNotificationInvite />
      
      <!-- Welcome Section -->
      <section class="px-4 py-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <!-- Background decoration -->
          <div class="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"></div>
          <div class="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-lg"></div>
          
          <div class="relative">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-xl">👋</span>
              </div>
              <div>
                <h2 class="text-lg font-black text-gray-900 dark:text-white">
                  ¡Hola, {{ shortName }}!
                </h2>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Bienvenido a MiSeguro</p>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-3 rounded-xl">
              <p class="text-emerald-800 dark:text-emerald-200 font-medium text-center text-sm">
                🏠 Tu hogar está protegido con MiSeguro
              </p>
            </div>
          </div>
        </div>
      </section> 

      <!-- Stats Cards -->
      <section class="px-4 mb-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">📊</span>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-xs">Servicios Totales</p>
                <p class="text-xl font-black text-gray-900 dark:text-white">{{ statsData.totalServices }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">💰</span>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-xs">Crédito</p>
                <p class="text-xl font-black text-gray-900 dark:text-white">L. {{ (userCredit || 0).toLocaleString('es-HN') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Progress Section - New Design -->
      <section class="px-4 mb-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <!-- Header with gradient -->
          <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 p-4 text-white relative">
            <div class="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xl font-black">Tu Progreso</h3>
                <div class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                  <span v-if="isLoadingProgress" class="text-xs font-bold">Cargando...</span>
                  <span v-else class="text-xs font-bold">Mes {{ statsData.membershipMonths }}</span>
                </div>
              </div>
              
              <!-- Progress Circle -->
              <div class="flex items-center justify-center mb-3">
                <div class="relative w-24 h-24">
                  <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path class="text-white/20" stroke="currentColor" stroke-width="3" fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <path class="text-yellow-300" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"
                          :stroke-dasharray="progressCircle"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <div v-if="isLoadingProgress" class="text-lg font-black text-white">--</div>
                      <div v-else class="text-lg font-black text-white">{{ statsData.membershipMonths }}</div>
                      <div class="text-xs text-white/80">Mes</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p class="text-center text-white/90 font-medium text-sm">
                {{ progressMessage }}
              </p>
            </div>
          </div>

          <!-- Benefits Cards -->
          <div class="p-4">
            <div v-if="loadingBenefits" class="grid grid-cols-2 gap-2">
              <div v-for="i in 4" :key="`skeleton-${i}`" 
                   class="h-20 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
            
            <div v-else-if="benefitsError" class="text-center py-3 text-red-500 text-sm">
              {{ benefitsError }}
              <button @click="fetchBeneficios" class="mt-2 text-xs text-blue-600 hover:underline">
                Reintentar
              </button>
            </div>
            
            <div v-else-if="benefitsToShow.length === 0" class="text-center py-3 text-gray-500 text-sm">
              No hay beneficios disponibles en este momento.
            </div>
            
            <div v-else class="grid grid-cols-2 gap-2">
              <div v-for="(benefit, index) in benefitsToShow" :key="`benefit-${benefit.mes_requerido}`"
                   class="p-3 rounded-xl border-2 transition-all duration-300"
                   :class="getBenefitStyle(benefit.mes_requerido)">
                <div class="flex items-center space-x-2 mb-1">
                  <div class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                       :class="getBenefitIconStyle(benefit.mes_requerido)">
                    {{ getBenefitIcon(benefit.mes_requerido) }}
                  </div>
                  <span class="text-xs font-bold"
                        :class="getBenefitTextStyle(benefit.mes_requerido)">
                    Mes {{ benefit.mes_requerido }}
                  </span>
                </div>
                <p class="text-xs font-semibold leading-tight mb-1"
                   :class="getBenefitTitleStyle(benefit.mes_requerido)">
                  {{ benefit.tipo_beneficio }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  <template v-if="benefit.tipo_beneficio === 'Descuento Especial en todos los Servicios'">
                    Descuento Especial del {{ specialDiscount }}% en todos los servicios
                  </template>
                  <template v-else-if="benefit.tipo_beneficio === 'Descuento en todos los servicios'">
                    Descuento del {{ regularDiscount }}% en todos los servicios
                  </template>
                  <template v-else>
                    {{ benefit.descripcion }}
                  </template>
                </p>
              </div>
            </div>
            
            <!-- Membresía -->
            <div class="mt-3 p-3 rounded-xl border transition-colors duration-300"
              :class="{
                'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800': isMembershipActive,
                'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800': isMembershipPending,
                'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800': isMembershipExpired,
                'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700': isMembershipInactive
              }">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      :class="{
                        'bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400': isMembershipActive,
                        'bg-amber-100 dark:bg-amber-800/30 text-amber-600 dark:text-amber-400': isMembershipPending,
                        'bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400': isMembershipExpired,
                        'bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400': isMembershipInactive
                      }">
                      <span v-if="isMembershipActive">🏆</span>
                      <span v-else-if="isMembershipPending">⏳</span>
                      <span v-else-if="isMembershipExpired">⚠️</span>
                      <span v-else>🔒</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-medium"
                        :class="{
                          'text-blue-800 dark:text-blue-200': isMembershipActive,
                          'text-amber-800 dark:text-amber-200': isMembershipPending,
                          'text-red-800 dark:text-red-200': isMembershipExpired,
                          'text-gray-800 dark:text-gray-200': isMembershipInactive
                        }">
                        {{ isMembershipActive ? 'Membresía activa hasta' : 
                           isMembershipPending ? 'Membresía pendiente' :
                           isMembershipExpired ? 'Membresía vencida' : 'Estado de la membresía' }}
                      </p>
                      <p class="text-xs font-bold truncate"
                        :class="{
                          'text-blue-900 dark:text-white': isMembershipActive,
                          'text-amber-900 dark:text-amber-100': isMembershipPending,
                          'text-red-900 dark:text-red-100': isMembershipExpired,
                          'text-gray-900 dark:text-gray-100': isMembershipInactive
                        }">
                        {{ isMembershipActive ? membershipEndDate : membershipStatus }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Barra de progreso -->
                  <div v-if="!isMembershipInactive" class="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mb-1">
                    <div 
                      class="h-1.5 rounded-full transition-all duration-500 ease-in-out"
                      :class="{
                        'bg-gradient-to-r from-green-500 to-emerald-600': membershipProgress < 80,
                        'bg-gradient-to-r from-amber-400 to-orange-500': membershipProgress >= 80 && membershipProgress < 95,
                        'bg-gradient-to-r from-red-500 to-pink-600': membershipProgress >= 95
                      }"
                      :style="`width: ${membershipProgress}%`"
                    ></div>
                  </div>
                  
                  <div v-if="!isMembershipInactive" class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Inicio: {{ membershipStartDate }}</span>
                    <span v-if="membershipProgress > 0 && membershipProgress < 100">{{ membershipProgress }}% completado</span>
                    <span v-else-if="membershipProgress >= 100 && !diasRestantesCredito">Expirada</span>
                  </div>
                  
                  <!-- Mensaje de días restantes para crédito -->
                  <div v-if="diasRestantesCredito > 0" class="mt-2 text-xs font-medium px-2 py-1 rounded-md text-center bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    <template v-if="diasRestantesCredito > 0">
                      <span v-if="diasRestantesCredito === 1">⚠️ Tienes 1 día antes de perder tu crédito</span>
                      <span v-else>⏳ Tienes {{ diasRestantesCredito }} días antes de perder tu crédito</span>
                    </template>
                  </div>
                </div>
                
                <button 
                  @click="renovarMembresia"
                  class="w-full sm:w-auto px-3 py-2 text-white text-xs font-bold rounded-lg transition-all duration-300 shadow-md whitespace-nowrap self-center sm:self-auto flex items-center justify-center"
                  :class="{
                    'bg-gradient-to-r from-green-400 to-green-500 cursor-not-allowed': isMembershipActive,
                    'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:shadow-lg hover:-translate-y-0.5': isMembershipExpired || isMembershipInactive,
                    'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed': isMembershipPending,
                    'opacity-80': !isMembershipExpired && !isMembershipInactive
                  }"
                  :disabled="!isMembershipExpired && !isMembershipInactive"
                >
                  <svg v-if="isMembershipExpired || isMembershipInactive" class="w-3 h-3 mr-1 animate-pulse-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  {{ isMembershipActive ? 'Membresía Activa' : isMembershipPending ? 'Pendiente' : isMembershipInactive ? 'Activar ahora' : 'Renovar Ahora' }}
                </button>
              </div>
              
              <!-- Información adicional para debug -->
              <div v-if="false" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                <p>ID: {{ membershipData.id }}</p>
                <p>Estado: {{ membershipData.status }}</p>
                <p>Progreso: {{ membershipProgress }}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Service Request -->
      <section class="px-4 mb-4">
        <div class="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-2xl p-4 text-white relative overflow-hidden">
          <div class="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div class="relative">
            <h3 class="text-xl font-black mb-3 flex items-center space-x-2">
              <span>🚀</span>
              <span>Solicitar Servicio</span>
            </h3>
            
            <form @submit.prevent="handleRequestService" class="space-y-3">
              <div class="grid" :class="selectedServiceObject?.name === 'Barbería' ? 'grid-cols-2 gap-2' : 'grid-cols-1'">
                <!-- Select Principal de Servicio -->
                <div class="multiselect-service-wrapper">
                  <multiselect v-model="selectedServiceObject" 
                          :options="filteredServicesList"
                          :searchable="false"
                          :close-on-select="true"
                          :show-labels="false"
                          placeholder="Selecciona un servicio"
                          label="name"
                          track-by="id"
                          class="multiselect-transparent"
                          :custom-label="getServiceLabel"
                          :options-limit="100"
                          :option-disabled="'isDisabled'"
                          :disabled="isLoadingServices || servicesList.length === 0"
                          :loading="isLoadingServices">
                    <template #singleLabel="{ option }">
                      <span class="truncate">{{ getServiceLabel(option) }}</span>
                    </template>
                    <template #option="{ option }">
                      <div class="flex items-center gap-2" :class="{'opacity-40 grayscale pointer-events-none': option.isDisabled}">
                        <span class="flex items-center gap-2">
                          <span>{{ option.icon }}</span>
                          <span>{{ option.name }}</span>
                        </span>
                        <span v-if="option.isDisabled" class="text-[7px] font-black uppercase tracking-tighter bg-red-50 text-red-500 px-1.5 py-0.5 rounded-md border border-red-100">
                          Membresía Requerida
                        </span>
                      </div>
                    </template>
                  </multiselect>
                </div>

                <!-- Select Tipo de Barbería (Solo si es Barbería) -->
                <div v-if="selectedServiceObject?.name === 'Barbería'" class="multiselect-service-wrapper animate-fade-in">
                  <multiselect
                    v-model="barberiaTypeSelected"
                    :options="barberiaTypeOptions"
                    :searchable="false"
                    :allow-empty="true"
                    :show-labels="false"
                    placeholder="Selecciona tipo"
                    label="name"
                    track-by="id"
                    class="multiselect-transparent"
                  >
                    <template #singleLabel="{ option }">
                      <span class="flex items-center gap-2">
                        <span>{{ option.icon || '📍' }}</span>
                        <span>{{ option.name }}</span>
                      </span>
                    </template>
                    <template #option="{ option }">
                      <div class="flex items-center gap-2">
                        <span>{{ option.icon || '📍' }}</span>
                        <span>{{ option.name }}</span>
                      </div>
                    </template>
                  </multiselect>
                </div>
              </div>
              
              <!-- Selección de Barbería Específica (En local) -->
              <div v-if="selectedServiceObject?.name === 'Barbería' && serviceFormData.barberiaOption === 'en local'" class="space-y-3">
                <div class="multiselect-service-wrapper animate-fade-in">
                  <multiselect
                    v-model="serviceFormData.selectedBarberia"
                    :options="barberiasList"
                    :searchable="false"
                    :show-labels="false"
                    placeholder="Elige barbería"
                    track-by="id_barberia"
                    class="multiselect-transparent"
                  >
                    <template #singleLabel="{ option }">
                      <span class="truncate text-sm font-medium">{{ option.nombre }}</span>
                    </template>
                    <template #option="{ option }">
                      <div class="flex items-center gap-1.5 py-0.5">
                        <span class="font-bold text-sm text-white">{{ option.nombre }}</span>
                        <span class="text-[10px] text-white/60 font-medium">({{ option.colonia }})</span>
                      </div>
                    </template>
                  </multiselect>
                </div>
              </div>

                <!-- Image Placeholders for 'En local' -->
                <div v-if="selectedServiceObject?.name === 'Barbería' && serviceFormData.barberiaOption === 'en local' && serviceFormData.selectedBarberia" class="grid grid-cols-2 gap-3 animate-fade-in">
                  <div class="aspect-video rounded-xl bg-white/10 border-2 border-dashed border-white/30 flex flex-col items-center justify-center text-white/50 overflow-hidden relative group">
                    <img v-if="serviceFormData.selectedBarberia.foto1" :src="serviceFormData.selectedBarberia.foto1" class="absolute inset-0 w-full h-full object-cover">
                    <div v-else class="flex flex-col items-center">
                      <svg class="w-8 h-8 mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-[10px] font-bold uppercase tracking-wider">Imagen Local 1</span>
                    </div>
                  </div>
                  <div class="aspect-video rounded-xl bg-white/10 border-2 border-dashed border-white/30 flex flex-col items-center justify-center text-white/50 overflow-hidden relative group">
                    <img v-if="serviceFormData.selectedBarberia.foto2" :src="serviceFormData.selectedBarberia.foto2" class="absolute inset-0 w-full h-full object-cover">
                    <div v-else class="flex flex-col items-center">
                      <svg class="w-8 h-8 mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-[10px] font-bold uppercase tracking-wider">Imagen Local 2</span>
                    </div>
                  </div>
                </div>
              
              <div v-if="shouldShowFormFields" class="animate-fade-in">
                <textarea v-model="serviceFormData.description" 
                         :placeholder="selectedServiceObject?.name === 'Taxi VIP' ? '¿Cuántas personas van y en cuánto tiempo lo necesitan?' : (selectedServiceObject?.name === 'Barbería' ? '¿Qué tipo de corte desea? Ejemplo: Fade medio con barba' : 'Describe el problema o servicio que necesitas...')"
                         class="w-full px-3 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none h-20"
                />
              </div>
              
              <div v-if="shouldShowFormFields" class="grid grid-cols-2 gap-2 animate-fade-in">
                <div>
                  <input v-model="serviceFormData.colonia" 
                         type="text"
                         :readonly="selectedServiceObject?.name === 'Barbería' && serviceFormData.barberiaOption === 'en local'"
                         :placeholder="selectedServiceObject?.name === 'Taxi VIP' ? 'Lugar de recogida' : 'Colonia'"
                         class="w-full px-3 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 disabled:opacity-50"
                         :class="{'opacity-70 cursor-not-allowed': selectedServiceObject?.name === 'Barbería' && serviceFormData.barberiaOption === 'en local'}">
                </div>
                <div>
                  <input v-model="serviceFormData.direccion" 
                         type="text"
                         :readonly="selectedServiceObject?.name === 'Barbería' && serviceFormData.barberiaOption === 'en local'"
                         :placeholder="selectedServiceObject?.name === 'Taxi VIP' ? 'Lugar de destino' : 'Dirección precisa'"
                         class="w-full px-3 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 disabled:opacity-50"
                         :class="{'opacity-70 cursor-not-allowed': selectedServiceObject?.name === 'Barbería' && serviceFormData.barberiaOption === 'en local'}">
                </div>
              </div>

              <button type="submit" 
                      :disabled="!isFormValid"
                      :class="[
                        'w-full py-3 backdrop-blur-sm border font-black text-base rounded-xl transition-all duration-300',
                        isFormValid 
                          ? 'bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 cursor-pointer' 
                          : 'bg-white/10 border-white/10 text-white/50 cursor-not-allowed'
                      ]">
                Solicitar Ahora
              </button>
            </form>
          </div>
        </div>
      </section> 

    
    <!-- Paquetes por Membresía - Imagen balanceada -->
<section v-if="paquetesMantenimiento?.length" class="px-4 mb-2">
  <!-- Header -->
  <div class="flex items-end justify-between mb-6">
    <div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">
        Mercado de Paquetes 💎
      </h3>
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Compra paquetes o canjéalos con tu crédito
      </p>
    </div>
    <button 
      v-if="paquetesMantenimiento.length > 4"
      @click="navigateTo('/cliente/Marketplace')" 
      class="text-xs font-black text-blue-600 dark:text-blue-400 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full"
    >
      Ver todos
    </button>
  </div>

  <!-- Carril Horizontal con Scroll Manual y Auto-scroll JS -->
  <div class="relative -mx-4">
    <div 
      ref="carruselRef"
      class="flex gap-4 overflow-x-auto px-4 pb-4 no-scrollbar cursor-grab active:cursor-grabbing select-none"
      @mouseenter="handleInteraction"
      @mouseleave="isHovering = false"
      @touchstart="handleInteraction"
      @mousedown="handleInteraction"
      @scroll="onManualScroll"
    >
      <!-- Tarjeta con Diseño "Modern Glass Card" -->
      <div
        v-for="(paquete, index) in carouselItems"
        :key="index"
        @click="openPackageDetail(paquete)"
        class="flex-shrink-0 w-52 flex flex-col rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden transform-gpu"
      >
        <!-- Imagen con Overlay de Gradiente -->
        <div class="relative w-full h-44 overflow-hidden">
          <img
            v-if="paquete.imagen"
            :src="getOptimizedImage(paquete.imagen, 500, 400)"
            :alt="paquete.nombre"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-gray-700">
             <svg class="w-12 h-12 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>

          <!-- Badge Premium de Propiedad -->
          <div 
            v-if="tienePaquete(paquete.id)"
            class="absolute top-3 right-3 z-10"
          >
            <div class="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-[9px] font-black text-white shadow-lg uppercase tracking-widest border border-white/20">
              {{ getEstadoPaquete(paquete.id) }}
            </div>
          </div>

          <!-- Información Flotante Inferior -->
          <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent">
            <h4 class="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-300 transition-colors">
              {{ paquete.nombre }}
            </h4>
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs font-black text-blue-400">L. {{ formatNumber(paquete.costo) }}</span>
              <div class="flex items-center space-x-1">
                <span class="block w-1 h-1 bg-white/50 rounded-full"></span> 
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones Minimalistas -->
        <div class="px-3 py-3 bg-white dark:bg-gray-800">
           <button 
             class="w-full py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm"
           >
             {{ tienePaquete(paquete.id) ? 'Ver Detalles' : 'Adquirir' }}
           </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Panel de Detalle (Marketplace Style) -->
  <Transition name="bottom-sheet">
     <div 
       v-if="selectedDetailPackage" 
       class="fixed inset-0 z-[100] flex flex-col justify-end isolate"
       @touchmove.stop
     >
       <!-- Backdrop - Optimized for performance -->
       <div 
         class="absolute inset-0 bg-black/60 bs-backdrop"
         @click="closeDetail"
         @touchmove.prevent.stop
       ></div>

       <!-- Contenido (Altura Moderada) -->
       <div 
         class="relative w-full bg-white dark:bg-gray-900 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden max-h-[65vh] flex flex-col bs-content"
         @touchmove.stop
       >
         <!-- Cabecera -->
         <div class="w-full flex items-center justify-between px-6 py-4 absolute top-0 left-0 z-20 pointer-events-none">
            <div class="w-10 h-1 bg-white/40 backdrop-blur-md rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3"></div>
            <div class="flex-1"></div>
            <button 
               @click="closeDetail"
               class="w-9 h-9 rounded-full bg-black/30 backdrop-blur-xl text-white flex items-center justify-center active:scale-90 transition-transform pointer-events-auto"
            >
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
         </div>

         <!-- Área de Scroll Interno -->
         <div class="overflow-y-auto overscroll-contain no-scrollbar">
            <!-- Imagen Panorámica -->
            <div class="aspect-video w-full bg-gray-100 dark:bg-gray-800 mb-6 overflow-hidden relative">
               <img 
                  v-if="selectedDetailPackage.imagen"
                  :src="getOptimizedImage(selectedDetailPackage.imagen, 1000, 600)" 
                  class="w-full h-full object-cover"
               />
               <div class="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
             </div>

             <div class="px-6 pb-32">
                <div class="mb-6">
                   <h2 class="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-1">
                      {{ selectedDetailPackage.nombre }}
                   </h2>
                   <div class="flex items-center justify-between">
                      <p class="text-base font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">L. {{ formatNumber(selectedDetailPackage.costo) }}</p> 
                   </div>
                </div>

                <div class="prose prose-sm dark:prose-invert text-gray-500 dark:text-gray-400">
                   <h3 class="text-xs uppercase font-bold text-gray-400 mb-2 tracking-wider">Descripción</h3>
                   <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{{ selectedDetailPackage.descripcion || 'Servicio premium de mantenimiento preventivo y correctivo' }}</p>
                </div>
             </div>
          </div>

         <!-- Pie de página fijo -->
         <div 
           class="absolute bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800"
           @touchmove.prevent.stop
         >
            <div v-if="tienePaquete(selectedDetailPackage.id)">
               <button 
                  @click="initiateUseFromDetail"
                  :disabled="getEstadoPaquete(selectedDetailPackage.id) !== 'Adquirido'"
                  class="w-full py-4 rounded-2xl font-black text-base bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl"
               >
                  {{ getEstadoPaquete(selectedDetailPackage.id) === 'En uso' ? 'En Uso' : 'Usar Ahora' }}
               </button>
            </div>
            
            <div v-else class="flex gap-3">
               <button 
                  @click="initiatePurchaseFromDetail"
                  class="flex-1 py-4 rounded-2xl font-black text-base text-white shadow-xl active:scale-95 transition-transform"
                  :class="userCredit >= selectedDetailPackage.costo ? 'bg-blue-600' : 'bg-gray-900 dark:bg-gray-700'"
               >
                  <span v-if="userCredit >= selectedDetailPackage.costo">Canjear Ahora</span>
                  <span v-else>Adquirir por Transferencia</span>
               </button>
            </div>
         </div>
       </div>
     </div>
  </Transition>

  <!-- Modals Rediseñados (Matching Marketplace) -->
  
  <!-- Confirmar Uso -->
  <Transition name="modal-pop">
     <div v-if="showConfirmarUsoModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
        <div class="bg-white dark:bg-gray-800 w-full max-w-[300px] rounded-3xl p-6 text-center modal-content-pop shadow-2xl">
           <div class="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🚀</div>
           <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-1">Usar Paquete</h3>
           <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">{{ selectedPaquete?.nombre }}</p>
           <button @click="usarPaquete(selectedPaquete)" :disabled="isProcessingPayment" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm mb-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
              {{ isProcessingPayment ? 'Activando...' : 'Confirmar' }}
           </button>
           <button @click="showConfirmarUsoModal = false" class="text-xs text-gray-400 font-bold py-2 hover:text-gray-600 transition-colors">Cancelar</button>
        </div>
     </div>
  </Transition>

  <!-- Confirmar Canje -->
  <Transition name="modal-pop">
     <div v-if="showConfirmarCanjeoModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
        <div class="bg-white dark:bg-gray-800 w-full max-w-[300px] rounded-3xl p-6 text-center modal-content-pop shadow-2xl">
           <div class="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">💎</div>
           <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-4">Confirmar Canje</h3>
           <button @click="confirmarCanjeo" :disabled="isProcessingPayment" class="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm mb-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
              {{ isProcessingPayment ? 'Procesando...' : 'Canjear' }}
           </button>
           <button @click="showConfirmarCanjeoModal = false" class="text-xs text-gray-400 font-bold py-2 hover:text-gray-600 transition-colors">Cancelar</button>
        </div>
     </div>
  </Transition>

  <!-- Pago Transferencia Rediseñado Estilo Fintech -->
  <Transition name="slide-up">
    <div v-if="showPaquetePagoModal" class="fixed inset-0 z-[70] bg-white dark:bg-gray-900 flex flex-col">
       <div class="px-4 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 bg-blue-600 rounded-full"></span>
            <h2 class="font-black text-sm uppercase tracking-widest text-gray-500">Transferencia</h2>
          </div>
          <button @click="closePaquetePagoModal" class="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">✕</button>
       </div>
       
       <div class="flex-1 overflow-y-auto p-6">
          <div class="text-center mb-10">
             <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight">L. {{ formatNumber(selectedPaquete?.costo) }}</h1>
             <p class="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-2">Monto Total a Pagar</p>
          </div>

          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Cuentas Disponibles</label>
          <div class="grid grid-cols-3 gap-3 mb-10">
             <div 
                v-for="acc in bankAccounts" 
                :key="acc.id_cuenta"
                @click="verDatosCuenta(acc)"
                class="relative p-4 rounded-3xl transition-all duration-300 cursor-pointer active:scale-95 flex flex-col items-center text-center gap-3 border-2"
                :class="selectedAccountObject?.id_cuenta === acc.id_cuenta 
                  ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-600/20' 
                  : 'bg-gray-50 dark:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700'"
             >
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
                   :class="selectedAccountObject?.id_cuenta === acc.id_cuenta ? 'bg-white/20' : 'bg-white dark:bg-gray-700 shadow-sm'">
                   <svg class="w-6 h-6" :class="selectedAccountObject?.id_cuenta === acc.id_cuenta ? 'text-white' : 'text-blue-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                   </svg>
                </div>
                <p class="font-bold text-[9px] leading-tight w-full px-1 uppercase tracking-tighter"
                   :class="selectedAccountObject?.id_cuenta === acc.id_cuenta ? 'text-white' : 'text-gray-500 dark:text-gray-400'">
                   {{ acc.banco }}
                </p>
             </div>
          </div>

          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Referencia de Pago</label>
          <div class="relative group mb-10">
            <input 
               v-model="numeroComprobante"
               type="text" 
               inputmode="numeric" 
               placeholder="Ingrese el número de comprobante"
               class="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 font-bold focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none"
            >
          </div>

          <button 
             @click="procesarPagoPaquete"
             :disabled="!isValidPaymentForm || isProcessingPayment"
             class="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-base rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-30"
          >
             {{ isProcessingPayment ? 'Procesando...' : 'Enviar Comprobante' }}
          </button>
       </div>
    </div>
  </Transition>

  <!-- Modal Detalle Cuenta (Professional Fintech Redesign) -->
  <Transition name="modal-center">
    <div v-if="showAccountDetailModal" class="fixed inset-0 z-[80] flex items-center justify-center p-4">
       <div class="absolute inset-0 bg-gray-950/60 backdrop-blur-md mc-backdrop" @click="showAccountDetailModal = false"></div>
       
       <div class="bg-white dark:bg-gray-900 w-full max-w-[360px] rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-gray-100 dark:border-gray-800 mc-content">
          <div class="p-8">
             <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-4">
                   <div class="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                      <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                   </div>
                   <div>
                      <h3 class="font-black text-xl text-gray-900 dark:text-white leading-none mb-1">{{ viewingAccount?.banco }}</h3>
                      <p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{{ viewingAccount?.tipo }}</p>
                   </div>
                </div>
                <button @click="showAccountDetailModal = false" class="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400">✕</button>
             </div>

             <div class="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 mb-8">
                <div class="space-y-6">
                   <div>
                      <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Beneficiario</p>
                      <p class="text-base font-bold text-gray-900 dark:text-white">{{ viewingAccount?.beneficiario }}</p>
                   </div>
                   
                   <div class="pt-6 border-t border-gray-100 dark:border-gray-700">
                      <p class="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Número de Cuenta</p>
                      <div class="flex items-center justify-between cursor-pointer active:opacity-60 transition-opacity" @click="handleCopyAndSelect">
                         <p class="font-mono font-black text-lg text-gray-900 dark:text-white tracking-tighter">
                            {{ viewingAccount?.num_cuenta }}
                         </p>
                         <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <button 
                @click="handleCopyAndSelect"
                class="w-full py-5 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-xl shadow-gray-900/10"
             >
                <span>Copiar y Continuar</span>
             </button>

             <div class="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-center gap-2 opacity-30">
                <svg class="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
                <span class="text-[8px] font-bold uppercase tracking-[0.3em]">Encriptación Bancaria</span>
             </div>
          </div>
       </div>
    </div>
  </Transition>
</section>

      <!-- Quick Actions -->
      <section class="px-4 mb-4">
        <h3 class="text-lg font-black text-gray-900 dark:text-white mb-3">Acciones Rápidas</h3>
        <div class="grid grid-cols-2 gap-3">
          <button @click="navigateTo('/cliente/Servicios')" class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">🏠</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-xs">Ver Servicios</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Historial completo</p>
              </div>
            </div>
          </button>
          
          <button @click="navigateTo('/cliente/Perfil')" class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">👤</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-xs">Mi Perfil</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Configuración</p>
              </div>
            </div>
          </button>
          
          <button @click="navigateTo('/cliente/Soporte')" class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">💬</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-xs">Soporte</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Ayuda 24/7</p>
              </div>
            </div>
          </button>
          
          <button @click="navigateTo('/cliente/Referir')" class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">💰</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-xs">Referir</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Ganá dinero</p>
              </div>
            </div>
          </button>
        </div>
      </section>
      </main>
      </div> <!-- Close pb-24 div -->
      </div> <!-- Close max-w-2xl container -->

      <FootersFooter /> 
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-blur-lg {
  backdrop-filter: blur(16px);
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
  background: rgba(16, 185, 129, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.6);
}

button, input, textarea, select {
  min-height: 44px;
}

input, textarea, select {
  font-size: 16px;
}

html {
  scroll-behavior: smooth;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Estilos para vue-multiselect */
.multiselect-custom {
  position: relative;
  z-index: 10;
}

/* Estilos para vue-multiselect - Máxima especificidad */
.multiselect-custom.multiselect__tags {
  min-height: 44px !important;
  padding: 8px 40px 8px 12px !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 0.75rem !important;
  background: linear-gradient(to bottom right, #4f46e5, #2563eb, #0891b2) !important;
  backdrop-filter: blur(8px) !important;
  font-size: 16px !important;
  transition: all 0.2s ease !important;
  color: white !important;
}

.dark .multiselect-custom.multiselect__tags {
  background: linear-gradient(to bottom right, #4f46e5, #2563eb, #0891b2) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
}

/* Forzar estilos sobre clases globales */
.multiselect-custom .multiselect__tags,
.dark .multiselect-custom .multiselect__tags,
body .multiselect-custom .multiselect__tags,
html .multiselect-custom .multiselect__tags {
  background: linear-gradient(to bottom right, #4f46e5, #2563eb, #0891b2) !important;
  color: white !important;
}

/* Enfoque 3: Contenedor wrapper con multiselect transparente */
.multiselect-service-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  min-height: 44px;
  padding: 8px 40px 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
  cursor: pointer;
}

.multiselect-service-wrapper:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.multiselect-service-wrapper.active {
  border-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

.multiselect-transparent .multiselect__tags {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  min-height: auto !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

:deep(.multiselect-transparent .multiselect__placeholder) {
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 16px;
}

.multiselect-transparent .multiselect__single {
  color: white !important;
  font-size: 16px;
  font-weight: 500;
}

.multiselect-transparent .multiselect__select {
  padding: 0 !important;
  right: 12px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.multiselect-transparent .multiselect__select::before {
  border-color: white transparent transparent;
}

.multiselect-transparent .multiselect__content-wrapper {
  background-color: rgba(30, 41, 59, 0.98) !important; /* Slate muy oscuro (casi negro) */
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  margin-top: 4px;
  z-index: 50;
}

.multiselect-transparent .multiselect__option {
  padding: 12px 16px;
  min-height: 44px;
  font-size: 16px;
  cursor: pointer;
  color: white !important; /* Nombre en blanco */
  transition: all 0.2s ease;
}

.multiselect-transparent .multiselect__option:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white !important;
}

.multiselect-transparent .multiselect__option--selected {
  background-color: rgba(59, 130, 246, 0.2);
  color: white !important;
  font-weight: 600;
}

.multiselect-transparent .multiselect__option--highlight {
  background-color: rgba(59, 130, 246, 0.5) !important;
  color: white !important;
}

.multiselect-transparent .multiselect__option--highlight::after {
  content: '';
}

/* Estilos profundos para asegurar que se apliquen a las opciones deshabilitadas */
:deep(.multiselect-transparent .multiselect__option--disabled) {
  background: #f9fafb !important;
  color: #9ca3af !important;
  cursor: not-allowed !important;
  opacity: 0.6 !important;
}

:deep(.multiselect-transparent .multiselect__option--disabled *) {
  color: #9ca3af !important;
}

.multiselect-custom .multiselect__tags:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.multiselect-custom.multiselect--active .multiselect__tags {
  border-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

:deep(.multiselect-custom .multiselect__placeholder) {
  margin-bottom: 0;
  padding: 0;
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 16px;
}

:deep(.dark .multiselect-custom .multiselect__placeholder) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.multiselect-custom .multiselect__single {
  margin-bottom: 0;
  padding: 0;
  color: white !important;
  font-size: 16px;
  font-weight: 500;
}

.dark .multiselect-custom .multiselect__single {
  color: white !important;
}

.multiselect-custom .multiselect__select {
  padding: 8px 12px;
}

.multiselect-custom .multiselect__select::before {
  border-color: white transparent transparent;
  top: 65%;
}

.multiselect-custom .multiselect__content-wrapper {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  z-index: 50;
}

.multiselect-custom .multiselect__content {
  list-style: none;
  padding: 0;
  margin: 0;
}

.multiselect-custom .multiselect__element {
  padding: 0;
}

.multiselect-custom .multiselect__option {
  padding: 12px 16px;
  min-height: 44px;
  font-size: 16px;
  cursor: pointer;
  color: #374151;
  transition: all 0.2s ease;
}

.multiselect-custom .multiselect__option:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.multiselect-custom .multiselect__option--selected {
  background-color: #dbeafe;
  color: #1e40af;
  font-weight: 600;
}

.multiselect-custom .multiselect__option--highlight {
  background-color: #3b82f6;
  color: white;
}

.multiselect-custom .multiselect__option--highlight::after {
  content: '';
}

.multiselect-custom .multiselect__option--disabled {
  background: #f3f4f6 !important;
  color: #9ca3af !important;
  cursor: not-allowed !important;
  opacity: 0.6;
}

.multiselect-custom .multiselect__spinner {
  background: transparent;
}

.multiselect-custom .multiselect__spinner::before,
.multiselect-custom .multiselect__spinner::after {
  border-color: white transparent transparent;
}

/* Ocultar barra de scroll pero mantener funcionalidad */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.cursor-grab { cursor: grab; }
.cursor-grabbing { cursor: grabbing; }

/* Bottom Sheet Transitions */
.bottom-sheet-enter-active, .bottom-sheet-leave-active {
  transition: opacity 0.3s ease;
}

.bs-content {
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.15) !important;
  will-change: transform; /* Hint to browser for faster animation */
}

.bottom-sheet-enter-active .bs-backdrop { transition: opacity 0.3s ease; }
.bottom-sheet-enter-from .bs-backdrop { opacity: 0; }
.bottom-sheet-enter-to .bs-backdrop { opacity: 1; }

.bottom-sheet-leave-active .bs-backdrop { transition: opacity 0.25s ease; }
.bottom-sheet-leave-from .bs-backdrop { opacity: 1; }
.bottom-sheet-leave-to .bs-backdrop { opacity: 0; }

.bottom-sheet-enter-active .bs-content {
  animation: slide-up-custom 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.bottom-sheet-leave-active .bs-content {
  transition: transform 0.4s ease-in;
  transform: translateY(0);
}

.bottom-sheet-leave-to .bs-content {
  transform: translateY(100%);
}

@keyframes slide-up-custom {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* Carrusel Auto-scroll */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Modal Pop (Symmetric) */
.modal-pop-enter-active, .modal-pop-leave-active {
   transition: opacity 0.3s ease;
}
.modal-pop-enter-active .modal-content-pop, .modal-pop-leave-active .modal-content-pop {
   transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-pop-enter-from, .modal-pop-leave-to {
   opacity: 0;
}
.modal-pop-enter-from .modal-content-pop, .modal-pop-leave-to .modal-content-pop {
   transform: scale(0.9);
}

/* Slide Up (Fintech Modal) */
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

/* Modal Center Transitions */
.modal-center-enter-active, .modal-center-leave-active {
   transition: opacity 0.35s ease;
}
.modal-center-enter-active .mc-backdrop, 
.modal-center-leave-active .mc-backdrop {
   transition: opacity 0.3s ease;
}
.modal-center-enter-active .mc-content {
   transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-center-leave-active .mc-content {
   transition: all 0.25s cubic-bezier(0.32, 0, 0.67, 0);
}
.modal-center-enter-from .mc-backdrop { opacity: 0; }
.modal-center-enter-from .mc-content { opacity: 0; transform: scale(0.8) translateY(60px); }
.modal-center-leave-to .mc-backdrop { opacity: 0; }
.modal-center-leave-to .mc-content { opacity: 0; transform: scale(0.9) translateY(20px); }
</style>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import Toast from '~/components/ui/Toast.vue'

import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Multiselect from 'vue-multiselect' 

// =========================
// CONFIGURACIÓN Y SETUP
// =========================
const { $api } = useNuxtApp();

const router = useRouter()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'MiSeguro - Dashboard',
  meta: [
    { name: 'description', content: 'Panel de control de MiSeguro - Gestiona tus servicios y membresía' },
    { name: 'keywords', content: 'dashboard, MiSeguro, servicios, membresía, panel de control' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// =========================
// VARIABLES REACTIVAS
// =========================

// Estado de carga y datos principales
const isLoading = ref(true)
const isLoadingProgress = ref(false)
const isLoadingServices = ref(false)

// Datos del usuario
const userData = ref({
  id: null,
  identidad: '',
  nombre: 'Invitado',
  email: '',
  role: '',
  rol_nombre: 'Invitado',
  name: 'Invitado',
  ...(userCookie.value || {})
})

// Estados de datos
const statsData = ref({
  totalServices: 0,
  credit: 0,
  membershipMonths: 0
})

// Estados de membresía
const membershipData = ref({
  id: null,
  status: 'inactiva',
  progress: 0,
  startDate: null,
  endDate: null
})

// Estado para controlar si se ha realizado el reinicio de crédito
const creditResetDone = ref(false)

// Estados de beneficios
const beneficios = ref([]);
const loadingBenefits = ref(false);
const benefitsError = ref(null);
const specialDiscount = ref('15'); // Valor por defecto para descuento especial
const regularDiscount = ref('10'); // Valor por defecto para descuento regular

// Estados de servicios
const servicesList = ref([])
const serviceFormData = ref({
  type: '',
  description: '',
  colonia: '',
  direccion: '',
  barberiaOption: null,
  selectedBarberia: null
})

const barberiasList = ref([])


const selectedServiceObject = ref(null)

// Función para obtener la etiqueta del servicio
const getServiceLabel = (option) => {
  if (!option) return ''
  let label = `${option.icon} ${option.name}`
  if (option.name === 'Taxi VIP' && !isMembershipActive.value) {
    label += ' (Membresía Necesaria)'
  }
  return label
}

// Opciones para tipo de barbería
const barberiaTypeOptions = [
  { id: 'a domicilio', name: 'A domicilio', icon: '🏠' },
  { id: 'en local', name: 'En local', icon: '💈' }
]

const barberiaTypeSelected = computed({
  get: () => barberiaTypeOptions.find(o => o.id === serviceFormData.value.barberiaOption) || null,
  set: (val) => {
    if (val) serviceFormData.value.barberiaOption = val.id
    else serviceFormData.value.barberiaOption = null
  }
})

// Estados de notificaciones
const recentServicesData = ref([]);
const paquetesMantenimiento = ref([]);
const paquetesUsuario = ref([]);
const cargandoPaquetes = ref(true);

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Variable reactiva para almacenar el número de teléfono de la empresa
const empresaPhoneNumber = ref('');

// =========================
// COMPUTED PROPERTIES
// =========================

// Obtener solo los dos primeros nombres
const shortName = computed(() => {
  if (!userData.value.nombre) return 'Invitado'
  const names = userData.value.nombre.split(' ')
  return names.length > 2 ? `${names[0]} ${names[1]}` : userData.value.nombre
})

// Computed properties para la membresía
const isMembershipActive = computed(() => {
  return membershipData.value.status === 'activa'
})

const isMembershipPending = computed(() => {
  return membershipData.value.status === 'pendiente'
})

const isMembershipExpired = computed(() => {
  return membershipData.value.status === 'vencida' || 
         (membershipData.value.status === 'activa' && membershipData.value.progress >= 100)
})

const isMembershipInactive = computed(() => {
  return !membershipData.value.status || membershipData.value.status === 'inactiva' || membershipData.value.status === 'rechazada'
})

const membershipProgress = computed(() => membershipData.value.progress || 0)

const membershipEndDate = computed(() => {
  if (!membershipData.value.endDate) return 'Fecha no disponible'
  
  return new Date(membershipData.value.endDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const membershipStartDate = computed(() => {
  if (!membershipData.value.startDate) return 'N/A';
  
  return new Date(membershipData.value.startDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
})

const membershipStatus = computed(() => {
  const status = membershipData.value.status || 'inactiva'
  
  const statusMap = {
    'activa': 'Activa',
    'pendiente': 'Pendiente de verificación',
    'vencida': 'Vencida',
    'inactiva': 'Sin membresía',
    'vencida_reiniciada': 'Crédito reiniciado'
  }
  
  return statusMap[status] || 'Sin membresía'
})

// Días restantes antes de perder el crédito (3 días después del vencimiento)
const diasRestantesCredito = computed(() => {
  if (!membershipData.value.endDate) return null;
  
  const fechaVencimiento = new Date(membershipData.value.endDate);
  const fechaLimite = new Date(fechaVencimiento);
  
  // Obtener el período de gracia de la membresía o usar 3 días por defecto
  const diasGracia = membershipData.value.diasGracia || 3;
  fechaLimite.setDate(fechaLimite.getDate() + diasGracia);
  
  const hoy = new Date();
  const diffTime = fechaLimite - hoy;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Solo mostrar días restantes si ya pasó la fecha de vencimiento
  return hoy > fechaVencimiento ? Math.max(0, diffDays) : null;
})

// Computed para mapear los beneficios al formato esperado por la UI
const benefitsToShow = computed(() => {
  if (!beneficios.value || !Array.isArray(beneficios.value)) return [];
  
  return [...beneficios.value]
    .sort((a, b) => (a.mes_requerido || 0) - (b.mes_requerido || 0))
    .map(benefit => ({
      ...benefit,
      mes_requerido: benefit.mes_requerido || 0,
      tipo_beneficio: benefit.tipo_beneficio || 'Beneficio',
      descripcion: benefit.descripcion || '',
      savings: benefit.savings || ''
    }));
})

// Memoria persistente para los paquetes aleatorios (evita re-shuffles constantes)
const displayedPaquetes = ref([])

// Solo barajar cuando los paquetes de mantenimiento cambian
watch(paquetesMantenimiento, (newVal) => {
  if (newVal?.length > 0) {
    displayedPaquetes.value = [...newVal]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
  }
}, { immediate: true, deep: true })

// Lista duplicada para el scroll infinito (estable)
const carouselItems = computed(() => {
  if (!displayedPaquetes.value.length) return []
  return [...displayedPaquetes.value, ...displayedPaquetes.value]
})

// Computed para obtener el mes actual relativo al inicio de la membresía
const currentMonth = computed(() => {
  if (!membershipData.value?.fecha_inicio) return 0
  const startDate = new Date(membershipData.value.fecha_inicio)
  const now = new Date()
  const months = (now.getFullYear() - startDate.getFullYear()) * 12
  return months + now.getMonth() - startDate.getMonth()
})

// Computed properties para el progreso
const progressCircle = computed(() => {
  const progress = Math.min(statsData.value.membershipMonths, 6) / 6 * 100
  return `${progress}, 100`
})

const progressCount = computed(() => {
  return Math.min(statsData.value.membershipMonths, 6)
})

const progressMessage = computed(() => {
  const month = statsData.value.membershipMonths
  if (month >= 6) return '¡Has desbloqueado todos los beneficios!'
  if (month >= 3) return 'Ya Puedes Adquirir el Paquete de Limpieza de Aire Acondicionado'
  if (month >= 2) return 'Ya puedes usar lo abonado en Membresía para pagar Servicios'
  if (month >= 1) return 'Ya tienes descuentos disponibles'
  return 'Empieza a acumular beneficios con tu membresía'
})

const recentServicesDisplay = computed(() => {
  return recentServicesData.value.slice(0, 3)
})

const shouldShowFormFields = computed(() => {
  // Solo aplicar lógica de ocultar para el servicio de Barbería
  if (selectedServiceObject.value?.name === 'Barbería') {
    if (serviceFormData.value.barberiaOption === 'a domicilio') return true;
    if (serviceFormData.value.barberiaOption === 'en local' && serviceFormData.value.selectedBarberia) return true;
    return false; // Ocultos mientras selecciona modalidad/local
  }
  
  // Para el resto de servicios (o si no hay selección aún), se muestran siempre
  return true;
})

const isFormValid = computed(() => {
  const isBarberia = selectedServiceObject.value?.name === 'Barbería';
  const isEnLocal = serviceFormData.value.barberiaOption === 'en local';
  const isDomicilio = serviceFormData.value.barberiaOption === 'a domicilio';
  
  const basicFields = serviceFormData.value.type &&
    serviceFormData.value.description.trim() !== '';

  if (isBarberia) {
    if (!serviceFormData.value.barberiaOption) return false;
    
    if (isEnLocal) {
      return basicFields && serviceFormData.value.selectedBarberia;
    }
    
    if (isDomicilio) {
      return basicFields && 
        serviceFormData.value.colonia.trim() !== '' &&
        serviceFormData.value.direccion.trim() !== '';
    }
  }
  
  return basicFields &&
    serviceFormData.value.colonia.trim() !== '' &&
    serviceFormData.value.direccion.trim() !== ''
})

// Mostrar todos los servicios, pero marcar Taxi VIP como deshabilitado si no hay membresía activa
const filteredServicesList = computed(() => {
  return servicesList.value.map(s => ({
    ...s,
    isDisabled: s.name === 'Taxi VIP' && !isMembershipActive.value
  }))
})

// Si el usuario pierde la membresía y tenía 'Taxi VIP' seleccionado, limpiar la selección
watch(isMembershipActive, (isActive) => {
  if (!isActive && selectedServiceObject.value?.name === 'Taxi VIP') {
    selectedServiceObject.value = null
    serviceFormData.value.type = ''
  }
})

// Si el usuario cambia la opción de barbería, limpiar la selección y los campos relacionados
watch(() => serviceFormData.value.barberiaOption, (newVal) => {
  if (newVal === 'a domicilio') {
    serviceFormData.value.selectedBarberia = null
    serviceFormData.value.colonia = ''
    serviceFormData.value.direccion = ''
  }
})

// Si se selecciona una barbería, rellenar colonia y dirección automáticamente
watch(() => serviceFormData.value.selectedBarberia, (newVal) => {
  if (newVal && serviceFormData.value.barberiaOption === 'en local') {
    serviceFormData.value.colonia = newVal.colonia || ''
    serviceFormData.value.direccion = newVal.direccion_precisa || ''
  }
})

// Limpiar datos de barbería y campos de dirección si se cambia de servicio
watch(selectedServiceObject, (newVal) => {
  if (newVal) {
    serviceFormData.value.barberiaOption = null
    serviceFormData.value.selectedBarberia = null
    serviceFormData.value.colonia = ''
    serviceFormData.value.direccion = ''
    serviceFormData.value.description = ''
  }
})

// =========================
// FUNCIONES UTILITARIAS
// =========================

// Get appropriate icon based on service name
const getServiceIcon = (serviceName) => {
  const name = serviceName.toLowerCase()
  if (name.includes('fontanería')) return '🚰'
  if (name.includes('electricidad')) return '💡'
  if (name.includes('pintura')) return '🎨'
  if (name.includes('carpintería')) return '🔨'
  if (name.includes('jardinería')) return '🌱'
  if (name.includes('limpieza')) return '🧹'
  if (name.includes('aire') || name.includes('clima')) return '❄️'
  if (name.includes('taxi')) return '🚕'
  if (name.includes('barbería')) return '💈'
  return '🔧'
}

const getStatusColor = (status) => {
  const colors = {
    'Completado': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'En progreso': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'En camino': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Programado': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'Cancelado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

// =========================
// FUNCIONES DE ESTILO
// =========================

const getBenefitStyle = (month) => {
  return statsData.value.membershipMonths >= month ? 
    'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 
    'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
}

const getBenefitIconStyle = (month) => {
  return statsData.value.membershipMonths >= month ? 
    'bg-green-500 text-white' : 
    'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
}

const getBenefitIcon = (month) => {
  return statsData.value.membershipMonths >= month ? '✓' : month.toString()
}

const getBenefitTextStyle = (month) => {
  return statsData.value.membershipMonths >= month ? 
    'text-green-700 dark:text-green-300' : 
    'text-gray-600 dark:text-gray-400'
}

const getBenefitTitleStyle = (month) => {
  return statsData.value.membershipMonths >= month ? 
    'text-green-800 dark:text-green-200' : 
    'text-gray-700 dark:text-gray-300'
}

// =========================
// FUNCIONES DE CARGA DE DATOS
// =========================

// Función para obtener el crédito del usuario
const fetchUserCredit = async () => {
  try {
    const user = useCookie('user').value
    if (!user?.id_usuario) return
    
    const response = await $api(`/credito/usuario/${user.id_usuario}`, {
      method: 'GET'
    })

    if (response?.success && response.data) {
      userCredit.value = response.data.monto_credito
    } else {
      console.warn('La respuesta no contiene datos de crédito válidos:', response)
    }
  } catch (error) {
    console.error('Error al obtener el crédito del usuario:', error)
    userCredit.value = 0
  }
}

// Función para obtener el progreso de la membresía
const fetchMembershipProgress = async () => {
  try {
    isLoadingProgress.value = true
    
    const userCookie = useCookie('user')
    const userData = userCookie.value
    
    if (!userData || !userData.id_usuario) {
      return
    }

    const response = await $api(`/membresia/progreso/${userData.id_usuario}`, {
      method: 'GET',
      ignoreResponseError: true
    }).catch(() => null)

    if (response?.status === 'success') {
      statsData.value.membershipMonths = response.mesesProgreso || 0
      statsData.value.credit = response.montoTotal || 0
    }
  } catch (error) {
    // Silenciar errores
  } finally {
    isLoadingProgress.value = false
  }
}

// Función para verificar si ha pasado el período de gracia desde el vencimiento
const haPasadoPeriodoDeGracia = (fechaVencimiento, diasGracia) => {
  if (typeof diasGracia === 'undefined' || diasGracia === null) {
    console.error('❌ Error: No se proporcionó el período de gracia');
    return false;
  }
  
  const hoy = new Date();
  const fechaLimite = new Date(fechaVencimiento);
  fechaLimite.setDate(fechaLimite.getDate() + parseInt(diasGracia, 10)); 
  
  return hoy > fechaLimite
}

const fetchMembershipData = async () => { 

  const userCookie = useCookie('user');
  const userData = userCookie.value;

  if (!userData || !userData.id_usuario) {
    membershipData.value = { status: 'inactiva', progress: 0 };
    return { status: 'not_found' };
  }

  try {
    const response = await $api(`/membresia/${userData.id_usuario}`, {
      method: 'GET'
    });

    // Caso: no hay membresía activa
    if (response.status === 'not_found' || (response.status === 'success' && !response.data)) {
      membershipData.value = { status: 'inactiva', progress: 0 };
      return { status: 'not_found' };
    }

    // Caso: membresía válida
    if (response.status === 'success' && response.data) {
      const membresia = response.data;

      if (!membresia.fecha) {
        console.warn('⚠️ Fecha de membresía no válida:', membresia);
        membershipData.value = { status: 'inactiva', progress: 0 };
        return { status: 'not_found' };
      }

      const DURACION_MEMBRESIA_DIAS = 30; // La membresía siempre dura 30 días
      const fechaInicio = new Date(membresia.fecha);
      const fechaVencimiento = new Date(fechaInicio);
      
      // Establecer la fecha de vencimiento a 30 días después de la fecha de inicio
      fechaVencimiento.setDate(fechaVencimiento.getDate() + DURACION_MEMBRESIA_DIAS);
      
      // Obtener el período de gracia desde la API
      const diasGracia = await getCreditResetPeriod();
      
      const hoy = new Date();
      const totalDias = DURACION_MEMBRESIA_DIAS; // La duración total es siempre 30 días
      const diasTranscurridos = (hoy - fechaInicio) / (1000 * 60 * 60 * 24);
      const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
      const progreso = Math.min(100, Math.max(0, Math.round((diasTranscurridos / totalDias) * 100)));
      
      let estado = membresia.estado;
      const estaVencida = progreso >= 100;
      
      // Verificar si la membresía está vencida o está activa pero debería estar vencida
      const esMembresiaVencida = estaVencida && (membresia.estado === 'activa' || membresia.estado === 'vencida');
      
      if (esMembresiaVencida) {
        if (membresia.estado === 'activa') {
          estado = 'vencida';
        }

        const haPasadoGracia = haPasadoPeriodoDeGracia(fechaVencimiento, diasGracia);
        
        if (haPasadoGracia && !creditResetDone.value) {
          try {
            // Solo actualizar si el estado no es 'vencida'
            if (membresia.estado !== 'vencida') {
              await updateMembershipToExpired(membresia.id_membresia);
            }
            await resetCredito();
            creditResetDone.value = true;
          } catch (error) {
            console.error('Error al reiniciar crédito automáticamente:', error);
          }
        }
      }

      const membershipInfo = {
        id: membresia.id_membresia,
        status: estado,
        progress: progreso,
        startDate: fechaInicio,
        endDate: fechaVencimiento,
        estado,
        diasGracia, // Añadir el período de gracia al objeto membershipInfo
        puedeReiniciar: haPasadoPeriodoDeGracia(fechaVencimiento, diasGracia) && !creditResetDone.value
      };

      membershipData.value = membershipInfo;
      return membershipInfo;
    }

    // Cualquier otro caso inesperado
    console.warn('⚠️ Respuesta inesperada de membresía:', response);
    membershipData.value = { status: 'inactiva', progress: 0 };
    return { status: 'not_found' };

  } catch (error) {
    console.error('❌ Error al obtener datos de la membresía:', error);
    membershipData.value = { status: 'inactiva', progress: 0 };
    return { status: 'not_found' };
  }
};



// Función para obtener el total de solicitudes de servicio del usuario
const fetchTotalSolicitudes = async () => {
  try {
    const user = useCookie('user').value
    if (!user || !user.id_usuario) return

    const response = await $api(`/solicitudservicio/usuario/${user.id_usuario}`, {
      method: 'GET'
    })

    if (response && typeof response.total === 'number') {
      statsData.value.totalServices = response.total
    }
  } catch (error) {
    console.error('Error al obtener el total de solicitudes:', error)
  }
}

// Cargar servicios desde la API
const fetchServices = async () => {
  try {
    isLoadingServices.value = true
    const user = useCookie('user').value
    const id_ciudad = user?.id_ciudad
    
    const data = await $api('/servicios', {
      method: 'GET',
      params: id_ciudad ? { id_ciudad } : {}
    })
    
    if (Array.isArray(data)) {
      servicesList.value = data.map(service => ({
        id: service.id_servicio,
        name: service.nombre,
        description: service.descripcion,
        icon: getServiceIcon(service.nombre)
      }))
    }
  } catch (error) {
    console.error('Error al cargar servicios:', error)
    showToast('No se pudieron cargar los servicios. Intente nuevamente.', 'error')
  } finally {
    isLoadingServices.value = false
  }
}

const fetchBarberias = async () => {
  try {
    const data = await $api('/barberias', {
      method: 'GET'
    })
    if (Array.isArray(data)) {
      barberiasList.value = data
    }
  } catch (error) {
    console.error('Error al cargar barberías:', error)
  }
}

// Fetch beneficios desde la API
const fetchBeneficios = async () => {
  loadingBenefits.value = true;
  benefitsError.value = null;
  
  try {
    const response = await $api('/membresiabeneficios', {
      method: 'GET'
    });
    
    // Asegurarse de que la respuesta tenga la estructura esperada
    if (response && Array.isArray(response.beneficios)) {
      beneficios.value = response.beneficios.map(benefit => ({
        ...benefit,
        mes_requerido: benefit.mes_requerido || 0,
        tipo_beneficio: benefit.tipo_beneficio || 'Beneficio',
        descripcion: benefit.descripcion || '',
        savings: benefit.savings || ''
      }));
      
      // Guardar los porcentajes de descuento si están disponibles
      if (response.valores) {
        if (response.valores.porcentaje_descuento_especial) {
          specialDiscount.value = response.valores.porcentaje_descuento_especial;
        }
        if (response.valores.porcentaje_descuento) {
          regularDiscount.value = response.valores.porcentaje_descuento;
        }
      }
    } else if (Array.isArray(response)) {
      // Para compatibilidad con versiones anteriores de la API
      beneficios.value = response;
    } else {
      throw new Error('Formato de respuesta inesperado');
    }
    
    // Si no hay beneficios, establecer un array vacío
    if (!beneficios.value || beneficios.value.length === 0) {
      console.warn('No se encontraron beneficios');
      beneficios.value = [];
    }
  } catch (error) {
    console.error('Error al cargar beneficios:', error);
    benefitsError.value = 'No se pudieron cargar los beneficios. Intente más tarde.';
    beneficios.value = []; // Asegurar que sea un array vacío en caso de error
  } finally {
    loadingBenefits.value = false;
  }
}

// Función para formatear números con separadores de miles
const formatNumber = (value) => {
  if (value === undefined || value === null) return '0.00';
  return new Intl.NumberFormat('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Función para obtener el número de teléfono de la empresa
const fetchEmpresaPhoneNumber = async () => {
  try {
    const response = await $api('/config/valor/numero_empresa', {
      method: 'GET'
    });
    
    if (response && response.valor) {
      empresaPhoneNumber.value = response.valor;
    }
  } catch (error) {
    console.error('Error al obtener el número de teléfono de la empresa:', error);
    // Establecer un valor por defecto en caso de error
    empresaPhoneNumber.value = '1234567890';
  }
};

// Función para enviar detalles por WhatsApp
const sendWhatsAppMessage = async (data, type) => {
  try {
    // Si no tenemos el número de teléfono, intentar obtenerlo
    if (!empresaPhoneNumber.value) {
      await fetchEmpresaPhoneNumber();
    }
    
    const today = new Date();
    const formattedDate = [
      String(today.getDate()).padStart(2, '0'),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getFullYear()).slice(-2)
    ].join('');

    let message = '';
    
    if (type === 'package_payment') {
      // Mensaje para comprobante de pago de paquete
      message = `*Comprobante de Pago de Paquete*\n\n` +
        `*ID:* ${formattedDate}-${data.id_paquete_usuario}\n` +
        `*Paquete:* ${data.nombre_paquete}\n` + 
        `*N° de comprobante:* ${data.receiptNumber}\n` +
        `*Monto:* L. ${formatNumber(data.amount)}\n\n` +
        `Adjunto una captura del comprobante de pago para su verificación.`;
    } else if (type === 'use_package') {
      // Mensaje para solicitud de uso de paquete
      // Mensaje general para solicitud de uso de paquete
      message =
        `*Solicitud de Uso de Paquete*\n\n` +
        `Hola, deseo solicitar el uso de un paquete adquirido a través de la plataforma MiSeguro.\n\n` +
        `*ID:* ${formattedDate}-${data.id_paquete_usuario}\n` +
        `*Paquete:* ${data.nombre_paquete}\n` +
        `Quedo atento(a) a la coordinación correspondiente.`;
    }
    
    if (!message) return;

    // Codificar el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);
    
    // Usar el número de teléfono de la empresa o uno por defecto
    const phoneNumber = empresaPhoneNumber.value || '1234567890';
    
    // Abrir WhatsApp Web con el mensaje predefinido
    window.open(`https://wa.me/+504${phoneNumber}?text=${encodedMessage}`, '_blank');
  } catch (error) {
    console.error('Error al preparar el mensaje de WhatsApp:', error);
  }
};

// =========================
// FUNCIONES DE NAVEGACIÓN
// =========================

const renovarMembresia = () => {
  navigateTo('/cliente/perfil#membresia')
}


// Estado para manejar la carga de imágenes
const imageLoaded = ref({});

// Función para obtener la URL de la imagen optimizada con Cloudinary
const getOptimizedImage = (url, width = 400, height = 250) => {
  if (!url) return null;
  
  // Si ya es una URL de Cloudinary, aplicar transformaciones
  if (url.includes('res.cloudinary.com')) {
    // Extraer la parte de la URL antes de las transformaciones
    const baseUrl = url.split('/upload/')[0] + '/upload/';
    const restOfUrl = url.split('/upload/')[1];
    
    // Aplicar transformaciones de optimización
    return `${baseUrl}c_fill,w_${width},h_${height},f_auto,q_auto/${restOfUrl}`;
  }
  
  // Si no es una URL de Cloudinary, devolver la URL original
  return url;
};

// Función para manejar errores de carga de imágenes
const handleImageError = (paqueteId) => {
  // Marcar como error para mostrar el ícono de error
  imageLoaded.value[paqueteId] = 'error';
};

// Carrusel Auto-scroll Logic
const carruselRef = ref(null);
const isHovering = ref(false);
const isInteracting = ref(false);
let animationFrame = null;
let currentScroll = 0;
let resumeTimeout = null;
let isAutoScrolling = false;

const handleInteraction = () => {
  isInteracting.value = true;
  if (resumeTimeout) clearTimeout(resumeTimeout);
  
  resumeTimeout = setTimeout(() => {
    isInteracting.value = false;
    // Sincronizar posición final
    if (carruselRef.value) currentScroll = carruselRef.value.scrollLeft;
  }, 2000);
};

const onManualScroll = () => {
  if (!isAutoScrolling) {
    handleInteraction();
  }
};

const startAutoScroll = () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  
  const scroll = () => {
    // Si el modal está abierto, NO ejecutar el siguiente frame para ahorrar recursos
    if (selectedDetailPackage.value) {
      animationFrame = null;
      return;
    }

    if (carruselRef.value) {
      if (!isHovering.value && !isInteracting.value) {
        // Incrementar posición con precisión decimal
        currentScroll += 0.6; 
        
        const halfWidth = carruselRef.value.scrollWidth / 2;
        
        if (currentScroll >= halfWidth) {
          currentScroll = 0;
        }
        
        isAutoScrolling = true;
        carruselRef.value.scrollLeft = currentScroll;
        // Pequeño delay para que el evento scroll no detecte esto como manual inmediatamente
        requestAnimationFrame(() => { isAutoScrolling = false; });
      } else {
        // Sincronizar currentScroll con la posición real mientras el usuario interactúa
        currentScroll = carruselRef.value.scrollLeft;
      }
    }
    animationFrame = requestAnimationFrame(scroll);
  };
  
  animationFrame = requestAnimationFrame(scroll);
};

const stopAutoScroll = () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
};

// Reiniciar scroll si cambian los paquetes o al montar
watch(displayedPaquetes, (newVal) => {
  if (newVal && newVal.length > 0) {
    nextTick(() => {
      startAutoScroll();
    });
  }
});

onMounted(() => {
  if (displayedPaquetes.value?.length > 0) {
    startAutoScroll();
  }
});

onUnmounted(() => {
  stopAutoScroll();
});

// Detail Sheet Logic
const selectedDetailPackage = ref(null)

const openPackageDetail = (p) => {
  selectedDetailPackage.value = p
  isHovering.value = true;
  stopAutoScroll(); // Apagar el loop completamente
}

const closeDetail = () => {
  selectedDetailPackage.value = null
  isHovering.value = false;
  startAutoScroll(); // Reiniciar el loop
}

const initiatePurchaseFromDetail = () => {
  const p = selectedDetailPackage.value
  closeDetail()
  setTimeout(() => {
    canjearPaquete(p)
  }, 300)
}

const initiateUseFromDetail = () => {
  const p = selectedDetailPackage.value
  closeDetail()
  setTimeout(() => {
    handlePaqueteClick(p)
  }, 300)
}

// Estado del modal de pago de paquete
const showPaquetePagoModal = ref(false);
const showAccountDetailModal = ref(false);
const viewingAccount = ref(null);
const showConfirmarUsoModal = ref(false);
const showConfirmarCanjeoModal = ref(false);
const selectedPaquete = ref(null);
const isLoadingAccounts = ref(false);
const bankAccounts = ref([]);
const selectedAccountObject = ref(null);
const isProcessingPayment = ref(false);
const numeroComprobante = ref('');

// Bloquear scroll cuando un modal está abierto
const anyModalOpen = computed(() => {
  return !!selectedDetailPackage.value || 
         showPaquetePagoModal.value || 
         showAccountDetailModal.value || 
         showConfirmarUsoModal.value || 
         showConfirmarCanjeoModal.value
})

watch(anyModalOpen, (newValue) => {
  if (process.client) {
    const overflowValue = newValue ? 'hidden' : ''
    document.body.style.overflow = overflowValue
    document.documentElement.style.overflow = overflowValue
  }
})


const verDatosCuenta = (acc) => {
   viewingAccount.value = acc
   selectedAccountObject.value = acc // Auto-seleccionar al hacer clic
   showAccountDetailModal.value = true
}

const handleCopyAndSelect = async () => {
   if (!viewingAccount.value) return
   const accountNumber = viewingAccount.value.num_cuenta
   if (!accountNumber) return
   
   selectedAccountObject.value = viewingAccount.value
   await copyToClipboard(accountNumber)
   
   // Feedback visual antes de cerrar
   setTimeout(() => {
      showAccountDetailModal.value = false
   }, 1000)
}

const isValidPaymentForm = computed(() => {
  return selectedAccountObject.value && numeroComprobante.value?.length > 3
})

// Función para cargar los paquetes activos desde la API
const cargarPaquetesActivos = async () => {
  try {
    cargandoPaquetes.value = true;
    const user = useCookie('user').value;
    const id_ciudad = user?.id_ciudad;
    const id_usuario = user?.id_usuario;

    const response = await $api('/paquetes/activos', {
      params: {
        ...(id_ciudad && { id_ciudad }),
        ...(id_usuario && { id_usuario })
      }
    });
    
    // Inicializar estados de carga de imágenes
    response.forEach(paquete => {
      if (paquete.imagen_url) {
        imageLoaded.value[paquete.id_paquete] = false;
      }
    });
    
    // Mapear la respuesta de la API al formato esperado
    paquetesMantenimiento.value = response.map(paquete => ({
      id: paquete.id_paquete,
      nombre: paquete.nombre,
      descripcion: paquete.descripcion,
      costo: parseFloat(paquete.costo), // Convertir a número
      estado: paquete.estado,
      disponible: paquete.disponible !== false, // Asegurar que sea booleano
      imagen: paquete.imagen_url || null // Incluir la URL de la imagen o null si no hay
    }));
  } catch (error) {
    console.error('Error al cargar paquetes:', error);
    showToast('Error', 'No se pudieron cargar los paquetes', 'error');
  } finally {
    cargandoPaquetes.value = false;
  }
};

// Cargar los paquetes cuando el componente se monte
onMounted(async () => {
  await cargarPaquetesActivos();
  await cargarPaquetesUsuario();
  startAutoScroll();
});

const canjearPaquete = async (paquete) => {
  if (!paquete || !paquete.id) {
    showToast('Error', 'Paquete no válido', 'error');
    return;
  }

  if (userCredit.value < paquete.costo) {
    // Mostrar modal de pago en lugar de mensaje de error
    selectedPaquete.value = paquete;
    await cargarCuentasBancarias();
    showPaquetePagoModal.value = true;
    return;
  }
  
  // Si tiene crédito suficiente, mostrar modal de confirmación
  selectedPaquete.value = paquete;
  showConfirmarCanjeoModal.value = true;
};

const confirmarCanjeo = async () => {
  const paquete = selectedPaquete.value;
  if (!paquete) return;
  
  showConfirmarCanjeoModal.value = false;
  
  try {
    // Obtener el usuario de la cookie
    const user = useCookie('user').value;
    if (!user || !user.id_usuario) {
      throw new Error('No se pudo obtener la información del usuario');
    }

    // Primero, descontar el crédito
    const creditoResponse = await $api('/credito', {
      method: 'POST',
      body: { 
        id_usuario: user.id_usuario,
        monto_credito: -Math.abs(paquete.costo)
      }
    });

    if (!creditoResponse.success) {
      throw new Error(creditoResponse.error || 'Error al actualizar el crédito');
    }

    // Luego, registrar el paquete para el usuario
    const requestData = {
      id_paquete: paquete.id,
      id_usuario: user.id_usuario
    }; 

    const response = await $api('/paquetes/usuarios/canjear', {
      method: 'POST',
      body: requestData
    }); 
    
    if (response.success) {
      // Actualizar el crédito del usuario
      userCredit.value = userCredit.value - paquete.costo;
      
      // Actualizar la lista de paquetes del usuario
      await cargarPaquetesUsuario();
      
      // Notificar a los administradores
      try {
        const user = useCookie('user').value;
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Paquete Adquirido',
            nombre_rol: 'admin'
            }
        });

        // Notificar también al super admin
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Paquete Adquirido',
            nombre_rol: 'sa'
          }
        });
      } catch (error) {
        console.error('Error al enviar notificaciones:', error);
      }
      
      // Mostrar notificación de éxito al usuario
      showToast(
        '¡Paquete canjeado!', 
        response.message || 'El paquete se ha canjeado exitosamente',
        'success'
      );
      
      // Recargar la lista de paquetes
      await cargarPaquetesActivos();
    } else {
      console.error('Error en la respuesta del servidor:', response);
    }
  } catch (error) {
    console.error('Error al canjear el paquete:', {
      error: error,
      response: error.response?.data,
      status: error.response?.status
    });
    const errorMessage = error.data?.error || error.response?.data?.error || error.message || 'Ocurrió un error al procesar tu solicitud';
    showToast('Error', errorMessage, 'error');
  }
};

const cancelarCanjeo = () => {
  showConfirmarCanjeoModal.value = false;
  selectedPaquete.value = null;
};

// Función para cargar las cuentas bancarias
const cargarCuentasBancarias = async () => {
  isLoadingAccounts.value = true;
  try {
    const response = await $api('/cuentas', {
      method: 'GET'
    });

    if (response && Array.isArray(response)) {
      bankAccounts.value = response;
    }
  } catch (error) {
    console.error('Error al cargar cuentas bancarias:', error);
  } finally {
    isLoadingAccounts.value = false;
  }
};

// Función para obtener la etiqueta de la cuenta
const getAccountLabel = (account) => {
  if (!account) return '';
  return `🏦 ${account.banco}`;
};

// Función para procesar el pago del paquete
// Función para procesar el pago del paquete
const procesarPagoPaquete = async () => {
  // Validar que se haya seleccionado un paquete y que el número de comprobante no esté vacío
  if (!selectedPaquete.value) {
    showToast('Error', 'No se ha seleccionado ningún paquete', 'error');
    return;
  }

  // Validar el número de comprobante
  const numComprobante = numeroComprobante.value ? numeroComprobante.value.trim() : '';
  if (!numComprobante) {
    showToast('Error', 'Por favor ingresa el número de comprobante', 'error');
    return;
  }

  // Validar que el número de comprobante solo contenga números
  if (!/^\d+$/.test(numComprobante)) {
    showToast('Error', 'El número de comprobante solo puede contener números', 'error');
    return;
  }

  const user = useCookie('user').value;
  if (!user || !user.id_usuario) {
    showToast('Error', 'No se pudo obtener la información del usuario', 'error');
    return;
  }

  // Verificar si es pago con saldo o por transferencia
  const esPagoConSaldo = user.credito >= selectedPaquete.value.costo;
  
  // Si es pago por transferencia, validar que se haya seleccionado una cuenta
  if (!esPagoConSaldo && !selectedAccountObject.value) {
    showToast('Error', 'Por favor selecciona una cuenta bancaria para la transferencia', 'error');
    return;
  }

  isProcessingPayment.value = true;

  try {
    const requestData = {
      id_paquete: selectedPaquete.value.id,
      id_usuario: user.id_usuario,
      // Solo incluir estos campos si es pago por transferencia
      ...(!esPagoConSaldo && {
        esPagoTransferencia: true,
        id_cuenta: selectedAccountObject.value.id_cuenta,
        numero_comprobante: numComprobante
      })
    }; 

    const response = await $api('/paquetes/usuarios/canjear', {
      method: 'POST',
      body: requestData
    });

    if (response.success) {
      // Obtener el ID de paquete usuario recién creado
      const idPaqueteUsuario = response.data.paquete.id_paquete_usuario;

      // Actualizar el saldo del usuario si fue pago con saldo
      if (esPagoConSaldo && response.data.nuevoSaldo !== undefined) {
        user.credito = response.data.nuevoSaldo;
        // Actualizar la cookie con el nuevo saldo
        useCookie('user').value = user;
      }

      // Mostrar mensaje de éxito
      showToast(
        '¡Éxito!', 
        esPagoConSaldo 
          ? 'Paquete canjeado exitosamente' 
          : 'Solicitud de pago por transferencia registrada. Por favor espera la verificación.',
        'success'
      );

      // Capturar datos del paquete antes de cerrar el modal
      const paqueteNombre = selectedPaquete.value.nombre;
      const paqueteCosto = selectedPaquete.value.costo;

      // Cerrar el modal y actualizar la lista de paquetes
      closePaquetePagoModal();
      await cargarPaquetesUsuario();

      // Si fue por transferencia, abrir WhatsApp para enviar comprobante y notificar a los admins
      if (!esPagoConSaldo) {
        // Enviar notificaciones a los administradores
        try {
          const token = useCookie('token').value;
          const notificationData = { titulo: 'Pago de Paquete Recibido' };
          
          await Promise.all([
            $api('/notificaciones/enviar', {
              method: 'POST',
              body: { ...notificationData, nombre_rol: 'admin' }
            }),
            $api('/notificaciones/enviar', {
              method: 'POST',
              body: { ...notificationData, nombre_rol: 'sa' }
            })
          ]);
        } catch (notifierError) {
          console.error('Error al enviar notificaciones de pago de paquete:', notifierError);
        }

        sendWhatsAppMessage({
          id_paquete_usuario: idPaqueteUsuario,
          nombre_paquete: paqueteNombre,
          receiptNumber: numComprobante,
          amount: paqueteCosto
        }, 'package_payment');
      }
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    const errorMessage = error.response?.data?.error || 'Error al procesar el pago';
    showToast('Error', errorMessage, 'error');
  } finally {
    isProcessingPayment.value = false;
  }
};

// Función para cerrar el modal de pago
const closePaquetePagoModal = () => {
  showPaquetePagoModal.value = false;
  selectedPaquete.value = null;
  isProcessingPayment.value = false;
  numeroComprobante.value = ''; // Limpiar el campo al cerrar el modal
};

// Función para cargar los paquetes del usuario
const cargarPaquetesUsuario = async () => {
  try {
    const user = useCookie('user').value;
    if (!user || !user.id_usuario) {
      throw new Error('No se pudo obtener la información del usuario');
    }

    const response = await $api(`/paquetes/usuarios/${user.id_usuario}`, {
      method: 'GET'
    });

    if (response.success && response.data) {
      paquetesUsuario.value = response.data;
    }
  } catch (error) {
    console.error('Error al cargar paquetes del usuario:', error);
    showToast('Error', 'No se pudieron cargar tus paquetes', 'error');
  }
};

// Función para verificar si el usuario tiene un paquete específico disponible para usar
const tienePaquete = (paqueteId) => {
  return paquetesUsuario.value.some(p => 
    p.id_paquete === paqueteId && (p.estado === 'activo' || p.estado === 'utilizando')
  );
};

// Función para obtener el estado del paquete (priorizando el estado más importante)
const getEstadoPaquete = (paqueteId) => {
  const paquetes = paquetesUsuario.value.filter(p => p.id_paquete === paqueteId);
  if (paquetes.length === 0) return '';
  
  // Prioridad 1: Verificando pago
  if (paquetes.some(p => p.estado === 'verificando_pago')) {
    return 'Verificando pago...';
  }
  
  // Prioridad 2: Activo (Disponible para usar)
  if (paquetes.some(p => p.estado === 'activo')) {
    return 'Adquirido';
  }
  
  // Prioridad 3: Utilizando (En uso)
  if (paquetes.some(p => p.estado === 'utilizando')) {
    return 'En uso';
  }
  
  return '';
};

// Función para manejar el clic en el botón de paquete
const handlePaqueteClick = (paquete) => {
  const estado = getEstadoPaquete(paquete.id);
  
  if (estado === 'Adquirido') {
    selectedPaquete.value = paquete;
    showConfirmarUsoModal.value = true;
  }
};

// Función para usar un paquete canjeado
const confirmarUsoPaquete = (paquete) => {
  selectedPaquete.value = paquete;
  showConfirmarUsoModal.value = true;
};

const usarPaquete = async (paquete) => {
  try {
    isProcessingPayment.value = true;
    // Buscar el registro del paquete en la lista de paquetes del usuario que esté activo
    const paqueteUsuario = paquetesUsuario.value.find(p => 
      p.id_paquete === paquete.id && p.estado === 'activo'
    );

    if (!paqueteUsuario) {
      showToast('Error', 'No tienes este paquete disponible para usar', 'error');
      isProcessingPayment.value = false;
      showConfirmarUsoModal.value = false; // Cerrar el modal en caso de error
      return;
    }

    const response = await $api(`/paquetes/usuarios/${paqueteUsuario.id_paquete_usuario}/activar`, {
      method: 'PUT'
    });

    if (response.success) {
      showToast(
        '¡Paquete activado!', 
        `El paquete ${paquete.nombre} está ahora en uso.`,
        'success'
      );
      
      // Recargar la lista de paquetes del usuario
      await cargarPaquetesUsuario();
      
      // Enviar mensaje por WhatsApp
      sendWhatsAppMessage({
        id_paquete_usuario: paqueteUsuario.id_paquete_usuario,
        nombre_paquete: paquete.nombre
      }, 'use_package');
      
      // Notificar a los administradores y super administradores
      try {
        const user = useCookie('user').value;
        const notificationData = { titulo: 'Solicitud Uso de Paquete' };
        
        await Promise.all([
          $api('/notificaciones/enviar', {
            method: 'POST',
            body: { ...notificationData, nombre_rol: 'admin' }
          }),
          $api('/notificaciones/enviar', {
            method: 'POST',
            body: { ...notificationData, nombre_rol: 'sa' }
          })
        ]);
      } catch (error) {
        console.error('Error al enviar notificaciones:', error);
        // No mostramos error al usuario para no interrumpir el flujo
      }
      
      // Cerrar el modal después de completar las operaciones
      showConfirmarUsoModal.value = false;
    } else {
      showToast('Error', response.message || 'No se pudo activar el paquete', 'error');
      showConfirmarUsoModal.value = false; // Cerrar el modal en caso de error
    }
  } catch (error) {
    console.error('Error al usar el paquete:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Error al activar el paquete';
    showToast('Error', errorMessage, 'error');
  } finally {
    isProcessingPayment.value = false;
    showConfirmarUsoModal.value = false; // Asegurarse de que el modal se cierre en cualquier caso
  }
};

// =========================
// FUNCIONES DE PROCESAMIENTO
// =========================

// Función para reiniciar el crédito del usuario
const resetCredito = async () => {
  try {
    const userCookie = useCookie('user')
    const userData = userCookie.value
    
    if (!userData || !userData.id_usuario) {
      showToast('Error', 'No se pudo identificar al usuario', 'error')
      return
    }

    const response = await $api(`/credito/reset/${userData.id_usuario}`, {
      method: 'PUT'
    })

    if (response && response.success) {  
      await fetchUserCredit()  
      return response.data
    } else {
      throw new Error(response?.message || 'Error al reiniciar el crédito')
    }
  } catch (error) { 
    throw error
  }
}

// Event handlers
const handleRequestService = async () => {
  try {
    if (!serviceFormData.value.type || !serviceFormData.value.description || 
        !serviceFormData.value.colonia || !serviceFormData.value.direccion) {
      throw new Error('Por favor completa todos los campos requeridos')
    }

    const userCookie = useCookie('user')
    const userData = userCookie.value
    
    if (!userData) {
      throw new Error('No se pudo obtener la información del usuario. Por favor inicia sesión nuevamente.')
    }
    
    if (!userData.id_ciudad) {
      throw new Error('No se pudo determinar la ciudad del usuario. Por favor contacte al soporte.')
    }

    const selectedService = servicesList.value.find(s => s.name === serviceFormData.value.type)
    if (!selectedService) {
      throw new Error('No se pudo encontrar el servicio seleccionado')
    }

    const membershipStatus = await fetchMembershipData()
    const tieneMembresiaActiva = membershipStatus?.estado === 'activa'
    
    const estadoInicial = tieneMembresiaActiva ? 'pendiente_asignacion' : 'pendiente_pagovisita'
    const visitaPagada = tieneMembresiaActiva ? 0 : 1 

    const isBarberia = selectedService.name === 'Barbería'
    const isEnLocal = serviceFormData.value.barberiaOption === 'en local'

    const colonia = (isBarberia && isEnLocal) 
      ? serviceFormData.value.selectedBarberia.colonia 
      : serviceFormData.value.colonia

    const direccion = (isBarberia && isEnLocal)
      ? serviceFormData.value.selectedBarberia.direccion_precisa
      : serviceFormData.value.direccion

    let descripcionFinal = serviceFormData.value.description

    if (isBarberia) {
      const tecnicoNombre = serviceFormData.value.selectedBarberia?.tecnico?.nombre ? ` - ${serviceFormData.value.selectedBarberia.tecnico.nombre}` : ''
      const infoLocal = isEnLocal ? `en local: ${serviceFormData.value.selectedBarberia.nombre}${tecnicoNombre}` : 'a domicilio'
      descripcionFinal = `${serviceFormData.value.description} (${infoLocal})`
    }

    const requestData = {
      id_usuario: Number(userData.id_usuario),
      id_servicio: Number(selectedService.id),
      id_ciudad: Number(userData.id_ciudad),
      colonia: colonia,
      direccion_precisa: direccion,
      descripcion: descripcionFinal,
      pagar_visita: visitaPagada,
      estado: estadoInicial
    }

    const response = await $api('/solicitudservicio', {
      method: 'POST',
      body: requestData
    })

    // Enviar notificación según el tipo de membresía
    try {
      const notificationData = tieneMembresiaActiva
        ? { titulo: 'Asignación Pendiente', nombre_rol: 'admin' }
        : { titulo: 'Pago de visita pendiente', id_usuario: Number(userData.id_usuario) }

      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: notificationData
      })

      if (tieneMembresiaActiva) {
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Asignación Pendiente',
            nombre_rol: 'sa'
          }
        });
      }
    } catch (error) {
      console.error('Error al enviar notificación:', error)
      // No mostramos error al usuario para no afectar su experiencia
    }

    const newService = {
      id: response.id_solicitud_servicio || Date.now(),
      title: serviceFormData.value.type,
      description: serviceFormData.value.description,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pendiente',
      cost: 0,
      icon: selectedService.icon
    }
    
    recentServicesData.value.unshift(newService)
    
    serviceFormData.value = { 
      type: '', 
      description: '', 
      colonia: '', 
      direccion: '' ,
      barberiaOption: null,
      selectedBarberia: null
    }
    
    showToast(
      '¡Solicitud enviada!', 
      tieneMembresiaActiva 
        ? `Pronto se le asignará un ${selectedService.name === 'Taxi VIP' ? 'conductor' : (isBarberia ? 'barbero' : 'técnico')}.` 
        : 'Ya puedes pagar la visita.',
      'success'
    )
    
    // Redirigir a la página de servicios después de 1.5 segundos
    setTimeout(() => {
      navigateTo('/cliente/Servicios')
    }, 1500)
    
  } catch (error) {
    console.error('Error al enviar la solicitud de servicio:', error)
    showToast('Error', 'No se pudo enviar la solicitud. Por favor, inténtalo mas tarde.', 'error')
  }
}

// =========================
// FUNCIONES DE GESTIÓN DE MEMBRESÍA
// =========================
// Función para obtener el período de reinicio de crédito desde la API
const getCreditResetPeriod = async () => {
  try {
    const response = await $api('/config/valor/reset_credito', {
      method: 'GET'
    });

    if (response && response.valor) {
      const valor = parseInt(response.valor, 10);
      return valor || 30; // Usar 30 como valor por defecto
    }
    return 30; // Valor por defecto si no hay respuesta
  } catch (error) {
    console.error('❌ Error al obtener el período de reinicio de crédito:', error);
    return 30; // Valor por defecto en caso de error
  }
}

// Función para actualizar el estado de la membresía a vencida en el backend
const updateMembershipToExpired = async (membresiaId) => {
  try { 
    
    const response = await $api(`/membresia/${membresiaId}`, {
      method: 'PUT',
      body: {
        estado: 'vencida'
      },
      onResponseError({ request, response, options }) {
        console.error('Error en la respuesta de la API:', {
          status: response.status,
          statusText: response.statusText,
          response: response._data
        });
      }
    }); 
    return { success: true };
  } catch (error) {
    console.error('❌ Error al actualizar el estado de la membresía:', {
      message: error.message,
      statusCode: error.statusCode,
      response: error.data,
      stack: error.stack
    });
    
    // Mostrar mensaje de error al usuario
    showToast('Error', 'No se pudo actualizar el estado de la membresía', 'error');
    
    return { success: false, error };
  }
};

// =========================
// FUNCIONES DE NOTIFICACIONES
// =========================

const showToast = (param1, param2, param3 = 'success') => { 
  let message, type;
  
  if (param2 === 'success' || param2 === 'error' || param2 === 'warning' || param2 === 'info') {
    message = param1;
    type = param2;
  } else if (param2) {
    message = `${param1}
${param2}`;
    type = param3;
  } else {
    message = param1;
    type = 'success';
  }
  
  toast.value = {
    show: true,
    message: message,
    type: type,
    duration: 5000
  };   
}

// =========================
// INICIALIZACIÓN
// =========================

// Asegurar que name siempre tenga un valor
userData.value.name = userData.value.nombre || userData.value.name

// Estado reactivo para el crédito del usuario
const userCredit = ref(0)

// Watch para sincronizar serviceFormData.type con selectedServiceObject
watch(() => serviceFormData.value.type, (newType) => {
  if (newType && servicesList.value.length > 0) {
    const serviceObject = servicesList.value.find(s => s.name === newType);
    if (serviceObject) {
      selectedServiceObject.value = serviceObject;
    }
  } else {
    selectedServiceObject.value = null;
  }
});

// Watch para sincronizar selectedServiceObject con serviceFormData.type
watch(() => selectedServiceObject.value, (newService) => {
  if (newService) {
    // Protección adicional: Si por alguna razón se intenta seleccionar Taxi VIP sin membresía
    if (newService.name === 'Taxi VIP' && !isMembershipActive.value) {
      showToast('Membresía Necesaria', 'Este servicio es exclusivo para usuarios con membresía activa.', 'warning');
      selectedServiceObject.value = null;
      return;
    }
    serviceFormData.value.type = newService.name;
  } else {
    serviceFormData.value.type = '';
  }
});

// Verificar autenticación al cargar el componente
onMounted(async () => {
  try {
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) {
      window.location.reload()
      return
    }

    // Primero cargar los datos de la membresía
    await fetchMembershipData()
    
    // Luego cargar el resto de datos en paralelo
    await Promise.all([
      fetchMembershipProgress(),
      fetchServices(),
      fetchBeneficios(),
      fetchTotalSolicitudes(),
      fetchUserCredit(),
      fetchBarberias()
    ])
  } catch (error) {
    window.location.reload()
  } finally {
    isLoading.value = false
  }
})
</script> 