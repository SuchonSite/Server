const supertest = require('supertest')

const { describe } = require("jest-circus");
const makeApp = require("../app");

const allPeopleInfo = require('./allPeopleInfo.json');
const byDatePeopleInfo = require('./peopleInfo.json');

const fetchDataToList = jest.fn()
const connectDB = jest.fn();
const getAllPeopleInfo = jest.fn();
const getPeopleInfoByDate = jest.fn();
const deletePeopleInfo = jest.fn();
const updatePeopleInfo = jest.fn();

const fetcher = {
    fetchDataToList
}

const database = {
    connectDB,
    getAllPeopleInfo,
    getPeopleInfoByDate,
    deletePeopleInfo,
    updatePeopleInfo
}

const app = makeApp(database, fetcher);
const request = supertest(app);

beforeEach(() => {
    fetchDataToList.mockReset()
    connectDB.mockReset()
    getAllPeopleInfo.mockReset()
    getPeopleInfoByDate.mockReset()
    deletePeopleInfo.mockReset()
    updatePeopleInfo.mockReset()
});

describe("GET /people", () => {

    test("get all people info", async () => {
        const data = allPeopleInfo.data
        getAllPeopleInfo.mockReturnValueOnce(data)
        const response = await request.get('/people/all')
        expect(response.status).toBe(200)
        expect(response.body).toEqual(data)
        expect(response.body[0]._id).toEqual(expect.any(String))
        expect(response.body[0].date).toEqual(expect.any(String))
    })

    test("get people info on specific date", async () => {
        const data = byDatePeopleInfo.data
        getPeopleInfoByDate.mockReturnValueOnce(data)
        const response = await request.get('/people/by_date/20-10-2021')
        expect(response.status).toBe(200)
        expect(response.body).toEqual(data)
        expect(response.body.date).toEqual(expect.any(String))
        expect(response.body.people).toEqual(expect.any(Array))
    })

    test("test people info structure", async () => {
        const data = byDatePeopleInfo.data
        getPeopleInfoByDate.mockReturnValueOnce(data)
        const response = await request.get('/people/by_date/20-10-2021')
        expect(response.status).toBe(200)

        const peopleData = response.body.people[0]
        expect(peopleData.reservation_id).toEqual(expect.any(Number))
        expect(peopleData.register_timestamp).toEqual(expect.any(String))
        expect(peopleData.name).toEqual(expect.any(String))
        expect(peopleData.surname).toEqual(expect.any(String))
        expect(peopleData.birth_date).toEqual(expect.any(String))
        expect(peopleData.citizen_id).toEqual(expect.any(String))
        expect(peopleData.occupation).toEqual(expect.any(String))
        expect(peopleData.address).toEqual(expect.any(String))
        expect(peopleData.priority).toEqual(expect.any(String))
        expect(peopleData.vac_time).toEqual(expect.any(Number))
    })

    test("no date given", async () => {
        const response = await request.get('/people/by_date')
        expect(response.status).toBe(406)
    })
})

describe("DELETE /people", () => {

    test("delete people info on specific date", async () => {
        deletePeopleInfo.mockReturnValueOnce()
        const response = await request.delete('/people/by_date/20-10-2021')
        expect(response.status).toBe(200)
    })

    test("no date given", async () => {
        const response = await request.delete('/people/by_date')
        expect(response.status).toBe(406)
    })
})

describe("GET /count", () => {

    test("count people in day", async () => {
        const data = byDatePeopleInfo.data
        getPeopleInfoByDate.mockReturnValueOnce(data)
        const response = await request.get('/people/count/total/20-10-2021')
        expect(response.status).toBe(200)

        expect(response.body.count).toEqual(expect.any(Number))
        expect(response.body.waiting).toEqual(expect.any(Number))
        expect(response.body.vaccinated).toEqual(expect.any(Number))
    })

    test("no date given", async () => {
        const response = await request.get('/people/count/total')
        expect(response.status).toBe(406)
    })

    test("count people in day", async () => {
        const data = byDatePeopleInfo.data
        getPeopleInfoByDate.mockReturnValueOnce(data)
        const response = await request.get('/people/count/walkin/20-10-2021')
        expect(response.status).toBe(200)

        expect(response.body.total_walkin).toEqual(expect.any(Number))
    })

    test("no date given", async () => {
        const response = await request.get('/people/count/walkin')
        expect(response.status).toBe(406)
    })
})

describe("PATCH /cancel", () => {

    test("cancel reservation", async () => {
        const data = byDatePeopleInfo.data

        getPeopleInfoByDate.mockReturnValueOnce(data)
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/cancel/20-10-2021/10')
        expect(response.status).toBe(200)
        expect(response.body.msg).toBe('Removed reservationID 10 on 20-10-2021 successful')
    })

    test("no date given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/cancel/')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })

    test("given reservationID but no date given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/cancel/10')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })

    test("no reservationID given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/cancel/20-10-2021/')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })
})

describe("PATCH /vaccinated", () => {

    test("vaccinated", async () => {
        const data = byDatePeopleInfo.data

        getPeopleInfoByDate.mockReturnValueOnce(data)
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/vaccinated/20-10-2021/10')
        expect(response.status).toBe(200)
        expect(response.body.msg).toBe('Vaccination reservationID : 10 on 20-10-2021 successful')
    })
    
    test("no date given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/vaccinated/')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })

    test("given reservationID but no date given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/vaccinated/10')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })

    test("no reservationID given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/vaccinated/20-10-2021/')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })

})

describe("PATCH /add", () => {

    test("add walk-in", async () => {
        const data = byDatePeopleInfo.data

        getPeopleInfoByDate.mockReturnValueOnce(data)
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/add/20-10-2021')
        expect(response.status).toBe(200)
        expect(response.body.msg).toBe('Vaccine reservation on 20-10-2021 successful!')
    })

    // test("add walk-in when slot is full", async () => {
    //     const data = byDatePeopleInfo.data

    //     getPeopleInfoByDate.mockReturnValueOnce(data)
    //     updatePeopleInfo.mockReturnValueOnce()
    //     const response = await request.patch('/people/add/20-10-2021')
    //     expect(response.status).toBe(400)
    //     expect(response.body.msg).toBe('Vaccine reservation on 20-10-2021 is unavailable.')
    // })
    
    test("no date given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/vaccinated/')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })

})