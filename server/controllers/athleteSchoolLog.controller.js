const athleteSchoolLogService = require("../services/athleteSchoolLog.service");
const responses = require("../models/responses/index");

module.exports = {
  getActivitiesById: (req, res) => {
    athleteSchoolLogService
      .getActivityById(req)
      .then(item => {
        const r = new responses.ItemsResponse(item);
        res.json(r);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  },

  postActivity: (req, res) => {
    const { athleteSchoolId, dateContacted, notes, contactPersonName, contactPersonId, initiator } = req.body;

    athleteSchoolLogService
      .postActivity(athleteSchoolId, dateContacted, notes, contactPersonName, contactPersonId, initiator)
      .then(() => {
        res.sendStatus(201);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  },

  updateActivity: (req, res) => {
    const { athleteSchoolId, dateContacted, notes, contactPersonName, contactPersonId, initiator } = req.body;

    athleteSchoolLogService
      .updateActivity(athleteSchoolId, dateContacted, notes, contactPersonName, contactPersonId, initiator, req)
      .then(() => {
        res.sendStatus(200);
      });
  },

  deleteActivity: (req, res) => {
    athleteSchoolLogService.deleteActivity(req).then(() => {
      res.sendStatus(200);
    });
  }
};
