<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
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

    <!-- MODAL: Facturación Rápida Inteligente -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to"
    >
      <div v-if="isBillingModalOpen && currentBillingItem" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeBillingModal"></div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-[101] animate-modal-in transform transition-all border border-gray-100 dark:border-gray-700">
          <!-- Header (Estilo unificado) -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2 sm:space-x-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <span class="text-lg">🧾</span>
                </div>
                <div>
                  <h3 class="font-black font-sm text-gray-900 dark:text-white uppercase tracking-tight">Facturación SAR</h3>
                  <div class="flex items-center space-x-1">
                    <p class="text-[9px] text-gray-400 font-bold uppercase">Siguiente:</p>
                    <p class="text-[9px] text-blue-600 dark:text-blue-400 font-black">{{ formattedNextCorrelativo }}</p>
                  </div>
                </div>
              </div>
              <button @click="closeBillingModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <div class="p-5 overflow-y-auto max-h-[70vh]">
            <!-- Detalle del Pago -->
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-5 border border-blue-100 dark:border-blue-800/50">
              <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] uppercase font-black text-blue-500 dark:text-blue-400">Concepto de Ingreso</span>
                <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 uppercase">
                  {{ currentBillingItem.billingType === 'membership' ? 'Membresía' : currentBillingItem.billingType === 'visits' ? 'Visita' : currentBillingItem.billingType === 'packages' ? 'Paquete' : 'Servicio' }}
                </span>
              </div>
              <p class="text-sm font-bold text-gray-900 dark:text-white mb-1">
                {{ currentBillingItem.billingType === 'membership' ? (currentBillingItem.plan || 'Plan de Membresía') : currentBillingItem.billingType === 'packages' ? (currentBillingItem.paqueteUsuario?.paquete?.nombre || 'Paquete Adquirido') : (currentBillingItem.service || currentBillingItem.serviceName || 'Servicio Técnico') }}
              </p>
              <p class="text-[11px] text-gray-600 dark:text-gray-400 mb-3">Cliente: {{ currentBillingItem.usuario?.nombre || currentBillingItem.nombre_usuario || currentBillingItem.cliente || currentBillingItem.solicitud?.cliente?.nombre || 'Consumidor Final' }}</p>
              <div class="pt-2 border-t border-blue-200 dark:border-blue-800/60 flex justify-between items-center">
                <span class="text-[10px] uppercase font-black text-blue-500 dark:text-blue-400">Total a Facturar</span>
                <span class="text-lg font-black text-blue-700 dark:text-blue-300">{{ formatCurrency(currentBillingItem.amount || currentBillingItem.monto || currentBillingItem.monto_total || 0) }}</span>
              </div>
            </div>

            <!-- Formulario -->
            <div class="space-y-4">
              <div>
                <label class="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2">Tipo de Factura</label>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    @click="billingForm.tipo_factura = 'CONSUMIDOR_FINAL'; billingForm.nombre_cliente = 'CONSUMIDOR FINAL'; billingForm.rtn_cliente = 'CF'"
                    :class="billingForm.tipo_factura === 'CONSUMIDOR_FINAL' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"
                    class="py-3 rounded-xl text-xs font-bold transition-all border-2 border-transparent"
                  >
                    Cons. Final
                  </button>
                  <button 
                    @click="billingForm.tipo_factura = 'CON_RTN'; billingForm.nombre_cliente = currentBillingItem.usuario?.nombre || currentBillingItem.cliente || currentBillingItem.solicitud?.cliente?.nombre || ''"
                    :class="billingForm.tipo_factura === 'CON_RTN' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"
                    class="py-3 rounded-xl text-xs font-bold transition-all border-2 border-transparent"
                  >
                    Con RTN
                  </button>
                </div>
              </div>

              <div v-if="billingForm.tipo_factura === 'CON_RTN'" class="space-y-4 animate-fade-in">
                <div>
                  <label class="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">RTN del Cliente</label>
                  <input 
                    v-model="billingForm.rtn_cliente" 
                    type="text" 
                    class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    placeholder="Escriba el RTN"
                  >
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">Nombre en Factura</label>
                  <input 
                    v-model="billingForm.nombre_cliente" 
                    type="text" 
                    class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    placeholder="Nombre completo o Razón Social"
                  >
                </div>
              </div>
            </div>
          </div>

            <!-- Alerta: No hay correlativo activo -->
            <div v-if="!activeCorrelativo && !isLoadingCorrelativo" class="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-xl flex items-center space-x-3">
              <span class="text-xl">⚠️</span>
              <div>
                <p class="text-[11px] font-black text-red-700 dark:text-red-400 uppercase">Configuración Requerida</p>
                <p class="text-[10px] text-red-600 dark:text-red-300">No hay un rango de facturación SAR activo en el sistema.</p>
              </div>
            </div>

          <!-- Acciones -->
          <div class="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex flex-col space-y-3">
            <button 
              @click="saveFactura({ form: billingForm, next: false })" 
              :disabled="isProcessingBilling || !activeCorrelativo"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-black text-xs shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span v-if="isProcessingBilling" class="animate-spin inline-block">⏳</span>
              <span>GUARDAR Y CERRAR</span>
            </button>
            <button 
              @click="saveFactura({ form: billingForm, next: true })" 
              :disabled="isProcessingBilling || filteredPendingBilling.length <= 1 || !activeCorrelativo"
              class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white py-4 rounded-xl font-black text-xs shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span v-if="isProcessingBilling" class="animate-spin inline-block">⏳</span>
              <span>GUARDAR Y SIGUIENTE ({{ filteredPendingBilling.length - 1 }})</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

<!-- Modal de Detalles del Pago -->
<Transition
  name="modal"
  enter-active-class="modal-enter-active"
  leave-active-class="modal-leave-active"
  enter-from-class="modal-enter-from"
  leave-to-class="modal-leave-to"
