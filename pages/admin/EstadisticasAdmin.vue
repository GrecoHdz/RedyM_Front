<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- Toast Notification -->
    <Toast v-if="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
    
    <!-- Loading Spinner -->
    <LoadingSpinner :loading="isLoading" />

    <!-- Header Fijo -->
    <header class="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-4">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <NuxtLink to="/admin/DashboardAdmin" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-xl font-black text-gray-900 dark:text-white leading-tight">Estadísticas Administrativas</h1>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Métricas y análisis global</p>
          </div>
        </div>

        <!-- Filtros de Fecha -->
        <div class="flex items-center gap-2">
          <div class="flex flex-col">
            <label class="text-[9px] font-black text-gray-400 uppercase ml-1">Desde</label>
            <input 
              type="date" 
              v-model="filters.startDate" 
              @change="fetchStats"
              class="px-3 py-2 text-xs font-bold bg-gray-100 dark:bg-gray-700 border-none rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div class="flex flex-col">
            <label class="text-[9px] font-black text-gray-400 uppercase ml-1">Hasta</label>
            <input 
              type="date" 
              v-model="filters.endDate" 
              @change="fetchStats"
              class="px-3 py-2 text-xs font-bold bg-gray-100 dark:bg-gray-700 border-none rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-12">
      
      <!-- Sección: KPIs Compactos -->
      <section class="space-y-4">
        <div class="grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
          <div v-for="key in ['usuarios', 'membresiasActivas', 'periodoGracia', 'membresiasVencidas', 'publicacionesActivas', 'publicacionesVencidas', 'ingresosMembresias', 'ingresosPublicaciones', 'ingresosTotales']" :key="key" 
               @click="openDetailModal(key)"
               class="bg-white dark:bg-gray-800 p-2 sm:p-5 rounded-xl sm:rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden">
            <div :class="`absolute -right-4 -top-4 w-12 h-12 sm:w-16 sm:h-16 opacity-10 rounded-full ${kpiConfig[key]?.color || 'bg-gray-500'}`"></div>
            <div class="relative">
              <p class="text-[6px] sm:text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1 truncate">{{ kpiConfig[key]?.label }}</p>
              <div class="flex items-baseline gap-0.5 sm:gap-1">
                <p class="text-xs sm:text-2xl font-black text-gray-900 dark:text-white">
                  {{ kpiConfig[key]?.isCurrency ? formatCurrency(stats.kpis[key]).replace('$','') : stats.kpis[key] }}
                </p>
                <span v-if="kpiConfig[key]?.isCurrency" class="text-[6px] sm:text-[10px] font-bold text-gray-400">USD</span>
              </div>
            </div>
            <div class="mt-1.5 sm:mt-4 flex items-center justify-between">
              <span class="text-[6px] sm:text-[9px] font-bold text-emerald-500 uppercase tracking-wider group-hover:underline">Info</span>
              <div :class="`p-1 sm:p-2 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-900/50 ${kpiConfig[key]?.textColor}`">
                <svg v-if="key === 'usuarios'" class="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <svg v-else-if="key === 'membresiasActivas'" class="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <svg v-else-if="key === 'periodoGracia'" class="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <svg v-else-if="key === 'membresiasVencidas'" class="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <svg v-else-if="key === 'publicacionesActivas'" class="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                <svg v-else-if="key === 'publicacionesVencidas'" class="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                <svg v-else class="w-2.5 h-2.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Gráficos Principales -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- Análisis Visual -->
        <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <h3 class="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Tendencias</h3>
            <select v-model="activeChart" class="text-[9px] sm:text-[10px] font-black uppercase bg-gray-50 dark:bg-gray-700 border-none rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 outline-none">
              <option value="ingresos">Ingresos</option>
              <option value="usuarios">Usuarios</option>
              <option value="publicaciones">Publicaciones</option>
            </select>
          </div>
          <div class="h-[250px] sm:h-[350px] flex justify-center items-center">
            <Bar v-if="activeChart === 'ingresos' && chartData.ingresos" :key="'chart-ingresos'" :data="chartData.ingresos" :options="chartOptions" :plugins="[DataLabelsPlugin]" />
            <Line v-else-if="activeChart === 'usuarios' && chartData.usuarios" :key="'chart-usuarios'" :data="chartData.usuarios" :options="chartOptions" :plugins="[DataLabelsPlugin]" />
            <Line v-else-if="activeChart === 'publicaciones' && chartData.publicaciones" :key="'chart-publicaciones'" :data="chartData.publicaciones" :options="chartOptions" :plugins="[DataLabelsPlugin]" />
          </div>
        </div>

        <!-- Análisis Demográfico -->
        <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <h3 class="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Demografía</h3>
            <select v-model="activeDemoChart" class="text-[9px] sm:text-[10px] font-black uppercase bg-gray-50 dark:bg-gray-700 border-none rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 outline-none">
              <option value="generos">Género</option>
              <option value="ciudades">Ciudad</option>
              <option value="edades">Edad</option>
            </select>
          </div>
          <div class="h-[250px] sm:h-[350px] flex justify-center items-center">
            <Doughnut v-if="activeDemoChart === 'generos' && chartData.generos" :key="'chart-generos'" :data="chartData.generos" :options="donutOptions" :plugins="[DataLabelsPlugin]" />
            <Doughnut v-else-if="activeDemoChart === 'ciudades' && chartData.ciudades" :key="'chart-ciudades-demo'" :data="chartData.ciudades" :options="donutOptions" :plugins="[DataLabelsPlugin]" />
            <Bar v-else-if="activeDemoChart === 'edades' && chartData.edades" :key="'chart-edades-demo'" :data="chartData.edades" :options="horizontalBarOptions" :plugins="[DataLabelsPlugin]" />
          </div>
        </div>
      </section>

      <!-- Rankings -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Publicaciones -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm h-full">
            <div class="flex items-center justify-between mb-4 sm:mb-6">
              <h3 class="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Ranking Pubs</h3>
              <select v-model="activeRanking" class="text-[9px] sm:text-[10px] font-black uppercase bg-gray-50 dark:bg-gray-700 border-none rounded-lg px-2 py-1 outline-none">
                <option value="vistas">Vistas</option>
                <option value="likes">Likes</option>
                <option value="shares">Shares</option>
                <option value="whatsapp">Wha</option>
                <option value="web">Web</option>
              </select>
            </div>
            
            <div class="space-y-2 sm:space-y-3">
              <div v-for="(item, index) in stats.rankings[activeRanking]?.slice(0, 5)" :key="index" 
                   @click="handleRankingClick(item, activeRanking)"
                   class="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl sm:rounded-2xl cursor-pointer hover:bg-emerald-500/10 transition-all">
                <div class="flex items-center gap-2 sm:gap-3 overflow-hidden">
                  <span class="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[9px] sm:text-[10px] font-black">{{ index + 1 }}</span>
                  <div class="min-w-0">
                    <p class="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white truncate">
                      {{ truncateText(item.content || item.publicacion?.content || item.usuario?.nombre || item.patrocinador?.nombre, 35) }}
                    </p>
                    <p class="text-[8px] sm:text-[9px] text-gray-500 uppercase truncate">
                      {{ truncateText(item.usuario?.nombre || item.publicacion?.usuario?.nombre || item.usuario?.email || item.patrocinador?.email, 25) }}
                    </p>
                  </div>
                </div>
                <p class="shrink-0 text-xs sm:text-sm font-black text-emerald-500 ml-2">{{ item.total || item.vistas || item.likes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Usuarios Compactos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
          <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 class="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">Top Saldo</h3>
            <div class="space-y-2">
              <div v-for="(user, index) in stats.rankings.saldos?.slice(0, 5)" :key="index" 
                   @click="openHistoryModal(user)"
                   class="flex items-center justify-between cursor-pointer hover:bg-emerald-500/5 p-1.5 rounded-lg transition-all">
                <p class="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate mr-2">{{ user.usuario?.nombre }}</p>
                <p class="text-[10px] font-black text-gray-900 dark:text-white whitespace-nowrap">{{ formatCurrency(user.monto_credito) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-3xl sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 class="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">Top Creadores</h3>
            <div class="space-y-2">
              <div v-for="(user, index) in stats.rankings.masPublicaciones?.slice(0, 5)" :key="index" class="flex items-center justify-between">
                <p class="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate mr-2">{{ user.usuario?.nombre }}</p>
                <p class="text-[10px] font-black text-gray-900 dark:text-white whitespace-nowrap">{{ user.total }} <span class="text-[8px] font-normal text-gray-500 uppercase">pubs</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal de Detalles KPI -->
    <Transition name="modal">
      <div v-if="modal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="modal.show = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-[101] flex flex-col max-h-[85vh]">
          
          <!-- Header Modal -->
          <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white uppercase">
                {{ modal.type === 'referidos_detalle' ? 'Referidos Directos' : kpiConfig[modal.type]?.label }}
              </h3>
              <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Listado Detallado</p>
            </div>
            <button @click="modal.show = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Buscador -->
          <div class="p-6 bg-gray-50 dark:bg-gray-900/30">
            <div class="relative">
              <input 
                v-model="modal.search" 
                @input="handleModalSearch"
                type="text" 
                placeholder="Buscar por nombre, email o contenido..."
                class="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>

          <!-- Tabla/Lista -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div v-if="modal.loading" class="flex justify-center py-10">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
            <div v-else-if="modal.data.length === 0" class="text-center py-10 text-gray-500">
              No se encontraron resultados
            </div>
            <div v-else v-for="item in modal.data" :key="item.id_usuario || item.id_publicacion || item.id_membresia" 
                 @click="navigateToItem(item)"
                 class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group">
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900 dark:text-white truncate group-hover:text-emerald-500 transition-colors">{{ item.nombre || item.usuario?.nombre || 'Publicación' }}</p>
                <p class="text-xs text-gray-500 truncate">{{ item.email || item.usuario?.email || item.content }}</p>
              </div>
              <div class="text-right ml-4">
                <p v-if="item.monto_ganado !== undefined" class="text-xs font-black text-emerald-500 mb-0.5">
                  {{ formatCurrency(item.monto_ganado) }}
                </p>
                <p class="text-[9px] font-black text-gray-400 uppercase whitespace-nowrap">
                  <span v-if="item.tipo_fecha === 'vencimiento'" class="mr-1 text-amber-500">
                    {{ modal.type === 'periodoGracia' ? 'Vence:' : 'Venció:' }}
                  </span>
                  {{ formatDate(item.fecha_display || item.fecha_registro || item.fecha) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Paginación -->
          <div class="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <button 
              @click="changeModalPage(-1)" 
              :disabled="modal.page === 1"
              class="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 disabled:opacity-30"
            >
              Anterior
            </button>
            <span class="text-xs font-black">Página {{ modal.page }} de {{ modal.totalPages }}</span>
            <button 
              @click="changeModalPage(1)" 
              :disabled="modal.page === modal.totalPages"
              class="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 disabled:opacity-30"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Historial de Interacciones -->
    <InteractionHistoryModal 
      :show="historyModal.show"
      :history="historyModal.data"
      :loading="historyModal.loading"
      :total-balance="historyModal.balance"
      @close="historyModal.show = false"
    />
  </div>
</template>

<script setup>
import { Bar, Line, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler } from 'chart.js'
import DataLabelsPlugin from 'chartjs-plugin-datalabels'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import InteractionHistoryModal from '~/components/ui/InteractionHistoryModal.vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, DataLabelsPlugin)

const { $api } = useNuxtApp()
const isLoading = ref(true)
const activeRanking = ref('vistas')
const activeChart = ref('ingresos')
const activeDemoChart = ref('generos')

// Filtros por defecto (Primer día del mes a hoy)
const now = new Date()
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
const filters = reactive({
  startDate: firstDay.toISOString().slice(0, 10),
  endDate: now.toISOString().slice(0, 10)
})
// SEO and Meta
useHead({
  title: 'PubliGana - Estadísticas',
  meta: [
    { name: 'description', content: 'Estadísticas de PubliGana.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.9, user-scalable=no' }
  ]
})
const toast = ref({ show: false, message: '', type: 'success' })
const stats = ref({
  kpis: {},
  rankings: { vistas: [], likes: [], shares: [], whatsapp: [], web: [], saldos: [], masPublicaciones: [] },
  charts: { 
    ingresosMensuales: [], 
    crecimientoUsuarios: [], 
    crecimientoPublicaciones: [], 
    distribucionCiudades: [],
    demografia: {
      generos: { masculino: 0, femenino: 0 },
      edades: { '13-17': 0, '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0, 'Desconocido': 0 }
    }
  }
})

// Configuración de KPIs
const kpiConfig = {
  usuarios: { label: 'Usuarios Registrados', icon: 'svg-users', color: 'bg-blue-500', textColor: 'text-blue-500' },
  membresiasActivas: { label: 'Membresías Activas', icon: 'svg-check', color: 'bg-emerald-500', textColor: 'text-emerald-500' },
  periodoGracia: { label: 'Período de Gracia', icon: 'svg-clock', color: 'bg-amber-500', textColor: 'text-amber-500' },
  membresiasVencidas: { label: 'Membresías Vencidas', icon: 'svg-expired', color: 'bg-red-500', textColor: 'text-red-500' },
  publicacionesActivas: { label: 'Publicaciones Activas', icon: 'svg-pub-on', color: 'bg-purple-500', textColor: 'text-purple-500' },
  publicacionesVencidas: { label: 'Publicaciones Finalizadas', icon: 'svg-pub-off', color: 'bg-rose-500', textColor: 'text-rose-500' },
  ingresosMembresias: { label: 'Ingresos Membresías', icon: 'svg-money', color: 'bg-emerald-600', textColor: 'text-emerald-600', isCurrency: true },
  ingresosPublicaciones: { label: 'Ingresos Publicaciones', icon: 'svg-ads', color: 'bg-blue-600', textColor: 'text-blue-600', isCurrency: true },
  ingresosTotales: { label: 'Ingresos Totales', icon: 'svg-total', color: 'bg-indigo-600', textColor: 'text-indigo-600', isCurrency: true }
}

// Modal State
const modal = reactive({
  show: false,
  type: '',
  data: [],
  page: 1,
  totalPages: 1,
  search: '',
  loading: false,
  limit: 5,
  cache: {} // { 'type_page_search': { data, totalPages } }
})

// Historial Modal State
const historyModal = reactive({
  show: false,
  loading: false,
  data: [],
  balance: 0
})

// Chart Data Computed
const chartData = computed(() => {
  if (isLoading.value) return {}
  
  // Función para llenar huecos de fechas
  const fillGaps = (data, start, end) => {
    const map = new Map(data.map(i => [i.fecha, parseInt(i.total || 0)]))
    const result = []
    let current = new Date(start)
    const last = new Date(end)
    
    while (current <= last) {
      const dateStr = current.toISOString().split('T')[0]
      result.push({
        fecha: dateStr,
        total: map.get(dateStr) || 0
      })
      current.setDate(current.getDate() + 1)
    }
    return result
  }

  const usuariosFill = fillGaps(stats.value.charts.crecimientoUsuarios || [], filters.startDate, filters.endDate)
  const publicacionesFill = fillGaps(stats.value.charts.crecimientoPublicaciones || [], filters.startDate, filters.endDate)

  return {
    ingresos: {
      labels: stats.value.charts.ingresosMensuales.map(m => m.mes),
      datasets: [{
        label: 'Ingresos ($)',
        data: stats.value.charts.ingresosMensuales.map(m => m.total),
        backgroundColor: '#10b981',
        borderRadius: 12
      }]
    },
    usuarios: {
      labels: usuariosFill.map(u => formatDate(u.fecha)),
      datasets: [{
        label: 'Nuevos Usuarios',
        data: usuariosFill.map(u => u.total),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 3,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointRadius: 2,
        pointHoverRadius: 5
      }]
    },
    publicaciones: {
      labels: publicacionesFill.map(p => formatDate(p.fecha)),
      datasets: [{
        label: 'Nuevas Publicaciones',
        data: publicacionesFill.map(p => p.total),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderWidth: 3,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#8b5cf6',
        pointRadius: 2,
        pointHoverRadius: 5
      }]
    },
    ciudades: {
      labels: stats.value.charts.distribucionCiudades.map(c => c.ciudad?.nombre_ciudad || 'Otras'),
      datasets: [{
        data: stats.value.charts.distribucionCiudades.map(c => c.total),
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
      }]
    },
    generos: {
      labels: ['Masculino', 'Femenino'],
      datasets: [{
        data: [
          stats.value.charts.demografia.generos.masculino,
          stats.value.charts.demografia.generos.femenino
        ],
        backgroundColor: ['#3b82f6', '#ec4899']
      }]
    },
    edades: {
      labels: Object.keys(stats.value.charts.demografia.edades),
      datasets: [{
        label: 'Usuarios',
        data: Object.values(stats.value.charts.demografia.edades),
        backgroundColor: '#f59e0b',
        borderRadius: 8
      }]
    }
  }
})

const chartOptions = computed(() => {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  
  return {
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
        offset: 2,
        formatter: (value) => value > 0 ? value : ''
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: { 
          color: isDark ? '#D1D5DB' : '#374151',
          font: { size: 10 }
        },
        grid: { 
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: { 
        ticks: { 
          color: isDark ? '#D1D5DB' : '#374151',
          font: { size: 10 }
        },
        grid: { display: false }
      }
    }
  }
})

const horizontalBarOptions = computed(() => {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  
  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'right',
        color: isDark ? '#F3F4F6' : '#1F2937',
        font: { weight: 'bold', size: 10 }
      }
    },
    scales: {
      x: { 
        beginAtZero: true,
        ticks: { color: isDark ? '#D1D5DB' : '#374151', font: { size: 10 } },
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }
      },
      y: { 
        ticks: { color: isDark ? '#D1D5DB' : '#374151', font: { size: 10 } },
        grid: { display: false }
      }
    }
  }
})

const donutOptions = computed(() => {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  
  return {
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
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return percentage > 8 ? `${value}\n(${percentage}%)` : percentage > 4 ? `${percentage}%` : ''
        }
      }
    }
  }
})

