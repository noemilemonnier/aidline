<template>
    <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
            <v-dialog width="unset" @click:outside="onDismissed" v-model="value">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                    </v-toolbar>
                    <v-form ref="form" v-model="isValid" lazy-validation>
                <v-stepper v-model="stepper">
                    <v-stepper-header>
                        <v-divider></v-divider>
                        <v-stepper-step :editable="editTarget !== null" :complete="stepper > 1" step="1"><v-icon left> {{$i.mdiCardAccountDetailsOutline}} </v-icon> Customer </v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :editable="editTarget !== null" :complete="stepper > 2" step="2"><v-icon left> {{$i.mdiAmbulance}} </v-icon> Driver</v-stepper-step>
                        <v-divider></v-divider>
                    </v-stepper-header>

                    <v-stepper-items>
                        <v-stepper-content step="1">
                            <v-card flat class="mb-5">
                                <v-card-text>
                                    <v-row class="mx-2">
                                        <v-text-field class="mx-4 shrink" v-model="request.customer_first_name" label="First Name" :error-messages="customerFirstNameErrors" @blur="$v.request.customer_first_name.$touch()" required></v-text-field>
                                        <v-spacer/>
                                        <v-text-field class="mx-4 shrink" v-model="request.customer_last_name"  label="Last Name" :error-messages="customerLastNameErrors" @blur="$v.request.customer_last_name.$touch()" required></v-text-field>
                                    </v-row>
                                    <v-row class="mx-2">
                                        <v-text-field  class="mx-4 " v-model="request.customer_phone_number" type="number" label="Phone Number" :prepend-inner-icon="$i.mdiPhone" :error-messages="customerPhoneNumberErrors" @blur="$v.request.customer_phone_number.$touch()" required></v-text-field>
                                    </v-row>
                                    <v-row class="mx-2">
                                        <v-text-field  class="mx-4" v-model="request.customer_request_description" label="Emergency Description" :error-messages="requestDescriptionErrors" @blur="$v.request.customer_request_description.$touch()" required></v-text-field>
                                    </v-row>
                                    <v-row class="mx-2">
                                        <v-text-field   class="mx-4 " v-model="request.customer_coordinates.customer_lat" label="Latitude of Emergency" :error-messages="customerLatErrors" @blur="$v.request.customer_coordinates.customer_lat.$touch()" required></v-text-field>
                                        <v-text-field   class="mx-4 " v-model="request.customer_coordinates.customer_lng" label="Longitude of Emergency" :error-messages="customerLngErrors" @blur="$v.request.customer_coordinates.customer_lng.$touch()" required></v-text-field>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                            <v-row class="mx-5" justify='end'>
                                <v-btn text @click="onDismissed">Cancel</v-btn>
                                <v-btn color="primary" @click="stepper=2">Next</v-btn>
                            </v-row>
                        </v-stepper-content>
                        <v-stepper-content step="2">
                            <v-card flat class="mb-5">
                                <v-card-text>
                                    <v-row class="mx-2">
                                        <v-text-field class="mx-4" v-model="request.driver_first_name" label="First Name" :error-messages="driverFirstNameErrors" @blur="$v.request.driver_first_name.$touch()" required></v-text-field>
                                        <v-spacer/>
                                        <v-text-field class="mx-4" v-model="request.driver_last_name"  label="Last Name" :error-messages="driverLastNameErrors" @blur="$v.request.driver_last_name.$touch()" required></v-text-field>
                                    </v-row>
                                    <v-row class="mx-2">
                                        <v-text-field  class="mx-4" v-model="request.driving_license" label="Driving License"  :error-messages="drivingLicenseErrors" @blur="$v.request.driving_license.$touch()" required></v-text-field>
                                    </v-row>
                                    <v-row class="mx-2">
                                        <v-text-field class="mx-4" v-model="request.ambulance_number" label="Ambulance Number"  :error-messages="ambulanceNumberErrors" @blur="$v.request.ambulance_number.$touch()" required></v-text-field>
                                        <v-spacer/>
                                        <v-select  class="mx-4" v-model="request.type_ambulance" label="Type of Ambulance"  :items="ambulance_types_options" outlined @blur="$v.request.type_ambulance.$touch()" required></v-select>
                                    </v-row>
                                    <v-row class="mx-2">
                                        <v-text-field   class="mx-4 " v-model="request.driver_coordinates.driver_lat" label="Latitude of Emergency" :error-messages="driverLatErrors" @blur="$v.request.driver_coordinates.driver_lat.$touch()" required></v-text-field>
                                        <v-text-field   class="mx-4 " v-model="request.driver_coordinates.driver_lng" label="Longitude of Emergency" :error-messages="driverLngErrors" @blur="$v.request.driver_coordinates.driver_lng.$touch()" required></v-text-field>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                            <v-row class="mx-5" justify='end'>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn text @click="stepper = 1" >  Previous </v-btn>
                                        <!-- @click="onAdded" -->
                                        <v-btn color="primary" v-if="!editTarget" :disabled="!isValid" @click.prevent="validate" v-bind="attrs" v-on="on">Add</v-btn>
                                        <!-- @click="onAdded" -->
                                        <v-btn color="primary" v-else :disabled="!isValid" @click.prevent="validate" v-bind="attrs" v-on="on">Update</v-btn>
                                    </template>
                                    <span>This is not yet implemented...</span>
                                </v-tooltip>
                            </v-row>
                        </v-stepper-content>
                    </v-stepper-items>
            </v-stepper>
                    </v-form>
        </v-card>
    </v-dialog>
        </v-col>
    </v-row>
