<template>
    <div>
        <v-container>
            <h1 class="text-center">Send a Request</h1>
            <v-divider></v-divider>
            <p class="text-center my-3">To send a request, please fill the form below.</p>
            <p class="text-center my-3">Once you submit it, you will see it in "Current Request".</p>
        </v-container>
        <v-container v-if="!hasRequest">
            <v-row class="mt-5" justify="center">
                <v-col cols="12" sm="10" md="8" lg="6">
                <v-card width="40em" height="100%" class="scroll">
                <v-form ref="form" v-model="isValid" lazy-validation>
                        <v-card-text class="justify-center">
                            <v-row class="mx-2">
                                <gmap-autocomplete class="ma-2" id="id" :disabled="isGeolocated" style="width: 68%; height: 45px; border-width: 1px; border-radius: 5px; border-color: #b1b1b1; border-style: inset;" :v-model="inputAddress" :placeholder="sentence" @place_changed="getAddress"> </gmap-autocomplete>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="ma-2" color="primary" width="60px" height="45px" :disabled="isAddress" @click="locatorButtonPressed" v-bind="attrs" v-on="on"><v-icon>{{$i.mdiMapMarker}}</v-icon></v-btn>
                                    </template>
                                    <span>Click here to locate yourself</span>
                                </v-tooltip>
                            </v-row>
                            <v-row class="mx-2 mt-4">
                                <v-textarea class="mx-2" outlined no-resize counter="150" label="Reason of emergency" v-model="request.description" :rules="[rules.required]" value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."></v-textarea>
                            </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-row class="mx-2">
                            <v-spacer></v-spacer>
                            <v-btn large color="primary" :disabled="!isValid" @click.prevent="validate">Submit</v-btn>
                            <v-spacer></v-spacer>
                        </v-row>
                    </v-card-actions>
                </v-form>
                </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-container v-if="hasRequest">
         <v-row class="mt-5" align="center" justify="center">
                <v-col cols="12" sm="10" md="8" lg="6">
                    <v-card tile shaped outlined >
                        <v-card-text class="text-center error--text">
                        <h4> You cannot send multiple requests at the same time for an ambulance.</h4>
                        </v-card-text>
                    </v-card>
                </v-col>
         </v-row>
        </v-container>
        <notifications group="foo" position="top center"/>
    </div>
</template>

<script>
import {getAddressData} from '~/api/functions';
import { mdiCog } from "@mdi/js";
import {getters} from "~/store/store"
import apis from "~/api/calls"

export default {
    layout: "admin",
    middleware: 'user',
	head: () => ({
        title: "Current Request"
    }),
    data: () => ({
        isValid: false,
        hasRequest: false,
        isGeolocated: false,
        sentence: "  Enter an address...",
        isAddress: false,
        inputAddress: '',
        lat: 0,
        lng: 0,
        rules: {
          required: value => !!value || 'Required.',
        },
        request: {
            address: '',
            description: ''
        }
    }),
    async mounted(){
		try {
            let response = await apis.getUserRequest(getters.GET_USER_ID())
            if(response !== null && response.result === true){
                response.data.forEach(req => {
                    if(req.request.finish_time === null){
                        this.hasRequest = true
                        this.isLoading = false
                    }
                })
            }
            else{
                this.hasRequest = false
            }
		} catch( error ){
			console.error("There was an error in checking your request!", error);
		}
    },
    methods: {
        validate () {
            if (this.$refs.form.validate() && ((this.isGeolocated && !this.isAddress)) || (!this.isGeolocated && this.isAddress)) {
                this.isValid = true
                this.$notify({
                    group: 'foo',
                    type: 'success',
                    title: '<h1>Request Sent</h1>',
                    duration: 6000,
                    text: '<p style="font-size:15px;" >Your request has been sent to our system. Please go in your <b>Current Request</b> to see when an ambulance is on its way.</p>'
                });
                //send request
                this.$store.dispatch( "ambulance_request", {
                    latitude : this.lat,
                    longitude: this.lng,
                    emergency_description: this.request.description,
                });
            }
            else{
                window.alert("The form is invalid")
            }
        },
        locatorButtonPressed() {
            try {
                this.isGeolocated = true;
                this.sentence= "Your location has been registered."
				this.$store.dispatch( "geolocate" );
                this.lat = this.$store.state.lat;
                this.lng = this.$store.state.lng;
			} catch( err ){
				 window.alert("You could not be geolocated. Please verify that you allow location in your browser.")
            }
        },
        async getAddress(addressData) {
            let isValid = await getAddressData(addressData)
            if (isValid !== false) {
                this.isAddress = true;
                this.$store.dispatch( "getAddress", {
                    lat: isValid[0],
                    lng: isValid[1]
                });
                this.lat = this.$store.state.latReq;
                this.lng = this.$store.state.lngReq;
            }
        }
    }
}
</script>

<style scoped>
#card{
    border-radius:30px;
}
</style>
