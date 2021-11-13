function peopleRoutes(database) {
	const express = require("express"),
		router = express.Router(),
		helper = require("../helpers/helper");

	/**
		GET people/all
		used: get all people schema (by date).
		status code: 
			- 200 OK
	*/
	router.get("/all", async (_, res) => {
		const allPeople = await database.getAllPeopleInfo();
		// console.log(allPeople);
		return res.send(allPeople);
	});

	/**
		GET people/by_date/:date
		used: get people schema by date.
		status code: 
			- 200 OK
			- 406 no date param included in request.
	*/
	router.get(["/by_date", "/by_date/:date"], async (req, res) => {
		console.log("get people by date");
		console.log(req.params);
		const { date } = req.params;
		if (!date) {
			return res.status(406).json({ msg: "no date param included" });
		}
		
		const people = await database.getPeopleInfoByDate({
			date: date
		});
		// console.log(people);
		return res.send(people);
	});

	/**
		DELETE people/by_date/:date
		used: delete people schena by date.
		status code: 
			- 200 Deleted vaccine reservations from ${date}.
			- 406 no date param included in request.
	*/
	router.delete(["/by_date", "/by_date/:date"], async (req, res) => {
		console.log("delete people by date");
		console.log(req.params);
		const { date } = req.params;
		if (!date) {
			return res.status(406).json({ msg: "no date param included" });
		}
		
		database.deletePeopleInfo({ date: date });
		return res.status(200).json({ msg: `Deleted vaccine reservations from ${date}.` });
	});

	/**
		GET people/count/total/:date
		used: get counting of people in one date schema.
		status code: 
			- 200 OK
			- 406 no date param included in request.
	*/
	router.get(["/count/total", "/count/total/:date"], async (req, res) => {
		console.log("count people by date");
		console.log(req.params);
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
		GET people/count/walkin/:date
		used: get only walk in available number in queue by date.
		status code:
			- 200 OK
			- 406 no date param included in request.
	*/
	router.get(["/count/walkin", "/count/walkin/:date"], async (req, res) => {
		console.log("count walkin people by date");
		console.log(req.params);
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

    router.delete('/by_date', async (_, res) => {
        return res.status(406).json({"msg": "no date included"});
    })
    router.delete('/by_date/:date', async (req, res) => {
        console.log("delete people by date");
        console.log(req.params);
        const date = req.params.date;
        
        await database.deletePeopleInfo({ "date": date });
        return res.status(200)
    })

	/**
		PATCH people/cancel/:date/:reservationID
		used: cancel people in peopleList in people schema by date and reservationID.
		status code: 
			- 200 Removed reservationID ${reservationID} on ${date} successful
			- 304 Remove ${reservationID} on ${date} unsuccessful
			- 406 no date or reservationID params included in request.
	*/
	router.patch(["/cancel", 
		"/cancel/:date", 
		"cancel/:reservationID", 
		"/cancel/:date/:reservationID"
	], async (req, res) => {
		console.log("cancle people by date and reservationID");
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
		PATCH people/vaccinated/:date/:reservationID
		used: vaccinate people in peopleList in people schema by date and reservationID.
		status code: 
			- 200 Vaccination reservationID : ${reservationID} on ${date} successful
			- 304 Vaccination reservationID : ${reservationID} on ${date} unsuccessful
			- 400 Err
			- 406 no date or reservationID params included in request.
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
		PATCH people/add/:date
		used: patch add person into peopleList by date.
		status code: 
			- 200 Vaccine reservation on ${date} successful!
			- 304 
				- No available timeslot for reservation on ${date}.
				- Vaccine reservation on ${date} unsuccessful.
			- 400
				- Vaccine reservation on ${date} is unavailable.
				- Err
			- 406 no date param included.
	*/
	router.patch(["/add", "/add/:date"], async (req, res) => {
		// get values from frontend
		const data = req.body;
		const { date } = req.params;
		if (!date) {
			return res.status(406).json({ msg: "no date param included" });
		}
			
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
