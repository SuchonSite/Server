const mongoose = require('mongoose'),
      express = require('express'),
      router = express.Router();


const peopleSchema = require('../models/People')

function calcAge(dateString) {
    const dateParts = dateString.split('-')
    const birthday = +new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return ~~((Date.now() - birthday) / (31557600000));
}

router.post('/add_people', async (req, res) => {
    
    const addPeopleAppKey = req.headers['addpeopleappkey']
    // console.log(addPeopleAppKey)
    
    // check have app key
    if(addPeopleAppKey == null){
        console.log("appkey is null")
        return res.status(404).json({"msg": "no addpeopleappkey."})
    }
    
    // check app key valid
    if(addPeopleAppKey == process.env.ADD_PEOPLE_APP_KEY){}
    else {
        console.log("appkey invalid")
        return res.status(401).json({"msg": "addpeopleappkey invalid."})
    }
    
    // check peoples and date valid
    const date = req.body.date ? req.body.date : null;
    const peopleList = req.body.people ? req.body.people : null;
    if (date && peopleList) {}
    else{
        console.log("date or people array not exist.")
        return res.status(204).json({"msg": "date or people array not exist."})
    }
    
    // check the date not existed
    const people = await peopleSchema.findOne({ "date": date })
    if (people != null) {
        return res.status(401).json({"msg": "already have data in this date."})
    }
    
    // store people in people list after arrange priority 
    newPeopleList = []
    for (const person of peopleList){
        let p = person;
        if(["doctor", "nurse"].includes(p.occupation)) {
            p.priority = 1;
        }
        // check age >= 60
        else if (calcAge(p.birthdate) >= 60) {
            p.priority = 2;
        }
        // other
        else {
            p.priority = 4;
        }
        console.log(p)
        newPeopleList.push(p);
    }
    
    // push to database
    let data = {
        "date": date,
        "people": newPeopleList
    }
    console.log(newPeopleList)
    console.log(data)
    try {
        peopleSchema.create(data, (error, da) => {
            console.log("date added")
        })
        return res.json({"msg": "data added"})
    }
    catch (e) {
        console.log("error while add people")
        return res.status(402).json({"msg": "add people not completed."})
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