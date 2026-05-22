<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-safe">
    <!-- Loading Spinner -->
    <LoadingSpinner :loading="isLoading" />
    
    <!-- Navbar y Search Sticky -->
    <header class="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div class="px-4 pt-3 pb-3">
        <div class="flex items-center justify-between gap-3 mb-3">
          <button @click="router.back()" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg class="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="flex-1 text-center">
            <h1 class="text-base font-black text-gray-900 dark:text-white tracking-tight">Marketplace</h1>
          </div>

          <!-- Saldo Pill Compacto -->
          <div class="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full flex items-center space-x-1.5 border border-gray-200 dark:border-gray-700">
            <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Saldo</span>
            <span class="text-xs font-black text-blue-600 dark:text-blue-400">$ {{ formatNumber(userCredit) }}</span>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            v-model="tempSearchQuery"
            @input="debouncedSearch(tempSearchQuery)"
            type="text" 
            class="block w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
            placeholder="¿Qué necesitas hoy?"
          >
        </div>
      </div>

      <!-- Filtros Globales (Sticky con Header) -->
      <div class="px-4 pb-3">
         <div class="flex gap-2 overflow-x-auto no-scrollbar">
            <button 
               v-for="filtro in filtersList" 
               :key="filtro.id"
               @click="activeFilter = filtro.id"
               class="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border active:scale-95"
               :class="activeFilter === filtro.id 
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white shadow-md' 
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 dark:text-gray-400'"
            >
               {{ filtro.label }}
            </button>
         </div>
      </div>
    </header>

    <main class="space-y-6 pb-24 pt-4">
      <!-- Loading Skeleton -->
      <div v-if="cargandoPaquetes" class="px-4 space-y-4">
        <div class="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
        <div class="grid grid-cols-2 gap-3">
           <div class="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
           <div class="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div v-else>
         
         <!-- 1. Mis Paquetes (Carril Horizontal) -->
         <section v-if="showLanes && ownedPackages.length > 0" class="pl-4">
            <div class="flex items-center justify-between pr-4 mb-3">
               <h2 class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Mis Paquetes</h2>
            </div>
            
            <div class="flex overflow-x-auto gap-3 pb-4 pr-4 -ml-4 pl-4 snap-x no-scrollbar">
               <div 
                  v-for="paquete in ownedPackages" 
                  :key="'owned-'+paquete.id_paquete_usuario"
                  @click="openPackageDetail(paquete)"
                  class="snap-center shrink-0 w-72 text-white rounded-2xl p-4 relative overflow-hidden shadow-lg group active:scale-95 transition-all duration-300"
                  :class="getEstadoPaquete(paquete.id) === 'En uso' 
                     ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-emerald-500/50 ring-2 ring-emerald-400/50' 
                     : 'bg-gray-900 dark:bg-gray-800'"
               >
                  <!-- Decoración -->
                  <div class="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div class="relative z-10 flex justify-between items-start">
                     <div>
                        <span 
                           class="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold mb-2 border backdrop-blur-md"
                           :class="getEstadoPaquete(paquete.id) === 'En uso' 
                              ? 'bg-white text-emerald-600 border-white shadow-lg animate-pulse-subtle' 
                              : 'bg-white/20 border-white/10'"
                        >
                           {{ getEstadoPaquete(paquete.id) }}
                        </span>
                        <h3 class="font-bold text-base leading-tight w-4/5">{{ paquete.nombre }}</h3>
                     </div>
                     <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner">
                        📦
                     </div>
                  </div>
                  
                  <div class="mt-4 pt-3 border-t border-white/10 flex flex-col gap-1">
                     <div class="flex justify-between items-center">
                        <span class="text-[10px] text-gray-300">Toca para gestionar</span>
                        <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                     </div>
                     <div v-if="paquete.fecha_compra" class="text-[9px] text-white/50 flex items-center gap-1.5 mt-1">
                        <span class="font-bold uppercase tracking-tighter">Adquirido:</span>
                        <span>{{ formatDate(paquete.fecha_compra) }}</span>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <!-- 2. Carril 1: Destacados (4 items) -->
         <!-- 2. Carril 1: Destacados (4 items) -->
         <section v-if="showLanes && lane1.length > 0" class="pl-4">
            <h2 class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3">Destacados</h2>
            <div class="flex overflow-x-auto gap-3 pb-4 pr-4 -ml-4 pl-4 snap-x no-scrollbar">
               <div 
                  v-for="paquete in lane1" 
                  :key="'l1-'+paquete.id"
                  @click="openPackageDetail(paquete)"
                  class="snap-center shrink-0 w-[85vw] sm:w-80 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 active:scale-[0.98] transition-all"
               >
                  <!-- Imagen Izquierda -->
                  <div class="w-24 h-24 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
                     <img 
                        v-if="paquete.imagen"
                        :src="getOptimizedImage(paquete.imagen, 200, 200)" 
                        class="w-full h-full object-cover"
                     />
                     <div v-if="userCredit >= paquete.costo && (paquete.cantidad === null || paquete.cantidad >= 5)" class="absolute bottom-0 left-0 right-0 bg-emerald-500/90 text-white text-[8px] font-bold text-center py-0.5">
                        CANJEABLE
                     </div>
                     <div v-if="paquete.cantidad !== null && paquete.cantidad > 0 && paquete.cantidad < 5" class="absolute bottom-0 left-0 right-0 bg-orange-500/90 text-white text-[8px] font-bold text-center py-0.5">
                        🔥 ¡QUEDAN {{ paquete.cantidad }}!
                     </div>
                  </div>

                  <!-- Info Derecha -->
                  <div class="flex flex-col justify-between py-1 flex-1 min-w-0">
                     <div>
                        <h3 class="font-bold text-sm text-gray-900 dark:text-white leading-tight mb-1 truncate">{{ paquete.nombre }}</h3>
                        <p class="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{{ paquete.descripcion }}</p>
                     </div>
                     <div class="flex items-end justify-between mt-2">
                        <span class="font-black text-sm text-blue-600 dark:text-blue-400">$ {{ formatNumber(paquete.costo) }}</span>
                        <button class="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                           <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <!-- 3. Carril 2: Recomendados (4 items) -->
         <!-- 3. Carril 2: Recomendados (4 items) -->
         <section v-if="showLanes && lane2.length > 0" class="pl-4">
            <h2 class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3">Te podría interesar</h2>
            <div class="flex overflow-x-auto gap-3 pb-4 pr-4 -ml-4 pl-4 snap-x no-scrollbar">
               <div 
                  v-for="paquete in lane2" 
                  :key="'l2-'+paquete.id"
                  @click="openPackageDetail(paquete)"
                  class="snap-center shrink-0 w-36 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-all relative"
               >
                  <div class="h-24 w-full bg-gray-100 dark:bg-gray-700 relative">
                     <img 
                        v-if="paquete.imagen"
                        :src="getOptimizedImage(paquete.imagen, 300, 200)" 
                        class="w-full h-full object-cover"
                     />
                     <!-- Etiqueta Crédito -->
                     <div v-if="userCredit >= paquete.costo && (paquete.cantidad === null || paquete.cantidad >= 5)" class="absolute bottom-0 left-0 right-0 bg-emerald-500/90 text-white text-[8px] font-bold text-center py-0.5">
                        CANJEABLE
                     </div>
                     <div v-if="paquete.cantidad !== null && paquete.cantidad > 0 && paquete.cantidad < 5" class="absolute bottom-0 left-0 right-0 bg-orange-500/90 text-white text-[7px] font-bold text-center py-0.5 uppercase tracking-tighter">
                        Quedan {{ paquete.cantidad }}
                     </div>
                  </div>
                  <div class="p-2">
                     <h3 class="font-bold text-[11px] text-gray-900 dark:text-white leading-tight mb-1 truncate">{{ paquete.nombre }}</h3>
                     <p class="font-black text-xs text-blue-600 dark:text-blue-400">$ {{ formatNumber(paquete.costo) }}</p>
                  </div>
               </div>
            </div>
         </section>

         <!-- 3.5. Carril Especial "Hogar" (Filtro 'casa') -->
         <!-- 3.5. Carril Especial "Hogar" (Filtro 'casa') -->
         <section v-if="showLanes && laneHome.length > 0" class="pl-4">
            <h2 class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3">Especial Hogar 🏠</h2>
            <div class="flex overflow-x-auto gap-4 pb-4 pr-4 -ml-4 pl-4 snap-x no-scrollbar">
               <div 
                  v-for="paquete in laneHome" 
                  :key="'home-'+paquete.id"
                  @click="openPackageDetail(paquete)"
                  class="snap-center shrink-0 w-[85vw] sm:w-80 h-48 rounded-2xl relative overflow-hidden shadow-md active:scale-[0.98] transition-all bg-gray-200"
               >
                  <img 
                     v-if="paquete.imagen"
                     :src="getOptimizedImage(paquete.imagen, 600, 400)" 
                     class="absolute inset-0 w-full h-full object-cover"
                  />
                  <!-- Gradiente superpuesto -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div class="absolute bottom-0 left-0 right-0 p-4">
                     <h3 class="text-white font-bold text-lg leading-tight mb-1">{{ paquete.nombre }}</h3>
                     <div class="flex items-center space-x-2">
                        <span class="text-white font-black text-sm">$ {{ formatNumber(paquete.costo) }}</span>
                        <span v-if="userCredit >= paquete.costo && (paquete.cantidad === null || paquete.cantidad >= 5)" class="text-[9px] bg-emerald-500/90 text-white px-1.5 py-0.5 rounded font-bold">Canjeable</span>
                        <span v-if="paquete.cantidad !== null && paquete.cantidad > 0 && paquete.cantidad < 5" class="text-[9px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold italic animate-pulse">¡Corre! Solo quedan {{ paquete.cantidad }}</span>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <!-- 4. "Todos los Paquetes" (Grid Vertical Restante) -->
         <section class="px-4">
            <div class="flex items-center justify-between mb-3">
               <h2 class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  {{ (searchQuery || activeFilter !== 'todos') ? 'Resultados' : 'Explorar Todo' }}
               </h2>
               <span class="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full font-bold">{{ gridPackages.length }}</span>
            </div>

            <div class="grid grid-cols-2 gap-3">
               <div 
                  v-for="paquete in gridPackages" 
                  :key="paquete.id_paquete_usuario || paquete.id"
                  @click="openPackageDetail(paquete)"
                  class="flex bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 active:bg-gray-50 transition-colors"
               >
                  <!-- Layout Horizontal Compacto dentro de la tarjeta vertical (Mini-List) -->
                  <!-- Esta vez optamos por un diseño de "Fila" dentro de Grid para aprovechar ancho -->
                  <!-- Si prefieres imagen arriba: -->
                  <div class="flex flex-col w-full h-full"> 
                     <div class="relative w-full aspect-[16/9] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-2">
                        <img 
                           v-if="paquete.imagen"
                           :src="getOptimizedImage(paquete.imagen, 200, 150)" 
                           class="w-full h-full object-cover"
                           loading="lazy"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-xl">✨</div>
                        
                        <!-- Etiqueta Canjeable -->
                        <div v-if="userCredit >= paquete.costo && (paquete.cantidad === null || paquete.cantidad >= 5)" class="absolute top-2 left-2 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
                           CANJEABLE
                        </div>

                        <!-- Etiqueta Stock Bajo -->
                        <div v-if="paquete.cantidad !== null && paquete.cantidad > 0 && paquete.cantidad < 5" class="absolute top-2 left-2 bg-orange-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm z-10 flex items-center gap-1">
                           <span class="w-1 h-1 bg-white rounded-full animate-ping"></span>
                           {{ paquete.cantidad }} DISPONIBLES
                        </div>

                        <!-- Mini Badge de Precio -->
                        <div class="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                           $ {{ formatNumber(paquete.costo) }}
                        </div>
                     </div>

                     <h3 class="text-[11px] font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-1">
                        {{ paquete.nombre }}
                     </h3>
                     
                     <p class="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5 leading-tight opacity-80">
                        {{ paquete.descripcion }}
                     </p>

                     <!-- Fechas de historial -->
                     <div v-if="paquete.fecha_compra || paquete.fecha_uso" class="mt-2 pt-1 border-t border-gray-100 dark:border-gray-700/50 space-y-0.5">
                        <div v-if="paquete.fecha_compra" class="flex items-center gap-1.5 text-[8px] text-gray-400">
                           <span class="font-bold uppercase tracking-tighter">Compra:</span>
                           <span class="font-medium">{{ formatDate(paquete.fecha_compra) }}</span>
                        </div>
                        <div v-if="paquete.fecha_uso" class="flex items-center gap-1.5 text-[8px] text-blue-500">
                           <span class="font-black uppercase tracking-tighter">Uso:</span>
                           <span class="font-bold">{{ formatDate(paquete.fecha_uso) }}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            <!-- Empty Search -->
            <div v-if="gridPackages.length === 0" class="text-center py-10">
               <p class="text-gray-400 text-sm">No hay resultados</p>
            </div>
         </section>
      </div>
    </main>

    <!-- Detail Panel (Imagen Grande + Altura Controlada) -->
    <Transition name="bottom-sheet">
       <div 
         v-if="selectedDetailPackage" 
         class="fixed inset-0 z-50 flex flex-col justify-end isolate"
         @touchmove.stop
       >
         <!-- Backdrop - Optimized for performance -->
         <div 
           class="absolute inset-0 bg-black/60 bs-backdrop"
           @click="closeDetail"
           @touchmove.prevent.stop
         ></div>

         <!-- Contenido Fijo (Altura Moderada) -->
         <div 
           class="relative w-full bg-white dark:bg-gray-900 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden max-h-[65vh] flex flex-col bs-content"
           @touchmove.stop
         >
           <!-- Cabecera Técnica -->
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
              <!-- Imagen Full-Bleed Panorámica (16:9) -->
              <div class="aspect-video w-full bg-gray-100 dark:bg-gray-800 mb-6 overflow-hidden relative">
                 <img 
                    v-if="selectedDetailPackage.imagen"
                    :src="getOptimizedImage(selectedDetailPackage.imagen, 1000, 600)" 
                    class="w-full h-full object-cover"
                 />
                 <div class="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>

                  <!-- Diagonal Stock Ribbon (Centrado Vertical y Horizontal) -->
                  <div v-if="selectedDetailPackage.cantidad !== null && selectedDetailPackage.cantidad > 0 && selectedDetailPackage.cantidad < 5" 
                     class="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-10"
                  >
                     <div class="absolute top-[32px] left-[-48px] w-[170px] h-7 bg-red-600 dark:bg-red-500 shadow-lg transform -rotate-45 border-y border-white/20 flex items-center justify-center">
                        <span class="text-[10px] font-black text-white uppercase tracking-tighter">🔥 Quedan {{ selectedDetailPackage.cantidad }}</span>
                     </div>
                  </div>
               </div>

               <div class="px-6 pb-32">
                  <div class="mb-6">
                     <h2 class="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-1">
                        {{ selectedDetailPackage.nombre }}
                     </h2>
                     <div class="flex items-center justify-between">
                        <p class="text-base font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">$ {{ formatNumber(selectedDetailPackage.costo) }}</p> 
                     </div>
                  </div>

                  <div class="prose prose-sm dark:prose-invert text-gray-500 dark:text-gray-400">
                     <h3 class="text-xs uppercase font-bold text-gray-400 mb-2 tracking-wider">Descripción</h3>
                     <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{{ selectedDetailPackage.descripcion || 'Sin descripción detallada.' }}</p>
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
                    @click="initiateUse(selectedDetailPackage)"
                    :disabled="getEstadoPaquete(selectedDetailPackage.id) !== 'Adquirido'"
                    class="w-full py-4 rounded-2xl font-black text-base bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl"
                 >
                    {{ getEstadoPaquete(selectedDetailPackage.id) === 'En uso' ? 'En Uso' : 'Usar Ahora' }}
                 </button>
              </div>
              
              <div v-else class="flex gap-3">
                 <button 
                    @click="initiatePurchase(selectedDetailPackage)"
                    class="flex-1 py-4 rounded-2xl font-black text-base text-white shadow-xl active:scale-95 transition-transform"
                    :class="userCredit >= selectedDetailPackage.costo ? 'bg-blue-600' : 'bg-gray-900 dark:bg-gray-700'"
                 >
                    <span v-if="userCredit >= selectedDetailPackage.costo">Canjear Ahora</span>
                    <span v-else>Adquirir $ {{ formatNumber(selectedDetailPackage.costo) }}</span>
                 </button>
              </div>
           </div>
         </div>
       </div>
    </Transition>

    <!-- Modals (Sin cambios funcionales, solo estilo mínimo) -->
    
    <!-- Confirmar Uso -->
    <Transition name="modal-pop">
       <div v-if="showConfirmarUsoModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div class="bg-white dark:bg-gray-800 w-full max-w-[300px] rounded-3xl p-6 text-center modal-content-pop">
             <div class="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🚀</div>
             <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-1">Usar Paquete</h3>
             <p class="text-xs text-gray-500 mb-6">{{ selectedPaquete?.nombre }}</p>
             <button @click="usarPaquete(selectedPaquete)" :disabled="isProcessingPayment" class="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm mb-2">
                {{ isProcessingPayment ? 'Activando...' : 'Confirmar' }}
             </button>
             <button @click="showConfirmarUsoModal = false" class="text-xs text-gray-500 font-bold py-2">Cancelar</button>
          </div>
       </div>
    </Transition>

    <!-- Confirmar Canje -->
    <Transition name="modal-pop">
       <div v-if="showConfirmarCanjeoModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div class="bg-white dark:bg-gray-800 w-full max-w-[300px] rounded-3xl p-6 text-center modal-content-pop">
             <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">💎</div>
             <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-4">Confirmar Canje</h3>
             <button @click="confirmarCanjeo" :disabled="isProcessingPayment" class="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm mb-2">
                {{ isProcessingPayment ? 'Procesando...' : 'Canjear' }}
             </button>
             <button @click="showConfirmarCanjeoModal = false" class="text-xs text-gray-500 font-bold py-2">Cancelar</button>
          </div>
       </div>
    </Transition>

     <!-- Pago Transferencia -->
     <Transition name="slide-up">
      <div v-if="showPaquetePagoModal" class="fixed inset-0 z-[70] bg-white dark:bg-gray-900 flex flex-col">
         <div class="px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <h2 class="font-bold text-base">Transferencia</h2>
            <button @click="closePaquetePagoModal" class="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">✕</button>
         </div>
         <div class="flex-1 overflow-y-auto p-6">
            <div class="text-center mb-6">
               <h1 class="text-3xl font-black text-blue-600">$ {{ formatNumber(selectedPaquete?.costo) }}</h1>
               <p class="text-xs font-bold text-gray-400 mt-1">Total a transferir</p>
            </div>

            <!-- Grid de Bancos - Estilo Compacto 3 Columnas -->
