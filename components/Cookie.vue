<template>
  <v-container >
      <div class="ma-2">
       <v-snackbar v-model="snackbar" shaped elevation="15" centered multi-line timeout=-1>
           <v-row class="mx-2 text-center">
               <v-col> <h2>Cookies & Privacy</h2></v-col>
            </v-row>
            <v-row class="mx-2 text-justify">
               <v-col>
                   <div>{{ message }}
                   <nuxt-link to="/privacy-policy"> Privacy policy</nuxt-link> </div>
               </v-col>
           </v-row>
           <v-row class="mx-5" justify='end'>
                    <v-btn class="mx-5" height="40px" width="100px" color="green"  @click="accept">{{ buttonTextAccept }}</v-btn>
                    <!-- <v-btn class="mx-5" height="40px" width="100px" color="primary"  @click="deny" > {{ buttonTextDeny }} </v-btn> -->
           </v-row>
    </v-snackbar>
      </div>
  </v-container>
</template>

<script>
import CookieConsent from 'vue-cookieconsent-component'

export default {
  components: {
    CookieConsent
  },
  props: {
    buttonTextAccept: {
      type: String,
      default: "Accept"
    },
    buttonTextDeny: {
      type: String,
      default: "Deny"
    },
    message: {
      type: String,
      default:
        "We use cookies to provide our services and for analytics and marketing. By continuing to browse our website, you agree to our use of cookies. To find out more about our use of cookies, please see our "
    }
  },
  data() {
    return {
      snackbar: true,
    };
  },
  created() {
    if (!this.getGDPR() === true && this.$store.state.acceptedPolicy === false) {
      this.snackbar = true;
    }
    if(this.$store.state.acceptedPolicy === true){
        this.snackbar = false;
    }
  },
  methods: {
    getGDPR() {
      if (process.browser) {
        return localStorage.getItem("GDPR:accepted", true);
      }
    },
    accept() {
      if (process.browser) {
        this.snackbar = false;
        this.$store.dispatch( "setPolicyAnswer" );
        localStorage.setItem("GDPR:accepted", true);
        this.$gtag.event('accepted-privacy-policy', {
            'event_category': 'documentation',
            'event_label': 'Accepted Privacy Policy Button',
            'value': 1
        })
      }
    },
    deny() {
      if (process.browser) {
        this.snackbar = false;
        localStorage.setItem("GDPR:accepted", false);
      }
    }
  }
};
</script>