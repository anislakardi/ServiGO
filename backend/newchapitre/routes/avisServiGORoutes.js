const express = require('express');
const router = express.Router();
const AvisServiGOController = require('../controllers/AvisServiGOController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes publiques (pas besoin d'authentification)
router.get('/avisservigo', AvisServiGOController.getAllAvis);
router.get('/avisservigo/stats', AvisServiGOController.getStats);
router.get('/avisservigo/top', AvisServiGOController.getTopReviews);

// Routes protégées (nécessitent une authentification)
router.get('/avisservigo/user/:id', authMiddleware, AvisServiGOController.hasClientAlreadyRated);
router.post('/avisservigo', authMiddleware, AvisServiGOController.createAvis);
router.put('/avisservigo/:id', authMiddleware, AvisServiGOController.updateAvis);
router.delete('/avisservigo/:id', authMiddleware, AvisServiGOController.deleteAvis);

module.exports = router; 