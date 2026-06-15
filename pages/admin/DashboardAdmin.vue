<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white selection:bg-emerald-500/30 overflow-x-hidden">
    <!-- Loading Spinner -->
    <LoadingSpinner :loading="isLoading" />

    <!-- Main Header -->
    <MobileHeader :earnings="totalEarnings" :has-membership="hasMembership" />

    <!-- Content Container with max-w-2xl to match copy.vue -->
    <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      <main class="pt-16 pb-2">
        <!-- Statistics & Activity Section -->
        <section class="px-2 pt-1 pb-4 grid grid-cols-2 gap-3">
          <!-- Estadísticas -->
          <NuxtLink 
            to="/admin/EstadisticasAdmin"
            class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden group active:scale-[0.98] transition-all duration-300 block"
          >
            <!-- Background decoration -->
            <div class="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            
            <div class="relative flex flex-col items-start space-y-3">
              <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0 a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="text-left">
                <h2 class="text-xs font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
                  Estadísticas
                </h2>
                <p class="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Métricas Globales</p>
              </div>
            </div>
          </NuxtLink>

          <!-- Actividad Reciente -->
          <button 
            @click="abrirModalActividad"
            class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden group active:scale-[0.98] transition-all duration-300 block text-left"
          >
            <!-- Background decoration -->
            <div class="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
            
            <!-- Badge de notificaciones no leídas -->
            <div v-if="unreadCount > 0" class="absolute top-3 right-3 flex items-center justify-center">
              <div class="relative">
                <div class="absolute -inset-1 bg-rose-500/20 rounded-full blur-sm animate-pulse"></div>
                <div class="relative bg-gradient-to-br from-rose-500 to-red-600 text-white text-[10px] font-black rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1.5 shadow-lg shadow-rose-500/30">
                  {{ unreadCount > 99 ? '99+' : unreadCount }}
                </div>
              </div>
            </div>
            
            <div class="relative flex flex-col items-start space-y-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-left">
                <h2 class="text-xs font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
                  Actividad
                </h2>
                <p class="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Eventos Recientes</p>
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
                  <button v-if="post.link" @click="handleLink(post.link)" class="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center active:scale-110 transition-transform">
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
        <div ref="infiniteScrollTrigger" class="py-10 flex flex-col items-center justify-center space-y-4">
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

    <!-- ====== VISOR DE MEDIOS (Lightbox) ====== -->
    <Transition name="fade">
      <div 
        v-if="showMediaViewer" 
        class="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
        @click.self="handleViewerBackdropClick"
      >
        
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
        <div 
          class="relative w-full h-full flex items-center justify-center overflow-hidden p-4"
          @click.self="handleViewerBackdropClick"
        >
          <img v-if="mediaToView?.type === 'image'" 
            :src="mediaToView.url" 
            class="max-w-[95vw] max-h-[85vh] object-contain animate-modal-in shadow-2xl rounded-lg"
            @click.stop
          >
          
          <!-- Video container: click outside video pauses and closes modal -->
          <div v-else-if="mediaToView?.type === 'video'" class="relative animate-modal-in" @click.stop>
            <video 
              ref="fullscreenVideoRef"
              :src="mediaToView.url + '#t=0.1'"
              class="max-w-[95vw] max-h-[85vh] rounded-2xl shadow-2xl block"
              playsinline
              preload="metadata"
              @ended="onFullscreenVideoEnded"
              @click.stop
            ></video>
            
            <!-- Custom Play/Pause overlay for fullscreen video -->
            <div 
              class="absolute inset-0 flex items-center justify-center rounded-2xl cursor-pointer"
              :class="{ 'bg-black/30': fullscreenVideoPaused }"
              @click.stop="toggleFullscreenVideo"
            >
              <Transition name="fade-quick">
                <div v-if="fullscreenVideoPaused" class="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xl">
                  <svg class="w-10 h-10 text-white fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </Transition>
            </div>

            <!-- Progress bar -->
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl">
              <div 
                class="h-full bg-emerald-500 transition-all duration-100 rounded-b-2xl"
                :style="{ width: fullscreenVideoProgress + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Actividad Reciente -->
    <Transition name="bottom-sheet">
      <div v-if="modalActividad.show" class="fixed inset-0 z-[120] flex flex-col justify-end isolate">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 bs-backdrop" @click="modalActividad.show = false"></div>

        <!-- Modal Content -->
        <div class="relative w-full bg-white dark:bg-gray-900 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden max-h-[85vh] flex flex-col bs-content">
          <!-- Handle bar -->
          <div class="w-12 h-1 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mt-3 mb-1"></div>
          
          <!-- Header -->
          <div class="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <span class="text-xl">📋</span>
              </div>
              <div>
                <h2 class="text-lg font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">Actividad Reciente</h2>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Logs del sistema y usuarios</p>
              </div>
            </div>
            <button 
              @click="modalActividad.show = false"
              class="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white flex items-center justify-center border border-gray-100 dark:border-white/10"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6 no-scrollbar">
            <div v-if="isActivitiesLoading" class="flex flex-col items-center justify-center py-20">
              <div class="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">Cargando actividades...</p>
            </div>

            <div v-else-if="recentActivities.length === 0" class="text-center py-20">
              <div class="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                <span class="text-3xl">📭</span>
              </div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">No hay actividad registrada hoy</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="activity in recentActivities" :key="activity.id"
                   class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl group transition-all">
                <div class="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                  <span class="text-lg">{{ activity.icon || '📝' }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex flex-col">
                      <div class="flex items-center gap-1">
                        <span class="text-[9px] font-black text-blue-500 uppercase tracking-widest">{{ activity.user || 'Sistema' }}</span>
                        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">{{ activity.role || 'Usuario' }}</span>
                      </div>
                    </div>
                    <span class="text-[9px] font-bold text-gray-400">{{ getRelativeTime(activity.date) }}</span>
                  </div>
                  <p class="text-xs font-bold text-gray-900 dark:text-white leading-snug">{{ activity.title }}</p>
                  <div class="flex items-center gap-2 mt-1.5">
                    <span class="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-[7px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                      {{ activity.type || 'General' }}
                    </span>
                    <span v-if="activity.creado_por !== 'Sistema'" class="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-[7px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20">
                      Manual
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination Footer -->
          <div v-if="totalActivityPages > 1" class="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-white/5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pág. {{ currentActivityPage }} de {{ totalActivityPages }}</span>
              <div class="flex gap-2">
                <button 
                  @click="cambiarPaginaActividad(currentActivityPage - 1)"
                  :disabled="currentActivityPage === 1"
                  class="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 disabled:opacity-30"
                >
                  <i class="fas fa-chevron-left text-xs"></i>
                </button>
                <button 
                  @click="cambiarPaginaActividad(currentActivityPage + 1)"
                  :disabled="currentActivityPage === totalActivityPages"
                  class="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 disabled:opacity-30"
                >
                  <i class="fas fa-chevron-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
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

