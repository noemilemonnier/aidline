<template>
  <v-container>
    <v-row class="mt-5" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="elevation-12">
           <v-form ref="form" v-model="isValid" lazy-validation>
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-text-field v-model="user.email" label="Email" :prepend-icon="$i.mdiEmail" :error-messages="emailErrors" @blur="$v.user.email.$touch()" required ></v-text-field>
              <v-text-field v-model="user.password" label="Password" type="password" :prepend-icon="$i.mdiLockAlert" :error-messages="passwordErrors" @blur="$v.user.password.$touch()" required></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="ml-3" large color="primary" type="submit" @click.prevent="login">Login</v-btn>
              <v-btn class="ml-3" color="accent" large link nuxt to="/create">Sign Up</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  head: () => ({
    title: 'Login',
  }),
	data: () => ({
    isValid: false,
		user: {
			email: "",
			password: "",
		},
		errors: []
  }),
  mixins: [validationMixin],
  validations: {
    user: {
      email: { required, email },
      password: { required },
    }
  },
  computed:{
    emailErrors(){
			const errors = [];
			if( !this.$v.user.email.$dirty )
				return errors;
			!this.$v.user.email.required && errors.push( "Email is required." );
			!this.$v.user.email.email && errors.push( "Must be valid email address." );
			return errors;
    },
    passwordErrors(){
			const errors = [];
			if( !this.$v.user.password.$dirty )
                return errors;
			!this.$v.user.password.required && errors.push( "Password is required." );
			return errors;
    },
  },
	methods: {
		async login(){
			this.errors = [];
			try {
        this.isValid = true;
        await this.$store.dispatch( "login", { email: this.user.email, password: this.user.password });
			} catch( err ){
        this.isValid = false;
				this.errors.push( err.message );
			}
		}
	}
}
</script>