<label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Cuentas Disponibles</label>
<div class="grid grid-cols-3 gap-2 mb-8">
   <div 
      v-for="acc in bankAccounts" 
      :key="acc.id_cuenta"
      @click="verDatosCuenta(acc)"
      class="relative p-3 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 flex flex-col items-center text-center gap-2 border-2"
      :class="selectedAccountObject?.id_cuenta === acc.id_cuenta 
        ? 'bg-blue-600 border-blue-600' 
        : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'"
   >
      <!-- Check badge en esquina -->
      <div 
         class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 shadow-md"
         :class="selectedAccountObject?.id_cuenta === acc.id_cuenta 
           ? 'bg-white scale-100 opacity-100' 
           : 'bg-transparent scale-0 opacity-0'"
      >
         <svg class="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
         </svg>
      </div>

      <!-- Avatar/Logo del banco -->
      <div 
         class="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
         :class="selectedAccountObject?.id_cuenta === acc.id_cuenta 
           ? 'bg-white/20' 
           : 'bg-blue-50 dark:bg-blue-900/30'"
      >
         <svg class="w-5 h-5" :class="selectedAccountObject?.id_cuenta === acc.id_cuenta ? 'text-white' : 'text-blue-600 dark:text-blue-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
         </svg>
      </div>

      <!-- Nombre del banco -->
      <p class="font-bold text-[10px] leading-tight transition-colors duration-200 line-clamp-2 w-full px-1"
         :class="selectedAccountObject?.id_cuenta === acc.id_cuenta 
           ? 'text-white' 
           : 'text-gray-900 dark:text-white'"
      >
         {{ acc.banco }}
      </p>
   </div>
