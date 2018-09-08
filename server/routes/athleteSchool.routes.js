const AthleteSchoolController = require("../controllers/athleteSchool.controller");
const router = require("express").Router();

module.exports = router;

router.get("/:id", AthleteSchoolController.getById);

router.post("/", AthleteSchoolController.postSchool);

router.put("/:id", AthleteSchoolController.updateSchool);

router.delete("/:id", AthleteSchoolController.deleteSchool);
