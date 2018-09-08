const mssql = require("../../mssql");
const TYPES = require("tedious").TYPES;

const getById = req => {
  return mssql
    .executeProc("AthleteSchool_SelectByAthleteId", request => {
      request.addParameter("AthleteUserId", TYPES.Int, req.params.id);
    })
    .then(response => {
      if (response.resultSets[0]) {
        const item = {
          schools: response.resultSets[0]
        };
        console.log(response.resultSets[1]);

        for (const school of item.schools) {
          school.tags = [];
          if (response.resultSets[1] != undefined) {
            for (let i = 0; i < response.resultSets[1].length; i++) {
              if (response.resultSets[1][i].AthleteSchoolId == school.Id) {
                var obj = {};
                obj.athleteSchoolId = response.resultSets[1][i].AthleteSchoolId;
                obj.name = response.resultSets[1][i].Tag;
                school.tags.push(obj);
              }
            }
          }
        }
        return item;
      } else {
        const item = "";
        return item;
      }
    })
    .catch(() => {
      const item = "";
      return item;
    });
};

const postSchool = (athleteUserId, schoolId, notes, inactive) => {
  return mssql
    .executeProc("AthleteSchool_Insert", request => {
      request.addParameter("AthleteUserId", TYPES.Int, athleteUserId);
      request.addParameter("SchoolId", TYPES.Int, schoolId);
      request.addParameter("Notes", TYPES.NVarChar, notes);
      request.addParameter("Inactive", TYPES.Bit, inactive);
      request.addOutputParameter("Id", TYPES.Int, null);
    })
    .then(response => {
      const Id = response.outputParameters.Id;
      return Id;
    });
};

const updateSchool = (notes, rank, req) => {
  return mssql
    .executeProc("AthleteSchool_Update", request => {
      request.addParameter("Id", TYPES.Int, req.params.id);
      request.addParameter("Notes", TYPES.NVarChar, notes);
      request.addParameter("Rank", TYPES.NVarChar, rank);
    })
    .then(() => {
      return;
    });
};

const deleteSchool = req => {
  return mssql
    .executeProc("AthleteSchool_Delete", request => {
      request.addParameter("Id", TYPES.Int, req.params.id);
    })
    .then(response => {
      return response;
    });
};

module.exports = {
  getById,
  postSchool,
  updateSchool,
  deleteSchool
};
