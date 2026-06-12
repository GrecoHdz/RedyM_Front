<template>
  <div class="min-h-screen bg-[#070b14] text-gray-100 font-['Outfit'] selection:bg-emerald-500/30 selection:text-emerald-400 pb-28">
    <Toast :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
    <LoadingSpinner :loading="isLoading || isSubmitting" :message="isSubmitting ? 'Publicando...' : 'Cargando...'" />
    <MobileHeader :earnings="totalEarnings" :has-membership="isMembershipActive" />

    <main class="pt-20 px-4 max-w-2xl mx-auto">
      <div v-if="!isLoading" class="space-y-6 animate-fade-in">

        <!-- Page Header -->
        <header class="flex flex-col gap-1 mb-2">
          <h2 class="text-2xl font-black text-white tracking-tight">Nueva Publicidad</h2>
          <p class="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em]">Paga por alcance</p>
        </header>

        <!-- Form Card -->
        <div class="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-sm space-y-6"> 

          <!-- Content -->
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Descripción</label>
            <textarea 
              v-model="post.content" rows="4"
              class="w-full px-5 py-4 bg-[#0d121f] border border-white/10 rounded-3xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-white font-medium text-sm resize-none"
              placeholder="Escribe algo interesante..."
            ></textarea>
          </div>

          <!-- Budget Field -->
          <div class="space-y-2">
            <div class="flex items-center justify-between ml-1">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Presupuesto ($){{ (auth.user?.role === 'sa' || auth.user?.role === 'admin') ? ' (Opcional)' : '' }}
              </label>
              <span v-if="!(auth.user?.role === 'sa' || auth.user?.role === 'admin')" class="text-[9px] text-emerald-500 font-black">Mín. $ 10</span>
              <span v-else class="text-[9px] text-violet-500 font-black uppercase">Admin · Ilimitado</span>
            </div>
            <div class="relative">
              <span class="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 font-black text-sm pointer-events-none">$</span>
              <input 
                v-model.number="post.presupuesto" type="number" :min="(auth.user?.role === 'sa' || auth.user?.role === 'admin') ? 0 : 10" step="10"
                class="w-full pl-10 pr-5 py-4 bg-[#0d121f] border border-white/10 rounded-3xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all text-white font-black text-xl"
                placeholder="200"
              >
            </div>
          </div>

          <!-- External URL -->
          <div class="space-y-2">
            <div class="flex items-center justify-between ml-1">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Enlace Externo (Opcional)</label>
              <span class="text-[9px] text-emerald-500/50 font-bold">🔗</span>
            </div>
            <input 
              v-model="post.external_url" type="url"
              class="w-full px-5 py-3 bg-[#0d121f] border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-white font-medium text-sm"
              placeholder="https://ejemplo.com"
            >
          </div>

          <!-- WhatsApp + Poll Toggles -->
          <div class="space-y-3 pt-2">
            
            <!-- WhatsApp Toggle -->
            <div class="bg-[#0d121f]/50 border border-white/5 rounded-3xl cursor-pointer transition-all"
              :class="post.whatsapp_active ? 'border-emerald-500/30 bg-emerald-500/5' : ''">
              <div @click="post.whatsapp_active = !post.whatsapp_active"
                class="flex items-center justify-between p-4 active:scale-[0.98] transition-transform select-none">
                <div class="flex items-center gap-3">
                  <span class="text-[18px]">📱</span>
                  <div>
                    <p class="text-[10px] font-black text-white uppercase tracking-wider leading-none">WhatsApp</p>
                    <p class="text-[8px] font-bold uppercase mt-0.5" :class="post.whatsapp_active ? 'text-emerald-400' : 'text-gray-500'">{{ post.whatsapp_active ? 'Activo' : 'Inactivo' }}</p>
                  </div>
                </div>
                <!-- Toggle pill -->
                <div class="w-10 h-5 rounded-full relative flex-shrink-0 transition-colors duration-300"
                  :class="post.whatsapp_active ? 'bg-emerald-500' : 'bg-gray-700'">
                  <div class="absolute top-[3px] w-3.5 h-3.5 bg-white rounded-full shadow transition-all duration-300"
                    :style="{ left: post.whatsapp_active ? '22px' : '3px' }"></div>
                </div>
              </div>
              <!-- Número de WhatsApp editable -->
              <Transition name="fade">
                <div v-if="post.whatsapp_active" class="px-4 pb-4" @click.stop>
                  <label class="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-1.5 ml-1">Número de Contacto (Incluye código de país)</label>
                  <div class="flex items-center gap-2 bg-[#0d121f] border border-emerald-500/20 rounded-2xl px-4 py-2.5 focus-within:border-emerald-500 transition-all">
                    <input
                      v-model="post.whatsapp_number"
                      type="tel"
                      placeholder="Ej: 50499887766"
                      @input="post.whatsapp_number = post.whatsapp_number.replace(/[^0-9+\s()]/g, '')"
                      class="flex-1 bg-transparent outline-none text-white font-bold text-sm placeholder-gray-600"
                    >
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Poll Toggle -->
            <div @click="showPoll = !showPoll"
              class="bg-[#0d121f]/50 border border-white/5 p-4 rounded-3xl cursor-pointer transition-all active:scale-[0.98] select-none flex items-center justify-between"
              :class="showPoll ? 'border-blue-500/30 bg-blue-500/5' : ''">
              <div class="flex items-center gap-3">
                <span class="text-[18px]">📊</span>
                <div>
                  <p class="text-[10px] font-black text-white uppercase tracking-wider leading-none">Encuesta</p>
                  <p class="text-[8px] font-bold uppercase mt-0.5" :class="showPoll ? 'text-blue-400' : 'text-gray-500'">{{ showPoll ? 'Activa' : 'Añadir' }}</p>
                </div>
              </div>
              <!-- Toggle pill -->
              <div class="w-10 h-5 rounded-full relative flex-shrink-0 transition-colors duration-300"
                :class="showPoll ? 'bg-blue-500' : 'bg-gray-700'">
                <div class="absolute top-[3px] w-3.5 h-3.5 bg-white rounded-full shadow transition-all duration-300"
                  :style="{ left: showPoll ? '22px' : '3px' }"></div>
              </div>
            </div>

            <!-- Targeting Toggle -->
            <div @click="showTargeting = !showTargeting"
              class="bg-[#0d121f]/50 border border-white/5 p-4 rounded-3xl cursor-pointer transition-all active:scale-[0.98] select-none flex items-center justify-between"
              :class="showTargeting ? 'border-violet-500/30 bg-violet-500/5' : ''">
              <div class="flex items-center gap-3">
                <span class="text-[18px]">🎯</span>
                <div>
                  <p class="text-[10px] font-black text-white uppercase tracking-wider leading-none">Segmentación</p>
                  <p class="text-[8px] font-bold uppercase mt-0.5" :class="showTargeting ? 'text-violet-400' : 'text-gray-500'">{{ showTargeting ? 'Configurada' : 'Todos los usuarios' }}</p>
                </div>
              </div>
              <!-- Toggle pill -->
              <div class="w-10 h-5 rounded-full relative flex-shrink-0 transition-colors duration-300"
                :class="showTargeting ? 'bg-violet-500' : 'bg-gray-700'">
                <div class="absolute top-[3px] w-3.5 h-3.5 bg-white rounded-full shadow transition-all duration-300"
                  :style="{ left: showTargeting ? '22px' : '3px' }"></div>
              </div>
            </div>
          </div>

          <!-- Targeting Form -->
          <Transition name="fade">
            <div v-if="showTargeting" class="bg-[#0d121f]/50 border border-white/5 rounded-3xl p-5 space-y-5 shadow-inner">
              
              <!-- Ciudad -->
              <div class="space-y-2">
                <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Ciudad Específica (Opcional)</label>
                <multiselect
                  v-model="selectedCiudadObj"
                  :options="ciudades"
                  :searchable="true"
                  label="nombre_ciudad"
                  track-by="id_ciudad"
                  class="multiselect-custom-dark"
                  placeholder="Todas las ciudades"
                  select-label=""
                  deselect-label=""
                  selected-label=""
                  @update:modelValue="post.target_id_ciudad = $event?.id_ciudad || null"
                />
              </div>

              <!-- Género -->
              <div class="space-y-2">
                <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Género</label>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    v-for="gen in generosOptions" :key="gen.value"
                    @click="post.target_genero = gen.value"
                    class="py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all"
                    :class="post.target_genero === gen.value ? 'bg-violet-500 border-violet-400 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'"
                  >
                    {{ gen.label }}
                  </button>
                </div>
              </div>

              <!-- Rango de Edad -->
              <div class="space-y-3">
                <div class="flex items-center justify-between ml-1">
                  <label class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Rango de Edad</label>
                  <span class="text-[10px] font-black text-violet-400">{{ post.target_edad_min }} - {{ post.target_edad_max }} años</span>
                </div>
                <div class="flex items-center gap-4 px-2">
                  <div class="flex-1 space-y-1">
                    <span class="text-[8px] text-gray-600 font-bold uppercase">Mín</span>
                    <input v-model.number="post.target_edad_min" type="range" min="13" max="100" class="w-full accent-violet-500">
                  </div>
                  <div class="flex-1 space-y-1">
                    <span class="text-[8px] text-gray-600 font-bold uppercase">Máx</span>
                    <input v-model.number="post.target_edad_max" type="range" :min="post.target_edad_min" max="100" class="w-full accent-violet-500">
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Poll Form -->
          <Transition name="fade">
            <div v-if="showPoll" class="bg-[#0d121f]/50 border border-white/5 rounded-3xl p-4 space-y-4 shadow-inner">
              <div class="space-y-1">
                <label class="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Pregunta de la encuesta</label>
                <input v-model="post.poll.question" type="text" class="w-full px-4 py-2.5 bg-[#0d121f] border border-white/10 rounded-xl focus:border-blue-500 outline-none text-white text-sm transition-all" placeholder="Escribe tu pregunta aquí...">
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between ml-1">
                  <label class="text-[8px] font-black text-gray-600 uppercase tracking-widest">Opciones (Marca la correcta ✅)</label>
                  <button v-if="post.poll.options.length < 6" @click="addOption" class="text-[8px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">
                    + Añadir Opción
                  </button>
                </div>
                <div v-for="(opt, idx) in post.poll.options" :key="idx" class="flex items-center gap-2 group">
                  <button @click="post.poll.correct_index = idx" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all border shrink-0"
                    :class="post.poll.correct_index === idx ? 'bg-emerald-500 border-emerald-400 text-[#070b14]' : 'bg-white/5 border-white/10 text-gray-500'">
                    {{ post.poll.correct_index === idx ? '✓' : '' }}
                  </button>
                  <input v-model="post.poll.options[idx]" type="text" class="flex-1 px-4 py-2.5 bg-[#0d121f] border border-white/10 rounded-xl focus:border-emerald-500 outline-none text-white text-xs transition-all" :placeholder="'Opción ' + (idx + 1)">
                  <button v-if="post.poll.options.length > 2" @click="removeOption(idx)" class="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 active:scale-90 transition-all shrink-0 sm:opacity-0 sm:group-hover:opacity-100">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Media Upload -->
          <div class="space-y-3">
            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Fotos y Videos ({{ selectedFiles.length }}/5)</label>
            <div class="grid grid-cols-3 gap-3">
              <div v-for="(file, index) in selectedFiles" :key="index" class="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/40 group">
                <img v-if="file.type.startsWith('image/')" :src="file.preview" class="w-full h-full object-cover">
                <div v-else class="w-full h-full flex items-center justify-center text-2xl">🎥</div>
                <button @click="removeFile(index)" class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform opacity-0 group-hover:opacity-100">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <button v-if="selectedFiles.length < 5" @click="$refs.fileInput.click()" class="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group">
                <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-gray-500 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                </div>
                <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest">Añadir</span>
              </button>
            </div>
            <p class="text-[9px] text-gray-600 font-bold uppercase tracking-widest text-center mt-2">Límite total: 10MB • Máximo 5 archivos</p>
          </div>

          <input type="file" ref="fileInput" class="hidden" accept="image/*,video/*" multiple @change="handleFileSelect">

          <!-- Submit -->
          <button @click="submitPost" :disabled="!canSubmit || isSubmitting"
            class="w-full py-4 bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-violet-900/30 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3">
            <span v-if="!isSubmitting">🚀 {{ (auth.user?.role === 'sa' || auth.user?.role === 'admin') ? 'Publicar Ahora' : 'Publicar · $ ' + (post.presupuesto || 0) }}</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              {{ (auth.user?.role === 'sa' || auth.user?.role === 'admin') ? 'Publicando...' : 'Comprimiendo...' }}
            </span>
          </button>
        </div>

        <!-- ====== MIS PUBLICACIONES ====== -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-black text-white tracking-tight">Mis Publicaciones</h3>
              <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{{ misPublicaciones.length }} publicaciones</p>
            </div>
            <button @click="fetchMisPublicaciones" :disabled="loadingPubs" class="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all active:scale-95">
              <svg :class="['w-4 h-4 text-gray-400', loadingPubs ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>

          <div v-if="!loadingPubs && misPublicaciones.length === 0" class="text-center py-12 bg-white/3 border border-white/5 rounded-3xl">
            <div class="text-4xl mb-3">📭</div>
            <p class="text-gray-500 text-sm font-bold">Aún no tienes publicaciones</p>
            <p class="text-gray-600 text-[10px] mt-1 uppercase tracking-widest">Crea tu primera publicación arriba</p>
          </div>

          <div v-else-if="loadingPubs" class="space-y-4">
            <div v-for="i in 2" :key="i" class="bg-white/5 border border-white/10 rounded-3xl p-5 animate-pulse">
              <div class="h-4 bg-white/10 rounded-full w-3/4 mb-3"></div>
              <div class="h-2 bg-white/5 rounded-full w-full"></div>
            </div>
          </div>

          <div v-else class="grid grid-cols-2 gap-3 sm:gap-4">
            <div v-for="pub in misPublicaciones" :key="pub.id_publicacion"
              class="bg-white/5 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden backdrop-blur-sm group hover:border-violet-500/30 transition-all flex flex-col">
              
              <!-- Header: status + actions -->
              <div class="flex items-center justify-between px-3 sm:px-5 pt-3 sm:pt-4 pb-1.5 sm:pb-2">
                <span class="text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" :class="getStatusClass(pub.estado)">
                  {{ getStatusLabel(pub.estado) }}
                </span>
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <!-- Pagar button for pendiente_pago or rechazada -->
                  <button v-if="pub.estado === 'pendiente_pago' || pub.estado === 'rechazada'"
                    @click="abrirModalPago(pub)"
                    class="text-[7px] sm:text-[9px] font-black uppercase tracking-widest px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-500 text-[#070b14] rounded-lg sm:rounded-xl active:scale-95 transition-all">
                    {{ pub.estado === 'rechazada' ? '🔄' : '💳' }}
                  </button>
                  <button v-if="pub.estado === 'activa' || pub.estado === 'borrada'"
                    @click="verEstadisticas(pub)"
                    class="w-6 h-6 sm:w-8 sm:h-8 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-violet-500/20 active:scale-90 transition-all">
                    <svg class="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  </button>
                  <button @click="eliminarPublicacion(pub.id_publicacion)" class="w-6 h-6 sm:w-8 sm:h-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-red-500/20 active:scale-90 transition-all">
                    <svg class="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>

              <!-- Media preview -->
              <div v-if="pub.media && pub.media.length > 0" class="px-3 sm:px-5 pb-2 sm:pb-3">
                <div class="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <div v-for="(item, idx) in pub.media" :key="idx" 
                       @click="abrirVisor(item)"
                       class="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-black/40 border border-white/10 cursor-pointer active:scale-95 transition-transform">
                    <img v-if="item.type === 'image'" :src="item.url" class="w-full h-full object-cover">
                    <div v-else class="w-full h-full flex items-center justify-center text-[10px] sm:text-sm">🎥</div>
                  </div>
                </div>
              </div>

              <!-- Content preview -->
              <div class="px-3 sm:px-5 pb-2 sm:pb-3" v-if="pub.content">
                <p class="text-[9px] sm:text-[11px] text-gray-300 leading-relaxed line-clamp-2">{{ pub.content }}</p>
              </div>

              <div class="mt-auto">
                <!-- Budget bar (only for active) -->
                <div v-if="pub.estado === 'activa'" class="px-3 sm:px-5 pb-3 sm:pb-4">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest">Resto</span>
                    <span class="text-[8px] sm:text-[9px] font-black" :class="getBudgetColor(pub)">
                      $ {{ parseFloat(pub.presupuesto_restante || 0).toFixed(0) }}
                    </span>
                  </div>
                  <div class="w-full h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all" :class="getBudgetBarClass(pub)" :style="{ width: getBudgetPercent(pub) + '%' }"></div>
                  </div>
                </div>

                <!-- Amount info for non-active -->
                <div v-else class="px-3 sm:px-5 pb-3 sm:pb-4">
                  <div class="bg-[#0d121f] border border-white/5 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between">
                    <span class="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest">Presupuesto</span>
                    <span class="text-[9px] sm:text-xs font-black text-white">$ {{ parseFloat(pub.presupuesto || 0).toFixed(0) }}</span>
                  </div>
                </div>

                <!-- Stats row -->
                <div class="flex items-center gap-0 border-t border-white/5 divide-x divide-white/5">
                  <div class="flex-1 py-1.5 sm:py-2 text-center">
                    <p class="text-[6px] sm:text-[7px] font-black text-gray-600 uppercase tracking-widest">Int.</p>
                    <p class="text-[10px] sm:text-xs font-black text-white">{{ pub.total_interacciones || 0 }}</p>
                  </div>
                  <div class="flex-1 py-1.5 sm:py-2 text-center">
                    <p class="text-[6px] sm:text-[7px] font-black text-gray-600 uppercase tracking-widest">Fecha</p>
                    <p class="text-[8px] sm:text-[9px] font-black text-gray-400 truncate px-1">{{ formatDate(pub.fecha) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- ====== MODAL DE PAGO ====== -->
    <Transition name="fade">
      <div v-if="showPaymentModal" @click.self="!isPayingPub && (showPaymentModal = false)"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-6 w-full max-w-sm shadow-2xl animate-modal-in max-h-[90vh] overflow-y-auto">
          
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-black text-white uppercase tracking-tight">Registrar Pago</h3>
              <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Completa el proceso de tu publicación</p>
            </div>
            <button :disabled="isPayingPub" @click="showPaymentModal = false" class="text-gray-500 hover:text-white transition-colors disabled:opacity-30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Amount badge -->
          <div class="bg-violet-500/10 border border-violet-500/20 p-4 rounded-2xl mb-5 text-center">
            <span class="text-[10px] text-violet-400 font-black uppercase tracking-widest block mb-1">Total a Pagar</span>
            <span class="text-3xl font-black text-white">$ {{ parseFloat(selectedPub?.presupuesto || 0).toFixed(2) }}</span>
          </div>

          <div class="space-y-5">
            <!-- Bank selector -->
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Selecciona Forma de Pago</label>
              <multiselect
                v-model="payment.selectedAccountObj"
                :options="bankAccounts"
                :searchable="false"
                label="banco"
                track-by="id_cuenta"
                class="multiselect-custom-dark"
                placeholder="-- Elige una opción --"
                select-label=""
                deselect-label=""
                selected-label=""
              />
            </div>

            <!-- Account details -->
            <div v-if="payment.selectedAccountObj" class="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
              <div class="flex justify-between items-center text-[10px] uppercase font-bold">
                <span class="text-gray-500">Banco:</span>
                <span class="text-white">{{ payment.selectedAccountObj.banco }}</span>
              </div>
              
              <div class="flex justify-between items-center text-[10px] uppercase font-bold gap-2">
                <span class="text-gray-500 shrink-0">N° Cuenta:</span>
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="text-white select-all truncate max-w-[120px]" :title="payment.selectedAccountObj.num_cuenta">{{ payment.selectedAccountObj.num_cuenta }}</span>
                  <button
                    @click="copyToClipboard(payment.selectedAccountObj.num_cuenta).then(() => { copiedAccount = true; setTimeout(() => copiedAccount = false, 1500) })"
                    class="shrink-0 text-gray-400 hover:text-emerald-400 active:scale-90 transition-all"
                  >
                    <svg v-if="!copiedAccount" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <svg v-else class="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="flex justify-between items-center text-[10px] uppercase font-bold">
                <span class="text-gray-500">Titular:</span>
                <span class="text-white">{{ payment.selectedAccountObj.beneficiario }}</span>
              </div>
              <div class="flex justify-between items-center text-[10px] uppercase font-bold">
                <span class="text-gray-500">Tipo:</span>
                <span class="text-white">{{ payment.selectedAccountObj.tipo }}</span>
              </div>
            </div>

            <!-- Comprobante number -->
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">N° Comprobante</label>
              <input v-model="payment.numComprobante" type="text" placeholder="Ej: 9812739"
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-violet-500 transition-all text-white font-bold text-sm">
            </div>

            <!-- Buttons -->
            <div class="flex flex-col gap-3 pt-2">
              <button @click="confirmarPago" :disabled="isPayingPub || !payment.selectedAccountObj || !payment.numComprobante"
                class="w-full py-4 bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                <svg v-if="isPayingPub" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                {{ isPayingPub ? 'Enviando...' : 'Confirmar y Enviar' }}
              </button>
              <button :disabled="isPayingPub" @click="showPaymentModal = false" class="w-full py-2 text-gray-500 font-bold uppercase tracking-widest text-[10px] disabled:opacity-30">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ====== VISOR DE MEDIOS (Lightbox) ====== -->
    <Transition name="fade">
      <div v-if="showMediaViewer" class="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 cursor-pointer" @click="cerrarVisor">
        
        <!-- Media Container -->
        <div class="w-full h-full flex items-center justify-center overflow-hidden">
          <img v-if="mediaToView?.type === 'image'" 
            :src="mediaToView.url" 
            class="max-w-[95vw] max-h-[85vh] object-contain animate-modal-in shadow-2xl rounded-lg"
          >
          <video v-else-if="mediaToView?.type === 'video'" 
            :src="mediaToView.url" 
            controls autoplay 
            class="max-w-[95vw] max-h-[85vh] rounded-2xl animate-modal-in shadow-2xl"
          ></video>
        </div>

        <!-- Info/Instructions -->
        <div class="absolute bottom-10 text-white/40 text-[10px] font-bold uppercase tracking-widest pointer-events-none">
          Toca en cualquier parte para cerrar
        </div>
      </div>
    </Transition>

    <!-- ====== MODAL DE ESTADÍSTICAS SEGMENTADAS ====== -->
    <Transition name="fade">
      <div v-if="showStatsModal" @click.self="showStatsModal = false"
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-6 w-full max-w-md shadow-2xl animate-modal-in max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-black text-white uppercase tracking-tight">Estadísticas de Audiencia</h3>
              <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Segmentación detallada</p>
            </div>
            <button @click="showStatsModal = false" class="text-gray-500 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div v-if="loadingStats" class="py-12 flex flex-col items-center justify-center gap-4">
            <svg class="animate-spin h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            <p class="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Cargando métricas...</p>
          </div>

          <div v-else-if="selectedPubStats" class="space-y-8"> 

            <!-- Desglose de Interacciones -->
            <div class="space-y-3">
              <h4 class="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-4 h-px bg-emerald-500/30"></span> Tipos de Interacción
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div v-if="selectedPubStats.desgloseInteracciones.like > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">❤️</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Likes</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.like }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.share > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">↗️</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Compartidos</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.share }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.visita_whatsapp > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">📱</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">WhatsApp</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.visita_whatsapp }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.visita_web > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">🌐</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Web</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.visita_web }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.poll > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">📊</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Encuestas</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.poll }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.video_view > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">🎥</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Vistas Video</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.video_view }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.click > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">🖱️</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Clicks</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.click }}</p>
                </div>
                <div v-if="selectedPubStats.desgloseInteracciones.vista > 0" class="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span class="text-[14px] mb-1">👁️</span>
                  <p class="text-[7px] font-black text-gray-500 uppercase tracking-tighter">Vistas</p>
                  <p class="text-sm font-black text-white">{{ selectedPubStats.desgloseInteracciones.vista }}</p>
                </div>
              </div>
            </div>

            <!-- Por Ciudad -->
            <div class="space-y-3">
              <h4 class="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-4 h-px bg-violet-500/30"></span> Alcance por Ciudad
              </h4>
              <div class="space-y-3">
                <div v-for="c in selectedPubStats.vistasPorCiudad" :key="c.nombre" class="space-y-1.5">
                  <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span class="text-gray-300">{{ c.nombre }}</span>
                    <span class="text-white">{{ c.total }}</span>
                  </div>
                  <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-violet-500 rounded-full transition-all duration-1000" 
                      :style="{ width: ((selectedPubStats.totalVistas + selectedPubStats.totalInteracciones) > 0 ? (c.total / (selectedPubStats.totalVistas + selectedPubStats.totalInteracciones) * 100) : 0) + '%' }"></div>
                  </div>
                </div>
                <p v-if="selectedPubStats.vistasPorCiudad.length === 0" class="text-center text-[9px] text-gray-600 font-bold uppercase py-4">Sin datos de ubicación</p>
              </div>
            </div>

            <!-- Por Género -->
            <div class="space-y-3">
              <h4 class="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-4 h-px bg-emerald-500/30"></span> Alcance por Género
              </h4>
              <div class="flex items-center gap-4">
                <div v-for="g in selectedPubStats.interaccionesPorGenero" :key="g.genero" 
                  v-show="g.total > 0"
                  class="flex-1 text-center space-y-1">
                  <div class="text-[8px] font-black text-gray-500 uppercase tracking-tighter">{{ g.genero }}</div>
                  <div class="text-lg font-black text-white">{{ g.total }}</div>
                  <div class="text-[8px] font-bold text-gray-600">{{ ((selectedPubStats.totalInteracciones + selectedPubStats.totalVistas) > 0 ? Math.round(g.total / (selectedPubStats.totalInteracciones + selectedPubStats.totalVistas) * 100) : 0) }}%</div>
                </div>
                <p v-if="selectedPubStats.totalInteracciones === 0 && selectedPubStats.totalVistas === 0" class="w-full text-center text-[9px] text-gray-600 font-bold uppercase py-4">Sin datos de género</p>
              </div>
            </div>

            <!-- Por Edad -->
            <div class="space-y-3">
              <h4 class="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-4 h-px bg-blue-500/30"></span> Alcance por Edad
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="e in selectedPubStats.vistasPorEdad" :key="e.rango" 
                  v-show="e.total > 0"
                  class="flex items-center gap-3">
                  <span class="text-[9px] font-black text-gray-500 w-10 shrink-0">{{ e.rango }}</span>
                  <div class="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full" :style="{ width: ((selectedPubStats.totalVistas + selectedPubStats.totalInteracciones) > 0 ? (e.total / (selectedPubStats.totalVistas + selectedPubStats.totalInteracciones) * 100) : 0) + '%' }"></div>
                  </div>
                  <span class="text-[9px] font-black text-white shrink-0">{{ e.total }}</span>
                </div>
              </div>
              <p v-if="(selectedPubStats.totalVistas + selectedPubStats.totalInteracciones) === 0" class="text-center text-[9px] text-gray-600 font-bold uppercase py-4">Sin datos de edad</p>
            </div>

          </div>
        </div>
      </div>
    </Transition>

    <BottomNav />

    <!-- ====== MODAL DE ELIMINACIÓN ====== -->
    <Transition name="fade">
      <div v-if="showDeleteModal" @click.self="!isDeleting && (showDeleteModal = false)"
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2rem] p-6 w-full max-w-xs shadow-2xl animate-modal-in text-center">
          <div class="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            🗑️
          </div>
          <h3 class="text-lg font-black text-white uppercase tracking-tight mb-2">¿Eliminar publicación?</h3>
          <p class="text-xs text-gray-400 font-medium mb-6">Esta acción no se puede deshacer y perderás el alcance acumulado.</p>
          
          <div class="grid grid-cols-2 gap-3">
            <button @click="showDeleteModal = false" :disabled="isDeleting"
              class="py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all disabled:opacity-30">
              Cancelar
            </button>
            <button @click="confirmDelete" :disabled="isDeleting"
              class="py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl shadow-lg shadow-red-900/20 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2">
              <svg v-if="isDeleting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              {{ isDeleting ? '...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/middleware/auth.store'