>
  <div
    v-if="showDetailsModal && selectedPayment"
    class="fixed inset-0 z-[1] flex items-center justify-center p-2 sm:p-4"
  >
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeDetailsModal"></div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[90%] sm:w-full max-w-md max-h-[85vh] overflow-y-auto relative z-10 text-[12px] sm:text-xs md:text-base"
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl z-10"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-black text-gray-900 dark:text-white">Detalles del Pago</h3>
              <div class="flex items-center space-x-2">
                <p class="text-gray-600 dark:text-gray-400">ID: #{{ selectedPayment.id || 'N/A' }}</p>
                <span class="text-gray-400">•</span>
               <p class="text-gray-600 dark:text-gray-400">{{ formatDate(selectedPayment.fecha) || 'N/A' }}</p>
              </div>
            </div>
          </div>
          <button
            @click="closeDetailsModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3 sm:p-4 space-y-4">
        <!-- Información del Pago -->
        <div>
          <h4 class="font-bold text-gray-900 dark:text-white mb-2">Información del Pago</h4>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Monto</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(selectedPayment.amount || selectedPayment.monto || 0) }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Comprobante</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ selectedPayment.num_comprobante || 'No especificado' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Nombre</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ selectedPayment.cliente?.nombre || selectedPayment.solicitud?.cliente?.nombre || selectedPayment.usuario?.nombre || 'N/A' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Estado</p>
              <span
                :class="getStatusBadgeClass(selectedPayment.estado)"
                class="inline-flex items-center px-2 py-0.5 rounded-full font-medium"
              >
                {{ selectedPayment.estado || selectedPayment.estado || 'Pendiente' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Información Bancaria -->
        <div>
          <h4 class="font-bold text-gray-900 dark:text-white mb-2">Información Bancaria</h4>
          <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Banco:</span>
              <span class="font-medium text-gray-900 dark:text-white text-right">
                {{ selectedPayment.cuenta?.banco || 'No especificado' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Número de Cuenta:</span>
              <span class="font-medium text-gray-900 dark:text-white text-right">
                {{ selectedPayment.cuenta?.num_cuenta || 'N/A' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Beneficiario:</span>
              <span class="font-medium text-gray-900 dark:text-white text-right">
                {{ selectedPayment.cuenta?.beneficiario || 'N/A' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Tipo de Cuenta:</span>
              <span class="font-medium text-gray-900 dark:text-white text-right">
                {{ selectedPayment.cuenta?.tipo || 'N/A' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="sticky bottom-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-end gap-2 sm:gap-3 rounded-b-xl sm:rounded-b-2xl"
      >
        <button
          v-if="selectedPayment.solicitud"
          @click="openServiceDetail(selectedPayment.solicitud)"
          class="px-3 py-2 font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Ver Servicio
        </button>
        <button
          v-if="selectedPayment.estado === 'Aprobado' || selectedPayment.estado === 'confirmado' || selectedPayment.estado === 'aprobado'"
          @click="openFacturaModal(selectedPayment)"
          class="px-3 py-2 font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          Mostrar Recibo
        </button>
        <button
          v-if="selectedPayment.estado === 'pendiente' || selectedPayment.estado === 'Pendiente' || selectedPayment.estado === 'pagado'"
          @click="rejectPayment(selectedPayment.id)"
          :disabled="isRejecting || isApproving"
          class="px-3 py-2 font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isRejecting ? 'Procesando...' : 'Rechazar' }}
        </button>
        <button
          v-if="selectedPayment.estado === 'pendiente' || selectedPayment.estado === 'Pendiente' || selectedPayment.estado === 'pagado'"
          @click="approvePayment(selectedPayment.id)"
          :disabled="isApproving || isRejecting"
          class="px-3 py-2 font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isApproving ? 'Procesando...' : 'Aprobar' }}
        </button>
      </div>
    </div>
  </div>
</Transition>

<!-- Modal de Detalles del Retiro -->
<Transition
  name="modal"
  enter-active-class="modal-enter-active"
  leave-active-class="modal-leave-active"
  enter-from-class="modal-enter-from"
  leave-to-class="modal-leave-to"
>
  <div
    v-if="showWithdrawalModal && selectedWithdrawal"
    class="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
  >
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeWithdrawalModal"></div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[90%] sm:w-full max-w-md max-h-[85vh] overflow-y-auto relative z-10 text-[12px] sm:text-xs md:text-base"
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl z-10"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-black text-gray-900 dark:text-white">Detalles del Retiro</h3>
              <p class="text-gray-600 dark:text-gray-400">ID: #{{ selectedWithdrawal.id || 'N/A' }}</p>
            </div>
          </div>
          <button
            @click="closeWithdrawalModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3 sm:p-4 space-y-4">
        <!-- Información del Retiro -->
        <div>
          <h4 class="font-bold text-gray-900 dark:text-white mb-2">Información del Retiro</h4>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Monto</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(selectedWithdrawal.monto || 0) }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Estado</p>
              <div class="inline-block">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" :class="getStatusBadgeClass(selectedWithdrawal.estado)">
                  {{ selectedWithdrawal.estado || 'Pendiente' }}
                </span>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Fecha</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ formatDate(selectedWithdrawal.fecha) || 'N/A' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Solicitado por</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ selectedWithdrawal.nombre_usuario || 'N/A' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Información Bancaria -->
        <div>
          <h4 class="font-bold text-gray-900 dark:text-white mb-2">Información Bancaria</h4>
          <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <pre class="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 text-sm">{{ selectedWithdrawal.descripcion || 'No hay información bancaria disponible' }}</pre>
          </div>
        </div>

        <!-- Acciones -->
        <div class="pt-2 flex justify-end space-x-2">
          <template v-if="selectedWithdrawal.estado === 'pendiente' || selectedWithdrawal.estado === 'Pendiente'">
            <button
              @click="rejectPayment(selectedWithdrawal.id_movimiento)"
              :disabled="isRejecting || isApproving"
              class="py-1.5 px-3 sm:py-2 sm:px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{{ isRejecting ? 'Procesando...' : 'Rechazar' }}</span>
            </button>
            <button
              @click="approvePayment(selectedWithdrawal.id_movimiento)"
              :disabled="isApproving || isRejecting"
              class="py-1.5 px-3 sm:py-2 sm:px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ isApproving ? 'Procesando...' : 'Aprobar' }}</span>
            </button>
          </template>
          <button
            v-else
            @click="closeWithdrawalModal"
            class="py-1.5 px-3 sm:py-2 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cerrar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</Transition>


<!-- Modal de Recibo -->
<Transition
  name="modal"
  enter-active-class="modal-enter-active"
  leave-active-class="modal-leave-active"
  enter-from-class="modal-enter-from"
  leave-to-class="modal-leave-to"
>
  <div
    v-if="showFacturaModal && selectedFacturaPayment"
    class="fixed inset-0 z-[100] flex items-center justify-center p-4"
  >
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeFacturaModal"></div>

    <div class="bg-white relative z-10 w-full max-w-2xl shadow-xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
      
      <!-- Receipt Content (Scrollable) -->
      <div class="overflow-y-auto p-6 flex-1">
        <!-- Top Header -->
        <div class="flex justify-between items-center border-b-2 border-gray-300 pb-2 mb-2">
            <div>
                <h2 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">RECIBO POR HONORARIOS</h2>
                <p class="text-sm font-mono font-bold text-gray-900">N° {{ empresaCorrelativo }}</p>
                <p class="text-[10px] text-gray-500 mt-1">Fecha: {{ formatDate(selectedFacturaPayment.fecha) }}</p>
            </div>
            <div class="text-right">
               <h1 class="text-lg font-bold text-gray-900 tracking-tight">{{ empresaNombre || 'MiSeguro' }}</h1>
               <div class="text-[10px] text-gray-500 mt-2 space-y-0.5">
                  <p class="font-medium">RTN: {{ empresaRTN }}</p>
                  <p>{{ empresaEmail }}</p>
                  <p>{{ empresaTelefono }}</p>
               </div>
            </div>
        </div>

        <!-- Main Body -->
        <div class="bg-gray-50 rounded-lg border border-gray-300 p-4 sm:p-4 mb-2">
            <div class="mb-6">
                <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">RECIBÍ DE</span>
                <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                    {{ selectedFacturaPayment.cliente?.nombre || selectedFacturaPayment.solicitud?.cliente?.nombre || selectedFacturaPayment.usuario?.nombre || 'Cliente General' }}
                </p>
                <p class="text-xs text-gray-500 mt-0.5" v-if="selectedFacturaPayment.rtn_cliente">RTN: {{ selectedFacturaPayment.rtn_cliente }}</p>
            </div>
            
            <div class="mb-6">
                 <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">LA SUMA DE</span>
                 <p class="text-lg sm:text-xl font-bold text-gray-900">{{ formatCurrency(selectedFacturaPayment.total) }}</p>
            </div>

            <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">POR CONCEPTO DE</span>
                <p class="text-xs leading-relaxed text-gray-700">
                  <span v-if="selectedFacturaPayment.id_membresia">
                    Servicio de acceso y uso de plataforma tecnológica MiSeguro, correspondiente a membresía de beneficios y gestión de servicios.
                  </span>
                  <span v-else-if="selectedFacturaPayment.id_pagovisita">
                    Servicio de intermediación tecnológica, coordinación y gestión de visita técnica para evaluación y diagnóstico de servicio solicitado a través de la plataforma MiSeguro.
                  </span>
                  <span v-else-if="selectedFacturaPayment.id_cotizacion">
                    Servicio de intermediación tecnológica, coordinación y gestión de pagos por servicios técnicos prestados por técnicos independientes a través de la plataforma MiSeguro.
                  </span>
                  <span v-else>
                    Pago de Servicio Profesional
                  </span>
                </p>
            </div>

            <!-- Forma de Pago (solo para servicios) -->
            <div v-if="selectedFacturaPayment.id_cotizacion" class="mt-6 pt-4 border-t border-gray-200">
                <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">FORMA DE PAGO</span>
                <div class="space-y-1 text-xs text-gray-700">
                    <p class="flex justify-between">
                         <span>Efectivo recibido:</span>
                         <span class="font-medium">{{ formatCurrency(Math.max(0, (parseFloat(selectedFacturaPayment.monto_manodeobra) || 0) - (parseFloat(selectedFacturaPayment.credito_usado) || 0))) }}</span>
                     </p>
                    <p class="flex justify-between" v-if="selectedFacturaPayment.credito_usado > 0">
                        <span>Crédito de membresía aplicado:</span>
                        <span class="font-medium">{{ formatCurrency(selectedFacturaPayment.credito_usado || 0) }}</span>
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Details & Fiscal Data (Stacked Rows) -->
        <div class="flex flex-col gap-8 text-[11px] mb-8">
             <div>
                <h4 class="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">DETALLES</h4>
                 <div class="space-y-2 text-gray-600">
                    <p class="flex justify-between"><span class="font-medium text-gray-500">Subtotal</span> <span>{{ formatCurrency(selectedFacturaPayment.subtotal) }}</span></p>
                    <div class="flex justify-between pt-1 mt-1 border-t border-gray-300">
                        <span class="font-bold text-gray-900 text-xs">TOTAL</span> 
                        <span class="font-bold text-gray-900 text-xs">{{ formatCurrency(selectedFacturaPayment.total) }}</span>
                    </div>
                </div>
             </div>
             <div>
                <h4 class="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">DATOS FISCALES</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-gray-600">
                    <p class="flex justify-between sm:justify-start sm:gap-2"><span class="font-medium text-gray-500">CAI:</span> <span class="text-right sm:text-left">{{ empresaCAI }}</span></p>
                    <p class="flex justify-between sm:justify-start sm:gap-2"><span class="font-medium text-gray-500">Rango:</span> <span class="text-right sm:text-left">{{ empresaRangoAutorizado }}</span></p>
                    <p class="flex justify-between sm:justify-start sm:gap-2 sm:col-span-2"><span class="font-medium text-gray-500">Límite:</span> <span class="text-right sm:text-left">{{ empresaFechaLimite }}</span></p>
                </div>
             </div>
        </div>

        <!-- Footer Info -->
        <div class="text-[10px] text-gray-400 text-center pt-1 border-t border-gray-300">
           <p>Este documento es un comprobante de pago por honorarios profesionales.</p>
           <p v-if="selectedFacturaPayment.num_comprobante" class="mt-1">Ref. Pago: {{ selectedFacturaPayment.num_comprobante }}</p>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="bg-gray-50 p-4 border-t border-gray-300 flex justify-end">
        <button 
          @click="closeFacturaModal"
          class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
        >
          Cerrar Recibo
        </button>
      </div>

    </div>
  </div>
</Transition>

    <!-- Service Detail Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showServiceDetailModal && selectedService" class="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeServiceDetailModal"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[90%] sm:w-full max-w-md max-h-[85vh] overflow-y-auto relative z-10">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2 sm:space-x-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
                     :class="getServiceTypeColor(selectedService?.servicio?.nombre)">
                  <span class="text-sm sm:text-base">{{ getServiceTypeIcon(selectedService?.servicio?.nombre) }}</span>
                </div>
                <div>
                  <h3 class="text-sm sm:text-lg font-black text-gray-900 dark:text-white">{{ selectedService?.servicio?.nombre }}</h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">#{{ selectedService?.id_solicitud }}</p>
                </div>
              </div>
              <button @click="closeServiceDetailModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-3 sm:p-4 space-y-4"> 
            <!-- Client Info -->
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Información del Cliente</h4>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p class="font-bold text-blue-800 dark:text-blue-200 text-sm">{{ selectedService?.cliente?.nombre || selectedPayment?.cliente?.nombre }}</p>
                <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">{{ selectedPayment?.cliente?.telefono || selectedPayment.solicitud?.cliente?.telefono || '' }}</p>
              </div>
            </div>

            <!-- Location -->
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Ubicación</h4>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ selectedService?.colonia || 'Ubicación no disponible' }}</p>
                <p class="text-gray-600 dark:text-gray-400 text-xs">{{ selectedService?.direccion_precisa || '' }}{{ selectedService?.direccion_precisa && (selectedService?.ciudad?.nombre_ciudad || selectedService?.ciudad?.nombre) ? ', ' : '' }}{{ selectedService?.ciudad?.nombre_ciudad || selectedService?.ciudad?.nombre || '' }}</p>
              </div>
            </div>

            <!-- Description -->
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Descripción del Problema</h4>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ selectedService?.descripcion }}</p>
              </div>
            </div>

            <!-- Technician -->
            <div v-if="selectedService?.tecnico?.nombre">
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Técnico Asignado</h4>
              <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p class="font-bold text-green-800 dark:text-green-200 text-sm">{{ selectedService.tecnico.nombre }}</p>
              </div>
            </div>

            <!-- Cotizacion -->
            <div v-if="selectedService?.cotizacion && ['en_proceso', 'pendiente_pagoservicio', 'verificando_pagoservicio', 'finalizado', 'calificado'].includes(selectedService.estado)">
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Cotización</h4>
                <button 
                  @click="openAmountDetails('service', selectedService)"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver detalles
                </button>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ formatCurrency(parseFloat(selectedService.cotizacion?.monto_manodeobra || 0) - parseFloat(selectedService.cotizacion?.credito_usado || 0)) }}</p>
              </div>
            </div>
            
            <!-- Comments -->
            <div v-if="selectedService?.comentario">
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Comentarios</h4>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ selectedService.comentario }}</p>
              </div>
            </div>

            <!-- Rating if exists -->
            <div v-if="selectedService?.calificacion?.calificacion">
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Calificación</h4>
              <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <div class="flex items-center mb-2">
                  <span class="text-yellow-500 mr-2">⭐</span>
                  <span class="font-bold text-yellow-800 dark:text-yellow-200">{{ selectedService.calificacion.calificacion }}/5</span>
                </div>
                <p v-if="selectedService.calificacion.comentario" class="text-yellow-700 dark:text-yellow-300 text-sm">{{ selectedService.calificacion.comentario }}</p>
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
      <div v-if="showAmountDetailsModal" class="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-3">
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
          <div class="p-3 space-y-3">
            <div v-if="paymentType === 'visit'" class="space-y-2">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h4 class="font-medium text-blue-800 dark:text-blue-200 text-xs sm:text-sm mb-2">Pago de Visita</h4>
                <div class="text-xs sm:text-sm space-y-1">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Monto:</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ serviceToPayment?.pagoVisita?.monto ? formatCurrency(serviceToPayment.pagoVisita.monto) : 'L. 150.00' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="paymentType === 'service' && serviceToPayment?.cotizacion" class="space-y-3">
              <div class="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50">
                <h4 class="font-medium text-blue-800 dark:text-blue-200 text-xs sm:text-sm mb-2">Desglose de Cotización</h4>
                <div class="text-xs sm:text-sm space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Mano de obra:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(serviceToPayment.cotizacion.monto_manodeobra || 0) }}</span>
                  </div>
                  <div v-if="Number(serviceToPayment.cotizacion.credito_usado) > 0" class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Crédito usado:</span>
                    <span class="font-medium text-blue-600 dark:text-blue-400">-{{ formatCurrency(serviceToPayment.cotizacion.credito_usado) }}</span>
                  </div>
                  <hr class="border-gray-200 dark:border-gray-600">
                   <div class="flex justify-between font-bold">
                     <span class="text-gray-900 dark:text-white">Total recibido:</span>
                     <span class="text-gray-900 dark:text-white">{{ formatCurrency((parseFloat(serviceToPayment.cotizacion.monto_manodeobra || 0) - parseFloat(serviceToPayment.cotizacion.credito_usado || 0))) }}</span>
                   </div>
                </div>
              </div>

              <!-- Beneficio Cashback -->
              <div v-if="Number(serviceToPayment.cotizacion.descuento_membresia) > 0" class="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">✨ Cashback Generado</span>
                  <span class="font-bold text-emerald-700 dark:text-emerald-300">+{{ formatCurrency(serviceToPayment.cotizacion.descuento_membresia) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Header --> 
    <HeadersHeaderReportesAdmin />

    <!-- Content Container -->
    <div class="max-w-xl mx-auto bg-white dark:bg-gray-900 min-h-screen pb-20">
      
      <!-- Estadísticas de la Plataforma con Filtro (Fusionado con Ingresos) -->
      <section class="px-2 sm:px-4 py-3 sm:py-4 mb-4 sm:mb-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-sm sm:text-lg font-black text-gray-900 dark:text-white whitespace-nowrap">
            Estadísticas Financieras
          </h2>
        </div>
        
        <!-- Filtros de fecha para estadísticas -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 shadow border border-gray-100 dark:border-gray-700">
          <h3 class="text-xs font-semibold text-gray-900 dark:text-white mb-2">Período de Análisis</h3>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5 block">Desde</label>
              <input 
                type="date"
                v-model="platformDateFrom"
                @change="updatePlatformStats"
                class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded px-2 py-1.5"
              />
            </div>
            <div>
              <label class="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5 block">Hasta</label>
              <input 
                type="date"
                v-model="platformDateTo"
                @change="updatePlatformStats"
                class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded px-2 py-1.5"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 sm:gap-3">
          <!-- Ingresos Totales -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span class="text-green-600 dark:text-green-400 text-sm sm:text-lg">💰</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.totalRevenue || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Ganancia Total
                </p>
              </div>
            </div>
          </div>

          <!-- Ingresos por Membresía -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <span class="text-purple-600 dark:text-purple-400 text-sm sm:text-lg">💳</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.membershipRevenue || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Ingresos Membresía
                </p>
              </div>
            </div>
          </div>
      
          <!-- Ingresos Por Visita -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span class="text-blue-600 dark:text-blue-400 text-sm sm:text-lg">🏠</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.visitRevenue || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Ingresos Por Visita
                </p>
              </div>
            </div>
          </div>
      
          <!-- Ingresos Servicios -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <span class="text-yellow-600 dark:text-yellow-400 text-sm sm:text-lg">🛠️</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.serviceRevenue || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Ingresos Servicios
                </p>
              </div>
            </div>
          </div>
      
          <!-- Ingresos Paquetes -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <span class="text-orange-600 dark:text-orange-400 text-sm sm:text-lg">📦</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.packageRevenue || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Ingresos Paquetes
                </p>
              </div>
            </div>
          </div>

          <!-- retiros -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <span class="text-red-600 dark:text-red-400 text-sm sm:text-lg">💸</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.totalWithdrawals || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Pasivos en Retiros
                </p>
              </div>
            </div>
          </div>

          <!-- comisiones -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <span class="text-indigo-600 dark:text-indigo-400 text-sm sm:text-lg">💰</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.totalCommissions || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Comisiones (Referidos)
                </p>
              </div>
            </div>
          </div>

          <!-- cashback -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                <span class="text-pink-600 dark:text-pink-400 text-sm sm:text-lg">✨</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.totalCashback || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Cashback (Créditos)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="px-3 sm:px-4 mb-3 sm:mb-4 relative z-1">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 class="text-base sm:text-lg font-black text-gray-900 dark:text-white line-clamp-1">Análisis de Datos</h2>
          <div class="flex items-center space-x-2">
            <!-- Selector de Ciudad (Dinámico) -->
            <multiselect 
              v-if="['serviceTypeCity', 'techCity', 'cities'].includes(selectedChart)"
              v-model="selectedCityChart"
              :options="availableCities"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              placeholder="Todas las ciudades"
              label="nombre_ciudad"
              track-by="id_ciudad"
              class="multiselect-admin-filter w-40 sm:w-48"
              select-label=""
              deselect-label=""
            >
              <template #singleLabel="{ option }">
                <span class="text-[10px] sm:text-xs truncate">📍 {{ option.nombre_ciudad }}</span>
              </template>
            </multiselect>

            <multiselect 
              v-model="selectedChartObject"
              :options="availableCharts"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              placeholder="Seleccionar gráfico"
              label="name"
              track-by="id"
              class="multiselect-admin-filter w-44 sm:w-48"
              :custom-label="getChartLabel"
              :options-limit="100"
            >
              <template #singleLabel="{ option }">
                <span class="text-[9px] sm:text-xs truncate">{{ getChartLabel(option) }}</span>
              </template>
            </multiselect>
          </div>
        </div>
      </section>

      <!-- Contenedor de Gráficos -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-2">
            {{ getChartTitle() }}
          </h3>
          <div class="relative w-full" style="padding-bottom: 60%;">
            <div class="absolute inset-0">
              <canvas :id="'chart-' + selectedChart" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de Transacciones -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">Transacciones</h2>
          <!-- Selector de mes (igual que el de pestañas) -->
          <input 
            type="month"
            v-model="selectedMonthTransactions"
            @change="updateSelectedMonth('transactions')"
            class="px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          />
        </div>

        <div class="space-y-2">
          <div v-if="isLoadingTransactions" class="text-center py-6 sm:py-8">
            <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">Cargando transacciones...</p>
          </div>

          <div v-else-if="transactions.length === 0" class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">Sin transacciones</h3>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No hay transacciones registradas para la fecha seleccionada</p>
          </div>

          <template v-else>
            <div v-for="transaction in visibleTransactions" :key="transaction.id_movimiento || transaction.id"
                 class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 sm:space-x-3"> 
                  <div :class="getTransactionIconClass(transaction.tipo)" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs sm:text-sm">{{ getTransactionIcon(transaction.tipo) }}</span>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{{ getTransactionTitle(transaction) }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      <template v-if="transaction.id_pago">#P{{ transaction.id_pago }}</template>
                      <template v-if="transaction.id_solicitud && transaction.id_solicitud != transaction.id_pago"> • #S{{ transaction.id_solicitud }}</template>
                      <template v-if="(transaction.id_pago || transaction.id_solicitud) && getTransactionSubtitle(transaction)"> • </template>
                      <template v-if="getTransactionSubtitle(transaction)">{{ getTransactionSubtitle(transaction) }}</template>
                      <template v-if="transaction.id_pago || transaction.id_solicitud || getTransactionSubtitle(transaction)"> • </template>
                      {{ formatDate(transaction.fecha) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p :class="getTransactionAmountClass(transaction.tipo, transaction.estado)" class="font-bold text-[12px] sm:text-base">
                    {{ transaction.tipo === 'ingreso' ? '+' : (['ingreso_referido', 'cashback'].includes(transaction.tipo) ? '' : '-') }}{{ formatCurrency(transaction.monto || 0) }}
                  </p>
                  <p class="text-[10px]" :class="getStatusColor(transaction.estado, transaction.tipo)">
                    {{ transaction.estado || 'Sin estado' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Paginación - Siempre visible cuando hay transacciones -->
            <div v-if="transactions.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400"> 
                </div>
                <div class="flex items-center space-x-2">
                  <button 
                    @click="previousPage" 
                    :disabled="currentTransactionPage <= 1 || isLoadingTransactions"
                    class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'opacity-50 cursor-not-allowed': currentTransactionPage <= 1 }"
                    aria-label="Página anterior"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                    Página {{ currentTransactionPage }} de {{ transactionsPagination.totalPages || 1 }}
                  </span>
                  
                  <button 
                    @click="nextPage" 
                    :disabled="currentTransactionPage >= (transactionsPagination.totalPages || 1) || isLoadingTransactions"
                    class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'opacity-50 cursor-not-allowed': currentTransactionPage >= (transactionsPagination.totalPages || 1) }"
                    aria-label="Página siguiente"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Footer con totales -->
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3 mt-4 border border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between">
                <!-- Ingresos -->
                <div class="flex items-center space-x-2">
                  <span class="text-green-500">💰</span>
                  <div>
                    <p class="text-xs text-gray-600 dark:text-gray-300">Ingresos</p>
                    <p class="text-sm font-bold text-green-600 dark:text-green-400">+{{ formatCurrency(transactionsSummary.totalIngresos || 0) }}</p>
                  </div>
                </div>

                <!-- Separador -->
                <div class="h-8 w-px bg-gray-200 dark:bg-gray-600"></div>

                <!-- Retiros -->
                <div class="flex items-center space-x-2">
                  <span class="text-red-500">💳</span>
                  <div>
                    <p class="text-xs text-gray-600 dark:text-gray-300">Retiros</p>
                    <p class="text-sm font-bold text-red-600 dark:text-red-400">-{{ formatCurrency(transactionsSummary.totalRetiros || 0) }}</p>
                  </div>
                </div>

                <!-- Separador -->
                <div class="h-8 w-px bg-gray-200 dark:bg-gray-600"></div>

                <!-- Balance Neto -->
                <div class="text-right">
                  <p class="text-xs text-gray-600 dark:text-gray-300">Utilidad Real</p>
                  <p class="text-sm font-bold" :class="getBalanceClass()">
                    {{ getNetBalance() }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </section>

      <!-- Pagos y Retiros con pestañas REDISEÑADA -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-3">
          <!-- Header con título, selector de mes y buscador -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <h2 class="text-sm font-black text-gray-900 dark:text-white">Gestión de Pagos y Retiros</h2>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="relative flex-1 sm:w-48">
                <input
                  type="text"
                  v-model="searchInput"
                  @input="debouncedSearch"
                  @keyup.enter="debouncedSearch"
                  placeholder="Buscar por ID del pago"
                  class="w-full px-3 py-1.5 text-[11px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  @click="clearSearch"
                  v-if="searchId"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input 
                type="month"
                v-model="selectedMonthPayments"
                @change="updateSelectedMonth('payments')"
                class="px-2 py-1.5 text-[11px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
          </div>
      
          <!-- Pestañas principales -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-3">
            <div class="flex border-b border-gray-200 dark:border-gray-600">
              <button 
                v-for="tab in [
                  { id: 'membership', label: '💳 Membresía' },
                  { id: 'visits', label: '🏠 Visitas' },
                  { id: 'services', label: '🛠️ Servicios' },
                  { id: 'withdrawals', label: '💸 Retiros' }
                ]"
                :key="tab.id"
                @click="setActiveTab(tab.id)"
                :class="{
                  'bg-blue-600 text-white border-blue-600': activeTab === tab.id,
                  'text-gray-700 dark:text-gray-300 border-transparent hover:text-blue-600 dark:hover:text-blue-400': activeTab !== tab.id
                }"
                class="flex-1 px-2 py-2 text-[11px] font-medium border-b-2 transition-colors"
              >
                {{ tab.label }}
              </button>
            </div>
      
            <!-- Resumen mensual integrado (CONTADORES DINÁMICOS) -->
            <div class="p-2">
              <div class="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div class="text-sm font-bold text-green-600 dark:text-green-400">{{ totalMonthlyStats[activeTab]?.aprobados || 0 }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-400">Aprobados</div>
                </div>
                <div>
                  <div class="text-sm font-bold text-red-600 dark:text-red-400">{{ totalMonthlyStats[activeTab]?.rechazados || 0 }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-400">Rechazados</div>
                </div>
                <div>
                  <div class="text-sm font-bold text-yellow-600 dark:text-yellow-400">{{ totalMonthlyStats[activeTab]?.pendientes || 0 }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-400">Pendientes</div>
                </div>
                <div>
                  <div class="text-[12px] font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(totalMonthlyStats[activeTab]?.total || 0) }}</div>
                  <div class="text-[8px] text-gray-600 dark:text-gray-400">Total</div>
                </div>
              </div>
            </div>
          </div>
      
          <!-- Filtros por estado con 4 opciones - Usando initialStats que se establece una sola vez -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            <div class="flex bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
              <button 
                v-for="filter in [
                  { id: 'all', label: '📋Todos', 
                    count: (totalMonthlyStats[activeTab]?.aprobados || 0) + 
                           (totalMonthlyStats[activeTab]?.rechazados || 0) + 
                           (totalMonthlyStats[activeTab]?.pendientes || 0), 
                    color: 'blue' },
                  { id: 'pending', label: '⏳Pendientes', 
                    count: totalMonthlyStats[activeTab]?.pendientes || 0, 
                    color: 'yellow' },
                  { id: 'approved', label: '✅Aprobados', 
                    count: totalMonthlyStats[activeTab]?.aprobados || 0, 
                    color: 'green' },
                  { id: 'rejected', label: '❌Rechazados', 
                    count: totalMonthlyStats[activeTab]?.rechazados || 0, 
                    color: 'red' }
                ]"
                :key="filter.id"
                @click="setStatusFilter(filter.id)"
                :class="{
                  'bg-blue-600 text-white': statusFilter === 'all' && filter.id === 'all',
                  'bg-yellow-600 text-white': statusFilter === 'pending' && filter.id === 'pending',
                  'bg-green-600 text-white': statusFilter === 'approved' && filter.id === 'approved',
                  'bg-red-600 text-white': statusFilter === 'rejected' && filter.id === 'rejected',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': statusFilter !== filter.id
                }"
                class="px-2 py-1 text-[10px] font-medium transition-colors"
                :title="filter.id === 'all' ? 'Todos' : 
                       filter.id === 'pending' ? 'Pendientes' :
                       filter.id === 'approved' ? 'Aprobados' : 'Rechazados'"
              >
                {{ filter.label }} ({{ filter.count }})
              </button>
            </div>
          </div>
      
          <div class="space-y-1.5">
            <div v-if="isLoadingData" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p class="mt-1.5 text-[11px] text-gray-600 dark:text-gray-400">Cargando {{ getLoadingMessage() }}...</p>
            </div>
      
            <div v-if="getCurrentTabData().length === 0" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center border border-dashed border-gray-200 dark:border-gray-600">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Sin {{ getEmptyMessage() }}</h3>
              <p class="text-[11px] text-gray-600 dark:text-gray-400">No hay {{ getEmptyMessage() }} {{ getStatusFilterText() }}</p>
            </div>
            
            <template v-else>
              <div class="grid grid-cols-2 gap-1.5">
                <div v-for="item in getCurrentTabData()" :key="item.id || item.id_membresia || item.id_pagovisita || item.id_cotizacion || item.id_movimiento"
                     :class="getItemCardClass(item.status || item.estado)"
                     class="rounded-lg p-2 shadow-sm border text-[11px]"
                >
                  <div class="mb-2">
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center space-x-1.5 flex-1 min-w-0">
                        <div :class="getItemIconClass(item.status || item.estado)" class="w-5 h-5 rounded flex items-center justify-center flex-shrink-0">
                          <span :class="getItemIconTextClass(item.status || item.estado)" class="text-[10px]">{{ getItemIcon() }}</span>
                        </div>
                        <h3 class="font-bold text-gray-900 dark:text-white text-[10px] truncate flex-1 min-w-0">{{ getItemTitle(item) }}</h3>
                      </div>
                      <p :class="getItemAmountClass(item.status || item.estado)" class="font-bold text-[9px] whitespace-nowrap flex-shrink-0 ml-1">{{ formatCurrency(item.amount || item.monto || item.monto_total || 0) }}</p>
                    </div> 
                  </div>
                  <button @click="showItemDetails(item)" 
                          class="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[9px] px-2 py-1 rounded font-medium transition-colors"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </template>
            
            <!-- Paginación -->
            <div v-if="getCurrentTabData().length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Mostrando {{ getCurrentTabData().length }} registros
                </div>
                <div class="flex items-center space-x-2">
                  <button 
                    @click="previousPaymentsPage" 
                    :disabled="currentPaymentsPage <= 1 || isLoadingData"
                    class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPaymentsPage <= 1 }"
                    aria-label="Página anterior"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                    {{ pagination.page }} de {{ pagination.totalPages }}
                  </span>
                  
                  <button 
                    @click="nextPaymentsPage" 
                    :disabled="!pagination.hasMore || isLoadingData"
                    class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'opacity-50 cursor-not-allowed': !pagination.hasMore }"
                    aria-label="Página siguiente"
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

      <!-- SECCIÓN: Centro de Facturación Inteligente -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-3">
          <!-- Header con título y selector de mes -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <div class="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg">
                <span class="text-blue-600 dark:text-blue-400 text-sm">⚡</span>
              </div>
              <h2 class="text-sm font-black text-gray-900 dark:text-white">Centro de Facturación Inteligente</h2>
            </div>
            <input 
              type="month"
              v-model="billingMonth"
              @change="loadPendingBilling"
              class="px-2 py-1 text-[11px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          <!-- Resumen de Contadores (Estilo consistente) -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 mb-3 border border-gray-100 dark:border-gray-600/50">
            <div class="grid grid-cols-4 gap-2 text-center">
              <div>
                <div class="text-sm font-black text-gray-900 dark:text-white">{{ billingCounts.total }}</div>
                <div class="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-medium">Pendientes</div>
              </div>
              <div>
                <div class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ billingCounts.membership }}</div>
                <div class="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-medium">Membresías</div>
              </div>
              <div>
                <div class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{ billingCounts.visits }}</div>
                <div class="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-medium">Visitas</div>
              </div>
              <div>
                <div class="text-sm font-bold text-purple-600 dark:text-purple-400">{{ billingCounts.services }}</div>
                <div class="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-medium">Servicios</div>
              </div>
              <div>
                <div class="text-sm font-bold text-orange-600 dark:text-orange-400">{{ billingCounts.packages }}</div>
                <div class="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-medium">Paquetes</div>
              </div>
            </div>
          </div>

          <!-- Botón de acción -->
          <button 
            v-if="filteredPendingBilling.length > 0"
            @click="openNextPendingBilling"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold text-xs shadow-sm transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <span>🚀 Comenzar Facturación Rápida</span>
            <span class="bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px]">{{ filteredPendingBilling.length }}</span>
          </button>
          <div v-else class="text-center py-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-200 dark:border-gray-600">
            <p class="text-xs text-gray-500 dark:text-gray-400">No hay ingresos pendientes de factura.</p>
          </div>
        </div>
      </section>

      <!-- Sección de Reportería -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-3">
          <!-- Header con título y selector de mes -->
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-black text-gray-900 dark:text-white">Reportes</h2>
            <input 
              type="month"
              v-model="selectedMonthReports"
              @change="updateSelectedMonth('reports')"
              class="px-2 py-1 text-[11px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
          
        <div class="grid grid-cols-1 gap-2 sm:gap-3">
          <div v-for="report in availableReports" :key="report.id"
               class="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-2 sm:p-3 shadow-sm hover:shadow transition-shadow"
          >
            <div class="flex justify-between items-start h-full">
              <div class="pr-1 sm:pr-2 flex-1 min-w-0">
                <h3 class="text-[12px] sm:text-xs font-medium text-gray-900 dark:text-white mb-0.5 line-clamp-1">{{ report.title }}</h3>
                <p class="text-[12px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ report.description }}</p>
              </div>
              <button 
                @click="generateReport(report)" 
                :disabled="report.generating"
                class="flex-shrink-0 text-[12px] sm:text-xs bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-2 sm:px-3 py-1 rounded-lg transition-colors flex items-center justify-center h-6 sm:h-7 min-w-[40px] sm:min-w-[50px] shadow-sm"
              >
                <span v-if="report.generating" class="animate-spin">⏳</span>
                <span v-else class="leading-none">PDF</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </section>

      <!-- Footer -->
      <FootersFooterAdmin />
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { Chart, registerables } from 'chart.js';
import { useHead, useCookie, useRuntimeConfig } from '#imports';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '~/middleware/auth.store'; 
import DataLabelsPlugin from 'chartjs-plugin-datalabels'; 
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';
import Toast from '~/components/ui/Toast.vue'; 
import Multiselect from 'vue-multiselect';

// Configuración 
const { $pdf } = useNuxtApp();
const { $api } = useNuxtApp();
const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const auth = useAuthStore();
const userCookie = useCookie('user');

