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
      
      <div class="flex items-center gap-2">
        <span class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg">
          <i class="fas fa-code-branch text-emerald-500/70 text-[9px]"></i>
          <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">v{{ appVersion }}</span>
        </span>
        <button @click="handleLogout" class="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors" title="Cerrar sesión">
          <i class="fas fa-sign-out-alt text-sm"></i>
        </button>
      </div>
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
                @click="confirmarEliminarNotificacion(notif)"
                class="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
                title="Eliminar Plantilla"
              >
                <i class="fas fa-trash text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 5: Notificaciones Push (Admin) -->
      <section class="border-t border-white/5 pt-8">
        <div class="mb-6">
          <h2 class="text-sm font-black text-emerald-500 uppercase tracking-widest">Notificaciones Push</h2>
          <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Recibe alertas push en este dispositivo</p>
        </div>

        <div class="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" :class="pushIsSubscribed ? 'bg-emerald-500/10' : 'bg-white/5'">
                {{ pushIsSubscribed ? '🔔' : '🔕' }}
              </div>
              <div>
                <h3 class="text-sm font-black text-white uppercase tracking-tight">Alertas en este dispositivo</h3>
                <p class="text-[9px] font-bold uppercase tracking-widest mt-0.5" :class="pushIsSubscribed ? 'text-emerald-400' : 'text-gray-500'">
                  {{ pushIsSubscribed ? 'Activas · Registrado en servidor' : 'Desactivadas · Sin registro' }}
                </p>
              </div>
            </div>

            <button
              v-if="pushIsSupported"
              @click="handleAdminTogglePush"
              :disabled="pushPermission === 'denied' || isTogglingAdminPush"
              class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none disabled:opacity-40"
              :class="pushIsSubscribed ? 'bg-emerald-500' : 'bg-white/10'"
            >
              <span v-if="isTogglingAdminPush" class="absolute inset-0 flex items-center justify-center">
                <i class="fas fa-circle-notch fa-spin text-[11px] text-white"></i>
              </span>
              <span v-else
                class="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform"
                :class="pushIsSubscribed ? 'translate-x-7' : 'translate-x-1'"
              />
            </button>
            <span v-else class="text-[9px] text-red-400 font-bold uppercase bg-red-500/10 px-3 py-1 rounded-lg">No soportado</span>
          </div>

          <p v-if="pushPermission === 'denied'" class="text-[10px] text-red-400 font-bold uppercase text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
            ⚠️ Permisos bloqueados. Habilítalos en ajustes del navegador.
          </p>

          <div v-if="!pushIsSubscribed && pushPermission !== 'denied' && pushIsSupported" class="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center">
            Activa las alertas para recibir notificaciones del sistema.
          </div>
        </div>
      </section>

      <!-- Section 6: Misión Especial -->
      <section class="border-t border-white/5 pt-8">
        <div class="mb-8 p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-[2.5rem] relative overflow-hidden">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-black text-white mb-2 uppercase tracking-tight">Misión Especial</h2>
              <p class="text-xs text-gray-400 font-medium leading-relaxed">
                Define la misión especial que aparecerá en el dashboard de los clientes hoy.
              </p>
            </div>
            <div class="text-4xl">{{ formMisionEspecial.emoji || '⚡' }}</div>
          </div>
        </div>

        <div class="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-sm">
          <!-- Lista de misiones existentes -->
          <div v-if="misionesEspeciales.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div v-for="mision in misionesEspeciales" :key="mision.id_mision" 
                 class="p-4 bg-[#0d121f] border border-white/5 rounded-2xl relative group overflow-hidden">
              <div class="flex items-center justify-between mb-3">
                <span class="text-2xl">{{ mision.emoji }}</span>
                <div class="flex gap-1.5">
                  <button v-if="mision.tipo_respuesta === 'seleccion' && mision.activa" 
                          @click="abrirModalFinalizar(mision)" 
                          class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 transition-all hover:text-white"
                          title="Elegir Respuesta Correcta">
                    <i class="fas fa-check-double text-[10px]"></i>
                  </button>
                  <button v-if="!mision.activa" 
                          @click="verGanadoresMision(mision)" 
                          class="w-7 h-7 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center hover:bg-violet-500 transition-all hover:text-white"
                          title="Ver Ganadores">
                    <i class="fas fa-trophy text-[10px]"></i>
                  </button>
                  <button @click="verEstadisticasMision(mision)" 
                          class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center hover:bg-amber-500 transition-all hover:text-white"
                          title="Ver Estadísticas">
                    <i class="fas fa-chart-pie text-[10px]"></i>
                  </button>
                  <button @click="prepararEdicionMision(mision)" class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 transition-all hover:text-white">
                    <i class="fas fa-edit text-[10px]"></i>
                  </button>
                  <button @click="eliminarMision(mision)" class="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 transition-all hover:text-white">
                    <i class="fas fa-trash text-[10px]"></i>
                  </button>
                </div>
              </div>
              <h3 class="text-xs font-black text-white uppercase tracking-tight truncate mb-1">{{ mision.titulo }}</h3>
              <p class="text-[9px] text-gray-500 line-clamp-2 mb-3 h-6">{{ mision.descripcion }}</p>
              <div class="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                <span class="text-[9px] font-black text-emerald-400 tracking-widest">+${{ parseFloat(mision.valor).toFixed(2) }}</span>
                <span :class="mision.activa ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'" class="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                  {{ mision.activa ? 'Activa' : 'Inactiva' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Botón Nueva Misión -->
          <button 
            @click="prepararNuevaMision"
            class="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:border-violet-500/50 hover:text-violet-400 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <i class="fas fa-plus"></i> Crear Nueva Misión Especial
          </button>
        </div>
      </section>
    </main>

    <!-- Modal: Formulario de Misión (Crear/Editar) -->
    <Transition name="fade-scale">
      <div v-if="mostrandoFormMision" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#070b14]/80 backdrop-blur-sm" @click="mostrandoFormMision = false"></div>
        <div class="bg-[#0d121f] border border-white/10 rounded-[2.5rem] p-6 w-full max-w-xl relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6 shadow-2xl">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                <i class="fas" :class="misionEditandoId ? 'fa-edit' : 'fa-plus'"></i>
              </div>
              <h3 class="text-sm font-black text-white uppercase tracking-widest">
                {{ misionEditandoId ? 'Editar Misión' : 'Nueva Misión Especial' }}
              </h3>
            </div>
            <button @click="mostrandoFormMision = false" class="w-8 h-8 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-colors flex items-center justify-center">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Titulo -->
            <div class="sm:col-span-2">
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Título de la Misión</label>
              <input 
                v-model="formMisionEspecial.titulo" 
                type="text"
                class="w-full bg-[#070b14] border border-white/5 rounded-2xl px-5 py-3 text-xs font-bold text-white focus:outline-none focus:border-violet-500/50 transition-all"
                placeholder="Ej: Comparte en tu estado de WhatsApp"
              >
            </div>

            <!-- Icono y Valor -->
            <div>
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Icono / Emoji</label>
              <input 
                v-model="formMisionEspecial.emoji" 
                type="text"
                class="w-full bg-[#070b14] border border-white/5 rounded-2xl px-5 py-3 text-center text-xl focus:outline-none focus:border-violet-500/50 transition-all"
                placeholder="⚡"
              >
            </div>

            <div>
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Recompensa ($)</label>
              <div class="relative">
                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-violet-400 font-black">$</span>
                <input 
                  v-model="formMisionEspecial.valor" 
                  type="number" step="0.01"
                  class="w-full bg-[#070b14] border border-white/5 rounded-2xl px-10 py-3 text-xs font-bold text-white focus:outline-none focus:border-violet-500/50 transition-all"
                  placeholder="10.00"
                >
              </div>
            </div>

            <!-- Tipo de Respuesta y Estado -->
            <div class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Tipo de Respuesta</label>
                <select 
                  v-model="formMisionEspecial.tipo_respuesta"
                  class="w-full bg-[#070b14] border border-white/5 rounded-2xl px-5 py-3 text-xs font-bold text-white focus:outline-none focus:border-violet-500/50 transition-all appearance-none"
                >
                  <option value="escrita">✍️ Respuesta Escrita</option>
                  <option value="seleccion">🔘 Selección Única (Lista)</option>
                </select>
              </div>
              <div>
                <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Estado de la Misión</label>
                <div 
                  @click="formMisionEspecial.activa = !formMisionEspecial.activa"
                  class="w-full bg-[#070b14] border border-white/5 rounded-2xl px-5 py-3 flex items-center justify-between cursor-pointer group transition-all"
                  :class="formMisionEspecial.activa ? 'border-emerald-500/30' : 'border-red-500/30'"
                >
                  <span class="text-xs font-bold uppercase tracking-widest" :class="formMisionEspecial.activa ? 'text-emerald-400' : 'text-red-400'">
                    {{ formMisionEspecial.activa ? 'Activa' : 'Inactiva' }}
                  </span>
                  <div class="w-10 h-5 rounded-full p-1 transition-all duration-300" 
                       :class="formMisionEspecial.activa ? 'bg-emerald-500' : 'bg-gray-700'">
                    <div class="w-3 h-3 bg-white rounded-full transition-all duration-300"
                         :class="{ 'translate-x-5': formMisionEspecial.activa }"></div>
                  </div>
                </div>
              </div>
            </div> 
          </div>

          <!-- Opciones si es tipo selección -->
          <div v-if="formMisionEspecial.tipo_respuesta === 'seleccion'" class="space-y-3 animate-fade-in bg-[#070b14] p-4 rounded-2xl border border-white/5">
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 mb-2 block">Opciones de Selección</label>
            <div v-for="(opc, index) in formMisionEspecial.opciones" :key="index" class="flex gap-2">
              <input 
                v-model="formMisionEspecial.opciones[index]" 
                type="text"
                class="flex-1 bg-[#0d121f] border border-white/5 rounded-xl px-4 py-2 text-[11px] font-medium text-white focus:outline-none focus:border-violet-500/50 transition-all"
                :placeholder="`Opción ${index + 1}`"
              >
              <button @click="removerOpcion(index)" class="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                <i class="fas fa-trash-alt text-[10px]"></i>
              </button>
            </div>
            <button 
              @click="agregarOpcion"
              class="text-[9px] font-black text-violet-400 uppercase tracking-widest hover:text-violet-300 transition-colors ml-2"
            >
              + Agregar Opción
            </button>
          </div>

          <!-- Descripcion -->
          <div>
            <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Instrucciones Detalladas</label>
            <textarea 
              v-model="formMisionEspecial.descripcion" 
              rows="4"
              class="w-full bg-[#070b14] border border-white/5 rounded-2xl px-5 py-4 text-xs font-medium text-gray-300 focus:outline-none focus:border-violet-500/50 transition-all resize-none"
              placeholder="Explica qué debe hacer el usuario y qué debe enviar como prueba..."
            ></textarea>
          </div>

          <div class="flex gap-3">
            <button 
              @click="mostrandoFormMision = false"
              class="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:text-white"
            >
              Cancelar
            </button>
            <button 
              @click="guardarMisionEspecial"
              :disabled="isSavingMision"
              class="flex-[2] py-3 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-violet-900/20 disabled:opacity-50"
            >
              <i v-if="isSavingMision" class="fas fa-circle-notch fa-spin"></i>
              <i v-else class="fas fa-save"></i>
              {{ misionEditandoId ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

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

    <!-- Modal: Finalizar Misión de Selección -->
    <Transition name="fade">
      <div v-if="mostrarModalFinalizar" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#070b14]/80 backdrop-blur-sm" @click="cerrarModalFinalizar"></div>
        <div v-if="misionAFinalizar" class="bg-[#0d121f] border border-white/10 rounded-[2.5rem] p-6 w-full max-w-sm relative z-10 space-y-4">
          <div class="text-center">
            <div class="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">{{ misionAFinalizar.emoji }}</span>
            </div>
            <h3 class="text-sm font-black text-white uppercase tracking-widest">Finalizar Misión</h3>
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{{ misionAFinalizar.titulo }}</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2 ml-2">Selecciona la Respuesta Correcta</label>
              <div class="space-y-2">
                <button 
                  v-for="(opcion, index) in misionAFinalizar.opciones" 
                  :key="index"
                  @click="respuestaCorrectaSeleccionada = opcion"
                  class="w-full p-4 rounded-2xl text-left text-xs font-bold transition-all border flex items-center justify-between group"
                  :class="respuestaCorrectaSeleccionada === opcion 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                    : 'bg-[#070b14] border-white/5 text-gray-400 hover:border-white/10'"
                >
                  <span>{{ opcion }}</span>
                  <div class="w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center"
                       :class="respuestaCorrectaSeleccionada === opcion ? 'border-emerald-500 bg-emerald-500' : 'border-white/10 group-hover:border-white/20'">
                    <i v-if="respuestaCorrectaSeleccionada === opcion" class="fas fa-check text-[8px] text-[#070b14]"></i>
                  </div>
                </button>
              </div>
            </div>

            <div class="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <p class="text-[9px] font-bold text-amber-400 uppercase leading-relaxed text-center">
                <i class="fas fa-exclamation-triangle mr-1"></i>
                Al confirmar, se premiará automáticamente a todos los usuarios que acertaron y se cerrará la misión.
              </p>
            </div>

            <div class="flex gap-2">
              <button 
                @click="cerrarModalFinalizar"
                class="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-xl hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button 
                @click="confirmarFinalizarMision"
                :disabled="!respuestaCorrectaSeleccionada || isFinalizingMision"
                class="flex-1 py-3 bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
              >
                <i v-if="isFinalizingMision" class="fas fa-circle-notch fa-spin text-xs"></i>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Estadísticas de Misión -->
    <Transition name="fade">
      <div v-if="mostrarModalStats" class="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
        <div class="absolute inset-0 bg-[#070b14]/90 backdrop-blur-md" @click="cerrarModalStats"></div>
        <div v-if="misionStats" class="bg-[#0d121f] border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-4 sm:p-6 w-full max-w-2xl relative z-10 flex flex-col h-[95vh] sm:h-auto sm:max-h-[90vh] mt-auto sm:mt-0">
          
          <!-- Header del Modal -->
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <span class="text-xl sm:text-2xl">{{ misionStats.mision.emoji }}</span>
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-black text-white uppercase tracking-widest">Estadísticas</h3>
                <p class="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 truncate max-w-[150px] sm:max-w-none">
                  {{ misionStats.mision.titulo }}
                </p>
              </div>
            </div>
            <button @click="cerrarModalStats" class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 text-gray-400 flex items-center justify-center hover:text-white transition-all">
              <i class="fas fa-times text-xs sm:text-base"></i>
            </button>
          </div>

          <!-- Contenido Scrolleable -->
          <div ref="scrollContainerStats" class="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-6">
            
            <!-- Resumen de Estadísticas -->
            <div class="grid grid-cols-3 gap-2 sm:gap-4">
              <div class="p-3 sm:p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl text-center">
                <p class="text-[7px] sm:text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Total</p>
                <p class="text-base sm:text-xl font-black text-white">{{ misionStats.stats.total }}</p>
              </div>
              <div class="p-3 sm:p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl sm:rounded-2xl text-center">
                <p class="text-[7px] sm:text-[9px] font-black text-emerald-500/50 uppercase tracking-widest mb-1">Aciertos</p>
                <p class="text-base sm:text-xl font-black text-emerald-400">{{ misionStats.stats.correctas }}</p>
              </div>
              <div class="p-3 sm:p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl sm:rounded-2xl text-center">
                <p class="text-[7px] sm:text-[9px] font-black text-amber-500/50 uppercase tracking-widest mb-1">Pend.</p>
                <p class="text-base sm:text-xl font-black text-amber-400">{{ misionStats.stats.pendientes }}</p>
              </div>
            </div>

            <!-- Gráfico de barras (Solo Selección) -->
            <div v-if="misionStats.mision.tipo_respuesta === 'seleccion' && Object.keys(misionStats.stats.respuestas).length > 0" class="space-y-3">
              <h4 class="text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Distribución</h4>
              <div class="space-y-3 bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/5">
                <div v-for="(count, resp) in misionStats.stats.respuestas" :key="resp" class="space-y-1.5">
                  <div class="flex justify-between text-[9px] sm:text-[10px] font-bold">
                    <span :class="resp === misionStats.mision.respuesta_correcta ? 'text-emerald-400' : 'text-gray-400'" class="truncate max-w-[70%]">
                      {{ resp }}
                      <i v-if="resp === misionStats.mision.respuesta_correcta" class="fas fa-check-circle ml-1"></i>
                    </span>
                    <span class="text-white shrink-0">{{ count }} ({{ Math.round((count / misionStats.stats.total) * 100) }}%)</span>
                  </div>
                  <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      class="h-full transition-all duration-500" 
                      :class="resp === misionStats.mision.respuesta_correcta ? 'bg-emerald-500' : 'bg-violet-500'"
                      :style="{ width: (count / misionStats.stats.total) * 100 + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones Masivas (Solo Escritura o Pendientes) -->
            <div v-if="reclamosSeleccionados.length > 0" 
                 class="sticky top-0 z-20 bg-[#0d121f] p-3 border border-violet-500/30 rounded-2xl flex items-center justify-between shadow-xl animate-fade-in">
              <span class="text-[9px] font-black text-violet-400 uppercase tracking-widest ml-2">
                {{ reclamosSeleccionados.length }} seleccionados
              </span>
              <div class="flex gap-2">
                <button @click="abrirConfirmacionMasiva('rechazado')" 
                        :disabled="isProcessingBulk"
                        class="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                  Rechazar
                </button>
                <button @click="abrirConfirmacionMasiva('aprobado')" 
                        :disabled="isProcessingBulk"
                        class="px-3 py-1.5 bg-emerald-500 text-[#070b14] rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all">
                  Aprobar
                </button>
              </div>
            </div>

            <!-- Lista de Respuestas Detallada -->
            <div class="space-y-3">
              <div class="flex items-center justify-between px-2">
                <h4 class="text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-widest">Participaciones</h4>
                
                <!-- Seleccionar Todos (Solo si hay pendientes) -->
                <button v-if="allReclamosStats.some(r => r.estado === 'pendiente')"
                        @click="toggleSelectAll" 
                        class="text-[8px] font-black uppercase tracking-widest transition-all"
                        :class="allSelected ? 'text-violet-400' : 'text-gray-500 hover:text-white'">
                  {{ allSelected ? 'Desmarcar todos' : 'Marcar pendientes' }}
                </button>
              </div>

              <div class="space-y-2">
                <div v-for="reclamo in allReclamosStats" :key="reclamo.id_reclamo" 
                     @click="reclamo.estado === 'pendiente' ? toggleSelect(reclamo.id_reclamo) : null"
                     class="p-3 bg-white/5 border rounded-xl flex items-center justify-between group transition-all"
                     :class="[
                       reclamo.estado === 'pendiente' ? 'cursor-pointer hover:border-white/20' : 'opacity-80',
                       reclamosSeleccionados.includes(reclamo.id_reclamo) ? 'border-violet-500/50 bg-violet-500/5' : 'border-white/5'
                     ]">
                  
                  <div class="flex items-center gap-3 min-w-0">
                    <!-- Checkbox si es seleccionable -->
                    <div v-if="reclamo.estado === 'pendiente'" 
                         class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                         :class="reclamosSeleccionados.includes(reclamo.id_reclamo) ? 'bg-violet-500 border-violet-500' : 'border-white/10'">
                      <i v-if="reclamosSeleccionados.includes(reclamo.id_reclamo)" class="fas fa-check text-[8px] text-white"></i>
                    </div>

                    <div class="w-8 h-8 rounded-lg bg-white/10 overflow-hidden shrink-0">
                      <img v-if="reclamo.usuario.imagen_url" :src="reclamo.usuario.imagen_url" class="w-full h-full object-cover">
                      <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase">
                        {{ reclamo.usuario.nombre.substring(0, 1) }}
                      </div>
                    </div>
                    <div class="min-w-0">
                      <p class="text-[10px] sm:text-[11px] font-bold text-white truncate">{{ reclamo.usuario.nombre }}</p>
                      <p class="text-[8px] sm:text-[9px] text-gray-500 truncate">{{ reclamo.usuario.email }}</p>
                    </div>
                  </div>

                  <div class="text-right shrink-0 ml-2">
                    <div class="flex flex-col items-end gap-1">
                      <span class="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider max-w-[80px] truncate"
                            :class="{
                              'bg-emerald-500/10 text-emerald-500': reclamo.estado === 'aprobado',
                              'bg-red-500/10 text-red-500': reclamo.estado === 'rechazado',
                              'bg-amber-500/10 text-amber-500': reclamo.estado === 'pendiente'
                            }">
                        {{ reclamo.respuesta || 'Sin respuesta' }}
                      </span>
                      
                      <!-- Botones de acción individual (Solo si es tipo escrita y está pendiente) -->
                      <div v-if="reclamo.estado === 'pendiente' && misionStats.mision.tipo_respuesta === 'escrita'" 
                           class="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button @click.stop="procesarMasivoIndividual(reclamo.id_reclamo, 'rechazado')" 
                                class="w-5 h-5 rounded bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white">
                          <i class="fas fa-times text-[8px]"></i>
                        </button>
                        <button @click.stop="procesarMasivoIndividual(reclamo.id_reclamo, 'aprobado')" 
                                class="w-5 h-5 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white">
                          <i class="fas fa-check text-[8px]"></i>
                        </button>
                      </div>
                      <p class="text-[7px] text-gray-600 mt-1 uppercase font-bold">{{ formatearFecha(reclamo.fecha) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Load More Indicator -->
              <div v-if="hasMoreStats || isLoadingMoreStats" class="flex items-center justify-center py-4">
                <div v-if="isLoadingMoreStats" class="flex items-center gap-2">
                  <div class="w-4 h-4 border border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                  <span class="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Cargando más...</span>
                </div>
                <button v-else-if="hasMoreStats" 
                        @click="loadMoreReclamos" 
                        class="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[9px] rounded-xl hover:text-white transition-all">
                  Cargar más
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Confirmación de Procesamiento Masivo -->
    <Transition name="fade-scale">
      <div v-if="mostrarModalConfirmBulk" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#070b14]/80 backdrop-blur-sm" @click="mostrarModalConfirmBulk = false"></div>
        <div class="bg-[#0d121f] border border-white/10 rounded-[2.5rem] p-6 w-full max-w-sm relative z-10 space-y-6 shadow-2xl">
          <div class="text-center">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                 :class="bulkActionType === 'aprobado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'">
              <i class="fas" :class="bulkActionType === 'aprobado' ? 'fa-check-double text-2xl' : 'fa-times-circle text-2xl'"></i>
            </div>
            <h3 class="text-sm font-black text-white uppercase tracking-widest">
              Confirmar {{ bulkActionType }}
            </h3>
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 leading-relaxed">
              ¿Estás seguro de que deseas <strong>{{ bulkActionType }}</strong> los <strong>{{ reclamosSeleccionados.length }}</strong> reclamos seleccionados?
              <span v-if="misionStats && misionStats.mision.tipo_respuesta === 'escrita' && bulkActionType === 'aprobado'" class="block mt-2 text-emerald-400">
                <i class="fas fa-info-circle mr-1"></i>
                Al confirmar, se cerrará la misión y se distribuirá el premio equitativamente entre los ganadores.
              </span>
            </p>
          </div>

          <div class="flex gap-3">
            <button @click="mostrarModalConfirmBulk = false" 
                    class="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[9px] rounded-xl hover:text-white transition-all">
              Cancelar
            </button>
            <button @click="confirmarAccionBulk" 
                    :disabled="isProcessingBulk"
                    class="flex-1 py-3 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all flex items-center justify-center gap-2"
                    :class="bulkActionType === 'aprobado' ? 'bg-emerald-500 text-[#070b14] hover:bg-emerald-400' : 'bg-red-500 text-white hover:bg-red-400'">
              <i v-if="isProcessingBulk" class="fas fa-circle-notch fa-spin"></i>
              {{ bulkActionType === 'aprobado' ? 'Aprobar todo' : 'Rechazar todo' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Confirmación Eliminar Misión -->
    <Transition name="fade-scale">
      <div v-if="mostrarModalConfirmEliminarMision" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#070b14]/80 backdrop-blur-sm" @click="mostrarModalConfirmEliminarMision = false"></div>
        <div v-if="misionAEliminar" class="bg-[#0d121f] border border-white/10 rounded-[2.5rem] p-6 w-full max-w-sm relative z-10 space-y-6 shadow-2xl">
          <div class="text-center">
            <div class="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-trash-alt text-red-500 text-2xl"></i>
            </div>
            <h3 class="text-sm font-black text-white uppercase tracking-widest">Eliminar Misión</h3>
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 leading-relaxed">
              ¿Estás seguro de que deseas eliminar la misión <br>
              <strong class="text-white">"{{ misionAEliminar.titulo }}"</strong>?<br>
              <span class="text-red-500/70 mt-1 block italic text-[8px]">Esta acción no se puede deshacer.</span>
            </p>
          </div>

          <div class="flex gap-3">
            <button @click="mostrarModalConfirmEliminarMision = false" 
                    class="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[9px] rounded-xl hover:text-white transition-all">
              Cancelar
            </button>
            <button @click="confirmarEliminarMision" 
                    class="flex-1 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-red-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Confirmación Eliminar Notificación -->
    <Transition name="fade-scale">
      <div v-if="mostrarModalConfirmEliminarNotif" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#070b14]/80 backdrop-blur-sm" @click="mostrarModalConfirmEliminarNotif = false"></div>
        <div v-if="notifAEliminar" class="bg-[#0d121f] border border-white/10 rounded-[2.5rem] p-6 w-full max-w-sm relative z-10 space-y-6 shadow-2xl">
          <div class="text-center">
            <div class="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-trash-alt text-red-500 text-2xl"></i>
            </div>
            <h3 class="text-sm font-black text-white uppercase tracking-widest">Eliminar Notificación</h3>
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 leading-relaxed">
              ¿Estás seguro de que deseas eliminar la plantilla <br>
              <strong class="text-white">"{{ notifAEliminar.titulo }}"</strong>?<br>
              <span class="text-red-500/70 mt-1 block italic text-[8px]">Esta acción no se puede deshacer.</span>
            </p>
          </div>

          <div class="flex gap-3">
            <button @click="mostrarModalConfirmEliminarNotif = false" 
                    class="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[9px] rounded-xl hover:text-white transition-all">
              Cancelar
            </button>
            <button @click="confirmarEliminarNotificacionDefinitivo" 
                    class="flex-1 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-red-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Ganadores de la Misión Especial -->
    <Transition name="fade">
      <div v-if="mostrarModalGanadores" class="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
        <div class="absolute inset-0 bg-[#070b14]/90 backdrop-blur-md" @click="cerrarModalGanadores"></div>
        <div v-if="misionGanadores" class="bg-[#0d121f] border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-4 sm:p-6 w-full max-w-2xl relative z-10 flex flex-col h-[95vh] sm:h-auto sm:max-h-[90vh] mt-auto sm:mt-0">
          
          <!-- Header del Modal -->
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-violet-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <span class="text-xl sm:text-2xl">{{ misionGanadores.mision.emoji }}</span>
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-black text-white uppercase tracking-widest">Ganadores</h3>
                <p class="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 truncate max-w-[150px] sm:max-w-none">
                  {{ misionGanadores.mision.titulo }}
                </p>
              </div>
            </div>
            <button @click="cerrarModalGanadores" class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 text-gray-400 flex items-center justify-center hover:text-white transition-all">
              <i class="fas fa-times text-xs sm:text-base"></i>
            </button>
          </div>

          <!-- Contenido Scrolleable -->
          <div class="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-6">
            
            <!-- Resumen de Recompensas -->
            <div class="grid grid-cols-3 gap-2 sm:gap-4">
              <div class="p-3 sm:p-4 bg-violet-500/5 border border-violet-500/10 rounded-xl sm:rounded-2xl text-center">
                <p class="text-[7px] sm:text-[9px] font-black text-violet-500/50 uppercase tracking-widest mb-1">Total</p>
                <p class="text-base sm:text-xl font-black text-violet-400">${{ parseFloat(misionGanadores.valorTotal).toFixed(2) }}</p>
              </div>
              <div class="p-3 sm:p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl sm:rounded-2xl text-center">
                <p class="text-[7px] sm:text-[9px] font-black text-emerald-500/50 uppercase tracking-widest mb-1">Ganadores</p>
                <p class="text-base sm:text-xl font-black text-emerald-400">{{ misionGanadores.totalGanadores }}</p>
              </div>
              <div class="p-3 sm:p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl sm:rounded-2xl text-center">
                <p class="text-[7px] sm:text-[9px] font-black text-amber-500/50 uppercase tracking-widest mb-1">Por Ganador</p>
                <p class="text-base sm:text-xl font-black text-amber-400">${{ parseFloat(misionGanadores.recompensaPorGanador).toFixed(2) }}</p>
              </div>
            </div>

            <!-- Lista de Ganadores -->
            <div class="space-y-3" v-if="misionGanadores.totalGanadores > 0">
              <h4 class="text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Lista de Ganadores</h4>
              <div class="space-y-2">
                <div v-for="(ganador, index) in misionGanadores.ganadores" :key="ganador.id_reclamo" 
                     class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group transition-all">
                  
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span class="text-xs font-black text-white">#{{ index + 1 }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                        <img v-if="ganador.usuario?.imagen_url" :src="ganador.usuario.imagen_url" class="w-full h-full object-cover">
                        <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase">
                          {{ ganador.usuario?.nombre?.charAt(0) || 'U' }}
                        </div>
                      </div>
                      <div class="min-w-0">
                        <p class="text-[10px] sm:text-[11px] font-bold text-white truncate">{{ ganador.usuario?.nombre || 'Usuario' }}</p>
                        <p class="text-[8px] sm:text-[9px] text-gray-500 truncate">{{ ganador.usuario?.email || '' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="text-right flex-shrink-0 ml-2">
                    <div class="flex flex-col items-end gap-1">
                      <span class="text-[9px] sm:text-[10px] font-black text-violet-400 tracking-widest">
                        +${{ parseFloat(ganador.monto_otorgado || ganador.monto).toFixed(2) }}
                      </span>
                      <span v-if="ganador.respuesta" class="text-[7px] sm:text-[8px] text-gray-500 font-bold">
                        R: {{ ganador.respuesta }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje si no hay ganadores -->
            <div v-else class="text-center py-8">
              <div class="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-trophy text-gray-500 text-2xl"></i>
              </div>
              <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No hay ganadores para esta misión</p>
            </div>

            <!-- Lista de Perdedores (opcional) -->
            <div class="space-y-3" v-if="misionGanadores.totalPerdedores > 0">
              <h4 class="text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">
                Participantes no premiados ({{ misionGanadores.totalPerdedores }})
              </h4>
              <div class="space-y-2">
                <div v-for="perdedor in misionGanadores.perdedores" :key="perdedor.id_reclamo" 
                     class="p-2 bg-white/2 border border-white/3 rounded-lg flex items-center justify-between opacity-60">
                  
                  <div class="flex items-center gap-2 min-w-0">
                    <div class="w-6 h-6 rounded-md bg-white/10 overflow-hidden flex-shrink-0">
                      <img v-if="perdedor.usuario?.imagen_url" :src="perdedor.usuario.imagen_url" class="w-full h-full object-cover">
                      <div v-else class="w-full h-full flex items-center justify-center text-[9px] text-gray-500 font-bold uppercase">
                        {{ perdedor.usuario?.nombre?.charAt(0) || 'U' }}
                      </div>
                    </div>
                    <div class="min-w-0">
                      <p class="text-[9px] font-bold text-gray-400 truncate">{{ perdedor.usuario?.nombre || 'Usuario' }}</p>
                    </div>
                  </div>

                  <div class="text-right flex-shrink-0 ml-2">
                    <span class="text-[7px] text-gray-600 font-bold">
                      R: {{ perdedor.respuesta }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>


    <footer class="text-center py-6 pb-2">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
        <i class="fas fa-code-branch text-emerald-500/60 text-[9px]"></i>
        <span class="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">PubliGana Admin v{{ appVersion }}</span>
      </div>
    </footer>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import BottomNav from '~/components/footers/BottomNav.vue'
import Multiselect from 'vue-multiselect'
import { useAuthStore } from '~/middleware/auth.store'
import { usePushNotifications } from '~/composables/usePushNotifications'

const { $api } = useNuxtApp()
const auth = useAuthStore()
const config = useRuntimeConfig()
const appVersion = config.public.appVersion || '1.0.0'

// Push notifications state for admin device
const {
  subscribe: pushSubscribe,
  unsubscribe: pushUnsubscribe,
  isSubscribed: pushIsSubscribed,
  isChecking: pushIsChecking,
  isSupported: pushIsSupported,
  permission: pushPermission,
  checkSubscription: pushCheckSubscription
} = usePushNotifications()

const isTogglingAdminPush = ref(false)

const handleAdminTogglePush = async () => {
  if (pushIsSubscribed.value) {
    isTogglingAdminPush.value = true
    try {
      await pushUnsubscribe()
      showToast('Notificaciones desactivadas. Registro eliminado de BD.', 'info')
    } catch (e) {
      showToast('Error al desactivar notificaciones.', 'error')
    } finally {
      isTogglingAdminPush.value = false
    }
  } else {
    if (pushPermission.value === 'denied') return
    isTogglingAdminPush.value = true
    try {
      const res = await pushSubscribe()
      if (res?.success) {
        showToast('¡Notificaciones activadas y registradas en BD!', 'success')
      } else if (res?.error === 'denied') {
        showToast('Permisos denegados. Actívalos en los ajustes del navegador.', 'error')
      } else {
        showToast('No se pudieron activar las notificaciones.', 'error')
      }
    } catch (e) {
      showToast('Error al activar notificaciones.', 'error')
    } finally {
      isTogglingAdminPush.value = false
    }
  }
}

const handleLogout = async () => {
  await auth.logout()
  navigateTo('/')
}

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
    } else {
      showToast(res.message || 'No se pudieron cargar las plantillas de notificación', 'error')
    }
  } catch (error) {
    console.error('Error al cargar notificaciones:', error)
    const errorMsg = error.data?.message || 'Error de red al conectar con el servidor de notificaciones'
    showToast(errorMsg, 'error')
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

const confirmarEliminarNotificacion = (notif) => {
  notifAEliminar.value = notif
  mostrarModalConfirmEliminarNotif.value = true
}

const confirmarEliminarNotificacionDefinitivo = async () => {
  if (!notifAEliminar.value) return
  
  try {
    const res = await $api(`/notificaciones/${notifAEliminar.value.id_notificacion}`, {
      method: 'DELETE'
    })
    if (res.success) {
      showToast('Notificación eliminada exitosamente')
      mostrarModalConfirmEliminarNotif.value = false
      await cargarNotificaciones()
    }
  } catch (error) {
    console.error('Error al eliminar notificación:', error)
    const errorMsg = error.data?.message || 'Error al eliminar la notificación'
    showToast(errorMsg, 'error')
  } finally {
    notifAEliminar.value = null
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

// Misión Especial
const isSavingMision = ref(false)
const misionesEspeciales = ref([])
const mostrandoFormMision = ref(false)
const misionEditandoId = ref(null)
const mostrarModalConfirmEliminarMision = ref(false)
const misionAEliminar = ref(null)

// Notificaciones
const mostrarModalConfirmEliminarNotif = ref(false)
const notifAEliminar = ref(null)

// Finalizar Misión de Selección
const mostrarModalFinalizar = ref(false)
const misionAFinalizar = ref(null)
const respuestaCorrectaSeleccionada = ref('')
const isFinalizingMision = ref(false)

// Estadísticas de Misión
const mostrarModalStats = ref(false)
const misionStats = ref(null)
const isLoadingStats = ref(false)
const paginaStats = ref(1)
const limiteStats = 10
const totalReclamosStats = ref(0)
const reclamosSeleccionados = ref([])
const isProcessingBulk = ref(false)

// Infinite scroll for stats
const allReclamosStats = ref([])
const hasMoreStats = ref(true)
const isLoadingMoreStats = ref(false)
const scrollContainerStats = ref(null)

// Modal de Confirmación
const mostrarModalConfirmBulk = ref(false)
const bulkActionType = ref('') // 'aprobado' o 'rechazado'

// Modal de Ganadores
const mostrarModalGanadores = ref(false)
const misionGanadores = ref(null)
const isLoadingGanadores = ref(false)

const allSelected = computed(() => {
  if (!misionStats.value?.reclamos?.length) return false
  const pendientes = misionStats.value.reclamos.filter(r => r.estado === 'pendiente')
  if (pendientes.length === 0) return false
  return pendientes.every(r => reclamosSeleccionados.value.includes(r.id_reclamo))
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    reclamosSeleccionados.value = []
  } else {
    const pendientes = misionStats.value.reclamos
      .filter(r => r.estado === 'pendiente')
      .map(r => r.id_reclamo)
    reclamosSeleccionados.value = pendientes
  }
}

const toggleSelect = (id) => {
  const index = reclamosSeleccionados.value.indexOf(id)
  if (index > -1) {
    reclamosSeleccionados.value.splice(index, 1)
  } else {
    reclamosSeleccionados.value.push(id)
  }
}

const abrirConfirmacionMasiva = (estado) => {
  if (reclamosSeleccionados.value.length === 0) return
  bulkActionType.value = estado
  mostrarModalConfirmBulk.value = true
}

const confirmarAccionBulk = async () => {
  console.log('=== confirmarAccionBulk STARTED ===')
  console.log('Variables:', {
    reclamosSeleccionados: reclamosSeleccionados.value,
    bulkActionType: bulkActionType.value,
    misionStats: misionStats.value
  })

  // Check if misionStats is properly initialized
  if (!misionStats.value || !misionStats.value.mision) {
    console.error('Error: misionStats or misionStats.mision is null/undefined', misionStats.value)
    showToast('Error: No se puede procesar, no hay misión seleccionada', 'error')
    return
  }

  const currentMision = misionStats.value.mision
  console.log('Current mission:', {
    id_mision: currentMision.id_mision,
    tipo_respuesta: currentMision.tipo_respuesta
  })

  isProcessingBulk.value = true
  try {
    console.log('Calling /misiones/admin/especiales/reclamos/bulk with:', {
      ids: reclamosSeleccionados.value,
      estado: bulkActionType.value
    })

    const res = await $api('/misiones/admin/especiales/reclamos/bulk', {
      method: 'POST',
      body: {
        ids: reclamosSeleccionados.value,
        estado: bulkActionType.value
      }
    })

    console.log('Bulk response:', res)
    
    if (res.success) {
      console.log('Bulk action SUCCESS')

      // If it's a written response mission and we approved claims, finalize the mission
      if (currentMision.tipo_respuesta === 'escrita' && bulkActionType.value === 'aprobado') {
        const missionId = currentMision.id_mision
        console.log('Now finalizing mission:', missionId)
        // Close bulk confirm modal
        mostrarModalConfirmBulk.value = false
        
        // Now finalize the mission
        isFinalizingMision.value = true
        try {
          console.log('Calling finalizar-escrita endpoint...')
          const finalizeRes = await $api('/misiones/admin/especiales/finalizar-escrita', {
            method: 'POST',
            body: { id_mision: missionId }
          })

          console.log('Finalize mission response:', finalizeRes)
          
          if (finalizeRes.success) {
            showToast(finalizeRes.message || 'Misión finalizada y premios distribuidos')
            reclamosSeleccionados.value = []
            cerrarModalStats() // Close the stats modal
            await cargarMisionesEspeciales()
            
            // Show the winners modal automatically
            if (finalizeRes.data && finalizeRes.data.totalGanadores >= 0) {
              setTimeout(async () => {
                await verGanadoresMision({ id_mision: missionId })
              }, 500)
            }
          } else {
            console.error('Finalize mission failed:', finalizeRes.error)
            showToast(finalizeRes.error || 'Error al finalizar misión', 'error')
          }
        } catch (e) {
          console.error('Error finalizando misión (catch):', e)
          showToast('Error de conexión al finalizar misión', 'error')
        } finally {
          isFinalizingMision.value = false
        }
      } else {
        console.log('Regular flow (not written response or reject)')
        // Regular flow for selection missions or reject actions
        showToast(res.message)
        reclamosSeleccionados.value = []
        mostrarModalConfirmBulk.value = false
        await verEstadisticasMision(currentMision, paginaStats.value)
      }
    } else {
      console.error('Bulk response success=false:', res.error)
      showToast(res.error || 'Error al procesar reclamos', 'error')
    }
  } catch (e) {
    console.error('confirmarAccionBulk CATCH ERROR:', e)
    showToast(e.message || 'Error al procesar reclamos', 'error')
  } finally {
    isProcessingBulk.value = false
    console.log('=== confirmarAccionBulk COMPLETED ===')
  }
}

const procesarMasivoIndividual = async (id, estado) => {
  reclamosSeleccionados.value = [id]
  abrirConfirmacionMasiva(estado)
}

const formMisionEspecial = ref({
  titulo: '',
  descripcion: '',
  emoji: '⚡',
  activa: true,
  valor: 0,
  tipo_respuesta: 'escrita',
  opciones: []
})

const cargarMisionesEspeciales = async () => {
  try {
    const res = await $api('/misiones/admin/especiales')
    if (res.success) {
      misionesEspeciales.value = res.data
    }
  } catch (e) {
    console.error('Error al cargar misiones especiales:', e)
  }
}

const prepararNuevaMision = () => {
  misionEditandoId.value = null
  formMisionEspecial.value = {
    titulo: '',
    descripcion: '',
    emoji: '⚡',
    activa: true,
    valor: 0,
    tipo_respuesta: 'escrita',
    opciones: []
  }
  mostrandoFormMision.value = true
}

const prepararEdicionMision = (mision) => {
  misionEditandoId.value = mision.id_mision
  formMisionEspecial.value = {
    titulo: mision.titulo,
    descripcion: mision.descripcion,
    emoji: mision.emoji,
    activa: mision.activa,
    valor: mision.valor,
    tipo_respuesta: mision.tipo_respuesta,
    opciones: Array.isArray(mision.opciones) ? [...mision.opciones] : []
  }
  mostrandoFormMision.value = true
}

const agregarOpcion = () => {
  formMisionEspecial.value.opciones.push('')
}

const removerOpcion = (index) => {
  formMisionEspecial.value.opciones.splice(index, 1)
}

const guardarMisionEspecial = async () => {
  if (!formMisionEspecial.value.titulo || !formMisionEspecial.value.descripcion) {
    showToast('Título e instrucciones son obligatorios', 'error')
    return
  }

  isSavingMision.value = true
  try {
    const url = misionEditandoId.value 
      ? `/misiones/admin/especiales/${misionEditandoId.value}`
      : '/misiones/admin/especiales'
    
    const res = await $api(url, {
      method: misionEditandoId.value ? 'PUT' : 'POST',
      body: formMisionEspecial.value
    })

    if (res.success) {
      showToast(misionEditandoId.value ? 'Misión actualizada' : 'Misión creada')
      mostrandoFormMision.value = false
      cargarMisionesEspeciales()
    }
  } catch (e) {
    showToast('Error al guardar misión', 'error')
  } finally {
    isSavingMision.value = false
  }
}

const eliminarMision = (mision) => {
  misionAEliminar.value = mision
  mostrarModalConfirmEliminarMision.value = true
}

const confirmarEliminarMision = async () => {
  if (!misionAEliminar.value) return
  try {
    const res = await $api(`/misiones/admin/especiales/${misionAEliminar.value.id_mision}`, { method: 'DELETE' })
    if (res.success) {
      showToast('Misión eliminada')
      mostrarModalConfirmEliminarMision.value = false
      cargarMisionesEspeciales()
    }
  } catch (e) {
    showToast('Error al eliminar', 'error')
  } finally {
    misionAEliminar.value = null
  }
}

// Finalizar Misión de Selección
const abrirModalFinalizar = (mision) => {
  misionAFinalizar.value = mision
  respuestaCorrectaSeleccionada.value = ''
  mostrarModalFinalizar.value = true
}

const cerrarModalFinalizar = () => {
  mostrarModalFinalizar.value = false
  setTimeout(() => {
    misionAFinalizar.value = null
    respuestaCorrectaSeleccionada.value = ''
  }, 300)
}

const confirmarFinalizarMision = async () => {
  if (!misionAFinalizar.value || !respuestaCorrectaSeleccionada.value) return
  
  // Store the mission ID before closing the modal
  const missionId = misionAFinalizar.value.id_mision
  
  isFinalizingMision.value = true
  try {
    const res = await $api('/misiones/admin/especiales/finalizar', {
      method: 'POST',
      body: {
        id_mision: missionId,
        respuesta_correcta: respuestaCorrectaSeleccionada.value
      }
    })
    
    if (res.success) {
      showToast(res.message || 'Misión finalizada y usuarios premiados')
      cerrarModalFinalizar()
      await cargarMisionesEspeciales()
      
      // Show the winners modal automatically
      if (res.data && res.data.totalGanadores >= 0) {
        // Wait a bit for the mission to update, then fetch winners
        setTimeout(async () => {
          await verGanadoresMision({ id_mision: missionId })
        }, 500)
      }
    } else {
      showToast(res.error || 'Error al finalizar misión', 'error')
    }
  } catch (e) {
    console.error('Error finalizando misión:', e)
    showToast('Error de conexión al finalizar misión', 'error')
  } finally {
    isFinalizingMision.value = false
  }
}

const verEstadisticasMision = async (mision, pagina = 1) => {
  console.log('=== verEstadisticasMision STARTED ===')
  console.log('Input mission:', mision, 'Pagina:', pagina)
  
  // If it's the first page, reset everything
  if (pagina === 1) {
    allReclamosStats.value = []
    hasMoreStats.value = true
    paginaStats.value = 1
  }

  // Prevent duplicate requests
  if (pagina > 1 && (isLoadingStats.value || isLoadingMoreStats.value)) {
    return
  }

  if (pagina === 1) {
    isLoadingStats.value = true
  } else {
    isLoadingMoreStats.value = true
  }

  try {
    const offset = (pagina - 1) * limiteStats
    const res = await $api(`/misiones/admin/especiales/${mision.id_mision}/stats?limit=${limiteStats}&offset=${offset}`)
    console.log('verEstadisticasMision response:', res)
    if (res.success) {
      // Only update misionStats once on the first page
      if (pagina === 1) {
        misionStats.value = res.data
        totalReclamosStats.value = res.data.total
      }

      // Append new reclamos to the allReclamosStats
      allReclamosStats.value = [...allReclamosStats.value, ...res.data.reclamos]

      // Check if there are more to load
      hasMoreStats.value = allReclamosStats.value < totalReclamosStats.value

      paginaStats.value = pagina
      console.log('allReclamosStats.value:', allReclamosStats.value.length, 'total:', totalReclamosStats.value, 'hasMore:', hasMoreStats.value)
      mostrarModalStats.value = true
    }
  } catch (e) {
    console.error('verEstadisticasMision error:', e)
    showToast('Error al cargar estadísticas', 'error')
  } finally {
    isLoadingStats.value = false
    isLoadingMoreStats.value = false
  }
}

const loadMoreReclamos = () => {
  if (!hasMoreStats.value || isLoadingMoreStats.value || isLoadingStats.value) {
    return
  }
  if (misionStats.value && misionStats.value.mision) {
    verEstadisticasMision(misionStats.value.mision, paginaStats.value + 1)
  }
}

const cerrarModalStats = () => {
  mostrarModalStats.value = false
  setTimeout(() => {
    misionStats.value = null
    paginaStats.value = 1
    totalReclamosStats.value = 0
    reclamosSeleccionados.value = []
    allReclamosStats.value = []
    hasMoreStats.value = true
    isLoadingMoreStats.value = false
  }, 300)
}

const verGanadoresMision = async (mision) => {
  isLoadingGanadores.value = true
  try {
    const res = await $api(`/misiones/admin/especiales/${mision.id_mision}/ganadores`)
    if (res.success) {
      misionGanadores.value = res.data
      mostrarModalGanadores.value = true
    } else {
      showToast(res.error || 'No se pudo cargar la lista de ganadores', 'error')
    }
  } catch (e) {
    console.error('Error cargando ganadores:', e)
    let errorMsg = 'Error al cargar la lista de ganadores'
    if (e.response?.status === 404) {
      errorMsg = 'No se encontró la información de ganadores. Intente recargar la página.'
    } else if (e.response?.status === 403) {
      errorMsg = 'No tienes permisos para ver los ganadores'
    }
    showToast(errorMsg, 'error')
  } finally {
    isLoadingGanadores.value = false
  }
}

const cerrarModalGanadores = () => {
  mostrarModalGanadores.value = false
  setTimeout(() => {
    misionGanadores.value = null
  }, 300)
}

const totalPaginasStats = computed(() => {
  return Math.ceil(totalReclamosStats.value / limiteStats)
})

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
    const res = await $api(`/usuarios?search=${encodeURIComponent(terminoBusquedaUsuario.value)}`)
    usuariosEncontrados.value = res.success ? res.data : []
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

const handleStatsScroll = () => {
  if (!scrollContainerStats.value) return
  
  const { scrollTop, scrollHeight, clientHeight } = scrollContainerStats.value
  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100 // 100px threshold
  
  if (isNearBottom) {
    loadMoreReclamos()
  }
}

watch(mostrarModalStats, (newVal) => {
  if (newVal) {
    // When modal opens, add the scroll listener
    nextTick(() => {
      if (scrollContainerStats.value) {
        scrollContainerStats.value.addEventListener('scroll', handleStatsScroll)
      }
    })
  } else {
    // When modal closes, remove the scroll listener
    if (scrollContainerStats.value) {
      scrollContainerStats.value.removeEventListener('scroll', handleStatsScroll)
    }
  }
})

onBeforeUnmount(() => {
  // Clean up scroll listener when component unmounts
  if (scrollContainerStats.value) {
    scrollContainerStats.value.removeEventListener('scroll', handleStatsScroll)
  }
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
  cargarMisionesEspeciales()

  // Check push subscription status — must be called explicitly since each
  // composable call creates a fresh instance with isChecking = true
  pushCheckSubscription()
})

useHead({
  title: 'PubliGana - Configuración',
  meta: [
    { name: 'description', content: 'Panel de configuración de valores globales.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' }
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

/* Animaciones */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
