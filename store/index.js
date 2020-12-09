
import axios from 'axios'
import { user, setters, getters } from "./store";

export const state = () => ({
  user_id: null,
  user_type: null,
  driver_status: 'not busy',
  color_driver_status: 'success',
  user_name: "",
  lat: 0,
  lng: 0,
  latReq: 0,
  lngReq: 0,
  center: { lat: 0, lng: 0 },
  acceptedPolicy: false,
  request_id: 0
})

export const mutations = {
  SET_USER_ID: (state, user_id) => {
    state.user_id = user_id
  },
  SET_USER_TYPE: (state, type) => {
    state.user_type = type
  },
  SET_DRIVER_STATUS: (state, driver_status) => {
    state.driver_status = driver_status
  },
  SET_REQUEST_ID: (state, request_id) => {
    state.request_id = request_id
  },
  SET_USER_NAME: (state, name) => {
    state.user_name = name
  },
  SET_POLICY: (state) => {
    state.acceptedPolicy = true
  },
  SET_LAT: (state, lat) => {
    state.lat = parseFloat(lat)
  },
  SET_LNG: (state, lng) => {
    state.lng = parseFloat(lng)
  },
  SET_LATREQ: (state, lat) => {
    state.latReq = parseFloat(lat)
  },
  SET_LNGREQ: (state, lng) => {
    state.lngReq = parseFloat(lng)
  },
  SET_CENTER: (state) => {
    state.center.lat = parseFloat(state.lat);
    state.center.lng = parseFloat(state.lng);
  },
}