// SEO and Meta
useHead({
  title: 'MiSeguro - Reportes',
  meta: [
    { name: 'description', content: 'Reportes del sistema MiSeguro - Administrar solicitudes, asignaciones y seguimiento' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.9, user-scalable=no'}
  ]
});

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(false);
const isLoadingData = ref(false);
const isLoadingTransactions = ref(false);
const selectedChart = ref('earnings');
const selectedChartObject = ref(null);
const availableCities = ref([{ id_ciudad: 'all', nombre_ciudad: 'Todas las ciudades' }]);
const selectedCityChart = ref({ id_ciudad: 'all', nombre_ciudad: 'Todas las ciudades' });

// Variables de datos de empresa
const empresaNombre = ref('MiSeguro');
const empresaTelefono = ref('XXXX9451');
const empresaEmail = ref('XXXXX@gmail.com');
const empresaRTN = ref('XXXX-XXXX-XXXXXX');
const configuracionRTN = ref('')
const empresaCAI = ref('');
const empresaRangoAutorizado = ref('');
const empresaFechaLimite = ref('');
const empresaCorrelativo = ref('');

// Inicializar selectedChartObject con la primera opción
const initializeChartObject = () => {
  if (availableCharts.length > 0) {
    selectedChartObject.value = availableCharts[0];
  }
};

const activeTab = ref('membership');
const selectedMonthTransactions = ref('');
const selectedMonthPayments = ref('');
const selectedMonthReports = ref(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
const statusFilter = ref('all');
const showServiceDetailModal = ref(false);
const showDetailsModal = ref(false);
const showWithdrawalModal = ref(false);
const showFacturaModal = ref(false);
const selectedPayment = ref(null);
const selectedWithdrawal = ref(null);
const selectedFacturaPayment = ref(null);
const selectedService = ref(null);
const showBankDetailsModal = ref(false);
const showAmountDetailsModal = ref(false);
const isBillingModalOpen = ref(false);

const anyModalOpen = computed(() => {
  return showDetailsModal.value || 
         showWithdrawalModal.value || 
         showFacturaModal.value || 
         showServiceDetailModal.value || 
         showAmountDetailsModal.value || 
         isBillingModalOpen.value ||
         showBankDetailsModal.value
})

watch(anyModalOpen, (newValue) => {
  if (process.client) {
    const overflowValue = newValue ? 'hidden' : ''
    document.body.style.overflow = overflowValue
    document.documentElement.style.overflow = overflowValue
  }
})
const initialStats = ref({
  aprobados: 0,
  rechazados: 0,
  pendientes: 0,
  total: 0,
  totalMoney: 0
});

// Data arrays
const membershipPayments = ref([]);
const visitPayments = ref([]);
const servicePayments = ref([]);
const withdrawals = ref([]);
const transactions = ref([]);
const isProcessingBilling = ref(false);
const isApproving = ref(false);
const isRejecting = ref(false);
const billingMonth = ref(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
const pendingBillingItems = ref([]);
const currentBillingItem = ref(null);
const billingForm = reactive({
  tipo_factura: 'CONSUMIDOR_FINAL',
  nombre_cliente: 'CONSUMIDOR FINAL',
  rtn_cliente: 'CF',
  subtotal: 0,
  isv: 0,
  total: 0
}); 
const activeCorrelativo = ref(null);
const isLoadingCorrelativo = ref(false);

// Cache para datos
const paymentsCache = ref({});
const transactionsCache = ref({});
const monthlyStatsCache = ref({});
const filterCountsCache = ref({});

// Estadísticas mensuales FIJAS (sin filtros)
const totalMonthlyStats = ref({
  membership: { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 },
  visits: { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 },
  services: { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 },
  withdrawals: { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 }
});

// Variables para fechas
const platformDateFrom = ref('');
const platformDateTo = ref('');

// Variables de búsqueda
const searchId = ref('');
const searchInput = ref('');

// Función de búsqueda con debounce de 1.5 segundos
const debouncedSearch = useDebounceFn(() => {
  searchId.value = searchInput.value.trim();
  if (searchId.value) {
    searchById();
  } else {
    clearSearch();
  }
}, 1500);
const searchResults = ref(null);
const isSearching = ref(false);


// Variables de paginación
const currentTransactionPage = ref(1);
const currentPaymentsPage = ref(1);
const paymentsPerPage = 4;

// ===== DATOS REACTIVOS =====
const platformStats = reactive({
  totalRevenue: 0,
  membershipRevenue: 0,
  visitRevenue: 0,
  serviceRevenue: 0,
  packageRevenue: 0,
  totalWithdrawals: 0,
  totalCommissions: 0,
  totalCashback: 0
});

const transactionsSummary = ref({
  totalIngresos: '0.00',
  totalRetiros: '0.00'
});
const transactionsPagination = ref({
  total: 0,
  page: 1,
  limit: 5,
  totalPages: 1
});

const pagination = ref({
  total: 0,
  page: 1,
  totalPages: 1,
  hasMore: false
});

// Variables de notificaciones
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  duration: 3000
});

// Computed para items pendientes de facturación
const filteredPendingBilling = computed(() => {
  return (pendingBillingItems.value || []).filter(item => !item.facturaRelacion?.factura);
});

const billingCounts = computed(() => {
  const items = pendingBillingItems.value || [];
  return {
    membership: items.filter(item => item.billingType === 'membership').length,
    visits: items.filter(item => item.billingType === 'visits').length,
    services: items.filter(item => item.billingType === 'services').length,
    packages: items.filter(item => item.billingType === 'packages').length,
    total: items.length
  };
});

const formattedNextCorrelativo = computed(() => {
  if (!activeCorrelativo.value || activeCorrelativo.value.estado !== 'ACTIVO') return '---';
  const next = (activeCorrelativo.value.correlativo_actual || 0) + 1;
  return `${activeCorrelativo.value.prefijo || ''}${next.toString().padStart(8, '0')}`;
});

// ===== FUNCIONES DE UTILIDAD =====
const loadEmpresaConfig = async () => {
  try {
    // Obtener configuraciones básicas de la empresa
    const [telefonoRes, emailRes, rtnRes] = await Promise.all([
      $api('/config/valor/numero_empresa', {
        method: 'GET'
      }),
      $api('/config/valor/correo_empresa', {
        method: 'GET'
      }),
      $api('/config/valor/rtn', {
        method: 'GET'
      })
    ]);

    // Asignar valores si existen las respuestas
    if (telefonoRes?.valor) {
      empresaTelefono.value = telefonoRes.valor.toString();
    }
    if (emailRes?.valor) {
      empresaEmail.value = emailRes.valor.toString();
    }
    if (rtnRes?.valor) {
      empresaRTN.value = rtnRes.valor.toString();
    }

  } catch (error) {
    console.error('Error cargando configuración de empresa:', error);
    // Mantener valores por defecto si hay error
  }
};

const formatCurrency = (value) => {
  try {
    if (value === undefined || value === null || isNaN(value)) return 'L. 0.00';
    const number = parseFloat(value);
    return `L. ${number.toLocaleString('es-HN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  } catch (error) {
    console.error('Error formateando moneda:', error);
    return 'L. 0.00';
  }
};

const formatDate = (dateString) => {
  try {
    if (!dateString) return 'N/A';
    // Extraer solo la parte YYYY-MM-DD para evitar problemas de zona horaria
    // Funciona tanto para 'YYYY-MM-DD' como para 'YYYY-MM-DDTHH:mm:ss.sssZ'
    const datePart = String(dateString).substring(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      const [year, month, day] = datePart.split('-');
      const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const monthName = months[parseInt(month) - 1];
      return `${parseInt(day)} ${monthName} ${year}`;
    }
    // Para otros formatos inesperados, usar el método de locale
    const options = { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Fecha inválida';
  }
};

const formatDateDDMMYY = (dateString) => {
  try {
    const date = dateString ? new Date(dateString) : new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}${month}${year}`;
  } catch (error) {
    console.error('Error formateando fecha DDMMYY:', error);
    return 'FechaInválida';
  }
};

const mapApiStatusToFrontend = (apiStatus) => {
  try {
    if (!apiStatus) return 'Pendiente';
    
    // Convertir a minúsculas para manejo insensible a mayúsculas
    const statusLower = String(apiStatus).toLowerCase().trim();
    
    const statusMap = {
      'pendiente': 'Pendiente',
      'aprobado': 'Aprobado', 
      'aceptado': 'Aprobado',
      'pagado': 'Pendiente',
      'rechazado': 'Rechazado',
      'confirmado': 'Aprobado',
      'activa': 'Aprobado',
      'vencida': 'Aprobado',
      'rechazada': 'Rechazado',
      'expirada': 'Rechazado',
      'cancelado': 'Rechazado',
      'pendiente': 'Pendiente',
      'completado': 'Aprobado'
    };
    
    return statusMap[statusLower] || 'Pendiente';
  } catch (error) {
    console.error('Error mapeando estado:', error);
    return 'Pendiente';
  }
};

// ===== FUNCIONES DE CARGA DE DATOS CON FILTROS POR ESTADO =====
const loadMembershipPayments = async (page = 1) => {
  // Store initial stats if not already set
  if (page === 1 && !initialStats.value.total && totalMonthlyStats.value?.membership) {
    const stats = totalMonthlyStats.value.membership;
    
    initialStats.value = {
      aprobados: stats.aprobados || 0,
      rechazados: stats.rechazados || 0,
      pendientes: stats.pendientes || 0,
      total: (stats.aprobados || 0) + 
             (stats.rechazados || 0) + 
             (stats.pendientes || 0),
      totalMoney: stats.total || 0
    }; 
  }
  try {
    const limit = paymentsPerPage;
    const offset = (page - 1) * limit;
    const cacheKey = `membership-${selectedMonthPayments.value || 'all'}-${statusFilter.value || 'all'}-${page}-${limit}`;
    const statsCacheKey = `membership-${selectedMonthPayments.value || 'all'}-counts`;
    
    membershipPayments.value = [];
    
    const params = new URLSearchParams();
    
    if (selectedMonthPayments.value) {
      params.append('month', selectedMonthPayments.value);
    }
    
    // Agregar filtro de estado
    if (statusFilter.value && statusFilter.value !== 'all') {
      const estadoMap = {
        'approved': ['activa', 'vencida'],
        'pending': ['pendiente'],
        'rejected': ['rechazada', 'rechazado']
      };
      
      const estadosFiltro = estadoMap[statusFilter.value] || [statusFilter.value];
      estadosFiltro.forEach(estado => {
        if (estado) {
          params.append('estado', estado);
        }
      });
      
      // Usar contadores en caché si solo cambia el filtro de estado
      if (filterCountsCache.value[statsCacheKey]) {
        totalMonthlyStats.value.membership = { ...filterCountsCache.value[statsCacheKey] };
      }
    }
    
    params.append('limit', limit);
    
    // Verificar si los datos están en caché
    if (paymentsCache.value[cacheKey]) {
      const { data, pagination: cachedPagination } = paymentsCache.value[cacheKey];
      membershipPayments.value = data || [];
      
      // No actualizar estadísticas desde caché de paginación
      // Las estadísticas vendrán de filterCountsCache
      
      if (cachedPagination) {
        pagination.value = { ...cachedPagination };
      }
      
      return;
    }
    
    params.append('offset', offset);
    
    const url = `/membresia?${params.toString()}`;
    
    const response = await $api(url, {
      method: 'GET'
    }); 

    if (response?.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : [response.data];
      
      const mapApiStatusToFrontend = (apiStatus) => {
        const statusMap = {
          'activa': 'Aprobado',
          'vencida': 'Aprobado',
          'pendiente': 'Pendiente',
          'rechazada': 'Rechazado',
        };
        
        // Convertir a minúsculas para hacer la búsqueda insensible a mayúsculas
        const statusLower = (apiStatus || '').toLowerCase();
        return statusMap[statusLower] || 'Pendiente';
      };
      
      // Procesar los ítems para mapear los estados
      const processedItems = items.map(item => ({
        ...item,
        id: item.id_membresia,
        billingType: 'membership',
        // Mapear los estados al formato del frontend
        estado: mapApiStatusToFrontend(item.estado),
        // Asegurar que existan las propiedades necesarias
        monto: item.monto || 0,
        fecha: item.fecha || new Date().toISOString(),
        usuario: item.usuario || { nombre: 'Usuario no disponible', telefono: '' },
        cuenta: item.cuenta || { banco: 'No especificado', beneficiario: '', num_cuenta: '', tipo: '' },
        // Propiedades adicionales para consistencia con otros tipos de pago
        amount: item.monto || 0,
        date: item.fecha,
        status: mapApiStatusToFrontend(item.estado)
      }));
      
      membershipPayments.value = processedItems;
      
      // Procesar estadísticas
      const stats = response.estadisticas ? {
        aprobados: response.estadisticas.aprobados || 0,
        rechazados: response.estadisticas.rechazados || 0,
        pendientes: response.estadisticas.pendientes || 0,
        total: response.estadisticas.total || 0
      } : {
        aprobados: 0,
        rechazados: 0,
        pendientes: 0,
        total: 0
      };
      
      // Actualizar estadísticas
      totalMonthlyStats.value.membership = { ...stats };
      
      // Guardar en caché las estadísticas totales
      monthlyStatsCache.value[`membership-${selectedMonthPayments.value || 'all'}`] = { ...stats };
      
      // Guardar contadores de filtros
      if (statusFilter.value === 'all' || !statusFilter.value) {
        filterCountsCache.value[statsCacheKey] = { ...stats };
      }
      
      const totalItems = response.total || response.pagination?.total || response.paginacion?.total || items.length;
      const totalPages = response.totalPages || response.pagination?.totalPages || response.paginacion?.totalPages || Math.ceil(totalItems / limit) || 1;
      
      pagination.value = {
        total: totalItems,
        page: page,
        totalPages: totalPages,
        hasMore: (offset + items.length) < totalItems
      };
      
      // Guardar en caché los datos
      paymentsCache.value[cacheKey] = {
        data: [...processedItems],
        pagination: { ...pagination.value }
      };
      
      // Si es la primera página, guardar también las estadísticas
      if (page === 1) {
        paymentsCache.value[cacheKey].stats = { ...stats };
      }
      
    } else {
      membershipPayments.value = [];
    }
  } catch (error) {
    console.error('Error al cargar pagos de membresías:', error);
    showToast('Error al cargar los pagos de membresías', 'error');
    console.error('Error al cargar pagos de membresía:', error);
    showToast('Error al cargar los pagos de membresía', 'error');
    membershipPayments.value = [];
  }
};

const loadVisitPayments = async (page = 1) => {
  try {
    const limit = paymentsPerPage;
    const offset = (page - 1) * limit;
    const cacheKey = `visits-${selectedMonthPayments.value || 'all'}-${statusFilter.value || 'all'}-${page}-${limit}`;
    const statsCacheKey = `visits-${selectedMonthPayments.value || 'all'}-counts`;
    
    visitPayments.value = [];
    
    const params = new URLSearchParams();
    
    if (selectedMonthPayments.value) {
      params.append('month', selectedMonthPayments.value);
    }
    
    // Agregar filtro de estado
    if (statusFilter.value && statusFilter.value !== 'all') {
      const estadoMap = {
        'pending': 'Pendiente',
        'approved': 'Aprobado',
        'rejected': 'Rechazado'
      };
      const estado = estadoMap[statusFilter.value] || statusFilter.value;
      if (estado) {
        params.append('estado', estado);
      }
      
      // Usar contadores en caché si solo cambia el filtro de estado
      if (filterCountsCache.value[statsCacheKey]) {
        totalMonthlyStats.value.visits = { ...filterCountsCache.value[statsCacheKey] };
      }
    }
    
    params.append('limit', limit);
    params.append('offset', offset);
    
    if (paymentsCache.value[cacheKey]) {
      const { data, pagination: cachedPagination } = paymentsCache.value[cacheKey];
      visitPayments.value = data || [];
      
      // No actualizar estadísticas desde caché de paginación
      // Las estadísticas vendrán de filterCountsCache
      
      if (cachedPagination) {
        pagination.value = { ...cachedPagination };
      }
      
      return;
    }
    
    const url = `/pagovisita?${params.toString()}`;
    
    const response = await $api(url, {
      method: 'GET'
    });
    
    if (response?.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : [response.data];
      const transformedData = items.map(item => ({
        ...item,
        id: item.id_pagovisita,
        billingType: 'visits',
        status: mapApiStatusToFrontend(item.estado),
        amount: item.monto || 0,
        date: item.fecha,
        service: item.solicitud?.servicio?.nombre || 'Servicio de visita',
        client: item.usuario?.nombre || 'Cliente desconocido',
        technician: item.solicitud?.tecnico?.nombre || 'Sin asignar'
      }));
      
      visitPayments.value = transformedData;
      
      // Actualizar estadísticas TOTALES
      if (response.estadisticas_totales) {
        const stats = {
          aprobados: response.estadisticas_totales.aprobados || 0,
          rechazados: response.estadisticas_totales.rechazados || 0,
          pendientes: response.estadisticas_totales.pendientes || 0,
          total: response.estadisticas_totales.total || 0
        };
        
        totalMonthlyStats.value.visits = { ...stats };
        
        // Guardar en caché las estadísticas
        if (!monthlyStatsCache.value[`visits-${selectedMonthPayments.value || 'all'}`]) {
          monthlyStatsCache.value[`visits-${selectedMonthPayments.value || 'all'}`] = { ...stats };
        }
        
        // Guardar contadores de filtros
        filterCountsCache.value[statsCacheKey] = { ...stats };
      } else if (response.estadisticas) {
        const stats = {
          aprobados: response.estadisticas.aprobados || 0,
          rechazados: response.estadisticas.rechazados || 0,
          pendientes: response.estadisticas.pendientes || 0,
          total: response.estadisticas.total || 0
        };
        
        if (statusFilter.value === 'all') {
          totalMonthlyStats.value.visits = { ...stats };
          
          // Guardar en caché las estadísticas solo si no hay filtro de estado
          if (!monthlyStatsCache.value[`visits-${selectedMonthPayments.value || 'all'}`]) {
            monthlyStatsCache.value[`visits-${selectedMonthPayments.value || 'all'}`] = { ...stats };
          }
          
          // Guardar contadores de filtros
          filterCountsCache.value[statsCacheKey] = { ...stats };
        }
      }
      
      const totalItems = response.total || response.pagination?.total || response.paginacion?.total || items.length;
      const totalPages = response.totalPages || response.pagination?.totalPages || response.paginacion?.totalPages || Math.ceil(totalItems / limit) || 1;
      
      pagination.value = {
        total: totalItems,
        page: page,
        totalPages: totalPages,
        hasMore: (offset + items.length) < totalItems
      };
      
      if (!selectedMonthPayments.value) {
        paymentsCache.value[cacheKey] = { 
          data: [...transformedData],
          stats: response.estadisticas_totales || response.estadisticas || null,
          pagination: { ...pagination.value }
        };
      }
    } else {
      visitPayments.value = [];
    }
  } catch (error) {
    console.error('Error al cargar pagos de visitas:', error);
    showToast('Error al cargar los pagos de visitas', 'error');
    visitPayments.value = [];
  }
};

const loadServicePayments = async (page = 1) => {
  try {
    const limit = paymentsPerPage;
    const offset = (page - 1) * limit;
    const cacheKey = `services-${selectedMonthPayments.value || 'all'}-${statusFilter.value || 'all'}-${page}-${limit}`;
    const statsCacheKey = `services-${selectedMonthPayments.value || 'all'}-counts`;
    
    servicePayments.value = [];
    
    const params = new URLSearchParams();
    
    if (selectedMonthPayments.value) {
      params.append('month', selectedMonthPayments.value);
    }
    
    // Agregar filtro de estado
    if (statusFilter.value && statusFilter.value !== 'all') {
      const estadoMap = {
        'pending': 'pagado',
        'approved': 'confirmado',
        'rejected': 'rechazado'
      };
      const estado = estadoMap[statusFilter.value] || statusFilter.value;
      if (estado) {
        params.append('estado', estado);
      }
      
      // Usar contadores en caché si solo cambia el filtro de estado
      if (filterCountsCache.value[statsCacheKey]) {
        totalMonthlyStats.value.services = { ...filterCountsCache.value[statsCacheKey] };
      }
    }
    
    params.append('limit', limit);
    params.append('offset', offset);
    
    if (paymentsCache.value[cacheKey]) {
      const { data, pagination: cachedPagination } = paymentsCache.value[cacheKey];
      servicePayments.value = data || [];
      
      // No actualizar estadísticas desde caché de paginación
      // Las estadísticas vendrán de filterCountsCache
      
      if (cachedPagination) {
        pagination.value = { ...cachedPagination };
      }
      
      return;
    }
    
    // soloCuentas=true para que el panel de pagos solo muestre transferencias bancarias, NO efectivo
    params.append('soloCuentas', 'true');
    const url = `/cotizacion?${params.toString()}`;

    
    const response = await $api(url, {
      method: 'GET'
    });
    
    if (response?.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : [response.data];
      
      const transformedData = items.map(item => { 
        const serviceName = (item.solicitud && item.solicitud.servicio && item.solicitud.servicio.nombre) 
          ? item.solicitud.servicio.nombre 
          : 'Servicio';
        
        // Inyectar detalles de la cotización en la solicitud para el modal
        if (item.solicitud) {
          item.solicitud.cotizacion = {
            id: item.id_cotizacion,
            total: item.monto_total || 0,
            monto_manodeobra: item.monto_manodeobra || 0,
            descuento_membresia: item.descuento_membresia || 0,
            credito_usado: item.credito_usado || 0
          };
        }

        return {
          ...item,
          id: item.id_cotizacion,
           billingType: 'services',
           status: mapApiStatusToFrontend(item.estado),
           amount: (parseFloat(item.monto_manodeobra) || 0) - (parseFloat(item.credito_usado) || 0),
          date: item.fecha,
          service: serviceName,
          client: item.solicitud?.cliente?.nombre || 'Cliente desconocido',
          technician: item.solicitud?.tecnico?.nombre || 'Sin asignar',
          category: item.solicitud?.servicio?.categoria || 'general'
        };
      });
      
      servicePayments.value = transformedData;
      
      // Actualizar estadísticas TOTALES
      if (response.estadisticas_totales) {
        const stats = {
          aprobados: response.estadisticas_totales.aprobados || 0,
          rechazados: response.estadisticas_totales.rechazados || 0,
          pendientes: response.estadisticas_totales.pendientes || 0,
          total: response.estadisticas_totales.total || 0
        };
        
        totalMonthlyStats.value.services = { ...stats };
        
        // Guardar en caché las estadísticas
        if (!monthlyStatsCache.value[`services-${selectedMonthPayments.value || 'all'}`]) {
          monthlyStatsCache.value[`services-${selectedMonthPayments.value || 'all'}`] = { ...stats };
        }
        
        // Guardar contadores de filtros
        filterCountsCache.value[statsCacheKey] = { ...stats };
      } else if (response.estadisticas) {
        const stats = {
          aprobados: response.estadisticas.aprobados || 0,
          rechazados: response.estadisticas.rechazados || 0,
          pendientes: response.estadisticas.pendientes || 0,
          total: response.estadisticas.total || 0
        };
        
        if (statusFilter.value === 'all') {
          totalMonthlyStats.value.services = { ...stats };
          
          // Guardar en caché las estadísticas solo si no hay filtro de estado
          if (!monthlyStatsCache.value[`services-${selectedMonthPayments.value || 'all'}`]) {
            monthlyStatsCache.value[`services-${selectedMonthPayments.value || 'all'}`] = { ...stats };
          }
          
          // Guardar contadores de filtros
          filterCountsCache.value[statsCacheKey] = { ...stats };
        }
      }
      
      const totalItems = response.total || response.pagination?.total || response.paginacion?.total || items.length;
      const totalPages = response.totalPages || response.pagination?.totalPages || response.paginacion?.totalPages || Math.ceil(totalItems / limit) || 1;
      
      pagination.value = {
        total: totalItems,
        page: page,
        totalPages: totalPages,
        hasMore: (offset + items.length) < totalItems
      };
      
      if (!selectedMonthPayments.value) {
        paymentsCache.value[cacheKey] = { 
          data: [...transformedData],
          stats: response.estadisticas_totales || response.estadisticas || null,
          pagination: { ...pagination.value }
        };
      }
    } else {
      servicePayments.value = [];
    }
  } catch (error) {
    console.error('Error al cargar pagos de servicios:', error);
    showToast('Error al cargar los pagos de servicios', 'error');
    servicePayments.value = [];
  }
};

const loadWithdrawals = async (page = 1) => {
  try {
    const limit = paymentsPerPage;
    const offset = (page - 1) * limit;
    const cacheKey = `withdrawals-${selectedMonthPayments.value || 'all'}-${statusFilter.value || 'all'}-${page}-${limit}`;
    const statsCacheKey = `withdrawals-${selectedMonthPayments.value || 'all'}-counts`;
    
    withdrawals.value = [];
    
    const params = new URLSearchParams();
    
    if (selectedMonthPayments.value) {
      params.append('month', selectedMonthPayments.value);
    }
    
    // Agregar filtro de estado
    if (statusFilter.value && statusFilter.value !== 'all') {
      const estadoMap = {
        'pending': 'pendiente',
        'approved': 'completado',
        'rejected': 'rechazado'
      };
      const estado = estadoMap[statusFilter.value] || statusFilter.value;
      if (estado) {
        params.append('estado', estado);
      }
      
      // Usar contadores en caché si solo cambia el filtro de estado
      if (filterCountsCache.value[statsCacheKey]) {
        totalMonthlyStats.value.withdrawals = { ...filterCountsCache.value[statsCacheKey] };
      }
    }
    
    params.append('limit', limit);
    params.append('offset', offset);
    
    if (paymentsCache.value[cacheKey]) {
      const { data, pagination: cachedPagination } = paymentsCache.value[cacheKey];
      withdrawals.value = data || [];
      
      // No actualizar estadísticas desde caché de paginación
      // Las estadísticas vendrán de filterCountsCache
      
      if (cachedPagination) {
        pagination.value = { ...cachedPagination };
      }
      
      return;
    }
    
    const url = `/movimientos/retiros?${params.toString()}`;
    
    const response = await $api(url, {
      method: 'GET'
    });
    
    if (response?.movimientos) {
      const items = Array.isArray(response.movimientos) ? response.movimientos : [response.movimientos];
      
      const transformedData = items.map(item => ({
        ...item,
        id: item.id_movimiento,
        status: mapApiStatusToFrontend(item.estado),
        amount: item.monto || 0,
        date: item.fecha,
        technician: item.nombre_usuario || 'Usuario desconocido',
        bankDetails: item.descripcion || (item.tipo === 'retiro_referido' ? 'Retiro de fondos por referido' : 'Retiro de fondos')
      }));
      
      withdrawals.value = transformedData;
      
      // Actualizar estadísticas TOTALES
      if (response.estadisticas_totales) {
        const stats = {
          aprobados: response.estadisticas_totales.aprobados || 0,
          rechazados: response.estadisticas_totales.rechazados || 0,
          pendientes: response.estadisticas_totales.pendientes || 0,
          total: response.estadisticas_totales.total || 0
        };
        
        totalMonthlyStats.value.withdrawals = { ...stats };
        
        // Guardar en caché las estadísticas
        if (!monthlyStatsCache.value[`withdrawals-${selectedMonthPayments.value || 'all'}`]) {
          monthlyStatsCache.value[`withdrawals-${selectedMonthPayments.value || 'all'}`] = { ...stats };
        }
        
        // Guardar contadores de filtros
        filterCountsCache.value[statsCacheKey] = { ...stats };
      } else if (response.estadisticas) {
        const stats = {
          aprobados: response.estadisticas.aprobados || 0,
          rechazados: response.estadisticas.rechazados || 0,
          pendientes: response.estadisticas.pendientes || 0,
          total: response.estadisticas.total || 0
        };
        
        if (statusFilter.value === 'all') {
          totalMonthlyStats.value.withdrawals = { ...stats };
          
          // Guardar en caché las estadísticas solo si no hay filtro de estado
          if (!monthlyStatsCache.value[`withdrawals-${selectedMonthPayments.value || 'all'}`]) {
            monthlyStatsCache.value[`withdrawals-${selectedMonthPayments.value || 'all'}`] = { ...stats };
          }
          
          // Guardar contadores de filtros
          filterCountsCache.value[statsCacheKey] = { ...stats };
        }
      }
      
      const totalItems = response.total || response.paginacion?.total || items.length;
      const totalPages = response.totalPages || response.paginacion?.totalPages || Math.ceil(totalItems / limit) || 1;
      
      pagination.value = {
        total: totalItems,
        page: page,
        totalPages: totalPages,
        hasMore: (offset + items.length) < totalItems
      };
      
      if (!selectedMonthPayments.value) {
        paymentsCache.value[cacheKey] = { 
          data: [...transformedData],
          stats: response.estadisticas_totales || response.estadisticas || null,
          pagination: { ...pagination.value }
        };
      }
    } else {
      withdrawals.value = [];
    }
  } catch (error) {
    console.error('Error al cargar retiros:', error);
    showToast('Error al cargar los retiros', 'error');
    withdrawals.value = [];
  }
};

// ===== RESTO DE FUNCIONES SIN CAMBIOS SIGNIFICATIVOS =====
const loadTransactions = async (page = 1) => {
  try {
    const cacheKey = getCacheKey(page);
    
    if (transactionsCache.value[cacheKey]) {
      const cachedData = transactionsCache.value[cacheKey];
      transactions.value = cachedData.data || [];
      transactionsSummary.value = cachedData.summary || { totalIngresos: '0.00', totalRetiros: '0.00' };
      transactionsPagination.value = cachedData.pagination || { total: 0, page: 1, limit: 5, totalPages: 1 };
      currentTransactionPage.value = page;
      return;
    }
    
    isLoadingTransactions.value = true;
    
    const limit = 5;
    let url = `/movimientos?page=${page}&limit=${limit}`;
    
    if (selectedMonthTransactions.value) {
      url += `&fecha=${selectedMonthTransactions.value}`;
    }
    
    const response = await $api(url, {
      method: 'GET'
    });
    
    if (response?.success) {
      const transactionsData = response.data?.movimientos || response.data || [];
      const summary = response.summary || response.data?.summary || response.data?.resumen || {};
      const summaryData = {
        totalIngresos: parseFloat(summary.totalIngresos || '0').toFixed(2),
        totalRetiros: parseFloat(summary.totalRetiros || '0').toFixed(2)
      };
      
      const paginationData = response.pagination || response.data?.pagination || {};
      const totalItems = paginationData.total || transactionsData.length;
      const totalPages = paginationData.totalPages || Math.ceil(totalItems / limit) || 1;
      
      const paginationInfo = {
        total: totalItems,
        page: paginationData.page || page,
        limit: limit,
        totalPages: totalPages,
        hasMore: (paginationData.page || page) < totalPages
      };
      
      transactions.value = transactionsData;
      transactionsSummary.value = summaryData;
      transactionsPagination.value = paginationInfo;
      currentTransactionPage.value = page;
      
      transactionsCache.value[getCacheKey(page)] = {
        data: [...transactionsData],
        summary: { ...summaryData },
        pagination: { ...paginationInfo },
        timestamp: Date.now()
      };
      
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      Object.keys(transactionsCache.value).forEach(key => {
        if (transactionsCache.value[key]?.timestamp < oneHourAgo) {
          delete transactionsCache.value[key];
        }
      });
      
      await nextTick();
    } else {
      transactions.value = [];
      transactionsSummary.value = { totalIngresos: '0.00', totalRetiros: '0.00' };
      transactionsPagination.value = { total: 0, page: 1, limit: 5, totalPages: 1 };
      currentTransactionPage.value = 1;
    }
  } catch (error) {
    console.error('Error al cargar transacciones:', error);
    showToast('Error al cargar las transacciones', 'error');
    
    transactions.value = [];
    transactionsSummary.value = { totalIngresos: '0.00', totalRetiros: '0.00' };
    transactionsPagination.value = { total: 0, page: 1, limit: 5, totalPages: 1 };
    currentTransactionPage.value = 1;
  } finally {
    isLoadingTransactions.value = false;
  }
};

const getCacheKey = (page) => {
  return `${selectedMonthTransactions.value || 'all'}-${page}`;
};

// ===== FUNCIONES DE NAVEGACIÓN Y CONTROL =====
const getCurrentTabData = () => {
  try {
    switch (activeTab.value) {
      case 'membership': return membershipPayments.value;
      case 'visits': return visitPayments.value;
      case 'services': return servicePayments.value;
      case 'withdrawals': return withdrawals.value;
      default: return [];
    }
  } catch (error) {
    console.error('Error obteniendo datos de pestaña actual:', error);
    return [];
  }
};

// Track if initial stats have been set and store the initial values
const initialStatsSet = ref(false);
const initialMonthlyStats = ref(null);

const loadTabData = async (page = 1) => {
  try {
    isLoadingData.value = true;
    currentPaymentsPage.value = page;
    
    // Resetear la paginación
    if (page === 1) {
      pagination.value = {
        page: 1,
        total: 0,
        totalPages: 1,
        hasMore: false
      };
      
      // Set initial stats only once when loading first page and not set yet
      if (totalMonthlyStats.value?.membership && !initialStatsSet.value) {
        const stats = totalMonthlyStats.value.membership;
        initialMonthlyStats.value = { ...totalMonthlyStats.value };
        initialStats.value = {
          aprobados: stats.aprobados || 0,
          rechazados: stats.rechazados || 0,
          pendientes: stats.pendientes || 0,
          total: (stats.aprobados || 0) + (stats.rechazados || 0) + (stats.pendientes || 0)
        };
        initialStatsSet.value = true; 
      }
      
      // Restore initial stats if they were already set
      if (initialStatsSet.value && initialMonthlyStats.value) {
        totalMonthlyStats.value = { ...initialMonthlyStats.value };
      }
    }
    
    const cacheKey = `${activeTab.value}-${selectedMonthPayments.value || 'all'}`;
    const filterCacheKey = `${activeTab.value}-${selectedMonthPayments.value || 'all'}-counts`;
    
    // Restaurar estadísticas desde caché si existen
    if (monthlyStatsCache.value[cacheKey]) {
      totalMonthlyStats.value[activeTab.value] = { ...monthlyStatsCache.value[cacheKey] };
    }
    
    // Restaurar contadores de filtros desde caché si existen
    if (filterCountsCache.value[filterCacheKey]) {
      const cachedCounts = filterCountsCache.value[filterCacheKey];
      // Actualizar solo si no hay filtro de mes o si el mes coincide
      if (!selectedMonthPayments.value || cacheKey.includes(selectedMonthPayments.value)) {
        Object.assign(totalMonthlyStats.value[activeTab.value], cachedCounts);
      }
    }
    
    // Verificar si los datos completos están en caché
    const fullCacheKey = `${activeTab.value}-${selectedMonthPayments.value || 'all'}-${page}-${paymentsPerPage}`;
    const hasFullCachedData = paymentsCache.value[fullCacheKey] !== undefined;
    
    // Determinar si necesitamos cargar datos del servidor
    const hasNoCachedData = !monthlyStatsCache.value[cacheKey] || !filterCountsCache.value[filterCacheKey];
    const monthChanged = selectedMonthPayments.value && !paymentsCache.value[`${activeTab.value}-${selectedMonthPayments.value}-${page}-${paymentsPerPage}`];
    const statusChanged = statusFilter.value !== 'all';
    
    // Cargar datos si:
    // 1. No hay datos en caché
    // 2. Cambió el mes y no hay caché para ese mes
    // 3. Es la primera página y no hay caché
    // 4. Cambió el filtro de estado (para forzar recarga de datos filtrados)
    const shouldFetchData = hasNoCachedData || monthChanged || (page === 1 && !hasFullCachedData) || statusChanged;
    
    switch (activeTab.value) {
      case 'membership':
        await loadMembershipPayments(page);
        break;
      case 'visits':
        await loadVisitPayments(page);
        break;
      case 'services':
        await loadServicePayments(page);
        break;
      case 'withdrawals':
        await loadWithdrawals(page);
        break;
    }
  } catch (error) {
    console.error('Error al cargar datos de la pestaña:', error);
    showToast('Error al cargar los datos', 'error');
  } finally {
    isLoadingData.value = false;
  }
};

const setStatusFilter = (filter) => {
  statusFilter.value = filter;
  currentPaymentsPage.value = 1;
  loadTabData(1);
};

const setActiveTab = async (tab) => {
  try {
    if (activeTab.value === tab) return;
    
    // Guardar los datos actuales en caché antes de cambiar de pestaña
    if (activeTab.value) {
      const cacheKey = `${activeTab.value}-${selectedMonthPayments.value || 'all'}`;
      
      // Guardar estadísticas mensuales
      monthlyStatsCache.value[cacheKey] = { ...totalMonthlyStats.value[activeTab.value] };
      
      // Guardar contadores de filtros
      filterCountsCache.value[cacheKey] = {
        aprobados: totalMonthlyStats.value[activeTab.value]?.aprobados || 0,
        rechazados: totalMonthlyStats.value[activeTab.value]?.rechazados || 0,
        pendientes: totalMonthlyStats.value[activeTab.value]?.pendientes || 0,
        total: totalMonthlyStats.value[activeTab.value]?.total || 0
      };
    }
    
    activeTab.value = tab;
    statusFilter.value = 'all';
    currentPaymentsPage.value = 1;
    
    // Cargar datos de la nueva pestaña
    await loadTabData(1);
    
    // Actualizar initialStats con los datos de la nueva pestaña
    if (totalMonthlyStats.value?.[tab]) {
      const stats = totalMonthlyStats.value[tab];
      initialStats.value = {
        aprobados: stats.aprobados || 0,
        rechazados: stats.rechazados || 0,
        pendientes: stats.pendientes || 0,
        total: (stats.aprobados || 0) + (stats.rechazados || 0) + (stats.pendientes || 0),
        totalMoney: stats.total || 0
      };
    }
  } catch (error) {
    console.error('Error estableciendo pestaña activa:', error);
  }
};

const updateSelectedMonth = async (type = 'payments') => {
  try {
    if (type === 'transactions') {
      transactionsCache.value = {};
      currentTransactionPage.value = 1;
      await loadTransactions(1);
    } else {
      // Limpiar la caché de estadísticas mensuales cuando cambia el mes
      if (selectedMonthPayments.value) {
        const cacheKey = `${activeTab.value}-${selectedMonthPayments.value}`;
        const filterCacheKey = `${activeTab.value}-${selectedMonthPayments.value}-counts`;
        delete monthlyStatsCache.value[cacheKey];
        delete filterCountsCache.value[filterCacheKey];
      }
      // Resetear el filtro de estado al cambiar de mes
      statusFilter.value = 'all';
      await loadTabData();
    }
  } catch (error) {
    console.error('Error actualizando mes seleccionado:', error);
  }
};

// ===== FUNCIONES DE DETALLES DE MONTO (COPIADO DE SERVICIOSADMIN) =====
const paymentType = ref('');
const serviceToPayment = ref(null);

const openAmountDetails = (type, service) => {
  paymentType.value = type;
  serviceToPayment.value = service;
  showAmountDetailsModal.value = true;
};

// ===== FUNCIONES DE PAGINACIÓN =====
const nextPage = () => {
  try {
    const nextPageNum = currentTransactionPage.value + 1;
    
    if (nextPageNum <= (transactionsPagination.value?.totalPages || 1)) {
      loadTransactions(nextPageNum);
    }
  } catch (error) {
    console.error('Error en nextPage:', error);
  }
};

const previousPage = () => {
  try {
    const prevPageNum = currentTransactionPage.value - 1;
    
    if (prevPageNum >= 1) {
      loadTransactions(prevPageNum);
    }
  } catch (error) {
    console.error('Error en previousPage:', error);
  }
};

const previousPaymentsPage = () => {
  if (currentPaymentsPage.value > 1) {
    const prevPage = currentPaymentsPage.value - 1;
    loadTabData(prevPage).then(() => {
      const container = document.querySelector('.grid\\.grid-cols-2\\.gap-1\\.5');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
};

const nextPaymentsPage = () => {
  if (pagination.value.hasMore) {
    const nextPage = currentPaymentsPage.value + 1;
    loadTabData(nextPage).then(() => {
      const container = document.querySelector('.grid\\.grid-cols-2\\.gap-1\\.5');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
};

const searchById = async () => {
  if (!searchId.value.trim()) {
    showToast('Por favor ingresa un ID para buscar', 'error');
    return;
  }

  isSearching.value = true;
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  
  try {
    let endpoint = '';
    let params = {};
    
    // Determinar el endpoint según la pestaña activa
    switch (activeTab.value) {
      case 'membership':
        endpoint = '/membresia/buscar/' + searchId.value;
        break;
      case 'visits':
        endpoint = '/pagovisita/' + searchId.value;
        break;
      case 'services':
        endpoint = '/cotizacion/' + searchId.value;
        break;
      case 'withdrawals':
        endpoint = '/movimientos/retiros/' + searchId.value; 
        break;
      default:
        throw new Error('Pestaña no válida');
    } 
    
    const response = await $api(endpoint, {
      method: 'GET',
      params: params
    }); 

    // Manejar la respuesta basada en la pestaña activa
    if (response?.success) {
      // Para la pestaña de retiros, los datos vienen en response.movimientos
      // Para las demás pestañas, vienen en response.data
      const responseData = activeTab.value === 'withdrawals' 
        ? (response.movimientos || [])
        : (Array.isArray(response.data) ? response.data : [response.data]); 
      
      // Limpiar los datos actuales
      switch (activeTab.value) {
        case 'membership': {
          const transformedData = responseData.map(item => ({
            ...item,
            id: item.id_membresia,
            billingType: 'membership',
            status: mapApiStatusToFrontend(item.estado),
            amount: item.monto || 0,
            date: item.fecha,
            service: 'Membresía',
            client: item.usuario?.nombre || 'Cliente desconocido',
            technician: 'N/A'
          }));

          membershipPayments.value = transformedData;
          break;
        }

        case 'visits': {
          const transformedData = responseData.map(item => ({
            ...item,
            id: item.id_pagovisita,
            billingType: 'visits',
            status: mapApiStatusToFrontend(item.estado),
            amount: item.monto || 0,
            date: item.fecha,
            service: item.solicitud?.servicio?.nombre || 'Servicio de visita',
            client: item.usuario?.nombre || 'Cliente desconocido',
            technician: item.solicitud?.tecnico?.nombre || 'Sin asignar'
          }));

          visitPayments.value = transformedData;
          break;
        }

        case 'services': {
          const transformedData = responseData.map(item => {
            const serviceName = item.solicitud?.servicio?.nombre || 'Servicio';

            // Inyectar detalles de la cotización en la solicitud para el modal
            if (item.solicitud) {
              item.solicitud.cotizacion = {
                id: item.id_cotizacion,
                total: item.monto_total || 0,
                monto_manodeobra: item.monto_manodeobra || 0,
                descuento_membresia: item.descuento_membresia || 0,
                credito_usado: item.credito_usado || 0
              };
            }

            return {
              ...item,
              id: item.id_cotizacion,
              billingType: 'services',
              status: mapApiStatusToFrontend(item.estado),
              amount: (parseFloat(item.monto_manodeobra) || 0) - (parseFloat(item.credito_usado) || 0),
              date: item.fecha,
              service: serviceName,
              client: item.solicitud?.cliente?.nombre || 'Cliente desconocido',
              technician: item.solicitud?.tecnico?.nombre || 'Sin asignar',
              category: item.solicitud?.servicio?.categoria || 'general'
            };
          });

          servicePayments.value = transformedData;
          break;
        }

        case 'withdrawals': {
          const transformedData = responseData.map(item => ({
            ...item,
            id: item.id_movimiento,
            billingType: 'withdrawals',
            status: mapApiStatusToFrontend(item.estado),
            amount: item.monto || 0,
            date: item.fecha,
            technician: item.nombre_usuario || 'Técnico desconocido',
            bankDetails: item.descripcion || (item.tipo === 'retiro_referido' ? 'Retiro de fondos por referido' : 'Retiro de fondos'),
            // Agregar campos adicionales que podrían necesitarse
            client: item.nombre_usuario || 'Usuario',
            service: item.tipo === 'retiro_referido' ? 'Retiro de Referido' : 'Retiro de fondos',
            category: item.tipo
          }));

          withdrawals.value = transformedData;
          break;
        }
      }

      // Verificar si hay datos en el array correspondiente
      const hasData = activeTab.value === 'withdrawals' 
        ? (response.movimientos && response.movimientos.length > 0)
        : (responseData && responseData.length > 0);
      
      if (hasData) {
        showToast('Resultado encontrado', 'success');
      } else {
        // Limpiar los datos si no hay resultados
        switch (activeTab.value) {
          case 'membership': membershipPayments.value = []; break;
          case 'visits': visitPayments.value = []; break;
          case 'services': servicePayments.value = []; break;
          case 'withdrawals': withdrawals.value = []; break;
        }
        showToast('No se encontró ningún registro con el ID proporcionado', 'warning');
      }
    } else {
      // Limpiar los datos si no hay resultados
      switch (activeTab.value) {
        case 'membership': membershipPayments.value = []; break;
        case 'visits': visitPayments.value = []; break;
        case 'services': servicePayments.value = []; break;
        case 'withdrawals': withdrawals.value = []; break;
      }
      showToast('No se encontró ningún registro con el ID proporcionado', 'warning');
    }
  } catch (error) {
    console.error('❌ Error al buscar por ID:', error);
    // Limpiar los datos en caso de error
    switch (activeTab.value) {
      case 'membership': membershipPayments.value = []; break;
      case 'visits': visitPayments.value = []; break;
      case 'services': servicePayments.value = []; break;
      case 'withdrawals': withdrawals.value = []; break;
    }
    
    // Manejar específicamente el caso de no encontrado (404)
    if (error.response?.status === 404) {
      showToast('No se encontró ningún registro con el ID proporcionado', 'warning');
    } else {
      showToast(
        error.response?._data?.message || 'Error al buscar el registro', 
        'error'
      );
    }
  } finally {
    isSearching.value = false;
  }
};

const clearSearch = () => {
  searchId.value = '';
  searchInput.value = ''; 
  // Recargar los datos normales de la pestaña actual
  loadTabData(1);
};

// ===== FUNCIONES DE UI Y HELPERS =====
const getSelectedMonthName = (type = 'payments') => {
  try {
    let monthValue;
    if (type === 'transactions') {
      monthValue = selectedMonthTransactions.value;
    } else if (type === 'payments') {
      monthValue = selectedMonthPayments.value;
    } else if (type === 'reports') {
      monthValue = selectedMonthReports.value;
    } else {
      monthValue = new Date().toISOString().slice(0, 7);
    }
    
    if (!monthValue) return 'Seleccionar mes';
    const date = new Date(monthValue + '-01');
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  } catch (error) {
    console.error('Error al formatear el mes:', error);
    return 'Mes inválido';
  }
};

const getLoadingMessage = () => {
  try {
    switch (activeTab.value) {
      case 'membership': return 'pagos de membresía';
      case 'visits': return 'pagos de visitas';
      case 'services': return 'pagos de servicios';
      case 'withdrawals': return 'retiros solicitados';
      default: return 'datos';
    }
  } catch (error) {
    console.error('Error obteniendo mensaje de carga:', error);
    return 'datos';
  }
};

const getEmptyMessage = () => {
  try {
    switch (activeTab.value) {
      case 'membership': return 'pagos de membresía';
      case 'visits': return 'pagos de visitas';
      case 'services': return 'pagos de servicios';
      case 'withdrawals': return 'retiros pendientes';
      default: return 'elementos';
    }
  } catch (error) {
    console.error('Error obteniendo mensaje vacío:', error);
    return 'elementos';
  }
};

const getStatusFilterText = () => {
  try {
    switch (statusFilter.value) {
      case 'pending': return 'pendientes';
      case 'approved': return 'aprobados';
      case 'rejected': return 'rechazados';
      default: return '';
    }
  } catch (error) {
    console.error('Error obteniendo texto de filtro:', error);
    return '';
  }
};

// ===== FUNCIONES DE ESTILOS Y CLASES =====
const getStatusBadgeClass = (status) => {
  try {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'pagado': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'aprobado': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'aceptado': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'confirmado': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'completado': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'activa': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'rechazado': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'rechazada': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'cancelado': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'expirada': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      case 'pendiente': 
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  } catch (error) {
    console.error('Error obteniendo clase de estado:', error);
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  }
};

const getStatusColor = (status, tipo) => {
  try {
    const statusLower = (status || '').toLowerCase();
    
    if ((tipo === 'ingreso_referido' || tipo === 'cashback') && statusLower === 'completado') {
      return 'text-blue-400';
    } else if ((tipo === 'ingreso_referido' || tipo === 'cashback') && statusLower === 'pendiente') {
      return 'text-yellow-400';
    }
    
    if ((tipo === 'retiro' || tipo === 'retiro_referido') && statusLower === 'completado') {
      return 'text-red-400';
    }
    
    switch (statusLower) {
      case 'pagado': return 'text-yellow-500';
      case 'completado': return 'text-green-500';
      case 'calificado': return 'text-green-500';
      case 'aceptado': return 'text-green-500';
      case 'aprobado': return 'text-green-500';
      case 'pendiente': return 'text-yellow-500';
      case 'rechazado': return 'text-red-500';
      case 'cancelado': return 'text-red-400';
      case 'en proceso': return 'text-blue-500';
      case 'activa': return 'text-green-500';
      case 'expirada': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  } catch (error) {
    console.error('Error obteniendo color de estado:', error);
    return 'text-gray-500';
  }
};

const getItemCardClass = (status) => {
  try {
    const baseClass = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600';
    
    switch (status) {
      case 'Aprobado': return baseClass + ' border-l-4 border-l-green-500';
      case 'Rechazado': return baseClass + ' border-l-4 border-l-red-500';
      case 'Aceptado': return baseClass + ' border-l-4 border-l-green-500';
      case 'Pagado': return baseClass + ' border-l-4 border-l-yellow-500';
      case 'Pendiente':
      default: return baseClass + ' border-l-4 border-l-yellow-500';
    }
  } catch (error) {
    console.error('Error obteniendo clase de tarjeta:', error);
    return 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 border-l-4 border-l-yellow-500';
  }
};

const getItemIconClass = (status) => {
  try {
    switch (status) {
      case 'Aprobado': return 'bg-green-100 dark:bg-green-900/30';
      case 'Aceptado': return 'bg-green-100 dark:bg-green-900/30';
      case 'Pagado': return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'Rechazado': return 'bg-red-100 dark:bg-red-900/30'; 
      case 'Pendiente':
      default: return 'bg-yellow-100 dark:bg-yellow-900/30';
    }
  } catch (error) {
    console.error('Error obteniendo clase de icono:', error);
    return 'bg-yellow-100 dark:bg-yellow-900/30';
  }
};

const getItemIconTextClass = (status) => {
  try {
    switch (status) {
      case 'Aprobado': return 'text-green-600 dark:text-green-400';
      case 'Aceptado': return 'text-green-600 dark:text-green-400';
      case 'Pagado': return 'text-yellow-600 dark:text-yellow-400';
      case 'Rechazado': return 'text-red-600 dark:text-red-400';
      case 'Pendiente':
      default: return 'text-yellow-600 dark:text-yellow-400';
    }
  } catch (error) {
    console.error('Error obteniendo clase de texto de icono:', error);
    return 'text-yellow-600 dark:text-yellow-400';
  }
};

const getItemIcon = () => {
  try {
    switch (activeTab.value) {
      case 'membership': return '💳';
      case 'visits': return '🏠';
      case 'services': return '🛠️';
      case 'withdrawals': return '💳';
      default: return '📄';
    }
  } catch (error) {
    console.error('Error obteniendo icono de item:', error);
    return '📄';
  }
};

// ===== FUNCIONES DE FACTURACIÓN =====
const loadPendingBilling = async () => {
  try {
    isLoadingData.value = true;
    const month = billingMonth.value;
    
    const response = await $api(`/facturas/pendientes?month=${month}`);

    if (response?.status === 'success') {
      pendingBillingItems.value = response.data || [];
    }
  } catch (error) {
    console.error('Error cargando pendientes de facturación:', error);
    showToast('Error al cargar pendientes de facturación', 'error');
  } finally {
    isLoadingData.value = false;
  }
};

const fetchActiveCorrelativo = async () => {
  try {
    isLoadingCorrelativo.value = true;
    const response = await $api('/facturas/estado-correlativo');
    if (response?.status === 'success') {
      activeCorrelativo.value = response.data;
    }
  } catch (error) {
    console.error('Error al obtener correlativo:', error);
  } finally {
    isLoadingCorrelativo.value = false;
  }
};

const openNextPendingBilling = async () => {
  if (filteredPendingBilling.value.length > 0) {
    currentBillingItem.value = filteredPendingBilling.value[0];
    
    // Resetear form con datos del item
    billingForm.tipo_factura = 'CONSUMIDOR_FINAL';
    billingForm.nombre_cliente = 'CONSUMIDOR FINAL';
    billingForm.rtn_cliente = 'CF';
    
    // Cargar correlativo actual
    await fetchActiveCorrelativo();
    
    isBillingModalOpen.value = true;
  } else {
    showToast('No hay facturas pendientes', 'success');
  }
};

const closeBillingModal = () => {
  isBillingModalOpen.value = false;
  currentBillingItem.value = null;
};

const saveFactura = async ({ form, next }) => {
  if (isProcessingBilling.value) return;
  
  try {
    isProcessingBilling.value = true;
    const item = currentBillingItem.value;
    const total = parseFloat(item.amount || item.monto || item.monto_total || 0);
    const subtotal = total;
    const isv = 0.00;

    const payload = {
      ...form,
      subtotal: subtotal.toFixed(2),
      isv: isv.toFixed(2),
      total: total.toFixed(2),
      id_usuario: item.id_usuario || item.usuario?.id_usuario || item.id_cliente || item.cliente?.id_usuario,
      id_pagovisita: item.billingType === 'visits' ? (item.id_pagovisita || item.id) : null,
      id_cotizacion: item.billingType === 'services' ? (item.id_cotizacion || item.id) : null,
      id_membresia: item.billingType === 'membership' ? (item.id_membresia || item.id) : null,
      id_pago_paquete: item.billingType === 'packages' ? (item.id_pago_paquete || item.id) : null
    };

    const response = await $api('/facturas', {
      method: 'POST',
      body: payload
    });

    if (response?.status === 'success') {
      showToast('Factura generada y vinculada correctamente', 'success');
      
      // Eliminar el item de la lista local
      pendingBillingItems.value = pendingBillingItems.value.filter(i => i.id_local !== item.id_local);

      if (next && filteredPendingBilling.value.length > 0) {
        // Abrir el siguiente inmediatamente
        currentBillingItem.value = filteredPendingBilling.value[0];
        // Resetear form
        billingForm.tipo_factura = 'CONSUMIDOR_FINAL';
        billingForm.nombre_cliente = 'CONSUMIDOR FINAL';
        billingForm.rtn_cliente = 'CF';
      } else {
        closeBillingModal();
      }
      
      // Recargar datos de tabla principal
      loadTabData(currentPaymentsPage.value);
      
      // Actualizar correlativo para el siguiente
      await fetchActiveCorrelativo();
    } else if (response?.status === 'error_config') {
      showToast(response.message, 'warning');
      if (!next) closeBillingModal();
    }
  } catch (error) {
    console.error('Error al guardar factura:', error);
    showToast(error.message || 'Error al generar la factura', 'error');
  } finally {
    isProcessingBilling.value = false;
  }
};

const getItemAmountClass = (status) => {
  try {
    if (!status) return 'text-gray-600 dark:text-gray-400';
    
    // Manejar tanto estados en mayúsculas como en minúsculas
    const statusStr = String(status).toLowerCase().trim();
    
    switch (statusStr) {
      case 'aprobado':
      case 'aceptado':
      case 'aprobada':
      case 'completado':
      case 'aceptada':
        return 'text-green-600 dark:text-green-400';
      case 'rechazado':
      case 'rechazada':
        return 'text-red-600 dark:text-red-400';
      case 'pendiente':
      case 'pagado':
      case 'pendiente de pago':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  } catch (error) {
    console.error('Error obteniendo clase de monto:', error);
    return 'text-gray-600 dark:text-gray-400';
  }
};

const getItemTitle = (item) => {
  try {
    if (!item) return 'Item';
    
    let title;
    switch (activeTab.value) {
      case 'membership': title = item.plan || 'Membresía'; break;
      case 'visits': title = item.service || 'Visita Técnica'; break;
      case 'services': title = item.service || item.serviceName || 'Servicio'; break;
      case 'withdrawals': title = item.technician || 'Retiro'; break;
      default: return 'Item';
    }
    return title.length > 15 ? `${title.substring(0, 15)}...` : title;
  } catch (error) {
    console.error('Error obteniendo título de item:', error);
    return 'Item';
  }
};

// Funciones de transacciones
const getTransactionIcon = (type) => {
  try {
    switch (type) {
      case 'ingreso': 
      case 'ingreso_referido': 
      case 'cashback': return '💰';
      case 'retiro':
      case 'retiro_referido': return '💳';
      case 'commission': return '💰';
      case 'withdrawal': return '💳';
      case 'refund': return '↩️';
      default: return '💸';
    }
  } catch (error) {
    console.error('Error obteniendo icono de transacción:', error);
    return '💸';
  }
};

const getTransactionIconClass = (type) => {
  try {
    switch (type) {
      case 'ingreso':
      case 'ingreso_referido': 
      case 'cashback': return 'bg-green-500';
      case 'retiro':
      case 'retiro_referido': return 'bg-red-500';
      case 'commission': return 'bg-green-500';
      case 'withdrawal': return 'bg-red-500';
      case 'refund': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  } catch (error) {
    console.error('Error obteniendo clase de icono de transacción:', error);
    return 'bg-blue-500';
  }
};

const getTransactionAmountClass = (type, estado) => {
  try {
    const estadoLower = (estado || '').toLowerCase();
    
    if (estadoLower === 'pendiente') {
      return 'text-yellow-600 dark:text-yellow-400';
    }
    
    if (type === 'ingreso' || type === 'commission') {
      return 'text-green-600 dark:text-green-400';
    } else if (type === 'ingreso_referido' || type === 'cashback') {
      return 'text-blue-600 dark:text-blue-400';
    } else {
      return 'text-red-600 dark:text-red-400';
    }
  } catch (error) {
    console.error('Error obteniendo clase de monto de transacción:', error);
    return 'text-gray-600 dark:text-gray-400';
  }
};

const getTransactionTitle = (transaction) => {
  try {
    if (!transaction) return 'Transacción';
    
    switch (transaction.tipo) {
      case 'ingreso':
        return transaction.servicio || transaction.descripcion || 'Ingreso por servicio';
      case 'ingreso_referido':
        return transaction.descripcion || 'Ingreso por referido';
      case 'cashback':
        return transaction.descripcion || 'Cashback por servicio';
      case 'retiro':
      case 'retiro_referido':
        return 'Retiro de fondos'; // Siempre muestra este texto para retiros
      default:
        return transaction.descripcion || 'Transacción';
    }
  } catch (error) {
    console.error('Error obteniendo título de transacción:', error);
    return 'Transacción';
  }
};

const getTransactionSubtitle = (transaction) => {
  try {
    if (!transaction) return '';
    
    const parts = [];
    
    switch (transaction.tipo) {
      case 'ingreso':
        if (transaction.colonia) parts.push(transaction.colonia);
        break;
      case 'ingreso_referido':
      case 'cashback':
        const nombreReferido = transaction.id_usuario || transaction.nombre_usuario || 'Usuario';
        return nombreReferido.length > 17 ? nombreReferido.substring(0, 15) + '...' : nombreReferido;
    }
    
    if (parts.length === 0 && transaction.nombre_usuario && transaction.nombre_usuario !== 'Usuario') {
      const nombre = transaction.nombre_usuario;
      parts.push(nombre.length > 17 ? nombre.substring(0, 15) + '...' : nombre);
    }
    
    return parts.join(' • ');
  } catch (error) {
    console.error('Error obteniendo subtítulo de transacción:', error);
    return '';
  }
};

const getBalanceClass = () => {
  try {
    const ingresos = parseFloat(transactionsSummary.value?.totalIngresos || 0);
    const retiros = parseFloat(transactionsSummary.value?.totalRetiros || 0);
    const balance = ingresos - retiros;
    return balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  } catch (error) {
    console.error('Error obteniendo clase de balance:', error);
    return 'text-gray-600 dark:text-gray-400';
  }
};

const getNetBalance = () => {
  try {
    const ingresos = parseFloat(transactionsSummary.value?.totalIngresos || 0);
    const retiros = parseFloat(transactionsSummary.value?.totalRetiros || 0);
    const balance = Number((ingresos - retiros).toFixed(2));
    const prefix = balance >= 0 ? '+' : '-';
    return `${prefix}${formatCurrency(Math.abs(balance))}`;
  } catch (error) {
    console.error('Error calculando balance neto:', error);
    return '0';
  }
};

// ===== FUNCIONES DE MODAL =====
const showItemDetails = (item) => {
  try {
    if (item.tipo === 'retiro' || item.tipo === 'retiro_referido') {
      selectedWithdrawal.value = item;
      showWithdrawalModal.value = true;
    } else {
      selectedPayment.value = item;
      showDetailsModal.value = true;
    }
  } catch (error) {
    console.error('Error al mostrar detalles del ítem:', error);
    showToast('Error al cargar los detalles', 'error');
  }
};

const closeDetailsModal = () => {
  try {
    showDetailsModal.value = false;
    selectedPayment.value = null;
  } catch (error) {
    console.error('Error cerrando modal:', error);
  }
};

const openFacturaModal = async (payment) => {
  try {
    if (!payment) {
      console.error('No se proporcionó un pago');
      return;
    }

    // Resetear variables fiscales para evitar que se muestren datos de la factura anterior
    empresaCAI.value = '';
    empresaCorrelativo.value = '';
    empresaRangoAutorizado.value = '';
    empresaFechaLimite.value = '';

    // Clonar para no modificar el objeto original y resetear campos financieros/fiscales
    selectedFacturaPayment.value = { 
      ...payment, 
      subtotal: 0, 
      isv: 0, 
      total: 0,
      rtn_cliente: '' 
    };
    showFacturaModal.value = true;

    // Si no tiene id_factura, intentar buscar por el ID del pago
    if (!payment.id_factura && (payment.id_cotizacion || payment.id_membresia || payment.id_pagovisita)) {
      try {
        const params = new URLSearchParams();
        if (payment.id_cotizacion) params.append('id_cotizacion', payment.id_cotizacion);
        if (payment.id_membresia) params.append('id_membresia', payment.id_membresia);
        if (payment.id_pagovisita) params.append('id_pagovisita', payment.id_pagovisita);

        const response = await $api(`/facturas/relaciones/idpago?${params.toString()}`, {
          method: 'GET'
        });

        if (response?.status === 'success' && response.factura) {
          const factura = response.factura;
          const correlativo = response.correlativo;
          
          // Actualizar variables de datos fiscales con los datos de la factura
          if (factura.cai) empresaCAI.value = factura.cai;
          if (factura.numero_factura_correlativo) empresaCorrelativo.value = factura.numero_factura_correlativo;
          
          // Actualizar con datos del correlativo
          if (correlativo) {
            if (correlativo.rango_autorizado) empresaRangoAutorizado.value = correlativo.rango_autorizado;
            if (correlativo.fecha_limite_emision) empresaFechaLimite.value = correlativo.fecha_limite_emision;
          }
          
          // Actualizar RTN del cliente en selectedFacturaPayment
          if (factura.rtn_cliente) selectedFacturaPayment.value.rtn_cliente = factura.rtn_cliente;
          
          // Actualizar datos financieros en selectedFacturaPayment
          if (factura.subtotal) selectedFacturaPayment.value.subtotal = factura.subtotal;
          if (factura.isv) selectedFacturaPayment.value.isv = factura.isv;
          if (factura.total) selectedFacturaPayment.value.total = factura.total;
          
        } else if (response?.status === 'not_found') {
          console.warn('ℹ️ No se encontró factura asociada al pago:', response.message);
          // Los valores ya están reseteados por el inicio de la función
        } else {
          console.warn('No se encontró factura asociada al pago:', response);
        }
      } catch (error) {
        console.warn('No se pudo cargar la factura asociada al pago:', error);
        if (error.response) {
          console.error('Detalles del error:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          });
        }
      }
    } else if (payment.id_factura) {
      // Obtener datos de la factura específica si hay un ID
      try {
        const response = await $api(`/facturas/${payment.id_factura}`, {
          method: 'GET'
        });

        if (response?.status === 'success' && response.factura) {
          const factura = response.factura;
          
          // Actualizar variables de datos fiscales con los datos de la factura
          if (factura.cai) empresaCAI.value = factura.cai;
          if (factura.numero_factura_correlativo) empresaCorrelativo.value = factura.numero_factura_correlativo;
          
        } else {
          console.warn('La respuesta no contiene datos de factura válidos:', response);
        }
      } catch (error) {
        console.error('Error obteniendo datos de factura:', error);
        if (error.response) {
          console.error('Detalles del error:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          });
        } else if (error.request) {
          console.error('No se recibió respuesta del servidor:', error.request);
        } else {
          console.error('Error al configurar la solicitud:', error.message);
        }
      }
    } else {
      console.warn('No se proporcionó un ID de factura en el pago ni IDs de pago asociados:', payment);
    }
    
  } catch (error) {
    console.error('Error inesperado al abrir el modal de factura:', error);
  }
};

const closeFacturaModal = () => {
  try {
    showFacturaModal.value = false;
    selectedFacturaPayment.value = null;
  } catch (error) {
    console.error('Error cerrando modal de factura:', error);
  }
};

const closeWithdrawalModal = () => {
  try {
    showWithdrawalModal.value = false;
    selectedWithdrawal.value = null;
  } catch (error) {
    console.error('Error cerrando modal de retiro:', error);
  }
};

const openServiceDetail = (service) => {
  try {
    if (!service) return;
    selectedService.value = service;
    showServiceDetailModal.value = true;
  } catch (error) {
    console.error('Error abriendo detalle de servicio:', error);
  }
};

const closeServiceDetailModal = () => {
  try {
    showServiceDetailModal.value = false;
    setTimeout(() => {
      selectedService.value = null;
    }, 300);
  } catch (error) {
    console.error('Error cerrando modal de servicio:', error);
  }
};

const getServiceTypeColor = (serviceType) => {
  try {
    const colors = {
      'plomeria': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'electricidad': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      'carpinteria': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      'pintura': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      'limpieza': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      'jardineria': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      'albañileria': 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
    };
    return colors[serviceType?.toLowerCase()] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  } catch (error) {
    console.error('Error obteniendo color de tipo de servicio:', error);
    return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getServiceTypeIcon = (serviceType) => {
  try {
    const icons = {
      'plomeria': '🚰',
      'electricidad': '💡',
      'carpinteria': '🪚',
      'pintura': '🎨',
      'limpieza': '🧹',
      'jardineria': '🌿',
      'albañileria': '🧱'
    };
    return icons[serviceType?.toLowerCase()] || '🔧';
  } catch (error) {
    console.error('Error obteniendo icono de tipo de servicio:', error);
    return '🔧';
  }
};

// ===== FUNCIONES DE GRÁFICOS =====
let chart = null;

const availableCharts = [
  { id: 'earnings', name: '📈 Ingresos Mensuales' },
  { id: 'serviceTypes', name: '🛠️ Servicios por Tipo' },
  { id: 'services', name: '📊 Servicios por Mes' },
  { id: 'users', name: '👥 Crecimiento de Usuarios' },
  { id: 'cities', name: '🏙️ Servicios por Ciudad' },
  { id: 'serviceTypeCity', name: '🏢 Servicios por Tipo/Ciudad' },
  { id: 'techCity', name: '👨‍🔧 Servicios Técnicos/Ciudad' }
];

// Función para etiquetar gráficos
const getChartLabel = (option) => {
  if (!option) return ''
  return option.name
}

const generateMonthLabels = () => {
  try {
    const labels = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      labels.push(date.toLocaleDateString('es-ES', { month: 'short' }));
    }
    
    return labels;
  } catch (error) {
    console.error('Error generando etiquetas de mes:', error);
    return [];
  }
};

const earningsData = reactive({
  labels: generateMonthLabels(),
  datasets: [{
    label: 'Ingresos Mensuales', 
    borderColor: '#10B981',
    backgroundColor: 'rgba(22, 248, 173, 0.26)',
    tension: 0.4,
    fill: true
  }]
});

const getChartTitle = () => {
  try {
    const chartTitles = {
      earnings: 'Ingresos Mensuales',
      serviceTypes: 'Distribución de Servicios por Tipo', 
      services: 'Servicios Realizados por Mes',
      users: 'Crecimiento de Usuarios',
      cities: 'Servicios por Ciudad',
      serviceTypeCity: selectedCityChart.value?.id_ciudad === 'all' ? 'Servicios por Tipo en cada Ciudad' : `Servicios en ${selectedCityChart.value?.nombre_ciudad}`,
      techCity: selectedCityChart.value?.id_ciudad === 'all' ? 'Servicios Realizados por Técnicos según su Ciudad' : `Servicios realizados por técnicos en ${selectedCityChart.value?.nombre_ciudad}`
    };
    return chartTitles[selectedChart.value] || 'Gráfico';
  } catch (error) {
    console.error('Error obteniendo título de gráfico:', error);
    return 'Gráfico';
  }
};

const updatePlatformStats = async () => {
  try { 
    let url = '/movimientos/reporte/ingresos';
    const params = new URLSearchParams();
    
    if (platformDateFrom.value || platformDateTo.value) {
      const mesActual = platformDateFrom.value ? 
        `${platformDateFrom.value.substring(0, 7)}` : 
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}` ;
      params.append('mesActual', mesActual);
      
      if (platformDateFrom.value) {
        params.append('fechaInicio', platformDateFrom.value);
      }
      if (platformDateTo.value) {
        params.append('fechaFin', platformDateTo.value);
      }
    } else {
      const mesActual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      params.append('mesActual', mesActual);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await $api(url, {
      method: 'GET'
    });
    
    if (response?.success && response.data) {
      const data = response.data.resumen;
      
      platformStats.totalRevenue = data.gananciaNeta || 0;
      platformStats.membershipRevenue = data.ingresosMembresias || 0;
      platformStats.visitRevenue = data.ingresosVisitas || 0;
      platformStats.serviceRevenue = data.ingresosServicios || 0;
      platformStats.packageRevenue = data.ingresosPaquetes || 0;
      platformStats.totalCommissions = data.comisiones || 0;
      platformStats.totalCashback = data.cashback || 0;
      platformStats.totalWithdrawals = data.deudasTecnicos || 0; // Se muestra lo que se DEBE a los técnicos (Pasivos)
      platformStats.totalPaidOut = data.retiros || 0; // Monto real que ya salió de caja (Retiros completados)
      
      if (response.data.grafico) {
        updateChart(response.data.grafico);
      }
      
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }  
};

const createChart = async () => {
  try {
    if (!selectedChart.value) return;
    
    if (window.currentChart) {
      window.currentChart.destroy();
    }
    
    const canvas = document.getElementById(`chart-${selectedChart.value}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const isDark = document.documentElement.classList.contains('dark');
     
    let config = {};
    
    switch (selectedChart.value) {
      case 'earnings':
        config = {
          type: 'bar',
          data: earningsData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: isDark ? '#F3F4F6' : '#111827',
                  font: { size: 11, family: 'sans-serif', weight: 'bold' }
                }
              },
              tooltip: {
                backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                titleColor: isDark ? '#F9FAFB' : '#111827',
                bodyColor: isDark ? '#D1D5DB' : '#4B5563',
                callbacks: {
                  label: function(context) {
                    return 'L. ' + context.raw.toLocaleString('es-HN');
                  }
                }
              },
              datalabels: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: isDark ? '#D1D5DB' : '#374151',
                  callback: function(value) {
                    return 'L. ' + (value/1000) + 'K';
                  }
                },
                grid: {
                  color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }
              },
              x: {
                ticks: { color: isDark ? '#D1D5DB' : '#374151' },
                grid: { display: false }
              }
            }
          }
        };
        break;
      
      case 'serviceTypeCity':
        if (selectedCityChart.value?.id_ciudad !== 'all') {
          // Si hay ciudad seleccionada, mostrar dona
          config = {
            type: 'doughnut',
            data: {
              labels: [],
              datasets: [{
                data: [],
                backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#71717A'],
                borderWidth: 0
              }]
            },
            plugins: [DataLabelsPlugin],
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '50%',
              plugins: {
                legend: {
                  display: true,
                  position: 'right',
                  labels: { color: isDark ? '#9CA3AF' : '#6B7280', font: { size: 10 } }
                },
                datalabels: {
                  display: true,
                  color: '#FFFFFF',
                  font: { weight: 'bold', size: 11 },
                  formatter: (value, context) => {
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return percentage > 5 ? `${percentage}%` : '';
                  }
                }
              }
            }
          };
        } else {
          // Si no hay ciudad, mostrar barras agrupadas
          config = {
            type: 'bar',
            data: {
              labels: [],
              datasets: []
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: { color: isDark ? '#F3F4F6' : '#111827', font: { weight: 'bold' } }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { color: isDark ? '#D1D5DB' : '#374151' },
                  grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                  ticks: { color: isDark ? '#D1D5DB' : '#374151' },
                  grid: { display: false }
                }
              }
            }
          };
        }
        break;

      case 'techCity':
        config = {
          type: 'bar',
          data: {
            labels: [],
            datasets: [{
              label: 'Servicios por Ciudad de Origen del Técnico',
              data: [],
              backgroundColor: '#8B5CF6',
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: {
                beginAtZero: true,
                ticks: { color: isDark ? '#D1D5DB' : '#374151' },
                grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }
              },
              y: {
                ticks: { color: isDark ? '#D1D5DB' : '#374151' },
                grid: { display: false }
              }
            }
          }
        };
        break;
      
      case 'serviceTypes':
      case 'cities':
        config = {
          type: 'doughnut',
          data: {
            labels: [],
            datasets: [{
              data: [],
              backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'],
              borderWidth: 0
            }]
          },
          plugins: [DataLabelsPlugin],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%',
            plugins: {
              legend: {
                display: true,
                position: 'right',
                labels: {
                  color: isDark ? '#F3F4F6' : '#111827',
                  font: { size: 10, weight: 'bold' }
                }
              },
              datalabels: {
                display: true,
                color: '#FFFFFF',
                font: { weight: 'bold', size: 11 },
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return percentage > 8 ? `${value}\n(${percentage}%)` : percentage > 4 ? `${percentage}%` : '';
                }
              }
            }
          }
        };
        break;

      case 'services':
      case 'users':
        config = {
          type: 'line',
          data: selectedChart.value === 'services' ? servicesData : usersData,
          plugins: [DataLabelsPlugin],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: { 
                  color: isDark ? '#F3F4F6' : '#111827',
                  font: { size: 11, weight: 'bold' }
                }
              },
              datalabels: {
                display: true,
                align: 'top',
                color: isDark ? '#F3F4F6' : '#1F2937',
                font: { weight: 'bold', size: 10 },
                offset: 2
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { 
                  color: isDark ? '#D1D5DB' : '#374151' 
                },
                grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }
              },
              x: {
                ticks: { 
                  color: isDark ? '#D1D5DB' : '#374151'
                },
                grid: { display: false }
              }
            }
          }
        };
        break;
    }
    
    window.currentChart = new Chart(ctx, config);
    
    // Cargar datos según el tipo de gráfico
    switch (selectedChart.value) {
      case 'earnings':
        if (platformDateFrom.value || platformDateTo.value) {
          await updatePlatformStats();
        }
        break;
      case 'serviceTypes':
        await loadServiceTypesData();
        break;
      case 'services':
        await loadServicesPerMonthData();
        break;
      case 'users':
        await loadUserGrowthData();
        break;
      case 'cities':
        await loadServicesByCityData();
        break;
      case 'serviceTypeCity':
        await loadServiceTypeByCityData();
        break;
      case 'techCity':
        await loadTechnicianServicesByCityData();
        break;
    }
  } catch (error) {
    console.error('Error creando gráfico:', error);
  }
};

