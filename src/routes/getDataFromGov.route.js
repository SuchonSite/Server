function getDataFromGov(database, fetcher) {

    const express = require('express'),
        router = express.Router();

    const helper = require('../helpers/helper')

    router.post('/getDataFromGov/:date', async (req, res) => {
        // param date
        console.log("get data from gov (by date)")
        const date = req.params.date; // DD-MM-YYYY

        const dateRegex = /^[0-9]{2}\-[0-9]{2}\-[0-9]{4}$/;
        if (!dateRegex.test(date)) return res.status(400).json({msg: "you are using invalid date format"});

        const slashDate = helper.toSlashDate(date) // to YYYY/MM/DD

        // check if db dont have this date
        const people = await database.getPeopleInfoByDate({ "date": date })
        if (people != null) {
            return res.status(401).json({"msg": "already have data in this date."})
        }

        // fetch from gov
        let govEndpoint = process.env.GOV_ENDPOINT
        let getDataFromGovUrl = govEndpoint + "reservation/" + slashDate // reservation/YYYY/MM/DD
        // let peopleList = []
        // fetch using fetch method from helpers
        let peopleList = await fetcher.fetchDataToList(getDataFromGovUrl)
        // compare and modify result
        let newPeopleList = helper.modifyPeopleList(peopleList)
        console.log(newPeopleList);
        // arrange queue based on priority and timestamp
        let peopleQueueList = helper.arrangeQueuePeopleList(newPeopleList)
        // assign vaccination time
        let peopleAssignedTimeList = helper.assignPeopleListInTimeslots(peopleQueueList)
        
        // store up into database and return result
        let result = database.dbStorePeople(date, peopleAssignedTimeList)
        if(result) {
            console.log("stored completed")
            return res.json({"msg": "data added"})
        }
        else {
            console.log("error while add people")
            return res.status(402).json({"msg": "add people not completed."})
        }
    })

    return router

}

module.exports = getDataFromGov