<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white selection:bg-emerald-500/30 overflow-x-hidden">
    <!-- Loading Spinner -->
    <LoadingSpinner :loading="isLoading" />

    <!-- Main Header -->
    <MobileHeader :earnings="totalEarnings" :has-membership="hasMembership" />

    <!-- Content Container with max-w-2xl to match copy.vue -->
    <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      <main class="pt-16 pb-4">
        <!-- Missions Section (Daily + Special) -->
        <section :class="['px-2 pt-1 pb-4 grid gap-3', misionesEspeciales.length > 0 ? 'grid-cols-2' : 'grid-cols-1']">
          <!-- Daily Missions Launcher -->
          <button @click="showDailyModal = true" class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden group active:scale-95 transition-all text-left">
            <div class="absolute -top-4 -right-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
            <div class="flex flex-col gap-2 relative">
              <div class="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-sm">
                <span class="text-white text-sm">🎯</span>
              </div>
              <div>
                <h3 class="text-xs font-black text-gray-900 dark:text-white leading-tight uppercase">Misión Diaria</h3>
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  {{ isMissionsCompleted ? (rewardClaimed ? 'Reclamada' : '¡Lista!') : 'Ver progreso' }}
                </p>
              </div>
            </div>
          </button>

          <!-- Special Missions Launcher -->
          <button v-if="misionesEspeciales.length > 0" @click="showSpecialModal = true" class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden group active:scale-95 transition-all text-left">
            <div class="absolute -top-4 -right-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
            <div class="flex flex-col gap-2 relative">
              <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span class="text-white text-sm">⚡</span>
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <h3 class="text-xs font-black text-gray-900 dark:text-white leading-tight uppercase text-nowrap">Especiales</h3>
                  <span class="flex h-2 w-2 relative" v-if="misionesEspeciales.some(m => !m.claimStatus)">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                </div>
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  {{ misionesEspeciales.length }} disponibles
                </p>
              </div>
            </div>
          </button>
        </section> 


        <!-- Card-Based Feed -->
        <div class="space-y-6 px-2">
          <article v-for="post in feedPosts" :key="post.id"
                   :data-post-id="post.id"
                   class="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none post-observer">
            
            <!-- Simplified Post Header -->
            <div class="p-3 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
                <img :src="post.userAvatar" class="w-full h-full object-cover">
              </div>
              <div class="flex flex-col">
                <h3 class="font-black text-[13px] text-gray-900 dark:text-white leading-none mb-1">{{ post.author }}</h3>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ post.time }}</span>
              </div>
            </div>

            <!-- Media Content (Fixed Size) -->
            <div class="relative w-full aspect-square bg-black overflow-hidden">
              <MediaCarousel 
                :media="post.media" 
                @video-complete="handleVideoComplete(post)"
                @media-click="(item) => abrirVisor(item)"
              />
            </div>

            <!-- Interaction Bar & Footer -->
            <div class="p-4">
              <!-- Icons Row -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-4">
                  <button @click="handleLike(post)" class="active:scale-125 transition-transform">
                    <svg class="w-6 h-6" :class="post.liked ? 'text-rose-500 fill-current' : 'text-gray-900 dark:text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  </button>
                  <button @click="handleShare(post)" class="active:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                  </button>
                  
                  <!-- Poll/Link icons -->
                  <button v-if="post.poll" @click="handlePoll(post)" class="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center active:scale-110 transition-transform">
                    <span class="text-xs">📊</span>
                  </button>
                  <button v-if="post.link" @click="handleLink(post)" class="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center active:scale-110 transition-transform">
                    <span class="text-xs">🔗</span>
                  </button>
                  <button v-if="post.whatsapp_active" @click="handleWhatsApp(post)" class="w-7 h-7 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center active:scale-110 transition-transform">
                    <svg class="w-4 h-4 text-[#25D366] fill-current" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12.01 2.01c-5.52 0-10 4.48-10 10c0 1.76.46 3.42 1.25 4.87L2.01 22l5.31-1.39c1.37.74 2.93 1.16 4.59 1.16c5.52 0 10-4.48 10-10s-4.48-10-10-10m.1 1.75c4.56.09 8.24 3.76 8.24 8.32c0 4.6-3.72 8.35-8.35 8.35c-1.58 0-3.04-.44-4.32-1.21l-.31-.18l-3.1.81l.82-3.01l-.2-.33a8.216 8.216 0 0 1-1.3-4.44c0-4.56 3.7-8.22 8.25-8.31"></path><path d="M15.83 13.91c-.24-.12-1.42-.7-1.64-.78c-.22-.08-.38-.12-.54.12c-.16.24-.62.78-.76.94c-.14.16-.28.18-.52.06c-.24-.12-1.02-.37-1.94-1.19c-.71-.64-1.2-1.42-1.34-1.66c-.14-.24-.02-.37.1-.49c.11-.11.24-.28.36-.42c.12-.14.16-.24.24-.4s.04-.32-.02-.44c-.06-.12-.54-1.3-.74-1.78c-.2-.48-.39-.42-.54-.42c-.14 0-.3 0-.46.02c-.16.02-.42.06-.63.29c-.21.23-.81.79-.81 1.94c0 1.15.83 2.26.95 2.42c.12.16 1.64 2.5 3.98 3.51c.56.24.99.38 1.33.49c.56.18 1.07.15 1.47.09c.45-.07 1.42-.58 1.62-1.14c.2-.56.2-1.04.14-1.14c-.06-.1-.22-.16-.46-.28"></path></svg>
                  </button>
                </div>

                <!-- Money Icon -->
                <div v-if="post.canEarn" class="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                  <span class="text-sm">💰</span>
                </div>
              </div>

              <!-- Description -->
              <div class="space-y-1.5 mb-3">
                <p class="text-[12.5px] leading-snug text-gray-700 dark:text-gray-200 tracking-tight">
                  <span class="font-black text-gray-900 dark:text-white mr-1 text-[13px] tracking-tighter">{{ post.author }}</span>
                  {{ post.content }}
                </p>
              </div>

              <!-- Mission Bar -->
              <div v-if="post.hasVideo && !post.videoCompleted" class="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-2.5 rounded-xl flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span class="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400">Ver video completo para ganar</span>
                </div>
                <span class="text-[11px] font-black text-gray-900 dark:text-white">$ {{ post.gain }}</span>
              </div>
            </div>
          </article>
        </div>

        <!-- Infinite Scroll Trigger & Loading States -->
        <div ref="infiniteScrollTrigger" class="py-4 flex flex-col items-center justify-center space-y-4">
          <div v-if="isPostsLoading" class="flex flex-col items-center">
            <div class="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Cargando más publicaciones...</p>
          </div>
          
          <div v-else-if="postsError" class="text-center px-6">
            <p class="text-sm font-bold text-rose-500 mb-3">{{ postsError }}</p>
            <button @click="fetchPosts(false, rewardsConfig)" class="px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 active:scale-95 transition-transform">
              Reintentar carga
            </button>
          </div> 
        </div>
      </main>
    </div>

    <!-- Navigation -->
    <BottomNav />

    <!-- Performance Toast -->
    <Toast 
      :show="toast.show" 
      :message="toast.message" 
      :type="toast.type" 
      @close="toast.show = false" 
    />

    <!-- Poll Modal (Reusing Marketplace logic) -->
    <Transition name="bottom-sheet">
       <div 
         v-if="pollModal.show" 
         class="fixed inset-0 z-[120] flex flex-col justify-end isolate"
         @touchmove.stop
       >
         <!-- Backdrop - Optimized for performance -->
         <div 
           class="absolute inset-0 bg-black/60 bs-backdrop"
           @click="pollModal.show = false"
           @touchmove.prevent.stop
         ></div>

         <!-- Modal Content -->
         <div 
           class="relative w-full bg-white dark:bg-gray-900 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden max-h-[70vh] flex flex-col bs-content"
           @touchmove.stop
         >
           <!-- Cabecera Técnica -->
           <div class="w-full flex items-center justify-between px-6 py-4 absolute top-0 left-0 z-20 pointer-events-none">
              <div class="w-10 h-1 bg-gray-200 dark:bg-white/10 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3"></div>
              <div class="flex-1"></div>
              <button 
                 @click="pollModal.show = false"
                 class="w-9 h-9 rounded-full bg-gray-50 dark:bg-white/5 backdrop-blur-xl text-gray-900 dark:text-white flex items-center justify-center active:scale-90 transition-transform pointer-events-auto border border-gray-100 dark:border-white/10"
              >
                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>

           <!-- Área de Scroll Interno -->
           <div class="overflow-y-auto overscroll-contain no-scrollbar pt-12 pb-8">
              <div class="px-6">
                <!-- Poll Info -->
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <span class="text-xl">📊</span>
                  </div>
                  <div>
                    <h2 class="text-lg font-black text-white leading-tight">Encuesta Rápida</h2>
                    <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest transition-opacity duration-300">Responde y gana beneficios</p>
                  </div>
                </div>

                <h3 class="text-[16px] font-bold text-gray-900 dark:text-white mb-6 leading-snug">
                  {{ pollModal.post?.poll?.question }}
                </h3>

                <div class="space-y-3">
                  <button v-for="option in pollModal.post?.poll?.options" :key="option"
                          @click="submitPollAnswer(option)"
                          class="w-full p-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-left text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-500/10 hover:border-blue-500/30 dark:hover:text-white transition-all active:scale-[0.98] flex items-center justify-between group shadow-sm">
                    <span>{{ option }}</span>
                    <div class="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-white/20 group-hover:border-blue-500 transition-colors"></div>
                  </button>
                </div>
              </div>
            </div>

           <!-- Pie de página fijo -->
           <div class="p-6 bg-white/95 dark:bg-[#0d121f]/95 backdrop-blur-md border-t border-gray-100 dark:border-white/5">
              <button @click="pollModal.show = false" 
                      class="w-full py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-50 dark:bg-white/5">
                Cerrar Encuesta
              </button>
           </div>
         </div>
       </div>
    </Transition>

    <!-- ====== MODAL MISIONES DIARIAS ====== -->
    <Transition name="bottom-sheet">
       <div v-if="showDailyModal" class="fixed inset-0 z-[120] flex flex-col justify-end isolate">
         <div class="absolute inset-0 bg-black/60 bs-backdrop" @click="showDailyModal = false"></div>
         <div class="relative w-full bg-white dark:bg-gray-900 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden max-h-[80vh] flex flex-col bs-content">
           <div class="w-full flex items-center justify-between px-6 py-4 absolute top-0 left-0 z-20 pointer-events-none">
              <div class="w-10 h-1 bg-gray-200 dark:bg-white/10 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3"></div>
              <div class="flex-1"></div>
              <button @click="showDailyModal = false" class="w-9 h-9 rounded-full bg-gray-50 dark:bg-white/5 backdrop-blur-xl text-gray-900 dark:text-white flex items-center justify-center active:scale-90 transition-transform pointer-events-auto border border-gray-100 dark:border-white/10">
                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>

           <div class="overflow-y-auto overscroll-contain no-scrollbar pt-12 pb-8">
              <div class="px-6">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <span class="text-xl">🎯</span>
                  </div>
                  <div>
                    <h2 class="text-lg font-black text-gray-900 dark:text-white leading-tight">Misiones Diarias</h2>
                    <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Completa y gana recompensas</p>
                  </div>
                </div>

                <div class="space-y-3 mb-8">
                  <div v-for="mission in dailyMissions" :key="mission.id" 
                       class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <div class="flex items-center gap-3">
                      <div class="w-2.5 h-2.5 rounded-full transition-colors duration-500" :class="mission.completed ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'"></div>
                      <span class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ mission.title }}</span>
                    </div>
                    <span class="text-xs font-black transition-colors duration-500" :class="mission.completed ? 'text-emerald-500' : 'text-gray-400'">
                      {{ mission.current }}/{{ mission.goal }}
                    </span>
                  </div>
                </div>

                <button 
                  @click="handleClaimReward"
                  :disabled="!isMissionsCompleted || rewardClaimed"
                  class="w-full py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all duration-300 shadow-xl"
                  :class="[
                    isMissionsCompleted && !rewardClaimed
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 animate-pulse'
                      : rewardClaimed 
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 cursor-not-allowed border border-emerald-200 dark:border-emerald-900/50 shadow-none'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
                  ]"
                >
                  <span v-if="rewardClaimed">Recompensa Reclamada ✅</span>
                  <span v-else-if="isMissionsCompleted">Reclamar $ {{ rewardsConfig.valor_mision }} 💰</span>
                  <span v-else>Recompensa ${{ rewardsConfig.valor_mision }} 💰</span>
                </button>
              </div>
            </div>
         </div>
       </div>
    </Transition>

    <!-- ====== MODAL MISIONES ESPECIALES ====== -->
    <Transition name="bottom-sheet">
       <div v-if="showSpecialModal" class="fixed inset-0 z-[120] flex flex-col justify-end isolate">
         <div class="absolute inset-0 bg-black/60 bs-backdrop" @click="showSpecialModal = false"></div>
         <div class="relative w-full bg-white dark:bg-gray-900 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden max-h-[85vh] flex flex-col bs-content">
           <div class="w-full flex items-center justify-between px-6 py-4 absolute top-0 left-0 z-20 pointer-events-none">
              <div class="w-10 h-1 bg-gray-200 dark:bg-white/10 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3"></div>
              <div class="flex-1"></div>
              <button @click="showSpecialModal = false" class="w-9 h-9 rounded-full bg-gray-50 dark:bg-white/5 backdrop-blur-xl text-gray-900 dark:text-white flex items-center justify-center active:scale-90 transition-transform pointer-events-auto border border-gray-100 dark:border-white/10">
                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>

           <div class="overflow-y-auto overscroll-contain no-scrollbar pt-12 pb-8">
              <div class="px-6">
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                      <span class="text-xl">⚡</span>
                    </div>
                    <div>
                      <h2 class="text-lg font-black text-gray-900 dark:text-white leading-tight">Misiones Especiales</h2>
                      <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Acierta y Gana</p>
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <div v-for="mision in misionesEspeciales" :key="mision.id_mision" 
                       class="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 relative overflow-hidden transition-all duration-500"
                       :class="{ 'opacity-60 grayscale-[0.5]': !canAccessSpecialMission(mision) }">
                    
                    <!-- Badge de Estado de Acceso -->
                    <div v-if="!misionesLimits.isVip && !mision.claimStatus && !canAccessSpecialMission(mision)" 
                         class="absolute inset-0 z-10 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                      <div class="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg mb-3">
                        <span class="text-xl">🔒</span>
                      </div>
                      <h4 class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-1">Límite Diario Alcanzado</h4>
                      <p class="text-[9px] text-gray-500 font-bold mb-3">Disponible en {{ hoursUntilNextMission }} horas.</p>
                      <NuxtLink to="/cliente/red" class="px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform">
                        Adquirir Membresia ⚡
                      </NuxtLink>
                    </div>

                    <div class="relative flex flex-col gap-4">
                      <div class="flex items-start space-x-3">
                        <div class="w-10 h-10 shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                          <span class="text-white text-lg">{{ mision.emoji || '⚡' }}</span>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-0.5">
                            <h3 class="text-sm font-black text-gray-900 dark:text-white leading-tight">
                              {{ mision.titulo }}
                            </h3>
                            <span class="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md text-[8px] font-black uppercase tracking-wider">
                              ESPECIAL
                            </span>
                          </div>
                          <p class="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                            {{ mision.descripcion }}
                          </p>
                        </div>
                      </div>
                      
                      <div class="flex flex-col gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                        <!-- Input for response -->
                        <div v-if="(!mision.claimStatus || mision.claimStatus === 'rechazado') && canAccessSpecialMission(mision)" class="w-full">
                          <!-- Respuesta Escrita -->
                          <input 
                            v-if="mision.tipo_respuesta === 'escrita'"
                            v-model="respuestasMisiones[mision.id_mision]"
                            type="text"
                            placeholder="Escribe tu respuesta aquí..."
                            class="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-inner"
                          >
                          <!-- Selección Única -->
                          <select 
                            v-else-if="mision.tipo_respuesta === 'seleccion'"
                            v-model="respuestasMisiones[mision.id_mision]"
                            class="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all appearance-none shadow-inner"
                          >
                            <option value="" disabled selected>Selecciona una opción...</option>
                            <option v-for="(opc, i) in mision.opciones" :key="i" :value="opc">{{ opc }}</option>
                          </select>
                        </div>

                        <div class="flex items-center justify-between gap-4">
                          <div>
                            <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Recompensa</span>
                            <span class="text-sm font-black text-indigo-600 dark:text-indigo-400">+$ {{ Number(mision.valor).toFixed(2) }}</span>
                          </div>

                          <div v-if="mision.activa === false" class="w-full">
                            <button 
                              @click="abrirWinnersModal(mision)"
                              class="w-full px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all duration-300 bg-violet-500 hover:bg-violet-600 text-white shadow-lg shadow-violet-500/35 hover:scale-105 active:scale-95"
                            >
                              <span>Ver Ganadores 🏆</span>
                            </button>
                          </div>
                          <button 
                            v-else
                            @click="handleClaimSpecialMission(mision)"
                            :disabled="mision.claimStatus === 'pendiente' || mision.claimStatus === 'aprobado' || !canAccessSpecialMission(mision)"
                            class="px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all duration-300 min-w-[140px]"
                            :class="[
                              mision.claimStatus === 'pendiente'
                                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 cursor-not-allowed border border-amber-200 dark:border-amber-900/50'
                                : mision.claimStatus === 'aprobado'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 cursor-not-allowed border border-emerald-200 dark:border-emerald-900/50'
                                  : !canAccessSpecialMission(mision)
                                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-300 dark:border-gray-700'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/35 hover:scale-105 active:scale-95'
                            ]"
                          >
                            <span v-if="mision.claimStatus === 'pendiente'">En Revisión 🕐</span>
                            <span v-else-if="mision.claimStatus === 'aprobado'">Completado ✅</span>
                            <span v-else-if="mision.claimStatus === 'rechazado'">Reintentar ⚡</span>
                            <span v-else-if="!canAccessSpecialMission(mision)">Bloqueado 🔒</span>
                            <span v-else>Reclamar Misión</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         </div>
       </div>
    </Transition>

    <!-- ====== VISOR DE MEDIOS (Lightbox) ====== -->
    <Transition name="fade">
      <div v-if="showMediaViewer" class="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
        
        <!-- Close Button -->
        <button 
          @click="cerrarVisor"
          class="absolute top-4 right-4 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <!-- Media Container -->
        <div class="w-full h-full flex items-center justify-center overflow-hidden">
          <img v-if="mediaToView?.type === 'image'" 
            :src="mediaToView.url" 
            class="max-w-[95vw] max-h-[85vh] object-contain animate-modal-in shadow-2xl rounded-lg"
          >
          <video v-else-if="mediaToView?.type === 'video'" 
            ref="fullscreenVideoRef"
            :src="mediaToView.url" 
            controls autoplay 
            class="max-w-[95vw] max-h-[85vh] rounded-2xl animate-modal-in shadow-2xl"
            @click.stop="toggleFullscreenVideo"
          ></video>
        </div>
      </div>
    </Transition>

    <!-- ====== MODAL GANADORES MISION ESPECIAL ====== -->
    <Transition name="fade">
      <div v-if="showWinnersModal" class="fixed inset-0 z-[180] flex items-center justify-center sm:p-4">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-md" @click="cerrarWinnersModal"></div>
        <div v-if="winnersData" class="bg-white dark:bg-gray-900 border-t sm:border border-gray-200 dark:border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-4 sm:p-6 w-full max-w-2xl relative z-[181] flex flex-col h-[95vh] sm:h-auto sm:max-h-[90vh] mt-auto sm:mt-0">
          
          <!-- Header del Modal -->
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-violet-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <span class="text-xl sm:text-2xl">{{ winnersData.mision.emoji }}</span>
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Ganadores</h3>
                <p class="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5 truncate max-w-[150px] sm:max-w-none">
                  {{ winnersData.mision.titulo }}
                </p>
              </div>
            </div>
            <button @click="cerrarWinnersModal" class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 flex items-center justify-center hover:text-gray-700 dark:hover:text-white transition-all">
              <i class="fas fa-times text-xs sm:text-base"></i>
            </button>
          </div>

          <!-- Contenido Scrolleable -->
          <div class="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-6">
            
            <!-- Resumen de Recompensas -->
            <div class="grid grid-cols-3 gap-2 sm:gap-4">
              <div class="p-3 sm:p-4 bg-violet-500/5 border border-violet-500/10 rounded-xl sm:rounded-2xl text-center">
                <p class="text-[7px] sm:text-[9px] font-black text-violet-500/50 uppercase tracking-widest mb-1">Total</p>
                <p class="text-base sm:text-xl font-black text-violet-600 dark:text-violet-400">${{ parseFloat(winnersData.valorTotal).toFixed(2) }}</p>
              </div>
              <div class="p-3 sm:p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl sm:rounded-2xl text-center">
                <p class="text-[7px] sm:text-[9px] font-black text-emerald-500/50 uppercase tracking-widest mb-1">Ganadores</p>
                <p class="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400">{{ winnersData.totalGanadores }}</p>
              </div>
              <div class="p-3 sm:p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl sm:rounded-2xl text-center">
                <p class="text-[7px] sm:text-[9px] font-black text-amber-500/50 uppercase tracking-widest mb-1">Por Ganador</p>
                <p class="text-base sm:text-xl font-black text-amber-600 dark:text-amber-400">${{ parseFloat(winnersData.recompensaPorGanador).toFixed(2) }}</p>
              </div>
            </div>

            <!-- Lista de Ganadores -->
            <div class="space-y-3" v-if="winnersData.totalGanadores > 0">
              <h4 class="text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Lista de Ganadores</h4>
              <div class="space-y-2">
                <div v-for="(ganador, index) in winnersData.ganadores" :key="ganador.id_reclamo" 
                     class="p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl flex items-center justify-between group transition-all">
                  
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span class="text-xs font-black text-white">#{{ index + 1 }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/10 overflow-hidden flex-shrink-0">
                        <img v-if="ganador.usuario?.imagen_url" :src="ganador.usuario.imagen_url" class="w-full h-full object-cover">
                        <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase">
                          {{ ganador.usuario?.nombre?.charAt(0) || 'U' }}
                        </div>
                      </div>
                      <div class="min-w-0">
                        <p class="text-[10px] sm:text-[11px] font-bold text-gray-900 dark:text-white truncate">{{ ganador.usuario?.nombre || 'Usuario' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="text-right flex-shrink-0 ml-2">
                    <span class="text-[9px] sm:text-[10px] font-black text-violet-600 dark:text-violet-400 tracking-widest">
                      +${{ parseFloat(ganador.monto_otorgado || ganador.monto).toFixed(2) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje si no hay ganadores -->
            <div v-else class="text-center py-8">
              <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-trophy text-gray-400 dark:text-gray-500 text-2xl"></i>
              </div>
              <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No hay ganadores para esta misión</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Invitación a Notificaciones Push -->
    <PushNotificationInvite />
  </div>
</template>

<script setup>
import { useAuthStore } from '~/middleware/auth.store'
import MobileHeader from '~/components/headers/MobileHeader.vue'
import BottomNav from '~/components/footers/BottomNav.vue'
import MediaCarousel from '~/components/ui/MediaCarousel.vue'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import { useInteractionHistory } from '~/composables/useInteractionHistory'
import { usePostsLoader } from '~/composables/usePostsLoader'
import { useExternalNavigation } from '~/composables/useExternalNavigation'
import PushNotificationInvite from '~/components/ui/PushNotificationInvite.vue'

const { $api } = useNuxtApp()
const auth = useAuthStore()
const { markAsStale } = useInteractionHistory()
const { openExternal, initExternalNavigation } = useExternalNavigation()

const { 
  posts: feedPosts, 
  isLoading: isPostsLoading, 
  hasMore, 
  error: postsError, 
  fetchPosts, 
  loadFromCache 
} = usePostsLoader({ limit: 10 })

const isLoading = ref(true)
const shortName = computed(() => auth.user?.nombre?.split(' ')[0] || 'Usuario')

const toast = ref({ show: false, message: '', type: 'success' })
const pollModal = ref({ show: false, post: null })
const showDailyModal = ref(false)
const showSpecialModal = ref(false)

// Media viewer state
const showMediaViewer = ref(false)
const mediaToView = ref(null)
const fullscreenVideoRef = ref(null)

const toggleFullscreenVideo = () => {
  if (fullscreenVideoRef.value) {
    if (fullscreenVideoRef.value.paused) {
      fullscreenVideoRef.value.play()
    } else {
      fullscreenVideoRef.value.pause()
    }
  }
}

// Winners modal state
const showWinnersModal = ref(false)
const winnersData = ref(null)
const isLoadingWinners = ref(false)

// View tracking
const viewedPostIds = ref(new Set())
let viewObserver = null
const viewTimers = {}

const fetchAlreadyViewedPosts = async () => {
  if (!auth.user?.id_usuario) return
  try {
    // Get the user's already viewed posts from our new endpoint
    const res = await $api(`/interacciones/vistas/${auth.user.id_usuario}`)
    if (res && res.success && res.data) {
      res.data.forEach(i => {
        if (i.id_publicacion) {
          viewedPostIds.value.add(i.id_publicacion)
        }
      })
    }
  } catch (e) {
    console.warn('Error fetching viewed posts:', e)
  }
}

const registerView = async (postId) => {
  if (viewedPostIds.value.has(postId)) return
  viewedPostIds.value.add(postId)
  try {
    await $api(`/publicaciones/${postId}/vista`, {
      method: 'POST',
      body: { id_usuario: auth.user.id_usuario }
    })
  } catch (e) {
    console.warn('Error registrando vista:', e)
  }
}

const totalEarnings = ref(0.00) // Will be updated from DB
const rewardsConfig = ref({
  valor_like: 0.05,
  valor_video: 1.50,
  valor_encuesta: 2.50,
  valor_mision: 10.00
})

const hasMembership = ref(false)
const earningsMultiplier = computed(() => hasMembership.value ? 2 : 1)

// Daily & Special Missions Logic
const rewardClaimed = ref(false)
const lastShareAttempt = ref({ id: null, time: null })
const dailyMissions = ref([
  { id: 1, title: 'Dar 3 likes', goal: 3, current: 0, completed: false },
  { id: 2, title: 'Ver 1 video completo', goal: 1, current: 0, completed: false },
  { id: 3, title: 'Compartir 1 vez', goal: 1, current: 0, completed: false }
])

const misionesEspeciales = ref([])
const misionesLimits = ref({
  canClaimMore: true,
  lastClaimTimestamp: null,
  isVip: false
})
const respuestasMisiones = ref({}) // Objeto para guardar respuestas por id_mision

const isMissionsCompleted = computed(() => {
  return dailyMissions.value.every(m => m.completed)
})

// La misión de menor recompensa (primera del array ya ordenado asc por valor)
const misionMenorRecompensa = computed(() => {
  if (misionesEspeciales.value.length === 0) return null
  return misionesEspeciales.value[0]
})

// Lógica de Misiones Especiales con límite de 24h
const canAccessSpecialMission = (mision) => {
  if (misionesLimits.value.isVip) return true // Miembros tienen acceso total

  // Si no es miembro:
  // 1. Si ya la reclamó o está en revisión, puede verla/interactuar
  if (mision.claimStatus) return true

  // 2. Si ya usó su cupo de 24h, nada más está disponible
  if (!misionesLimits.value.canClaimMore) return false

  // 3. Solo puede participar en la misión de menor recompensa
  const menorValor = parseFloat(misionMenorRecompensa.value?.valor ?? 0)
  return parseFloat(mision.valor) === menorValor
}

const hoursUntilNextMission = computed(() => {
  if (misionesLimits.value.canClaimMore || !misionesLimits.value.lastClaimTimestamp) return 0
  
  const lastDate = new Date(misionesLimits.value.lastClaimTimestamp)
  const nextDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000)
  const diff = nextDate.getTime() - Date.now()
  
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60)))
})

