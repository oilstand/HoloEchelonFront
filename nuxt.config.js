
export default {
  ssr: true,
/*  target: 'universal',*/
  generate: {
    routes: [

    ]
  },
  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'ja',
      prefix: 'og: http://ogp.me/ns#'
    },
    titleTemplate: '%s | HoloEchelon ホロライブスケジュール',
    title: 'title',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'content-language', content:'ja' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', type: 'image/png', href: '/apple-touch-icon-180x180.png' },
      { rel: 'icon', type: 'image/png', href: '/icon-192x192.png' }
    ],
    script: [
    ]

  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/utils'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/gtm',
  ],
  gtm: {
    id: 'GTM-M9BFJFP',
    pageTracking: true,
  },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    analyze: false,
    hardSource: true,
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
