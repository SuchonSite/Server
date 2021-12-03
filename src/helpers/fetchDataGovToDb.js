const helper = require("./helper");
const database = require("./database");
const fetcher = require("./fetcher");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

async function fetchDataGovToDb(date) {
  console.log("Daily fetch data from Gov~~")
  const dateRegex = /^[0-9]{2}\-[0-9]{2}\-[0-9]{4}$/;
  if (!dateRegex.test(date)) console.log("you are using invalid date format");

  const slashDate = helper.toSlashDate(date); // to YYYY/MM/DD

  // fetch from gov
  let govEndpoint = process.env.GOV_ENDPOINT;
  let getDataFromGovUrl = govEndpoint + "reservation/" + slashDate; // reservation/YYYY/MM/DD

  let peopleList = await fetcher.fetchDataToList(getDataFromGovUrl);

  // compare and modify result
  let newPeopleList = helper.modifyPeopleList(peopleList);
  // arrange queue based on priority and timestamp
  let peopleQueueList = helper.arrangeQueuePeopleList(newPeopleList);
  // assign vaccination time
  let peopleAssignedTimeList =
    helper.assignPeopleListInTimeslots(peopleQueueList);

  // store up into database and return result
  let result = database.dbStorePeople(date, peopleAssignedTimeList);
  if (result) {
    console.log("stored completed");
  } else {
    console.log("error while add people");
  }
}

module.exports = {fetchDataGovToDb}