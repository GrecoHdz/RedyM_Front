export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],

  pwa: {
    manifest: {
      name: 'RedYMercadeo',
      short_name: 'RedYM',
      description: 'Gana por interactuar',
      theme_color: '#10b981',

      icons: [
        {
          src: '/favicon.ico',
          sizes: '64x64 32x32 24x24 16x16',
          type: 'image/x-icon'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      importScripts: ['/sw-push.js'],
      globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,json,woff2,woff}'],
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }

  },


  app: {
    head: {
      title: 'RedYMercadeo - Gana por interactuar',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'La red social que te recompensa por tu tiempo y participación. Únete a la comunidad.' },
        { name: 'theme-color', content: '#10b981' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap' }
      ]
    }
  },

  devServer: {
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3000
  },

  runtimeConfig: {
    public: {
      appName: 'RedYMercadeo',
      appVersion: '1.0.0',
      apiBase: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000'
    }
  }
})