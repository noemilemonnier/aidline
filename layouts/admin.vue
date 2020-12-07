<template>
    <v-app>
        <v-navigation-drawer color="background" app width="300" v-model="sidenav">
			<v-list dense flat nav>
				<div v-if="isUser" class="user-view text-center"><nuxt-link to="/user"><img contain width="110px" height="110px" alt="AidLine" src="/img/logo.png"></nuxt-link></div>
				<div v-if="isDriver" class="user-view text-center"><nuxt-link to="/ambulance"><img contain width="110px" height="110px" alt="AidLine" src="/img/logo.png"></nuxt-link></div>
				<div v-if="isAdmin" class="user-view text-center"><nuxt-link to="/admin"><img contain width="110px" height="110px" alt="AidLine" src="/img/logo.png"></nuxt-link></div>
				<h3 class="text-center mt-8 mb-3">Navigation panel</h3>
				<v-divider></v-divider>

				<!-- User Pages v-if="isUser"-->
				<v-list-item active-class="active" link nuxt to="/user" 						v-if="isUser"><v-icon color="primary" size="24px">{{$i.mdiHomeVariant}}</v-icon>&emsp;User Panel</v-list-item>
				<v-list-item active-class="active" link nuxt to="/user/sendrequest" 			v-if="isUser"><v-icon color="accent" size="24px">{{$i.mdiAmbulance}}</v-icon>&emsp; Request Ambulance</v-list-item>
				<v-list-item active-class="active" link nuxt to="/user/currentrequest" 			v-if="isUser"><v-icon color="primary" size="24px">{{$i.mdiClipboardAccountOutline}}</v-icon>&emsp;Current Request</v-list-item>

				<!-- Driver Pages -->
				<v-list-item active-class="active" link nuxt to="/ambulance" 						v-if="isDriver"><v-icon color="primary" size="24px">{{$i.mdiHomeVariant}}</v-icon>&emsp;Driver Panel</v-list-item>
				<v-list-item active-class="active" link nuxt to="/ambulance/currentrequest" 		v-if="isDriver"><v-icon color="accent" size="24px">{{$i.mdiClipboardAccountOutline}}</v-icon>&emsp;Current Request</v-list-item>
                <v-list-item active-class="active" link nuxt to="/ambulance/pendingrequests" 		v-if="isDriver"><v-icon color="primary" size="24px">{{$i.mdiClipboardMultipleOutline}}</v-icon>&emsp;Pending Requests</v-list-item>

				<!-- Admin Pages -->
                <v-list-item active-class="active" link nuxt to="/admin" 							v-if="isAdmin"><v-icon color="primary" size="24px">{{$i.mdiHomeVariant}}</v-icon>&emsp;Admin Panel</v-list-item>
				<v-list-item active-class="active" link nuxt to="/admin/requests" 					v-if="isAdmin"><v-icon color="accent" size="24px">{{$i.mdiClipboardMultipleOutline}}</v-icon>&emsp;Pending Requests</v-list-item>
				<v-list-item active-class="active" link nuxt to="/admin/users" 						v-if="isAdmin"><v-icon color="primary" size="24px">{{$i.mdiFace}}</v-icon>&emsp;Users</v-list-item>


				<v-list-item active-class="active" link nuxt to="/user/settings" 					v-if="isUser"><v-icon color="accent" size="24px">{{i.mdiCogs}}</v-icon>&emsp;Settings</v-list-item>
                <v-list-item active-class="active" link nuxt to="/ambulance/settings" 				v-if="isDriver"><v-icon color="accent" size="24px">{{i.mdiCogs}}</v-icon>&emsp;Settings</v-list-item>
				<v-list-item active-class="active" link nuxt to="/admin/settings" 					v-if="isAdmin"><v-icon color="accent" size="24px">{{i.mdiCogs}}</v-icon>&emsp;Settings</v-list-item>
				<v-divider></v-divider>
			</v-list>

			<template v-slot:append>
				<v-list-item><v-btn class="white--text" block color="primary" @click="logout"><v-icon left size="24px">{{i.mdiLogout}}</v-icon>Logout</v-btn></v-list-item>
			</template>
        </v-navigation-drawer>

		<v-app-bar app dense absolute>
			<v-app-bar-nav-icon class="hidden-lg-and-up" title="Open navigation" @click.stop="sidenav = !sidenav"></v-app-bar-nav-icon>
			<v-spacer></v-spacer>
			<v-btn icon color="secondary" @click.stop="onDarkModeToggled"><v-icon size="28px">{{$i.mdiThemeLightDark}}</v-icon></v-btn>
		</v-app-bar>

        <v-main>
            <nuxt />
        </v-main>
		<notifications group="foo" position="top center"/>
    </v-app>
