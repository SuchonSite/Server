const mongoose = require('mongoose'),
      express = require('express'),
      router = express.Router();
      axios = require('axios');

const peopleSchema = require('../models/People')
const dbHelper = require('../db/dbHelper')
const helper = require('../helpers/helper')

router.post('/getDataFromGov/:date', async (req, res) => {

    await fetGovHelper(req, res);
    // param date
    console.log("get data from gov (by date)")
    if (req.params.date == null) {
       console.log("no date included")
       return res.status(202).json({"msg": "no date included"})
    }
    const date = req.params.date; // DD-MM-YYYY
    const slashDate = helper.toSlashDate(date) // to YYYY/MM/DD
    
    // check if db dont have this date
    const people = await peopleSchema.findOne({ "date": date })
    if (people != null) {
        return res.status(401).json({"msg": "already have data in this date."})
    }

    // fetch from gov
    let govEndpoint = process.env.GOV_ENDPOINT
    let getDataFromGovUrl = govEndpoint + "reservation/" + slashDate // reservation/YYYY/MM/DD
    let peopleList = []
    try{
        const response = await axios.get(getDataFromGovUrl)
        console.log("get data from gov successful")
        if (response.status == 200 && response.data != []){
            peopleList = response.data
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
    
    // compare and modify result
    let newPeopleList = helper.modifyPeopleList(peopleList)
    // arrange queue based on priority and timestamp
    let peopleQueueList = helper.arrangeQueuePeopleList(newPeopleList)
    // assign vaccination time
    let peopleAssignedTimeList = helper.assignPeopleListInTimeslots(peopleQueueList)
    
    // store up into database and return result
    let result = dbHelper.dbStorePeople(date, peopleAssignedTimeList)
    if(result) {
        console.log("stored completed")
        return res.json({"msg": "data added"})
    }
    else {
        console.log("error while add people")
        return res.status(402).json({"msg": "add people not completed."})
    }
})

module.exports = router