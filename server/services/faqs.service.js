const mssql = require("../../mssql");
const TYPES = require("tedious").TYPES;

const getAll = () => {
  return mssql.executeProc("Faq_SelectAll", () => {}).then(response => {
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

const searchFaq = req => {
  return mssql
    .executeProc("Faq_Search", request => {
      request.addParameter("SearchQuery", TYPES.NVarChar, req.query.q || "");
      request.addParameter("pageIndex", TYPES.Int, req.params.pageIndex);
      request.addParameter("pageSize", TYPES.Int, req.params.pageSize);
      request.addOutputParameter("ReturnPageIndex", TYPES.Int, null);
      request.addOutputParameter("ReturnPageSize", TYPES.Int, null);
    })
    .then(response => {
      if (response.resultSets[0] !== undefined) {
        const item = {
          pagedItems: response.resultSets[0],
          pageIndex: response.outputParameters.ReturnPageIndex,
          pageSize: response.outputParameters.ReturnPageSize,
          totalCount: response.resultSets[0][0].TotalRows,
          totalPages: Math.round(
            response.resultSets[0][0].TotalRows /
              response.outputParameters.ReturnPageSize
          )
        };
        return item;
      } else {
        const item = {
          pagedItems: null
        };
        return item;
      }
    });
};

const searchFaqByCategory = req => {
  return mssql
    .executeProc("Faq_SearchByCategory", request => {
      request.addParameter("CategoryId", TYPES.Int, req.params.id || "");
    })
    .then(response => {
      const item = {
        pagedItems: response.resultSets[0]
      };
      return item;
    });
};

const postFaq = (categoryId, question, answer, displayOrder) => {
  return mssql
    .executeProc("Faq_Insert", request => {
      request.addParameter("CategoryId", TYPES.Int, categoryId);
      request.addParameter("Question", TYPES.NVarChar, question, {
        length: 50
      });
      request.addParameter("Answer", TYPES.NVarChar, answer, {
        length: 100
      });
      request.addParameter("DisplayOrder", TYPES.Int, displayOrder);
      request.addOutputParameter("Id", TYPES.Int, null);
    })
    .then(response => {
      const Id = response.outputParameters.Id;
      return Id;
    });
};

const updateFaq = (categoryId, question, answer, displayOrder, req) => {
  return mssql
    .executeProc("Faq_Update", request => {
      request.addParameter("Id", TYPES.Int, req.params.id);
      request.addParameter("CategoryId", TYPES.Int, categoryId);
      request.addParameter("Question", TYPES.NVarChar, question, {
        length: 50
      });
      request.addParameter("Answer", TYPES.NVarChar, answer, {
        length: 100
      });
      request.addParameter("DisplayOrder", TYPES.Int, displayOrder);
    })
    .then(() => {
      return;
    });
};

const deleteFaq = req => {
  return mssql
    .executeProc("Faq_Delete", request => {
      request.addParameter("Id", TYPES.Int, req.params.id);
    })
    .then(response => {
      return response;
    });
};

module.exports = {
  getAll,
  postFaq,
  updateFaq,
  deleteFaq,
  searchFaq,
  searchFaqByCategory
};
