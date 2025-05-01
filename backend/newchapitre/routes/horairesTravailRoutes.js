const express = require('express');
const router = express.Router();
const horairesTravailController = require("../controllers/horairesTravailController");

// Routes protégées par l'authentification
router.get('/horaire/:prestataireId', horairesTravailController.getHoraires);
router.put('/horaire/:prestataireId', horairesTravailController.updateHoraires);
router.post('/horaire/:prestataireId', horairesTravailController.createHoraires);

module.exports = router;