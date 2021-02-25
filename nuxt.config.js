
export default {
  ssr: false/*true*/,
  target: 'static',
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
    titleTemplate: '%s | NijiEchelon にじさんじスケジュール',
    title: 'title',
    meta: [
        { charset: 'utf-8' },
        { 'http-equiv': 'content-language', content:'ja' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: `にじさんじの配信スケジュールを確認できます` },
        { hid: 'keywords', name: 'keywords', content: 'にじさんじ,配信スケジュール,VTuber' },
        { hid: 'og:site_name', property: 'og:site_name', content: 'NijiEchelon にじさんじスケジュールサイト' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:url', property: 'og:url', content: 'https://niji.holoechelon.com' },
        { hid: 'og:title', property: 'og:title', content: `NijiEchelon にじさんじスケジュールサイト` },
        { hid: 'og:description', property: 'og:description', content: 'にじさんじの配信スケジュールを確認できます' },
        { hid: 'og:image', property: 'og:image', content: 'https://niji.holoechelon.com/ogp_small.png' },
        { name: 'twitter:card', content: 'summary' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', href: '/icon.png' }
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
