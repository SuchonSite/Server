const supertest = require('supertest')

const { describe } = require("jest-circus");
const makeApp = require("../app");

const testData = require('./testPeopleInfo1.json');

const connectDB = jest.fn();
const getAllPeopleInfo = jest.fn();
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

    test("get all people info", async () => {
        getAllPeopleInfo.mockReturnValueOnce(testData.data)
        const response = await request.get('/people/all')
        expect(response.status).toBe(200)
        expect(response.body).toEqual(testData.data)
        expect(response.body[0]._id).toEqual(expect.any(String))
        expect(response.body[0].date).toEqual(expect.any(String))
    })
})

