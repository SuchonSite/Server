const mongoose = require('mongoose'),
      express = require('express'),
      axios = require('axios');
      

const peopleSchema = require('../models/People')

async function dbStorePeople(date, peopleList){
    let storeData = {
        "date": date,
        "people": peopleList
    }
    try {
        peopleSchema.create(storeData, (error, da) => {
            console.log("date added")
        })
        return true
    }
    catch (e) {
        console.log("error while add people")
        return false
    }
}

module.exports = { dbStorePeople };