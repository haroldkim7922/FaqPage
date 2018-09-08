const AthleteSchoolLogController = require("../controllers/athleteSchoolLog.controller");
const router = require("express").Router();

module.exports = router;

router.get("/:id", AthleteSchoolLogController.getActivitiesById);

router.post("/", AthleteSchoolLogController.postActivity);

router.put("/:id", AthleteSchoolLogController.updateActivity);

router.delete("/:id", AthleteSchoolLogController.deleteActivity);