</template>
<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { roles, ambulance_types } from "~/api/types";

export default {
    props: {
		//Is form visible for v-model.
        value: Boolean,
        editTarget: Object,
    },
    mixins: [validationMixin],
    validations: {
            request: {
                customer_first_name: { required },
                customer_last_name: { required },
                customer_phone_number: { required },
                customer_request_description: { required },
                customer_coordinates: {
                    customer_lat: { required },
                    customer_lng: { required },
                },
                driver_first_name: { required },
                driver_last_name: { required },
                driver_phone_number:{ required },
                driving_license: { required },
                ambulance_number: { required },
                type_ambulance: { required },
                driver_coordinates: {
                    driver_lat: { required },
                    driver_lng: { required },
                },
            },
	},
    data: () => ({
        ambulance_types_options: Object.values( ambulance_types ).reverse(),
        request: {
                customer_user_id: null,
                customer_first_name: '',
                customer_last_name: '',
                customer_phone_number: null,
                customer_request_description: '',
                customer_coordinates: {
                    customer_lat: null,
                    customer_lng: null,
                },
                driver_id: null,
                driver_first_name: '',
                driver_last_name: '',
                driver_phone_number: null,
                driving_license: '',
                ambulance_number: null,
                type_ambulance: Object.values( ambulance_types ).reverse()[0],
                driver_coordinates: {
                    driver_lat: null,
                    driver_lng: null,
                },
        },
        stepper: 1,
        isValid: false,
    }),
    computed:{
        formTitle(){
            return this.editTarget ? "Edit Request" : "Add Request";
        },
        customerFirstNameErrors(){
			const errors = [];
			if( !this.$v.request.customer_first_name.$dirty)
				return errors;
			!this.$v.request.customer_first_name.required && errors.push( "First name is required." );
			return errors;
        },
        driverFirstNameErrors(){
			const errors = [];
			if( !this.$v.request.driver_first_name.$dirty )
				return errors;
			!this.$v.request.driver_first_name.required && errors.push( "First name is required." );
			return errors;
        },
        customerLastNameErrors(){
			const errors = [];
			if( !this.$v.request.customer_last_name.$dirty )
				return errors;
			!this.$v.request.customer_last_name.required && errors.push( "Last name is required." );
			return errors;
        },
        driverLastNameErrors(){
			const errors = [];
			if( !this.$v.request.driver_last_name.$dirty )
				return errors;
			!this.$v.request.driver_last_name.required && errors.push( "Last name is required." );
			return errors;
        },
        customerPhoneNumberErrors(){
			const errors = [];
			if( !this.$v.request.customer_phone_number.$dirty)
				return errors;
			!this.$v.request.customer_phone_number.required && errors.push( "Phone number is required." );
			return errors;
        },
        driverPhoneNumberErrors(){
			const errors = [];
			if( !this.$v.request.driver_phone_number.$dirty )
				return errors;
			!this.$v.request.driver_phone_number.required && errors.push( "Phone number is required." );
			return errors;
        },
        requestDescriptionErrors(){
			const errors = [];
			if( !this.$v.request.customer_request_description.$dirty )
				return errors;
			!this.$v.request.customer_request_description.required && errors.push( "Request description is required." );
			return errors;
        },
        customerLatErrors(){
			const errors = [];
			if( !this.$v.request.customer_coordinates.customer_lat.$dirty )
				return errors;
			!this.$v.request.customer_coordinates.customer_lat.required && errors.push( "Latitude is required." );
			return errors;
        },
        driverLatErrors(){
			const errors = [];
			if( !this.$v.request.driver_coordinates.driver_lat.$dirty )
				return errors;
			!this.$v.request.driver_coordinates.driver_lat.required && errors.push( "Latitude is required." );
			return errors;
        },
        customerLngErrors(){
			const errors = [];
			if( !this.$v.request.customer_coordinates.customer_lng.$dirty )
				return errors;
			!this.$v.request.customer_coordinates.customer_lng.required && errors.push( "Longitude is required." );
			return errors;
        },
        driverLngErrors(){
			const errors = [];
			if( !this.$v.request.driver_coordinates.driver_lng.$dirty )
				return errors;
			!this.$v.request.driver_coordinates.driver_lng.required && errors.push( "Longitude is required." );
			return errors;
        },
        drivingLicenseErrors(){
			const errors = [];
			if( !this.$v.request.driving_license.$dirty )
				return errors;
			!this.$v.request.driving_license.required && errors.push( "Driving license is required." );
			return errors;
        },
        ambulanceNumberErrors(){
			const errors = [];
			if( !this.$v.request.ambulance_number.$dirty )
				return errors;
			!this.$v.request.ambulance_number.required && errors.push( "Ambulance number is required." );
			return errors;
        },
    },
    watch: {
		editTarget( val ){
            this.stepper = 1;
			if( val )
				this.request = val;
		}
    },
    methods:{
        onDismissed(){
            this.request = {
                customer_user_id: 0,
                customer_first_name: '',
                customer_last_name: '',
                customer_phone_number: 0,
                customer_request_description: '',
                customer_coordinates: {
                    customer_lat: 0,
                    customer_lng: 0,
                },
                driver_id: 0,
                driver_first_name: '',
                driver_last_name: '',
                driver_phone_number: 0,
                driving_license: '',
                ambulance_number: 0,
                type_ambulance: Object.values( ambulance_types ).reverse()[0],
                driver_coordinates: {
                    driver_lat: 0,
                    driver_lng: 0,
                },
            };
            try{
                this.$v.$reset();
                this.$emit( "input", false );
            }
            catch(err){
                console.error(err)
            }
        },
        async onAdded(){
            this.$v.$touch();
			if( this.$v.$invalid  )
				window.alert("Form not filled correctly. Please fill the parts marked in red correctly");

			try {
				//const { data } = await this.$axios.post( "/api/admin/requests", this.formData );
				//this.$emit( "added", data.request );
				this.onDismissed();
			} catch( err ){
                console.error("Couldn't add request" );
			}
		},
		async onUpdated(){
            this.$v.$touch();
			if( this.$v.$invalid  )
				window.alert("Form not filled correctly. Please fill the parts marked in red correctly");

			try {
				//const { data } = await this.$axios.put( "/api/admin/requests", this.formData );
				//this.$emit( "updated", data.request );
				this.onDismissed();
			} catch( err ){
                console.error("Couldn't update request" );
			}
        },
    },
}
</script>