const athleteSchoolTagsService = require("../services/athleteSchoolTags.service");

module.exports = {
  postTag: (req, res) => {
    const { athleteSchoolId, tag } = req.body;

    athleteSchoolTagsService
      .postTag(athleteSchoolId, tag)
      .then(() => {
        res.sendStatus(201);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  },

  deleteTag: (req, res) => {
    athleteSchoolTagsService.deleteTag(req).then(() => {
      res.sendStatus(200);
    });
  }
};
