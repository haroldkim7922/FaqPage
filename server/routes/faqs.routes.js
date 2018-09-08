const FaqsController = require("../controllers/faqs.controller");
const router = require("express").Router();

module.exports = router;

router.get("/", FaqsController.getAll);

router.get("/:id", FaqsController.getFaqByCategory);

router.post("/", FaqsController.postFaq);

router.put("/:id", FaqsController.updateFaq);

router.delete("/:id", FaqsController.deleteFaq);

router.get("/search/:pageIndex/:pageSize", FaqsController.getFaqBySearch);
