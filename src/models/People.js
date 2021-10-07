const mongoose = require('mongoose')

const peopleSchema = new mongoose.Schema({
    date: String,
    people: Array
})

module.exports = mongoose.model('people', peopleSchema)