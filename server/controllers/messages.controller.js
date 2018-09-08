const responses = require("../models/responses/index");
const messagesService = require("../services/messages.service");

module.exports = {
  getMessageByUserId: (req, res) => {
    const senderUserId = req.user.id;
    const recipientUserId = req.params.id;
    messagesService
      .getMessagesByUserId(senderUserId, recipientUserId)
      .then(item => {
        const r = new responses.ItemsResponse(item);
        res.json(r);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  },

  getConvosByUserId: (req, res) => {
    const userId = req.user.id;
    messagesService
      .getConvosByUserId(userId)
      .then(item => {
        const r = new responses.ItemsResponse(item);
        res.json(r);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  },

  postMessage: (req, res) => {
    const { recipientUserId, message, hasBeenRead } = req.body;
    const senderUserId = req.user.id;

    messagesService.postMessage(senderUserId, recipientUserId, message, hasBeenRead).then(item => {
      const r = new responses.ItemsResponse(item);
      res.status(201).json(r);
    });
  }
};