</div>

            <!-- Input Comprobante -->
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Referencia de Pago</label>
            <input 
               v-model="numeroComprobante"
               type="text" 
               inputmode="numeric" 
               placeholder="# Comprobante"
               class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold focus:border-blue-500 focus:ring-0 mb-8 bg-transparent text-sm"
            >

            <button 
               @click="procesarPagoPaquete"
               :disabled="!isValidPaymentForm || isProcessingPayment"
               class="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-base rounded-xl shadow-lg disabled:opacity-50 transition-all"
            >
               {{ isProcessingPayment ? 'Enviando...' : 'Enviar Comprobante' }}
            </button>
         </div>
      </div>
    </Transition>

    <!-- Modal Detalle Cuenta (Professional Fintech Redesign) -->
    <Transition name="modal-center">
      <div v-if="showAccountDetailModal" class="fixed inset-0 z-[80] flex items-center justify-center p-4">
         <!-- Backdrop with deeper blur -->
         <div class="absolute inset-0 bg-gray-950/40 backdrop-blur-xl mc-backdrop" @click="showAccountDetailModal = false"></div>
         
         <div class="bg-white dark:bg-gray-900 w-full max-w-[360px] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden border border-gray-100 dark:border-gray-800 mc-content">
            <!-- Subtle Header Pattern -->
            <div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 -z-10"></div>
            
            <div class="p-6">
               <!-- Header: Bank Identity -->
               <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-3">
                     <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                     </div>
                     <div>
                        <h3 class="font-black text-lg text-gray-900 dark:text-white leading-none mb-1">{{ viewingAccount?.banco }}</h3>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ viewingAccount?.tipo }}</p>
                     </div>
                  </div>
                  <button @click="showAccountDetailModal = false" class="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:scale-110 transition-transform">
                     <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>

                <!-- Modern Account Card -->
               <div class="relative group mb-8">
                  <div class="absolute inset-x-0 -inset-y-0.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur-sm transition duration-1000"></div>
                  <div class="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
                     <div class="flex flex-col gap-4">
                        <div class="flex justify-between items-start">
                           <div>
                              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Beneficiario</p>
                              <p class="text-sm font-bold text-gray-900 dark:text-white">{{ viewingAccount?.beneficiario }}</p>
                           </div>
                           <svg class="w-6 h-6 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        
                        <div class="pt-4 border-t border-gray-50 dark:border-gray-700/50">
                           <p class="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Número de Cuenta</p>
                           <div class="flex items-center justify-between cursor-pointer active:opacity-60 transition-opacity" @click="handleCopyAndSelect">
                              <p class="font-mono font-black text-sm text-gray-900 dark:text-white tracking-tight">
                                 {{ viewingAccount?.num_cuenta }}
                              </p>
                              <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                 </svg>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- Professional Actions -->
               <div class="grid grid-cols-1 gap-3">
                  <button 
                     @click="handleCopyAndSelect"
                     class="group relative w-full py-4 bg-gray-900 dark:bg-blue-600 text-white rounded-xl font-bold text-sm overflow-hidden transition-all active:scale-[0.98] shadow-xl shadow-gray-900/20 dark:shadow-blue-600/30"
                  >
                     <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                     <div class="relative flex items-center justify-center gap-3">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>Copiar número de cuenta</span>
                     </div>
                  </button>
               </div>

               <!-- Footer security note -->
               <div class="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-center gap-2 opacity-50">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
                  <span class="text-[8px] font-bold uppercase tracking-widest">Pago 100% Seguro</span>
               </div>
            </div>
         </div>
      </div>
    </Transition>

    <Toast v-if="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useHead, useCookie, useRouter } from '#imports'
