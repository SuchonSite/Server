const mongoose = require('mongoose'),
      express = require('express'),
      router = express.Router();
      axios = require('axios');

const peopleSchema = require('../models/People')
const dbHelper = require('../db/dbHelper')
const helper = require('../helpers/helper')

router.post('/getDataFromGov/:date', async (req, res) => {
    // param date
    console.log("get data from gov (by date)")
    if (req.params.date == null) {
       console.log("no date included")
       return res.status(202).json({"msg": "no date included"})
    }
    const date = req.params.date;
    // fetch to gov
    let govEndpoint = process.env.GOV_ENDPOINT
    let getDataFromGovUrl = govEndpoint + "reservation/" + date
    let peopleList = []
    try{
        const response = await axios.get(getDataFromGovUrl)
        console.log("get data from gov successful")
        if (response.status == 200 && response.body != []){
            peopleList = response.body
        }
        else{ 
            console.log(response.status); 
            return res.status(504).json({"msg": "gov status code != 200"})
        }
    } catch (e) {
        console.log("getData failed")
        console.log(e)
        return res.status(504).json({"msg": "fetch gov data failed"})
    }
    // compare and modify result (arrange priority)
    let newPeopleList = helper.modifyPeopleList(peopleList)
    
    // store up into database and return result
    let result = dbHelper.dbStorePeople(date, newPeopleList)
    if(result) {
        console.log("stored completed")
        return res.json({"msg": "data added"})
    }
    else{
        console.log("error while add people")
        return res.status(402).json({"msg": "add people not completed."})
    }
})

module.exports = router