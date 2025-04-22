const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/messages", messageController.create);
router.get("/message/:message_id", messageController.getById);
router.get("/messages/:conversation_id", messageController.getByConversation);
router.patch("/messages/:id", messageController.markAsRead);
router.delete("/messages/:id", messageController.delete);

module.exports = router;