const fetchMissionsProgress = async () => {
  if (!auth.user?.id_usuario) return
  try {
    const res = await $api(`/misiones/progreso/${auth.user.id_usuario}`)
    if (res && res.success) {
      rewardClaimed.value = res.rewardClaimed
      
      const likeM = dailyMissions.value.find(m => m.id === 1)
      if (likeM) {
        likeM.current = res.progress.likes
        likeM.completed = res.progress.likes >= likeM.goal
      }
      const videoM = dailyMissions.value.find(m => m.id === 2)
      if (videoM) {
        videoM.current = res.progress.video
        videoM.completed = res.progress.video >= videoM.goal
      }
      const shareM = dailyMissions.value.find(m => m.id === 3)
      if (shareM) {
        shareM.current = res.progress.share
        shareM.completed = res.progress.share >= shareM.goal
      }
    }
  } catch (e) {
    console.error('Error fetching missions progress:', e)
  }
}

const fetchMisionesEspeciales = async () => {
  if (!auth.user?.id_usuario) return
  try {
    const res = await $api(`/misiones/especial?id_usuario=${auth.user.id_usuario}`)
    if (res.success) {
      const sortedMisiones = (res.data || []).sort((a, b) => parseFloat(a.valor || 0) - parseFloat(b.valor || 0))
      misionesEspeciales.value = sortedMisiones
      if (res.limits) {
        misionesLimits.value = res.limits
      }
      // Inicializar respuestas si no existen
      sortedMisiones.forEach(m => {
        if (!respuestasMisiones.value[m.id_mision]) {
          respuestasMisiones.value[m.id_mision] = ''
        }
      })
    }
  } catch (e) {
    console.error('Error fetching special missions:', e)
  }
}

