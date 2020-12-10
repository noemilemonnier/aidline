<template>
    <div>
        <v-container>
            <h1 class="text-center">Your Settings</h1>
            <v-divider></v-divider>
            <div class="text-center ma-12">
                <!-- Change to isLoading and then set it to false when it is ready to charge the page-->
                <v-progress-circular :size="200" color="primary" indeterminate v-if="isLoading"></v-progress-circular>
            </div>
        </v-container>
        <v-container>
              <v-form ref="form" v-model="isValid" lazy-validation>
                  <v-stepper v-model="stepper">
                      <v-stepper-header>
                          <v-divider></v-divider>
                          <v-stepper-step :complete="stepper > 1" step="1"> <v-icon left> {{$i.mdiCardAccountDetailsOutline}} </v-icon> User </v-stepper-step>
                          <v-divider></v-divider>
                          <v-stepper-step :complete="stepper > 2" step="2" > <v-icon left> {{$i.mdiCreditCardPlusOutline}} </v-icon> Payment </v-stepper-step>
                          <v-divider></v-divider>
                        </v-stepper-header>
                        <v-stepper-items>
                            <v-stepper-content step="1">
                                <v-card flat>
                                    <v-card-text>
                                        <v-row class="mx-2">
                                            <v-text-field class="mx-4 shrink" v-model="user.first_name" label="First Name" :error-messages="firstNameErrors" @blur="$v.user.first_name.$touch()" required></v-text-field>
                                            <v-spacer/>
                                            <v-text-field class="mx-4 shrink" v-model="user.last_name"  label="Last Name" :error-messages="lastNameErrors" @blur="$v.user.last_name.$touch()" required></v-text-field>
                                        </v-row>
                                        <v-row class="mx-2">
                                            <v-text-field class="mx-4 shrink"  v-model="user.driver_license_number" label="Driving License Number" :error-messages="drivingLicenseNumberErrors" @blur="$v.user.driver_license_number.$touch()" required></v-text-field>
                                        </v-row>
                                        <v-row class="mx-2">
                                            <v-text-field  class="mx-4 shrink" v-model="user.ambulance_license_plate" label="Ambulance License Plate" :error-messages="ambulanceLicensePlateErrors" @blur="$v.user.ambulance_license_plate.$touch()" required></v-text-field>
                                            <v-spacer/>
                                            <v-select  class="pr-1 mx-4 shrink"  :items="ambulance_types" item-text="label" item-value="value" label="Ambulance Type" outlined v-model="user.type_of_ambulance" required></v-select>
                                        </v-row>
                                        <v-row class="mx-2">
                                            <v-text-field  class="mx-4" v-model="user.driver_phone" type="number" label="Phone Number" :prepend-inner-icon="$i.mdiPhone" :error-messages="phoneNumberErrors" @blur="$v.user.driver_phone.$touch()" required></v-text-field>
                                        </v-row>
                                        <v-row class="mx-2">
                                            <v-text-field  class="mx-4" v-model="user.email" label="Email" :prepend-inner-icon="$i.mdiEmail" disabled></v-text-field>
                                        </v-row>
                                        <v-row class="mx-2">
                                            <v-text-field   class="mx-4 " v-model="user.password" label="Password" type="password" :prepend-inner-icon="$i.mdiLockAlert" :error-messages="passwordErrors" @blur="$v.user.password.$touch()" required></v-text-field>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                                <v-row justify='end'>
                                    <v-btn large class="ma-2" color="primary" @click="stepper = 2" >  Continue </v-btn>
                                </v-row>
                            </v-stepper-content>
                            <v-stepper-content step="2">
                                <v-card flat>
                                    <v-card-text>
                                        <v-row class="mx-2">
                                            <v-select  class="pr-1"  :items="card_type_options" item-text="text" label="Card Type" outlined v-model="user.card_type" required></v-select>
                                        </v-row>
                                        <v-row class="mx-2">
                                            <v-text-field  v-model="user.card_holder" label="Card Holder Name" :error-messages="cardHolderErrors" @blur="$v.user.card_holder.$touch()" required ></v-text-field>
                                        </v-row>
                                        <v-row class="mx-2">
                                            <v-text-field  v-model="user.card_number" label="Card Number" type="number" :error-messages="cardNumberErrors" @blur="$v.user.card_number.$touch()" required></v-text-field>
                                        </v-row>
                                        <v-row class="mx-2">
                                            <v-text-field  v-model="user.card_cvv" label="CVV" type="number" :error-messages="cvvErrors" @blur="$v.user.card_cvv.$touch()" required></v-text-field>
                                            <v-spacer/>
                                            <v-text-field  v-model="user.card_expiry" label="Expiry Date (mm/yy)" :error-messages="cardExpiryErrors" @blur="$v.user.card_expiry.$touch()" required :rules="[rules.expiration]"></v-text-field>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                                <v-spacer></v-spacer>
                                <v-row class="mt-3" justify='end'>
                                    <v-btn large class="mx-3" color="primary" @click="stepper = 1" >  Previous </v-btn>
                                    <v-btn large class="mx-3" color="primary" :disabled="!isValid" @click.prevent="validate">Update</v-btn>
                                 </v-row>
                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
                </v-form>
        </v-container>
    </div>
