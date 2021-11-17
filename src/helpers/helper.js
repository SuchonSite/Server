const database = require("./database");

/**
 * Calculate a person age using birthdate
 *
 * @param {string} dateString : birthdate in string format "YYYY-MM-DD"
 * @returns {int} age : age calculated using birthdate (dateString) and current date
 */
function calcAge(dateString) {
  //check regex format of input dateString
  const dateRegex = /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/;
  if (!dateRegex.test(dateString))
    throw new Error("you are using invalid date format");

  const [year, month, day] = dateString.split("-");

  //check year, month and day boundary
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31)
    throw new Error("you are using wrong date");
  if (month === 2 && day > 29) throw new Error("you are using invalid date");

  const birthday = +new Date(+year, month - 1, +day);
  const timeCompared = Date.now() - birthday;

  //check if birthdate is not later than current date
  if (timeCompared < 0) throw new Error("you are using invalid date");

  //return converted time (second) to year
  return ~~(timeCompared / 31557600000);
}

function convertGovJson(thisJson) {
  let newJson = {
    reservation_id: thisJson["reservation_id"],
    register_timestamp: thisJson["register_timestamp"],
    ...thisJson["owner"],
  };
  return newJson;
}

/**
 * Date string formatter from YYYY-MM-DD -> YYYY/MM/DD
 *
 * Since our POST request to add data to our database is '/getDataFromGov/YYYY-MM-DD'
 * But we GET request to fetch data from GOV by '/reservation/YYYY/MM/DD'
 *
 * So we have to change format from YYYY-MM-DD -> YYYY/MM/DD
 *
 * @param {string} date
 * @returns {string} formated date string
 */
function toSlashDate(date) {
  //check regex format of input date
  const dateRegex = /^[0-9]{1,2}\-[0-9]{1,2}\-[0-9]{4}$/;
  if (!dateRegex.test(date)) throw new Error("you are using invalid date");

  let [day, month, year] = date.split("-"); //YYYY-MM-DD
  return [year, month, day].join("/"); //YYYY/MM/DD
}

function modifyPeopleList(jsonPeopleList) {
  let newPeopleList = [];
  for (const person of jsonPeopleList) {
    let thisPerson = convertGovJson(person);
    newPeopleList.push(thisPerson);
  }
  return newPeopleList;
}

function setPriorityPerson(person) {
  // for doctor, nurse
  if (["doctor", "nurse"].includes(person.occupation.toLowerCase())) {
    return "1";
  }
  // for people age > 60
  else if (calcAge(person.birth_date) > 60) {
    return "2";
  }
  // others
  else {
    return "3";
  }
}

//how to arrange queue?
// - Users who have high priority will get a vaccine first. (FINISHED)
// - On the other hand, users who have the same priority will be assigned a queue based on timestamp. (FINISHED from Gov)

function arrangeQueuePeopleList(peopleList) {
  let arrangedPeopleList = {
    1: [],
    2: [],
    3: [],
  };

  //set priority people in people list
  for (const person of peopleList) {
    let priority = setPriorityPerson(person);
    person.priority = priority;
    arrangedPeopleList[priority].push(person);
  }

  let queueList = [];
  queueList = arrangedPeopleList["1"].concat(
    arrangedPeopleList["2"],
    arrangedPeopleList["3"]
  );
  return queueList;
}

/**
 * Since what we recieved from GOV is assigned people vaccination date.
 * So we have to assign them to each timeslot in each day.
 *
 * @param peopleList : List of people to be put in timeslot
 * @param {int} peoplePerTimeslot : how many people that can take vaccination per timeslot
 * @returns assignedTimePeopleList : List of people that assign vaccination time in each day.
 */
function assignPeopleListInTimeslots(peopleList) {
  const peoplePerTimeslot = process.env.PEOPLE_PER_TIMESLOT;

  //start vaccination when government open
  let vac_time = process.env.GOVERNMENT_OPEN;

  let assignedTimePeopleList = [];

  let avaliableCurrentSlot = peoplePerTimeslot;
  for (const person of peopleList) {
    if (avaliableCurrentSlot == 0) {
      //re availible vacciantgion slot of current timeslot
      avaliableCurrentSlot = peoplePerTimeslot;

      if (vac_time == process.env.GOVERNMENT_CLOSE) {
        throw new Error("Not enough timeslot for all vaccination");
      } else {
        vac_time += process.env.VACCINATION_TIME;
      }
    }
    newPerson = { ...person, vac_time: vac_time };
    avaliableCurrentSlot--;

    assignedTimePeopleList.push(newPerson);
  }

  return assignedTimePeopleList;
}

