const cron = require("node-cron");
const fetcher = require("./helpers/fetchDataGovToDb");

let d = new Date();
let day_ahead = process.env.FETCH_AHEAD;
d.setDate(d.getDate() + parseInt(day_ahead));
let year = d.getFullYear();
let day = d.getDay();
let month = d.getMonth();

let hour = process.env.FETCH_HOUR;
let minute = process.env.FETCH_MINUTE;

const JOB_SCHEDULE = `${minute} ${hour} * * *`;
if (day < 10) day = `0${day}`;
if (month < 10) month = `0${month}`;
let date = `${day}-${month}-${year}`;

cron.schedule(JOB_SCHEDULE, () => {
  fetcher.fetchDataGovToDb(date);
});