const handleClaimReward = async () => {
  if (isMissionsCompleted.value && !rewardClaimed.value) {
    try {
      const res = await $api('/misiones/reclamar/auto', {
        method: 'POST',
        body: { id_usuario: auth.user.id_usuario }
      })
      if (res.success) {
        totalEarnings.value = res.nuevo_saldo
        rewardClaimed.value = true
        markAsStale()
        showToast(`¡Recompensa diaria reclamada! +$${Number(res.monto_acreditado).toFixed(2)} 🎉`, 'success')
        await fetchMissionsProgress()
      } else {
        showToast(res.error || 'Error al reclamar recompensa', 'error')
      }
    } catch (e) {
      console.error('Error claiming mission reward:', e)
      showToast('Error al conectar con el servidor', 'error')
    }
  }
}

const handleClaimSpecialMission = async (mision) => {
  const respuesta = respuestasMisiones.value[mision.id_mision]
  if (!respuesta || !respuesta.trim()) {
    showToast('Por favor completa la respuesta antes de reclamar', 'error')
    return
  }
  try {
    const res = await $api('/misiones/especial/reclamar', {
      method: 'POST',
      body: { 
        id_usuario: auth.user.id_usuario,
        id_mision: mision.id_mision,
        respuesta: respuesta
      }
    })
    if (res.success) {
      showToast('Tu reclamo fue enviado al administrador 🕐', 'success')
      markAsStale()
      await fetchMisionesEspeciales() // Recargar para actualizar estado
    } else {
      showToast(res.error || 'Error al reclamar misión', 'error')
    }
  } catch (e) {
    console.error('Error claiming special mission:', e)
    showToast('Error al conectar con el servidor', 'error')
  }
}

