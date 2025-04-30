const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB par fichier
    }
});
const verificationController = require('../controllers/verificationController');

// Route principale pour créer une vérification
router.post('/verification', upload.fields([
    { name: 'identite_face_avant', maxCount: 1 },
    { name: 'identite_face_arriere', maxCount: 1 },
    { name: 'cv_pdf', maxCount: 1 },
    { name: 'diplomes', maxCount: 1 },
    { name: 'preuves_experience', maxCount: 1 }
]), verificationController.createVerification);

// Route pour obtenir une vérification
router.get('/verification/:prestataire_id', verificationController.getVerification);

// Route pour vérifier le statut
router.get('/verification/status/:prestataire_id', verificationController.checkVerificationStatus);

// Route pour mettre à jour le statut (admin uniquement)
router.put('/verification/status', verificationController.updateVerificationStatus);

// Route pour obtenir toutes les vérifications
router.get('/verifications', verificationController.getAllVerifications);

module.exports = router; 