const updateChart = (chartData) => {
  try {
    if (window.currentChart && chartData) {
      window.currentChart.data.labels = chartData.etiquetas || [];
      window.currentChart.data.datasets[0].data = chartData.datos || [];
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error actualizando gráfico:', error);
  }
};

// ===== FUNCIONES DE CARGA DE DATOS DE GRÁFICOS =====
const loadServiceTypesData = async () => {
  try { 
    const response = await $api('/solicitudservicio/grafica/servicios', {
      method: 'GET'
    });
    
    if (response?.success && response.data && window.currentChart) {
      const { labels, data: valores } = response.data;
      
      window.currentChart.data.labels = labels || [];
      window.currentChart.data.datasets[0].data = valores || [];
      
      const colors = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];
      window.currentChart.data.datasets[0].backgroundColor = colors;
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error al cargar datos de servicios por tipo:', error);
    showToast('Error al cargar los datos del gráfico de servicios', 'error');
  }
};
const loadServicesPerMonthData = async () => {
  try { 
    const response = await $api('/solicitudservicio/grafica/servicios-por-mes', {
      method: 'GET'
    });
    
    if (response?.success && response.data && window.currentChart) {
      const { labels, data: valores } = response.data;
      
      window.currentChart.data.labels = labels || [];
      window.currentChart.data.datasets[0].data = valores || [];
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error al cargar datos de servicios por mes:', error);
    showToast('Error al cargar los datos del gráfico de servicios por mes', 'error');
  }
};

const loadUserGrowthData = async () => {
  try { 
    const response = await $api('/usuarios/grafica/crecimiento-usuarios', {
      method: 'GET'
    });
    
    if (response?.success && response.data && window.currentChart) {
      const { labels, data: valores } = response.data;
      
      window.currentChart.data.labels = labels || [];
      window.currentChart.data.datasets[0].data = valores || [];
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error al cargar datos de crecimiento de usuarios:', error);
    showToast('Error al cargar los datos del gráfico de crecimiento de usuarios', 'error');
  }
};

const loadServicesByCityData = async () => {
  try { 
    const response = await $api('/solicitudservicio/grafica/servicios-por-ciudad', {
      method: 'GET'
    });
    
    if (response?.success && response.data && window.currentChart) {
      const { labels, data: valores } = response.data;
      
      window.currentChart.data.labels = labels || [];
      window.currentChart.data.datasets[0].data = valores || [];
      
      const colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#06B6D4'];
      window.currentChart.data.datasets[0].backgroundColor = colors;
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error al cargar datos de servicios por ciudad:', error);
    showToast('Error al cargar los datos del gráfico de servicios por ciudad', 'error');
  }
};

const loadServiceTypeByCityData = async () => {
  try { 
    const idCiudad = selectedCityChart.value?.id_ciudad || 'all';
    const response = await $api(`/solicitudservicio/grafica/servicios-tipo-ciudad?id_ciudad=${idCiudad}`, {
      method: 'GET'
    });
    
    if (response?.success && response.data && window.currentChart) {
      if (response.isDoughnut) {
        window.currentChart.data.labels = response.data.labels || [];
        window.currentChart.data.datasets[0].data = response.data.data || [];
      } else {
        window.currentChart.data.labels = response.data.labels || [];
        window.currentChart.data.datasets = response.data.datasets || [];
      }
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error al cargar datos de servicios por tipo/ciudad:', error);
    showToast('Error al cargar datos de servicios por tipo/ciudad', 'error');
  }
};

const loadTechnicianServicesByCityData = async () => {
  try { 
    const idCiudad = selectedCityChart.value?.id_ciudad || 'all';
    const response = await $api(`/solicitudservicio/grafica/servicios-tecnicos-ciudad?id_ciudad=${idCiudad}`, {
      method: 'GET'
    });
    
    if (response?.success && response.data && window.currentChart) {
      const isSpecificCity = selectedCityChart.value?.id_ciudad !== 'all';
      
      window.currentChart.data.labels = response.data.labels || [];
      window.currentChart.data.datasets[0].data = response.data.data || [];
      window.currentChart.data.datasets[0].label = isSpecificCity ? 'Servicios por Técnico' : 'Servicios por Ciudad del Técnico';
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error al cargar datos de servicios técnicos por ciudad:', error);
    showToast('Error al cargar datos de servicios técnicos por ciudad', 'error');
  }
};

// ===== COMPUTED PROPERTIES =====
const visibleTransactions = computed(() => {
  try {
    return transactions.value || [];
  } catch (error) {
    console.error('Error en visibleTransactions:', error);
    return [];
  }
});

// ===== REPORTES =====
const servicesData = reactive({
  labels: generateMonthLabels(),
  datasets: [{
    label: 'Servicios Realizados',
    data: [85, 92, 78, 105, 98, 112, 125, 118, 132, 145, 158, 167],
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
    borderWidth: 3,
    tension: 0.3,
    fill: true
  }]
});

const usersData = reactive({
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  datasets: [{
    label: 'Usuarios Registrados',
    data: [150, 280, 420, 650, 890, 1200],
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
    borderWidth: 3,
    tension: 0.3,
    fill: true
  }]
});

const availableReports = ref([
  {
    id: 1,
    title: 'Reporte Ingresos de la Plataforma',
    description: 'Resumen detallado de ingresos por membresías, visitas y servicios',
    icon: '💰',
    iconClass: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    generating: false
  },

  {
    id: 2,
    title: 'Reporte de Servicios Detallado',
    description: 'Análisis completo de todos los servicios',
    icon: '🛠️',
    iconClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    generating: false
  },
  {
    id: 3,
    title: 'Reporte de Usuarios',
    description: 'Resumen de todos los Usuarios',
    icon: '👥',
    iconClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    generating: false
  },
  {
    id: 5,
    title: 'Reporte de Retiros Detallado',
    description: 'Resumen de retiros de técnicos y referidores',
    icon: '💸',
    iconClass: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    generating: false
  },
]); 

const generateReport = async (report) => {
  try {
    report.generating = true;
    
    const config = useRuntimeConfig();
    const auth = useAuthStore();

    // 🗓️ 1️⃣ Obtener mes y año seleccionados
    const hasSelectedMonth = !!selectedMonthReports.value;
    const selectedMonth = selectedMonthReports.value; 
    
    // Solo incluir el parámetro month si se seleccionó un mes
    const monthParam = hasSelectedMonth ? `?month=${selectedMonth}&limit=1000` : '?limit=1000';
    
    // Configurar título del reporte
    let reportTitle = 'Reporte General';
    let monthName = '';
    let year = '';
    let month = ''; // Declarar month en el scope exterior
    
    if (hasSelectedMonth) {
      [year, month] = selectedMonth.split('-').map(Number);
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      monthName = monthNames[month - 1];
      reportTitle = `Reporte de ${monthName} ${year}`;
    } 

    // 📊 2️⃣ Definir qué datos necesita cada reporte para optimizar las peticiones
    const reportNeeds = {
      1: ['membresia', 'visit', 'withdrawals', 'quotation', 'users', 'techIncome', 'pkgPayments', 'referralIncome', 'cashbackIncome'],
      2: [], // Este reporte hace sus propias peticiones internas
      3: ['users'],
      4: ['membresia', 'visit', 'withdrawals'],
      5: ['withdrawals']
    };

    const needs = reportNeeds[report.id] || [];

    // Mostrar URLs que se van a consultar (solo las necesarias)
    const urlMap = {
      membresia: `/membresia${monthParam}`,
      visit: `/pagovisita${monthParam}`,
      withdrawals: `/movimientos/retiros${monthParam}`,
      quotation: `/cotizacion${monthParam}`,
      users: `/usuarios${monthParam}`,
      techIncome: `/movimientos/ingresos/tecnicos${monthParam}`,
      pkgPayments: `/paquetes/usuarios/pagos${monthParam}`,
      referralIncome: `/movimientos${monthParam}&tipo=ingreso_referido&estado=completado`,
      cashbackIncome: `/movimientos${monthParam}&tipo=cashback&estado=completado`
    };

    const urlsToConsult = needs.map(key => urlMap[key]).filter(Boolean);
    
    // 📦 3️⃣ Obtener solo los datos necesarios
    const promises = {
      membershipRes: needs.includes('membresia') ? $api(urlMap.membresia).catch(err => { console.error('❌ Error en /membresia:', err); throw err; }) : Promise.resolve(null),
      visitRes: needs.includes('visit') ? $api(urlMap.visit).catch(err => { console.error('❌ Error en /pagovisita:', err); throw err; }) : Promise.resolve(null),
      withdrawalsRes: needs.includes('withdrawals') ? $api(urlMap.withdrawals).catch(err => { console.error('❌ Error en /movimientos/retiros:', err); throw err; }) : Promise.resolve(null),
      quotationRes: needs.includes('quotation') ? $api(urlMap.quotation).catch(err => { console.error('❌ Error en /cotizacion:', err); throw err; }) : Promise.resolve(null),
      usersRes: needs.includes('users') ? $api(urlMap.users).catch(err => { console.error('❌ Error en /usuarios:', err); throw err; }) : Promise.resolve(null),
      technicianIncomeRes: needs.includes('techIncome') ? $api(urlMap.techIncome).catch(err => { console.error('❌ Error en /movimientos (ingresos):', err); return { movimientos: [], data: [] }; }) : Promise.resolve({ movimientos: [], data: [] }),
      packagePaymentsRes: needs.includes('pkgPayments') ? $api(urlMap.pkgPayments).catch(err => { console.error('❌ Error en /paquetes/usuarios/pagos:', err); return { data: [], estadisticas: { total: 0 } }; }) : Promise.resolve({ data: [], estadisticas: { total: 0 } }),
      referralIncomeRes: needs.includes('referralIncome') ? $api(urlMap.referralIncome).catch(err => { console.error('❌ Error en /movimientos (referidos):', err); return { movimientos: [], data: [] }; }) : Promise.resolve({ movimientos: [], data: [] }),
      cashbackIncomeRes: needs.includes('cashbackIncome') ? $api(urlMap.cashbackIncome).catch(err => { console.error('❌ Error en /movimientos (cashback):', err); return { movimientos: [], data: [] }; }) : Promise.resolve({ movimientos: [], data: [] })
    };

    const [membershipRes, visitRes, withdrawalsRes, quotationRes, usersRes, technicianIncomeRes, packagePaymentsRes, referralIncomeRes, cashbackIncomeRes] = await Promise.all([
      promises.membershipRes,
      promises.visitRes,
      promises.withdrawalsRes,
      promises.quotationRes,
      promises.usersRes,
      promises.technicianIncomeRes,
      promises.packagePaymentsRes,
      promises.referralIncomeRes,
      promises.cashbackIncomeRes
    ]); 

    const usersData = {
  label: 'Usuarios',
  total: usersRes?.estadisticas?.total || 0,
  data: usersRes?.data || [],
  stats: usersRes?.estadisticas || {}
};

    const membershipData = {
      label: 'Membresías',
      total: membershipRes?.estadisticas?.total || 0,
      data: membershipRes?.data || [],
      stats: membershipRes?.estadisticas || {}
    };

    const visitData = {
      label: 'Visitas Técnicas',
      total: visitRes?.estadisticas?.total || 0,
      data: visitRes?.data || [],
      stats: visitRes?.estadisticas || {}
    };

    const quotationData = {
      label: 'Cotizaciones',
      total: quotationRes?.estadisticas?.total || 0,
      data: quotationRes?.data || [],
      stats: quotationRes?.estadisticas || {}
    };

    const withdrawalsData = {
      label: 'Retiros',
      total: withdrawalsRes?.estadisticas?.total || 0,
      data: withdrawalsRes?.movimientos || withdrawalsRes?.data || [],
      stats: withdrawalsRes?.estadisticas || {}
    };

    const packagePaymentsData = {
      label: 'Pagos de Paquetes',
      total: packagePaymentsRes?.estadisticas?.total || 0,
      data: packagePaymentsRes?.data || [],
      stats: packagePaymentsRes?.estadisticas || {}
    };

    const rawTechData = technicianIncomeRes?.movimientos || technicianIncomeRes?.data || [];
    const technicianIncomeData = Array.isArray(rawTechData) ? rawTechData : [];

    const rawReferralData = referralIncomeRes?.movimientos || referralIncomeRes?.data?.movimientos || referralIncomeRes?.data || [];
    const referralIncomeData = Array.isArray(rawReferralData) ? rawReferralData : [];

    const rawCashbackData = cashbackIncomeRes?.movimientos || cashbackIncomeRes?.data?.movimientos || cashbackIncomeRes?.data || [];
    const cashbackData = Array.isArray(rawCashbackData) ? rawCashbackData : [];

    const serviceData = {
      label: 'Servicios',
      total: quotationRes?.estadisticas?.total || 0,
      data: quotationRes?.data || [],
      stats: quotationRes?.estadisticas || {}
    };

    // Asegurar que serviceData.data solo contenga registros confirmados para el reporte
    serviceData.data = (serviceData.data || []).filter(s => s.estado?.toLowerCase() === 'confirmado');
    // Asegurar que serviceData.total refleje solo los confirmados (aunque el backend ya lo hace)
    serviceData.total = parseFloat(quotationRes?.estadisticas?.total || 0);

    // 💰 4️⃣ Cálculos de balance (Solo para reporte financiero ID 1)
    // Usamos el mismo endpoint que la UI para garantizar consistencia de datos
    let ingredientesReporte = {};
    if (report.id === 1) {
      try {
        // Construir los params del reporte igual que la UI
        const reporteParams = hasSelectedMonth
          ? `?mesActual=${selectedMonth}&fechaInicio=${selectedMonth}-01&fechaFin=${selectedMonth}-${new Date(year, month, 0).getDate()}`
          : '';
        const reporteRes = await $api(`/movimientos/reporte/ingresos${reporteParams}`).catch(err => {
          console.error('❌ Error al obtener reporte ingresos para PDF:', err);
          return null;
        });

        if (reporteRes?.success && reporteRes?.data?.resumen) {
          const resumen = reporteRes.data.resumen;
          // deudasTecnicos = ingresos de técnicos pendientes de retirar en este periodo
          const deudasTecnicos = parseFloat(resumen.deudasTecnicos || 0);
          const retirosPagados = parseFloat(resumen.retiros || 0);
          const comisionesReferidos = parseFloat(resumen.comisiones || 0);
          const totalCashback = parseFloat(resumen.cashback || 0);
          const balanceNeto = parseFloat(resumen.gananciaNeta || 0);
          ingredientesReporte = { balanceNeto, deudasTecnicos, retirosPagados, comisionesReferidos, totalCashback };
        } else {
          // Fallback: calcular básico sin deudas
          const ingresosTotales = (membershipRes?.estadisticas?.total || 0) +
            (visitRes?.estadisticas?.total || 0) +
            (quotationRes?.estadisticas?.total || 0) +
            (packagePaymentsRes?.estadisticas?.total || 0);
          ingredientesReporte = { balanceNeto: ingresosTotales, deudasTecnicos: 0, comisionesReferidos: 0, totalCashback: 0 };
        }
      } catch (e) {
        console.error('❌ Error en cálculo de balance PDF:', e);
        ingredientesReporte = { balanceNeto: 0, deudasTecnicos: 0, comisionesReferidos: 0, totalCashback: 0 };
      }
    }
    const { balanceNeto, retirosPagados, deudasTecnicos } = ingredientesReporte;

    // 🧾 5️⃣ Crear documento PDF usando el plugin $pdf
    const { $pdf } = useNuxtApp();
    const doc = await $pdf.create();
    const colorPrincipal = [93, 92, 222];
    const colorSecundario = [75, 85, 99];

    // 🏷️ Encabezado
    doc.setFillColor(...colorPrincipal);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('HOGAR SEGURO', 15, 12);
    doc.setFontSize(9);
    doc.text(`Reporte: ${report.title}`, 15, 18);
    doc.text(hasSelectedMonth 
      ? `Período: ${monthName} ${year}`
      : 'Período: General (Todos los meses)', 15, 23);

    // Fecha de impresión
    doc.setFontSize(8);
    const fechaImpresion = new Date().toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
    doc.text(`Impreso el: ${fechaImpresion}`, 195, 23, { align: 'right' });

    // 📚 6️⃣ Seleccionar tipo de reporte
    switch (report.id) {

      // ===== REPORTE FINANCIERO =====
      case 1:
        await generarReporteFinanciero(doc, {
          membershipData,
          visitData,
          serviceData,
          withdrawalsData,
          technicianIncomeData,
          referralIncomeData,
          cashbackData,
          packagePaymentsData,
          mesNombre: monthName,
          year,
          balanceNeto,
          retirosPagados: retirosPagados || 0,
          deudasTecnicos: ingredientesReporte.deudasTecnicos || 0,
          comisionesReferidos: ingredientesReporte.comisionesReferidos || 0,
          totalCashback: ingredientesReporte.totalCashback || 0
        });
        break;

      // ===== REPORTE DE SERVICIOS =====
      case 2: {
        // Obtener servicios
        const serviceUrl = hasSelectedMonth 
          ? `/solicitudservicio?month=${selectedMonth}`
          : '/solicitudservicio';
        
        const [serviceRes, paquetesRes] = await Promise.all([
          // Obtener servicios
          $api(serviceUrl, {
            baseURL: config.public.apiBase,
            headers: { Authorization: `Bearer ${auth.token}` },
            onRequest: ({ options }) => {
              return options;
            },
            onResponse: ({ response }) => {
              return response._data;
            }
          }).catch(err => {
            console.error('❌ Error en /solicitudservicio:', err);
            throw err;
          }),
          // Obtener paquetes utilizados
          $api(`/paquetes/usuarios/utilizados${hasSelectedMonth ? '?month=' + selectedMonth : ''}`, {
            baseURL: config.public.apiBase,
            headers: { 
              Authorization: `Bearer ${auth.token}`,
              'Cache-Control': 'no-cache'
            },
            onRequest: ({ options }) => {
              return options;
            },
            onResponse: ({ response }) => {
              return response._data;
            }
          }).catch(err => {
            console.error('❌ Error en /paquetes/usuarios/utilizados:', err);
            return { data: [] }; // Continuar con array vacío si hay error
          })
        ]);
        
        const serviceData = {
          label: 'Servicios',
          total: serviceRes?.estadisticas?.total || 0,
          data: serviceRes?.data || [],
          stats: serviceRes?.estadisticas || {}
        };

        await generarReporteServiciosDetallado(doc, serviceData, paquetesRes);
        break;
      }

      // ===== REPORTE DE USUARIOS =====
      case 3:
        await generarReporteUsuarios(doc, { usersData, mesNombre: monthName, year });
        break;

      // ===== REPORTE DE TRANSACCIONES =====
      case 4:
        await generarReporteTransacciones(doc, membershipData, visitData, withdrawalsData);
        break;

      // ===== REPORTE DE RETIROS =====
      case 5:
        await generarReporteRetiros(doc, withdrawalsData);
        break;

      default:
        showToast('Tipo de reporte no reconocido', 'error');
    } 
    
    // 📄 7️⃣ Footer con número de página
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const [r, g, b] = colorSecundario;
      doc.setFillColor(r, g, b);
      doc.rect(0, 280, 210, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const title = typeof report.title === 'string' ? report.title : 'Reporte';
      const reportTitle = hasSelectedMonth 
        ? `HOGAR SEGURO - ${title} - ${monthName} ${year}`
        : `HOGAR SEGURO - ${title} - Reporte General`;
      doc.text(reportTitle, 20, 287);
      doc.text(`Página ${i} de ${totalPages}`, 190, 287, { align: 'right' });
    }

    // 🖨️ 8️⃣ Mostrar PDF
    const fileName = hasSelectedMonth 
      ? `${report.title.replace(/\s+/g, '_')}_${monthName}_${year}.pdf`
      : `${report.title.replace(/\s+/g, '_')}_General.pdf`;
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    showToast(`Reporte ${report.title} generado correctamente`, 'success');

  } catch (error) {
    console.error('Error al generar reporte:', error);
    showToast('Error al generar el reporte', 'error');
  } finally {
    report.generating = false;
  }
};

// ===== REPORTE FINANCIERO =====
const generarReporteFinanciero = async (doc, { membershipData, visitData, serviceData, withdrawalsData, technicianIncomeData = [], referralIncomeData = [], cashbackData = [], packagePaymentsData = { data: [], total: 0 }, mesNombre, year, balanceNeto: balanceNetoParam, retirosPagados = 0, deudasTecnicos = 0, comisionesReferidos = 0, totalCashback: totalCashbackParam = 0 }) => {
  // 1️⃣ Recalcular TODOS los totales basados en los datos filtrados que se mostrarán en las tablas
  const totalMembresias = membershipData.data
    .filter(m => ['activa', 'vencida'].includes(m.estado?.toLowerCase()))
    .reduce((sum, m) => sum + (parseFloat(m.monto) || 0), 0);
    
  const totalVisitas = visitData.data
    .filter(v => v.estado?.toLowerCase() === 'aprobado')
    .reduce((sum, v) => sum + (parseFloat(v.monto) || 0), 0);
    
  const totalServicios = serviceData.data
    .filter(s => s.estado?.toLowerCase() === 'confirmado')
    .reduce((sum, s) => sum + (parseFloat(s.monto_comision_app) || 0), 0);
    
  // Obtener porcentaje de comisión para paquetes (puedes intentar obtenerlo de la config o usar el 10% por defecto)
  const totalPaquetesBruto = packagePaymentsData.data
    .filter(p => p.estado?.toLowerCase() !== 'rechazado')
    .reduce((sum, p) => sum + (parseFloat(p.monto) || 0), 0);
  
  // Usamos el 10% por defecto o el calculado si viniera en la data
  const totalPaquetes = (totalPaquetesBruto * 0.10); 

    
  // Cálculo de Ingresos Totales (consistente con lo que se muestra abajo)
  const totalIngresos = totalMembresias + totalVisitas + totalServicios + totalPaquetes;

  // Cálculo de Retiros Totales (solo completados o aprobados) — para la tabla de retiros
  const totalRetiros = withdrawalsData.data
    .filter(r => ['completado', 'aprobado'].includes(r.estado?.toLowerCase()))
    .reduce((sum, r) => sum + (parseFloat(r.monto) || 0), 0);

  // Ganancia Neta REAL (Utilidad App):
  // Ingresos App (Suma de comisiones y cobros directos) - Cashback - Comisiones Referidos
  const totalCashbackDebt = totalCashbackParam;
  const balanceNeto = balanceNetoParam ?? (totalIngresos - totalCashbackDebt - comisionesReferidos);

  // Usar autoTable del documento
  let currentY = 40;

  // 🎯 Título
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(93, 92, 222);
  doc.setFontSize(14);
  doc.text('Reporte de Ingresos', 10, currentY);
  currentY += 4;

  // 📊 Calcular porcentajes
  const calcPorcentaje = (valor) => totalIngresos > 0 ? ((valor / totalIngresos) * 100).toFixed(1) + '%' : '0%';

  // 📋 Tabla resumen de totales
  doc.autoTable({
    startY: currentY,
    head: [['Concepto', 'Total (HNL)', 'Porcentaje (%)']],
    body: [
      ['Membresías (Total)', formatCurrency(totalMembresias), calcPorcentaje(totalMembresias)],
      ['Visitas Técnicas (Total)', formatCurrency(totalVisitas), calcPorcentaje(totalVisitas)],
      ['Comisión por Paquetes (App)', formatCurrency(totalPaquetes), calcPorcentaje(totalPaquetes)],
      ['Comisión por Servicios (App)', formatCurrency(totalServicios), calcPorcentaje(totalServicios)],
      ['Total Utilidad Bruta App', formatCurrency(totalIngresos), '-']
    ],
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 70 }, 1: { halign: 'center' }, 2: { halign: 'center' } },
    margin: { left: 10, right: 10 },
    styles: { halign: 'center' }
  });

  currentY = doc.lastAutoTable.finalY + 10;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  // 📋 Detalle de Ingresos
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(93, 92, 222);
  doc.setFontSize(12);
  doc.text('Detalle de Ingresos', 10, currentY);
  currentY += 4;

  const membresiasFiltradas = membershipData.data
    .filter(m => ['activa', 'vencida'].includes(m.estado?.toLowerCase()))
    .map(m => [
      formatDate(m.fecha), 
      'Membresía', 
      m.usuario?.nombre || m.usuario?.cliente?.nombre || '-', 
      m.facturaRelacion?.factura?.estado || 'PENDIENTE',
      m.facturaRelacion?.factura?.numero_factura_correlativo || '-',
      formatCurrency(m.monto)
    ]);

  const visitasFiltradas = visitData.data
    .filter(v => v.estado?.toLowerCase() === 'aprobado')
    .map(v => [
      formatDate(v.fecha), 
      'Visita Técnica', 
      v.cliente?.nombre || v.client || v.usuario?.nombre || '-', 
      v.facturaRelacion?.factura?.estado || 'PENDIENTE',
      v.facturaRelacion?.factura?.numero_factura_correlativo || '-',
      formatCurrency(v.monto)
    ]);

  const serviciosFiltrados = serviceData.data
    // serviceData.data ya viene pre-filtrado a 'confirmado' desde el llamado al API
    .map(s => {
         // Si monto_comision_app es null (pago en efectivo sin recalcular aún),
         // estimar la comisión en base al porcentaje estándar del monto de mano de obra
         const comisionApp = s.monto_comision_app != null
           ? parseFloat(s.monto_comision_app)
           : 0;
         return [
           formatDate(s.fecha), 
           'Comisión '+ (s.solicitud?.servicio?.nombre || 'Servicio'),
           s.solicitud?.cliente?.nombre || '-', 
           s.facturaRelacion?.factura?.estado || 'PAGADO (EFECTIVO)',
           s.facturaRelacion?.factura?.numero_factura_correlativo || 'EFECTIVO',
           formatCurrency(comisionApp)
         ];
    });

  const paquetesFiltrados = packagePaymentsData.data
    .filter(p => p.estado?.toLowerCase() !== 'rechazado')
    .map(p => [
      formatDate(p.fecha),
      'Comisión Paquete',
      p.usuario?.nombre || '-',
      p.facturaRelacion?.factura?.estado || 'PENDIENTE',
      p.facturaRelacion?.factura?.numero_factura_correlativo || '-',
      formatCurrency(parseFloat(p.monto) * 0.10)
    ]);

  const hayDatos = membresiasFiltradas.length > 0 || visitasFiltradas.length > 0 || serviciosFiltrados.length > 0 || paquetesFiltrados.length > 0;

  // 📊 Costos Operativos (Pasivos / Retiros)
  // Lógica Final basada en datos reales de BD:
  // 1. Técnicos: Se muestran sus INGRESOS como "Pendiente" (Pasivo de la empresa).
  // 2. Referidos: Se muestran sus INGRESOS como "Pendiente" (Pasivo de la empresa), ya que no hay retiros registrados.
  
  // A. Ingresos Técnicos
  const tecnicosOps = technicianIncomeData.map(t => ({
      fecha: t.fecha,
      beneficiario: t.nombre_usuario || t.usuario?.nombre || 'Técnico',
      tipo: 'Servicio',
      descripcion: t.nombre_servicio ? `Ingreso por servicio ${t.nombre_servicio}` : (t.descripcion || 'Ingreso por servicio completado'),
      estado: 'Pendiente', // Mostramos como pendiente de pago por defecto para reflejar pasivo
      fechaRetiro: '-',
      monto: parseFloat(t.monto) || 0,
    }));

  // B. Ingresos Referidos (Comisiones Generadas)
  const referidosOps = referralIncomeData.map(r => ({
      fecha: r.fecha,
      beneficiario: r.nombre_usuario || r.usuario?.nombre || 'Referidor',
      tipo: 'Comisión',
      descripcion: r.servicio ? `Comisión por ${r.servicio}` : (r.descripcion ? `${r.descripcion}` : 'Comisión por referido'),
      estado: 'Pendiente', // Es una deuda generada
      fechaRetiro: '-',
      monto: parseFloat(r.monto) || 0,
    }));

  // Las variables se inicializarán después de procesar los datos detallados
  let totalCashbackLocal = 0;
  let totalRetirosEfectuados = 0;

  // UTILIDAD NETA (Ganancia de la plataforma)
  // Nota: Ya no restamos deudasTecnicos de totalIngresos porque totalIngresos es el 20% (Cut) 
  // y deudasTecnicos es el 80% (Vendor share). Restarlo resultaría en saldo negativo incorrecto.
  // La ganancia neta real de la plataforma es la suma de comisiones menos cashback y retiros por comisiones de referidos pagados.
  const balanceNetoFinal = balanceNetoParam ?? balanceNeto;

  const cashbackOps = cashbackData.map(c => ({
    fecha: c.fecha,
    beneficiario: c.nombre_usuario || c.usuario?.nombre || 'Cliente',
    tipo: 'Cashback',
    descripcion: c.descripcion || 'Cashback acreditado',
    monto: parseFloat(c.monto) || 0,
  }));

  const operationalCosts = [
    ...tecnicosOps,
    ...referidosOps,
    ...cashbackOps
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  // Total = suma real de todas las filas de la tabla
  const totalCostosOperativos = operationalCosts.reduce((sum, c) => sum + c.monto, 0);

  // Recalcular pasivos para el Balance General basados en los datos detallados
  totalCashbackLocal = cashbackOps.reduce((sum, c) => sum + c.monto, 0);
  // Los pasivos por "retiros" en este contexto corresponden a lo adeudado a técnicos y referidos
  totalRetirosEfectuados = tecnicosOps.reduce((sum, t) => sum + t.monto, 0) + referidosOps.reduce((sum, r) => sum + r.monto, 0);

  // Recalcular Balance Neto Final: misma fórmula que el API
  // gananciaNeta = ingresos - cashback - retirosTecnicos 

  // Renderizar tabla de Detalle de Ingresos
  doc.autoTable({
    startY: currentY,
    head: [['Fecha', 'Concepto', 'Cliente', 'Estado Fiscal', 'Correlativo', 'Monto']],
    body: hayDatos
      ? [
          ...membresiasFiltradas,
          ...visitasFiltradas,
          ...paquetesFiltrados,
          ...serviciosFiltrados,
          [
            { content: 'TOTAL INGRESOS', colSpan: 5, styles: { fontStyle: 'bold', halign: 'right' } },
            { content: formatCurrency(totalIngresos), styles: { fontStyle: 'bold' } }
          ]
        ]
      : [[{ content: 'No hay datos disponibles', colSpan: 6, styles: { fontStyle: 'italic', halign: 'center', textColor: [100, 100, 100] } }]],
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 
      0: { cellWidth: 20 }, 
      1: { cellWidth: 35 }, 
      2: { cellWidth: 35 }, 
      3: { cellWidth: 25 }, 
      4: { cellWidth: 'auto' },
      5: { cellWidth: 25 }
    },
    margin: { left: 10, right: 10 },
    pageBreak: 'auto',
    styles: { halign: 'center' }
  });

  // Agregar detalle de Costos Operativos
  currentY = doc.lastAutoTable.finalY + 10;
  
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38); // Rojo
  doc.setFontSize(12);
  doc.text('Costos Operativos (Pasivos Generados)', 10, currentY);
  currentY += 4;

  const costosFiltrados = operationalCosts.map(c => [
      formatDate(c.fecha),
      c.beneficiario,
      c.descripcion,
      formatCurrency(c.monto)
  ]);

  const hayCostos = costosFiltrados.length > 0;

  doc.autoTable({
    startY: currentY,
    head: [['Fecha', 'Beneficiario', 'Descripción', 'Monto']],
    body: hayCostos
      ? [
          ...costosFiltrados,
          [
            { content: 'TOTAL DEUDAS GENERADAS (Técnicos + Referidos + Cashback)', colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' } },
            { content: formatCurrency(totalCostosOperativos), styles: { fontStyle: 'bold', textColor: [220, 38, 38] } }
          ]
        ]
      : [[{ content: 'No hay costos operativos del periodo', colSpan: 4, styles: { fontStyle: 'italic', halign: 'center', textColor: [100, 100, 100] } }]],
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 
      0: { cellWidth: 25 }, 
      1: { cellWidth: 45 }, 
      2: { cellWidth: 'auto' }, 
      3: { cellWidth: 35 } 
    },
    margin: { left: 10, right: 10 },
    pageBreak: 'auto',
    styles: { halign: 'center' }
  });

  // Balance Final
  currentY = doc.lastAutoTable.finalY + 10;

  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(14);
  doc.text('BALANCE GENERAL', 10, currentY);
  currentY += 5;

  doc.autoTable({
    startY: currentY,
    head: [['Concepto', 'Monto (HNL)']],
    body: [
      [{ content: '(-) Pasivos por Cashback', styles: { fontStyle: 'normal', textColor: [220, 38, 38], fontSize: 9 } }, { content: `-${formatCurrency(totalCashbackLocal)}`, styles: { fontStyle: 'normal', textColor: [220, 38, 38], halign: 'right', fontSize: 9 } }],
      [{ content: '(-) Pasivos por Retiros', styles: { fontStyle: 'normal', textColor: [220, 38, 38], fontSize: 9 } }, { content: `-${formatCurrency(totalRetirosEfectuados)}`, styles: { fontStyle: 'normal', textColor: [220, 38, 38], halign: 'right', fontSize: 9 } }],
      [{ content: 'Total Ingresos App', styles: { fontStyle: 'bold', fillColor: [220, 252, 231], textColor: [0, 0, 0], fontSize: 9 } }, 
       { content: formatCurrency(totalIngresos), styles: { fontStyle: 'bold', fillColor: [220, 252, 231], textColor: [0, 0, 0], halign: 'right', fontSize: 9 } }],
     ],
    theme: 'grid',
    headStyles: { fillColor: [75, 85, 99], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    columnStyles: { 
      0: { cellWidth: 120 }, 
      1: { cellWidth: 70 } 
    },
    margin: { left: 10, right: 10 },
    pageBreak: 'avoid',
    tableWidth: 190,
    styles: { halign: 'center' }
  });
};

// ===== REPORTE DE RETIROS =====
const generarReporteRetiros = async (doc, withdrawalsData) => {
  let currentY = 40;

  // 🎯 Título
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(93, 92, 222);
  doc.setFontSize(14);
  doc.text('REPORTE DETALLADO DE RETIROS', 10, currentY);
  currentY += 8;

  const totalRetirosReal = withdrawalsData.data
    .filter(r => ['completado', 'aprobado'].includes(r.estado?.toLowerCase()))
    .reduce((sum, r) => sum + (parseFloat(r.monto) || 0), 0);

  const retirosFiltrados = withdrawalsData.data
    .map(r => [
      formatDate(r.fecha),
      r.nombre_usuario || r.usuario?.nombre || 'N/A',
      r.descripcion || 'Retiro de fondos',
      r.estado?.toUpperCase() || 'PENDIENTE',
      formatCurrency(r.monto)
    ]);
    
  const hayRetiros = retirosFiltrados.length > 0;

  doc.autoTable({
    startY: currentY,
    head: [['Fecha', 'Beneficiario', 'Descripción', 'Estado', 'Monto']],
    body: hayRetiros
      ? [
          ...retirosFiltrados,
          [
            { content: 'TOTAL L.', colSpan: 4, styles: { fontStyle: 'bold', halign: 'right' } },
            { content: formatCurrency(totalRetirosReal), styles: { fontStyle: 'bold', halign: 'right' } }
          ]
        ]
      : [[{ content: 'No se encontraron registros de retiros para este periodo', colSpan: 5, styles: { fontStyle: 'italic', halign: 'center', textColor: [100, 100, 100] } }]],
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 
      0: { cellWidth: 25 }, 
      1: { cellWidth: 40 }, 
      2: { cellWidth: 'auto' }, 
      3: { cellWidth: 25 },
      4: { cellWidth: 30 } 
    },
    margin: { left: 10, right: 10 },
    pageBreak: 'auto',
    styles: { halign: 'center' }
  });
};

// ===== REPORTE DE USUARIOS =====
const generarReporteUsuarios = async (doc, { usersData, mesNombre, year }) => {
  // Usar autoTable del documento
  const autoTable = (options) => doc.autoTable(options);
  let currentY = 40;

  // 🔹 Título principal
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(93, 92, 222);
  doc.setFontSize(14);  

  // ============================================================
  // 1️⃣ TABLA DE CLIENTES
  // ============================================================
  const clientes = usersData.data.filter(u => u.rol?.nombre_rol?.toLowerCase() === 'usuario');
  const totalClientes = clientes.length;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(93, 92, 222);
  doc.text('Clientes Registrados', 10, currentY);
  currentY += 4;

  const clientesBody = clientes.map(c => [
    formatDate(c.fecha_registro),
    c.nombre,
    c.telefono || '-',
    c.ciudad?.nombre_ciudad || '-',
    c.estado,
    c.total_servicios_cliente || 0,
    c.total_membresias || 0
  ]);

  if (clientesBody.length > 0) {
    const totalServicios = clientes.reduce((sum, c) => sum + (parseInt(c.total_servicios_cliente) || 0), 0);
    const totalMembresias = clientes.reduce((sum, c) => sum + (parseInt(c.total_membresias) || 0), 0);
    
    clientesBody.push([
      { content: `Total clientes: ${totalClientes}`, colSpan: 5, styles: { fontStyle: 'bold' } },
      { content: totalServicios.toString(), styles: { halign: 'right', fontStyle: 'bold' } },
      { content: totalMembresias.toString(), styles: { halign: 'right', fontStyle: 'bold' } }
    ]);
  }

  doc.autoTable({
    startY: currentY,
    head: [['Fecha Registro', 'Nombre', 'Teléfono', 'Ciudad', 'Estado', 'Servicios', 'Membresías']],
    body: clientesBody.length
      ? clientesBody
      : [[{ content: 'No hay clientes registrados en este período', colSpan: 7, styles: { halign: 'center', fontStyle: 'italic', textColor: [120, 120, 120] } }]],
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 22 },
      5: { cellWidth: 20 },
      6: { cellWidth: 23 }
    },
    margin: { left: 10, right: 10 },
    pageBreak: 'auto',
    styles: { halign: 'center' }
  });

  currentY = doc.lastAutoTable.finalY + 10;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  // ============================================================
  // 2️⃣ TABLA DE TÉCNICOS
  // ============================================================
  const tecnicos = usersData.data.filter(u =>
    ['técnico', 'tecnico'].includes(u.rol?.nombre_rol?.toLowerCase())
  );
  const totalTecnicos = tecnicos.length;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(93, 92, 222);
  doc.text('Técnicos Registrados', 10, currentY);
  currentY += 4;

  const tecnicosBody = tecnicos.map(t => [
    formatDate(t.fecha_registro),
    t.nombre,
    t.telefono || '-',
    t.ciudad?.nombre_ciudad || '-',
    t.estado,
    t.total_servicios_tecnico || 0
  ]);

  if (tecnicosBody.length > 0) {
    const totalServiciosTecnicos = tecnicos.reduce((sum, t) => sum + (parseInt(t.total_servicios_tecnico) || 0), 0);
    
    tecnicosBody.push([
      { content: `Total técnicos: ${totalTecnicos}`, colSpan: 5, styles: { fontStyle: 'bold' } },
      { content: totalServiciosTecnicos.toString(), styles: { halign: 'right', fontStyle: 'bold' } }
    ]);
  }

  doc.autoTable({
    startY: currentY,
    head: [['Fecha Registro', 'Nombre', 'Teléfono', 'Ciudad', 'Estado', 'Servicios']],
    body: tecnicosBody.length
      ? tecnicosBody
      : [[{ content: 'No hay técnicos registrados en este período', colSpan: 6, styles: { halign: 'center', fontStyle: 'italic', textColor: [120, 120, 120] } }]],
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 22 },
      5: { cellWidth: 18 }
    },
    margin: { left: 10, right: 10 },
    pageBreak: 'auto',
    styles: { halign: 'center' }
  });

  currentY = doc.lastAutoTable.finalY + 10;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  // ============================================================
  // 3️⃣ ESTADÍSTICAS GENERALES (dividida en 2 columnas)
  // ============================================================
  const stats = usersData.stats || {};
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(93, 92, 222);
  doc.text('Estadísticas Generales (Actuales)', 10, currentY);
  currentY += 4;

  const statsCol1 = [
    ['Usuarios activos', stats.activos || 0],
    ['Usuarios inactivos', stats.inactivos || 0],
    ['Usuarios deshabilitados', stats.deshabilitados || 0],
    ['Total de usuarios', stats.total || 0]
  ];

  const statsCol2 = [
    ['Usuarios que solicitaron servicios', stats.usuarios_que_solicitaron_servicios || 0],
    ['Usuarios con membresía', stats.usuarios_con_membresia || 0],
    ['Técnicos activos', stats.tecnicos_activos || 0]
  ];

  // 🟦 Primera columna
  doc.autoTable({
    startY: currentY,
    head: [['Métrica', 'Cantidad']],
    body: statsCol1,
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 1.5 },
    margin: { left: 10 },
    tableWidth: 85,
    columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 30 } },
    styles: { halign: 'center' }
  });

  // 🟩 Segunda columna (a la derecha)
  doc.autoTable({
    startY: currentY,
    head: [['Métrica', 'Cantidad']],
    body: statsCol2,
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 1.5 },
    margin: { left: 110 },
    tableWidth: 85,
    columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 30 } },
    styles: { halign: 'center' }
  });
};