export const actions = {
  setPolicyAnswer({ commit }) {
    commit('SET_POLICY')
  },
  setDriverStatus({commit}, {status}){
    setters.SET_DRIVER_STATUS(status)
    commit('SET_DRIVER_STATUS', status);
    if(status === "not busy"){
      state.color_driver_status = "success"
    }
    if(status === "busy"){
      state.color_driver_status = "primary"
    }
  },
  geolocate({ commit }) {
    if ("geolocation" in navigator) {
      /* geolocation is available */
      navigator.geolocation.getCurrentPosition(
        position => {
          setters.SET_LAT(position.coords.latitude)
          setters.SET_LNG(position.coords.longitude)
          setters.SET_CENTER()
          commit('SET_LAT', position.coords.latitude);
          commit('SET_LNG', position.coords.longitude);
          commit('SET_CENTER');
        });
    }
    else {
      /* geolocation IS NOT available  */
      window.alert('geolocation IS NOT available on your browser');
    }
  },
  getAddress({ commit }, { lat, lng }) {
    setters.SET_LATREQ(lat)
    setters.SET_LNGREQ(lng)
    commit('SET_LATREQ', lat);
    commit('SET_LNGREQ', lng);
  },
  setUserName({commit}, {user_name}){
    setters.SET_USER_NAME(user_name)
    commit('SET_USER_NAME', user_name);
  },
  async login({ commit }, { email, password }) {
    try {
      const body = { "email": email, "password": password };
      axios.post("/api/login", body)
        .then(
          response => {
            if (response.data.result == true) {
              if (response.data.user_type_id == 3) {       //if user is an admin
                setters.SET_USER_ID(response.data.user_id)
                setters.SET_USER_TYPE(response.data.user_type_id)
                commit('SET_USER_ID', response.data.user_id);
                commit('SET_USER_TYPE', response.data.user_type_id);
                this.$router.replace("/admin")
              }
              else if (response.data.user_type_id == 2) {  //if user is a driver
                setters.SET_USER_ID(response.data.user_id)
                setters.SET_USER_TYPE(response.data.user_type_id)
                commit('SET_USER_ID', response.data.user_id);
                commit('SET_USER_TYPE', response.data.user_type_id);
                this.$router.replace("/ambulance")
              }
              else {                                      //if user is a user
                setters.SET_USER_ID(response.data.user_id)
                setters.SET_USER_TYPE(response.data.user_type_id)
                commit('SET_USER_ID', response.data.user_id);
                commit('SET_USER_TYPE', response.data.user_type_id);
                this.$router.replace("/user")
              }
              //To retrieve the user name for a more custom welcome
              axios.get("/api/users/" + getters.GET_USER_ID())
                .then(
                  response => {
                    if (response.data.result == true) {
                      setters.SET_USER_NAME(response.data.user.first_name)
                      commit('SET_USER_NAME', response.data.user.first_name);
                    }
                  }
                ).catch(error => {
                  console.error("There was an error in retrieving user name!", error);
                });
            }
            if (response.data.result == false) {
              window.alert(response.data.message)
            }
          }).catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error in looking for user!", error);
          });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.error("Bad Credentials")
      }
    }
  },
  async logout({ commit }) {
    commit('SET_USER_ID', null)
    commit('SET_USER_TYPE', null)
    this.$router.replace("/login")
  },
  async create_user({ commit }, { status, email, password, first_name, last_name, customer_phone, street_address, postal_code, city, country, age, credit_card_number, credit_card_cvv, credit_card_type, credit_card_holder_name, credit_card_expiry }) {
    try {
      const body = { "email": email, "password": password, "first_name": first_name, "last_name": last_name, "user_type_id": 1, "customer_phone": customer_phone, "street_address": street_address, "postal_code": postal_code, "city": city, "country": country, "age": age, "credit_card_number": credit_card_number, "credit_card_cvv": credit_card_cvv, "credit_card_type": credit_card_type, "credit_card_holder_name": credit_card_holder_name, "credit_card_expiry": credit_card_expiry };
      axios.post("/api/create_customer", body)
        .then( //the body need to return
          response => {
            if (response.data.result == true) {
              if(status === false){ //if user is creating a new profile
                setters.SET_USER_ID(response.data.user_id)
                setters.SET_USER_TYPE(1)
                commit('SET_USER_ID', response.data.user_id);
                commit('SET_USER_TYPE', 1);
                this.$router.replace("/user")
              }
              else{ //when admin creates a new user type user
                window.alert(response.data.message)
              }
            }
          }
        ).catch(error => {
          window.alert("There was an error in creating user!", error);
        });
    } catch (err) {
      if (err.response) {
        console.error('Error while creating user')
      }
    }
  },
  async update_user({ commit }, { customer_user_id, email, password, first_name, last_name, customer_phone, street_address, postal_code, city, country, age, credit_card_number, credit_card_cvv, credit_card_type, credit_card_holder_name, credit_card_expiry }) {
    try {
      const body = { "customer_user_id": customer_user_id, "email": email, "password": password, "first_name": first_name, "last_name": last_name,  "user_type_id": 1, "customer_phone": customer_phone, "street_address": street_address, "postal_code": postal_code, "city": city, "country": country, "age": age, "credit_card_number": credit_card_number, "credit_card_cvv": credit_card_cvv, "credit_card_type": credit_card_type, "credit_card_holder_name": credit_card_holder_name, "credit_card_expiry": credit_card_expiry };
      axios.post("/api/update_customer", body)
        .then(
          response => {
            if (response.data.result == true) {
              window.alert(response.data.message)
            }
          }
        ).catch(error => {
          window.alert("There was an error in updating user!", error);
        });
    } catch (err) {
      if (err.response) {
        console.error('Error while updating user')
      }
    }
  },
  async create_admin({ commit }, { email, password, first_name, last_name }) {
    try {
      const body = { "user_type_id": 3, "email": email, "password": password, "first_name": first_name, "last_name": last_name }
      axios.post("/api/create_admin", body)
        .then(
          response => {
            if(status === false){ //if admin is creating a new profile
              setters.SET_USER_ID(response.data.user_id)
              setters.SET_USER_TYPE(3)
              commit('SET_USER_ID', response.data.user_id);
              commit('SET_USER_TYPE', 3);
              this.$router.replace("/admin")
            }
            else{ //when admin creates a new admin type user
              window.alert(response.data.message)
            }
          }
        ).catch(error => {
          window.alert("There was an error in creating admin!", error);
        });
    } catch (err) {
      if (err.response) {
        console.error('Error while creating admin')
      }
    }
  },
  async update_admin({ commit }, { admin_user_id, email, password, first_name, last_name }) {
    try {
      const body = { "admin_user_id": admin_user_id, "user_type_id": 3, "email": email, "password": password, "first_name": first_name, "last_name": last_name }
      axios.post("/api/update_admin", body)
        .then(
          response => {
            if (response.data.result == true) {
              window.alert(response.data.message)
            }
          }
        ).catch(error => {
          window.alert("There was an error in updating admin!", error);
        });
    } catch (err) {
      if (err.response) {
        console.error('Error while updating admin')
      }
    }
  },
  async create_driver({ commit }, { email, password, first_name, last_name, driver_license_number, ambulance_license_plate, driver_phone, type_of_ambulance, latitude, longitude, credit_card_number, credit_card_cvv, credit_card_type, credit_card_holder_name, credit_card_expiry }) {
    try {
      const body = { "user_type_id": 2, "email": email, "password": password, "first_name": first_name, "last_name": last_name, "driver_license_number": driver_license_number, "ambulance_license_plate": ambulance_license_plate, "driver_phone": driver_phone, "type_of_ambulance": type_of_ambulance, "latitude": latitude, "longitude": longitude, "credit_card_number": credit_card_number, "credit_card_cvv": credit_card_cvv, "credit_card_type": credit_card_type, "credit_card_holder_name": credit_card_holder_name, "credit_card_expiry": credit_card_expiry };
      axios.post("/api/create_driver", body)
        .then(
          response => {
            if(status === false){ //if driver is creating a new profile
              setters.SET_USER_ID(response.data.user_id)
              setters.SET_USER_TYPE(2)
              commit('SET_USER_ID', response.data.user_id);
              commit('SET_USER_TYPE', 2);
              this.$router.replace("/driver")
            }
            else{ //when admin creates a new driver
              window.alert(response.data.message)
            }
          }
        ).catch(error => {
          window.alert("There was an error in creating driver!", error);
        });
    } catch (err) {
      if (err.response) {
        console.error('Error while creating driver')
      }
    }
  },
  async update_driver({ commit }, { driver_user_id, email, password, first_name, last_name, driver_license_number, ambulance_license_plate, driver_phone, latitude, longitude, type_of_ambulance, credit_card_number, credit_card_cvv, credit_card_type, credit_card_holder_name, credit_card_expiry }) {
    try {
      const body = { "driver_user_id": driver_user_id, "user_type_id": 2, "email": email, "password": password, "first_name": first_name, "last_name": last_name, "latitude": latitude, "longitude": longitude, "driver_license_number": driver_license_number, "ambulance_license_plate": ambulance_license_plate, "driver_phone": driver_phone, "type_of_ambulance": type_of_ambulance, "credit_card_number": credit_card_number, "credit_card_cvv": credit_card_cvv, "credit_card_type": credit_card_type, "credit_card_holder_name": credit_card_holder_name, "credit_card_expiry": credit_card_expiry };
      axios.post("/api/update_driver", body)
        .then(
          response => {
            if (response.data.result == true) {
              window.alert(response.data.message)
            }
          }
        ).catch(error => {
          window.alert("There was an error in updating driver!", error);
        });
    } catch (err) {
      if (err.response) {
        console.error('Error while updating driver')
      }
    }
  },
  async ambulance_update({ commit }, { driver_user_id, latitude, longitude }) {
    try {
      const body = { "driver_user_id" : driver_user_id, "latitude": latitude, "longitude": longitude }
      axios.post("/api/update_ambulance_location", body)
        .then(
          response => {
            if (response.data.result === false) {
              window.alert(response.data.message)
            }
          }
        ).catch(error => {
          window.alert("There was an error in updating the ambulance location!", error);
        });
    } catch (err) {
      console.error("There was an error in updating the ambulance location!", err);
    }
  },
  async ambulance_request({ commit }, { latitude, longitude, emergency_description }) {
    try {
      const body = { "customer_user_id": getters.GET_USER_ID(), "latitude": latitude, "longitude": longitude, "emergency_description": emergency_description }
      axios.post("/api/request_ambulance", body)
        .then(
          response => {
            if (response.data.result === true) {
              this.$router.replace("/user/currentrequest")
            }
            if (response.data.result === false) {
              window.alert(response.data.message)
            }
          }
        ).catch(error => {
          window.alert("There was an error in creating the request!", error);
        });
    } catch (err) {
      console.error("There was an error in creating the request!", err);
    }
  },
  async accept_request({ commit }, { driver_user_id, ambulance_request_id }) {
    try {
      const body = { "driver_user_id": driver_user_id, "ambulance_request_id": ambulance_request_id }
      axios.post("/api/accept_request", body)
        .then(
          response => {
            if (response.data.result === true) {
              commit('SET_REQUEST_ID', ambulance_request_id);
              setters.SET_REQUEST_ID(ambulance_request_id)
              this.$router.replace("/ambulance/currentrequest")
            }
            if (response.data.result === false) {
              window.alert(response.data.message)
            }
          }
        ).catch(error => {
          window.alert("There was an error in accepting the request!", error);
        });
    } catch (err) {
      console.error("There was an error in accepting the request!", err);
    }
  },
  async active_requests({ commit }) {
    try {
      axios.get("/api/get_active_requests")
        .then(
          response => {
            if (response.data.result == true) {
                return response.data.data
            }
          }
        ).catch(error => {
          window.alert("There was an error in retrieving active requests!", error);
        });
    } catch (err) {
      if (err.response) {
        console.error('Error while retrieving active requests')
      }
    }
  },
  async current_user_request({ commit }, id) {
    try {
      axios.get("/api/get_active_requests")
        .then(
          response => {
            if (response.data.result === true) {
                response.data.data.forEach(item => {
                  if(response.data.data.customer.id === id){
                    return item
                  }
                })
            }
          }
        ).catch(error => {
          window.alert("There was an error in retrieving the current user request!", error);
        });
    } catch (err) {
      if (err.response) {
        console.error('Error while retrieving the current user request')
      }
    }
  },
  async finish_request({ commit }, { ambulance_request_id }) {
    try {
      axios.get("/api/finish_request/"+ ambulance_request_id)
        .then(
          response => {
            if (response.data.result === true) {
              this.$router.replace("/ambulance")
            }
            if (response.data.result === false) {
              window.alert(response.data.message)
            }
          }
        ).catch(error => {
          window.alert("There was an error in finishing the request!", error);
        });
    } catch (err) {
      console.error("There was an error in finishing the request!", err);
    }
  },
  async delete_user({ commit }, { user_id }) {
    try {
      axios.delete("/api/users/" + user_id )
        .then(
          response => {
            if (response.data.result == true) {
              window.alert(response.data.message)
            }
            if (response.data.result == false) {
              window.alert(response.data.message)
            }
          }
        ).catch(error => {
          window.alert("There was an error in deleting user!", error);
        });
    } catch (err) {
      if (err.response) {
        console.error('Error while deleting user')
      }
    }
  },
  async delete_request({ commit }, { request_id }) {
    try {
      axios.delete("/api/delete_request/" + request_id )
        .then(
          response => {
            if (response.data.result == true) {
              window.alert(response.data.message)
            }
            if (response.data.result == false) {
              window.alert(response.data.message)
            }
          }
        ).catch(error => {
          window.alert("There was an error in deleting request!", error);
        });
    } catch (err) {
      if (err.response) {
        console.error('Error while deleting request')
      }
    }
  },
}
