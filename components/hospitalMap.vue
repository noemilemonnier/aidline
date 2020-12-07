<template>
  <v-container>
      <v-row class="mt-5 mb-5">
      <v-col cols="12" md="6" lg="6">
        <v-row class="py-2">
        <v-card elevation="2" height="300px" max-width="400px" shaped outlined>
          <form>
              <v-card-title class="justify-center"><h3>Nearby Hospitals</h3></v-card-title>
            <v-card-text>
                <v-row> <p class="text--secondary mx-12 caption"> Enter your address or click on the localisation icon</p> </v-row>
                <v-row>
                    <gmap-autocomplete class="mx-4" id="id" style="width: 100%; height: 30px; border-width: 1px; border-radius: 5px; border-color: #b1b1b1; border-style: inset;" :v-model="inputAddress" placeholder="   Enter an address" @place_changed="getAddress"> </gmap-autocomplete>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-row no-gutters>
                    <v-card class="d-flex flex-row-reverse" background-color="transparent" elevation="0">
                        <v-card height="10px" elevation="0" background-color="transparent" class="pa-1">
                            <v-btn class="mx-2" color="primary" width="60px" height="45px" type="submit" @click.prevent="findButtonPressed">Find</v-btn>
                        </v-card>
                        <v-card height="10px" elevation="0" background-color="transparent" class="pa-1">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mx-2" color="primary" width="60px" height="45px" @click="locatorButtonPressed" v-bind="attrs" v-on="on"><v-icon>{{$i.mdiMapMarker}}</v-icon></v-btn>
                                </template>
                                <span>Click here to locate yourself</span>
                            </v-tooltip>
                        </v-card>
                        <v-card height="10px" elevation="0" background-color="transparent" class="pa-1">
                            <v-select class="mx-2" :items="items" item-text="text" label="Within" outlined v-model="radius"></v-select>
                        </v-card>
                    </v-card>
                </v-row>
            </v-card-actions>
          </form>
        </v-card>
        </v-row>
         <v-row class="py-3" v-if="locatorPressed" >
            <v-progress-circular  :size="30" indeterminate color="primary" />
        </v-row>
        <v-row class="py-3" v-if="isLoading" >
            <v-progress-circular :size="70" indeterminate color="primary" />
        </v-row>
        <v-row class="py-3" v-if="isLoaded">
            <v-card height="300px" max-width="400px" class="scroll" outlined tile>
                <v-card-title class="justify-center"><h3>Closest Hospitals to you ...</h3></v-card-title>
                <v-card-text>
                <v-list rounded>
                    <v-list-item-group>
                        <v-list-item v-for="(place, i) in places" :key="i">
                            <v-list-item-content>
                                <v-list-item-title v-text="place.name"></v-list-item-title>
                                <v-list-item-subtitle v-text="place.address"></v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
                </v-card-text>
            </v-card>
        </v-row>
        </v-col>
        <v-col v-if="hasResults" cols="12" md="6" lg="6">
            <v-card class="justify-center">
            <GmapMap id="map" ref="map" :center="{lat, lng}" :zoom="10" style="height: 400px;">
                <GmapMarker ref="myMarker" v-for="(place, index) in places" :key="index" :position="google && new google.maps.LatLng(place.location.lat, place.location.lng)" :icon="icon" :clickable="true" @click="toggleInfoWindow(place,index)">
                </GmapMarker>
                <GmapMarker :position="google && new google.maps.LatLng(lat, lng)"></GmapMarker>
                <GmapInfoWindow :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false"> </GmapInfoWindow>
            </GmapMap>
            </v-card>
        </v-col>
        <v-col v-else cols="12" md="6" lg="6">
            <v-card class="justify-center">
                <GmapMap ref="mapRef" :center="{lat, lng}" :zoom="12" style="height: 300px;"> </GmapMap>
            </v-card>
        </v-col>
    </v-row>

  </v-container>
</template>

<script>
import axios from "axios";
import {gmapApi} from 'vue2-google-maps'
import {getDistanceFromLatLonInKm, compareValues, getAddressData} from '~/api/functions';