import MobileHeader from '~/components/headers/MobileHeader.vue'
import BottomNav from '~/components/footers/BottomNav.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'
import Multiselect from 'vue-multiselect'

const auth = useAuthStore()
const { $api } = useNuxtApp()

// --- ESTADOS ---
const isLoading = ref(true)
const isSubmitting = ref(false)
const isMembershipActive = ref(false)
const totalEarnings = ref(0)
const showPoll = ref(false)
const loadingPubs = ref(false)
const misPublicaciones = ref([])
const bankAccounts = ref([])
const empresaPhoneNumber = ref('')

// Payment modal state
const showPaymentModal = ref(false)
const isPayingPub = ref(false)
const selectedPub = ref(null)

// Media viewer state
const showMediaViewer = ref(false)
const mediaToView = ref(null) // { url, type }

const payment = ref({
  selectedAccountObj: null,
  numComprobante: ''
})

// Deletion modal state
const showDeleteModal = ref(false)
const pubToDelete = ref(null)
const isDeleting = ref(false)

// Stats modal state
const showStatsModal = ref(false)
const selectedPubStats = ref(null)
const loadingStats = ref(false)

const post = ref({
  content: '',
  external_url: '',
  whatsapp_active: false,
  whatsapp_number: '',
  presupuesto: 200,
  poll: { question: '', options: ['', ''], correct_index: 0 },
  target_id_ciudad: null,
  target_genero: 'todos',
  target_edad_min: 18,
  target_edad_max: 65
})
const copyToClipboard = async (text) => {
  try {
    if (!text) return
    
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
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
    return successful
  } catch (err) {
    console.error('Error al copiar:', err)
    return false
  }
}
const copyLink = async () => {
  if (process.client) {
    const success = await copyToClipboard(referralLink.value)
    if (success) {
      copied.value = true
      setTimeout(() => copied.value = false, 2000)
    }
  }
}
const showTargeting = ref(false)
const ciudades = ref([])
const selectedCiudadObj = ref(null)

