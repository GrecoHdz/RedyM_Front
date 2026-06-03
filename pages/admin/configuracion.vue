<template>
  <div class="min-h-screen bg-[#070b14] text-gray-100 font-['Outfit'] pb-20">
    <Toast 
      :show="toast.show"
      :message="toast.message" 
      :type="toast.type"
      @close="toast.show = false"
    />

    <LoadingSpinner :loading="isLoading || ciudadesCargando || cuentasCargando || isLoadingNotifications" message="Cargando datos..." />

    <!-- Header -->
    <header class="fixed top-0 inset-x-0 z-40 bg-[#070b14]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <i class="fas fa-cog text-[#070b14] text-xl"></i>
        </div>
        <div>
          <h1 class="text-lg font-black uppercase tracking-tight leading-none">Admin Panel</h1>
          <p class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Configuración del Sistema</p>
        </div>
      </div>
      
      <button @click="$router.push('/admin/DashboardAdmin')" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
        <i class="fas fa-chevron-left"></i>
      </button>
    </header>

    <main class="pt-24 px-4 max-w-2xl mx-auto space-y-12">
      <!-- Section 1: Variables Globales -->
      <section>
        <div class="mb-8 p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-[2.5rem] relative overflow-hidden">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div class="relative z-10">
            <h2 class="text-xl font-black text-white mb-2">Variables Globales</h2>
            <p class="text-xs text-gray-400 font-medium leading-relaxed">
              Ajusta los valores base de la plataforma, como costos de membresía, recompensas por interacción y otros parámetros operativos.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div v-for="item in configs" :key="item.id_config" 
               class="bg-white/5 border border-white/10 rounded-3xl p-4 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between h-full">
            <div class="mb-4">
              <div class="flex items-center gap-2 mb-1">
                <div class="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <i class="fas fa-tag text-emerald-500/70 text-[10px]"></i>
                </div>
                <h3 class="text-[9px] font-black text-emerald-500 uppercase tracking-widest truncate">{{ formatLabel(item.tipo_config) }}</h3>
              </div>
              <p class="text-[8px] font-bold text-gray-600 truncate ml-9">{{ item.tipo_config }}</p>
            </div>

            <div class="space-y-2">
              <input 
                v-model="item.valor" 
                type="text"
                class="w-full bg-[#0d121f] border border-white/5 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all text-center"
                :placeholder="`Valor`"
              >
              <button 
                @click="saveConfig(item)"
                :disabled="savingId === item.id_config"
                class="w-full py-2.5 bg-emerald-500 text-[#070b14] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95 transition-all disabled:opacity-50"
              >
                <i v-if="savingId === item.id_config" class="fas fa-circle-notch fa-spin text-xs"></i>
                <span class="text-[9px] font-black uppercase tracking-widest">{{ savingId === item.id_config ? '' : 'Guardar' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Add new config -->
        <div class="mt-6">
          <div class="bg-white/5 border border-white/10 border-dashed rounded-[2.5rem] p-6">
            <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Agregar Nueva Variable</h3>
            <div class="space-y-4">
              <div>
                <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Identificador (tipo_config)</label>
                <input 
                  v-model="newConfig.tipo_config" 
                  type="text"
                  class="w-full bg-[#0d121f] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="ej: valor_like_sa"
                >
              </div>
              <div>
                <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Valor Inicial</label>
                <input 
                  v-model="newConfig.valor" 
                  type="text"
                  class="w-full bg-[#0d121f] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="0.00"
                >
              </div>
              <button 
                @click="addNewConfig"
                :disabled="!newConfig.tipo_config || !newConfig.valor || isAdding"
                class="w-full py-4 bg-white/5 hover:bg-emerald-500 hover:text-[#070b14] border border-white/10 hover:border-emerald-500 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-gray-500 disabled:hover:border-white/10"
              >
                <i v-if="isAdding" class="fas fa-circle-notch fa-spin"></i>
                <i v-else class="fas fa-plus"></i>
                Crear Configuración
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: Gestión de Cuentas Bancarias -->
      <section class="border-t border-white/5 pt-8">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-sm font-black text-emerald-500 uppercase tracking-widest">Gestión de Cuentas Bancarias</h2>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Administra cuentas para retiros</p>
          </div>
          <button 
            @click="nuevaCuenta()"
            class="px-4 py-2 text-xs bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 active:scale-95 transition-all"
          >
            + Nueva
          </button>
        </div>

        <div class="mb-4">
          <input
            v-model="filtroBusquedaCuentas"
            type="text"
            placeholder="Buscar cuentas..."
            class="w-full bg-[#0d121f] border border-white/5 rounded-2xl px-5 py-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
          >
        </div>

        <div v-if="cuentasFiltradas.length === 0" class="text-center py-8 bg-white/5 rounded-3xl border border-white/10 border-dashed">
          <p class="text-xs font-bold text-gray-500">No se encontraron cuentas bancarias</p>
        </div>

        <div v-else class="grid grid-cols-2 gap-3">
          <div v-for="cuenta in cuentasPaginadas" :key="cuenta.id_cuenta" 
               @click="abrirDetallesCuenta(cuenta)"
               :class="cuenta.activo ? 'border-emerald-500/20 hover:border-emerald-500/50 bg-emerald-500/5' : 'border-red-500/20 hover:border-red-500/50 bg-red-500/5'"
               class="cursor-pointer rounded-3xl p-4 border transition-all duration-300 flex flex-col justify-between min-h-[140px]">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <i class="fas fa-university text-emerald-500/70 text-xs"></i>
                </div>
                <h4 class="text-xs font-black text-white truncate">{{ cuenta.banco }}</h4>
              </div>
              <div class="space-y-1">
                <p class="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Número</p>
                <p class="text-xs font-bold font-mono text-white truncate">{{ cuenta.num_cuenta }}</p>
                <p class="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Tipo</p>
                <p class="text-xs font-bold text-white truncate">{{ cuenta.tipo }}</p>
              </div>
            </div>
            <div class="mt-2 pt-2 border-t border-white/5 text-[9px] font-bold text-gray-500 truncate">
              ID: {{ cuenta.beneficiario }}
            </div>
          </div>
        </div>

        <!-- Paginación para cuentas -->
        <div v-if="cuentasFiltradas.length > 0" class="mt-4 flex items-center justify-between px-2">
          <span class="text-[10px] text-gray-500 font-black uppercase tracking-wider">Pág. {{ paginacionCuentas.paginaActual }} de {{ paginacionCuentasCalculada.totalPaginas }}</span>
          <div class="flex gap-2">
            <button 
              @click="cambiarPaginaCuentas(paginacionCuentas.paginaActual - 1)" 
              :disabled="paginacionCuentas.paginaActual === 1"
              class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 disabled:opacity-30"
            >
              <i class="fas fa-chevron-left text-xs"></i>
            </button>
            <button 
              @click="cambiarPaginaCuentas(paginacionCuentas.paginaActual + 1)" 
              :disabled="paginacionCuentas.paginaActual >= paginacionCuentasCalculada.totalPaginas"
              class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 disabled:opacity-30"
            >
              <i class="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- Section 3: Gestión de Ciudades -->
      <section class="border-t border-white/5 pt-8">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-sm font-black text-emerald-500 uppercase tracking-widest">Gestión de Ciudades</h2>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Administra las ubicaciones operativas</p>
          </div>
          <button 
            @click="nuevaCiudad()"
            class="px-4 py-2 text-xs bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 active:scale-95 transition-all"
          >
            + Nueva
          </button>
        </div>

        <div class="mb-4">
          <input
            v-model="filtroBusquedaCiudades"
            type="text"
            placeholder="Buscar ciudades..."
            class="w-full bg-[#0d121f] border border-white/5 rounded-2xl px-5 py-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
          >
        </div>

        <div v-if="ciudadesFiltradas.length === 0" class="text-center py-8 bg-white/5 rounded-3xl border border-white/10 border-dashed">
          <p class="text-xs font-bold text-gray-500">No se encontraron ciudades</p>
        </div>

        <div v-else class="space-y-2">
          <div v-for="ciudad in ciudadesPaginadas" :key="ciudad.id_ciudad" 
               class="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-emerald-500/20 transition-all">
            <div class="flex items-center gap-3">
              <span class="text-sm">🏙️</span>
              <span class="text-xs font-bold text-white">{{ ciudad.nombre }}</span>
            </div>
            <div class="flex gap-2">
              <button 
                @click="editarCiudad(ciudad)"
                class="w-7 h-7 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
              >
                <i class="fas fa-edit text-[10px]"></i>
              </button>
              <button 
                @click="confirmarEliminarCiudad(ciudad)"
                class="w-7 h-7 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
              >
                <i class="fas fa-trash text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Paginación para ciudades -->
        <div v-if="ciudadesFiltradas.length > 0" class="mt-4 flex items-center justify-between px-2">
          <span class="text-[10px] text-gray-500 font-black uppercase tracking-wider">Pág. {{ paginacionCiudades.paginaActual }} de {{ paginacionCiudadesCalculada.totalPaginas }}</span>
          <div class="flex gap-2">
            <button 
              @click="cambiarPaginaCiudades(paginacionCiudades.paginaActual - 1)" 
              :disabled="paginacionCiudades.paginaActual === 1"
              class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 disabled:opacity-30"
            >
              <i class="fas fa-chevron-left text-xs"></i>
            </button>
            <button 
              @click="cambiarPaginaCiudades(paginacionCiudades.paginaActual + 1)" 
              :disabled="paginacionCiudades.paginaActual >= paginacionCiudadesCalculada.totalPaginas"
              class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 disabled:opacity-30"
            >
              <i class="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- Section 4: Gestión de Notificaciones -->
      <section class="border-t border-white/5 pt-8">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-sm font-black text-emerald-500 uppercase tracking-widest">Gestión de Notificaciones</h2>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Crear y enviar notificaciones</p>
          </div>
          <button 
            @click="mostrarFormularioCrear = !mostrarFormularioCrear"
            class="px-4 py-2 text-xs bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 active:scale-95 transition-all"
          >
            {{ mostrarFormularioCrear ? 'Cancelar' : 'Crear' }}
          </button>
        </div>

        <!-- Formulario crear notificación -->
        <div v-if="mostrarFormularioCrear" class="mb-6 p-6 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
          <h4 class="text-xs font-black text-white uppercase tracking-widest">Nueva Plantilla de Notificación</h4>
          <div>
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-2">Título</label>
            <input
              v-model="nuevaNotificacion.titulo"
              type="text"
              class="w-full bg-[#0d121f] border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
              placeholder="Escribe el título de la notificación"
              @keyup.enter="crearNotificacion"
            >
          </div>
          <div class="flex gap-2">
            <button 
              @click="crearNotificacion"
              :disabled="!nuevaNotificacion.titulo || isCreatingNotification"
              class="flex-1 py-3 bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
            >
              <i v-if="isCreatingNotification" class="fas fa-circle-notch fa-spin text-xs"></i>
              Crear Plantilla
            </button>
            <button 
              @click="eliminarNotificacionesLeidas"
              :disabled="isDeletingRead"
              class="py-3 px-4 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all"
            >
              Limpiar Leídas
            </button>
          </div>
        </div>

        <div v-if="notificaciones.length === 0" class="text-center py-8 bg-white/5 rounded-3xl border border-white/10 border-dashed">
          <p class="text-xs font-bold text-gray-500">No hay notificaciones creadas</p>
        </div>

        <div v-else class="space-y-2">
          <div v-for="notif in notificaciones" :key="notif.id_notificacion" 
               class="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-emerald-500/20 transition-all">
            <div class="flex-1 min-w-0 pr-4">
              <h5 class="text-xs font-bold text-white truncate">{{ notif.titulo }}</h5>
              <p class="text-[9px] text-gray-500 font-bold uppercase mt-1">
                Por: {{ notif.creado_por }} • {{ formatearFecha(notif.fecha_creacion) }}
              </p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button 
                @click="mostrarFormularioEnvio(notif)"
                class="w-8 h-8 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-[#070b14] transition-all"
                title="Enviar Notificación"
              >
                <i class="fas fa-paper-plane text-xs"></i>
              </button>
              <button 
                @click="confirmarEliminarNotificacion(notif.id_notificacion)"
                class="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
                title="Eliminar Plantilla"
              >
                <i class="fas fa-trash text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal: Nueva/Editar Ciudad -->
    <Transition name="fade">
      <div v-if="mostrarModalNuevaCiudad" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#070b14]/80 backdrop-blur-sm" @click="cerrarModalCiudad"></div>
        <div class="bg-[#0d121f] border border-white/10 rounded-[2.5rem] p-6 w-full max-w-sm relative z-10 space-y-4">
          <h3 class="text-sm font-black text-white uppercase tracking-widest">{{ ciudadEditando ? 'Editar Ciudad' : 'Nueva Ciudad' }}</h3>
          <form @submit.prevent="guardarCiudad" class="space-y-4">
            <div>
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-2">Nombre de la Ciudad</label>
              <input
                v-model="formCiudad.nombre"
                type="text"
                required
                class="w-full bg-[#070b14] border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="Ej: Tegucigalpa"
              >
            </div>
            <div class="flex gap-2">
              <button 
                type="button" 
                @click="cerrarModalCiudad"
                class="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-xl hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                :disabled="guardandoCiudad"
                class="flex-1 py-3 bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                <i v-if="guardandoCiudad" class="fas fa-circle-notch fa-spin text-xs"></i>
                {{ ciudadEditando ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal: Nueva/Editar Cuenta -->
    <Transition name="fade">
      <div v-if="mostrarModalNuevaCuenta" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#070b14]/80 backdrop-blur-sm" @click="cerrarModalCuenta"></div>
        <div class="bg-[#0d121f] border border-white/10 rounded-[2.5rem] p-6 w-full max-w-sm relative z-10 max-h-[90vh] overflow-y-auto space-y-4">
          <h3 class="text-sm font-black text-white uppercase tracking-widest">{{ cuentaEditando ? 'Editar Cuenta' : 'Nueva Cuenta' }}</h3>
          <form @submit.prevent="guardarCuenta" class="space-y-4">
            <div>
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-2">Banco</label>
              <input
                v-model="formCuenta.banco"
                type="text"
                required
                class="w-full bg-[#070b14] border border-white/5 rounded-2xl px-5 py-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="Ej: BAC, BANPAIS"
              >
            </div>
            <div>
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-2">Beneficiario (ID)</label>
              <input
                v-model="formCuenta.beneficiario"
                type="text"
                required
                class="w-full bg-[#070b14] border border-white/5 rounded-2xl px-5 py-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="Ej: 0801199512345"
              >
            </div>
            <div>
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-2">Número de Cuenta</label>
              <input
                v-model="formCuenta.num_cuenta"
                type="text"
                required
                class="w-full bg-[#070b14] border border-white/5 rounded-2xl px-5 py-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="Ej: 7421394"
              >
            </div>
            <div>
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-2">Tipo de Cuenta</label>
              <input
                v-model="formCuenta.tipo"
                type="text"
                required
                class="w-full bg-[#070b14] border border-white/5 rounded-2xl px-5 py-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="Ej: Ahorro"
              >
            </div>
            <div class="flex items-center gap-2 ml-2">
              <input
                id="activo_cuenta"
                v-model="formCuenta.activo"
                type="checkbox"
                class="h-4 w-4 bg-[#070b14] border-white/10 text-emerald-500 focus:ring-emerald-500 rounded"
              >
              <label for="activo_cuenta" class="text-xs font-bold text-gray-400">Cuenta Activa</label>
            </div>
            <div class="flex gap-2 pt-2">
              <button 
                type="button" 
                @click="cerrarModalCuenta"
                class="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-xl hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                :disabled="guardandoCuenta"
                class="flex-1 py-3 bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                <i v-if="guardandoCuenta" class="fas fa-circle-notch fa-spin text-xs"></i>
                {{ cuentaEditando ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal: Detalles Cuenta Bancaria -->
    <Transition name="fade">
      <div v-if="mostrarModalDetallesCuenta" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#070b14]/80 backdrop-blur-sm" @click="cerrarDetallesCuenta"></div>
        <div v-if="cuentaSeleccionada" class="bg-[#0d121f] border border-white/10 rounded-[2.5rem] p-6 w-full max-w-sm relative z-10 space-y-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-university text-emerald-500 text-xl"></i>
            </div>
            <h4 class="text-base font-black text-white uppercase tracking-tight">{{ cuentaSeleccionada.banco }}</h4>
            <span class="inline-block mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                  :class="cuentaSeleccionada.activo ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'">
              {{ cuentaSeleccionada.activo ? 'Activa' : 'Inactiva' }}
            </span>
          </div>

          <div class="bg-[#070b14] border border-white/5 rounded-2xl p-4 space-y-3">
            <div>
              <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Beneficiario (ID)</span>
              <span class="text-xs font-bold text-white">{{ cuentaSeleccionada.beneficiario }}</span>
            </div>
            <div>
              <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Número de Cuenta</span>
              <span class="text-xs font-bold font-mono text-white">{{ cuentaSeleccionada.num_cuenta }}</span>
            </div>
            <div>
              <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Tipo</span>
              <span class="text-xs font-bold text-white">{{ cuentaSeleccionada.tipo }}</span>
            </div>
          </div>

          <div class="flex gap-2">
            <button 
              @click="editarCuenta(cuentaSeleccionada)"
              class="flex-1 py-3 bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-blue-400 transition-all flex items-center justify-center gap-2"
            >
              <i class="fas fa-edit"></i>
              Editar
            </button>
            <button 
              @click="confirmarEliminarCuenta(cuentaSeleccionada)"
              class="flex-1 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-400 transition-all flex items-center justify-center gap-2"
            >
              <i class="fas fa-trash"></i>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Enviar Notificación -->
    <Transition name="fade">
      <div v-if="mostrarModalEnvio" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#070b14]/80 backdrop-blur-sm" @click="cerrarModalEnvio"></div>
        <div class="bg-[#0d121f] border border-white/10 rounded-[2.5rem] p-6 w-full max-w-sm relative z-10 max-h-[90vh] overflow-y-auto space-y-4">
          <h3 class="text-sm font-black text-white uppercase tracking-widest">Enviar Notificación</h3>
          
          <div class="space-y-4">
            <div>
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Destinatario</label>
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
              >
                <template #singleLabel="{ option }">
                  <span class="text-xs font-bold text-white">{{ option.label }}</span>
                </template>
              </multiselect>
            </div>

            <!-- Por rol -->
            <div v-if="tipoEnvio === 'rol'">
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Rol de Destino</label>
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
              >
                <template #singleLabel="{ option }">
                  <span class="text-xs font-bold text-white">{{ option.label }}</span>
                </template>
              </multiselect>
            </div>

            <!-- Por usuario específico -->
            <div v-if="tipoEnvio === 'usuario'" class="space-y-2">
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Usuario Destinatario</label>
              <div v-if="usuarioSeleccionado" class="flex items-center justify-between p-3 bg-[#070b14] border border-white/5 rounded-2xl">
                <span class="text-xs font-bold text-white">{{ usuarioSeleccionado.nombre }} ({{ usuarioSeleccionado.email }})</span>
                <button @click="limpiarUsuarioSeleccionado" class="text-red-400 hover:text-red-300">
                  <i class="fas fa-times-circle"></i>
                </button>
              </div>
              <div v-else class="space-y-2">
                <input 
                  v-model="terminoBusquedaUsuario"
                  type="text"
                  class="w-full bg-[#070b14] border border-white/5 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="Escribe nombre o correo..."
                >
                <div v-if="buscandoUsuarios" class="text-center py-2">
                  <i class="fas fa-circle-notch fa-spin text-emerald-500 text-xs"></i>
                </div>
                <div v-else-if="usuariosEncontrados.length > 0" class="max-h-40 overflow-y-auto bg-[#070b14] border border-white/5 rounded-2xl divide-y divide-white/5">
                  <div v-for="user in usuariosEncontrados" :key="user.id_usuario" 
                       @click="seleccionarUsuario(user)"
                       class="p-3 text-xs font-bold text-gray-300 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    {{ user.nombre }} ({{ user.email }})
                  </div>
                </div>
              </div>
            </div>

            <!-- Por ciudad -->
            <div v-if="tipoEnvio === 'ciudad'" class="space-y-4">
              <div>
                <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Ciudad</label>
                <multiselect 
                  v-model="ciudadSeleccionada"
                  :options="ciudades"
                  :searchable="false"
                  :close-on-select="true"
                  :show-labels="false"
                  placeholder="Seleccionar ciudad"
                  label="nombre"
                  track-by="id_ciudad"
                  class="multiselect-admin-filter"
                >
                  <template #singleLabel="{ option }">
                    <span class="text-xs font-bold text-white">{{ option.nombre }}</span>
                  </template>
                </multiselect>
              </div>
              <div>
                <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Filtrar por Rol (Opcional)</label>
                <multiselect 
                  v-model="rolCiudadSeleccionado"
                  :options="rolOptions"
                  :searchable="false"
                  :close-on-select="true"
                  :show-labels="false"
                  placeholder="Todos los roles"
                  label="label"
                  track-by="value"
                  class="multiselect-admin-filter"
                  :custom-label="getRolLabel"
                >
                  <template #singleLabel="{ option }">
                    <span class="text-xs font-bold text-white">{{ option.label }}</span>
                  </template>
                </multiselect>
              </div>
            </div>
          </div>

          <div class="flex gap-2 pt-4">
            <button 
              type="button" 
              @click="cerrarModalEnvio"
              class="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-xl hover:text-white transition-all"
            >
              Cancelar
            </button>
            <button 
              @click="enviarNotificacion"
              :disabled="!puedeEnviar || isSendingNotification"
              class="flex-1 py-3 bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
            >
              <i v-if="isSendingNotification" class="fas fa-circle-notch fa-spin text-xs"></i>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import BottomNav from '~/components/footers/BottomNav.vue'
import Multiselect from 'vue-multiselect'
import { useAuthStore } from '~/middleware/auth.store'

const { $api } = useNuxtApp()
const auth = useAuthStore()

const configs = ref([])
const isLoading = ref(true)
const savingId = ref(null)
const isAdding = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

const newConfig = ref({
  tipo_config: '',
  valor: ''
})

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
}

const fetchConfigs = async () => {
  isLoading.value = true
  try {
    const res = await $api('/config')
    if (res.success) {
      configs.value = res.data
    }
  } catch (e) {
    showToast('Error al cargar configuraciones', 'error')
  } finally {
    isLoading.value = false
  }
}

const saveConfig = async (config) => {
  savingId.value = config.id_config
  try {
    const res = await $api('/config/guardar', {
      method: 'POST',
      body: {
        tipo_config: config.tipo_config,
        valor: config.valor
      }
    })
    if (res.success) {
      showToast('Configuración guardada correctamente')
    } else {
      showToast(res.error || 'Error al guardar', 'error')
    }
  } catch (e) {
    showToast('Error de conexión', 'error')
  } finally {
    savingId.value = null
  }
}

const addNewConfig = async () => {
  isAdding.value = true
  try {
    const res = await $api('/config/guardar', {
      method: 'POST',
      body: newConfig.value
    })
    if (res.success) {
      showToast('Nueva configuración creada')
      newConfig.value = { tipo_config: '', valor: '' }
      await fetchConfigs()
    } else {
      showToast(res.error || 'Error al crear', 'error')
    }
  } catch (e) {
    showToast('Error de conexión', 'error')
  } finally {
    isAdding.value = false
  }
}

const formatLabel = (slug) => {
  return slug
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// ============================================
// CRUD - CUENTAS BANCARIAS
// ============================================
const cuentas = ref([])
const cuentasCargando = ref(false)
const cuentaEditando = ref(null)
const guardandoCuenta = ref(false)
const cuentaSeleccionada = ref(null)
const filtroBusquedaCuentas = ref('')

const formCuenta = ref({
  banco: '',
  beneficiario: '',
  num_cuenta: '',
  tipo: '',
  activo: true
})

const paginacionCuentas = reactive({
  paginaActual: 1,
  porPagina: 4
})

const cuentasFiltradas = computed(() => {
  let resultado = [...cuentas.value]
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

const paginacionCuentasCalculada = computed(() => {
  const total = cuentasFiltradas.value.length
  const totalPaginas = Math.ceil(total / paginacionCuentas.porPagina) || 1
  const paginaActual = Math.min(paginacionCuentas.paginaActual, totalPaginas)
  return { total, totalPaginas, paginaActual }
})

const cuentasPaginadas = computed(() => {
  const inicio = (paginacionCuentasCalculada.value.paginaActual - 1) * paginacionCuentas.porPagina
  const fin = inicio + paginacionCuentas.porPagina
  return cuentasFiltradas.value.slice(inicio, fin)
})

const cambiarPaginaCuentas = (pagina) => {
  if (pagina < 1 || pagina > paginacionCuentasCalculada.value.totalPaginas) return
  paginacionCuentas.paginaActual = pagina
}

const cargarCuentas = async () => {
  cuentasCargando.value = true
  try {
    const response = await $api('/cuentas/todas')
    if (Array.isArray(response)) {
      cuentas.value = response.map(cuenta => ({
        ...cuenta,
        activo: Boolean(cuenta.activo)
      }))
    }
  } catch (error) {
    console.error('Error al cargar cuentas:', error)
    showToast('Error al cargar las cuentas bancarias', 'error')
  } finally {
    cuentasCargando.value = false
  }
}

const abrirDetallesCuenta = (cuenta) => {
  cuentaSeleccionada.value = cuenta
  mostrarModalDetallesCuenta.value = true
}

const cerrarDetallesCuenta = () => {
  mostrarModalDetallesCuenta.value = false
  setTimeout(() => {
    cuentaSeleccionada.value = null
  }, 300)
}

const nuevaCuenta = () => {
  cuentaEditando.value = null
  formCuenta.value = {
    banco: '',
    beneficiario: '',
    num_cuenta: '',
    tipo: '',
    activo: true
  }
  mostrarModalNuevaCuenta.value = true
}

const editarCuenta = (cuenta) => {
  mostrarModalDetallesCuenta.value = false
  nextTick(() => {
    cuentaEditando.value = cuenta.id_cuenta
    formCuenta.value = {
      banco: cuenta.banco,
      beneficiario: cuenta.beneficiario,
      num_cuenta: cuenta.num_cuenta,
      tipo: cuenta.tipo,
      activo: cuenta.activo
    }
    mostrarModalNuevaCuenta.value = true
  })
}

const cerrarModalCuenta = () => {
  mostrarModalNuevaCuenta.value = false
  setTimeout(() => {
    cuentaEditando.value = null
    formCuenta.value = {
      banco: '',
      beneficiario: '',
      num_cuenta: '',
      tipo: '',
      activo: true
    }
  }, 300)
}

const guardarCuenta = async () => {
  guardandoCuenta.value = true
  try {
    const payload = {
      banco: formCuenta.value.banco,
      beneficiario: formCuenta.value.beneficiario,
      num_cuenta: formCuenta.value.num_cuenta,
      tipo: formCuenta.value.tipo,
      activo: formCuenta.value.activo ? 1 : 0
    }
    if (cuentaEditando.value) {
      await $api(`/cuentas/${cuentaEditando.value}`, {
        method: 'PUT',
        body: payload
      })
      showToast('Cuenta bancaria actualizada correctamente')
    } else {
      await $api('/cuentas', {
        method: 'POST',
        body: payload
      })
      showToast('Cuenta bancaria creada correctamente')
    }
    await cargarCuentas()
    cerrarModalCuenta()
  } catch (error) {
    console.error('Error al guardar cuenta:', error)
    showToast(error.data?.message || 'Error al guardar la cuenta bancaria', 'error')
  } finally {
    guardandoCuenta.value = false
  }
}

const confirmarEliminarCuenta = (cuenta) => {
  if (confirm(`¿Estás seguro de que deseas eliminar la cuenta ${cuenta.banco} - ${cuenta.num_cuenta}?`)) {
    eliminarCuenta(cuenta.id_cuenta)
  }
}

const eliminarCuenta = async (cuentaId) => {
  try {
    await $api(`/cuentas/${cuentaId}`, {
      method: 'DELETE'
    })
    showToast('Cuenta bancaria eliminada correctamente')
    await cargarCuentas()
    cerrarDetallesCuenta()
  } catch (error) {
    console.error('Error al eliminar cuenta:', error)
    showToast('Error al eliminar la cuenta bancaria', 'error')
  }
}

// ============================================
// CRUD - CIUDADES
// ============================================
const ciudades = ref([])
const ciudadesCargando = ref(false)
const ciudadEditando = ref(null)
const guardandoCiudad = ref(false)
const filtroBusquedaCiudades = ref('')

const formCiudad = ref({
  nombre: ''
})

const paginacionCiudades = reactive({
  paginaActual: 1,
  porPagina: 5
})

const ciudadesFiltradas = computed(() => {
  let resultado = [...ciudades.value]
  if (filtroBusquedaCiudades.value) {
    const busqueda = filtroBusquedaCiudades.value.toLowerCase()
    resultado = resultado.filter(ciudad => 
      ciudad.nombre.toLowerCase().includes(busqueda)
    )
  }
  return resultado
})

const paginacionCiudadesCalculada = computed(() => {
  const total = ciudadesFiltradas.value.length
  const totalPaginas = Math.ceil(total / paginacionCiudades.porPagina) || 1
  const paginaActual = Math.min(paginacionCiudades.paginaActual, totalPaginas)
  return { total, totalPaginas, paginaActual }
})

const ciudadesPaginadas = computed(() => {
  const inicio = (paginacionCiudadesCalculada.value.paginaActual - 1) * paginacionCiudades.porPagina
  const fin = inicio + paginacionCiudades.porPagina
  return ciudadesFiltradas.value.slice(inicio, fin)
})

const cambiarPaginaCiudades = (pagina) => {
  if (pagina < 1 || pagina > paginacionCiudadesCalculada.value.totalPaginas) return
  paginacionCiudades.paginaActual = pagina
}

const cargarCiudades = async () => {
  ciudadesCargando.value = true
  try {
    const response = await $api('/ciudad')
    if (Array.isArray(response)) {
      ciudades.value = response.map(c => ({
        id_ciudad: c.id_ciudad,
        nombre: c.nombre_ciudad
      }))
    }
  } catch (error) {
    console.error('Error al cargar ciudades:', error)
    showToast('Error al cargar las ciudades', 'error')
  } finally {
    ciudadesCargando.value = false
  }
}

const nuevaCiudad = () => {
  ciudadEditando.value = null
  formCiudad.value = { nombre: '' }
  mostrarModalNuevaCiudad.value = true
}

const editarCiudad = (ciudad) => {
  ciudadEditando.value = ciudad.id_ciudad
  formCiudad.value = { nombre: ciudad.nombre }
  mostrarModalNuevaCiudad.value = true
}

const cerrarModalCiudad = () => {
  mostrarModalNuevaCiudad.value = false
  setTimeout(() => {
    ciudadEditando.value = null
    formCiudad.value = { nombre: '' }
  }, 300)
}

const guardarCiudad = async () => {
  guardandoCiudad.value = true
  try {
    if (ciudadEditando.value) {
      await $api(`/ciudad/${ciudadEditando.value}`, {
        method: 'PUT',
        body: { nombre_ciudad: formCiudad.value.nombre }
      })
      showToast('Ciudad actualizada exitosamente')
    } else {
      await $api('/ciudad', {
        method: 'POST',
        body: { nombre_ciudad: formCiudad.value.nombre }
      })
      showToast('Ciudad creada exitosamente')
    }
    await cargarCiudades()
    cerrarModalCiudad()
  } catch (error) {
    console.error('Error al guardar ciudad:', error)
    showToast('Error al guardar la ciudad', 'error')
  } finally {
    guardandoCiudad.value = false
  }
}

const confirmarEliminarCiudad = (ciudad) => {
  if (confirm(`¿Estás seguro de que deseas eliminar la ciudad "${ciudad.nombre}"?`)) {
    eliminarCiudad(ciudad.id_ciudad)
  }
}

const eliminarCiudad = async (idCiudad) => {
  try {
    await $api(`/ciudad/${idCiudad}`, {
      method: 'DELETE'
    })
    showToast('Ciudad eliminada exitosamente')
    await cargarCiudades()
  } catch (error) {
    console.error('Error al eliminar ciudad:', error)
    showToast('Error al eliminar la ciudad', 'error')
  }
}

// ============================================
// GESTIÓN Y ENVÍO DE NOTIFICACIONES
// ============================================
const notificaciones = ref([])
const isLoadingNotifications = ref(false)
const mostrarFormularioCrear = ref(false)
const isCreatingNotification = ref(false)
const isDeletingRead = ref(false)
const isSendingNotification = ref(false)

const nuevaNotificacion = ref({
  titulo: ''
})

const notificacionAEnviar = ref(null)
const tipoEnvio = ref('')
const tipoEnvioObject = ref(null)
const idUsuarioDestino = ref(null)
const nombreRolDestinoObject = ref(null)
const ciudadSeleccionada = ref(null)
const rolCiudadSeleccionado = ref(null)

const mostrarModalEnvio = ref(false)
const mostrarModalNuevaCiudad = ref(false)
const mostrarModalNuevaCuenta = ref(false)
const mostrarModalDetallesCuenta = ref(false)

const tipoEnvioOptions = [
  { value: 'rol', label: 'Por rol' },
  { value: 'usuario', label: 'Usuario específico' },
  { value: 'ciudad', label: 'Usuarios de una ciudad' }, 
  { value: 'global', label: 'Todos los usuarios de la plataforma' }, 
]

const rolOptions = [
  { value: 'usuario', label: 'Clientes' },
  { value: 'tecnico', label: 'Técnicos' },
  { value: 'admin', label: 'Administradores' }
]

const getTipoEnvioLabel = (opt) => opt ? opt.label : ''
const getRolLabel = (opt) => opt ? opt.label : ''

watch(tipoEnvioObject, (newVal) => {
  tipoEnvio.value = newVal ? newVal.value : ''
})

watch(tipoEnvio, () => {
  idUsuarioDestino.value = null
  usuarioSeleccionado.value = null
  nombreRolDestinoObject.value = null
  ciudadSeleccionada.value = null
  rolCiudadSeleccionado.value = null
})

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cargarNotificaciones = async () => {
  isLoadingNotifications.value = true
  try {
    const res = await $api('/notificaciones/manuales')
    if (res.success) {
      notificaciones.value = res.data
    }
  } catch (error) {
    console.error('Error al cargar notificaciones:', error)
    showToast('Error al cargar las notificaciones', 'error')
  } finally {
    isLoadingNotifications.value = false
  }
}

const crearNotificacion = async () => {
  if (!nuevaNotificacion.value.titulo?.trim()) {
    showToast('Por favor escribe un título para la notificación', 'error')
    return
  }
  isCreatingNotification.value = true
  try {
    const res = await $api('/notificaciones', {
      method: 'POST',
      body: {
        tipo: 'manual',
        titulo: nuevaNotificacion.value.titulo.trim(),
        creado_por: auth.user?.nombre || 'Administrador'
      }
    })
    if (res.success) {
      showToast('Notificación creada exitosamente')
      nuevaNotificacion.value.titulo = ''
      mostrarFormularioCrear.value = false
      await cargarNotificaciones()
    }
  } catch (error) {
    console.error('Error al crear notificación:', error)
    showToast('Error al crear la notificación', 'error')
  } finally {
    isCreatingNotification.value = false
  }
}

const confirmarEliminarNotificacion = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta plantilla de notificación?')) {
    eliminarNotificacion(id)
  }
}

const eliminarNotificacion = async (id) => {
  try {
    const res = await $api(`/notificaciones/${id}`, {
      method: 'DELETE'
    })
    if (res.success) {
      showToast('Notificación eliminada exitosamente')
      await cargarNotificaciones()
    }
  } catch (error) {
    console.error('Error al eliminar notificación:', error)
    showToast('Error al eliminar la notificación', 'error')
  }
}

const eliminarNotificacionesLeidas = async () => {
  isDeletingRead.value = true
  try {
    const res = await $api('/notificaciones/eliminar/leidas', {
      method: 'DELETE'
    })
    if (res.success) {
      showToast(res.message || 'Notificaciones leídas eliminadas')
      await cargarNotificaciones()
    }
  } catch (error) {
    console.error('Error al eliminar leídas:', error)
    showToast('Error al eliminar notificaciones leídas', 'error')
  } finally {
    isDeletingRead.value = false
  }
}

const mostrarFormularioEnvio = (notif) => {
  notificacionAEnviar.value = notif
  mostrarModalEnvio.value = true
}

const cerrarModalEnvio = () => {
  mostrarModalEnvio.value = false
  notificacionAEnviar.value = null
  tipoEnvioObject.value = null
}

// Búsqueda de usuarios destinatarios
const terminoBusquedaUsuario = ref('')
const buscandoUsuarios = ref(false)
const usuariosEncontrados = ref([])
const usuarioSeleccionado = ref(null)

// Simple debounce implementation
function debounce(fn, delay) {
  let timeout
  return function(...args) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

const buscarUsuarios = debounce(async () => {
  if (!terminoBusquedaUsuario.value.trim()) {
    usuariosEncontrados.value = []
    return
  }
  buscandoUsuarios.value = true
  try {
    const res = await $api(`/usuarios/${encodeURIComponent(terminoBusquedaUsuario.value)}`)
    usuariosEncontrados.value = Array.isArray(res) ? res : [res]
  } catch (error) {
    console.error(error)
    usuariosEncontrados.value = []
  } finally {
    buscandoUsuarios.value = false
  }
}, 400)

watch(terminoBusquedaUsuario, () => {
  buscarUsuarios()
})

const seleccionarUsuario = (user) => {
  usuarioSeleccionado.value = user
  idUsuarioDestino.value = user.id_usuario
  usuariosEncontrados.value = []
  terminoBusquedaUsuario.value = ''
}

const limpiarUsuarioSeleccionado = () => {
  usuarioSeleccionado.value = null
  idUsuarioDestino.value = null
}

const puedeEnviar = computed(() => {
  if (!tipoEnvio.value) return false
  if (tipoEnvio.value === 'usuario' && !idUsuarioDestino.value) return false
  if (tipoEnvio.value === 'rol' && !nombreRolDestinoObject.value) return false
  if (tipoEnvio.value === 'ciudad' && !ciudadSeleccionada.value) return false
  return true
})

const enviarNotificacion = async () => {
  if (!puedeEnviar.value) return
  isSendingNotification.value = true
  try {
    const payload = {
      id_notificacion: notificacionAEnviar.value.id_notificacion
    }
    if (tipoEnvio.value === 'usuario') {
      payload.id_usuario = idUsuarioDestino.value
    } else if (tipoEnvio.value === 'rol') {
      payload.nombre_rol = nombreRolDestinoObject.value.value
    } else if (tipoEnvio.value === 'ciudad') {
      payload.id_ciudad = ciudadSeleccionada.value.id_ciudad
      if (rolCiudadSeleccionado.value) {
        payload.nombre_rol = rolCiudadSeleccionado.value.value
      }
    } else if (tipoEnvio.value === 'global') {
      payload.global = true
    }

    const res = await $api('/notificaciones/enviar', {
      method: 'POST',
      body: payload
    })

    if (res.success) {
      showToast(`Notificación enviada exitosamente a ${res.data.cantidad_destinatarios} destinatario(s)`)
      cerrarModalEnvio()
    } else {
      showToast(res.message || 'Error al enviar la notificación', 'error')
    }
  } catch (error) {
    console.error('Error al enviar:', error)
    showToast(error.data?.message || 'Error al enviar la notificación', 'error')
  } finally {
    isSendingNotification.value = false
  }
}

onMounted(() => {
  fetchConfigs()
  cargarCiudades()
  cargarCuentas()
  cargarNotificaciones()
})

useHead({
  title: 'Configuración Admin | RedPlus',
  meta: [
    { name: 'description', content: 'Panel de configuración de valores globales.' }
  ]
})
</script>

<style scoped>
@import 'vue-multiselect/dist/vue-multiselect.css';

input::placeholder {
  color: rgba(156, 163, 175, 0.3);
}

/* Estilos personalizados para vue-multiselect en tema oscuro */
.multiselect-admin-filter :deep(.multiselect__tags) {
  min-height: 48px;
  padding: 8px 40px 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  background-color: #070b14;
  font-size: 12px;
  color: #fff;
  display: flex;
  align-items: center;
}

.multiselect-admin-filter :deep(.multiselect__single) {
  background-color: transparent;
  color: #fff;
  font-size: 12px;
  margin-bottom: 8px;
}

.multiselect-admin-filter :deep(.multiselect__input) {
  background-color: transparent;
  color: #fff;
  font-size: 12px;
  margin-bottom: 8px;
}

.multiselect-admin-filter :deep(.multiselect__select) {
  height: 46px;
}

.multiselect-admin-filter :deep(.multiselect__content-wrapper) {
  background-color: #0d121f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}

.multiselect-admin-filter :deep(.multiselect__option) {
  background-color: transparent;
  color: #9ca3af;
  font-size: 12px;
}

.multiselect-admin-filter :deep(.multiselect__option--highlight) {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.multiselect-admin-filter :deep(.multiselect__option--selected) {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
  font-weight: bold;
}
</style>
