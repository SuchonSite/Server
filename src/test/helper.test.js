/**
 * Unit tests for helper.js
 * Require helper module
 */
const helper = require('../helpers/helper')
const {modifyPeopleList, convertGovJson, arrangeQueuePeopleList, removePeople, vaccinePeople} = require("../helpers/helper");

/**
 * Sample type of user undertest.
 */
let normal_young_user;
let listOfUser;
let userConvertedAndHaveVaccinated;
let listOfUser1;
let listOfUserWithVaccinated;
/**
 * Set Up
 * Initializes some user information
 */
beforeEach(() => {

    normal_young_user = [
        {
            "reservation_id": 1,
            "register_timestamp": "2021-10-20T15:19:56.609000",
            "owner": {
                "name": "Joel",
                "surname": "Miller",
                "birth_date": "2000-10-20",
                "citizen_id": "1234567890123",
                "occupation": "Teacher",
                "address": "Kasetsart University"
            }
        }
    ]

    listOfUser = [
        {
            "reservation_id": 1,
            "register_timestamp": "2021-10-20T15:19:56.609000",
            "owner": {
                "name": "Joel1",
                "surname": "Miller",
                "birth_date": "2000-10-20",
                "citizen_id": "1234567890123",
                "occupation": "Teacher",
                "address": "Kasetsart University"
            }
        },
        {
            "reservation_id": 2,
            "register_timestamp": "2021-10-21T15:19:56.609000",
            "owner": {
                "name": "Joel2",
                "surname": "Miller",
                "birth_date": "2000-10-20",
                "citizen_id": "1234567890124",
                "occupation": "Teacher",
                "address": "Kasetsart University"
            }
        }

    ]
    listOfUser1 = [
        {
            "reservation_id": 1,
            "register_timestamp": "2021-10-20T15:19:56.609000",
            "owner": {
                "name": "Joel1",
                "surname": "Miller",
                "birth_date": "2000-10-20",
                "citizen_id": "1234567890123",
                "occupation": "Teacher",
                "address": "Kasetsart University"
            }
        },
        {
            "reservation_id": 2,
            "register_timestamp": "2021-10-21T15:19:56.609000",
            "owner": {
                "name": "Joel2",
                "surname": "Miller",
                "birth_date": "1959-10-20",
                "citizen_id": "1234567890124",
                "occupation": "Doctor",
                "address": "Bangkok Hospital"
            }
        },
        {
            "reservation_id": 3,
            "register_timestamp": "2021-10-21T15:19:56.609000",
            "owner": {
                "name": "Joel3",
                "surname": "Miller",
                "birth_date": "1940-10-20",
                "citizen_id": "1234567890124",
                "occupation": "",
                "address": "Bangkok"
            }
        }

    ]
    userConvertedAndHaveVaccinated = {
        people: [{
            "reservation_id": 1,
            "register_timestamp": "2021-10-20T17:12:39.738000",
            "name": "Joel1",
            "surname": "Miller",
            "birth_date": "2000-10-20",
            "citizen_id": "1234567890123",
            "occupation": "doctor",
            "address": "Bangkok Hospital",
            "priority": "1",
            "vaccinated": true,
            "vac_time": "9"


        },
            {
                "reservation_id": 2,
                "register_timestamp": "2021-10-21T15:19:56.609000",
                "name": "Joel2",
                "surname": "Miller",
                "birth_date": "2000-10-20",
                "citizen_id": "1234567890124",
                "occupation": "Teacher",
                "address": "Kasetsart University",
                "priority": "3",
                "vaccinated": false,
                "vac_time": "9"

            },{
                "reservation_id": 3,
                "register_timestamp": "2021-10-21T15:19:56.609000",
                "name": "Joel3",
                "surname": "Miller",
                "birth_date": "1950-10-20",
                "citizen_id": "1234567890124",
                "occupation": "Merchant",
                "address": "Kasetsart University",
                "priority": "2",
                "vaccinated": false,
                "vac_time": "9"

            }]


    };
     listOfUserWithVaccinated = [
        {
            "reservation_id": 1,
            "register_timestamp": "2021-10-20T15:19:56.609000",
            "owner": {
                "name": "Joel1",
                "surname": "Miller",
                "birth_date": "2000-10-20",
                "citizen_id": "1234567890123",
                "occupation": "Teacher",
                "address": "Kasetsart University",
                "priority": "3",
                "vaccinated": true,
                "vac_time": "9"
            }
        },
        {
            "reservation_id": 2,
            "register_timestamp": "2021-10-21T15:19:56.609000",
            "owner": {
                "name": "Joel2",
                "surname": "Miller",
                "birth_date": "1959-10-20",
                "citizen_id": "1234567890124",
                "occupation": "Doctor",
                "address": "Bangkok Hospital",
                "priority": "1",
                "vaccinated": false,
                "vac_time": "9"

            }
        },
        {
            "reservation_id": 3,
            "register_timestamp": "2021-10-21T15:19:56.609000",
            "owner": {
                "name": "Joel3",
                "surname": "Miller",
                "birth_date": "1940-10-20",
                "citizen_id": "1234567890124",
                "occupation": "",
                "address": "Bangkok",
                "priority": "2",
                "vaccinated": false,
                "vac_time": "9"
            }
        }

    ]



});

