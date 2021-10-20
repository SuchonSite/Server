function calcAge(dateString) {
    const dateParts = dateString.split('-')
    const birthday = +new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return ~~((Date.now() - birthday) / (31557600000));
}

function convertGovJson(thisJson) {
    let newJson = {
        "reservation_id": thisJson["reservation_id"],
        "register_timestamp": thisJson["register_timestamp"],
        ...thisJson['owner']
    }
    return newJson
}

function toSlashDate(date) {
    let [day, month, year] = date.split("-")
    return [year, month, day].join("/")
}

function modifyPeopleList(jsonPeopleList) {
    let newPeopleList = []
    for (const person of jsonPeopleList) {
        let thisPerson = convertGovJson(person)
        newPeopleList.push(thisPerson)
    }
    return newPeopleList
}

function setPriorityPerson(person) {
    // for doctor, nurse
    if(["doctor", "nurse"].includes(p.occupation)) {
        return 1;
    }
    // for people age >= 60
    else if (calcAge(p.birthdate) >= 60) {
        return 2;
    }
    // others
    else {
        return 3;
    }
}

//how to arrange queue?
// - Users who have high priority will get a vaccine first. (FINISHED)
// - On the other hand, users who have the same priority will be assigned a queue based on timestamp. (FINISHED from Gov)

//Time Slot = ... slots
//Vaccinations per timeslot = ... persons

function arrangeQueuePeopleList(peopleList) {

    let arrangedPeopleList = {
        1: [],
        2: [],
        3: []
    }
    
    //set priority people in people list
    for (person in personList) {
        let priority = setPriorityPerson(person);
        person.priority = priority;
        arrangedPeopleList[priority].push(person);
    }
    return arrangedPeopleList
}

module.exports = { calcAge, toSlashDate, modifyPeopleList, setPriorityPeopleList, arrangeQueuePeopleList };