// ===== REPORTE DE SERVICIOS DETALLADO =====
const generarReporteServiciosDetallado = async (doc, serviceData, paquetesData = null) => {
  // Usar autoTable del documento
  const autoTable = (options) => doc.autoTable(options);
  const servicios = Array.isArray(serviceData?.data) ? serviceData.data : [];
  
  // Verificar si hay datos para mostrar
  if (servicios.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(120, 120, 120); // Color gris
    doc.text('No hay datos disponibles para el período seleccionado.', 14, 40);
    doc.setTextColor(0, 0, 0); // Restaurar color negro por defecto
    return;
  }
  
  const TERMINADOS = ['finalizado', 'calificado', 'cancelado'];

  // 📊 Clasificación
  const serviciosActivosConPago = servicios.filter(
    s => s.pagoVisita?.monto != null && !TERMINADOS.includes(s.estado)
  );
  const serviciosActivosSinPago = servicios.filter(
    s => (s.pagoVisita == null || s.pagoVisita.monto == null) && !TERMINADOS.includes(s.estado)
  );
  const serviciosTerminados = servicios.filter(s => TERMINADOS.includes(s.estado));

  // 🧩 Helpers
  const formatValue = (v) => v ?? '-';
  const obtenerUbicacion = (s) => {
    const colonia = s?.colonia?.trim() || '';
    const ciudad = s?.ciudad?.nombre?.trim() || '';
    const direccion = s?.direccion_precisa?.trim() || '';
    const esTaxi = s?.servicio?.nombre?.toLowerCase().includes('taxi');

    if (esTaxi) {
      // Para Taxi VIP: mostrar dirección precisa + colonia + ciudad
      const partes = [direccion, colonia, ciudad].filter(Boolean);
      return partes.join(' - ');
    }

    // Para otros servicios: solo colonia - ciudad
    if (colonia && ciudad) return `${colonia} - ${ciudad}`;
    return colonia || ciudad || '-';
  };
  const montoFila_ConPago = (s) => (parseFloat(s?.cotizacion?.total || 0) + parseFloat(s?.pagoVisita?.monto || 0));
  const montoFila_SinPago = (s) => parseFloat(s?.cotizacion?.total || 0);
  const montoFila_Terminado = (s) => (parseFloat(s?.cotizacion?.total || 0) + parseFloat(s?.pagoVisita?.monto || 0));

  let currentY = 40;

  // ========= 1️⃣ SERVICIOS ACTIVOS CON PAGO DE VISITA =========
  if (serviciosActivosConPago.length) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(93, 92, 222);
    doc.setFontSize(13);
    doc.text('SERVICIOS ACTIVOS CON PAGO DE VISITA', 10, currentY);
    currentY += 4;

    const headers = ['Fecha Solicitud', 'Cliente', 'Técnico', 'Servicio', 'Ubicación', 'Estado', 'Monto Total'];
    const rows = serviciosActivosConPago.map(s => ([
      formatDate(s.fecha_solicitud),
      formatValue(s.cliente?.nombre),
      formatValue(s.tecnico?.nombre),
      formatValue(s.servicio?.nombre),
      obtenerUbicacion(s),
      formatValue(s.estado),
      formatCurrency(montoFila_ConPago(s))
    ]));

    doc.autoTable({
      startY: currentY,
      head: [headers],
      body: rows, // 🔹 sin fila de total general
      theme: 'grid',
      headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
      pageBreak: 'auto',
      styles: { halign: 'center' }
    });

    currentY = doc.lastAutoTable.finalY + 12;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  }

  // ========= 2️⃣ SERVICIOS ACTIVOS SIN PAGO DE VISITA =========
  if (serviciosActivosSinPago.length) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(93, 92, 222);
    doc.setFontSize(13);
    doc.text('SERVICIOS ACTIVOS SIN PAGO DE VISITA', 10, currentY);
    currentY += 4;

    const headers = ['Fecha Solicitud', 'Cliente', 'Técnico', 'Servicio', 'Ubicación', 'Estado', 'Monto Total'];
    const rows = serviciosActivosSinPago.map(s => ([
      formatDate(s.fecha_solicitud),
      formatValue(s.cliente?.nombre),
      formatValue(s.tecnico?.nombre),
      formatValue(s.servicio?.nombre),
      obtenerUbicacion(s),
      formatValue(s.estado),
      formatCurrency(montoFila_SinPago(s))
    ]));

    doc.autoTable({
      startY: currentY,
      head: [headers],
      body: rows, // 🔹 sin fila de total general
      theme: 'grid',
      headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
      pageBreak: 'auto',
      styles: { halign: 'center' }
    });

    currentY = doc.lastAutoTable.finalY + 12;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  }

  // ========= 3️⃣ SERVICIOS TERMINADOS =========
  if (serviciosTerminados.length) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(93, 92, 222);
    doc.setFontSize(13);
    doc.text('SERVICIOS TERMINADOS', 10, currentY);
    currentY += 4;

    const headers = ['Fecha Solicitud', 'Cliente', 'Técnico', 'Servicio', 'Ubicación', 'Estado', 'Monto Total'];
    const rows = serviciosTerminados.map(s => ([
      formatDate(s.fecha_solicitud),
      formatValue(s.cliente?.nombre),
      formatValue(s.tecnico?.nombre),
      formatValue(s.servicio?.nombre),
      obtenerUbicacion(s),
      formatValue(s.estado),
      formatCurrency(montoFila_Terminado(s))
    ]));

    const totalTabla = serviciosTerminados.reduce((sum, s) => sum + montoFila_Terminado(s), 0);
    const totalRow = [
      { content: 'TOTAL GENERAL', colSpan: headers.length - 1, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: formatCurrency(totalTabla), styles: { fontStyle: 'bold' } }
    ];

    doc.autoTable({
      startY: currentY,
      head: [headers],
      body: [...rows, totalRow],
      theme: 'grid',
      headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
      pageBreak: 'auto',
      styles: { halign: 'center' }
    });

    currentY = doc.lastAutoTable.finalY + 10;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  }

  // ========= 4️⃣ DESGLOSE POR TIPO DE SERVICIO =========
  const contadorPorServicio = servicios.reduce((acc, s) => {
    const nombre = s?.servicio?.nombre ? String(s.servicio.nombre).trim() : 'Sin servicio';
    acc[nombre] = (acc[nombre] || 0) + 1;
    return acc;
  }, {});

  const desgloseRows = Object.keys(contadorPorServicio).map(nombre => [nombre, contadorPorServicio[nombre]]);

  if (desgloseRows.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(93, 92, 222);
    doc.text('DESGLOSE POR TIPO DE SERVICIO', 10, currentY);
    currentY += 4;

    doc.autoTable({
      startY: currentY,
      head: [['Servicio', 'Cantidad']],
      body: desgloseRows,
      theme: 'grid',
      headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 10, right: 10 },
      pageBreak: 'auto',
      styles: { halign: 'center' }
    });
    
    currentY = doc.lastAutoTable.finalY + 12;
  }
  
  // ========= 5️⃣ PAQUETES ADQUIRIDOS =========
  if (paquetesData?.data?.length) {
    // Agregar nueva página si es necesario
    if (currentY > 220) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(93, 92, 222);
    doc.text('PAQUETES UTILIZADOS', 10, currentY);
    currentY += 4;

    const headers = ['Fecha Compra', 'Fecha Uso', 'Usuario', 'Paquete', 'Estado'];
    const rows = paquetesData.data.map(p => ([
      formatDate(p.fecha_compra),
      formatDate(p.fecha_uso),
      p.usuario?.nombre?.trim() || 'Usuario no disponible',
      p.paquete?.nombre || 'Paquete no disponible',
      p.estado.charAt(0).toUpperCase() + p.estado.slice(1) // Capitalizar primera letra
    ]));

    // Mostrar total de paquetes utilizados
    const totalPaquetes = paquetesData.total || 0;
    const totalRow = [
      { content: 'TOTAL', colSpan: headers.length - 1, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: totalPaquetes.toString(), styles: { fontStyle: 'bold' } }
    ];

    doc.autoTable({
      startY: currentY,
      head: [headers],
      body: [...rows, totalRow],
      theme: 'grid',
      headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
      pageBreak: 'auto',
      styles: { halign: 'center' }
    });
  }
};


