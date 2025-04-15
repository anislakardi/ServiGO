const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/clients', clientController.createClient);
router.get('/clients', clientController.getAllClients);
router.get('/clients/:id', clientController.getClientById);
router.put('/clients/:id', clientController.updateClient);
router.delete('/clients/:id', clientController.supprimerClient);

module.exports = router;
