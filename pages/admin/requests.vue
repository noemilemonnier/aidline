<template>
    <div>
        <v-container>
            <h1 class="text-center">Pending Requests</h1>
            <v-divider></v-divider>
            <div class="text-center ma-12">
                <!-- Change to isLoading and then set it to false when it is ready to charge the page-->
                <v-progress-circular :size="200" color="primary" indeterminate v-if="isLoading"></v-progress-circular>
            </div>
        </v-container>
        <v-container>
        <div v-if="requests.length > 0">
            <v-text-field clearable label="Searching..." v-model="filters.search" ></v-text-field>
            <v-card outlined>
                <client-only>
                    <v-data-table :headers="tableHeaders" :items="formattedRequests" :search="filters.search" :items-per-page="40">
					    <template v-slot:[`item.customer_user_id`]="{ item }">
						{{ item.customer_user_id  }}
					    </template>
                        <template v-slot:[`item.customer_coordinates`]="{ item }">
						{{ item.customer_coordinates.customer_lat }}, {{ item.customer_coordinates.customer_lng }}
					    </template>
					    <template v-slot:[`item.customer_request_description`]="{ item }">
						{{ item.customer_request_description  }}
					    </template>
                         <template v-slot:[`item.driver_user_id`]="{ item }">
						{{ item.driver_user_id  ? item.ambulance_type  : "Not assigned"}}
					    </template>
                        <template v-slot:[`item.driver_coordinates`]="{ item }">
						{{ item.driver_coordinates.driver_lat ? item.driver_coordinates.driver_lat   : "Not assigned"}}, {{ item.driver_coordinates.driver_lng }}
					    </template>
                        <template v-slot:[`item.distance`]="{ item }">
						{{ item.distance ? item.distance  : "Not calculated"  }}
                        </template>
                        <template v-slot:[`item.ambulance_license_plate`]="{ item }">
						{{ item.ambulance_license_plate ? item.ambulance_license_plate  : "Not defined"   }}
                        </template>
                        <template v-slot:[`item.ambulance_type`]="{ item }">
						{{ item.ambulance_type  ? item.ambulance_type  : "Not defined" }}
                        </template>
                        <template v-slot:[`item.request_time`]="{ item }">
						{{ item.request_time  }}
                        </template>
					   <template v-slot:[`item.actions`]="{ item }">
								<v-btn color="error" icon xSmall @click="deleteRequest(item.id)"><v-icon>{{ $i.mdiDelete }}</v-icon></v-btn>
						</template>
				    </v-data-table>
			    </client-only>
		    </v-card>

        </div>
		<h4 v-if="requests.length === 0 && !isLoading">No Requests</h4>

    </v-container>
    </div>
</template>
<script>
import { mdiCheckboxBlankOutline } from "@mdi/js";
import { ambulance_types } from "~/api/types";
import {getDistanceFromLatLonInKm} from '~/api/functions';
import apis from "~/api/calls"

export default {
    layout: "admin",
    middleware: 'admin',
	head: () => ({
        title: "Pending Requests"
    }),
    data: () => ({
        ambulance_types_options: Object.values( ambulance_types ).reverse(),
        isLoading: true,
        requests: [],
        tableHeaders: [
            { text: "Customer ID", value: "customer_user_id" },
            { text: "Emergency Location", value: "customer_coordinates", sortable: false },
            { text: "Customer Emergency Description", value: "customer_request_description", sortable: false },
            { text: "Driver ID", value: "driver_user_id" },
            { text: "Driver Location", value: "driver_coordinates", sortable: false },
            { text: "Distance", value: "distance", sortable: false },
            { text: "Ambulance License Plate", value: "ambulance_license_plate", sortable: false },
            { text: "Type Ambulance", value: "ambulance_type" },
            { text: "Actions", value: "actions", align: "center", sortable: false }
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
            let response = await apis.getActiveRequests()
            if(response.data !== null && response.data.length>0){
                response.data.forEach(req => {
                    let driverID = null
                    let ambType = null
                    let ambLicensePlate = null
                    let latDr = null
                    let lngDr = null
                    let dist = null
                    if(req.driver !== null){
                        driverID = req.driver.id
                        ambType = req.driver.type_of_ambulance
                        ambLicensePlate = req.driver.ambulance_license_plate
                        latDr = req.driver.latitude
                        lngDr = req.driver.longitude
                        dist = getDistanceFromLatLonInKm(req.request.latitude, req.request.longitude, parseFloat(latDr), parseFloat(lngDr))
                    }
                    this.requests.push({
                        id : req.request.id,
                        driver_user_id: driverID,
                        customer_user_id : req.customer.id,
                        customer_coordinates : {
                            customer_lat : req.request.latitude,
                            customer_lng : req.request.longitude
                        },
                        customer_request_description : req.request.request_description,
                        ambulance_type: ambType,
                        ambulance_license_plate: ambLicensePlate,
                        driver_coordinates : {
                            driver_lat : latDr,
                            driver_lng : lngDr
                        },
                        distance : dist,
                        request_time : req.request_time
                    });
                })
            }
        } catch( err ){
			console.error("Couldn't fetch active requests");
		}
		this.isLoading 	= false;
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
        async deleteRequest( id ){
			if( !confirm( "Are you sure you want to delete this request?" ))
				return;
			try {
                let response = await apis.deleteRequest(id)
                if (response.result === true) {
                    const index = this.requests.findIndex((request) => request.id === id);
                    this.requests.splice(index, 1);
                    window.alert(response.message)
                }
			} catch( err ){
				console.error("Couldn't delete request" );
			}
		},
    }
}
</script>
<style scoped>
  #create .v-speed-dial {
    position: absolute;
  }
  #create .v-btn--floating {
    position: relative;
  }
</style>
