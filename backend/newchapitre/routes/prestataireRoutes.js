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
router.put('/prestataires/:id/status', prestataireController.updateStatus);
router.get('/prestataires/:id/status', prestataireController.getStatus);
router.get('/prestataires/:id/service-photos', prestataireController.getServicePhotos);
router.delete('/prestataires/:id/service-photo/:serviceNumber', prestataireController.deleteServicePhoto);

module.exports = router;
