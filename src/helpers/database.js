mongoose = require("mongoose")

const peopleSchema = require('../models/People')

mongoose.Promise = global.Promise;

function connectDB(uri) {
    mongoose
    .connect(uri, {
        useNewUrlParser: true,
    })
    .then(
        () => {
        console.log("Database conected");
        },
        (error) => {
        console.log("cannot connect to database" + error);
        }
    );
}

async function getAllPeopleInfo() {
    return peopleSchema.find()
}

async function getPeopleInfoByDate(date) {
    return peopleSchema.findOne(date)
}

async function deletePeopleInfo(date) {
    peopleSchema.findOneAndDelete(date, function (err, docs) {
        return res.json({})
    })
}

module.exports = {connectDB, getAllPeopleInfo, getPeopleInfoByDate, deletePeopleInfo}