// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@vite-pwa/nuxt'],
  ssr: true,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
      tinymceApiKey: process.env.NUXT_PUBLIC_TINYMCE_API_KEY || '28rkvju16xf6zdoauaa2pzpyuu9ag7aba7dwb7udkad5q3nm'
    }
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Cây Giống Tuấn Anh',
      meta: [
        { name: 'description', content: 'A real-time fire monitoring and warning system for Data Centers.' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1746146995/gpg18t1hvlrlvww9sw9j.png' }
      ]
    }
  },
  css: ['~/assets/css/tailwind.css'],
  pwa: {
    devOptions: {
      enabled: false
    }
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('swiper-'),
    },
  },
})
