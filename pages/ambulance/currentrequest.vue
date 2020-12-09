<template>
    <div>
        <v-container>
            <h1 class="text-center">Current Request</h1>
            <v-divider></v-divider>
            <div class="text-center ma-10">
                <!-- Change to isLoading and then set it to false when it is ready to charge the page-->
                <v-progress-circular :size="200" color="primary" indeterminate v-if="isLoading"></v-progress-circular>
                <!-- <p>Your current active request is displayed below. Click on the square icon on the right when you are done with it or need to cancel it.</p> -->
            </div>
        </v-container>

        <v-container>
		<h4 v-if="request.length === 0 && !isLoading">No Active Request</h4>
        <div v-if="request.length > 0">
            <v-card class="mx-3" outlined>
            <client-only>
                <v-data-table :headers="tableHeaders" :items="request" :hide-default-footer=true>
					<template v-slot:[`item.patient_name`]="{ item }">
						{{ item.patient_name  }}
					</template>
					<template v-slot:[`item.address`]="{ item }">
						{{ item.address  }}
					</template>
                    <template v-slot:[`item.emergency_description`]="{ item }">
						{{ item.emergency_description  }}
					</template>
                    <template v-slot:[`item.time`]="{ item }">
						{{ item.time  }}
					</template>
					<template v-slot:[`item.actions`]="{ item }">
                        <v-dialog v-model="dialog" width="18em" >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" icon xSmall v-bind="attrs" v-on="on" ><v-icon>{{ i.mdiCheckboxBlankOutline }}</v-icon></v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="headline white--text primary"> Are you done with this emergency?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <!-- TO CHANGE TO SET THE REQUEST TO CHOSEN REQUEST AND REMOVE IT FROM PENDING REQUEST-->
                                    <v-btn color="primary" text @click="toggleSelected(item.id)"> Yes </v-btn>
                                    <v-btn text @click="dialog = false"> No </v-btn>
                                    <v-btn text @click="dialog = false"> Release </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
					</template>
				</v-data-table>
			</client-only>
		    </v-card>
            <ambulance-map />
        </div>
    </v-container>
    </div>
</template>
<script>
import { mdiCheckboxBlankOutline } from "@mdi/js";
import {gmapApi} from 'vue2-google-maps'
import Map from "~/components/ambulanceMap";
import apis from "~/api/calls"
import {setters, getters} from '~/store/store'
import { dateFormat} from '~/api/functions';

export default {
    layout: "admin",
	head: () => ({
        title: "Current Request"
    }),
    components: {
    "ambulance-map": Map,
    },
    data: () => ({
        isLoading: true,
        dialog: false,
        geocoder: '',
        request: [],
        address: '',
        tableHeaders: [
          	{ text: "Patient Name", align: "left", value: "patient_name" },
            { text: "Address", value: "address", sortable: false },
			{ text: "Emergency Description", value: "emergency_description", sortable: false  },
            { text: "Time", value: "time", sortable: false  },
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
        try{
            let response = await apis.getActiveRequests()
            if (response.result === true) {
                response.data.forEach( request => {
                    if(request.driver !== null && request.driver.id === getters.GET_USER_ID() && request.request.finish_time === null){
                        setters.SET_LATREQ(request.request.latitude)
                        setters.SET_LNGREQ(request.request.longitude)
                        setters.SET_REQUEST_ID(request.request.id)
                        this.request.push({
                            id: request.request.id,
                            patient_name: request.customer.first_name + " " + request.customer.last_name,
                            address: request.request.latitude + " , " + request.request.longitude,
                            emergency_description: request.request.request_description,
                            time: dateFormat(request.request.request_time)
                        })
                    }
                })
            }
        } catch (err) {
            console.error("Couldn't fetch data", err);
        }
        this.isLoading = false;
    },
    computed:{
        google: gmapApi,
    },
    methods: {
        async toggleSelected( id ){
            let response = await apis.finishRequest(id)
            if(response !== undefined || response !== null){
                window.alert("The request is now finished.")
                this.$store.dispatch("setDriverStatus", { "status" : 'not busy' })
                this.$router.replace("/ambulance/")
            }
        }
    }
}
</script>
<style scoped>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>