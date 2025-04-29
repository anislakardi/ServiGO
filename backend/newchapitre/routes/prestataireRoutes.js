const express = require('express');
const router = express.Router();
const prestataireController = require('../controllers/prestataireController');

router.post('/prestataires', prestataireController.createPrestataire);
router.get('/prestataires', prestataireController.getAllPrestataires);
router.get('/prestataires/:id', prestataireController.getPrestataireById);
router.put('/prestataires/:id', prestataireController.updatePrestataire);
router.put('/prestataires/desactiver/:id', prestataireController.desactiverPrestataire);
router.put('/prestataires/:id/suspendre', prestataireController.suspendrePrestataire);
router.put('/prestataires/:id/reactiver', prestataireController.reactiverPrestataire);
router.delete('/prestataires/:id', prestataireController.supprimerPrestataire);

module.exports = router;