// Actions
const fetchStats = async () => {
  isLoading.value = true
  try {
    const res = await $api('/estadisticas/global', { params: filters })
    if (res.success) {
      stats.value = res.data
    }
  } catch (e) {
    showToast('Error al cargar estadísticas', 'error')
  } finally {
    isLoading.value = false
  }
}

const openDetailModal = (type) => {
  modal.type = type
  modal.page = 1
  modal.search = ''
  modal.show = true
  fetchKpiDetails()
}

const handleRankingClick = async (item, type) => {
  if (type === 'masReferidos') {
    const id = item.id_patrocinador
    const cacheKey = `referidos_${id}_${modal.page}_${modal.search}`
    
    modal.type = 'referidos_detalle'
    modal.show = true

    if (modal.cache[cacheKey]) {
      modal.data = modal.cache[cacheKey].data
      modal.totalPages = modal.cache[cacheKey].totalPages
      return
    }

    modal.loading = true
    modal.search = ''
    modal.page = 1
    modal.totalPages = 1
    try {
      const res = await $api(`/estadisticas/referidos/${id}`)
      if (res.success) {
        modal.data = res.data
        modal.cache[cacheKey] = { data: res.data, totalPages: 1 }
      }
    } catch (e) {
      showToast('Error al cargar referidos', 'error')
    } finally {
      modal.loading = false
    }
  }
}