import Toast from '~/components/ui/Toast.vue'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const { $api } = useNuxtApp()
const config = useRuntimeConfig()
const auth = useAuthStore()
const router = useRouter()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'MiSeguro - Marketplace',
  meta: [
    { name: 'description', content: 'Marketplace de MiSeguro - Compra paquetes de servicios' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// --- State ---
const isLoading = ref(true)
const toast = ref({ show: false })
const userCredit = ref(0)
const searchQuery = ref('')
const tempSearchQuery = ref('')
const activeFilter = ref('todos')

const debouncedSearch = useDebounceFn((val) => {
   searchQuery.value = val
}, 350)

const filtersList = [
   { id: 'todos', label: 'Todos' },
   { id: 'utilizados', label: 'Utilizados' },
   { id: 'canjeables', label: 'Canjeables' },
   { id: 'auto', label: 'Auto' },
   { id: 'productos', label: 'Productos' }
]

const paquetesMantenimiento = ref([])
const paquetesUsuario = ref([])
const cargandoPaquetes = ref(true)

// Detail Sheet Logic
const selectedDetailPackage = ref(null)

// Transaction State
const showPaquetePagoModal = ref(false)
const showAccountDetailModal = ref(false)
const viewingAccount = ref(null)
const numeroComprobante = ref('')
const showConfirmarUsoModal = ref(false)
const showConfirmarCanjeoModal = ref(false)
const selectedPaquete = ref(null)
const isLoadingAccounts = ref(false)
const bankAccounts = ref([])
const selectedAccountObject = ref(null)
const isProcessingPayment = ref(false)

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

// --- Computed ---

const displayPackages = computed(() => {
  let list = paquetesMantenimiento.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.nombre?.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q))
  }
  return list
})

