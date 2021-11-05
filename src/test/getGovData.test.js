const supertest = require('supertest')

const { describe } = require("jest-circus");
const makeApp = require("../app");

const rawPeopleInfo = require("./rawPeopleInfo.json")
const byDatePeopleInfo = require('./peopleInfo.json');

const fetchDataToList = jest.fn()
const connectDB = jest.fn();
const getAllPeopleInfo = jest.fn();
const getPeopleInfoByDate = jest.fn();
const deletePeopleInfo = jest.fn();
const dbStorePeople = jest.fn();

const fetcher = {
    fetchDataToList
}

const database = {
    connectDB,
    getAllPeopleInfo,
    getPeopleInfoByDate,
    deletePeopleInfo,
    dbStorePeople
}

const app = makeApp(database, fetcher);
const request = supertest(app);

beforeEach(() => {
    jest.useFakeTimers()
    fetchDataToList.mockReset()
    connectDB.mockReset()
    getAllPeopleInfo.mockReset()
    getPeopleInfoByDate.mockReset()
    deletePeopleInfo.mockReset()
});

afterAll(() => {
    jest.setTimeout(5000)
    fetchDataToList.mockRestore()
});

describe("POST /getDataFromGov", () => {

    test("get data from gov", async () => {
        jest.setTimeout(30000)
        const data = rawPeopleInfo.data
        fetchDataToList.mockReturnValueOnce(data)
        getPeopleInfoByDate.mockReturnValueOnce(null)
        const response = await request.post('/getDataFromGov/20-10-2021')
        expect(response.status).toBe(200)
    })

    test("already have data", async () => {
        const data = rawPeopleInfo.data
        fetchDataToList.mockReturnValueOnce(data)
        getPeopleInfoByDate.mockReturnValueOnce(byDatePeopleInfo.data)
        const response = await request.post('/getDataFromGov/20-10-2021')
        expect(response.status).toBe(401)
    })

    test("no date", async () => {
        const data = rawPeopleInfo.data
        fetchDataToList.mockReturnValueOnce(data)
        getPeopleInfoByDate.mockReturnValueOnce(null)
        const response = await request.post('/getDataFromGov/')
        expect(response.status).toBe(202)
    })
})