// Media viewer state
const showMediaViewer = ref(false)
const mediaToView = ref(null)
const fullscreenVideoRef = ref(null)
const fullscreenVideoPaused = ref(true)
const fullscreenVideoProgress = ref(0)
let fullscreenProgressInterval = null

const abrirVisor = (mediaItem) => {
  mediaToView.value = mediaItem
  showMediaViewer.value = true
  fullscreenVideoPaused.value = true
  fullscreenVideoProgress.value = 0
}

const cerrarVisor = () => {
  showMediaViewer.value = false
  setTimeout(() => {
    mediaToView.value = null
  }, 300)
}

const toggleFullscreenVideo = () => {
  const video = fullscreenVideoRef.value
  if (!video) return
  if (video.paused) {
    video.play()
    fullscreenVideoPaused.value = false
    // Start progress tracking
    fullscreenProgressInterval = setInterval(() => {
      if (video.duration) {
        fullscreenVideoProgress.value = (video.currentTime / video.duration) * 100
      }
    }, 200)
  } else {
    video.pause()
    fullscreenVideoPaused.value = true
    clearInterval(fullscreenProgressInterval)
  }
}

const onFullscreenVideoEnded = () => {
  fullscreenVideoPaused.value = true
  fullscreenVideoProgress.value = 100
  clearInterval(fullscreenProgressInterval)
}

const handleViewerBackdropClick = () => {
  // Pause the video and close the modal
  const video = fullscreenVideoRef.value
  if (video && !video.paused) {
    video.pause()
    fullscreenVideoPaused.value = true
    clearInterval(fullscreenProgressInterval)
  }
  cerrarVisor()
}

