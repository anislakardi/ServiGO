const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/clients', clientController.createClient);
router.get('/clients', clientController.getAllClients);
router.get('/clients/:id', clientController.getClientById);
router.put('/clients/:id', clientController.updateClient);
router.put('/clients/:id/profile-picture', clientController.updateProfilePicture);
router.put('/clients/:id/suspendre', clientController.suspendreClient);
router.put('/clients/:id/reactiver', clientController.reactiverClient);
router.delete('/clients/:id', clientController.supprimerClient);

module.exports = router;
