<template>
  <div>
    <v-parallax>
      <v-container>
        <v-row class="d-block text-center" style="z-index: 5">
          <h1 class="header">Aidline {{ statusCode }}!</h1>
          <p>
            <b>{{ message }}</b><br />
            <i>{{ subMessage }}</i>
          </p>
          <v-btn v-if="is401" nuxt color="secondary" to="/login">Login</v-btn>
          <v-btn v-if="!is401" nuxt color="secondary" to="/">Back to Home Page</v-btn>
        </v-row>
      </v-container>
      <v-overlay class="enable-scroll" absolute color="rgb( 27, 27, 27 )" opacity="0.75" z-index="-1"></v-overlay>
    </v-parallax>
  </div>
</template>

<script>
export default {
  /* Nuxt */
  name: 'Error',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },

  /* Vue */
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500
    },
    // Not authenticated.
    is401() {
      return this.statusCode === 401
    },
    // Not authorized.
    is403() {
      return this.statusCode === 403
    },
    message() {
      return this.error.message || `<%= messages.client_error %>`
    },
    subMessage() {
      return this.error.subMessage
    },
  },
  head: () => ({
    title: 'Error',
  }),
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
