const express = require("express");
const router = express.Router();
const ConversationController = require("../controllers/conversationController");

router.post("/conversation/create", ConversationController.create);
router.put("/conversation/titre/:id", ConversationController.updateTitle);
router.get("/conversation/client/:client_id", ConversationController.getByClient);
router.get("/conversation/prestataire/:prestataire_id", ConversationController.getByPrestataire);
router.get("/conversation/:id", ConversationController.getById);
router.delete("/conversation/:id", ConversationController.delete);

module.exports = router;