const totalEarnings = ref(0.00) // Will be updated from DB
const rewardsConfig = ref({
  valor_like: 0.05,
  valor_video: 1.50,
  valor_encuesta: 2.50
})

const hasMembership = ref(false)
const earningsMultiplier = computed(() => hasMembership.value ? 2 : 1)

// --- View Tracking ---
const viewedPostIds = ref(new Set())
let viewObserver = null
const viewTimers = {}

const fetchAlreadyViewedPosts = async () => {
  if (!auth.user?.id_usuario) return
  try {
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
// --------------------------

// --- Actividad Reciente ---
const modalActividad = ref({ show: false })
const recentActivities = ref([])
const isActivitiesLoading = ref(false)
const currentActivityPage = ref(1)
const totalActivityPages = ref(1)
const unreadCount = ref(0)

const updateUnreadCount = async () => {
  if (!auth.user?.id_usuario) return
  try {
    const res = await $api(`/notificaciones/usuario/${auth.user.id_usuario}?page=1&limit=1`)
    if (res.success && res.unreadCount !== undefined) {
      unreadCount.value = res.unreadCount
    }
  } catch (error) {
    console.error('Error al actualizar contador de notificaciones:', error)
  }
}

const getNotificationIcon = (titulo) => {
  const t = titulo.toLowerCase()
  if (t.includes('cuenta creada') || t.includes('registro')) return '🆕'
  if (t.includes('acceso') || t.includes('login')) return '🔐'
  if (t.includes('modificación') || t.includes('actualización')) return '📝'
  if (t.includes('pago') || t.includes('comisión')) return '💰'
  if (t.includes('membresía')) return '💳'
  if (t.includes('misión')) return '⚡'
  if (t.includes('verificaci')) return '✅'
  return '🔔'
}

const getRelativeTime = (fecha) => {
  const now = new Date()
  const date = new Date(fecha)
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `Hace ${days} d`
  if (hours > 0) return `Hace ${hours} h`
  if (minutes > 0) return `Hace ${minutes} m`
  return 'Ahora mismo'
}

const loadActivities = async () => {
  isActivitiesLoading.value = true
  try {
    const res = await $api(`/notificaciones?page=${currentActivityPage.value}&limit=5`)
    if (res.success) {
      recentActivities.value = res.data.map(notif => ({
        id: notif.id || Math.random().toString(36).substr(2, 9),
        title: notif.titulo,
        date: notif.fecha,
        user: notif.nombreUsuario,
        role: notif.rolUsuario,
        type: notif.tipo,
        creado_por: notif.creado_por,
        icon: getNotificationIcon(notif.titulo)
      }))
      if (res.pagination) {
        totalActivityPages.value = res.pagination.pages
      }
    }
  } catch (error) {
    console.error('Error al cargar actividades:', error)
    showToast('Error al cargar actividades recientes', 'error')
  } finally {
    isActivitiesLoading.value = false
  }
}

const abrirModalActividad = async () => {
  currentActivityPage.value = 1
  modalActividad.value.show = true
  
  // Marcar todas las notificaciones como leídas
  if (auth.user?.id_usuario) {
    try {
      await $api('/notificaciones/marcar/leidas', {
        method: 'PUT',
        body: { id_usuario: auth.user.id_usuario }
      })
      unreadCount.value = 0
    } catch (error) {
      console.error('Error al marcar notificaciones como leídas:', error)
    }
  }
  
  loadActivities()
}

const cambiarPaginaActividad = (pagina) => {
  if (pagina < 1 || pagina > totalActivityPages.value) return
  currentActivityPage.value = pagina
  loadActivities()
}
// --------------------------

// Daily Missions Logic
const rewardClaimed = ref(false)
const lastShareAttempt = ref({ id: null, time: null })
const dailyMissions = ref([
  { id: 1, title: 'Dar 3 likes', goal: 3, current: 0, completed: false, trackedIds: new Set() },
  { id: 2, title: 'Ver 1 video completo', goal: 1, current: 0, completed: false, trackedIds: new Set() },
  { id: 3, title: 'Compartir 1 vez', goal: 1, current: 0, completed: false, trackedIds: new Set() }
])

const isMissionsCompleted = computed(() => {
  return dailyMissions.value.every(m => m.completed)
})

// --- Persistence Logic ---
const saveMissions = () => {
  if (!auth.user?.id_usuario) return
  const data = {
    rewardClaimed: rewardClaimed.value,
    missions: dailyMissions.value.map(m => ({
      id: m.id,
      current: m.current,
      completed: m.completed,
      trackedIds: Array.from(m.trackedIds)
    })),
    lastUpdate: new Date().toDateString()
  }
  localStorage.setItem(`missions_${auth.user.id_usuario}`, JSON.stringify(data))
}

const loadMissions = () => {
  if (!auth.user?.id_usuario) return
  const saved = localStorage.getItem(`missions_${auth.user.id_usuario}`)
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.lastUpdate === new Date().toDateString()) {
        rewardClaimed.value = data.rewardClaimed
        data.missions.forEach(sm => {
          const m = dailyMissions.value.find(dm => dm.id === sm.id)
          if (m) {
            m.current = sm.current
            m.completed = sm.completed
            m.trackedIds = new Set(sm.trackedIds)
          }
        })
      } else {
        localStorage.removeItem(`missions_${auth.user.id_usuario}`)
      }
    } catch (e) {
      console.error('Error loading missions:', e)
    }
  }
}