function countPeople(peopleData) {
  if (peopleData == null) {
    return { count: 0, waiting: 0, vaccined: 0 };
  }
  let count = 0,
    waiting = 0,
    vaccinated = 0,
    queue = {};
  for (const person of peopleData.people) {
    count += 1;
    if (person.vaccinated == true) {
      vaccinated += 1;
    } else {
      waiting += 1;
    }
    queue[person.vac_time.toString()] =
      (queue[person.vac_time.toString()] || 0) + 1;
  }
  return {
    count: count,
    waiting: waiting,
    vaccinated: vaccinated,
    queue: queue,
  };
}

function removePeople(peopleList, reserved_id) {
  if (peopleList == null) {
    throw new Error("peopleList is empty");
  }
  const newPeopleList = peopleList.filter(
    (person) => person.reservation_id !== reserved_id
  );
  if (peopleList.length > newPeopleList.length) return newPeopleList;
  else throw new Error("person not found");
}

function vaccinePeople(peopleList, reserved_id) {
  if (peopleList == null) {
    throw new Error("peopleList is empty");
  }
  let updated = false;
  for (const person of peopleList) {
    if (person.reservation_id == reserved_id) {
      if (person.vaccinated == false) {
        person.vaccinated = true;
        updated = true;
      } else throw new Error("this person already take vaccine!");
    }
  }
  if (updated) return peopleList;
  else throw new Error("person not found");
}

function addPeopleToList(peopleList, newPersonData, queue) {
  const { name, surname, birth_date, citizen_id, address } = newPersonData;
  if (peopleList == null) {
    throw new Error("peopleList is empty");
  }
  var pplist = peopleList;
  const person = pplist.find((person) => person.citizen_id == citizen_id);
  // console.log(person);
  if (person) throw new Error("this person already have vaccination!");
  else {
    var m = new Date();
    var dateString =
      m.getUTCFullYear() +
      "-" +
      ("0" + (m.getUTCMonth() + 1)).slice(-2) +
      "-" +
      ("0" + m.getUTCDate()).slice(-2) +
      "T" +
      ("0" + m.getUTCHours()).slice(-2) +
      ":" +
      ("0" + m.getUTCMinutes()).slice(-2) +
      ":" +
      ("0" + m.getUTCSeconds()).slice(-2) +
      "." +
      ("0" + m.getUTCMilliseconds()).slice(-6);

    //find available vactime
    let vactime = "";
    // console.log(queue)
    for (let timeslot in queue) {
      if (queue[timeslot] > 0) {
        vactime = timeslot;
        break;
      }
    }

    let np = {
      reservation_id: 0,
      register_timestamp: dateString,
      name: name,
      surname: surname,
      birth_date: birth_date,
      citizen_id: citizen_id,
      occupation: "",
      address: address,
      priority: "3",
      vaccinated: false,
      vac_time: parseInt(vactime),
    };
    pplist.push(np);
    // console.log(peopleList);
  }
  return pplist;
}

function findAvailableTimeSlot(peopleList) {
  let queue = {},
    newqueue = {},
    isAvailable = false;
  // Initial time slot dict
  for (let slot=parseInt(process.env.GOVERNMENT_OPEN); slot<=parseInt(process.env.GOVERNMENT_CLOSE); slot++) {
    queue[slot.toString()] = 0;
  }
  // Set for each time slot
  for (let person of peopleList){
    queue[person.vac_time.toString()] += 1;
  }
  
  // Available queue
  for (let timeSlot in queue) {
    let availableSlot = process.env.PEOPLE_PER_TIMESLOT - queue[timeSlot];
    if (availableSlot) {
      isAvailable = true;
      newqueue[timeSlot] = availableSlot;
    }
  }
  return [newqueue, isAvailable];
}

function findPeopleByReservationID(allPeople, reservationID) {
  let person = null;
  for (const peopleEachDay of allPeople) {
    // peopleEachDay is one of object from People Schema
    for (const personInList of peopleEachDay.people) {
      if (personInList.reservation_id.toString() == reservationID.toString()) {
        person = personInList;
        break;
      }
    }
  }

  if (person === null) {
    throw new Error("Can't find that person from the specific reservationID");
  }
  else return person;
}

module.exports = {
  calcAge,
  toSlashDate,
  modifyPeopleList,
  arrangeQueuePeopleList,
  convertGovJson,
  setPriorityPerson,
  assignPeopleListInTimeslots,
  countPeople,
  removePeople,
  vaccinePeople,
  addPeopleToList,
  findAvailableTimeSlot,
  findPeopleByReservationID,
};
