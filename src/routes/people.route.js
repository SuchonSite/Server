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

router.get('/by_date', async (req, res) => {
    return res.status(406).json({"msg": "no date included"})
})
router.get('/by_date/:date', async (req, res) => {
    console.log("get people by date")
    console.log(req.params)
    const people = await peopleSchema.findOne({ "date": req.params.date })
    console.log(people)
    return res.send(people)
})

router.delete('/by_date', async (req, res) => {
    return res.status(406).json({"msg": "no date included"})
})
router.delete('/by_date/:date', async (req, res) => {
    console.log("delete people by date")
    console.log(req.params)
    const date = req.params.date
    
    peopleSchema.findOneAndDelete({ "date": date }, function (err, docs) {
        return res.json({})
    });
})

router.get('/count', async (req, res) => {
    return res.status(406).json({"msg": "no date included"})
})
router.get('/count/:date', async (req, res) => {
    console.log("count people by date")
    console.log(req.params)
    const peopleData = await peopleSchema.findOne({ "date": req.params.date })
    if(peopleData == null) {
        return res.json({"count": 0, "waiting": 0, "vaccined": 0})
    }
    let count = 0, waiting = 0, vaccinated = 0;
    for(const person of peopleData.people){
        count +=1 ;
        if( person.vaccinated == true ){
            vaccinated += 1;
        }
        else{
            waiting += 1;
        }
    }
    return res.json({"count": count, "waiting": waiting, "vaccinated": vaccinated})
})

module.exports = router