/**
 * Test Case ID: 1
 * Given a user who was born on 10 Oct 2000
 * Function calcAge must return 21 years old
 */
test("calulate user's age of user who was born on 10 Oct 2000", () => {
    expect(helper.calcAge("2000-10-10")).toBe(21);
});
  
/**
 * Test Case ID: 2
 * Given a user who was born on 31 Oct 2000
 * Function calcAge must return 20 years old
 */
test("calulate user's age of user who was born on 31 Dec 2000", () => {
    expect(helper.calcAge("2000-12-31")).toBe(20);
});

/**
 * Test Case ID: 3
 * Given a user who was born today on year 2000
 * Function calcAge must return 21 years old
 */
test("calulate user's age of user who was born today on year 2000", () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = "2000";
    today = yyyy + '-' + mm + '-' + dd;
    expect(helper.calcAge(today)).toBe(21);
});

/**
 * Test Case ID: 4
 * Given a user who was born on 1 Jan this year
 * Function calcAge must return 0 years old
 */
test("calulate user's age of user who was born on 1 Jan this year", () => {
    expect(helper.calcAge("2021-1-1")).toBe(0);
});

/**
 * Test Case ID: 5
 * Given a user who was born on 31 Dec next year
 * Function calcAge must throw error with massage 'you are using invalid date'
 */
test("calulate user's age of user who was born in the future", () => {
    expect(() => helper.calcAge("31-12-2022")).toThrow(new Error('you are using invalid date'));
});
 
/**
 * Test Case ID: 6
 * Given a date with '0' in front
 * Function calcAge must return 21'
 */
test("calulate user's age with date 01 (have zero in front)", () => {
    expect(helper.calcAge("2000-01-01")).toBe(21);
});

/**
 * Test Case ID: 7
 * Given a date with month 'July'
 * Function calcAge must throw error with massage 'you are using wrong date format'
 */
test("calulate user's age of user who was born in 'July' ", () => {
    expect(() => helper.calcAge("2000-July-1")).toThrow(new Error('you are using invalid date format'));
});

/**
 * Test Case ID: 8
 * Given a empty string
 * Function calcAge must throw error with massage 'you are using wrong date format'
 */
test("calulate user's age with empty string", () => {
    expect(() => helper.calcAge("")).toThrow(new Error('you are using invalid date format'));
});

/**
 * Test Case ID: 9
 * Given a date with dd-mm-yyyy
 * Function calcAge must throw error with massage 'you are using wrong date format'
 */
test("calulate user's age with format yyyy-mm-dd", () => {
    expect(() => helper.calcAge("2-12-2000")).toThrow(new Error('you are using invalid date format'));
});