</template>

<script>
import { mdiLogout, mdiCogs, mdiArrowLeftCircle } from "@mdi/js";
import { roles } from "@/api/types";
import axios from 'axios'
import {getters} from "~/store/store"

export default {
    data: () => ({
		sidenav: true,
		wasPushed: false,
		i:{
            mdiLogout,
			mdiCogs,
			mdiArrowLeftCircle
		}
	}),
	mounted(){
		this.callme();
		setTimeout(() => {
			if( localStorage.darkMode )
				this.$vuetify.theme.dark = localStorage.darkMode == "true";
		}, 10 );
    },
	computed: {
		user(){
			return this.$store.state.user_type;
		},
		isUser(){
			return !this.user ? null : this.user === roles.USER;
		},
		isDriver(){
			return !this.user ? null : this.user === roles.DRIVER;
		},
		isAdmin(){
			return !this.user ? null : this.user === roles.ADMIN;
		}
	},
    methods: {
		async logout(){
			try {
				await this.$store.dispatch( "logout" );
			} catch( err ){
				console.error("An error has occured");
			}
		},
        onDarkModeToggled(){
			this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
			localStorage.darkMode = this.$vuetify.theme.dark;
		},
		//Function from https://stackoverflow.com/questions/55522330/fetch-call-every-2-seconds-but-dont-want-requests-to-stack-up
		async callme(){
			try {
				let that = this;
      			let request = await axios.get('/api/get_single_request_by_user/' + getters.GET_USER_ID());
				let geolocate = await this.$store.dispatch( "geolocate" )
				if(getters.GET_USER_TYPE() === 1 && request.data.result === true && request.data.data[0] !== undefined){ //if user is a user && has a active request
					request.data.data.forEach(req => {
          				if(this.wasPushed === false && req.driver !== null && req.request.finish_time === null){
							this.$notify({
                    			group: 'foo',
                    			type: 'success',
                    			title: '<h1>Your Request has been assigned</h1>',
                    			duration: 6000,
                    			text: '<p style="font-size:15px;"> An ambulance has accepted. Please go to <b>Current Request</b> to see more details.</p>'
                			});
							this.wasPushed = true
						}
						else{
							this.wasPushed = false
						}
					})
				}
				if(getters.GET_USER_TYPE() === 1 && request.data.result === false){
				//This promise will resolve when 10 seconds have passed
      			let timeOutPromise = new Promise(function(resolve, reject) {
        			setTimeout(resolve, 10000, 'Timeout Done'); // 10 Seconds delay
      			});
      			Promise.all(
        			[request, timeOutPromise]).then(function(values) {
          			that.callme();
        		});
				}
				if(getters.GET_USER_TYPE() === 2){
				//This promise will resolve when 10 seconds have passed
      			let timeOutPromise = new Promise(function(resolve, reject) {
        			setTimeout(resolve, 10000, 'Timeout Done'); // 10 Seconds delay
      			});
      			Promise.all(
        			[geolocate, timeOutPromise]).then(function(values) {
          			that.callme();
        		});
				}
			} catch( err ){
				console.error("Couldn't fetch request");
			}
    	},
    }
}
</script>