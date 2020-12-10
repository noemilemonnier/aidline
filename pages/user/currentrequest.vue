<template>
    <div>
        <v-container>
            <h1 class="text-center">Your Current Request</h1>
            <v-divider></v-divider>
            <p class="text-center">This is where you can see your current request.</p>
            <p class="text-center">Once an amublance has picked up your request, you will see how long you need to wait.</p>
        </v-container>
        <v-container v-if="hasCurrentReq">
            <v-row class="mt-5" justify="center">
                <v-col cols="12" sm="10" md="8" lg="6">
                    <v-card width="40em" height="24em" elevation="4">
                        <v-form>
                            <v-card-text class="justify-center">
                                <v-row class="mx-2">
                                    <v-textarea class="mx-2" disabled outlined no-resize label="Time of emergency" v-model="request_time"></v-textarea>
                                </v-row>
                                <v-row class="mx-2 mt-4">
                                    <v-textarea class="mx-2" disabled outlined no-resize label="Reason of emergency" v-model="description"></v-textarea>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-row class="mx-2">
                                    <v-spacer></v-spacer>
                                        <v-btn large class="mx-2" color="primary" @click.prevent="cancelRequest">Cancel Request</v-btn>
                                    <v-spacer></v-spacer>
                                </v-row>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>
            <v-row class="mt-15" justify="center">
                <v-col cols="12" sm="10" md="8" lg="6">
                    <v-card v-if="isAssigned" shaped outlined>
                        <v-card-title> Ambulance on its way...</v-card-title>
                        <v-card-text class="justify-center">
                            <v-row align="center" class="justify-center" >
                                <v-col cols="4" >
                                    <v-img class="ml-12" max-height="100" max-width="100" src="/img/ambulance-icon.png"></v-img>
                                </v-col>
                                <v-col cols="7">
                                    <p class="mr-1"> The ambulance is {{kilometersAway}} kilometers away </p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                    <v-card v-else shaped outlined>
                        <v-card-title> Your request is pending...</v-card-title>
                        <v-card-text class="justify-center">
                            <v-row align="center" class="justify-center" >
                                <v-col cols="4" >
                                    <p> Your request has been registered and is waiting for an ambulance driver to select it.</p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-container v-if="!hasCurrentReq">
         <v-row class="mt-5" align="center" justify="center">
                <v-col cols="12" sm="10" md="8" lg="6">
                    <v-card tile shaped outlined >
                        <v-card-text class="text-center error--text">
                        <h4> You have no active request at the moment.</h4>
                        </v-card-text>
                    </v-card>
                </v-col>
         </v-row>
        </v-container>
    </div>
</template>

<script>
import {getDistanceFromLatLonInKm, dateFormat} from '~/api/functions'
import apis from "~/api/calls"
import {getters} from '~/store/store'



// Need to connect to back-end, retrieve user current request, if request is assigned change display to isAssigned=true and set the distance
export default {
    layout: "admin",
    middleware: 'user',
	head: () => ({
        title: "Current Request"
    }),
    data: () => ({
        //if an ambulance is assigned to the request connect to backend
        isAssigned: false,
        hasCurrentReq: false,
        kilometersAway: 0,
        rules: {
          required: value => !!value || 'Required.',
        },
        request_id: 0,
        request_time: 'N/A',
        description: 'N/A'
    }),
    async mounted(){
		try {
            let response = await apis.getUserRequest(getters.GET_USER_ID())
            if(response !== null && response.result === true){
                response.data.forEach( request => {
                    if(request.customer.id === getters.GET_USER_ID() && request.request.finish_time === null){
                        this.request_id= request.request.id
                        this.hasCurrentReq = true
                        let str = request.request.request_time
                        this.request_time = dateFormat(str)
                        this.description = request.request.request_description
                        if(request.request.accept_time !== null){
                            this.isAssigned = true
                            this.kilometersAway = getDistanceFromLatLonInKm(request.request.latitude, request.request.longitude, request.driver.latitude, request.driver.longitude )
                        }
                        this.isLoading = false
                    }
                })
            }
        }catch( error ){
			console.error("There was an error in retrieving request!", error);
		}
    },
    methods:{
        async cancelRequest(){
			if( !confirm( "Are you sure you want to cancel this request?" ))
				return;
			try {
                let response = await apis.deleteRequest(this.request_id)
                if (response.result === true) {
                    window.alert(response.message)
                    this.$router.replace("/user")
                }
			} catch( err ){
				console.error("Couldn't cancel request" );
			}
		},
    }
}
</script>

<style scoped>
#card{
    border-radius:30px;
}

</style>
