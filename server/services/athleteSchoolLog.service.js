const mssql = require("../../mssql");
const TYPES = require("tedious").TYPES;

const postActivity = (
  athleteSchoolId,
  dateContacted,
  notes,
  contactPersonName,
  contactPersonId,
  initiator
) => {
  return mssql
    .executeProc("AthleteSchoolLog_Insert", request => {
      request.addParameter("AthleteSchoolId", TYPES.Int, athleteSchoolId);
      request.addParameter("DateContacted", TYPES.Date, dateContacted);
      request.addParameter("Notes", TYPES.NVarChar, notes);
      request.addParameter(
        "ContactPersonName",
        TYPES.NVarChar,
        contactPersonName
      );
      request.addParameter("ContactPersonId", TYPES.Int, contactPersonId);
      request.addParameter("Initiator", TYPES.NVarChar, initiator);
      request.addOutputParameter("Id", TYPES.Int, null);
    })
    .then(response => {
      const Id = response.outputParameters.Id;
      return Id;
    });
};

const getActivityById = req => {
  return mssql
    .executeProc("AthleteSchoolLog_SelectByAthleteSchoolId", request => {
      request.addParameter("AthleteSchoolId", TYPES.Int, req.params.id);
    })
    .then(response => {
      const item = {
        activities: response.resultSets[0]
      };
      return item;
    })
    .catch(response => {
      return response;
    });
};

const updateActivity = (
  athleteSchoolId,
  dateContacted,
  notes,
  contactPersonName,
  contactPersonId,
  initiator,
  req
) => {
  return mssql
    .executeProc("AthleteSchoolLog_Update", request => {
      request.addParameter("AthleteSchoolId", TYPES.Int, athleteSchoolId);
      request.addParameter("DateContacted", TYPES.Date, dateContacted);
      request.addParameter("Notes", TYPES.NVarChar, notes);
      request.addParameter(
        "ContactPersonName",
        TYPES.NVarChar,
        contactPersonName
      );
      request.addParameter("ContactPersonId", TYPES.Int, contactPersonId);
      request.addParameter("Initiator", TYPES.NVarChar, initiator);
      request.addParameter("Id", TYPES.Int, req.params.id);
    })
    .then(() => {
      return;
    });
};

const deleteActivity = req => {
  return mssql
    .executeProc("AthleteSchoolLog_Delete", request => {
      request.addParameter("Id", TYPES.Int, req.params.id);
    })
    .then(response => {
      return response;
    });
};

module.exports = {
  postActivity,
  updateActivity,
  getActivityById,
  deleteActivity
};
