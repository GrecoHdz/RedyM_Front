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

    <main class="max-w-7xl mx-auto p-4 sm:p-6 space-y-12">
      
      <!-- Sección: Usuarios y Red -->
      <section class="space-y-6">
        <div class="flex items-center gap-3 px-2">
          <div class="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div>
            <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Usuarios y Crecimiento</h2>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Gestión de comunidad y referidos</p>
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="key in ['usuarios', 'membresiasActivas', 'periodoGracia', 'membresiasVencidas']" :key="key" 
               @click="openDetailModal(key)"
               class="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden">
            <div :class="`absolute -right-4 -top-4 w-16 h-16 opacity-10 rounded-full ${kpiConfig[key].color}`"></div>
            <div class="relative">
              <p class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{{ kpiConfig[key].label }}</p>
              <p class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.kpis[key] }}</p>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <span class="text-[9px] font-bold text-emerald-500 uppercase tracking-wider group-hover:underline">Ver detalles</span>
              <div :class="`p-2 rounded-xl bg-gray-50 dark:bg-gray-900/50 ${kpiConfig[key].textColor}`">
                <svg v-if="key === 'usuarios'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <svg v-else-if="key === 'membresiasActivas'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <svg v-else-if="key === 'periodoGracia'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <svg v-else-if="key === 'membresiasVencidas'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección: Publicidad -->
      <section class="space-y-6">
        <div class="flex items-center gap-3 px-2">
          <div class="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
          </div>
          <div>
            <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Publicidad y Actividad</h2>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Rendimiento de anuncios y contenido</p>
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="key in ['publicacionesActivas', 'publicacionesVencidas']" :key="key" 
               @click="openDetailModal(key)"
               class="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden">
            <div :class="`absolute -right-4 -top-4 w-16 h-16 opacity-10 rounded-full ${kpiConfig[key].color}`"></div>
            <div class="relative">
              <p class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{{ kpiConfig[key].label }}</p>
              <p class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.kpis[key] }}</p>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <span class="text-[9px] font-bold text-emerald-500 uppercase tracking-wider group-hover:underline">Ver detalles</span>
              <div :class="`p-2 rounded-xl bg-gray-50 dark:bg-gray-900/50 ${kpiConfig[key].textColor}`">
                <svg v-if="key === 'publicacionesActivas'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                <svg v-else-if="key === 'publicacionesVencidas'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección: Finanzas -->
      <section class="space-y-6">
        <div class="flex items-center gap-3 px-2">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Finanzas Globales</h2>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ingresos y circulación monetaria</p>
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="key in ['ingresosMembresias', 'ingresosPublicaciones', 'ingresosTotales']" :key="key" 
               @click="openDetailModal(key)"
               class="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden">
            <div :class="`absolute -right-4 -top-4 w-16 h-16 opacity-10 rounded-full ${kpiConfig[key].color}`"></div>
            <div class="relative">
              <p class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{{ kpiConfig[key].label }}</p>
              <div class="flex items-baseline gap-1">
                <p class="text-2xl font-black text-gray-900 dark:text-white">{{ formatCurrency(stats.kpis[key]) }}</p>
                <span class="text-[10px] font-bold text-gray-400">USD</span>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <span class="text-[9px] font-bold text-emerald-500 uppercase tracking-wider group-hover:underline">Ver detalles</span>
              <div :class="`p-2 rounded-xl bg-gray-50 dark:bg-gray-900/50 ${kpiConfig[key].textColor}`">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Gráficos Principales -->
      <section class="space-y-4">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Análisis Visual</h3>
            <select v-model="activeChart" class="text-[10px] font-black uppercase bg-gray-50 dark:bg-gray-700 border-none rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="ingresos">Ingresos Mensuales</option>
              <option value="usuarios">Crecimiento Usuarios</option>
              <option value="publicaciones">Crecimiento Publicaciones</option>
              <option value="ciudades">Distribución por Ciudad</option>
            </select>
          </div>

          <div class="h-[300px] sm:h-[400px] flex justify-center items-center">
            <Bar v-if="activeChart === 'ingresos' && chartData.ingresos" :data="chartData.ingresos" :options="chartOptions" />
            <Line v-else-if="activeChart === 'usuarios' && chartData.usuarios" :data="chartData.usuarios" :options="chartOptions" />
            <Line v-else-if="activeChart === 'publicaciones' && chartData.publicaciones" :data="chartData.publicaciones" :options="chartOptions" />
            <Doughnut v-else-if="activeChart === 'ciudades' && chartData.ciudades" :data="chartData.ciudades" :options="donutOptions" />
          </div>
        </div>
      </section>

      <!-- Rankings -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Publicaciones -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Top Publicaciones</h3>
              <select v-model="activeRanking" class="text-[10px] font-black uppercase bg-gray-50 dark:bg-gray-700 border-none rounded-lg px-2 py-1 outline-none">
                <option value="vistas">Más Vistas</option>
                <option value="likes">Más Likes</option>
                <option value="shares">Más Compartidas</option>
                <option value="whatsapp">Más WhatsApp</option>
                <option value="web">Más Visitas Web</option>
                <option value="masPublicaciones">Más Publicaciones</option>
                <option value="masReferidos">Más Referidos</option>
              </select>
            </div>
            
            <div class="space-y-3">
              <div v-for="(item, index) in stats.rankings[activeRanking]" :key="index" 
                   @click="handleRankingClick(item, activeRanking)"
                   class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl cursor-pointer hover:bg-emerald-500/10 transition-all">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black">{{ index + 1 }}</span>
                  <div>
                    <p class="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                      {{ item.content || item.publicacion?.content || item.usuario?.nombre || item.patrocinador?.nombre }}
                    </p>
                    <p class="text-[9px] text-gray-500 uppercase">
                      {{ item.usuario?.nombre || item.publicacion?.usuario?.nombre || item.usuario?.email || item.patrocinador?.email }}
                    </p>
                  </div>
                </div>
                <p class="text-sm font-black text-emerald-500">{{ item.total || item.vistas || item.likes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Usuarios -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Top 10 Usuarios (Saldo)</h3>
            <div class="space-y-3">
              <div v-for="(user, index) in stats.rankings.saldos" :key="index" 
                   @click="openHistoryModal(user)"
                   class="flex items-center justify-between cursor-pointer hover:bg-emerald-500/5 p-2 rounded-xl transition-all">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <p class="text-xs font-bold text-gray-700 dark:text-gray-300">{{ user.usuario?.nombre }}</p>
                </div>
                <p class="text-xs font-black text-gray-900 dark:text-white">{{ formatCurrency(user.monto_credito) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Top 10 Creadores</h3>
            <div class="space-y-3">
              <div v-for="(user, index) in stats.rankings.masPublicaciones" :key="index" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                  <p class="text-xs font-bold text-gray-700 dark:text-gray-300">{{ user.usuario?.nombre }}</p>
                </div>
                <p class="text-xs font-black text-gray-900 dark:text-white">{{ user.total }} <span class="text-[9px] font-normal text-gray-500">pubs</span></p>
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
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement } from 'chart.js'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import InteractionHistoryModal from '~/components/ui/InteractionHistoryModal.vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement)

const { $api } = useNuxtApp()
const isLoading = ref(true)
const activeRanking = ref('vistas')
const activeChart = ref('ingresos')

// Filtros por defecto (Primer día del mes a hoy)
const now = new Date()
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
const filters = reactive({
  startDate: firstDay.toISOString().slice(0, 10),
  endDate: now.toISOString().slice(0, 10)
})

const toast = ref({ show: false, message: '', type: 'success' })
const stats = ref({
  kpis: {},
  rankings: { vistas: [], likes: [], shares: [], whatsapp: [], web: [], saldos: [], masPublicaciones: [] },
  charts: { ingresosMensuales: [], crecimientoUsuarios: [], crecimientoPublicaciones: [], distribucionCiudades: [] }
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
      labels: stats.value.charts.crecimientoUsuarios.map(u => u.fecha),
      datasets: [{
        label: 'Nuevos Usuarios',
        data: stats.value.charts.crecimientoUsuarios.map(u => u.total),
        borderColor: '#3b82f6',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      }]
    },
    publicaciones: {
      labels: stats.value.charts.crecimientoPublicaciones.map(p => p.fecha),
      datasets: [{
        label: 'Nuevas Publicaciones',
        data: stats.value.charts.crecimientoPublicaciones.map(p => p.total),
        borderColor: '#8b5cf6',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.1)'
      }]
    },
    ciudades: {
      labels: stats.value.charts.distribucionCiudades.map(c => c.ciudad?.nombre_ciudad || 'Otras'),
      datasets: [{
        data: stats.value.charts.distribucionCiudades.map(c => c.total),
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
      }]
    }
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { display: false }, ticks: { font: { size: 10 } } },
    x: { grid: { display: false }, ticks: { font: { size: 10 } } }
  }
}

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } }
}

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