// Validation logic for "Return to site"
const validateShareMission = async () => {
  if (lastShareAttempt.value.time && lastShareAttempt.value.id) {
    const timeElapsed = Date.now() - lastShareAttempt.value.time
    if (timeElapsed >= 5000) { // 5 seconds
      await fetchMissionsProgress()
    }
    lastShareAttempt.value = { id: null, time: null } // Reset
  }
}

const handlePageShow = () => {
  if (document.visibilityState === 'visible') {
    validateShareMission()
  }
}

const fetchRewardsConfig = async () => {
  try {
    const res = await $api('/config/multi?tipos=valor_like,valor_video,valor_encuesta,valor_visita_web,valor_visita_whatsapp,valor_compartir,valor_mision')
    if (res.success && res.data) {
      rewardsConfig.value = {
        valor_like: parseFloat(res.data.valor_like || 0.05),
        valor_video: parseFloat(res.data.valor_video || 1.50),
        valor_encuesta: parseFloat(res.data.valor_encuesta || 2.50),
        valor_visita_web: parseFloat(res.data.valor_visita_web || 0.10),
        valor_visita_whatsapp: parseFloat(res.data.valor_visita_whatsapp || 0.10),
        valor_compartir: parseFloat(res.data.valor_compartir || 0.20),
        valor_mision: parseFloat(res.data.valor_mision || 10.00)
      }
    }
  } catch (e) {
    console.error('Error fetching rewards config:', e)
  }
}