const openHistoryModal = async (user) => {
  historyModal.show = true
  historyModal.loading = true
  historyModal.balance = parseFloat(user.monto_credito || 0)
  try {
    const res = await $api(`/interacciones/usuario/${user.id_usuario}?limit=50`)
    if (res.success) {
      historyModal.data = res.data
    }
  } catch (e) {
    showToast('Error al cargar historial', 'error')
  } finally {
    historyModal.loading = false
  }
}

const fetchKpiDetails = async () => {
  const cacheKey = `${modal.type}_${modal.page}_${modal.search}_${filters.startDate}_${filters.endDate}`
  
  if (modal.cache[cacheKey]) {
    modal.data = modal.cache[cacheKey].data
    modal.totalPages = modal.cache[cacheKey].totalPages
    return
  }

  modal.loading = true
  try {
    const res = await $api('/estadisticas/detalles', {
      params: {
        type: modal.type,
        page: modal.page,
        limit: modal.limit,
        search: modal.search,
        startDate: filters.startDate,
        endDate: filters.endDate
      }
    })
    if (res.success) {
      modal.data = res.data
      modal.totalPages = res.totalPages
      modal.cache[cacheKey] = { data: res.data, totalPages: res.totalPages }
    }
  } catch (e) {
    showToast('Error al cargar detalles', 'error')
  } finally {
    modal.loading = false
  }
}

