function peopleRoutes(database) {
	const express = require("express"),
		router = express.Router();

	const helper = require("../helpers/helper");

	router.get("/all", async (req, res) => {
		console.log(req.params);
		const allPeople = await database.getAllPeopleInfo();
		console.log(allPeople);
		return res.send(allPeople);
	});

	router.get("/by_date", async (_, res) => {
		return res.status(406).json({ msg: "no date included" });
	});
	router.get("/by_date/:date", async (req, res) => {
		console.log("get people by date");
		console.log(req.params);
		const people = await database.getPeopleInfoByDate({
			date: req.params.date,
		});
		console.log(people);
		return res.send(people);
	});

	router.delete("/by_date", async (_, res) => {
		return res.status(406).json({ msg: "no date included" });
	});
	router.delete("/by_date/:date", async (req, res) => {
		console.log("delete people by date");
		console.log(req.params);
		const date = req.params.date;

		database.deletePeopleInfo({ date: date });
		return res.status(200);
	});

	router.get("/count/total", async (_, res) => {
		return res.status(406).json({ msg: "no date included" });
	});
	router.get("/count/total/:date", async (req, res) => {
		console.log("count people by date");
		console.log(req.params);
		const peopleData = await database.getPeopleInfoByDate({
			date: req.params.date,
		});
		let result = helper.countPeople(peopleData);
		return res.json(result);
	});

	router.get("/count/walkin", async (_, res) => {
		return res.status(406).json({ msg: "no date included" });
	});
	router.get("/count/walkin/:date", async (req, res) => {
		console.log("count walkin people by date");
		console.log(req.params);
		const peopleData = await database.getPeopleInfoByDate({
			date: req.params.date,
		});
		const totalPeople = helper.countPeople(peopleData)["count"];
		let walkin = process.env.MAX_PEOPLE_PER_DATE - totalPeople;
		return res.json({ total_walkin: walkin });
	});

	router.patch("/cancel", async (_, res) => {
		return res
			.status(406)
			.json({ msg: "no date or reservationID included" });
	});
	router.patch("/cancel/:date/:reservationID", async (req, res) => {
		console.log("cancle people by date and reservationID");
		const { date, reservationID } = req.params;
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
					msg: `remove ${reservationID} on ${date} unsuccessful`,
				});
		}
		return res.json({
			msg: `removed reservationID ${reservationID} on ${date}`,
		});
	});

	router.patch("/vaccinated", async (_, res) => {
		return res
			.status(406)
			.json({ msg: "no date or reservationID included" });
	});
	router.patch("/vaccinated/:date/:reservationID", async (req, res) => {
		const { date, reservationID } = req.params;
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
					msg: `vaccine ${reservationID} on ${date} unsuccessful`,
				});
		}
		return res.json({
			msg: `vaccianted reservationID ${reservationID} on ${date}`,
		});
	});

	router.post("/add/:date", async (req, res) => {
		// get values from frontend
		const data = req.body;
        
        const newPerson = {
            reservation_id: 0,
            register_timestamp: dateString,
            name: name,
            surname: surname,
            birth_date: birth_date,
            citizen_id: citizen_id,
            occupation: "",
            address: address,
            priority: 3,
            vaccinated: false,
            vac_time: vactime,
          }

		const peopleData = await database.getPeopleInfoByDate({
			date: req.params.date,
		});
		// 1. find if the date already exists in db of that date
		if (people != null) {
			// add new person into database find and update
			const newPeopleDataList = helper.addPeopleToList(
				peopleData.people,
				newPerson
			);
			await database.updatePeopleInfo(
				{ date: date },
				{ people: newPeopleDataList }
			);
			// find empty time slot
			// if there is an empty time slot
			// add this person to that time slot
			// if not
			// return res.status(304).json({"msg": `new vaccination reserve on ${date} unsuccessful`});
		}
		// 2. if not : create new date with a new peoplelist that contain that person
		else {
			database.dbStorePeople(date, []);
		}
	});

	return router;
}

// module.exports = router
module.exports = peopleRoutes;
