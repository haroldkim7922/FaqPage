const responses = require("../models/responses/index");
const faqsService = require("../services/faqsCategories.service");

module.exports = {
  getAll: async (req, res) => {
    faqsService.getAll().then(item => {
      const r = new responses.ItemsResponse(item);
      res.json(r);
    });
  },

  postFaqCategory: async (req, res) => {
    const { name } = req.body;

    faqsService.postFaqCategory(name).then(Id => {
      res.status(201).json(Id);
    });
  },

  updateFaqCategory: async (req, res) => {
    const { name } = req.body;

    faqsService.updateFaqCategory(name, req).then(() => {
      res.sendStatus(200);
    });
  },

  deleteFaqCategory: async (req, res) => {
    faqsService
      .deleteFaqCategory(req)
      .then(response => {
        if (response.code == "EREQUEST") {
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      })
      .catch(response => {
        res.sendStatus(400);
      });
  }
};
