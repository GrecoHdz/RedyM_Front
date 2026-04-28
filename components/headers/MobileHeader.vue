<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#070b14]/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
        <span class="text-white font-black text-lg">R</span>
      </div>
      <h1 class="font-black text-lg tracking-tight text-white">REDY</h1>
    </div>

    <div class="flex items-center gap-2">
      <!-- Earnings Counter (Replaces Search) -->
      <div class="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-inner">
        <div class="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40">
          <span class="text-[10px] text-white font-black">L</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[13px] font-black text-emerald-400 tracking-tight">
            {{ earnings.toFixed(2) }}
          </span>
          <div v-if="hasMembership" class="flex items-center justify-center bg-blue-500 text-[#070b14] text-[8px] font-black w-4 h-4 rounded-md shadow-sm shadow-blue-500/30">
            x2
          </div>
        </div>
      </div>

      <button class="relative p-2 text-gray-400 hover:text-emerald-400 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span class="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#070b14]"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  earnings: {
    type: Number,
    default: 0
  },
  hasMembership: {
    type: Boolean,
    default: false
  }
})
</script>