const fetchMembershipStatus = async () => {
  try {
    const res = await $api(`/membresia/${auth.user.id_usuario}`)
    if (res && res.status === 'success' && res.data) {
       hasMembership.value = res.data.estado === 'activa'
    }
  } catch (e) {
    console.error('Error fetching membership:', e)
  }
}

// Infinite Scroll Observer
const infiniteScrollTrigger = ref(null)
let infiniteObserver = null

const setupInfiniteScroll = () => {
  if (infiniteObserver) infiniteObserver.disconnect()
  
  infiniteObserver = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && hasMore.value && !isPostsLoading.value) {
      await fetchPosts(false, rewardsConfig.value)
      // Re-observar nuevos posts para el contador de vistas
      nextTick(() => {
        document.querySelectorAll('.post-observer').forEach(el => {
          viewObserver.observe(el)
        })
      })
    }
  }, { threshold: 0.1, rootMargin: '200px' })

  if (infiniteScrollTrigger.value) {
    infiniteObserver.observe(infiniteScrollTrigger.value)
  }
}

const abrirVisor = (item) => {
  mediaToView.value = item
  showMediaViewer.value = true
  // MediaCarousel already handles pausing videos when the fullscreen button is clicked
}

const cerrarVisor = () => {
  showMediaViewer.value = false
  mediaToView.value = null
}

