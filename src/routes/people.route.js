const mongoose = require('mongoose'),
      express = require('express'),
      router = express.Router();


const peopleSchema = require('../models/People')

router.post('/add_people', async (req, res) => {
    // console.log(req.body)
    const add_people_app_key = req.headers['addpeopleappkey']
    console.log(add_people_app_key)
    if(add_people_app_key == null){
        console.log("in catch")
        console.log(e)
        res.status(404).json({"msg": "no addpeopleappkey"})
    }
    if(add_people_app_key == process.env.ADD_PEOPLE_APP_KEY){
        try {
            console.log("app key valid")
            let newPeopleDate = req.body.date
            const people = await peopleSchema.findOne({ "date": newPeopleDate })
            if (people != null) {
                res.status(401).json({"msg": "already have this date"})
            }
            else {
                peopleSchema.create(req.body, (error, data) => {
                    console.log("data added");
                })
                res.json({"msg": "data added"})
            }
        }
        catch (e) {
            console.log("error while add people")
            res.status(402).json({"msg": "add people not completed"})
        }
    }
    else {
        console.log("app key invalid")
        res.status(403).json({"msg": "addpeopleappkey invalid"})
    }
})

router.get('/get_people', async (req, res) => {
    console.log(req.params)
    const allPeople = await peopleSchema.find()
    console.log(allPeople)
    res.send(allPeople)
})

router.get('/get_people_by_date/:date', async (req, res) => {
    console.log("get people by date")
    console.log(req.params)
    if(req.params.date == null){
        console.log("no date included")
        res.status(202).json({"msg": "no date included"})
    }
    const people = await peopleSchema.findOne({ "date": req.params.date })
    console.log(people)
    res.send(people)
})

module.exports = router