const supertest = require('supertest')

const { describe } = require("jest-circus");
const makeApp = require("../app");

const allPeopleInfo = require('./allPeopleInfo.json');
const byDatePeopleInfo = require('./peopleInfo.json');
const { AfterAll } = require('@cucumber/cucumber');

const fetchDataToList = jest.fn()
const connectDB = jest.fn();
const getAllPeopleInfo = jest.fn();
const getPeopleInfoByDate = jest.fn();
const deletePeopleInfo = jest.fn();
const updatePeopleInfo = jest.fn();
const dbStorePeople = jest.fn();

const fetcher = {
    fetchDataToList
}

const database = {
    connectDB,
    getAllPeopleInfo,
    getPeopleInfoByDate,
    deletePeopleInfo,
    updatePeopleInfo,
    dbStorePeople
}

const app = makeApp(database, fetcher);
const request = supertest(app);
const OLD_ENV = process.env;

beforeEach(() => {
    jest.resetModules() // clears the cache
    process.env = { ...OLD_ENV }; // make a copy on env
    fetchDataToList.mockReset()
    connectDB.mockReset()
    getAllPeopleInfo.mockReset()
    getPeopleInfoByDate.mockReset()
    deletePeopleInfo.mockReset()
    updatePeopleInfo.mockReset()
});

afterAll(() => {
    process.env = OLD_ENV; // restore old environment
})

describe("GET /people", () => {

    /**
     * Test Case ID: P1
     * Given all people information data
     * GET /people/all must response with all of the people information data
     */
    test("get all people info", async () => {
        const data = allPeopleInfo.data
        getAllPeopleInfo.mockReturnValueOnce(data)
        const response = await request.get('/people/all')
        expect(response.status).toBe(200)
        expect(response.body).toEqual(data)
        expect(response.body[0]._id).toEqual(expect.any(String))
        expect(response.body[0].date).toEqual(expect.any(String))
    })

    /**
     * Test Case ID: P2
     * Given people information data
     * GET /people/by_date/20-10-2021 must response with the people information data of date 20-10-2021
     */
    test("get people info on specific date", async () => {
        const data = byDatePeopleInfo.data
        getPeopleInfoByDate.mockReturnValueOnce(data)
        const response = await request.get('/people/by_date/20-10-2021')
        expect(response.status).toBe(200)
        expect(response.body).toEqual(data)
        expect(response.body.date).toEqual(expect.any(String))
        expect(response.body.people).toEqual(expect.any(Array))
    })

    /**
     * Test Case ID: P3
     * Given people information data
     * GET /people/by_date/20-10-2021 must response with the people information data of date 20-10-2021
     * in the correct structure
     */
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

    /**
     * Test Case ID: P4
     * Given people information data
     * GET /people/by_date/ must response with status 406
     */
    test("no date given", async () => {
        const response = await request.get('/people/by_date')
        expect(response.status).toBe(406)
    })
})

describe("DELETE /people", () => {

    /**
     * Test Case ID: P5
     * Given people information data
     * DELETE /people/by_date/20-10-2021 must delete reservation of date 20-10-2021
     */
    test("delete people info on specific date", async () => {
        deletePeopleInfo.mockReturnValueOnce()
        const response = await request.delete('/people/by_date/20-10-2021')
        expect(response.status).toBe(200)
        expect(response.body.msg).toBe("Deleted vaccine reservations from 20-10-2021.")
    })

    /**
     * Test Case ID: P6
     * Given people information data
     * DELETE /people/by_date/20-OCT-2021 must response with status 400
     */
    test("invalid date format", async () => {
        const response = await request.delete('/people/by_date/20-OCT-2021')
        expect(response.status).toBe(400)
        expect(response.body.msg).toBe("you are using invalid date")
    })

    /**
     * Test Case ID: P7
     * Given people information data
     * DELETE /people/by_date/ must response with status 406
     */
    test("no date given", async () => {
        const response = await request.delete('/people/by_date/')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe("no date param included")
    })
})

