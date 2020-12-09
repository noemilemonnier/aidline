<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-form ref="form" v-model="isValid" lazy-validation>
            <v-stepper v-model="stepper">
              <v-stepper-header>
                <v-divider></v-divider>
                <v-stepper-step :complete="stepper > 1" step="1">
                  <v-icon left> {{ $i.mdiCardAccountDetailsOutline }} </v-icon> User
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="stepper > 2" step="2">
                  <v-icon left> {{ $i.mdiCreditCardPlusOutline }} </v-icon> Payment
                </v-stepper-step>
                <v-divider></v-divider>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card flat>
                    <v-card-text>
                      <v-row class="mx-2">
                        <v-text-field class="mx-4 shrink" v-model="user.first_name" label="First Name" :error-messages="firstNameErrors" @blur="$v.user.first_name.$touch()" required></v-text-field>
                        <v-spacer />
                        <v-text-field class="mx-4 shrink" v-model="user.last_name" label="Last Name" :error-messages="lastNameErrors" @blur="$v.user.last_name.$touch()" required></v-text-field>
                      </v-row>
                      <v-row class="mx-2">
                        <v-text-field class="mx-4 shrink" v-model="user.street_address" label="Street Address" :error-messages="addressErrors" @blur="$v.user.street_address.$touch()" required></v-text-field>
                      </v-row>
                      <v-row class="mx-2">
                        <v-text-field class="mx-4 shrink" v-model="user.postal_code" label="Postal Code" :error-messages="postalCodeErrors" @blur="$v.user.postal_code.$touch()" required></v-text-field>
                        <v-spacer />
                        <v-text-field class="mx-4 shrink" v-model="user.city" label="City" :error-messages="cityErrors" @blur="$v.user.city.$touch()" required></v-text-field>
                      </v-row>
                      <v-row class="mx-2">
                        <v-text-field class="mx-4 shrink" v-model="user.country" label="Country" :error-messages="countryErrors" @blur="$v.user.country.$touch()" required></v-text-field>
                        <v-spacer />
                        <v-text-field class="mx-4 shrink" v-model="user.age" type="number" min="0" label="Age" :error-messages="ageErrors" @blur="$v.user.age.$touch()" required></v-text-field>
                      </v-row>
                      <v-row class="mx-2">
                        <v-text-field class="mx-4" v-model="user.phone_number" type="number" label="Phone Number" :prepend-inner-icon="$i.mdiPhone" :error-messages="phoneNumberErrors" @blur="$v.user.phone_number.$touch()" required></v-text-field>
                      </v-row>
                      <v-row class="mx-2">
                        <v-text-field class="mx-4" v-model="user.email" label="Email" :prepend-inner-icon="$i.mdiEmail" :error-messages="emailErrors" @blur="$v.user.email.$touch()" required></v-text-field>
                      </v-row>
                      <v-row class="mx-2">
                        <v-text-field class="mx-4" v-model="user.password" label="Password" type="password" :prepend-inner-icon="$i.mdiLockAlert" :error-messages="passwordErrors" @blur="$v.user.password.$touch()" required></v-text-field>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  <v-row justify="end">
                    <v-btn large class="ma-2" color="primary" @click="stepper = 2"> Continue </v-btn>
                  </v-row>
                </v-stepper-content>
                <v-stepper-content step="2">
                  <v-card flat>
                    <v-card-text>
                      <v-row class="mx-2">
                        <v-select class="pr-1" :items="card_type_options" item-text="text" label="Card Type" outlined v-model="user.card_type" required></v-select>
                      </v-row>
                      <v-row class="mx-2">
                        <v-text-field v-model="user.card_holder" label="Card Holder Name" :error-messages="cardHolderErrors" @blur="$v.user.card_holder.$touch()" required></v-text-field>
                      </v-row>
                      <v-row class="mx-2">
                        <v-text-field v-model="user.card_number" label="Card Number" type="number" :error-messages="cardNumberErrors" @blur="$v.user.card_number.$touch()" required></v-text-field>
                      </v-row>
                      <v-row class="mx-2">
                        <v-text-field v-model="user.card_cvv" label="CVV" type="number" :error-messages="cvvErrors" @blur="$v.user.card_cvv.$touch()" required></v-text-field>
                        <v-spacer />
                        <v-text-field v-model="user.card_expiry" label="Expiry Date (mm/yy)" :error-messages="cardExpiryErrors" @blur="$v.user.card_expiry.$touch()" required :rules="[rules.expiration]"></v-text-field>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  <v-spacer></v-spacer>
                  <v-row justify="end">
                    <v-btn large class="mx-3" color="primary" @click="stepper = 1"> Previous </v-btn>
                    <v-btn large class="mx-3" color="primary" :disabled="!isValid" @click.prevent="validate">Submit</v-btn>
                  </v-row>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { roles, card_types } from "~/api/types";

