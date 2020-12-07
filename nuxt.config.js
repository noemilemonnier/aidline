import colors from 'vuetify/es5/util/colors'
const pkg = require('./package')

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - Aidline',
    title: 'Aidline',
    htmlAttrs: {
      lang: 'en',
      dir: 'ltr',
    },
    noscript: [
      {
        innerHTML:
          'This website requires javascript to run. Please enable it in browser settings.',
      },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/img/logo.png' },
      { rel: "apple-touch-icon", type: "image/png", href: "/img/apple-icon.png" },
    ],
  },

  // Custom Progress-bar color.
  loading: {
    color: '#be3223', //custom red
  },


  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/vuelidate',
    '~/plugins/icons',
    '~/plugins/vuegeolocation',
    '~/plugins/vue-crypto',
    '~/plugins/vue2-google-maps',
    '~/plugins/vue-consentcomponent',
    '~/plugins/vue-notification',
    {
      src: '~/plugins/vue-gtag',
      mode: 'client'
    }
  ],


  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv'
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/moment'
  ],

  axios: {
    baseURL: "https://csdp-aidline.herokuapp.com/",
    proxyHeaders: false,
    credentials: false
  },

  proxy: {
  '/api': {
    target: 'https://csdp-aidline.herokuapp.com/',
    pathRewrite: {
      '^/api' : '/'
      },
    changeOrigin: true
  },
  '/google': {
    target: 'https://maps.googleapis.com/maps/api/place/',
    pathRewrite: {
      '^/google' : '/'
      },
    changeOrigin: true
    }
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: { font: false, icons: false },
    icons: {
      iconfont: 'mdiSvg',
    },
    theme: {
      dark: true,
      themes: {
        light: {
          primary: '#be3223', // custom red
          accent: '#b1b1b1', // custom gray
          secondary: '#e8b266', // custom faded orange
          background: '#f5f5f5', // grey lighten-4
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          button: '#9c27b0',
          'color-footer': '#524037'
        },
        dark: {
          primary: '#be3223', // custom red
          accent: '#b1b1b1', // custom gray
          secondary: '#9c27b0', // purple
          info: colors.teal.lighten1,
          background: '#424242', // grey darken-3
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          button: '#9c27b0',
          'color-footer': '#362f28'
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    // Extend webpack config.
    extend( config, ctx ){}
  },
}
