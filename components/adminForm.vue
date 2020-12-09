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
                                <v-stepper-step :editable="editTarget !== null" :complete="stepper > 1" step="1">
                                    <v-icon left> {{$i.mdiFace}} </v-icon>
                                </v-stepper-step>
                                <v-divider></v-divider>
                            </v-stepper-header>
                            <v-stepper-items>
                                <v-stepper-content step="1">
                                    <v-card flat class="mb-5">
                                        <v-card-text>
                                            <v-row class="mx-2">
                                                <v-text-field class="mx-4 shrink" label="First Name" v-model="user.first_name" :error-messages="firstNameErrors" @blur="$v.user.first_name.$touch()" required></v-text-field>
                                                <v-spacer/>
                                                <v-text-field class="mx-4 shrink" label="Last Name" :error-messages="lastNameErrors" v-model="user.last_name" @blur="$v.user.last_name.$touch()" required></v-text-field>
                                            </v-row>
                                            <v-row class="mx-2">
                                                <v-text-field class="mx-4" label="Email" :error-messages="emailErrors" v-model="user.email" :prepend-inner-icon="$i.mdiEmail" @blur="$v.user.email.$touch()" required></v-text-field>
                                            </v-row>
                                            <v-row class="mx-2">
                                                <v-text-field class="mx-4 " label="Password" :error-messages="passwordErrors" v-model="user.password" type="password" :prepend-inner-icon="$i.mdiLockAlert" @blur="$v.user.password.$touch()" required></v-text-field>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                    <v-row class="mx-5" justify='end'>
                                        <v-btn text @click.stop="onDismissed"> Cancel </v-btn>
                                        <!-- @click="onAdded" -->
                                        <v-btn color="primary" v-if="!editTarget" :disabled="!isValid" @click.prevent="onAdded">Add</v-btn>
                                        <!-- @click="onUpdated" -->
                                        <v-btn color="primary" v-else :disabled="!isValid" @click.prevent="onUpdated">Update</v-btn>
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
import { roles } from "~/api/types";
import apis from "~/api/calls"

export default {
    props: {
        value: Boolean,
        editTarget: Object,
    },
    data: () => ({
        roles: Object.values(roles).reverse(),
        user: {
            id: null,
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            user_type_id: Object.values(roles).reverse()[0],
        },
        stepper: 1,
        isValid: false,
    }),
    computed: {
        formTitle() {
            return this.editTarget ? "Edit Admin" : "Add Admin";
        },
        firstNameErrors() {
            const errors = [];
            if (!this.$v.user.first_name.$dirty)
                return errors;
            !this.$v.user.first_name.required && errors.push("First name is required.");
            return errors;
        },
        lastNameErrors() {
            const errors = [];
            if (!this.$v.user.last_name.$dirty)
                return errors;
            !this.$v.user.last_name.required && errors.push("Last name is required.");
            return errors;
        },
        emailErrors() {
            const errors = [];
            if (!this.$v.user.email.$dirty)
                return errors;
            !this.$v.user.email.required && errors.push("Email is required.");
            !this.$v.user.email.email && errors.push("Must be valid email address.");
            return errors;
        },
        passwordErrors() {
            const errors = [];
            if (!this.$v.user.password.$dirty)
                return errors;
            !this.$v.user.password.minLength && errors.push("Password must be at least 4 characters long.");
            !this.$v.user.password.required && errors.push("Password is required.");
            return errors;
        }
    },
    watch: {
        async editTarget(val) {
            this.stepper = 1;
            if (val) {
                this.user = val;
                let response = await apis.getUserByID(this.user.id)
                if(response !== null || response !== undefined){
                        this.user.user_id = response.user.id;
                        this.user.user_type_id = response.user.user_type_id;
                        this.user.email = response.user.email;
                        this.user.password = response.user.password;
                        this.oldpswrd = response.user.password;
                        this.user.first_name = response.user.first_name;
                        this.user.last_name = response.user.last_name;
                }
            }
        }
    },
    mixins: [validationMixin],
    validations: {
        user: {
            email: { required, email },
            password: { required, minLength: minLength(4) },
            first_name: { required },
            last_name: { required }
        },
    },
    methods: {
        onDismissed() {
            this.user = {
                id: null,
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                user_type_id: Object.values(roles).reverse()[0],
            };
           try {
                this.stepper = 1;
                this.$emit("input", false);
            } catch (err) {
                console.error(err);
            }
        },
        async onAdded() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                console.error("Form not filled correctly. Please fill the parts marked in red correctly");
            }
            try {
                await this.$store.dispatch('create_admin', {
                    email: this.user.email,
                    password: this.user.password,
                    first_name: this.user.first_name,
                    last_name: this.user.last_name
                })
                this.onDismissed();
                this.$router.replace("/admin")
            } catch (err) {
                console.error("Couldn't add admin");
            }
        },
        async onUpdated() {
            this.$v.$touch();
            if (this.$v.$invalid)
                if (this.$v.user.first_name.$invalid || this.$v.user.last_name.$invalid || this.$v.user.email.$invalid || this.$v.user.user_type_id.$invalid)
                    console.error("Form not filled correctly. Please fill the parts marked in red correctly");

            try {
                if (this.oldpswrd === this.CryptoJS.MD5(this.user.password).toString() || this.oldpswrd === this.user.password) { //if password did NOT changed
                    await this.$store.dispatch('update_admin', {
                        admin_user_id: this.user.id,
                        email: this.user.email,
                        password: null,
                        first_name: this.user.first_name,
                        last_name: this.user.last_name
                    })
                } else {
                    await this.$store.dispatch('update_admin', {
                        admin_user_id: this.user.id,
                        email: this.user.email,
                        password: this.user.password,
                        first_name: this.user.first_name,
                        last_name: this.user.last_name
                    })
                }
                this.onDismissed();
            } catch (err) {
                console.error("Couldn't update driver");
            }
        },
    },
}
</script>