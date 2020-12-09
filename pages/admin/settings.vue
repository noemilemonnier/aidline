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
            <v-card>
                <v-tabs v-model="tab" background-color="transparent" grow >
                    <v-tab><v-icon left> {{$i.mdiCardAccountDetailsOutline}} </v-icon></v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item>
                        <v-card flat >
                            <v-form ref="form" v-model="isValid" lazy-validation>
                                <v-card-text>
                                    <v-row class="mx-2">
                                        <v-text-field v-model="admin.first_name" label="First Name" :error-messages="firstNameErrors" @blur="$v.admin.first_name.$touch()" required></v-text-field>
                                        <v-spacer/>
                                        <v-text-field v-model="admin.last_name"  label="Last Name" :error-messages="lastNameErrors" @blur="$v.admin.last_name.$touch()" required></v-text-field>
                                    </v-row>
                                    <v-row class="mx-2">
                                        <v-text-field v-model="admin.email" disabled label="Email" :prepend-inner-icon="$i.mdiEmail" readonly ></v-text-field>
                                    </v-row>
                                    <v-row class="mx-2">
                                        <v-text-field   v-model="admin.password" label="Password" type="password" :prepend-inner-icon="$i.mdiLockAlert" :error-messages="passwordErrors" @blur="$v.admin.password.$touch()" required></v-text-field>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn class="mx-6 mb-2" large color="primary" :disabled="!isValid" @click.prevent="validate" v-bind="attrs" v-on="on">Submit</v-btn>
                                        </template>
                                        <span>This is not yet implemented...</span>
                                    </v-tooltip>
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-card>
        </v-container>
    </div>
</template>
<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { getters } from "~/store/store";
import apis from "~/api/calls"

export default {
    layout: "admin",
	head: () => ({
        title: "Settings"
    }),
    mixins: [validationMixin],
    validations: {
        admin: {
            first_name: { required },
            last_name: { required },
            email: { required },
            password: { required , minLength: minLength(4) }
        }
    },
    data: () => ({
        isValid: false,
        isLoading: true,
        tab: null,
        oldpswrd: '',
        admin: {
            user_id: 0,
            user_type_id: 3,
            first_name: '',
            last_name: '',
            password: '',
            email: ''
        }
    }),
    computed:{
        firstNameErrors(){
            const errors = [];
			if( !this.$v.admin.first_name.$dirty)
				return errors;
			!this.$v.admin.first_name.required && errors.push( "First name is required." );
			return errors;
        },
        lastNameErrors(){
			const errors = [];
			if( !this.$v.admin.last_name.$dirty )
				return errors;
			!this.$v.admin.last_name.required && errors.push( "Last name is required." );
			return errors;
        },
        emailErrors(){
			const errors = [];
			if( !this.$v.admin.email.$dirty )
				return errors;
			!this.$v.admin.email.required && errors.push( "Email is required." );
			!this.$v.admin.email.email && errors.push( "Must be valid email address." );
			return errors;
        },
        passwordErrors(){
			const errors = [];
			if( !this.$v.admin.password.$dirty )
                return errors;
            !this.$v.admin.password.minLength && errors.push("Password must be at least 4 characters long.");
			!this.$v.admin.password.required && errors.push( "Password is required." );
			return errors;
        }
    },
    async mounted(){
        try{
            let response = await apis.getUserByID(getters.GET_USER_ID())
            if(response !== null || response !== undefined){
                this.admin.user_id = response.user.id;
                this.admin.user_type_id = response.user.user_type_id;
                this.admin.email = response.user.email;
                this.admin.password = response.user.password;
                this.oldpswrd = response.user.password;
                this.admin.first_name = response.user.first_name;
                this.admin.last_name = response.user.last_name;
            }
        } catch (e) {
            console.error("Couldn't fetch user.");
        }
        this.isLoading = false;
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
                if(this.oldpswrd === this.CryptoJS.MD5(this.admin.password).toString() || this.oldpswrd === this.admin.password){ //if password did NOT changed
                    await this.$store.dispatch('update_admin', {
                        admin_user_id: getters.GET_USER_ID(),
                        email: this.admin.email,
                        password: null,
                        firstName: this.admin.first_name,
                        lastName: this.admin.last_name,
                    })
                }
                else{
                    await this.$store.dispatch('update_admin', {
                        email: this.admin.email,
                        password: this.admin.password,
                        firstName: this.admin.first_name,
                        lastName: this.admin.last_name,
                    })
                }
            } catch (err) {
                console.error(err.message)
            }
         },
    }
}
</script>