// ===== REPORTE DE TRANSACCIONES =====
const generarReporteTransacciones = async (doc, membershipData, visitData, withdrawalsData) => {
  // Usar autoTable del documento
  const autoTable = (options) => doc.autoTable(options);
  const data = [
    ...(membershipData?.data || []).map((m) => ({
      tipo: 'Membresía',
      fecha: m?.fecha || new Date().toISOString(),
      descripcion: `Pago de membresía - ${m?.usuario?.nombre || 'Sin nombre'}`,
      monto: parseFloat(m?.monto || 0),
      estado: m?.estado || 'Pendiente'
    })),
    ...(visitData?.data || []).map((v) => ({
      tipo: 'Visita Técnica',
      fecha: v?.fecha || new Date().toISOString(),
      descripcion: `Pago visita Técnica - ${v?.solicitud?.servicio?.nombre || 'Servicio'}`,
      monto: parseFloat(v?.monto || 0),
      estado: v?.estado || 'Pendiente'
    })),
    ...(withdrawalsData?.data || []).filter(r => ['completado', 'aprobado'].includes(r?.estado?.toLowerCase())).map((r) => ({
      tipo: r?.tipo === 'retiro_referido' ? 'Retiro Referido' : 'Retiro',
      fecha: r?.fecha || new Date().toISOString(),
      descripcion: r?.descripcion || 'Retiro de fondos',
      monto: -Math.abs(parseFloat(r?.monto || 0)),
      estado: r?.estado || 'Pendiente'
    })),
  ].filter(Boolean);

  let currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 40;
  doc.setFont('helvetica', 'bold');

  doc.setTextColor(93, 92, 222);
  doc.setFontSize(14);
  doc.text('REPORTE DE TRANSACCIONES', 10, currentY);
  currentY += 6;

  const headers = ['Fecha', 'Concepto', 'Descripción', 'Estado', 'Monto']; // monto al final
  const rows = data.map((t) => [
    formatDate(t.fecha),
    t.tipo,
    t.descripcion,
    t.estado,
    formatCurrency(t.monto)
  ]);

  const total = data.reduce((sum, t) => sum + (t.monto || 0), 0);
  const totalRow = [
    { content: 'TOTAL GENERAL', colSpan: headers.length - 1, styles: { halign: 'right', fontStyle: 'bold' } },
    { content: formatCurrency(total), styles: { fontStyle: 'bold' } }
  ];

  doc.autoTable({
    startY: currentY,
    head: [headers],
    body: [...rows, totalRow],
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 10, right: 10 },
    styles: { halign: 'center' }
  });
};

