const mssql = require("../../mssql");
const TYPES = require("tedious").TYPES;

const getMessagesByUserId = (senderUserId, recipientUserId) => {
  return mssql
    .executeProc("Message_SelectByUserId", request => {
      request.addParameter("SenderUserId", TYPES.Int, senderUserId);
      request.addParameter("RecipientUserId", TYPES.Int, recipientUserId);
    })
    .then(response => {
      const item = {
        chatHistory: response.resultSets[0]
      };
      return item;
    });
};

const getConvosByUserId = userId => {
  return mssql
    .executeProc("Message_GetById", request => {
      request.addParameter("SenderUserId", TYPES.Int, userId);
    })
    .then(response => {
      const item = {
        convoHistory: response.resultSets[0]
      };
      return item;
    });
};

const postMessage = (senderUserId, recipientUserId, message, hasBeenRead) => {
  return mssql
    .executeProc("Message_Insert", request => {
      request.addParameter("SenderUserId", TYPES.Int, senderUserId);
      request.addParameter("RecipientUserId", TYPES.Int, recipientUserId);
      request.addParameter("Message", TYPES.NVarChar, message);
      request.addParameter("HasBeenRead", TYPES.Bit, hasBeenRead);
      request.addOutputParameter("Id", TYPES.Int, null);
      request.addOutputParameter("DateCreated", TYPES.DateTime2, null);
      request.addOutputParameter("RecentMessageCount", TYPES.Int, null);
    })
    .then(response => {
      const item = {
        id: response.outputParameters.Id,
        dateCreated: response.outputParameters.DateCreated,
        recentMessageCount: response.outputParameters.RecentMessageCount
      };
      return item;
    });
};

module.exports = {
  getMessagesByUserId,
  postMessage,
  getConvosByUserId
};
