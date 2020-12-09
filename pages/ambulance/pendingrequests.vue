<template>
    <div>
        <v-container>
            <h1 class="text-center">Pending Requests</h1>
            <v-divider></v-divider>
            <div class="text-center ma-12">
                <!-- Change to isLoading and then set it to false when it is ready to charge the page-->
                <v-progress-circular :size="200" color="primary" indeterminate v-if="isLoading"></v-progress-circular>
                <p>All pending requests are displayed below. Click on the square icon on the right to select your next emergency.</p>
            </div>
        </v-container>

        <v-container>
            <div v-if="requests.length > 0 && !hasCurrentReq">
            <v-text-field clearable label="Searching..." v-model="filters.search" ></v-text-field>
            <v-card outlined>
                <client-only>
                    <v-data-table :headers="tableHeaders" :items="formattedRequests" :search="filters.search" :items-per-page="40">
					    <template v-slot:[`item.customer_name`]="{ item }">
						{{ item.customer_name  }}
					    </template>
					    <template v-slot:[`item.distance`]="{ item }">
						{{ item.distance  }}
					    </template>
                        <template v-slot:[`item.request_time`]="{ item }">
						{{ item.request_time  }}
					    </template>
                        <template v-slot:[`item.request_description`]="{ item }">
						{{ item.request_description  }}
					    </template>
					    <template v-slot:[`item.actions`]="{ item }">
                            <v-dialog v-model="dialog" width="500" >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn color="primary" icon xSmall v-bind="attrs" v-on="on" ><v-icon>{{ i.mdiCheckboxBlankOutline }}</v-icon></v-btn>
                                </template>
                                <v-card>
                                    <v-card-title class="headline white--text primary"> Do you select this emergency?</v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <!-- TO CHANGE TO SET THE REQUEST TO CHOSEN REQUEST AND REMOVE IT FROM PENDING REQUEST-->
                                        <v-btn color="primary" text @click="toggleSelected(item.request_id)"> Confirm </v-btn>
                                        <v-btn color="primary" text @click="dialog = false"> Cancel </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
					    </template>
				    </v-data-table>
			    </client-only>
		    </v-card>
        </div>
		<h4 v-if="requests.length === 0 && !isLoading">No Pending Requests</h4>
    </v-container>
    <v-container v-if="hasCurrentReq">
         <v-row class="mt-5" align="center" justify="center">
                <v-col cols="12" sm="10" md="8" lg="6">
                    <v-card tile shaped outlined >
                        <v-card-text class="text-center error--text">
                        <h4> You cannot select multiple requests at the same time.</h4>
                        </v-card-text>
                    </v-card>
                </v-col>
         </v-row>
    </v-container>
    <v-container v-if="isBusy">
         <v-row class="mt-5" align="center" justify="center">
                <v-col cols="12" sm="10" md="8" lg="6">
                    <v-card tile shaped outlined >
                        <v-card-text class="text-center error--text">
                        <h4> You cannot select a request while being busy.</h4>
                        </v-card-text>
                    </v-card>
                </v-col>
         </v-row>
    </v-container>
    </div>
</template>
<script>
import { mdiCheckboxBlankOutline } from "@mdi/js";
import {gmapApi} from 'vue2-google-maps'
import axios from 'axios'
import {getDistanceFromLatLonInKm} from '~/api/functions';
import {actions, getters, setters } from "~/store/store"

export default {
    layout: "admin",
	head: () => ({
        title: "Pending Requests"
    }),
    data: () => ({
        isLoading: true,
        isBusy: false,
        hasCurrentReq: false,
        dialog: false,
        geocoder: '',
        requests: [],
        address: '',
        tableHeaders: [
          	{ text: "Patient Name", align: "left", value: "customer_name" },
            { text: "Distance", value: "distance"},
            { text: "Request time", value: "request_time" },
			{ text: "Request Description", value: "request_description", sortable: false  },
			{ text: "Select", value: "actions", align: "center", sortable: false }
        ],
        i: {
			mdiCheckboxBlankOutline,
        },
        filters: {
			search: ""
		},
    }),
    async mounted(){
		try {
            if(this.$store.state.driver_status === "not busy"){
                this.isBusy = false
                await this.$store.dispatch( "geolocate" )
                axios
                .get("/api/get_not_accepted_requests")
                .then((response) => {
                    let list = response.data.data;
                    setters.SET_PENDING_REQUESTS(list)
                    list.forEach(item => {
                            let user_full_name = item.customer.first_name + " " + item.customer.last_name;
                            let distance = getDistanceFromLatLonInKm(this.$store.state.lat, this.$store.state.lng, item.request.latitude, item.request.longitude)
                            this.requests.push({
                                customer_user_id: item.customer.id,
                                request_id: item.request.id,
                                customer_name: user_full_name,
                                latitude: item.request.latitude,
                                longitude: item.request.longitude,
                                distance: distance,
                                request_description: item.request.request_description,
                                request_time: item.request.request_time
                            });
                        })
                    this.isLoading = false
                 })
                .catch((error) => {
                        console.error("There was an error in retrieving users!", error);
                });
            }
            if(this.$store.state.driver_status === "busy"){
                this.isBusy = true
                this.isLoading = false
            }

		} catch( err ){
			console.error("Couldn't fetch data");
		}
    },
    computed:{
		formattedRequests(){
			return this.requests.map(request => {
                const r = {...request};
				return r;
			});
        },
    },
    methods: {
        toggleSelected( id ){
            try{
                this.$store.dispatch( "ambulance_update", { "driver_user_id" : getters.GET_USER_ID() , "latitude" : this.$store.state.lat, "longitude" : this.$store.state.lng  } )
                this.$store.dispatch( "accept_request", { "driver_user_id" : getters.GET_USER_ID() , "ambulance_request_id" : id} )
                this.$store.dispatch("setDriverStatus", { "status" : 'busy' })
            }
            catch(error) {
              window.alert("There was an error in selecting request!", error);
            }
        }
    }
}
</script>