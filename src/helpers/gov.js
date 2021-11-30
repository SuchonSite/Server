const axios = require('axios');
 
const authorizationToken = 0;

async function fetchDataToList(URL) {
    try {
        const response = await axios.get(URL)
        if (response.status == 200 && response.data != []) {
            return response.data;
        }
        else throw new Error("status code != 200");
    } catch (e) {
        throw new Error("fetch data failed");
    }
}

async function completeVaccination(URL) {
    try {
        const response = await axios.put(URL, {headers: {
            Authorization: authorizationToken
        }})
        if (response.status == 200 && response.data != []) {
            return response.data;
        }
        else throw new Error("status code != 200");
    } catch (e) {
        throw new Error("send vaccination result failed");
    }
}

async function cancelVaccination(URL) {
    try {
        const response = await axios.delete(URL, {headers: {
            Authorization: authorizationToken
        }})
        if (response.status == 200 && response.data != []) {
            return response.data;
        }
        else throw new Error("status code != 200");
    } catch (e) {
        throw new Error("cancel vaccination failed");
    }
}

module.exports = {fetchDataToList, completeVaccination, cancelVaccination}