let searchTimeout = null
const handleModalSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    modal.page = 1
    fetchKpiDetails()
  }, 500)
}

const changeModalPage = (delta) => {
  modal.page += delta
  fetchKpiDetails()
}

const navigateToItem = (item) => {
  const userId = item.id_usuario || item.usuario?.id_usuario
  const type = modal.type

  if (type === 'usuarios') {
    navigateTo('/admin/usuarios')
  } else if (['publicacionesActivas', 'publicacionesVencidas', 'ingresosPublicaciones'].includes(type)) {
    // Redirigir a publicaciones con la pestaña de historial activa
    navigateTo('/admin/membresias?section=publicaciones&tab=historial')
  } else {
    // Membresías, referidos, ingresos membresías, etc.
    navigateTo('/admin/membresias')
  }
}

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)

const truncateText = (text, limit = 50) => {
  if (!text) return ''
  return text.length > limit ? text.substring(0, limit) + '...' : text
}

const formatDate = (date) => {
  if (!date) return 'S/F'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'S/F'
  return d.toLocaleDateString('es-HN', { day: '2-digit', month: 'short' })
}
const showToast = (message, type = 'success') => { toast.value = { show: true, message, type } }

onMounted(fetchStats)
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .bg-white, .modal-leave-active .bg-white { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from .bg-white, .modal-leave-to .bg-white { transform: scale(0.9) translateY(20px); }

/* SVG Icons mockups for brevity in implementation */
.svg-users::before { content: '👥'; }
.svg-check::before { content: '✅'; }
.svg-clock::before { content: '⏳'; }
.svg-expired::before { content: '💔'; }
.svg-pub-on::before { content: '📢'; }
.svg-pub-off::before { content: '🚫'; }
.svg-money::before { content: '💵'; }
.svg-ads::before { content: '🎯'; }
.svg-total::before { content: '🏦'; }
</style>