const generosOptions = [
  { label: 'Todos', value: 'todos' },
  { label: 'Masculino', value: 'masculino' },
  { label: 'Femenino', value: 'femenino' }
]

const selectedFiles = ref([])
const toast = ref({ show: false, message: '', type: 'info' })

// --- COMPUTED ---
const canSubmit = computed(() => {
  const contentOk = post.value.content.trim().length > 0 || selectedFiles.value.length > 0
  const isAdmin = auth.user?.role === 'sa' || auth.user?.role === 'admin'
  const budgetOk = isAdmin ? true : post.value.presupuesto >= 10
  const whatsappOk = !post.value.whatsapp_active || (post.value.whatsapp_number && post.value.whatsapp_number.length >= 8)
  
  if (showPoll.value) {
    const pollOk = post.value.poll.question.trim().length > 0 && post.value.poll.options.every(o => o.trim().length > 0)
    return contentOk && pollOk && budgetOk && whatsappOk
  }
  return contentOk && budgetOk && whatsappOk
})

// --- HELPERS ---
const showMsg = (message, type = 'info') => { toast.value = { show: true, message, type } }

const getStatusLabel = (estado) => {
  const map = {
    pendiente_pago: '💳 Pendiente de Pago',
    verificando_pago: '⏳ Verificando Pago',
    activa: '🟢 Activa',
    borrada: '⚫ Finalizada',
    rechazada: '🔴 Pago Rechazado',
    reportada: '🚩 Reportada'
  }
  return map[estado] || estado
}

