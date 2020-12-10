<template>
  <v-app>
    <!-- Mobile Navigation-->
    <v-navigation-drawer app temporary v-model="sideNav" >
      <v-list dense flat nav>
        <div class="text-center ma-3">
          <nuxt-link to="/"><img src="/img/logo.png" contain width="110px" height="110px" alt="AidLine"/> </nuxt-link>
        </div>
        <v-divider/>
        <v-list-item class="mt-1" link nuxt to="/"><v-icon color="grey darken-2" size="28px">{{ $i.mdiHomeVariant }}</v-icon >&emsp;Home page</v-list-item>
        <v-list-item class="mt-1" link nuxt to="/login"><v-icon size="28px">{{ $i.mdiLogin }}</v-icon>&emsp;Login</v-list-item>
        <v-divider/>
        <v-list-item><v-btn class="white--text mt-8" color="primary" large nuxt to="/login"><v-icon left size="24px">{{ $i.mdiAmbulance }}</v-icon>Need Ambulance?</v-btn></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Top bar in larger screens -->
    <v-app-bar app dense short>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="sideNav = !sideNav"></v-app-bar-nav-icon>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn text nuxt to="/">Home page</v-btn>
          <v-btn text nuxt to="/login">Login</v-btn>
        </v-toolbar-items>
      <v-spacer> </v-spacer>
      <nuxt-link to="/" class="hidden-sm-and-down ml-5"><img src="/img/logo.png" contain width="45px" height="45px" alt="Aidline logo" /></nuxt-link>
        <v-spacer> </v-spacer>
        <div class="hidden-sm-and-down mr-8">
          <v-btn class="white--text ml-4" color="primary" medium nuxt to="/login"><v-icon left size="20px">{{ $i.mdiAmbulance }}</v-icon>Need an ambulance?</v-btn>
        </div>
        <v-btn icon color="secondary" @click.stop="onDarkModeToggled"><v-icon size="28px">{{ $i.mdiThemeLightDark }}</v-icon></v-btn>
    </v-app-bar>


    <v-main>
      <nuxt />
    </v-main>

    <cookie />
  </v-app>
</template>

<script>
import Cookie from "@/components/Cookie.vue";

export default {
  components: {
    "cookie" : Cookie
  },
  data: () => ({
    sideNav: false,
    i: {},
  }),
  mounted() {
    setTimeout(() => {
      if (localStorage.darkMode)
        this.$vuetify.theme.dark = localStorage.darkMode === 'true'
    }, 10)
  },
  methods: {
    onDarkModeToggled() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.darkMode = this.$vuetify.theme.dark
    },
  },
}
</script>
