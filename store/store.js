import Vue from "vue";

export const user = Vue.observable({
    user_id: null,
    driver_status: false,
    pending_request: [],
    user_type: 1,
    user_name: "",
    lat: 0,
    lng: 0,
    latReq: 0,
    lngReq: 0,
    center: { lat: 0, lng: 0 },
    acceptedPolicy: false,
    request_id: 0,
});
export const setters = {
  SET_USER_ID: (user_id) => {
    user.user_id = user_id
  },
  SET_USER_TYPE:(type) => {
    user.user_type = type
  },
  SET_USER_NAME:(name) => {
    user.user_name = name
  },
  SET_DRIVER_STATUS:(driver_status) => {
    user.driver_status = driver_status
  },
  SET_REQUEST_ID: (request_id) => {
    user.request_id = request_id
  },
  SET_POLICY: () => {
    user.acceptedPolicy = true
  },
  SET_LAT: (lat) => {
    user.lat = parseFloat(lat)
  },
  SET_LNG: (lng) => {
    user.lng = parseFloat(lng)
  },
  SET_LATREQ: (lat) => {
    user.latReq = parseFloat(lat)
  },
  SET_LNGREQ: (lng) => {
    user.lngReq = parseFloat(lng)
  },
  SET_CENTER: () => {
    user.center.lat = parseFloat(user.lat);
    user.center.lng = parseFloat(user.lng);
  },
  SET_PENDING_REQUESTS(req) {
    user.pending_request = req;
  },
};

export const getters = {
    GET_USER_ID() {
      return user.user_id
    },
    GET_USER_TYPE(){
      return user.user_type
    },
    GET_DRIVER_STATUS:() => {
      return user.driver_status
    },
    GET_REQUEST_ID: () => {
      return user.request_id
    },
    GET_USER_NAME:() => {
      return user.user_name
    },
    GET_LAT(){
      return user.lat
    },
    GET_LNG(){
      return user.lng
    },
    GET_LAT_REQ(){
      return user.latReq
    },
    GET_LNG_REQ(){
      return user.lngReq
    },
    GET_PENDING_REQUESTS() {
      return user.pending_request;
    }
}