const getStatusClass = (estado) => {
  const map = {
    pendiente_pago: 'bg-amber-500/20 text-amber-400',
    verificando_pago: 'bg-blue-500/20 text-blue-400',
    activa: 'bg-emerald-500/20 text-emerald-400',
    borrada: 'bg-gray-500/20 text-gray-400',
    rechazada: 'bg-red-500/20 text-red-400',
    reportada: 'bg-orange-500/20 text-orange-400'
  }
  return map[estado] || 'bg-gray-500/20 text-gray-400'
}

const getBudgetPercent = (pub) => {
  const total = parseFloat(pub.presupuesto || 0)
  const remaining = parseFloat(pub.presupuesto_restante || 0)
  if (total <= 0) return 0
  return Math.max(0, Math.min(100, (remaining / total) * 100))
}

const getBudgetColor = (pub) => {
  const pct = getBudgetPercent(pub)
  if (pct > 60) return 'text-emerald-400'
  if (pct > 25) return 'text-amber-400'
  return 'text-red-400'
}

const getBudgetBarClass = (pub) => {
  const pct = getBudgetPercent(pub)
  if (pct > 60) return 'bg-gradient-to-r from-emerald-500 to-teal-500'
  if (pct > 25) return 'bg-gradient-to-r from-amber-400 to-orange-500'
  return 'bg-gradient-to-r from-red-500 to-red-600'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: '2-digit' })
}