describe("GET /count", () => {

    /**
     * Test Case ID: P8
     * Given people information data
     * GET /people/count/total/20-10-2021 must give a number of people
     * total count, waiting and vaccinated
     */
    test("count people in day", async () => {
        const data = byDatePeopleInfo.data
        getPeopleInfoByDate.mockReturnValueOnce(data)
        const response = await request.get('/people/count/total/20-10-2021')
        expect(response.status).toBe(200)

        expect(response.body.count).toEqual(expect.any(Number))
        expect(response.body.waiting).toEqual(expect.any(Number))
        expect(response.body.vaccinated).toEqual(expect.any(Number))
    })

    /**
     * Test Case ID: P9
     * Given people information data
     * GET /people/count/total/ must response with status 406
     */
    test("no date given", async () => {
        const response = await request.get('/people/count/total')
        expect(response.status).toBe(406)
    })

    /**
     * Test Case ID: P10
     * Given people information data
     * GET /people/count/walkin/20-10-2021 must give a number of total walk-in people
     */
    test("count people in day", async () => {
        const data = byDatePeopleInfo.data
        getPeopleInfoByDate.mockReturnValueOnce(data)
        const response = await request.get('/people/count/walkin/20-10-2021')
        expect(response.status).toBe(200)

        expect(response.body.total_walkin).toEqual(expect.any(Number))
    })

    /**
     * Test Case ID: P11
     * Given people information data
     * GET /people/count/walkin must response with status 406
     */
    test("no date given", async () => {
        const response = await request.get('/people/count/walkin')
        expect(response.status).toBe(406)
    })
})