export default {
    data: () => ({
        isLoaded: false,
        isLoading: false,
        hasResults: false,
        locatorPressed: false,
        inputAddress: '',
        map: null,
        distanceBtwLocation: 0,
        selectedHospital: '',
        items: [
            {value: 5, text: '5 km'},
            {value: 10, text: '10 km'},
            {value: 15, text: '15 km'},
            {value: 20, text: '20 km'},
            {value: 25, text: '25 km'},
        ],
        type: 'hospital',
        center: { lat: 60.1699, lng: 24.9384 },
        radius: 0,
        places: [],
        lat: 0,
        lng: 0,
        icon: {
            url: "https://icon-library.com/images/maps-pin-icon/maps-pin-icon-13.jpg",
            scaledSize: {width: 28, height: 28},
            labelOrigin: {x: 16, y: -10}
        },
        infoWindowPos: null,
        infoWinOpen: false,
        currentMidx: null,
        infoOptions: {
        	content: '',
            pixelOffset: {
              width: 0,
              height: -35
            }
        },
    }),
    computed: {
        google: gmapApi,
        coordinates() {
            return `${this.lat}, ${this.lng}`;
        },
    },
    methods: {
        geolocate(){
			try {
				this.$store.dispatch( "geolocate" );
                this.lat = this.$store.state.lat;
                this.lng = this.$store.state.lng;
                this.center = [this.$store.state.center.lat,this.$store.state.center.lng]
                this.locatorPressed = false;
			} catch( err ){
				console.error(err)
            }
		},
        getAddress(addressData) {
            let coordinates = getAddressData(addressData)
            this.lat = coordinates[0]
            this.lng = coordinates[1]
            this.center = [this.lat, this.lng]
        },
        locatorButtonPressed() {
            this.locatorPressed = true;
            this.geolocate();
        },
        async findButtonPressed() {
            this.isLoading = true;
            axios.get("/google/nearbysearch/json?location="+this.lat+","+this.lng+"&type="+this.type+"&radius="+this.radius*1000+"&key="+process.env.API_SECRET, {'Access-Control-Allow-Origin': '*', 'Content-type': 'application/json'})
            .then(response => {
                response.data.results.forEach(place => {
                    let distance = getDistanceFromLatLonInKm(this.lat, this.lng, place.geometry.location.lat, place.geometry.location.lng)
                    this.places.push({
                        name: place.name,
                        address: place.vicinity,
                        location: place.geometry.location,
                        distance: distance,
                        types: place.types,
                    });
                })
                this.places.sort(compareValues('distance')) //sort them from closest to furthest by distance field
                this.hasResults = true;
                this.isLoading = false;
                this.isLoaded = true;
            }).catch(error => {
                    alert(error.message);
            });
        },
        toggleInfoWindow: function(place, idx) {
            this.infoWindowPos = place.location;
            this.infoOptions.content = this.getInfoWindowContent(place);
            //check if its the same marker that was selected if yes toggle
            if (this.currentMidx == idx) {
              this.infoWinOpen = !this.infoWinOpen;
            }
            //if different marker set infowindow to open and reset current place index
            else {
              this.infoWinOpen = true;
              this.currentMidx = idx;

            }
        },
        getInfoWindowContent(place) {
            return (
                `<div>
                    <div>
                        <div>
                            <div style="margin: 3px; color: rgb(190, 50, 35);">
                                <h2> ${place.name} </h2>
                            </div>
                        </div>
                        <div style="margin: 3px;">
                            <span style="font-weight: bold;">Address:  </span>
                            ${place.address}
                            <br>
                        </div>
                        <div style="margin: 3px;">
                            <span style="font-weight: bold;">Types:  </span>
                            ${place.types}
                            <br>
                        </div>
                        <div style="margin: 3px;">
                            <span style="font-weight: bold;">Distance:  </span>
                            ${place.distance}
                            <span>km</span>
                            <br>
                        </div>
                    </div>
                </div>`
            );
        }
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
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>