function peopleRoutes(database) {
	const express = require("express"),
		router = express.Router(),
		helper = require("../helpers/helper"),
		axios = require('axios');


	/**
	 * New person
	 * @typedef {object} NewPerson
	 * @property {string} name - name
	 * @property {string} surname - surname
	 * @property {string} birth_date - birth_date
	 * @property {string} citizen_id - citizen_id
	 * @property {string} address - address
	 */

	/**
	 * Person
	 * @typedef {object} Person
	 * @property {integer} reservation_id - name
	 * @property {string} register_timestamp - surname
	 * @property {string} name - birth_date
	 * @property {string} surname - citizen_id
	 * @property {string} birth_date - address
	 * @property {string} citizen_id - name
	 * @property {string} occupation - surname
	 * @property {string} address - birth_date
	 * @property {string} priority - citizen_id
	 * @property {boolean} vaccinated - address
	 * @property {integer} vac_time - address
	 */

	/**
	 * Personres
	 * @typedef {object} Personres
	 * @property {integer} reservation_id - name
	 * @property {string} register_timestamp - surname
	 * @property {string} name - birth_date
	 * @property {string} surname - citizen_id
	 * @property {string} birth_date - address
	 * @property {string} citizen_id - name
	 * @property {string} occupation - surname
	 * @property {string} address - birth_date
	 * @property {string} priority - citizen_id
	 * @property {boolean} vaccinated - address
	 * @property {date} vaccination_date - date
	 */

	/**
	 * People
	 * @typedef {object} People
	 * @property {string} _id - _id
	 * @property {string} date - date
	 * @property {array<Person>} people - people
	 */

	/**
	 * All People
	 * @typedef {object} All_People
	 * @property {array<People>} people_each_day
	 */


	/**
		GET /people/all
		@summary get all people from people schema
		@return {All_People} 200 - success response - application/json
	*/
	router.get("/all", async (_, res) => {
		const allPeople = await database.getAllPeopleInfo();
		// console.log(allPeople);
		return res.send(allPeople);
	});

	/**
		GET /people/by_date/{date}
		@summary get all people schema in a specific date
		@param {string} date.path - Date to get that date people
		@return {People} 200 - Success response - application/json
		@return {object} 204 - No people in this date
		@return {object} 406 - No date param included in request - application/json
		@example response - 200 - Success response
		@example response - 406 - No date param included
		{ "msg": "no date param included" }
	*/
	router.get(["/by_date", "/by_date/:date"], async (req, res) => {
		// console.log("get people by date");
		// console.log(req.params);
		const { date } = req.params;
		if (!date) {
			return res.status(406).json({ msg: "no date param included" });
		}
		
		const people = await database.getPeopleInfoByDate({
			date: date
		});
		if (people === null) return res.status(204).end();
		// console.log(people);
		return res.send(people);
	});

	/**
		DELETE /people/by_date/{date}
		@summary delete people schena by date.
		@param {string} date.path - date to get that date people
		@return {object} 200 - Deleted vaccine reservations from that date. - application/json
		@return {object} 400 - Invalid Date format. - application/json
		@return {object} 406 - no date param included in request. - application/json
		@return {object} 503 - Unhandled Error - application/json
		@example response - 200 - Deleted vaccine reservations from that date.
		{ "msg": "Deleted vaccine reservations from that date" }
		@example response - 400 - Invalid Date format
		{ "msg": "you are using invalid date" }
		@example response - 406 - no date param included in request.
		{ "msg": "No date param included in request" }
		@example response - 503 - Unhandled Err
		{ "msg": Err message }
	*/
	router.delete(["/by_date", "/by_date/:date"], async (req, res) => {
		// console.log("delete people by date");
		// console.log(req.params);
		const { date } = req.params;

		const dateRegex = /^[0-9]{1,2}\-[0-9]{1,2}\-[0-9]{4}$/;
		if (!dateRegex.test(date)) return res.status(400).json({msg: "you are using invalid date"});

		if (!date) {
			return res.status(406).json({ msg: "no date param included" });
		}
		try {
			await database.deletePeopleInfo({ date: date });
			return res.status(200).json({ msg: `Deleted vaccine reservations from ${date}.` });
		} catch(err) { 
			return res.status(400).json({msg: err.message});
		}
	});

	/**
	 	
	 */
	router.get("/by_date/queue/:date", async (req, res) => {
		const { date } = req.params;
		const dateRegex = /^[0-9]{1,2}\-[0-9]{1,2}\-[0-9]{4}$/;
		if (!dateRegex.test(date)) return res.status(400).json({msg: "you are using invalid date"});

		const people = await database.getPeopleInfoByDate({
			date: date
		});
		if (people === null) return res.status(204).end();
		const peopleList = people.people;
		const findUnVaccinatePeopleList = helper.findUnVaccinatePeopleList(peopleList);

		return res.json(findUnVaccinatePeopleList);
	});

	/**
	 	
	 */
	router.get("/by_date/queue/current/:date", async (req, res) => {
		const { date } = req.params;
		const dateRegex = /^[0-9]{1,2}\-[0-9]{1,2}\-[0-9]{4}$/;
		if (!dateRegex.test(date)) return res.status(400).json({msg: "you are using invalid date"});

		const people = await database.getPeopleInfoByDate({
			date: date
		});
		if (people === null) return res.status(204).end();
		const peopleList = people.people;
		const findUnVaccinatePeopleList = helper.findNextPersonQueue(peopleList);

		return res.json(findUnVaccinatePeopleList);
	});


	/**
	 	GET /people/by_reservationID/{reservationID}
		 @summary get person by reservationID
		 @param {string} reservationID.path - reservationID to get that person information
		 @return {Personres} 200 - Success response - application/json
		 @return {object} 204 - Can't find that person from the specific reservationID
		 @return {object} 400 - Err - application/json
		 @return {object} 406 - No reservationId included in request - application/json
		 @example response - 200 - Success response
		 @example response - 204 - Can't find that person from the specific reservationID
		 @example response - 400 - Err
		 { "msg" : "[Err message]"}
		 @example response - 406 - No reservationId included in request
		 { "msg" : "No reservationId included in request"}
		
	 */
	router.get(["/by_reservationID", "/by_reservationID/:reservationID"], async (req, res) => {
		const { reservationID } = req.params;
		if (reservationID === "" || !reservationID) {
			return res.status(406).json({ msg: "no reservationID param included" });
		}
		
		const allPeople = await database.getAllPeopleInfo(); //List
		try {
			let person_with_date = await helper.findPeopleByReservationID(allPeople, reservationID)
			return res.status(200).json(person_with_date);
		}
		catch (e) {
			console.log(e.message);
			if (e.message == "Can't find that person from the specific reservationID") {
				return res.status(204).end();
			}
			else return res.status(400).json({ msg: e.message });
		}
	})

	/**
		GET /people/count/total/{date}
		@summary get counting of people in one date schema.
		@param {string} date.path - date to get that date people
		@return {object} 200 - Deleted vaccine reservations from that date successful. - application/json
		@return {object} 406 - No date param included in request. - application/json
		@example response - 200 - Deleted vaccine reservations from that date successful.
		{
			"count": 3,
			"waiting": 0,
			"vaccinated": 3,
			"queue": {
				"9": 3
			}
		}
		@example response - 406 - No date param included in request.
		{
			"msg": "No date param included in request"
		} 
	*/
	router.get(["/count/total", "/count/total/:date"], async (req, res) => {
		// console.log("count people by date");
		// console.log(req.params);
		const { date } = req.params;
		if (!date) {
			return res.status(406).json({ msg: "no date param included" });
		}
		
		const peopleData = await database.getPeopleInfoByDate({
			date: date,
		});
		let result = helper.countPeople(peopleData);
		return res.json(result);
	});

	/**
		GET /people/count/walkin/{date}
		@summary get only walk in available number in queue by date.
		@param {string} date.path - date to get that date people
		@return {object} 200 - OK - application/json
		@return {object} 406 - No date param included in request. - application/json
		@example response - 200 - OK
		{ "total_walkin": 27 }
		@example response - 406 - No date param included in request.
		{ "msg": "no date param included" }

	*/
	router.get(["/count/walkin", "/count/walkin/:date"], async (req, res) => {
		// console.log("count walkin people by date");
		// console.log(req.params);
		const { date } = req.params;
		if (!date) {
			return res.status(406).json({ msg: "no date param included" });
		}
		
		const peopleData = await database.getPeopleInfoByDate({
			date: date,
		});
		const totalPeople = helper.countPeople(peopleData)["count"];
		let walkin = process.env.MAX_PEOPLE_PER_DATE - totalPeople;
		return res.json({ total_walkin: walkin });
	});

	/**
		PATCH /people/cancel/:date/{reservationID}
		@summary cancel people in peopleList in people schema by date and reservationID.
		@param {string} reservationID.path - reservationID to get that person
		@return {object} 200 - Removed the reservationID on that date successful
		@return {object} 304 - Remove the reservationID on that date unsuccessful
		@return {object} 406 - No date or reservationID params included in request.
		@example response - 200 - Removed the reservationID on that date successful
		{ "msg": "Removed reservationID [reservationID] on [date] successful" }
		@example response - 304 - Remove the reservationID on that date unsuccessful
		{ "msg": "Remove [reservationID] on [date] unsuccessful"}
		@example response - 406 - No date or reservationID params included in request.
		{ "msg": "no date or reservationID params included" }
	*/
	router.patch(["/cancel", 
		"/cancel/:date", 
		"cancel/:reservationID", 
		"/cancel/:date/:reservationID"
	], async (req, res) => {
		// console.log("cancle people by date and reservationID");
		const { date, reservationID } = req.params;
		if (!date || !reservationID) {
			return res
			.status(406)
			.json({ msg: "no date or reservationID params included" });
		}
		const peopleData = await database.getPeopleInfoByDate({ date: date });

		try {
			const newPeopleDataList = helper.removePeople(
				peopleData.people,
				parseInt(reservationID)
			);
			await database.updatePeopleInfo(
				{ date: date },
				{ people: newPeopleDataList }
			);
		} catch (e) {
			if (e.message != null) {
				return res.status(400).json({ msg: e.message });
			}
			return res
				.status(304)
				.json({
					msg: `Remove ${reservationID} on ${date} unsuccessful`,
				});
		}
		return res.json({
			msg: `Removed reservationID ${reservationID} on ${date} successful`,
		});
	});

	/**
		PATCH /people/vaccinated/:date/{reservationID}
		@summary vaccinate people in peopleList in people schema by date and reservationID.
		@param {string} reservationID.path - reservationID to get that person
		@return {object} 200 - Vaccination the reservationID on that date successful
		@return {object} 304 - Vaccination the reservationID on that date unsuccessful
		@return {object} 400 - Err
		@return {object} 406 - No date or reservationID params included in request.
		@example response - 200 - Vaccination the reservationID on that date successful
		{ "msg": "Vaccination reservationID : ${reservationID} on ${date} successful" }
		@example response - 304 - Vaccination the reservationID on that date unsuccessful
		{ "msg": "Vaccination reservationID : ${reservationID} on ${date} unsuccessful"}
		@example response - 400 - Err
		{ "msg": "[Err message]" }
		@example response - 406 - No date or reservationID params included in request.
		{ "msg": "no date or reservationID params included" }
	*/
	router.patch(["/vaccinated", 
		"/vaccinated/:date", 
		"vaccinated/:reservationID", 
		"/vaccinated/:date/:reservationID"
	], async (req, res) => {
		const { date, reservationID } = req.params;
		if (!date || !reservationID) {
			return res
			.status(406)
			.json({ msg: "no date or reservationID params included" });
		}

		const URL = "https://flamxby.herokuapp.com/reservation/report-taken/"+reservationID;

		axios.put(URL).then().catch((err)=> res.status(400).json({msg: err}))
					
		const peopleData = await database.getPeopleInfoByDate({ date: date });

		try {
			const newPeopleDataList = helper.vaccinePeople(
				peopleData.people,
				parseInt(reservationID)
			);
			await database.updatePeopleInfo(
				{ date: date },
				{ people: newPeopleDataList }
			);
		} catch (e) {
			if (e.message != null) {
				return res.status(400).json({ msg: e.message });
			}
			return res
				.status(304)
				.json({
					msg: `Vaccination reservationID : ${reservationID} on ${date} unsuccessful`,
				});
		}
		return res.json({
			msg: `Vaccination reservationID : ${reservationID} on ${date} successful`,
		});
	});

	/**
		PATCH /people/add/{date}
		@summary patch add person into peopleList by date.
		@param {string} date.path - date to get that date people
		@param {NewPerson} request.body - a person data
		@return {object} 200 - Vaccine reservation on that date successful!
		@return {object} 304 - No available timeslot for reservation on ${date}.
		@return {object} 304 - Vaccine reservation on that date unsuccessful.
		@return {object} 400 - Vaccine reservation on that date is unavailable.
		@return {object} 400 - Err.
		@return {object} 406 - No date param included.
		@example response - 200 - Vaccine reservation on that date successful!
		{ "msg": "Vaccine reservation on ${date} successful!"}
		@example response - 304 - No available timeslot for reservation on ${date}.
		{ "msg": "No available timeslot for reservation on ${date}."}
		@example response - 304 - Vaccine reservation on that date unsuccessful.
		{ "msg": "Vaccine reservation on ${date} unsuccessful."}
		@example response - 400 - Vaccine reservation on that date is unavailable.
		{ "msg": "Vaccine reservation on [date] is unavailable." }
		@example response - 400 - Err.
		{ "msg": "[Err message]" }
		@example response - 406 - No date param included.
		{ "msg": "no date param included" }
	*/
	router.patch(["/add", "/add/:date"], async (req, res) => {
		// get values from frontend
		const data = req.body;
		const { date } = req.params;
		const dateRegex = /^[0-9]{1,2}\-[0-9]{1,2}\-[0-9]{4}$/;
		if (!dateRegex.test(date)) return res.status(400).json({msg: "you are using invalid date"});

		const peopleData = await database.getPeopleInfoByDate({date: date});
		// 1. find if the date already exists in db of that date
			try {
			if (peopleData != null) {
				// find available time slot
				let [queue, isAvailable] = helper.findAvailableTimeSlot(peopleData.people);
				// console.log(queue, isAvailable)
				if (isAvailable) {
					//add this new person to peopleList
					let newPeopleList = helper.addPeopleToList(peopleData.people, data, queue);
					await database.updatePeopleInfo(
						{ date: date },
						{ people: newPeopleList }
					);
					return res.status(200).json({msg: `Vaccine reservation on ${date} successful!`});
				}
				else {
					return res.status(304).json({msg: `No available timeslot for reservation on ${date}.`});
				}
			}
			// 2. if not
			else {
				return res.status(400).json({msg: `Vaccine reservation on ${date} is unavailable.`});
			}
		} catch (e) {
			if (e.message != null) {
				return res.status(400).json({ msg: e.message });
			}
			return res
				.status(304)
				.json({
					msg: `Vaccine reservation on ${date} unsuccessful.`,
				});
		}
	});

	return router;
}

// module.exports = router
module.exports = peopleRoutes;