const showLanes = computed(() => !searchQuery.value && activeFilter.value === 'todos')

const ownedPackages = computed(() => {
   const owned = paquetesUsuario.value
      .filter(pu => pu.estado === 'activo' || pu.estado === 'utilizando' || pu.estado === 'verificando_pago')
      .map(pu => {
         const base = paquetesMantenimiento.value.find(p => p.id === pu.id_paquete) || {}
         return {
            ...base,
            nombre: pu.paquete?.nombre || base.nombre,
            descripcion: pu.paquete?.descripcion || base.descripcion,
            id: pu.id_paquete,
            id_paquete_usuario: pu.id_paquete_usuario,
            fecha_compra: pu.fecha_compra,
            fecha_uso: (pu.estado === 'utilizando' || pu.estado === 'utilizado') ? pu.fecha_uso : null,
            status_usuario: pu.estado
         }
      })
   
   // Ordenar: primero "En uso", luego "Adquirido", finalmente "Verificando"
   return owned.sort((a, b) => {
      const estadoA = getEstadoPaquete(a.id)
      const estadoB = getEstadoPaquete(b.id)
      
      const prioridad = {
         'En uso': 1,
         'Adquirido': 2,
         'Verificando': 3
      }
      
      return (prioridad[estadoA] || 999) - (prioridad[estadoB] || 999)
   })
})