// ===== FUNCIONES DE CREACIÓN DE FACTURAS =====
const crearFacturaParaPago = async (idUsuario, payment, tipoPago, idRelacionado, idCotizacion = null) => {

  try {
    const config = useRuntimeConfig();
    const auth = useAuthStore();

    // Verificar si el usuario tiene RTN
    let rtnResponse;
    try {
      rtnResponse = await $api(`/usuarios/verificar-rtn/${idUsuario}`, {
        method: 'GET'
      });
    } catch (error) {
      rtnResponse = { success: false };
    }

    // Preparar datos de la factura - payment.monto_total es el total pagado
    let total = parseFloat(payment.monto_total || payment.monto || 0);

    // Si es pago de servicio, calcular solo la comisión
    if (tipoPago === 'services') {
      try {
        const configResponse = await $api('/config/valor/comision_por_servicio', {
          method: 'GET'
        });
        
        // El usuario indicó el formato directo, pero mantenemos soporte defensivo para .data
        const configData = configResponse.data || configResponse;
        
        if (configData && configData.valor) {
          const porcentaje = parseFloat(configData.valor);
          const montoBase = total;
          total = (montoBase * porcentaje) / 100;
        } else {
        }
      } catch (error) {
      }
    }

    const subtotal = total; // Subtotal es igual al Total (sin ISV)
    const isv = 0; // ISV en 0

    let facturaData = {
      tipo_factura: rtnResponse?.success ? 'CON_RTN' : 'CONSUMIDOR_FINAL',
      subtotal,
      isv,
      total,
      id_usuario: idUsuario
    }; 

    // Agregar datos específicos según tipo de factura
    if (rtnResponse?.success && rtnResponse.data) {
      facturaData.rtn_cliente = rtnResponse.data.rtn;
      facturaData.nombre_cliente = rtnResponse.data.nombre.trim();
    }

    // Agregar ID relacionado según tipo de pago
    switch (tipoPago) {
      case 'membership':
        facturaData.id_membresia = idRelacionado;
        break;
      case 'visits':
        facturaData.id_pagovisita = idRelacionado;
        if (idCotizacion) {
          facturaData.id_cotizacion = idCotizacion;
        }
        break;
      case 'services':
        facturaData.id_cotizacion = idCotizacion || idRelacionado;
        break;
    }

    // Crear la factura
    const facturaResponse = await $api('/facturas', {
      method: 'POST',
      body: facturaData
    });

    if (facturaResponse?.status === 'success') {
      // Retornamos éxito pero no mostramos toast aquí para no duplicar con el de approvePayment
      return 'success';
    } else if (facturaResponse?.status === 'error_config') {
      showToast('Pago procesado correctamente, pero la factura deberá generarse manualmente cuando se active un correlativo.', 'warning');
      return 'error_config';
    } else {
      throw new Error('Error al crear la factura');
    }

  } catch (error) {
    const errorMsg = error.response?._data?.message || error.message;
    showToast('Error al crear la factura: ' + errorMsg, 'error');
  }
};