/**
 * Test Case ID: 10
 * Given a date with day 0
 * Function calcAge must throw error with massage 'you are using invalid date'
 */
test("calulate user's age of user who was born on day 0", () => {
    expect(() => helper.calcAge("0-1-2000")).toThrow(new Error('you are using invalid date format'));
});

/**
 * Test Case ID: 11
 * Given a date with day -1
 * Function calcAge must throw error with massage 'you are using invalid date'
 */
test("calulate user's age of user who was born on day -1", () => {
    expect(() => helper.calcAge("-1-01-2000")).toThrow(new Error('you are using invalid date format'));
});

/**
 * Test Case ID: 12
 * Given a date without '-'
 * Function calcAge must throw error with massage 'you are using wrong date format'
 */
test("calulate user's age with no '-' format", () => {
    expect(() => helper.calcAge("01012000")).toThrow(new Error('you are using invalid date format'));
});

/**
 * Test Case ID: 13
 * Given a date with '/'
 * Function calcAge must throw error with massage 'you are using wrong date format'
 */
test("calulate user's age with '/' format", () => {
    expect(() => helper.calcAge("1/1/2000")).toThrow(new Error('you are using invalid date format'));
});

/**
 * Test Case ID: 14
 * Given a date with month 13
 * Function calcAge must throw error with massage 'you are using invalid date'
 */
test("calulate user's age with invalid month", () => {
    expect(() => helper.calcAge("1-13-2000")).toThrow(new Error('you are using invalid date format'));
});

/**
 * Test Case ID: 15
 * Given a date with day 32
 * Function calcAge must throw error with massage 'you are using invalid date'
 */
test("calulate user's age with invalid date", () => {
    expect(() => helper.calcAge("32-1-2000")).toThrow(new Error('you are using invalid date format'));
});

/**
 * Test Case ID: 16
 * Given a data format that send by GOV team (array)
 * Function convertGovJson must generate JSON object from the array
 */
test("check JSON have correct key&value", () => {
    let normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    let expected = {reservation_id: 1};
    expected['register_timestamp'] = "2021-10-20T15:19:56.609000";
    expected['name'] = "Joel";
    expected['surname'] = "Miller";
    expected['birth_date'] = "2000-10-20";
    expected['citizen_id'] = "1234567890123";
    expected['occupation'] = "Teacher";
    expected['address'] = "Kasetsart University";
    expect(normal_young_user_json).toEqual(expected);
});

/**
 * Test Case ID: 18
 * Given normal_young_user (see detail above)
 * Function convertGovJson must generate JSON object with key reservation_id has value 1
 */
test("check JSON has valid reservation_id format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.reservation_id).toBe(1);
});

/**
 * Test Case ID: 19
 * Given normal_young_user (see detail above)
 * Function convertGovJson must generate JSON object with key timestamp has value 2021-10-20T15:19:56.609000
 */
test("check JSON has valid timestamp format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.register_timestamp).toEqual("2021-10-20T15:19:56.609000");
});

/**
 * Test Case ID: 20
 * Given normal_young_user (see detail above)
 * Function convertGovJson must generate JSON object with key name has value 'Joel'
 */
test("check JSON has valid name format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.name).toEqual("Joel");
});

/**
 * Test Case ID: 21
 * Given normal_young_user (see detail above)
 * Function convertGovJson must generate JSON object with key surename has value 'Miller'
 */
test("check JSON has valid surname format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.surname).toEqual("Miller");
});

/**
 * Test Case ID: 22
 * Given normal_young_user (see detail above)
 * Function convertGovJson must generate JSON object with key birth_date has value "20-10-2000"
 */
test("check JSON has valid date format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.birth_date).toEqual("2000-10-20");
});

/**
 * Test Case ID: 23
 * Given normal_young_user (see detail above)
 * Function convertGovJson must generate JSON object with key citizen_id has value "1234567890123"
 */
test("check JSON has valid id format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.citizen_id).toEqual("1234567890123");
});