const filteredPackages = computed(() => {
   let list = displayPackages.value
   const f = activeFilter.value
   
   if (f === 'utilizados') {
      // Mostrar historial de paquetes utilizados con sus fechas
      let used = paquetesUsuario.value.filter(pu => pu.estado === 'utilizado')
      if (searchQuery.value) {
         const q = searchQuery.value.toLowerCase()
         used = used.filter(pu => 
            pu.paquete?.nombre?.toLowerCase().includes(q) || 
            pu.paquete?.descripcion?.toLowerCase().includes(q)
         )
      }
      return used.map(pu => {
         const base = paquetesMantenimiento.value.find(p => p.id === pu.id_paquete) || {}
          return {
             ...base,
             id_paquete_usuario: pu.id_paquete_usuario,
             nombre: pu.paquete?.nombre || base.nombre,
             descripcion: pu.paquete?.descripcion || base.descripcion,
             costo: pu.paquete?.costo || base.costo,
             fecha_compra: pu.fecha_compra,
             fecha_uso: pu.fecha_uso
          }
      })
   } else if (f === 'canjeables') {
      list = list.filter(p => userCredit.value >= p.costo)
   } else if (f === 'auto') {
      list = list.filter(p => (p.nombre + p.descripcion).toLowerCase().includes('auto'))
   } else if (f === 'productos') {
      list = list.filter(p => (p.nombre + p.descripcion).toLowerCase().includes('producto'))
   }
   return list
})

// 1. Fuente de paquetes "Hogar" (Exclusivos)
const homePackagesSource = computed(() => {
   const list = displayPackages.value.filter(p => 
      p.descripcion?.toLowerCase().includes('casa') || p.nombre?.toLowerCase().includes('casa')
   )
   // Randomizar
   return list.sort(() => Math.random() - 0.5)
})

// 2. Fuente de "Otros" paquetes (Sin los de Hogar)
const otherPackagesSource = computed(() => {
   const list = displayPackages.value.filter(p => 
      !p.descripcion?.toLowerCase().includes('casa') && !p.nombre?.toLowerCase().includes('casa')
   )
   // Randomizar
   return list.sort(() => Math.random() - 0.5)
})

const laneHome = computed(() => {
   if (searchQuery.value) return []
   return homePackagesSource.value.slice(0, 5) // Mostrar hasta 5 de Hogar
})

const lane1 = computed(() => {
   if (searchQuery.value) return []
   return otherPackagesSource.value.slice(0, 4) // Primeros 4 de "Otros"
})

const lane2 = computed(() => {
   if (searchQuery.value) return []
   return otherPackagesSource.value.slice(4, 8) // Siguientes 4 de "Otros"
})

const gridPackages = computed(() => {
   if (searchQuery.value || activeFilter.value !== 'todos') return filteredPackages.value
   
   // El grid muestra el resto de "Otros" + el resto de "Hogar" si hubiera más de 5
   // Pero para simplificar y evitar repetir lógica compleja:
   // Excluímos los que ya se mostraron en los 3 carriles.
   
   const shownIds = new Set([
      ...laneHome.value.map(p => p.id),
      ...lane1.value.map(p => p.id),
      ...lane2.value.map(p => p.id)
   ])
   
   return displayPackages.value.filter(p => !shownIds.has(p.id))
})

const isValidPaymentForm = computed(() => {
  return selectedAccountObject.value && numeroComprobante.value?.length > 3
})

// --- Methods ---

const formatAccountNumber = (val) => {
   if (!val) return ''
   return val.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
}

const getOptimizedImage = (url, w, h) => {
  if (!url) return null
  if (url.includes('cloudinary')) {
    const parts = url.split('/upload/')
    return `${parts[0]}/upload/c_fill,w_${w},h_${h},f_auto,q_auto/${parts[1]}`
  }
  return url
}
const handleImageError = (id) => {} 

const openPackageDetail = (p) => {
  selectedDetailPackage.value = p
}

const closeDetail = () => {
  selectedDetailPackage.value = null
}

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

const formatNumber = (val) => new Intl.NumberFormat('es-HN', { minimumFractionDigits: 2 }).format(val || 0)

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// Transaction Triggers
const initiatePurchase = async (p) => {
   if (userCredit.value < p.costo) {
      selectedPaquete.value = p
      selectedAccountObject.value = null
      numeroComprobante.value = ''
      await cargarCuentas()
      showPaquetePagoModal.value = true
   } else {
      selectedPaquete.value = p
      showConfirmarCanjeoModal.value = true
   }
}

const initiateUse = (p) => {
   selectedPaquete.value = p
   showConfirmarUsoModal.value = true
}

// --- Logic Reused ---

const fetchUserCredit = async () => {
  try {
    const user = userCookie.value
    if (!user) return
    const res = await $api(`/credito/usuario/${user.id_usuario}`, {
      method: 'GET'
    })
    if (res?.success) userCredit.value = res.data.monto_credito
  } catch(e) {}
}