// ===== FUNCIONES DE APROBACION o RECHAZO DE PAGOS =====
const approvePayment = async (id) => {
  if (isApproving.value) return;
  isApproving.value = true;
  try {
    const payment = activeTab.value === 'withdrawals' ? selectedWithdrawal.value : selectedPayment.value;
    let response;
    let billingStatus = null;
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    };

    // Obtener el ID del usuario para notificaciones
    let idUsuario;
    
    // Manejar diferentes estructuras de pago según el tipo
    if (activeTab.value === 'withdrawals') {
      // Para retiros
      idUsuario = payment?.usuario?.id_usuario || payment?.id_usuario;
    } else if (activeTab.value === 'membership') {
      // Para membresías
      idUsuario = payment?.usuario?.id_usuario || payment?.id_usuario || payment?.id_cliente;
    } else if (activeTab.value === 'visits' || activeTab.value === 'services') {
      // Para pagos de visitas y servicios - buscar en múltiples ubicaciones
      idUsuario = payment?.solicitud?.cliente?.id_usuario || 
                  payment?.solicitud?.cliente?.id_cliente ||
                  payment?.cliente?.id_usuario || 
                  payment?.cliente?.id_cliente ||
                  payment?.usuario?.id_usuario ||
                  payment?.id_usuario ||
                  payment?.id_cliente;
    } 

    switch (activeTab.value) {
      case 'membership':
        // Update membership status
        response = await $api(`/membresia/${payment.id_membresia || payment.id}`, {
          method: 'PUT',
          body: { estado: 'activa' }
        });

        // Add credit for the user with the membership amount
        const creditRequestBody = {
          id_usuario: idUsuario,
          monto_credito: payment.monto
        }; 
        
        const creditResponse = await $api('/credito', {
          method: 'POST',
          body: creditRequestBody
        });

        // Crear factura para pago de membresía
        billingStatus = await crearFacturaParaPago(idUsuario, payment, 'membership', payment.id_membresia || payment.id);
        
        if (response?.success && typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('track', 'Purchase', {
            value: Number(payment.monto),
            currency: 'HNL',
            content_name: 'Membresía MiSeguro',
            content_type: 'membership',
            transaction_id: payment.id_membresia || payment.id
          });
        }     
        break;

      case 'visits':
        // Usar el endpoint correcto de confirmación de pago de visita
        response = await $api('/pagovisita/confirmar', {
          method: 'POST',
          body: {
            id_solicitud: payment.id_solicitud || payment.solicitud?.id_solicitud || payment.id,
            id_cotizacion: payment.id_cotizacion || payment.cotizacion?.id || payment.cotizacion?.id_cotizacion
          }
        });

        // Crear factura para pago de visita
        billingStatus = await crearFacturaParaPago(idUsuario, payment, 'visits', payment.id_pagovisita, payment.id_cotizacion || payment.cotizacion?.id || payment.cotizacion?.id_cotizacion);

        // Notificar al admin de servicio pendiente
        if (response?.success) {
          try {
            await $api('/notificaciones/enviar', {
              method: 'POST',
              body: {
                titulo: 'Asignación Pendiente',
                 nombre_rol: 'sa'
              }
            });
          } catch (notificationError) {
            console.error('❌ Error al enviar notificación al técnico:', notificationError);
            // No interrumpir el flujo si falla la notificación
          }
          try {
            await $api('/notificaciones/enviar', {
              method: 'POST',
              body: {
                titulo: 'Asignación Pendiente',
                 nombre_rol: 'admin'
              }
            });
          } catch (notificationError) {
            console.error('❌ Error al enviar notificación al técnico:', notificationError);
            // No interrumpir el flujo si falla la notificación
          }
        }

        if (response?.success && typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('track', 'Purchase', {
            value: Number(payment.monto),
            currency: 'HNL',
            content_name: 'Visita Técnica MiSeguro',
            content_type: 'visit',
            transaction_id: payment.id_pagovisita
          });
        }
        break;

      case 'services':
        // Usar el endpoint correcto de aceptación de pago de servicio
        const solicitudId = payment.id_solicitud || payment.solicitud?.id_solicitud || payment.id;
        const cotizacionId = payment.id_cotizacion || 
                           payment.cotizacion?.id || 
                           payment.cotizacion?.id_cotizacion ||
                           payment.cotizaciones?.[0]?.id ||
                           payment.cotizaciones?.[0]?.id_cotizacion;

        // Aprobar el pago del servicio
        response = await $api('/pagoservicio/aceptar', {
          method: 'POST',
          body: {
            id_solicitud: solicitudId,
            id_cotizacion: cotizacionId
          }
        });

        // Crear factura para pago de servicio
        billingStatus = await crearFacturaParaPago(idUsuario, payment, 'services', solicitudId, cotizacionId);

        // Notificar al técnico sobre el pago recibido
        if (response?.success && payment.solicitud?.tecnico?.id_usuario) {
          try {
            await $api('/notificaciones/enviar', {
              method: 'POST',
              body: {
                titulo: 'Pago de servicio recibido',
                id_usuario: payment.solicitud.tecnico.id_usuario
              }
            });
          } catch (notificationError) {
            console.error('❌ Error al enviar notificación al técnico:', notificationError);
            // No interrumpir el flujo si falla la notificación
          }
        }
        
        // Notificar al usuario referidor 'Comisión por referido recibida'
        if (response?.success && response.detalles?.id_referidor) {
          try {
            await $api('/notificaciones/enviar', {
              method: 'POST',
              body: {
                titulo: 'Comisión por referido recibida',
                id_usuario: response.detalles.id_referidor
              }
            });
          } catch (notificationError) {
            console.error('❌ Error al enviar notificación al referidor:', notificationError);
            // No interrumpir el flujo si falla la notificación
          }
        }
        
        // Notificar al cliente sobre el CashBack Recibido
        if (response?.success && response.detalles?.cashback > 0) {
          try {
            await $api('/notificaciones/enviar', {
              method: 'POST',
              body: {
                titulo: 'CashBack Recibido',
                id_usuario: idUsuario
              }
            });
          } catch (notificationError) {
            console.error('❌ Error al enviar notificación de CashBack:', notificationError);
          }
        }
        
        if (response?.success && typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('track', 'Purchase', {
            value: Number(payment.monto),
            currency: 'HNL',
            content_name: 'Servicio Técnico MiSeguro',
            content_type: 'service',
            transaction_id: payment.id
          });
        }
        break;

      case 'withdrawals':
        const withdrawalId = payment.id_movimiento || payment.id;
        response = await $api(`/movimientos/${withdrawalId}`, {
          method: 'PUT',
          body: { estado: 'completado' }
        });

        // si se acepta el retiro haz que el monto se sume al credito
        // solo si es tipo 'retiro_referido'
        if (idUsuario && payment.monto && payment.tipo === 'retiro_referido') {
          try {
            await $api('/credito', {
              method: 'POST',
              body: {
                id_usuario: idUsuario,
                monto_credito: Math.abs(parseFloat(payment.monto))
              }
            });
          } catch (error) {
            console.error('❌ Error al sumar crédito al usuario:', error);
          }
        }
        break;
    }

    if (activeTab.value === 'withdrawals') {
      if (selectedWithdrawal.value) {
        selectedWithdrawal.value.estado = 'completado';
      }
      closeWithdrawalModal();
    } else {
      closeDetailsModal();
    }

    // Solo mostrar el toast de éxito general si NO hubo una advertencia de facturación
    // El toast de advertencia ya se mostró dentro de crearFacturaParaPago
    if (billingStatus !== 'error_config') {
      showToast('Pago aprobado correctamente', 'success');
    }

    // Redirigir a ServiciosAdmin.vue si es un pago de visita
    if (activeTab.value === 'visits') {
      setTimeout(() => {
        navigateTo('/admin/ServiciosAdmin');
      }, 1500);
    }

    // Notificar al cliente sobre el pago aprobado
    try {
      let titulo = '';
      if (activeTab.value === 'withdrawals') {
        titulo = 'Retiro Aprobado';
      } else if (activeTab.value === 'visits') {
        titulo = 'Pago de Visita Aprobado';
      } else if (activeTab.value === 'membership') {
        titulo = 'Pago de Membresía Aprobado';
      } else if (activeTab.value === 'services') {
        titulo = 'Pago de Servicio Aprobado';
      }

      if (idUsuario) {
        await $api('/notificaciones/enviar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            titulo,
            id_usuario: idUsuario
          })
        });
      }
    } catch (notifError) {
      console.error('❌ Error al enviar notificación de pago aprobado:', notifError);
    }

    const currentPage = currentPaymentsPage.value;
    const cacheKey = `${activeTab.value}-${selectedMonthPayments.value || 'all'}-${statusFilter.value || 'all'}-${currentPage}-${paymentsPerPage}`;
    if (paymentsCache.value[cacheKey]) delete paymentsCache.value[cacheKey];

    // Limpiar caché de transacciones para forzar recarga
    transactionsCache.value = {};

    await loadTabData(currentPage);
    await updatePlatformStats();
    await loadTransactions(); // Actualizar sección de transacciones
    await loadPendingBilling(); // Actualizar Centro de Facturación

  } catch (error) {
    console.error('❌ Error aprobando pago:', error);
    showToast(error.response?._data?.message || 'Error al aprobar el pago', 'error');
  } finally {
    isApproving.value = false;
  }
};

const rejectPayment = async (id) => {
  if (isRejecting.value) return;
  isRejecting.value = true;
  try {
    const payment = activeTab.value === 'withdrawals' ? selectedWithdrawal.value : selectedPayment.value;
    let response;
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    };

    // Obtener el ID del usuario para notificaciones
    let idUsuario;
    
    // Manejar diferentes estructuras de pago según el tipo
    if (activeTab.value === 'withdrawals') {
      // Para retiros
      idUsuario = payment?.usuario?.id_usuario || payment?.id_usuario;
    } else if (activeTab.value === 'membership') {
      // Para membresías
      idUsuario = payment?.usuario?.id_usuario || payment?.id_usuario || payment?.id_cliente;
    } else if (activeTab.value === 'visits' || activeTab.value === 'services') {
      // Para pagos de visitas y servicios - buscar en múltiples ubicaciones
      idUsuario = payment?.solicitud?.cliente?.id_usuario || 
                  payment?.solicitud?.cliente?.id_cliente ||
                  payment?.cliente?.id_usuario || 
                  payment?.cliente?.id_cliente ||
                  payment?.usuario?.id_usuario ||
                  payment?.id_usuario ||
                  payment?.id_cliente;
    }

    switch (activeTab.value) {
      case 'membership':
        response = await $api(`/membresia/${payment.id_membresia || payment.id}`, {
          method: 'PUT',
          body: { estado: 'rechazada' }
        });
        break;

      case 'visits':
        // Usar el endpoint correcto de denegación de pago de visita
        response = await $api('/pagovisita/denegar', {
          method: 'POST',
          body: {
            id_solicitud: payment.id_solicitud || payment.solicitud?.id_solicitud || payment.id,
            id_cotizacion: payment.id_cotizacion || payment.cotizacion?.id || payment.cotizacion?.id_cotizacion,
            id_usuario: idUsuario
          }
        });

        // Actualizar el estado de la solicitud a pendiente_pagovisita
        try {
          await $api(`/solicitudservicio/${payment.solicitud?.id_solicitud || payment.id_solicitud || payment.id}`, {
            method: 'PUT',
            body: { estado: 'pendiente_pagovisita' }
          });
        } catch (error) {
          console.error('Error al actualizar el estado de la solicitud:', error);
        }
        break;

      case 'services':
        // Usar el endpoint correcto de denegación de pago de servicio
        const solicitudId = payment.id_solicitud || payment.solicitud?.id_solicitud || payment.id;
        const cotizacionId = payment.id_cotizacion || 
                           payment.cotizacion?.id || 
                           payment.cotizacion?.id_cotizacion ||
                           payment.cotizaciones?.[0]?.id ||
                           payment.cotizaciones?.[0]?.id_cotizacion;

        response = await $api('/pagoservicio/denegar', {
          method: 'POST',
          body: {
            id_solicitud: solicitudId,
            id_cotizacion: cotizacionId,
            id_usuario: idUsuario
          }
        });
        break;

      case 'withdrawals':
        const withdrawalId = payment.id_movimiento || payment.id;
        response = await $api(`/movimientos/${withdrawalId}`, {
          method: 'PUT',
          body: { estado: 'rechazado' }
        });

        break;
    }

    if (activeTab.value === 'withdrawals') {
      if (selectedWithdrawal.value) {
        selectedWithdrawal.value.estado = 'rechazado';
      }
      closeWithdrawalModal();
    } else {
      closeDetailsModal();
    }

    showToast('Pago rechazado correctamente', 'success');

    // Notificar al cliente sobre el pago rechazado
    try {
      let titulo = '';
      if (activeTab.value === 'withdrawals') {
        titulo = 'Retiro Rechazado';
      } else if (activeTab.value === 'visits') {
        titulo = 'Pago de Visita Rechazado';
      } else if (activeTab.value === 'membership') {
        titulo = 'Pago de Membresía Rechazado';
      } else if (activeTab.value === 'services') {
        titulo = 'Pago de Servicio Rechazado';
      }

      if (idUsuario) {
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo,
            id_usuario: idUsuario
          }
        });
      }
    } catch (notifError) {
      console.error('❌ Error al enviar notificación de pago rechazado:', notifError);
    }

    const currentPage = currentPaymentsPage.value;
    const cacheKey = `${activeTab.value}-${selectedMonthPayments.value || 'all'}-${statusFilter.value || 'all'}-${currentPage}-${paymentsPerPage}`;
    if (paymentsCache.value[cacheKey]) delete paymentsCache.value[cacheKey];

    // Limpiar caché de transacciones para forzar recarga
    transactionsCache.value = {};

    await loadTabData(currentPage);
    await updatePlatformStats();
    await loadTransactions(); // Actualizar sección de transacciones
    await loadPendingBilling(); // Actualizar Centro de Facturación

  } catch (error) {
    console.error('❌ Error rechazando pago:', error);
    showToast(error.response?._data?.message || 'Error al rechazar el pago', 'error');
  } finally {
    isRejecting.value = false;
  }
};

 
// ===== FUNCIONES DE TOAST =====
const showToast = (message, type = 'info') => {
  try {
    toast.show = true;
    toast.message = message;
    toast.type = type;
    setTimeout(() => {
      toast.show = false;
    }, 5000);
  } catch (error) {
    console.error('Error mostrando toast:', error);
  }
};

// ===== WATCHERS =====

// Watch para sincronizar selectedChart con selectedChartObject
watch(() => selectedChart.value, (newValue) => {
  if (newValue && availableCharts.length > 0) {
    const chartObject = availableCharts.find(chart => chart.id === newValue);
    if (chartObject) {
      selectedChartObject.value = chartObject;
    }
  } else {
    selectedChartObject.value = availableCharts[0]; // Primer gráfico por defecto
  }
});

// Watch para sincronizar selectedChartObject con selectedChart
watch(() => selectedChartObject.value, (newObject) => {
  if (newObject && newObject.id !== undefined) {
    selectedChart.value = newObject.id;
  } else {
    selectedChart.value = 'earnings'; // Valor por defecto
  }
});

watch(selectedChart, async (newVal) => { 
  try {
    await nextTick();
    createChart();
    
    if (newVal === 'earnings') {
      if (platformDateFrom.value || platformDateTo.value) {
        await updatePlatformStats();
      }
    }
  } catch (error) {
    console.error('Error en watcher de selectedChart:', error);
  }
});

// Watch para cuando cambia la ciudad del gráfico
watch(selectedCityChart, async () => {
  createChart();
});

const loadCities = async () => {
  try {
    const response = await $api('/ciudad', { method: 'GET' });
    const list = Array.isArray(response) ? response : (response?.data || []);
    
    if (list.length > 0) {
      availableCities.value = [
        { id_ciudad: 'all', nombre_ciudad: 'Todas las ciudades' },
        ...list
      ];
    }
  } catch (error) {
    console.error('Error al cargar ciudades para gráfico:', error);
  }
};

// ===== LIFECYCLE HOOKS =====
// Watch for changes to initialStats
watch(initialStats, (newVal) => {
}, { immediate: true, deep: true });

onMounted(async () => {
  try {
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) {
      window.location.reload()
      return
    }

    Chart.register(...registerables, DataLabelsPlugin);
    
    // Cargar configuración de la empresa
    await loadEmpresaConfig();
    
    // Cargar ciudades para los filtros de gráficos
    await loadCities();
    
    // Inicializar selectedChartObject con la primera opción
    initializeChartObject();  

    await loadTabData();
    createChart();
    await updatePlatformStats();
    
    // Set initial stats after first load
    if (totalMonthlyStats.value?.membership) {
      const stats = totalMonthlyStats.value.membership;
      initialStats.value = {
        aprobados: stats.aprobados || 0,
        rechazados: stats.rechazados || 0,
        pendientes: stats.pendientes || 0,
        total: (stats.aprobados || 0) + (stats.rechazados || 0) + (stats.pendientes || 0),
        totalMoney: stats.total || 0
      };
    }    
    await loadTransactions();
    await loadPendingBilling();
  } catch (error) {
    window.location.reload()
  } finally {
    isLoading.value = false;
  }
});

</script>

<style>
[v-cloak] {
  display: none !important;
}

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Estilos para vue-multiselect en filtros de admin */
.multiselect-admin-filter {
  position: relative;
}

.multiselect-admin-filter .multiselect__tags {
  min-height: 36px;
  padding: 4px 40px 4px 12px;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  font-size: 12px;
  transition: all 0.2s ease;
  color: #111827;
}

.dark .multiselect-admin-filter .multiselect__tags {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.multiselect-admin-filter .multiselect__content-wrapper {
  position: absolute;
  z-index: 9999;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  margin-top: 4px;
}

.dark .multiselect-admin-filter .multiselect__content-wrapper {
  background: #374151;
  border-color: #4b5563;
}

.multiselect-admin-filter .multiselect__content {
  max-height: 200px;
  overflow-y: auto;
}

.multiselect-admin-filter .multiselect__element {
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.multiselect-admin-filter .multiselect__element:hover {
  background-color: #f3f4f6;
}

.dark .multiselect-admin-filter .multiselect__element:hover {
  background-color: #4b5563;
}

.multiselect-admin-filter .multiselect__element--selected {
  background-color: #2563eb;
  color: white;
}

.multiselect-admin-filter .multiselect__element--selected:hover {
  background-color: #2563eb;
}
</style>