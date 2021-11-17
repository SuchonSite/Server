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
    fetchDataToList.mockReset()
    connectDB.mockReset()
    getAllPeopleInfo.mockReset()
    getPeopleInfoByDate.mockReset()
    deletePeopleInfo.mockReset()
});

afterAll(() => {
    fetchDataToList.mockRestore()
});

describe("POST /getDataFromGov", () => {

    test("post data from gov", async () => {
        // mock fetcher
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(rawPeopleInfo.data);
            }, 5000);
        });

        fetchDataToList.mockReturnValueOnce(promise)
        getPeopleInfoByDate.mockReturnValueOnce(null)
        dbStorePeople.mockReturnValueOnce(true)

        const response = await request.post('/getDataFromGov/20-10-2021')
        expect(response.status).toBe(200)
    })

    test("failed to add data", async () => {
        // mock fetcher
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(rawPeopleInfo.data);
                }, 5000);
        });

        fetchDataToList.mockReturnValueOnce(promise)
        getPeopleInfoByDate.mockReturnValueOnce(null)
        dbStorePeople.mockReturnValueOnce(false)

        const response = await request.post('/getDataFromGov/20-10-2021')
        expect(response.status).toBe(402)
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