const cargarPaquetes = async () => {
  cargandoPaquetes.value = true
  try {
    const res = await $api('/paquetes/activos', {
      method: 'GET',
      params: { 
        id_ciudad: userCookie.value?.id_ciudad, 
        id_usuario: userCookie.value?.id_usuario 
      } 
    })
    paquetesMantenimiento.value = res.map(p => ({
      id: p.id_paquete,
      nombre: p.nombre,
      descripcion: p.descripcion,
      costo: parseFloat(p.costo),
      estado: p.estado,
      imagen: p.imagen_url,
      cantidad: p.cantidad
    }))
  } finally { cargandoPaquetes.value = false }
}

const cargarPaquetesUsuario = async () => {
   try {
      const res = await $api(`/paquetes/usuarios/${userCookie.value.id_usuario}`, {
        method: 'GET'
      })
      if(res.success) paquetesUsuario.value = res.data
   } catch(e) {}
}

const cargarCuentas = async () => {
   isLoadingAccounts.value = true
   try {
      const res = await $api('/cuentas', {
        method: 'GET'
      })
      if(Array.isArray(res)) bankAccounts.value = res
   } finally { isLoadingAccounts.value = false }
}

const tienePaquete = (id) => paquetesUsuario.value.some(p => p.id_paquete === id && (p.estado === 'activo' || p.estado === 'utilizando'))

const getEstadoPaquete = (id) => {
   const ps = paquetesUsuario.value.filter(p => p.id_paquete === id)
   if (!ps.length) return ''
   if (ps.some(p => p.estado === 'verificando_pago')) return 'Verificando'
   if (ps.some(p => p.estado === 'activo')) return 'Adquirido'
   if (ps.some(p => p.estado === 'utilizando')) return 'En uso'
   return ''
}

// --- Actions (Confirmations) ---

const confirmarCanjeo = async () => {
   try {
      isProcessingPayment.value = true
      const p = selectedPaquete.value
      await $api('/credito', { 
         method: 'POST', 
         body: { 
            id_usuario: userCookie.value.id_usuario, 
            monto_credito: -Math.abs(p.costo) 
         } 
      })
      const res = await $api('/paquetes/usuarios/canjear', { 
         method: 'POST', 
         body: { 
            id_paquete: p.id, 
            id_usuario: userCookie.value.id_usuario 
         } 
      })
      
      if(res.success) {
         showToast('Canjeado con éxito', 'success')
         userCredit.value -= p.costo
         await cargarPaquetesUsuario()
         
         // Notificar a los administradores
         try {
            await Promise.all([
            await Promise.all([
               $api('/notificaciones/enviar', {
                  method: 'POST',
                  body: {
                     titulo: 'Paquete Adquirido',
                     nombre_rol: 'admin'
                  }
               }),
               $api('/notificaciones/enviar', {
                  method: 'POST',
                  body: {
                     titulo: 'Paquete Adquirido',
                     nombre_rol: 'sa'
                  }
               })
            ])
            ])
         } catch (error) {
            console.error('Error al enviar notificaciones:', error)
         }
         
         showConfirmarCanjeoModal.value = false
         closeDetail()
      } else {
         // Mostrar el mensaje de error del servidor
         showToast(res.error || 'Error al canjear', 'error')
      }
   } catch(e) {
      // Mostrar el mensaje de error si viene en la respuesta
      const errorMessage = e.data?.error || e.message || 'Error al canjear'
      showToast(errorMessage, 'error')
   } finally { 
      isProcessingPayment.value = false 
   }
}

const procesarPagoPaquete = async () => {
   try {
      isProcessingPayment.value = true
      const res = await $api('/paquetes/usuarios/canjear', {
         method: 'POST', 
         body: {
            id_paquete: selectedPaquete.value.id,
            id_usuario: userCookie.value.id_usuario,
            esPagoTransferencia: true,
            id_cuenta: selectedAccountObject.value.id_cuenta,
            numero_comprobante: numeroComprobante.value
         }
      })
      
      if(res.success) {
         closePaquetePagoModal()
         showToast('Pago enviado', 'success')
         await cargarPaquetesUsuario()
         const idPaqueteUsuario = res.data?.paquete?.id_paquete_usuario
         
         // Enviar notificaciones a los administradores
         try {
            const notificationData = { titulo: 'Pago de Paquete Recibido' }
            
            await Promise.all([
               $api('/notificaciones/enviar', {
                  method: 'POST',
                  body: { ...notificationData, nombre_rol: 'admin' }
               }),
               $api('/notificaciones/enviar', {
                  method: 'POST',
                  body: { ...notificationData, nombre_rol: 'sa' }
               })
            ])
         } catch (notifierError) {
            console.error('Error al enviar notificaciones de pago de paquete:', notifierError)
         }
         
         sendWA(selectedPaquete.value, numeroComprobante.value, 'pay', idPaqueteUsuario)
         closeDetail()
      } else {
         // Mostrar el mensaje de error del servidor
         showToast(res.error || 'Error al procesar el pago', 'error')
      }
   } catch(e) {
      // Mostrar el mensaje de error si viene en la respuesta
      const errorMessage = e.data?.error || e.message || 'Error al procesar el pago'
      showToast(errorMessage, 'error')
   } finally { 
      isProcessingPayment.value = false 
   }
}

