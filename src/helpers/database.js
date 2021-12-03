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
    const peopleByDate = await getPeopleInfoByDate(date);
    if (peopleByDate) {
        return peopleSchema.findOneAndDelete(date)
    }
    else throw new Error("Can't find the date in the database")
}

/**
 * 
 * @param {json} date // filter
 * @param {json} newPeople // json of List of people
 */
async function updatePeopleInfo(date, newPeople) {
    // console.log(newPeople)
    return peopleSchema.findOneAndUpdate(date, newPeople);
} 

async function dbStorePeople(date, peopleList){
    let storeData = {
        "date": date,
        "people": peopleList
    }
    try {
        peopleSchema.create(storeData, (error, da) => {
        })
        return true
    }
    catch (e) {
        console.log("error while add people")
        return false
    }
}

module.exports = {connectDB, getAllPeopleInfo, getPeopleInfoByDate, deletePeopleInfo, dbStorePeople, updatePeopleInfo}