// --- DATA FETCH ---
const fetchMembershipStatus = async () => {
  try {
    const data = await $api(`/membresia/${auth.user.id_usuario}`)
    isMembershipActive.value = data?.data?.estado === 'activa'
  } catch { isMembershipActive.value = false }
}

const fetchMisPublicaciones = async () => {
  loadingPubs.value = true
  try {
    const data = await $api(`/publicaciones/mis-publicaciones/${auth.user.id_usuario}`)
    if (data?.success) misPublicaciones.value = data.data
  } catch (e) { console.error(e) } finally { loadingPubs.value = false }
}

const fetchBankAccounts = async () => {
  try {
    const data = await $api('/cuentas')
    if (data) bankAccounts.value = data
  } catch (e) {
    console.error('Error loading bank accounts:', e)
  }
}

const fetchCiudades = async () => {
  try {
    const data = await $api('/ciudad')
    if (data) ciudades.value = data
  } catch (e) {
    console.error('Error loading cities:', e)
  }
}

const fetchEmpresaPhoneNumber = async () => {
  try {
    const response = await $api('/config/valor/numero_empresa', { method: 'GET' });
    if (response && response.valor) {
      empresaPhoneNumber.value = response.valor;
    } else {
      empresaPhoneNumber.value = '1234567890';
    }
  } catch (error) {
    console.error('Error al obtener el número de teléfono de la empresa:', error);
    empresaPhoneNumber.value = '1234567890';
  }
};

