const mongoose = require('mongoose'),
      express = require('express'),
      router = express.Router();


const peopleSchema = require('../models/People')

router.get('/all', async (req, res) => {
    console.log(req.params)
    const allPeople = await peopleSchema.find()
    console.log(allPeople)
    return res.send(allPeople)
})

router.get('/by_date/:date', async (req, res) => {
    console.log("get people by date")
    console.log(req.params)
    if(req.params.date == null){
        console.log("no date included")
        return res.status(202).json({"msg": "no date included"})
    }
    const people = await peopleSchema.findOne({ "date": req.params.date })
    console.log(people)
    return res.send(people)
})

module.exports = router