const abrirWinnersModal = async (mision) => {
  isLoadingWinners.value = true
  try {
    const res = await $api(`/misiones/especial/${mision.id_mision}/ganadores`)
    if (res.success) {
      winnersData.value = res.data
      showWinnersModal.value = true
    } else {
      showToast(res.error || 'No se pudo cargar la lista de ganadores', 'error')
    }
  } catch (e) {
    console.error('Error al cargar ganadores:', e)
    let errorMsg = 'Error al cargar los ganadores'
    if (e.response?.status === 404) {
      errorMsg = 'No se encontró la información de ganadores'
    } else if (e.response?.status === 403) {
      errorMsg = 'No tienes permisos para ver los ganadores'
    }
    showToast(errorMsg, 'error')
  } finally {
    isLoadingWinners.value = false
  }
}

const cerrarWinnersModal = () => {
  showWinnersModal.value = false
  setTimeout(() => {
    winnersData.value = null
  }, 300)
}

const stories = [
  { id: 1, name: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop', hasReward: true },
  { id: 2, name: 'Adidas', image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=100&h=100&fit=crop', hasReward: false },
  { id: 3, name: 'Netflix', image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=100&h=100&fit=crop', hasReward: true },
  { id: 4, name: 'Starbucks', image: 'https://images.unsplash.com/photo-1544333346-64e37cc89761?w=100&h=100&fit=crop', hasReward: false },
  { id: 5, name: 'Zara', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop', hasReward: true },
  { id: 6, name: 'Apple', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop', hasReward: false },
]

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
}

const registerInteraction = async (postId, type, detail = null) => {
  try {
    return await $api('/interacciones', {
      method: 'POST',
      body: {
        id_publicacion: postId,
        id_usuario: auth.user.id_usuario,
        tipo: type,
        detalle: detail ? (typeof detail === 'string' ? detail : JSON.stringify(detail)) : null
      }
    })
  } catch (error) {
    console.error(`Error registering interaction ${type}:`, error)
    // Extraer mensaje del error si es posible
    const serverMessage = error.data?.message || 'Error al procesar interacción'
    return { success: false, message: serverMessage, already_done: error.data?.already_done }
  }
}

const handleVideoComplete = async (post) => {
  if (post.hasVideo && !post.videoCompleted) {
    const res = await registerInteraction(post.id, 'video_view')
    if (res.success) {
      post.videoCompleted = true
      const gainValue = rewardsConfig.value.valor_video * earningsMultiplier.value
      totalEarnings.value += gainValue
      markAsStale()
      showToast(`🎉 ¡Ganaste $${gainValue.toFixed(2)}! Video completado.`, 'success')
      await fetchMissionsProgress()
    } else if (res.already_done) {
      post.videoCompleted = true
      showToast('Ya has recibido recompensa por este video anteriormente.', 'info')
    }
  }
}

const handleLike = async (post) => {
  const originalLiked = post.liked
  const originalLikes = post.likes
  
  // Optimistic update
  post.liked = !post.liked
  post.liked ? post.likes++ : post.likes--
  
  const res = await registerInteraction(post.id, 'like')
  if (res.success) {
    if (res.action === 'liked') {
      totalEarnings.value += rewardsConfig.value.valor_like * earningsMultiplier.value
    } else {
      totalEarnings.value -= rewardsConfig.value.valor_like * earningsMultiplier.value
    }
    markAsStale()
    await fetchMissionsProgress()
  } else {
    // Revert
    post.liked = originalLiked
    post.likes = originalLikes
    showToast('Error al procesar like', 'error')
  }
}

const handleShare = async (post) => {
  const message = `¡Mira esta publicación de ${post.author} en Red Y Mercadeo!\n\n"${post.content}"\n\nÚnete aquí: ${window.location.origin}`
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
  
  // Record time to validate mission on return
  lastShareAttempt.value = { id: post.id, time: Date.now() }
  
  // Abrir WhatsApp primero de forma segura
  openExternal(whatsappUrl, {
    onOpen: () => console.log('🔗 [Dashboard] WhatsApp opened successfully')
  })
  
  // Luego registrar interaccion share
  const res = await registerInteraction(post.id, 'share')
  if (res && res.success) {
    const gainValue = rewardsConfig.value.valor_compartir * earningsMultiplier.value
    totalEarnings.value += gainValue
    markAsStale()
    showToast(`🎉 ¡Ganaste $${gainValue.toFixed(2)}! por compartir.`, 'success')
  } else if (res && res.already_done) {
    showToast('Ya has compartido esta publicación anteriormente (Sola una recompensa permitida).', 'info')
  }
}

const handlePoll = (post) => {
  if (post.poll.answered) {
    showToast('Ya has respondido esta encuesta 📊', 'success')
    return
  }
  pollModal.value = { show: true, post }
}

const submitPollAnswer = async (option) => {
  if (pollModal.value.post) {
    const post = pollModal.value.post
    
    const res = await registerInteraction(post.id, 'poll', { answer: option })
    if (res.success) {
      post.poll.answered = true
      pollModal.value.show = false
      markAsStale()
      
      if (option === post.poll.correctAnswer) {
        const reward = rewardsConfig.value.valor_encuesta * earningsMultiplier.value
        totalEarnings.value += reward 
        showToast(`¡Correcto! Ganaste $${reward.toFixed(2)} 🎉`, 'success')
      } else {
        showToast(`Incorrecto. La respuesta era ${post.poll.correctAnswer}. ❌`, 'error')
      }
    } else {
      showToast('Error al enviar respuesta', 'error')
    }
  }
}

const handleLink = async (post) => {
  const url = post.link
  if (!url) return
  
  let finalUrl = url
  if (!/^https?:\/\//i.test(url)) {
    finalUrl = 'https://' + url
  }

  // Abrir enlace primero de forma segura
  openExternal(finalUrl, {
    onOpen: () => console.log('🔗 [Dashboard] External link opened successfully:', finalUrl)
  })

  // Luego registrar interaccion visita_web
  const res = await registerInteraction(post.id, 'visita_web')
  if (res && res.success) {
    const gainValue = rewardsConfig.value.valor_visita_web * earningsMultiplier.value
    totalEarnings.value += gainValue
    markAsStale()
    showToast(`🎉 ¡Ganaste $${gainValue.toFixed(2)}! por visitar el enlace.`, 'success')
  } else if (res && res.already_done) {
    showToast('Ya has visitado este enlace anteriormente.', 'info')
  }
}

const handleWhatsApp = async (post) => {
  if (!post.phone) {
    showToast('Este usuario no tiene un número vinculado', 'error')
    return
  }

  const cleanPhone = post.phone.replace(/[^0-9]/g, '')
  const message = `Hola, vi tu publicación en RedYMercadeo y me gustaría más información.`
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  
  // Abrir WhatsApp primero de forma segura
  openExternal(whatsappUrl, {
    onOpen: () => console.log('🔗 [Dashboard] WhatsApp contact opened successfully')
  })

  // Luego registrar interaccion visita_whatsapp
  const res = await registerInteraction(post.id, 'visita_whatsapp')
  if (res && res.success) {
    const gainValue = rewardsConfig.value.valor_visita_whatsapp * earningsMultiplier.value
    totalEarnings.value += gainValue
    markAsStale()
    showToast(`🎉 ¡Ganaste $${gainValue.toFixed(2)}! por contactar vendededor.`, 'success')
  } else if (res && res.already_done) {
    showToast('Ya has contactado a este vendedor anteriormente.', 'info')
  }
}

const toggleFollow = (post) => {
  post.following = !post.following
  showToast(post.following ? `Siguiendo a ${post.author}` : `Dejaste de seguir a ${post.author}`, 'success')
}

onMounted(async () => {
  console.log('🔗 [Dashboard] Initializing dashboard...')
  
  // Initialize external navigation handler FIRST
  initExternalNavigation()
  
  // Original event listeners
  document.addEventListener('visibilitychange', handlePageShow)
  window.addEventListener('focus', handlePageShow)
  
  // 1. Cargar desde caché para respuesta inmediata
  loadFromCache()
  
  // 2. Cargar datos necesarios en paralelo
  await Promise.all([
    fetchMissionsProgress(),
    fetchMisionesEspeciales(),
    fetchRewardsConfig(),
    fetchMembershipStatus(),
    fetchAlreadyViewedPosts()
  ])
  
  // 3. Cargar publicaciones frescas (con debounce y paginación)
  await fetchPosts(true, rewardsConfig.value)
  
  // 4. Setup Infinite Scroll
  setupInfiniteScroll()
  
  // Fetch real earnings for header
  try {
    const cData = await $api(`/credito/usuario/${auth.user.id_usuario}`)
    if (cData && cData.success) {
       totalEarnings.value = parseFloat(cData.data.monto_credito || 0)
    }
  } catch (e) {}
  
  isLoading.value = false

  // Setup IntersectionObserver para contar vistas
  await nextTick()
  
  viewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const postId = parseInt(entry.target.dataset.postId)
      if (!postId) return
      
      if (entry.isIntersecting) {
        // Iniciar timer: si permanece visible 0.5 segundos, contamos la vista
        if (!viewTimers[postId]) {
          viewTimers[postId] = setTimeout(() => {
            registerView(postId)
          }, 500)
        }
      } else {
        // Salió del viewport, cancelar timer si no se completó
        if (viewTimers[postId]) {
          clearTimeout(viewTimers[postId])
          delete viewTimers[postId]
        }
      }
    })
  }, { threshold: 0.5 })

  document.querySelectorAll('.post-observer').forEach(el => {
    viewObserver.observe(el)
  })
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handlePageShow)
  window.removeEventListener('focus', handlePageShow)
  if (viewObserver) viewObserver.disconnect()
  if (infiniteObserver) infiniteObserver.disconnect()
  Object.values(viewTimers).forEach(t => clearTimeout(t))
})