const sendWhatsAppMessage = async (amount, receiptNumber, publicationId, bankName) => {
  try {
    if (!empresaPhoneNumber.value) {
      await fetchEmpresaPhoneNumber();
    }
    
    const today = new Date();
    const formattedDate = [
      String(today.getDate()).padStart(2, '0'),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getFullYear()).slice(-2)
    ].join('');
    
    const message = `*Comprobante de Pago (Publicidad)*\n\n` +
      `*ID de Publicación:* PUB-${formattedDate}-${publicationId || 'N/A'}\n` +
      `*Tipo de pago:* Pago de Publicidad\n` + 
      `*N° de comprobante:* ${receiptNumber}\n` +
      `*Banco destino:* ${bankName || 'N/A'}\n` +
      `*Monto:* $ ${Number(amount).toFixed(2)}\n\n` +
      `Adjunto una captura del comprobante de pago para su verificación.`;
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = empresaPhoneNumber.value;
    
    window.open(`https://wa.me/+504${phoneNumber}?text=${encodedMessage}`, '_blank');
  } catch (error) {
    console.error('Error al preparar el mensaje de WhatsApp:', error);
  }
};

// --- MEDIA VIEWER ---
const abrirVisor = (item) => {
  mediaToView.value = item
  showMediaViewer.value = true
}

