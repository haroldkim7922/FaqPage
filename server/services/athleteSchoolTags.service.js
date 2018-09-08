const mssql = require("../../mssql");
const TYPES = require("tedious").TYPES;

const postTag = (athleteSchoolId, tag) => {
  return mssql
    .executeProc("AthleteSchoolTag_Insert", request => {
      request.addParameter("AthleteSchoolId", TYPES.Int, athleteSchoolId);
      request.addParameter("Tag", TYPES.NVarChar, tag);
    })
    .then(response => {
      return response;
    });
};

const deleteTag = req => {
  const tagName = decodeURIComponent(req.query.q);
  console.log(req.query);

  return mssql
    .executeProc("AthleteSchoolTag_Delete", request => {
      request.addParameter("AthleteSchoolId", TYPES.Int, req.params.id);
      request.addParameter("Tag", TYPES.NVarChar, tagName);
    })
    .then(response => {
      return response;
    });
};

module.exports = {
  postTag,
  deleteTag
};
