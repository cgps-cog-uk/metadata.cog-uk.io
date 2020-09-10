import colors from "vuetify/es5/util/colors";
import apiServerMiddleware from "./api";

// eslint-disable-next-line nuxt/no-cjs-in-config
const config = require("./api/utils/config");

const baseUrl = config.oauth2.baseUrl;
const testClientId = config.oauth2.testClientId;
const productionClientId = config.oauth2.productionClientId;

export default {
  mode: "universal",
  server: {
    port: 3002,
  },
  /*
  ** Headers of the page
  */
  head: {
    title: "COG-UK",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: process.env.npm_package_description || "" },
    ],
    link: [
      // { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: "/styles.css" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" },
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#fff" },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: "@/plugins/qrcode-reader.js", mode: "client" },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/vuetify",
    // "@nuxtjs/eslint-module",
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/auth",
    "@nuxtjs/axios",

  ],

  /*
  ** Auth module configuration
  ** See https://auth.nuxtjs.org/options
  */
  auth: {
    cookie: {
      options: {
        maxAge: 60 * 60 * 12,
      },
    },
    strategies: {
      majoraProduction: {
        _scheme: "oauth2",
        authorization_endpoint: "https://majora.covid19.climb.ac.uk/o/authorize/",
        userinfo_endpoint: false,
        scope: ["majora2.add_biosampleartifact", "majora2.change_biosampleartifact", "majora2.add_biosamplesource", "majora2.change_biosamplesource", "majora2.add_biosourcesamplingprocess", "majora2.change_biosourcesamplingprocess", "majora2.add_libraryartifact", "majora2.change_libraryartifact", "majora2.add_librarypoolingprocess", "majora2.change_librarypoolingprocess", "majora2.add_dnasequencingprocess", "majora2.change_dnasequencingprocess"],
        access_token_endpoint: "https://majora.covid19.climb.ac.uk/o/token/",
        response_type: "code",
        redirect_uri: `${baseUrl}/callback`,
        token_type: "Bearer",
        token_key: "access_token",
        client_id: productionClientId,
        grant_type: "authorization_code",
      },
      majoraTest: {
        _scheme: "oauth2",
        authorization_endpoint: "https://covid.majora.ironowl.it/o/authorize/",
        userinfo_endpoint: false,
        scope: ["majora2.add_biosampleartifact", "majora2.change_biosampleartifact", "majora2.add_biosamplesource", "majora2.change_biosamplesource", "majora2.add_biosourcesamplingprocess", "majora2.change_biosourcesamplingprocess", "majora2.add_libraryartifact", "majora2.change_libraryartifact", "majora2.add_librarypoolingprocess", "majora2.change_librarypoolingprocess", "majora2.add_dnasequencingprocess", "majora2.change_dnasequencingprocess"],
        access_token_endpoint: "https://covid.majora.ironowl.it/o/token/",
        response_type: "code",
        redirect_uri: `${baseUrl}/callback`,
        token_type: "Bearer",
        token_key: "access_token",
        client_id: testClientId,
        grant_type: "authorization_code",
      },
    },
    redirect: {
      callback: "/callback",
      home: "/",
    },


  },

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: [ "~/assets/variables.scss" ],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
  },

  serverMiddleware: [ apiServerMiddleware ],
};
