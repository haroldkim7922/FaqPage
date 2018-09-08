const FaqsCategoriesController = require("../controllers/faqsCategories.controller");
const router = require("express").Router();

module.exports = router;

router.get("/", FaqsCategoriesController.getAll);

router.post("/", FaqsCategoriesController.postFaqCategory);

router.put("/:id", FaqsCategoriesController.updateFaqCategory);

router.delete("/:id", FaqsCategoriesController.deleteFaqCategory);
