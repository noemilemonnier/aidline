<template>
    <div>
        <v-container>
            <h1 class="text-center">Welcome <span class="primary--text">{{ $store.state.user_name }} </span> to the Ambulance Driver Panel!</h1>
            <v-divider></v-divider>
            <p class="text-center">In this panel, you can access your status, your current requests, pending requests, and your settings.  <v-icon class="spin">{{ i.mdiCog }}</v-icon> </p>
        </v-container>

		<v-container>
            <v-row justify="center">
                <v-col cols="10">
                    <v-row justify="center">
                        <v-col cols="12" md="6" lg="4">
                            <v-card id="card" elevation="3" class=" d-flex align-center"  height="120" :color="button_color" @click="changeAmbulanceStatus">
                                <div class="display-2 flex-grow-1 text-center white--text">Status</div>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="12" md="6" lg="4">
                            <v-card id="card" elevation="3" class="accent d-flex align-center"  height="120" nuxt link to="/ambulance/currentrequest">
                                <div class="display-2 flex-grow-1 text-center white--text">Current Request</div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-card id="card" elevation="3" class="accent d-flex align-center"  height="120" nuxt link to="/ambulance/pendingrequests">
                                <div class="display-2 flex-grow-1 text-center white--text">Pending Requests</div>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="12" md="6" lg="4">
                            <v-card id="card" elevation="3" class="accent d-flex align-center"  height="120" nuxt link to="/ambulance/settings">
                                <div class="display-2 flex-grow-1 text-center white--text">Settings</div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
		</v-container>
    </div>
</template>

<script>
import { mdiCog } from "@mdi/js";

export default {
    layout: "admin",
    middleware: 'driver',
	head: () => ({
        title: "Driver Panel"
    }),
    data: () => ({
        i: {
            mdiCog
        },
        ambulance_status: '',
        button_color: ''
    }),
    async mounted(){
        this.button_color = this.$store.state.color_driver_status
    },
    methods: {
        // Need to add to change the value of the ambulancerDriver status on/off
        // use update_ambulance_location too
        changeAmbulanceStatus(){
            if(this.$store.state.driver_status === "busy"){
                this.$store.dispatch("setDriverStatus", { "status" : 'not busy' })
                this.ambulance_status = 'not busy'
                this.button_color = "success"
            }
            else{
                this.$store.dispatch("setDriverStatus", { "status" : 'busy' })
                this.ambulance_status = 'busy'
                this.button_color = "primary"
            }
        }
    }
}
</script>

<style scoped>
#card{
    border-radius:30px;
}
@keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}

.spin {
  animation-name: spin;
  animation-duration: 4000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
</style>
