/** 
 * Unit tests for helper.js
 * Require helper module
 */
const helper = require('../helpers/helper')

/**
 * Sample type of user undertest.
 */
let normal_young_user;
let invalid_user;
let listOfUser;

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

    invalid_user = [
        {
            "data": {
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

});
  
test("calulate user's age of user who was born on 10 Oct 2000", () => {
    expect(helper.calcAge("10-10-2000")).toBe(21);
});
  
test("calulate user's age of user who was born on 31 Dec 2000", () => {
    expect(helper.calcAge("31-12-2000")).toBe(20);
});

test("calulate user's age of user who was born today on year 2000", () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = "2000";
    today = dd + '-' + mm + '-' + yyyy;
    expect(helper.calcAge(today)).toBe(21);
});

test("calulate user's age of user who was born on 1 Jan this year", () => {
    expect(helper.calcAge("1-1-2021")).toBe(0);
});

test("calulate user's age of user who was born in the future", () => {
    expect(() => helper.calcAge("31-12-2022")).toThrow('you are using invalid date');
});
 
test("calulate user's age with date 01 (have zero in front)", () => {
    expect(helper.calcAge("01-01-2000")).toBe(21);
});

test("calulate user's age of user who was born in 'July' ", () => {
    expect(() => helper.calcAge("1-July-2000")).toThrow('you are using wrong date format');
});

test("calulate user's age with empty string", () => {
    expect(() => helper.calcAge("")).toThrow('you are using wrong date format');
});

test("calulate user's age with format yyyy-mm-dd", () => {
    expect(() => helper.calcAge("2000-12-2")).toThrow('you are using wrong date format');
});

test("calulate user's age of user who was born on day 0", () => {
    expect(() => helper.calcAge("0-1-2000")).toThrow('you are using invalid date');
});

test("calulate user's age of user who was born on day -1, test นี้แก้ได้นะ", () => {
    expect(() => helper.calcAge("-1-01-2000")).toThrow('you are using invalid date');
});

test("calulate user's age with no '-' format", () => {
    expect(() => helper.calcAge("01012000")).toThrow('you are using wrong date format');
});

test("calulate user's age with '/' format", () => {
    expect(() => helper.calcAge("1/1/2000")).toThrow('you are using wrong date format');
});

test("calulate user's age with invalid month", () => {
    expect(() => helper.calcAge("1-13-2000")).toThrow('you are using invalid date');
});

test("calulate user's age with invalid date", () => {
    expect(() => helper.calcAge("32-1-2000")).toThrow('you are using invalid date');
});

test("check JSON have correct key&value", () => {
    let normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    let expected = {reservation_id: 1};
    expected['register_timestamp'] = "2021-10-20T15:19:56.609000";
    expected['name'] = "Joel";
    expected['surname'] = "Miller";
    expected['birth_date'] = "20-10-2000";
    expected['citizen_id'] = "1234567890123";
    expected['occupation'] = "Teacher";
    expected['address'] = "Kasetsart University";
    expect(normal_young_user_json).toEqual(expected);
});

test("check JSON have all require field(eventhough value is undefine)", () => {
    const invalid_user_json = helper.convertGovJson(invalid_user[0]);
    expect(invalid_user_json.reservation_id).toEqual(expect.any(Number))
    expect(invalid_user_json.register_timestamp).toEqual(expect.any(String))
    expect(invalid_user_json.name).toEqual(expect.any(String))
    expect(invalid_user_json.surname).toEqual(expect.any(String))
    expect(invalid_user_json.birth_date).toEqual(expect.any(String))
    expect(invalid_user_json.citizen_id).toEqual(expect.any(String))
    expect(invalid_user_json.occupation).toEqual(expect.any(String))
    expect(invalid_user_json.address).toEqual(expect.any(String))
});

test("check JSON has valid reservation_id format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.reservation_id).toBe(1);
});

test("check JSON has valid timestamp format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.register_timestamp).toEqual("2021-10-20T15:19:56.609000");
});

test("check JSON has valid name format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.name).toEqual("Joel");
});

test("check JSON has valid surname format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.surname).toEqual("Miller");
});

test("check JSON has valid date format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.birth_date).toEqual("20-10-2000");
});

test("check JSON has valid id format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.citizen_id).toEqual("1234567890123");
});

test("check JSON has valid occupation format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.occupation).toEqual("Teacher");
});

test("check JSON has valid address format", () => {
    const normal_young_user_json = helper.convertGovJson(normal_young_user[0]);
    expect(normal_young_user_json.address).toEqual("Kasetsart University");
});

test("check modify normal date format", () => {
    let date = "10-20-2000" 
    expect(helper.toSlashDate(date)).toEqual("2000/20/10");
});

test("check modify invalid date format", () => {
    let date = "01234-12233-200000000" 
    expect(helper.toSlashDate(date)).toEqual("200000000/12233/01234");
});

test("check number of element in list", () => {
    let newList = helper.modifyPeopleList(listOfUser)
    expect(newList.length).toBe(2)
});

test("check user order", () => {
    let newList = helper.modifyPeopleList(listOfUser)
    expect(newList[0].reservation_id).toEqual(1)
    expect(newList[1].reservation_id).toEqual(2)
});

test("set priority for normal young user", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "20-10-2000";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Teacher";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("3");
});

test("set priority for normal old user", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "20-10-1950";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Teacher";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("2");
});

test("set priority for young Nurse (Nurse with caps 'N')", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "20-10-2000";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Nurse"; 
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("1");
});

test("set priority for young nurse", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "20-10-2000";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "nurse";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("1");
});

test("set priority for young Doctor(Doctor with 'D')", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "20-10-2000";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Docter";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("1");
});

test("set priority for young doctor", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "20-10-2000";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "doctor";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("1");
});

test("set priority for old doctor", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "20-10-1950";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "doctor";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("1");
});

test("set priority for young nurse", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "20-10-1950";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "nurse";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("1");
});

test("set priority for exact 60 user", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "1-1-1961";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Actor";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("3");
});

test("set priority for exact 61 user", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "1-1-1960";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Actor";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("2");
});

test("set priority for exact 59 user", () => {
    const normal_young_user = {reservation_id: 1};
    normal_young_user['register_timestamp'] = "2021-10-20T15:19:56.609000";
    normal_young_user['name'] = "Joel";
    normal_young_user['surname'] = "Miller";
    normal_young_user['birth_date'] = "1-1-1962";
    normal_young_user['citizen_id'] = "1234567890123";
    normal_young_user['occupation'] = "Actor";
    normal_young_user['address'] = "Kasetsart University";
    expect(helper.setPriorityPerson(normal_young_user)).toEqual("3");
});