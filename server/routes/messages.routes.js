const MessagesController = require("../controllers/messages.controller");
const router = require("express").Router();

module.exports = router;

router.get("/:id", MessagesController.getMessageByUserId);

router.get("/", MessagesController.getConvosByUserId);

router.post("/", MessagesController.postMessage);
