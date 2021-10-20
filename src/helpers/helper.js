function calcAge(dateString) {
    const dateParts = dateString.split('-')
    const birthday = +new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return ~~((Date.now() - birthday) / (31557600000));
}

function convertGovJson(thisJson){
    let newJson = {
        "reservation_id": thisJson["reservation_id"],
        "register_timestamp": thisJson["register_timestamp"],
        ...thisJson['owner']
    }
    return newJson
}

function modifyPeopleList(jsonPeopleList) {
    let newPeopleList = []
    for (const person of jsonPeopleList) {
        let thisPerson = convertGovJson(person)
        newPeopleList.push(thisPerson)
    }
    return newPeopleList
}

module.exports = { calcAge, modifyPeopleList };