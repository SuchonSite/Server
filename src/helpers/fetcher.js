const axios = require('axios');

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

module.exports = {fetchDataToList}