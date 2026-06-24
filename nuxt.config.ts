export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/sitemap'
  ],

  pwa: {
    manifest: {
      name: 'PubliGana',
      short_name: 'PubliGana',
      description: 'Gana por interactuar',
      theme_color: '#10b981',
      background_color: '#070b14',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      orientation: 'portrait',

      icons: [
        {
          src: '/favicon.ico',
          sizes: '64x64 32x32 24x24 16x16',
          type: 'image/x-icon'
        },
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      importScripts: ['/sw-push.js'],
      globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,json,woff2,woff}'],
      cleanupOutdatedCaches: true
    },
    devOptions: {
      enabled: true,
      type: 'module',
      suppressWarnings: true
    }

  },
  site: {
    url: 'https://publigana.vercel.app'
  },
  sitemap: {
    urls: [
      '/',
    ]
  },

  // Configuración de impresión
  app: {
    head: {
      title: 'PubliGana - Monetiza tu Tiempo y Gana por interactuar',
      meta: [
        { name: 'google-site-verification', content: 'jawMv21uEyAiqAfxTatonHuFH3oJsiNdhQiko8kJvwo' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Monetiza tu Tiempo y Gana por interactuar.' },
        { name: 'theme-color', content: '#2563eb' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        // Open Graph
        { property: 'og:title', content: 'PubliGana - Monetiza tu Tiempo y Gana por interactuar.' },
        { property: 'og:description', content: 'Monetiza tu Tiempo y Gana por interactuar.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://publigana.vercel.app/' },
        { property: 'og:image', content: 'https://publigana.vercel.app/favicon.ico' },
        { property: 'og:site_name', content: 'PubliGana' },
      ],

      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }
      ]
    }
  },

  devServer: {
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3000
  },

  runtimeConfig: {
    public: {
      appName: 'PubliGana',
      appVersion: '1.2.1',
      apiBase: process.env.NUXT_PUBLIC_API_URL
    }
  },
})