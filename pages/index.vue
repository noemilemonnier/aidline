<template>
  <div>
      <v-container>
        <v-row class="mt-5 mb-5">
          <!-- What is Aidline -->
          <v-col cols="12" md="6" lg="6">
            <v-card height="100%" elevation="2" outlined shaped tile>
              <v-card-title><h2>What is Aidline?</h2></v-card-title>
              <v-card-text class="text-justify">
                <p> Aidline is a service that allows you to request an ambulance at any time online. The concept has been developed by Emiola, Farhad, Noemi, and Satkar from University of Jyväskylä, Finland.</p>
                <p> The back-end was completed by Farhad and Satkar, the front-end by Noemi and the documentation by Emiola.</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-spacer> </v-spacer>
          <!-- How to get an Ambulance -->
          <v-col cols="12" md="6" lg="6">
            <v-card height="100%" elevation="2" outlined shaped tile>
              <v-card-title><h2>Request an Ambulance</h2></v-card-title>
              <v-card-text>
                <p> 1. Create your account <NuxtLink to="/create">here</NuxtLink> </p>
                <p> 2. Select "Request an Ambulance" </p>
                <p> 3. Fill the form </p>
                <p> Do not forget to enable your location! (See <a target="_blank" href="https://docs.buddypunch.com/en/articles/919258-how-to-enable-location-services-for-chrome-safari-edge-and-android-ios-devices-gps-setting">here</a> how)</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <div>
         <hospital-map></hospital-map>
        </div>
      </v-container>
  </div>
</template>

<script>
import Map from "../components/hospitalMap";
export default {
  /* Nuxt */
  head: () => ({
    title: 'Home',
  }),
  data:() => ({
    isOpen: false
  }),
  components: {
    "hospital-map": Map,
  }
}
</script>

<style scoped>
.v-text-field {
  width: 400px;
}
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
p {
  font-size: medium;
  font-family: Helvetica, sans-serif;
}
</style>