// Auto-save changes
watch([dailyMissions, rewardClaimed], () => {
  saveMissions()
}, { deep: true })
// --------------------------

const handleClaimReward = () => {
  if (isMissionsCompleted.value && !rewardClaimed.value) {
    totalEarnings.value += 10.00
    rewardClaimed.value = true
    markAsStale()
    showToast('¡Recompensa diaria reclamada! +$ 10.00 🎉', 'success')
  }
}

// Validation logic for "Return to site"
const validateShareMission = () => {
  if (lastShareAttempt.value.time && lastShareAttempt.value.id) {
    const timeElapsed = Date.now() - lastShareAttempt.value.time
    if (timeElapsed >= 5000) { // 5 seconds
      const shareMission = dailyMissions.value.find(m => m.id === 3)
      if (shareMission && !shareMission.completed && !shareMission.trackedIds.has(lastShareAttempt.value.id)) {
        shareMission.trackedIds.add(lastShareAttempt.value.id)
        shareMission.current = shareMission.trackedIds.size
        if (shareMission.current >= shareMission.goal) shareMission.completed = true
        showToast('¡Misión de compartir completada! ✅', 'success')
      }
    }
    lastShareAttempt.value = { id: null, time: null } // Reset
  }
}

const handlePageShow = () => {
  if (document.visibilityState === 'visible') {
    validateShareMission()
    updateUnreadCount()
  }
}

const fetchRewardsConfig = async () => {
  try {
    const res = await $api('/config/multi?tipos=valor_like,valor_video,valor_encuesta')
    if (res.success && res.data) {
      rewardsConfig.value = {
        valor_like: parseFloat(res.data.valor_like || 0.05),
        valor_video: parseFloat(res.data.valor_video || 1.50),
        valor_encuesta: parseFloat(res.data.valor_encuesta || 2.50)
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
      // Re-observe new posts for the view counter
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
    return { success: false }
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
      showToast(`🎉 ¡Ganaste $ ${gainValue.toFixed(2)}! Video completado.`, 'success')
      
      // Update daily mission (id: 2)
      const videoMission = dailyMissions.value.find(m => m.id === 2)
      if (videoMission && !videoMission.completed && !videoMission.trackedIds.has(post.id)) {
        videoMission.trackedIds.add(post.id)
        videoMission.current = videoMission.trackedIds.size
        if (videoMission.current >= videoMission.goal) videoMission.completed = true
      }
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
    markAsStale()
    if (res.action === 'liked') {
      totalEarnings.value += rewardsConfig.value.valor_like * earningsMultiplier.value
      // Update daily mission (id: 1)
      const likeMission = dailyMissions.value.find(m => m.id === 1)
      if (likeMission && !likeMission.completed && !likeMission.trackedIds.has(post.id)) {
        likeMission.trackedIds.add(post.id)
        likeMission.current = likeMission.trackedIds.size
        if (likeMission.current >= likeMission.goal) likeMission.completed = true
      }
    } else {
      totalEarnings.value -= rewardsConfig.value.valor_like * earningsMultiplier.value
      // Update daily mission (id: 1) - Remove point if unliked
      const likeMission = dailyMissions.value.find(m => m.id === 1)
      if (likeMission && likeMission.trackedIds.has(post.id)) {
        likeMission.trackedIds.delete(post.id)
        likeMission.current = likeMission.trackedIds.size
        // If they already completed it, we check if they fall below the goal
        if (likeMission.current < likeMission.goal) {
          likeMission.completed = false
        }
      }
    }
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
  
  // Abrir WhatsApp de forma segura primero
  openExternal(whatsappUrl, {
    onOpen: () => console.log('🔗 [AdminDashboard] WhatsApp opened successfully')
  })
  
  // Registrar interaccion share
  const res = await registerInteraction(post.id, 'share')
  if (res && res.success) {
    markAsStale()
  }
  
  // Feedback visual
  showToast('Abriendo WhatsApp... Completa el envío y regresa para ganar. 📱', 'success')
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
        showToast(`¡Correcto! Ganaste $ ${reward.toFixed(2)} 🎉`, 'success')
      } else {
        showToast(`Incorrecto. La respuesta era ${post.poll.correctAnswer}. ❌`, 'error')
      }
    } else {
      showToast('Error al enviar respuesta', 'error')
    }
  }
}