/**
 * Test Case ID: 24
 * Given normal_young_user (see detail above)
 * Function convertGovJson must generate JSON object with key occupation has value "Teacher"
 */
test("check JSON has valid occupation format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.occupation).toEqual("Teacher");
});

/**
 * Test Case ID: 25
 * Given normal_young_user (see detail above)
 * Function convertGovJson must generate JSON object with key address has value "Kasetsart University"
 */
test("check JSON has valid address format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.address).toEqual("Kasetsart University");
});

/**
 * Test Case ID: 26
 * Given date with format "2000-20-10" 
 * Function toSlashDate must return "10/20/2000"
 */
test("check modify normal date format", () => {
    let date = "20-10-2000" 
    expect(helper.toSlashDate(date)).toEqual("2000/10/20");
});

/**
 * Test Case ID: 28
 * Given 2 users 
 * Function modifyPeopleList must return array that contain 2 JSON object
 */
test("check number of element in list", () => {
    let newList = helper.modifyPeopleList(listOfUser)
    expect(newList.length).toBe(2)
});

/**
 * Test Case ID: 29
 * Given listOfUser (see above)
 * Function modifyPeopleList must return array that contain 2 JSON object with queue order 
 */
test("check user order", () => {
    let newList = helper.modifyPeopleList(listOfUser)
    expect(newList[0].reservation_id).toEqual(1)
    expect(newList[1].reservation_id).toEqual(2)
});

/**
 * Test Case ID: 30
 * Given young normal user (non doctor or nurse)
 * Function setPriorityPerson must return priority level 3
 */
test("set priority for normal young user", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "2000-10-20";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Teacher";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("3");
});

/**
 * Test Case ID: 31
 * Given old normal user(older than 60) (non doctor or nurse)
 * Function setPriorityPerson must return priority level 2
 */
test("set priority for normal old user", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "1950-10-20";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Teacher";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("2");
});

/**
 * Test Case ID: 32
 * Given young user which have occupation = Nurse (with caps N)
 * Function setPriorityPerson must return priority level 1
 */
test("set priority for young Nurse (Nurse with caps 'N')", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "2000-10-20";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Nurse"; 
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("1");
});

/**
 * Test Case ID: 33
 * Given young user which have occupation = nurse
 * Function setPriorityPerson must return priority level 1
 */
test("set priority for young nurse", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "2000-10-20";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "nurse";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("1");
});

/**
 * Test Case ID: 34
 * Given young user which have occupation = Doctor(with caps D)
 * Function setPriorityPerson must return priority level 1
 */
test("set priority for young Doctor(Doctor with 'D')", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "2000-10-20";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Doctor";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("1");
});

/**
 * Test Case ID: 35
 * Given young user which have occupation = doctor
 * Function setPriorityPerson must return priority level 1
 */
test("set priority for young doctor", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "2000-10-20";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "doctor";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("1");
});

/**
 * Test Case ID: 36
 * Given old user which have occupation = doctor and older than 60
 * Function setPriorityPerson must return priority level 1
 */
test("set priority for old doctor", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "1950-10-20";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "doctor";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("1");
});

/**
 * Test Case ID: 37
 * Given old user which have occupation = nurse and older than 60
 * Function setPriorityPerson must return priority level 1
 */
test("set priority for young nurse", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "1950-10-20";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "nurse";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("1");
});

/**
 * Test Case ID: 38
 * Given normal user with exact 60 year old
 * Function setPriorityPerson must return priority level 3
 */
test("set priority for exact 60 user", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "1961-1-1";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Actor";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("3");
});

/**
 * Test Case ID: 39
 * Given normal user with exact 61 year old
 * Function setPriorityPerson must return priority level 2
 */
test("set priority for exact 61 user", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "1960-1-1";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Actor";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("2");
});

/**
 * Test Case ID: 40
 * Given normal user with exact 59 year old
 * Function setPriorityPerson must return priority level 3
 */
