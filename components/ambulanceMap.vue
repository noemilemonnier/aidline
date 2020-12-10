<template>
  <v-container>
      <v-row class="mb-5 text-center">
          <v-col cols="12" md="6" lg="6">
              <v-row class="py-3 text-center" v-if="isLoading" >
                  <v-progress-circular :size="70" indeterminate color="primary" />
              </v-row>
              <v-row class="py-13" justify="center">
                  <v-btn x-large class="mx-2" color="primary" type="submit" @click.prevent="btnItinerary">Get Map</v-btn>
              </v-row>
          </v-col>
          <v-col v-if="isReady" cols="12" md="6" lg="6">
              <v-card  class="justify-center">
                    <GmapMap id="map" ref="map" :center="{lat, lng}" :zoom="13" style="height: 400px;">
                        <GmapMarker :position="google && new google.maps.LatLng(lat, lng)" :icon="icon_amb" ></GmapMarker>
                        <GmapMarker :position="google && new google.maps.LatLng(destLat, destLng)" :icon="icon_here" ></GmapMarker>
                    </GmapMap>
                </v-card>
          </v-col>
          <v-col v-else cols="12" md="6" lg="6">
              <v-card class="justify-center">
                  <GmapMap ref="mapRef" :center="{lat, lng}" :zoom="12" style="height: 300px;"/>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import {gmapApi} from 'vue2-google-maps'
import {actions, getters, setters } from "~/store/store"
import {range} from 'lodash'

export default {
    data: () => ({
        isReady: false,
        isLoading: false,
        inputAddress: '',
        map: null,
        distanceBtwLocation: 0,
        //center: { lat: 60.1699, lng: 24.9384 },
        lat: 60.1699,
        lng: 24.9384,
        destLat: 0,
        destLng: 0,
        destination: {
            lat: 0,
            lng: 0
        },
        origin: {
            lat: 0,
            lng: 0
        },
        icon_here: {
            url: "https://icon-library.com/images/you-are-here-icon/you-are-here-icon-5.jpg",
            scaledSize: {width: 28, height: 28},
            labelOrigin: {x: 16, y: -10}
        },
         icon_amb: {
            url: "https://icon-library.com/images/maps-pin-icon/maps-pin-icon-13.jpg",
            scaledSize: {width: 28, height: 28},
            labelOrigin: {x: 16, y: -10}
        },
    }),
    computed: {
        google: gmapApi
    },
    methods: {
        async geolocate(){
			try {
				this.$store.dispatch( "geolocate" )
                //this.origin = new google.maps.LatLng(getters.GET_LAT(), getters.GET_LNG());
                this.origin = {
                    lat : parseFloat(this.$store.state.lat),
                    lng: parseFloat(this.$store.state.lng)
                }
                //this.destination = new google.maps.LatLng(getters.GET_LAT_REQ(), getters.GET_LNG_REQ());
                this.destination ={
                    lat : parseFloat(getters.GET_LAT_REQ()),
                    lng: parseFloat(getters.GET_LNG_REQ())
                }
                await this.$store.dispatch( "getAddress", { lat: this.destination.lat, lng: this.destination.lng })
                this.lat = this.$store.state.lat;
                this.lng = this.$store.state.lng;
                this.destLat = this.$store.state.latReq;
                this.destLng = this.$store.state.lngReq;
                //this.center = [this.$store.state.center.lat,this.$store.state.center.lng]
                this.isLoading = false
                this.isReady =true
			} catch( err ){
				console.error(err)
            }
        },
        btnItinerary(){
            this.isLoading = true;
            this.geolocate();
        },
    }
}
</script>

<style scoped>
.scroll {
   overflow-y: scroll
}
#map{
    height: 100%;
}
#h2{
    font-weight: bold;
    color:rgb(190, 50, 35);
}
</style>
