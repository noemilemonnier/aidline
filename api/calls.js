import axios from 'axios'

async function getUsers(){
    try{
        return axios.get("/api/users")
        .then(function(response) {
            return response;
        })
        .then(function(text) {
            let val = text.data;
            return val;
        });
    }catch(error){
        console.error("There was an error in retrieving users from the API Call!", error);
    }
}
async function deleteUser(id){
    try{
        return axios.delete("/api/users/" + id)
        .then(function(response) {
            return response;
        })
        .then(function(text) {
            let val = text.data;
            return val;
        });
    }catch(error){
        console.error("There was an error in deleting the user from the API Call!", error);
    }
}
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
        console.error("There was an error in retrieving request!", error);
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

async function getNotAcceptedRequests(){
    try{
        return axios.get("/api/get_not_accepted_requests")
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
    getUsers,
    getUserByID,
    deleteUser,
    getActiveRequests,
    deleteRequest,
    getUserRequest,
    finishRequest,
    getNotAcceptedRequests
}

export default apis