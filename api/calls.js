import axios from 'axios'

//export const getUserByID = id =>  axios.get("/api/users/${id}")
export const getUsers = () =>  axios.get("/api/users/")
//const getUserRequest = (id) =>  axios.get("/api/get_single_request_by_user/" + id)
async function getUserRequest(id) {
    try{
        return axios.get('/api/get_single_request_by_user/' + id)
        .then(function(response) {
            return response;
        })
        .then(function(text) {
            let val = text.data;
            return val;
        });
    }
    catch(err){
        console.error("There was an error in retrieving user!", error);
    }
}
async function getUserByID(id) {
    try{
        return fetch("/api/users/"+ id)
        .then(function(response) {
            return response.json();
        })
        .then(function(text) {
            let val = text;
            return val;
        });
    }
    catch(err){
        console.error("There was an error in retrieving user!", error);
    }
}

async function getActiveRequests(){
    try{
        return axios.get("/api/get_active_requests")
        .then(function(response) {
            return response;
        })
        .then(function(text) {
            let val = text.data;
            return val;
        });
    }catch(error){
        console.error("There was an error in retrieving active requests!", error);
    }
}

async function deleteRequest(id){
    try{
        return axios.delete("/api/delete_request/" + id)
        .then(function(response) {
            return response;
        })
        .then(function(text) {
            let val = text.data;
            return val;
        });
    }
    catch(error){
        console.error("There was an error in delete the request!", error);
    }
}
async function finishRequest(id){
    try{
        return axios.get("/api/finish_request/" + id)
        .then(function(response) {
            return response;
        })
        .then(function(text) {
            let val = text;
            return val;
        });
    }
    catch(error){
        console.error("There was an error in finishig the request!", error);
    }
}

const apis = {
    getUsers, //do I use it?
    getUserByID,
    getActiveRequests,
    deleteRequest,
    getUserRequest,
    finishRequest
}

export default apis