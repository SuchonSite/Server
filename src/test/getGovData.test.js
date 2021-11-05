const supertest = require('supertest')

const { describe } = require("jest-circus");
const makeApp = require("../app");

const rawPeopleInfo = require("./rawPeopleInfo.json")
const byDatePeopleInfo = require('./peopleInfo.json');

const fetcher = jest.fn()
const connectDB = jest.fn();
const getAllPeopleInfo = jest.fn();
const getPeopleInfoByDate = jest.fn();
const deletePeopleInfo = jest.fn();

const database = {
    connectDB,
    getAllPeopleInfo,
    getPeopleInfoByDate,
    deletePeopleInfo,
}

const app = makeApp(database, fetcher);
const request = supertest(app);

beforeEach(() => {
    fetcher.mockReset()
    connectDB.mockReset()
    getAllPeopleInfo.mockReset()
    getPeopleInfoByDate.mockReset()
    deletePeopleInfo.mockReset()
});

describe("POST /getDataFromGov", () => {

    test("get all people info", async () => {
        const data = rawPeopleInfo.data
        fetcher.mockReturnValueOnce(data)
        // getPeopleInfoByDate.mockReturnValueOnce(byDatePeopleInfo.data)
        const response = await request.post('/getDataFromGov/20-10-2021')
        expect(response.status).toBe(200)
    })
})