export default {
  head: () => ({
    title: "Create user",
  }),
  data: () => ({
    isValid: false,
    stepper: 1,
    role: Object.values(roles).reverse()[0],
    card_type_options: Object.values(card_types).reverse(),
    user: {
      user_id: null,
      age: null,
      first_name: "",
      last_name: "",
      street_address: "",
      postal_code: null,
      phone_number: null,
      password: "",
      city: "",
      country: "",
      email: "",
      card_holder: "",
      card_type: Object.values(card_types).reverse()[0],
      card_number: null,
      card_expiry: "",
      card_cvv: null,
    },
    items: ["User Information", "Payment Method"],
    errors: [],
    rules: {
      expiration: (value) => {
        const pattern = /(0[1-9]|1[012])\/(\d{2})/;
        return pattern.test(value) || "Invalid expiration.";
      },
    },
  }),
  mixins: [validationMixin],
  validations: {
    user: {
      email: { required, email },
      password: { required, minLength: minLength(4) },
      first_name: { required },
      last_name: { required },
      street_address: { required },
      postal_code: { required },
      phone_number: { required },
      city: { required },
      age: { required },
      country: { required },
      card_holder: { required },
      card_type: { required },
      card_number: { required },
      card_expiry: { required },
      card_cvv: { required },
    },
  },
  computed: {
    firstNameErrors() {
      const errors = [];
      if (!this.$v.user.first_name.$dirty) return errors;
      !this.$v.user.first_name.required && errors.push("First name is required.");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.user.last_name.$dirty) return errors;
      !this.$v.user.last_name.required && errors.push("Last name is required.");
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.user.street_address.$dirty) return errors;
      !this.$v.user.street_address.required && errors.push("Street Address is required.");
      return errors;
    },
    postalCodeErrors() {
      const errors = [];
      if (!this.$v.user.postal_code.$dirty) return errors;
      !this.$v.user.postal_code.required && errors.push("Postal code is required.");
      return errors;
    },
    cityErrors() {
      const errors = [];
      if (!this.$v.user.city.$dirty) return errors;
      !this.$v.user.city.required && errors.push("City is required.");
      return errors;
    },
    countryErrors() {
      const errors = [];
      if (!this.$v.user.country.$dirty) return errors;
      !this.$v.user.country.required && errors.push("Country is required.");
      return errors;
    },
    ageErrors() {
      const errors = [];
      if (!this.$v.user.age.$dirty) return errors;
      !this.$v.user.age.required && errors.push("Age is required.");
      return errors;
    },
    phoneNumberErrors() {
      const errors = [];
      if (!this.$v.user.phone_number.$dirty) return errors;
      !this.$v.user.phone_number.required && errors.push("Phone Number is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.user.email.$dirty) return errors;
      !this.$v.user.email.required && errors.push("Email is required.");
      !this.$v.user.email.email && errors.push("Must be valid email address.");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.user.password.$dirty) return errors;
      !this.$v.user.password.minLength && errors.push("Password must be at least 4 characters long.");
      !this.$v.user.password.required && errors.push("Password is required.");
      return errors;
    },
    cardHolderErrors() {
      const errors = [];
      if (!this.$v.user.card_holder.$dirty) return errors;
      !this.$v.user.card_holder.required && errors.push("Card Holder name is required.");
      return errors;
    },
    cardNumberErrors() {
      const errors = [];
      if (!this.$v.user.card_number.$dirty) return errors;
      !this.$v.user.card_number.required && errors.push("Card number is required.");
      return errors;
    },
    cvvErrors() {
      const errors = [];
      if (!this.$v.user.card_cvv.$dirty) return errors;
      !this.$v.user.card_cvv.required && errors.push("Card CVV is required.");
      return errors;
    },
    cardExpiryErrors() {
      const errors = [];
      if (!this.$v.user.card_expiry.$dirty) return errors;
      !this.$v.user.card_expiry.required && errors.push("Card expiration date is required.");
      return errors;
    },
  },
  methods: {
    validate() {
      this.$v.$touch();
      this.$gtag.event("create-user", {
        event_category: "engagement",
        event_label: "Create User",
        value: 1,
      });
      if (this.$v.$invalid) {
        window.alert("Form not filled correctly. Please fill the parts marked in red correctly");
      } else {
        this.create();
      }
    },
    async create() {
      this.errors = [];
      this.$v.$touch();
      if (this.$v.$invalid) {
        window.alert("Form not filled correctly. Please fill the parts marked in red correctly");
      }
      try {
        await this.$store.dispatch("create_user", {
          status: false,
          email: this.user.email,
          password: this.user.password,
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          user_type_id: 1,
          customer_phone: this.user.phone_number,
          street_address: this.user.street_address,
          postal_code: this.user.postal_code,
          city: this.user.city,
          country: this.user.country,
          age: this.user.age,
          credit_card_number: this.user.card_number,
          credit_card_cvv: this.user.card_cvv,
          credit_card_type: this.user.card_type,
          credit_card_holder_name: this.user.card_holder,
          credit_card_expiry: this.user.card_expiry,
        });
      } catch (err) {
        this.errors.push(err.message);
      }
    },
  },
};
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
</style>