const usarPaquete = async (p) => {
   try {
      isProcessingPayment.value = true
      const pu = paquetesUsuario.value.find(pup => pup.id_paquete === p.id && pup.estado === 'activo')
      if(!pu) throw new Error('Error')
      
      const res = await $api(`/paquetes/usuarios/${pu.id_paquete_usuario}/activar`, { 
        method: 'PUT'
      })
      
      if(res.success) {
         showToast('Paquete Activado', 'success')
         await cargarPaquetesUsuario()
         
         // Notificar a los administradores y super administradores
         try {
            const notificationData = { titulo: 'Solicitud Uso de Paquete' }
            
            await Promise.all([
               $api('/notificaciones/enviar', {
                  method: 'POST',
                  body: { ...notificationData, nombre_rol: 'admin' }
               }),
               $api('/notificaciones/enviar', {
                  method: 'POST',
                  body: { ...notificationData, nombre_rol: 'sa' }
               })
            ])
         } catch (error) {
            console.error('Error al enviar notificaciones:', error)
         }
         
         showConfirmarUsoModal.value = false
         sendWA(p, pu.id_paquete_usuario, 'use')
         closeDetail()
      }
   } catch(e) { showToast('Error', 'error') }
   finally { isProcessingPayment.value = false }
}

const sendWA = async (p, ref, type, extraId = null) => {
   try {
      const res = await $api('/config/valor/numero_empresa', {
        method: 'GET'
      })
      const phone = res?.valor || '12345678'
      
      const today = new Date();
      const formattedDate = [
        String(today.getDate()).padStart(2, '0'),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getFullYear()).slice(-2)
      ].join('');

      let msg = '';
      if (type === 'pay') {
         const idPaquete = extraId || 'PENDIENTE'
         msg = `*Comprobante de Pago de Paquete*\n\n*ID:* ${formattedDate}-${idPaquete}\n*Paquete:* ${p.nombre}\n*N° de comprobante:* ${ref}\n*Monto:* L. ${formatNumber(p.costo)}\n\nAdjunto una captura del comprobante de pago para su verificación.`
      } else {
         msg = `*Solicitud de Uso de Paquete*\n\nHola, deseo solicitar el uso de un paquete adquirido a través de la plataforma MiSeguro.\n\n*ID:* ${formattedDate}-${ref}\n*Paquete:* ${p.nombre}\nQuedo atento(a) a la coordinación correspondiente.`
      }

      window.open(`https://wa.me/504${phone}?text=${encodeURIComponent(msg)}`, '_blank')
   } catch(e){}
}

const showToast = (m, t='success') => { toast.value = { show: true, message: m, type: t }; setTimeout(()=>toast.value.show=false, 3000) }
const closePaquetePagoModal = () => showPaquetePagoModal.value = false
const copyToClipboard = async (text) => {
   try {
      if (!text) return
      
      if (navigator.clipboard && window.isSecureContext) {
         await navigator.clipboard.writeText(text)
         showToast('Número de cuenta copiado', 'success')
         return
      }
      
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-9999px"
      textArea.style.top = "0"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      if (successful) {
         showToast('Número de cuenta copiado', 'success')
      } else {
         throw new Error('Copiado fallido')
      }
   } catch (err) {
      console.error('Error al copiar:', err)
      showToast('Error al copiar', 'error')
   }
}

onMounted(async () => {
   await Promise.all([fetchUserCredit(), cargarPaquetes(), cargarPaquetesUsuario()])
   
   // Pequeño retardo para asegurar suavidad
   setTimeout(() => {
      isLoading.value = false
   }, 600)
})
</script>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes pulse-subtle {
   0%, 100% { opacity: 1; transform: scale(1); }
   50% { opacity: 0.9; transform: scale(1.05); }
}
.animate-pulse-subtle { animation: pulse-subtle 2s ease-in-out infinite; }

@keyframes slide-up-custom {
   0% { transform: translateY(100%); }
   100% { transform: translateY(0); }
}
.animate-slide-up-custom { animation: slide-up-custom 0.4s cubic-bezier(0.33, 1, 0.68, 1) forwards; }



.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

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

/* Bottom Sheet Transitions */
.bottom-sheet-enter-active, .bottom-sheet-leave-active {
  transition: opacity 0.3s ease;
}

.bs-content {
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.15) !important;
  will-change: transform; /* Hint to browser for faster animation */
}

/* Backdrop Fade */
.bottom-sheet-enter-active .bs-backdrop { transition: opacity 0.3s ease; }
.bottom-sheet-enter-from .bs-backdrop { opacity: 0; }
.bottom-sheet-enter-to .bs-backdrop { opacity: 1; }

.bottom-sheet-leave-active .bs-backdrop { transition: opacity 0.25s ease; }
.bottom-sheet-leave-from .bs-backdrop { opacity: 1; }
.bottom-sheet-leave-to .bs-backdrop { opacity: 0; }

/* Content Slide */
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

/* Modal Center Transitions */
.modal-center-enter-active, .modal-center-leave-active {
   transition: opacity 0.35s ease;
}

/* Individual element timings - Snappier */
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

/* Entry States */
.modal-center-enter-from .mc-backdrop {
   opacity: 0;
}

.modal-center-enter-from .mc-content {
   opacity: 0;
   transform: scale(0.8) translateY(60px);
}

/* Exit States */
.modal-center-leave-to .mc-backdrop {
   opacity: 0;
}

.modal-center-leave-to .mc-content {
   opacity: 0;
   transform: scale(0.9) translateY(20px);
}
</style>
