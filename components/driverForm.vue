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
                                    <v-icon left> {{$i.mdiCardAccountDetailsOutline}} </v-icon>
                                </v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step :editable="editTarget !== null" :complete="stepper > 2" step="2">
                                    <v-icon left> {{$i.mdiAmbulance}} </v-icon>
                                </v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step :editable="editTarget !== null" :complete="stepper > 3" step="3">
                                    <v-icon left> {{$i.mdiCreditCardSettingsOutline}} </v-icon>
                                </v-stepper-step>
                                <v-divider></v-divider>
                            </v-stepper-header>
    
                            <v-stepper-items>
                                <v-stepper-content step="1">
                                    <v-card flat class="mb-5">
                                        <v-card-text>
                                            <v-row class="mx-2">
                                                <v-text-field class="mx-4 shrink" v-model="user.first_name" label="First Name" :error-messages="firstNameErrors" @blur="$v.user.first_name.$touch()" required></v-text-field>
                                                <v-spacer/>
                                                <v-text-field class="mx-4 shrink" v-model="user.last_name" label="Last Name" :error-messages="lastNameErrors" @blur="$v.user.last_name.$touch()" required></v-text-field>
                                            </v-row>
                                            <v-row class="mx-2">
                                                <v-text-field class="mx-4 " v-model="user.phone_number" type="number" label="Phone Number" :prepend-inner-icon="$i.mdiPhone" :error-messages="phoneNumberErrors" @blur="$v.user.phone_number.$touch()" required></v-text-field>
                                            </v-row>
                                            <v-row class="mx-2">
                                                <v-text-field class="mx-4" v-model="user.email" label="Email" :prepend-inner-icon="$i.mdiEmail" :error-messages="emailErrors" @blur="$v.user.email.$touch()" required></v-text-field>
                                            </v-row>
                                            <v-row class="mx-2">
                                                <v-text-field class="mx-4 " v-model="user.password" label="Password" type="password" :prepend-inner-icon="$i.mdiLockAlert" :error-messages="passwordErrors" @blur="$v.user.password.$touch()" required></v-text-field>
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
                                                <v-text-field v-model="user.driver_license_number" label="Driving License" :error-messages="drivingLicenseErrors" @blur="$v.user.driver_license_number.$touch()" required></v-text-field>
                                            </v-row>
                                            <v-row class="mx-2">
                                                <v-text-field v-model="user.ambulance_license_plate" label="Ambulance Number" :error-messages="ambulanceNumberErrors" @blur="$v.user.ambulance_license_plate.$touch()" required></v-text-field>
                                                <v-spacer/>
                                                <v-select class="pr-1 mx-4 shrink" :items="ambulance_types" item-text="label" item-value="value" label="Ambulance Type" outlined v-model="user.type_of_ambulance" required></v-select>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                    <v-row class="mx-5" justify='end'>
                                        <v-btn text @click="stepper = 1"> Previous </v-btn>
                                        <v-btn color="primary" @click="stepper=3">Next</v-btn>
                                    </v-row>
                                </v-stepper-content>
                                <v-stepper-content step="3">
                                    <v-card flat class="mb-5">
                                        <v-card-text>
                                            <v-row class="mx-2">
                                                <v-select class="pr-1" :items="card_type_options" item-text="text" label="Card Type" outlined v-model="user.card_type"></v-select>
                                            </v-row>
                                            <v-row class="mx-2">
                                                <v-text-field v-model="user.card_holder" label="Card Holder Name" :error-messages="cardHolderErrors" @blur="$v.user.card_holder.$touch()" required></v-text-field>
                                            </v-row>
                                            <v-row class="mx-2">
                                                <v-text-field v-model="user.card_number" label="Card Number" type="number" :error-messages="cardNumberErrors" @blur="$v.user.card_number.$touch()" required></v-text-field>
                                            </v-row>
                                            <v-row class="mx-2">
                                                <v-text-field v-model="user.card_cvv" label="CVV" type="number" :error-messages="cvvErrors" @blur="$v.user.card_cvv.$touch()" required></v-text-field>
                                                <v-spacer/>
                                                <v-text-field v-model="user.card_expiry" label="Expiry Date (mm/yy)" :error-messages="cardExpiryErrors" @blur="$v.user.card_expiry.$touch()" required :rules="[rules.expiration]"></v-text-field>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                    <v-row class="mx-5" justify='end'>
                                        <v-btn text @click="stepper = 2"> Previous </v-btn>
                                        <!-- @click="onAdded" -->
                                        <v-btn color="primary" v-if="!editTarget" :disabled="!isValid" @click.prevent="onAdded">Add</v-btn>
                                        <!-- @click="onAdded" -->
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
import { ambulance_types, card_types } from "~/api/types";
import axios from 'axios'

