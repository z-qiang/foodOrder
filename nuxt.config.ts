// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3333
  },
  modules: [
    'vuetify-nuxt-module'
  ],
  css: [
    '@mdi/font/css/materialdesignicons.css',
    'vuetify/lib/styles/main.css'
  ],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#2B2B2B', // 玄 (Xuán)
              secondary: '#50616D', // 墨 (Mò)
              accent: '#CA6924', // 琥珀 (Hǔpò)
              background: '#F2ECDE', // 缟 (Gǎo) - Page Base
              surface: '#FFFFFF',
              'surface-variant': '#E0F0E9', // 素 (Sù) - Home Header
              'on-surface-variant': '#EBE3D5', // 练 (Liàn) - Secondary Modules
              'header-home': '#E0F0E9', // 素 (Sù)
              'header-menu': '#EBE3D5', // 练 (Liàn)
              'header-order': '#D6ECF0', // 月白 (Yuèbái)
              'header-me': '#EEDEB0', // 牙色 (Yásè)
              'header-admin': '#D6ECF0', // 月白 (Yuèbái) - admin header
            }
          }
        }
      },
      icons: {
        defaultSet: 'mdi',
      }
    }
  },
  ssr: true,
  app: {
    baseURL: '/order/',
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: '美味点餐 - 移动点餐专家',
      htmlAttrs: {
        lang: 'zh-CN'
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'description', content: '美味点餐系统，为您提供便捷、卫生的在线点餐服务。支持外送与自取，满减活动进行中。' },
        { name: 'keywords', content: '点餐系统, 移动点餐, H5点餐, 美食, 外卖, 自取' }
      ],
      link: [
        { rel: 'canonical', href: 'https://www.sz-fcsk.com/order/' }
      ]
    }
  },
  future: {
    compatibilityVersion: 4
  },
  vite: {
    server: {
      fs: {
        strict: false
      }
    }
  }
})
