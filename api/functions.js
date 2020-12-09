// To calculate the distance between two coordinates in KM
// Solution from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula?rq=1
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    const R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);
    let dLon = deg2rad(lon2-lon1);
    let a = (
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2))
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    return d.toFixed(2);
}
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

//Source: https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }
        const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];
        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
}

function dateFormat(str){
    let year = str.substring(0, 4);
    let month = str.substring(5, 7);
    let day = str.substring(8, 10);
    let hour = str.substring(11, 13);
    let minute = str.substring(14, 16);
    let second = str.substring(17, 19);
    let date = new Date(year, month-1, day, hour, minute, second);
    return date
}

function getAddressData(addressData) {
    if (addressData !== null) {
        let location = [addressData.geometry.location.lat(), addressData.geometry.location.lng()]
        return location;
    }
    else{
        return false;
    }
}

export { getDistanceFromLatLonInKm, compareValues, dateFormat, getAddressData }