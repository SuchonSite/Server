const supertest = require('supertest')

const { describe } = require("jest-circus");
const makeApp = require("../app");

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

const connectDB = jest.fn();
const getAllPeopleInfo = jest.fn(listOfUser);
const getPeopleInfoByDate = jest.fn();
const deletePeopleInfo = jest.fn();

const database = {
    connectDB,
    getAllPeopleInfo: getAllPeopleInfo,
    getPeopleInfoByDate,
    deletePeopleInfo,
}

const app = makeApp(database);
const request = supertest(app);

beforeEach(() => {
    connectDB.mockReset()
    getAllPeopleInfo.mockReset()
    getPeopleInfoByDate.mockReset()
    deletePeopleInfo.mockReset()
});

describe("GET /people", () => {

    test("get all people info", () => {
        getAllPeopleInfo.mockReturnValueOnce(listOfUser)
        return request.get('/people/all')
        .then((response) => {
            expect(response.status).toBe(200)
            expect(response.body).toEqual(listOfUser)
            expect(response.body[0]._id).toEqual(expect.any(String))
            expect(response.body[0].date).toEqual(expect.any(String))
            expect(response.body[0].people).toEqual(expect.any(Array))
        })
    })
})