// SEO and Meta
useHead({
  title: 'PubliGana - Dashboard',
  meta: [
    { name: 'description', content: 'Dashboard de usuario de PubliGana.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.9, user-scalable=no' }
  ]
})
</script>

<style>
/* Bottom Sheet Animations (Reused from Marketplace) */
.bottom-sheet-enter-active, .bottom-sheet-leave-active {
  transition: opacity 0.35s ease;
}

.bs-content {
  will-change: transform;
}

/* Backdrop Fade */
.bottom-sheet-enter-active .bs-backdrop { transition: opacity 0.35s ease; }
.bottom-sheet-enter-from .bs-backdrop { opacity: 0; }
.bottom-sheet-enter-to .bs-backdrop { opacity: 1; }

.bottom-sheet-leave-active .bs-backdrop { transition: opacity 0.3s ease; }
.bottom-sheet-leave-from .bs-backdrop { opacity: 1; }
.bottom-sheet-leave-to .bs-backdrop { opacity: 0; }

/* Content Slide-Up */
.bottom-sheet-enter-active .bs-content {
   animation: slide-up-custom 0.45s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.bottom-sheet-leave-active .bs-content {
   transition: transform 0.4s cubic-bezier(0.32, 0, 0.67, 0);
   transform: translate3d(0, 0, 0);
}

.bottom-sheet-leave-to .bs-content {
   transform: translate3d(0, 100%, 0);
}

@keyframes slide-up-custom {
  from { transform: translate3d(0, 100%, 0); }
  to { transform: translate3d(0, 0, 0); }
}

@keyframes gradient-xy {
  0%, 100% {
    background-size: 400% 400%;
    background-position: left center;
  }
  50% {
    background-size: 400% 400%;
    background-position: right center;
  }
}

.animate-gradient-xy {
  animation: gradient-xy 3s ease infinite;
}
</style>