const handleLink = (url) => {
  if (!url) return
  // Ensure the URL has a protocol, otherwise window.open treats it as relative
  let finalUrl = url
  if (!/^https?:\/\//i.test(url)) {
    finalUrl = 'https://' + url
  }
  openExternal(finalUrl, {
    onOpen: () => console.log('🔗 [AdminDashboard] External link opened successfully:', finalUrl)
  })
}

const handleWhatsApp = (post) => {
  if (!post.phone) {
    showToast('Este usuario no tiene un número vinculado', 'error')
    return
  }
  // Sanitize phone number (whatsapp expects only numbers, INCLUDING country code)
  const cleanPhone = post.phone.replace(/[^0-9]/g, '')
  const message = `Hola, vi tu publicación en PubliGana y me gustaría más información.`
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  openExternal(whatsappUrl, {
    onOpen: () => console.log('🔗 [AdminDashboard] WhatsApp contact opened successfully')
  })
}

const toggleFollow = (post) => {
  post.following = !post.following
  showToast(post.following ? `Siguiendo a ${post.author}` : `Dejaste de seguir a ${post.author}`, 'success')
}

onMounted(async () => {
  console.log('🔗 [AdminDashboard] Initializing admin dashboard...')
  
  // Initialize external navigation handler FIRST
  initExternalNavigation()
  
  document.addEventListener('visibilitychange', handlePageShow)
  window.addEventListener('focus', handlePageShow)
  
  // 1. Cargar desde caché para respuesta inmediata
  loadFromCache()
  
  // 2. Cargar datos necesarios en paralelo
  await Promise.all([
    fetchRewardsConfig(),
    fetchMembershipStatus(),
    updateUnreadCount(),
    fetchAlreadyViewedPosts()
  ])
  
  // 3. Cargar publicaciones frescas (con debounce y paginación)
  await fetchPosts(true, rewardsConfig.value)
  
  // 4. Setup Intersection Observer for View Tracking
  await nextTick()
  viewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const postId = parseInt(entry.target.dataset.postId)
      if (!postId) return
      
      if (entry.isIntersecting) {
        if (!viewTimers[postId]) {
          viewTimers[postId] = setTimeout(() => {
            registerView(postId)
          }, 500)
        }
      } else {
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
  
  // 5. Setup Infinite Scroll
  setupInfiniteScroll()
  
  // Fetch real earnings for header
  try {
    const cData = await $api(`/credito/usuario/${auth.user.id_usuario}`)
    if (cData && cData.success) {
       totalEarnings.value = parseFloat(cData.data.monto_credito || 0)
    }
  } catch (e) {}
  
  isLoading.value = false
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handlePageShow)
  window.removeEventListener('focus', handlePageShow)
  if (infiniteObserver) infiniteObserver.disconnect()
  if (viewObserver) viewObserver.disconnect()
  Object.values(viewTimers).forEach(t => clearTimeout(t))
})

useHead({
  title: 'PubliGana - Dashboard',
  meta: [
    { name: 'description', content: 'Dashboard del admin de PubliGana.' },
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

/* Visor de medios animations */
.fade-quick-enter-active, .fade-quick-leave-active { transition: opacity 0.2s ease; }
.fade-quick-enter-from, .fade-quick-leave-to { opacity: 0; }
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-modal-in { animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
</style>
