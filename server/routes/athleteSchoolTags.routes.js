const AthleteSchoolTagsController = require("../controllers/athleteSchoolTags.controller");
const router = require("express").Router();

module.exports = router;

router.post("/", AthleteSchoolTagsController.postTag);

router.delete("/:id", AthleteSchoolTagsController.deleteTag);
