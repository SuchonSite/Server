const mongoose = require('mongoose'),
      express = require('express'),
      router = express.Router();


const peopleSchema = require('../models/People')
const helper = require('../helpers/helper')

router.get('/all', async (req, res) => {
    console.log(req.params)
    const allPeople = await peopleSchema.find()
    console.log(allPeople)
    return res.send(allPeople)
})

router.get('/by_date', async (_, res) => {
    return res.status(406).json({"msg": "no date included"})
})
router.get('/by_date/:date', async (req, res) => {
    console.log("get people by date")
    console.log(req.params)
    const people = await peopleSchema.findOne({ "date": req.params.date })
    console.log(people)
    return res.send(people)
})

router.delete('/by_date', async (_, res) => {
    return res.status(406).json({"msg": "no date included"})
})
router.delete('/by_date/:date', async (req, res) => {
    console.log("delete people by date")
    console.log(req.params)
    const date = req.params.date
    
    peopleSchema.findOneAndDelete({ "date": date }, function (err, docs) {
        return res.json({})
    });
    return res.status(200)
})

router.get('/count/total', async (_, res) => {
    return res.status(406).json({"msg": "no date included"})
})
router.get('/count/total/:date', async (req, res) => {
    console.log("count people by date")
    console.log(req.params)
    const peopleData = await peopleSchema.findOne({ "date": req.params.date })
    let result = helper.countPeople(peopleData)
    return res.json(result)
})

router.get('/count/walkin', async (_, res) => {
    return res.status(406).json({"msg": "no date included"})
})
router.get('/count/walkin/:date', async (req, res) => {
    console.log("count walkin people by date")
    console.log(req.params)
    const peopleData = await peopleSchema.findOne({ "date": req.params.date })
    const totalPeople = helper.countPeople(peopleData)['count']
    let walkin = process.env.MAX_PEOPLE_PER_DATE - totalPeople
    return res.json({"total_walkin": walkin})
})

module.exports = router