const cerrarVisor = () => {
  showMediaViewer.value = false
  mediaToView.value = null
}

const abrirModalPago = (pub) => {
  selectedPub.value = pub
  payment.value = { 
    selectedAccountObj: null, 
    numComprobante: ''
  }
  showPaymentModal.value = true
}

const confirmarPago = async () => {
  if (!payment.value.selectedAccountObj || !payment.value.numComprobante) return
  isPayingPub.value = true
  try {
    const res = await $api(`/publicaciones/${selectedPub.value.id_publicacion}/pago`, {
      method: 'POST',
      body: {
        id_cuenta_pago: payment.value.selectedAccountObj.id_cuenta,
        num_comprobante: payment.value.numComprobante
      }
    })
    if (res?.success) {
      showMsg('✅ Pago registrado. Tu publicación está en revisión.', 'success')
      showPaymentModal.value = false
      await fetchMisPublicaciones()

      // Enviar notificación por WhatsApp
      await sendWhatsAppMessage(
        selectedPub.value.presupuesto, 
        payment.value.numComprobante, 
        selectedPub.value.id_publicacion,
        payment.value.selectedAccountObj?.banco
      );
    } else {
      showMsg(res?.message || 'Error al registrar pago', 'error')
    }
  } catch (error) {
    showMsg(error?.response?._data?.message || 'Error de conexión', 'error')
  } finally {
    isPayingPub.value = false
  }
}

// --- FILE HANDLING ---
const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  if (selectedFiles.value.length + files.length > 5) { showMsg('Máximo 5 archivos', 'error'); return }
  files.forEach(file => {
    const currentSize = selectedFiles.value.reduce((a, f) => a + f.file.size, 0)
    if (currentSize + file.size > 10 * 1024 * 1024) { showMsg('Límite de 10MB superado', 'error'); return }
    const reader = new FileReader()
    reader.onload = (ev) => selectedFiles.value.push({ file, preview: file.type.startsWith('image/') ? ev.target.result : null, type: file.type })
    reader.readAsDataURL(file)
  })
  if (e.target) e.target.value = ''
}

const removeFile = (index) => { selectedFiles.value.splice(index, 1) }

// --- POLL HELPERS ---
const addOption = () => {
  if (post.value.poll.options.length < 6) {
    post.value.poll.options.push('')
  } else {
    showMsg('Máximo 6 opciones permitidas', 'info')
  }
}

const removeOption = (index) => {
  if (post.value.poll.options.length <= 2) {
    showMsg('Mínimo 2 opciones requeridas', 'info')
    return
  }
  
  post.value.poll.options.splice(index, 1)
  
  // Ajustar correct_index si es necesario
  if (post.value.poll.correct_index === index) {
    post.value.poll.correct_index = 0
  } else if (post.value.poll.correct_index > index) {
    post.value.poll.correct_index--
  }
}

const compressImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (ev) => {
    const img = new Image()
    img.src = ev.target.result
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let w = img.width, h = img.height
      if (w > 1200) { h *= 1200 / w; w = 1200 }
      if (h > 1200) { w *= 1200 / h; h = 1200 }
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      canvas.toBlob(blob => blob ? resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() })) : reject(), 'image/jpeg', 0.6)
    }
    img.onerror = reject
  }
  reader.onerror = reject
})

// --- SUBMIT POST ---
const submitPost = async () => {
  if (!canSubmit.value) return
  isSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('id_usuario', auth.user.id_usuario)
    fd.append('content', post.value.content)
    fd.append('presupuesto', post.value.presupuesto)
    if (post.value.external_url) fd.append('external_url', post.value.external_url)
    fd.append('whatsapp_active', post.value.whatsapp_active)
    if (post.value.whatsapp_active && post.value.whatsapp_number) {
      fd.append('whatsapp_number', post.value.whatsapp_number)
    }
    
    // Segmentación
    if (showTargeting.value) {
      if (post.value.target_id_ciudad) fd.append('target_id_ciudad', post.value.target_id_ciudad)
      fd.append('target_genero', post.value.target_genero)
      fd.append('target_edad_min', post.value.target_edad_min)
      fd.append('target_edad_max', post.value.target_edad_max)
    }

    if (showPoll.value) fd.append('poll_data', JSON.stringify(post.value.poll))
    for (const item of selectedFiles.value) {
      let f = item.file
      if (item.type.startsWith('image/')) { try { f = await compressImage(item.file) } catch {} }
      fd.append('media', f)
    }

    const res = await $api('/publicaciones', { method: 'POST', body: fd })
    if (res?.success) {
      // Reset form
      post.value = { 
        content: '', 
        external_url: '', 
        whatsapp_active: false, 
        whatsapp_number: auth.user.telefono || '',
        presupuesto: 200, 
        poll: { question: '', options: ['', ''], correct_index: 0 } 
      }
      showPoll.value = false
      selectedFiles.value = []
      await fetchMisPublicaciones()
      
      const isAdmin = auth.user?.role === 'sa' || auth.user?.role === 'admin'
      if (isAdmin) {
        showMsg('✅ ¡Publicado con éxito!', 'success')
      } else {
        // Open payment modal for the newly created publication
        const newPub = misPublicaciones.value[0]
        if (newPub) setTimeout(() => abrirModalPago(newPub), 400)
      }
    } else {
      showMsg(res?.message || 'Error al publicar', 'error')
    }
  } catch (error) {
    showMsg(error?.response?._data?.message || 'Error de conexión', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const eliminarPublicacion = (id) => {
  pubToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!pubToDelete.value) return
  isDeleting.value = true
  try {
    await $api(`/publicaciones/${pubToDelete.value}`, { method: 'DELETE' })
    misPublicaciones.value = misPublicaciones.value.filter(p => p.id_publicacion !== pubToDelete.value)
    showMsg('Publicación eliminada', 'success')
    showDeleteModal.value = false
  } catch { 
    showMsg('Error al eliminar', 'error') 
  } finally {
    isDeleting.value = false
    pubToDelete.value = null
  }
}

const verEstadisticas = async (pub) => {
  selectedPub.value = pub
  showStatsModal.value = true
  loadingStats.value = true
  try {
    const res = await $api(`/publicaciones/${pub.id_publicacion}/stats`)
    if (res?.success) {
      selectedPubStats.value = res.data
    }
  } catch (e) {
    console.error(e)
    showMsg('Error al cargar estadísticas', 'error')
  } finally {
    loadingStats.value = false
  }
}

onMounted(async () => {
  if (!auth.isAuthenticated) return navigateTo('/')
  await Promise.all([
    fetchMembershipStatus(),
    fetchBankAccounts(),
    fetchCiudades(),
    (async () => {
      try {
        const c = await $api(`/credito/usuario/${auth.user.id_usuario}`)
        if (c?.success) totalEarnings.value = parseFloat(c.data.monto_credito || 0)
      } catch {}
    })(),
    fetchMisPublicaciones(),
    // Asegurar que tenemos el teléfono del usuario
    (async () => {
      if (!auth.user?.telefono) {
        await auth.fetchUser()
      }
    })()
  ])
  
  if (auth.user?.telefono) {
    post.value.whatsapp_number = auth.user.telefono
  }
  
  isLoading.value = false
})

// SEO and Meta
useHead({
  title: 'PubliGana - Crea Publicación',
  meta: [
    { name: 'description', content: 'Crea publicaciones y gestiona tu alcance en la comunidad PubliGana.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.9, user-scalable=no' }
  ]
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes modal-in { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.animate-modal-in { animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Multiselect dark theme */
.multiselect-custom-dark :deep(.multiselect__tags) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important;
  color: white !important;
  min-height: 48px !important;
  padding: 8px 40px 0 12px !important;
}

.multiselect-custom-dark :deep(.multiselect__single), 
.multiselect-custom-dark :deep(.multiselect__placeholder) {
  background: transparent !important;
  color: #9ca3af !important;
  font-weight: 700 !important;
  font-size: 12px !important;
  margin-top: 4px !important;
}

.multiselect-custom-dark :deep(.multiselect__content-wrapper) {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important;
  z-index: 200 !important;
}

.multiselect-custom-dark :deep(.multiselect__option) {
  background: transparent;
  color: #e5e7eb;
  font-size: 12px;
  font-weight: 700;
  padding: 12px 16px !important;
}

.multiselect-custom-dark :deep(.multiselect__option--highlight) {
  background: transparent !important;
  color: white !important;
}
</style>