export default {
    props: {
        //Is form visible for v-model.
        value: Boolean,
        editTarget: Object,
    },
    data: () => ({
        card_type_options: Object.values(card_types).reverse(),
        ambulance_types: ambulance_types,
        oldpswrd: '',
        user: {
            user_id: 0,
            first_name: '',
            last_name: '',
            driver_license_number: '',
            ambulance_license_plate: 0,
            type_of_ambulance: Object.keys(ambulance_types)[0],
            phone_number: 0,
            password: '',
            email: '',
            card_type: Object.values(card_types).reverse()[0],
            card_number: 0,
            card_expiry: '',
            card_cvv: 0
        },
        stepper: 1,
        isValid: false,
        rules: {
            expiration: value => {
                const pattern = /(0[1-9]|1[012])\/(\d{2})/
                return pattern.test(value) || 'Invalid expiration.'
            }
        },
    }),
    mixins: [validationMixin],
    validations: {
        user: {
            user_id: { required },
            email: { required, email },
            password: { required, minLength: minLength(4) },
            phone_number: { required },
            first_name: { required },
            last_name: { required },
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
    computed: {
        formTitle() {
            return this.editTarget ? "Edit Driver" : "Add Driver";
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
        phoneNumberErrors() {
            const errors = [];
            if (!this.$v.user.phone_number.$dirty)
                return errors;
            !this.$v.user.phone_number.required && errors.push("Phone Number is required.");
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
        },
        drivingLicenseErrors() {
            const errors = [];
            if (!this.$v.user.driver_license_number.$dirty)
                return errors;
            !this.$v.user.driver_license_number.required && errors.push("Driving License is required.");
            return errors;
        },
        ambulanceNumberErrors() {
            const errors = [];
            if (!this.$v.user.ambulance_license_plate.$dirty)
                return errors;
            !this.$v.user.ambulance_license_plate.required && errors.push("Ambulance license plate is required.");
            return errors;
        },
        typeAmbulanceErrors() {
            const errors = [];
            if (!this.$v.user.type_of_ambulance.$dirty)
                return errors;
            !this.$v.user.type_of_ambulance.required && errors.push("Type of Ambulance is required.");
            return errors;
        },
        cardHolderErrors() {
            const errors = [];
            if (!this.$v.user.card_holder.$dirty)
                return errors;
            !this.$v.user.card_holder.required && errors.push("Card Holder name is required.");
            return errors;
        },
        cardNumberErrors() {
            const errors = [];
            if (!this.$v.user.card_number.$dirty)
                return errors;
            !this.$v.user.card_number.required && errors.push("Card number is required.");
            return errors;
        },
        cvvErrors() {
            const errors = [];
            if (!this.$v.user.card_cvv.$dirty)
                return errors;
            !this.$v.user.card_cvv.required && errors.push("Card CVV is required.");
            return errors;
        },
        cardExpiryErrors() {
            const errors = [];
            if (!this.$v.user.card_expiry.$dirty)
                return errors;
            !this.$v.user.card_expiry.required && errors.push("Card expiration date is required.");
            return errors;
        },
    },
    watch: {
        editTarget(val) {
            this.stepper = 1;
            if (val) {
                this.user = val;
                axios.get("/api/users/" + this.user.id)
                    .then(
                        response => {
                            if (response.data.result === true) {
                                this.user.user_id = response.data.user.id;
                                this.user.user_type_id = response.data.user.user_type_id;
                                this.user.email = response.data.user.email;
                                this.user.password = response.data.user.password;
                                this.oldpswrd = response.data.user.password;
                                this.user.first_name = response.data.user.first_name;
                                this.user.last_name = response.data.user.last_name;
                                this.user.phone_number = response.data.detail.driver_phone;
                                this.user.ambulance_license_plate = response.data.detail.ambulance_license_plate;
                                this.user.driver_license_number = response.data.detail.driver_license_number;
                                for (const [key, value] of Object.entries(this.ambulance_types)) {
                                    if (response.data.detail.type_of_ambulance === key) {
                                        this.user.type_of_ambulance = key;
                                    }
                                }
                                for (const [key, value] of Object.entries(this.card_type_options)) {
                                    if (response.data.detail.credit_card_type === value) {
                                        this.user.card_type = value;
                                    }
                                }
                                this.user.card_number = response.data.detail.credit_card_number;
                                this.user.card_holder = response.data.detail.credit_card_holder_name;
                                this.user.card_cvv = response.data.detail.credit_card_cvv;
                                this.user.card_expiry = response.data.detail.credit_card_expiry;
                            }
                        }
                    )
            }
        }
    },
    methods: {
        onDismissed() {
            this.user = {
                user_id: 0,
                first_name: '',
                last_name: '',
                driver_license_number: '',
                ambulance_license_plate: 0,
                type_of_ambulance: 'Equipped',
                phone_number: 0,
                password: '',
                email: '',
                card_type: Object.values(card_types).reverse()[0],
                card_number: 0,
                card_expiry: '',
                card_cvv: 0
            };
            try {
                this.stepper = 1;
                this.$emit("input", false);
            } catch (err) {
                console.error(err)
            }
        },
        async onAdded() {
            this.$v.$touch();
            if (this.$v.$invalid)
                console.error("Form not filled correctly. Please fill the parts marked in red correctly");
            try {
                await this.$store.dispatch("create_driver", {
                    email: this.user.email,
                    password: this.user.password,
                    first_name: this.user.first_name,
                    last_name: this.user.last_name,
                    user_type_id: 2,
                    driver_license_number: this.user.driver_license_number,
                    ambulance_license_plate: this.user.ambulance_license_plate,
                    driver_phone: this.user.driver_phone,
                    type_of_ambulance: this.user.type_of_ambulance,
                    latitude: this.user.latitude,
                    longitude: this.user.longitude,
                    credit_card_number: this.user.credit_card_number,
                    credit_card_cvv: this.user.credit_card_cvv,
                    credit_card_type: this.user.credit_card_type,
                    credit_card_holder_name: this.user.credit_card_holder_name,
                    credit_card_expiry: this.user.credit_card_expiry,
                });
                this.onDismissed();
                this.$router.replace("/admin")
            } catch (err) {
                console.error("Couldn't add driver", err);
            }
        },
        async onUpdated() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                console.error("Form not filled correctly. Please fill the parts marked in red correctly");
            }
            try {
                if (this.oldpswrd === this.CryptoJS.MD5(this.user.password).toString() || this.oldpswrd === this.user.password) { //if password did NOT changed
                    await this.$store.dispatch("update_driver", {
                        driver_user_id: this.user.id,
                        email: this.user.email,
                        password: null,
                        first_name: this.user.first_name,
                        last_name: this.user,
                        driver_license_number: this.user.driver_license_number,
                        ambulance_license_plate: this.user.ambulance_license_plate,
                        driver_phone: this.user.driver_phone,
                        latitude: this.user.lat,
                        longitude: this.user.lng,
                        type_of_ambulance: this.user.type_of_ambulance,
                        credit_card_number: this.user.card_number,
                        credit_card_cvv: this.user.card_cvv,
                        credit_card_type: this.user.card_type,
                        credit_card_holder_name: this.user.card_holder,
                        credit_card_expiry: this.user.card_expiry
                    });
                } else {
                    await this.$store.dispatch("update_driver", {
                        driver_user_id: this.user.id,
                        email: this.user.email,
                        password: this.user.password,
                        first_name: this.user.first_name,
                        last_name: this.user,
                        driver_license_number: this.user.driver_license_number,
                        ambulance_license_plate: this.user.ambulance_license_plate,
                        driver_phone: this.user.driver_phone,
                        latitude: this.user.lat,
                        longitude: this.user.lng,
                        type_of_ambulance: this.user.type_of_ambulance,
                        credit_card_number: this.user.card_number,
                        credit_card_cvv: this.user.card_cvv,
                        credit_card_type: this.user.card_type,
                        credit_card_holder_name: this.user.card_holder,
                        credit_card_expiry: this.user.card_expiry
                    });
                }

                this.onDismissed();
            } catch (err) {
                console.error("Couldn't update driver", err);
            }
        },
    },
}
</script>