</template>
<script>
import { mdiCheckboxBlankOutline } from "@mdi/js";
import { required, email, minLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { card_types, ambulance_types } from "~/api/types";
import { getters } from "~/store/store";
import apis from "~/api/calls"

export default {
    layout: "admin",
    middleware: 'driver',
	head: () => ({
        title: "Settings"
    }),
    data: () => ({
        isValid: false,
        stepper: 1,
        oldpswrd: '',
        isLoading: true,
        error: [],
        i: {
			mdiCheckboxBlankOutline,
        },
        items: [
          'User Information', 'Payment Method'
        ],
        rules: {
          expiration: value => {
            const pattern = /(0[1-9]|1[012])\/(\d{2})/
            return pattern.test(value) || 'Invalid expiration.'
          }
        },
        card_type_options: Object.values( card_types ).reverse(),
        ambulance_type_options: Object.values( ambulance_types ).reverse(),
        ambulance_types: ambulance_types,
        user: {
            user_id: 0,
            user_type_id: 2,
            first_name: '',
            last_name: '',
            driver_phone: 0,
            latitude: 0,
            longitude: 0,
            email: '',
            password: '',
            driver_license_number: '',
            ambulance_license_plate: '',
            type_of_ambulance: 1,
            card_type: '',
            card_holder: '',
            card_number: 0,
            card_expiry: '',
            card_cvv: 0
        }
    }),
    mixins: [validationMixin],
    validations: {
        user: {
            email: { required, email },
            password: { required, minLength: minLength(4) },
            first_name: { required },
            last_name: { required },
            driver_phone: { required },
            driver_license_number: { required },
            ambulance_license_plate: { required },
            type_of_ambulance: { required },
            card_holder: { required },
            card_type: { required },
            card_number: { required },
            card_expiry: { required },
            card_cvv: { required }
        },
    },
    async mounted(){
        try{
            let response = await apis.getUserByID(getters.GET_USER_ID())
            if(response !== null || response !== undefined){
                this.user.user_id = response.user.id;
                this.user.user_type_id = response.user.user_type_id;
                this.user.email = response.user.email;
                this.user.password = response.user.password;
                this.oldpswrd = response.user.password;
                this.user.first_name = response.user.first_name;
                this.user.last_name = response.user.last_name;
                this.user.driver_phone = response.detail.driver_phone;
                this.user.ambulance_license_plate = response.detail.ambulance_license_plate;
                this.user.driver_license_number = response.detail.driver_license_number;
                for (const [key, value] of Object.entries(this.ambulance_types)) {
                    if(response.detail.type_of_ambulance === key){
                        this.user.type_of_ambulance = key;
                    }
                }
                for (const [key, value] of Object.entries(this.card_type_options)) {
                    if(response.detail.credit_card_type === value){
                        this.user.card_type = value;
                    }
                }
                this.user.card_number = response.detail.credit_card_number;
                this.user.card_holder = response.detail.credit_card_holder_name;
                this.user.card_cvv = response.detail.credit_card_cvv;
                this.user.card_expiry = response.detail.credit_card_expiry;
            }
        } catch (err) {
            console.error("Couldn't fetch user", err);
        }
        this.isLoading = false;
    },
    computed:{
        firstNameErrors(){
			const errors = [];
			if( !this.$v.user.first_name.$dirty )
				return errors;
			!this.$v.user.first_name.required && errors.push( "First name is required." );
			return errors;
        },
        lastNameErrors(){
			const errors = [];
			if( !this.$v.user.last_name.$dirty )
				return errors;
			!this.$v.user.last_name.required && errors.push( "Last name is required." );
			return errors;
        },
        drivingLicenseNumberErrors(){
            const errors = [];
			if( !this.$v.user.driver_license_number.$dirty )
				return errors;
			!this.$v.user.driver_license_number.required && errors.push( "Driving license is required." );
			return errors;
        },
        ambulanceLicensePlateErrors(){
            const errors = [];
			if( !this.$v.user.ambulance_license_plate.$dirty )
				return errors;
			!this.$v.user.ambulance_license_plate.required && errors.push( "Ambulance license plate is required." );
			return errors;
        },
        phoneNumberErrors(){
            const errors = [];
			if( !this.$v.user.driver_phone.$dirty )
				return errors;
			!this.$v.user.driver_phone.required && errors.push( "Phone Number is required." );
			return errors;
        },
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
            !this.$v.user.password.minLength && errors.push("Password must be at least 4 characters long.");
			!this.$v.user.password.required && errors.push( "Password is required." );
			return errors;
        },
        cardHolderErrors(){
            const errors = [];
			if( !this.$v.user.card_holder.$dirty )
                return errors;
			!this.$v.user.card_holder.required && errors.push( "Card Holder name is required." );
			return errors;
        },
        cardNumberErrors(){
            const errors = [];
			if( !this.$v.user.card_number.$dirty )
                return errors;
			!this.$v.user.card_number.required && errors.push( "Card number is required." );
			return errors;
        },
        cvvErrors(){
            const errors = [];
			if( !this.$v.user.card_cvv.$dirty )
                return errors;
			!this.$v.user.card_cvv.required && errors.push( "Card CVV is required." );
			return errors;
        },
        cardExpiryErrors(){
            const errors = [];
			if( !this.$v.user.card_expiry.$dirty )
                return errors;
			!this.$v.user.card_expiry.required && errors.push( "Card expiration date is required." );
			return errors;
        },
    },
    methods: {
        validate(){
            this.$v.$touch();
            if( this.$v.$invalid  ) {
                window.alert("Form not filled correctly. Please fill the parts marked in red correctly");
            }
            else{
                this.update()
            }
        },
        async update() {
            try {
                if(this.oldpswrd === this.CryptoJS.MD5(this.user.password).toString() || this.oldpswrd === this.user.password){ //if password did NOT changed
                    await this.$store.dispatch('update_driver', {
                        driver_user_id : getters.GET_USER_ID(),
                        email: this.user.email,
                        password: null,
                        first_name: this.user.first_name,
                        last_name: this.user.last_name,
                        driver_license_number: this.user.driver_license_number,
                        ambulance_license_plate: this.user.ambulance_license_plate,
                        driver_phone: this.user.driver_phone,
                        latitude: this.$store.state.lat,
                        longitude: this.$store.state.lng,
                        type_of_ambulance: this.user.type_of_ambulance,
 	                    credit_card_number : this.user.card_number,
	                    credit_card_cvv : this.user.card_cvv,
	                    credit_card_type : this.user.card_type,
	                    credit_card_holder_name : this.user.card_holder,
	                    credit_card_expiry : this.user.card_expiry
                    })
                }
                else{
                    await this.$store.dispatch('update_driver', {
                        driver_user_id : getters.GET_USER_ID(),
                        email: this.user.email,
                        password: this.user.password,
                        first_name: this.user.first_name,
                        last_name: this.user.last_name,
                        driver_license_number: this.user.driver_license_number,
                        ambulance_license_plate: this.user.ambulance_license_plate,
                        driver_phone: this.user.driver_phone,
                        type_of_ambulance: this.user.type_of_ambulance,
                        latitude: this.$store.state.lat,
                        longitude: this.$store.state.lng,
	                    credit_card_number : this.user.card_number,
	                    credit_card_cvv : this.user.card_cvv,
	                    credit_card_type : this.user.card_type,
	                    credit_card_holder_name : this.user.card_holder,
	                    credit_card_expiry : this.user.card_expiry
                    })
                }
                this.oldpswrd = this.CryptoJS.MD5(this.user.password).toString();
            } catch (err) {
                window.alert("There was an error while updating your profile." + err.message)
            }
         },
    }
}
</script>
