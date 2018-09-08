const mssql = require("../../mssql");
const TYPES = require("tedious").TYPES;

const getAll = () => {
  return mssql.executeProc("FaqCategory_SelectAll", () => {}).then(response => {
    const item = {
      pagedItems: response.resultSets[0],
      pageIndex: 0,
      pageSize: 10,
      totalCount: 100,
      totalPages: 34
    };
    return item;
  });
};

const postFaqCategory = name => {
  return mssql
    .executeProc("FaqCategory_Insert", request => {
      request.addParameter("Name", TYPES.NVarChar, name, {
        length: 50
      });
      request.addOutputParameter("Id", TYPES.Int, null);
    })
    .then(response => {
      const Id = response.outputParameters.Id;
      return Id;
    });
};

const updateFaqCategory = (name, req) => {
  return mssql
    .executeProc("FaqCategory_Update", request => {
      request.addParameter("Id", TYPES.Int, req.params.id);
      request.addParameter("Name", TYPES.NVarChar, name, {
        length: 50
      });
    })
    .then(() => {
      return;
    });
};

const deleteFaqCategory = req => {
  return mssql
    .executeProc("FaqCategory_Delete", request => {
      request.addParameter("Id", TYPES.Int, req.params.id);
    })
    .then(response => {
      return response;
    })
    .catch(response => {
      return response;
    });
};

module.exports = {
  getAll,
  postFaqCategory,
  updateFaqCategory,
  deleteFaqCategory
};