test("set priority for exact 59 user", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "1962-1-1";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Actor";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("3");
});
/**
 * Test Case ID: 41
 * Given people list with 3 person
 * Function arrangeQueuePeopleList must return queueList with true correct queue
 */
test("arrange queue people list with people list",() =>{
    let foo = arrangeQueuePeopleList(modifyPeopleList(listOfUser1));
    expect(foo[0].reservation_id).toEqual(2);
    expect(foo[1].reservation_id).toEqual(3);
    expect(foo[2].reservation_id).toEqual(1);

});


/**
 * Test Case ID: 42
 * Given empty people data
 * Function countPeople must return "count: 0, waiting: 0, vaccined: 0"
 */
test("count people with empty people data",() =>{

    const foo = {
        people:[]
    };
    expect(helper.countPeople(foo)).toEqual({
        "count": 0,
        "vaccinated": 0,
        "waiting": 0
    });
} );

/**
 * Test Case ID: 43
 * Given people data
 * Function countPeople must return correct number of count, waiting and vaccined
 */
test("count people with people data",()=> {


    expect(helper.countPeople(userConvertedAndHaveVaccinated)).toEqual(
        {
            "count": 3,
            "vaccinated": 1,
            "waiting": 2
        });
});

/**
 * Test Case ID: 44
 * Given empty peopleList and reserve_id
 * Function removePeople must return Error with text:peopleList is empty
 */
test("remove people with empty people list and reserve_id",()=>{
    const foo = [];
    expect(() => helper.removePeople(foo,1)).toThrow(new Error("peopleList is empty"));

});

/**
 * Test Case ID: 45
 * Given peopleList and wrong reserve_id
 * Function removePeople must return Error with text:person not found
 */
test("remove people with empty people list and wrong reserve_id",()=>{
    let foo = arrangeQueuePeopleList(modifyPeopleList(listOfUser1));
    expect(() => helper.removePeople(foo,-1)).toThrow(new Error("person not found"));
    expect(() => helper.removePeople(foo,5)).toThrow(new Error("person not found"));

});

/**
 * Test Case ID: 46
 * Given peopleList and reserve_id
 * Function removePeople must return peopleList without deleted reserve_id
 */
test("remove people with people list and reserve_id",()=>{
    let foo = removePeople(listOfUser1,1);
    expect(foo.length).toBe(2);
    expect(foo[0].reservation_id).toBe(2);
    expect(foo[1].reservation_id).toBe(3);
});

/**
 * Test Case ID: 47
 * Given empty peopleList and reserve_id
 * Function vaccinePeople must return Error with text:peopleList is empty
 */
test("vaccine people with empty people list and reserve_id",()=>{
    const foo = [];
    expect(() => helper.vaccinePeople(foo,1)).toThrow(new Error("peopleList is empty"));

});

/**
 * Test Case ID: 48
 * Given peopleList and wrong reserve_id
 * Function vaccinePeople must return Error with text:person not found
 *
 */
test("vaccine people with people list and wrong reserve_id",()=>{

   expect(() => helper.vaccinePeople(listOfUser1,6)).toThrow(new Error("person not found"));
    expect(() => helper.vaccinePeople(listOfUser1,-1)).toThrow(new Error("person not found"));

});

/**
 * Test Case ID: 49
 * Given peopleList and reserve_id people that vaccinated
 * Function vaccinePeople must return Error with text:this person already take vaccine!
 */
test("vaccine people with people list and reserve_id people that vaccinated", ()=>{
   expect(()=> helper.vaccinePeople(listOfUserWithVaccinated,1)).toThrow(new Error("this person already take vaccine!"))
});

/**
 * Test Case ID: 50
 * Given peopleList and reserve_id people that haven't got a vaccine
 * Function vaccinePeople must return peopleList with updated data
 */
test("vaccine people with people list and reserve_id people that haven't vaccinated",()=>{
    let foo = vaccinePeople(listOfUserWithVaccinated,2);
    expect(foo[1].vaccinated).toBe(true);
})