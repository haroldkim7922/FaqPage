const responses = require("../models/responses/index");
const athleteSchoolService = require("../services/athleteSchool.service");

module.exports = {
  getById: (req, res) => {
    athleteSchoolService
      .getById(req)
      .then(item => {
        const r = new responses.ItemsResponse(item);
        res.json(r);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  },

  postSchool: (req, res) => {
    const { athleteUserId, schoolId, notes, inactive } = req.body;

    athleteSchoolService.postSchool(athleteUserId, schoolId, notes, inactive).then(Id => {
      res.status(201).json(Id);
    });
  },

  updateSchool: (req, res) => {
    const { notes, rank } = req.body;

    athleteSchoolService.updateSchool(notes, rank, req).then(() => {
      res.sendStatus(200);
    });
  },

  deleteSchool: (req, res) => {
    athleteSchoolService.deleteSchool(req).then(() => {
      res.sendStatus(200);
    });
  }
};