describe("PATCH /cancel", () => {

    /**
     * Test Case ID: P12
     * Given people information data
     * PATCH /people/cancel/20-10-2021/10 must cancel the reservation of given date and ID
     */
    test("cancel reservation", async () => {
        const data = byDatePeopleInfo.data

        getPeopleInfoByDate.mockReturnValueOnce(data)
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/cancel/20-10-2021/10')
        expect(response.status).toBe(200)
        expect(response.body.msg).toBe('Removed reservationID 10 on 20-10-2021 successful')
    })

    /**
     * Test Case ID: P13
     * Given people information data
     * PATCH /people/cancel/ must response with status 406
     */
    test("no date given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/cancel/')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })

    /**
     * Test Case ID: P14
     * Given people information data
     * PATCH /people/cancel/10 must response with status 406
     */
    test("given reservationID but no date given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/cancel/10')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })

    /**
     * Test Case ID: P15
     * Given people information data
     * PATCH /people/cancel/20-10-2021/ must response with status 406
     */
    test("no reservationID given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/cancel/20-10-2021/')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })
})

describe("PATCH /vaccinated", () => {

    /**
     * Test Case ID: P16
     * Given people information data
     * PATCH /people/vaccinated/20-10-2021/10 must update people information of given ID to vaccinated
     */
    test("vaccinated", async () => {
        const data = byDatePeopleInfo.data

        getPeopleInfoByDate.mockReturnValueOnce(data)
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/vaccinated/20-10-2021/10')
        expect(response.status).toBe(200)
        expect(response.body.msg).toBe('Vaccination reservationID : 10 on 20-10-2021 successful')
    })
    
    /**
     * Test Case ID: P17
     * Given people information data
     * PATCH /people/vaccinated/ must response with status 406
     */
    test("no date given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/vaccinated/')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })

    /**
     * Test Case ID: P18
     * Given people information data
     * PATCH /people/vaccinated/10 must response with status 406
     */
    test("given reservationID but no date given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/vaccinated/10')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })

    /**
     * Test Case ID: P19
     * Given people information data
     * PATCH /people/vaccinated/10 must response with status 406
     */
    test("no reservationID given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/vaccinated/20-10-2021/')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })

})

describe("PATCH /add", () => {

    /**
     * Test Case ID: P20
     * Given people information data
     * PATCH /people/add/20-10-2021 must add walk-in people data in to database
     */
    test("add walk-in", async () => {
        jest.mock('./peopleInfo.json')
        // mock the actual data
        const d = require('./peopleInfo.json')
        const data = d.data

        getPeopleInfoByDate.mockReturnValueOnce(data)
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/add/20-10-2021', {
            name: 'mr.robot', surname: 'null', birth_date: '2015-06-24', citizen_id: '1101001010010', address: 'NewYork'
        })
        expect(response.status).toBe(200)
        expect(response.body.msg).toBe('Vaccine reservation on 20-10-2021 successful!')
    })

    /**
     * Test Case ID: P21
     * Given people information data but vaccination is unavailable
     * PATCH /people/add/20-10-2021 must response with status 400
     */
    test("add walk-in when unavailable", async () => {
        getPeopleInfoByDate.mockReturnValueOnce() // no data available
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/add/20-10-2021')
        expect(response.status).toBe(400)
        expect(response.body.msg).toBe('Vaccine reservation on 20-10-2021 is unavailable.')
    })

    /**
     * Test Case ID: P22
     * Given people information data but poeple is already vaccinated
     * PATCH /people/add/20-10-2021 must response with status 400
     */
    test("add walk-in when already vacinated", async () => {
        jest.mock('./peopleInfo.json', ()=>({
            data: {
                    _id: '617548b37bdf1420f00dbb61',
                    date: '20-10-2021',
                    people: [
                        {
                            name: 'foo', 
                            surname: 'rockmakmak', 
                            birth_date: '2002-10-22', 
                            citizen_id: '1234567848204', 
                            address: 'bkk thailand',
                            vaccinated: true,
                            vac_time: 9
                        }
                    ],
                    __v: 0
                }
          }))
        // mock the actual data
        const d = require('./peopleInfo.json')
        const data = d.data
        getPeopleInfoByDate.mockReturnValueOnce(data)
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/add/20-10-2021').send(
            {
                name: 'foo', surname: 'rockmakmak', birth_date: '2002-10-22', citizen_id: '1234567848204', address: 'bkk thailand'
            }
        )
        expect(response.status).toBe(400)
        expect(response.body.msg).toBe('this person already have vaccination!')
    })

    /**
     * Test Case ID: P23
     * Given people information data but quota is full
     * PATCH /people/add/20-10-2021 must response with status 304
     */
    test("add walk-in when quota is full", async () => {
        // make available quota be 0
        process.env.PEOPLE_PER_TIMESLOT = 0;

        const d = require('./peopleInfo.json')
        const data = d.data
        getPeopleInfoByDate.mockReturnValueOnce(data)
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/add/20-10-2021').send(
            {
                name: 'tom', surname: 'basicallyACat', birth_date: '2002-10-22', citizen_id: '1244569848208', address: 'bkk thailand'
            }
        )
        expect(response.status).toBe(304)
        expect(response.body.msg).toBe('No available timeslot for reservation on 20-10-2021.')
    })

    /**
     * Test Case ID: P24
     * Given people information data but reservation is unavailable
     * PATCH /people/add/20-10-2021 must response with status 400
     */
    test("add walk-in when reservation is unavailable", async () => {
        getPeopleInfoByDate.mockReturnValueOnce(null)
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/add/20-10-2021').send(
            {
                name: 'tom', surname: 'basicallyACat', birth_date: '2002-10-22', citizen_id: '1244569848208', address: 'bkk thailand'
            }
        )
        expect(response.status).toBe(400)
        expect(response.body.msg).toBe('Vaccine reservation on 20-10-2021 is unavailable.')
    })

    /**
     * Test Case ID: P25
     * Given people information
     * PATCH /people/vaccinated/ must response with status 406
     */
    test("no date given", async () => {
        updatePeopleInfo.mockReturnValueOnce()
        const response = await request.patch('/people/vaccinated/')
        expect(response.status).toBe(406)
        expect(response.body.msg).toBe('no date or reservationID params included')
    })

})
