const VerificationModel = require('../models/verificationModel');
const Prestataire = require('../models/prestataireModel');

exports.createVerification = async (req, res) => {
    try {
        const prestataire_id = req.body.prestataire_id;
        
        // Vérifier si le prestataire existe
        const prestataire = await Prestataire.findById(prestataire_id);
        if (!prestataire) {
            return res.status(404).json({ message: 'Prestataire non trouvé' });
        }

        // Vérifier si une vérification existe déjà
        const existingVerification = await VerificationModel.getVerification(prestataire_id);
        if (existingVerification) {
            return res.status(400).json({ message: 'Une vérification existe déjà pour ce prestataire' });
        }

        // Préparer les données de vérification
        const verificationData = {
            prestataire_id,
            identite_face_avant: req.files?.identite_face_avant?.[0]?.buffer,
            identite_face_arriere: req.files?.identite_face_arriere?.[0]?.buffer,
            cv_pdf: req.files?.cv_pdf?.[0]?.buffer,
            diplomes: req.files?.diplomes?.[0]?.buffer,
            annees_experience: req.body.annees_experience,
            description_experience: req.body.description_experience,
            preuves_experience: req.files?.preuves_experience?.[0]?.buffer
        };

        // Créer la vérification
        const verificationId = await VerificationModel.createVerification(verificationData);
        
        res.status(201).json({ 
            message: 'Vérification créée avec succès',
            id: verificationId 
        });
    } catch (error) {
        console.error('Erreur création vérification:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.uploadSingleFile = async (req, res) => {
  try {
      const prestataire_id = req.body.prestataire_id;
      const fieldName = Object.keys(req.files || req.body)[1]; // ex: identite_face_avant
      const fileBuffer = req.file.buffer;

      if (!prestataire_id || !fieldName || !fileBuffer) {
          return res.status(400).json({ message: 'Données incomplètes' });
      }

      await VerificationModel.updateFileField(prestataire_id, fieldName, fileBuffer);

      res.status(200).json({ message: `${fieldName} uploadé avec succès` });
  } catch (error) {
      console.error('Erreur upload fichier:', error);
      res.status(500).json({ message: error.message });
  }
};

exports.saveMetadata = async (req, res) => {
  try {
      const prestataire_id = req.params.prestataire_id;
      const { annees_experience, description_experience } = req.body;

      if (!prestataire_id || !annees_experience || !description_experience) {
          return res.status(400).json({ message: 'Données incomplètes' });
      }

      await VerificationModel.updateMetadata(prestataire_id, annees_experience, description_experience);

      res.status(200).json({ message: `Métadonnées sauvegardées avec succès` });
  } catch (error) {
      console.error('Erreur sauvegarde métadonnées:', error);
      res.status(500).json({ message: error.message });
  }
};


// Obtenir une vérification
exports.getVerification = async (req, res) => {
    try {
        const verification = await VerificationModel.getVerification(req.params.prestataire_id);
        if (!verification) {
            return res.status(404).json({ message: 'Vérification non trouvée' });
        }
        res.json(verification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une vérification
exports.updateVerification = async (req, res) => {
  try {
    const verification = await VerificationModel.getVerification(req.params.prestataire_id);
    if (!verification) {
      return res.status(404).json({ message: 'Vérification non trouvée' });
    }

    const updateData = {
      ...req.body,
      piece_identite: req.body.piece_identite ? JSON.stringify(req.body.piece_identite) : undefined,
      documents: req.body.documents ? JSON.stringify(req.body.documents) : undefined,
      experience: req.body.experience ? JSON.stringify(req.body.experience) : undefined
    };

    const success = await VerificationModel.updateVerification(req.params.prestataire_id, updateData);
    if (!success) {
      return res.status(400).json({ message: 'Échec de la mise à jour' });
    }

    res.json({ message: 'Vérification mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une vérification
exports.deleteVerification = async (req, res) => {
  try {
    const success = await VerificationModel.deleteVerification(req.params.prestataire_id);
    if (!success) {
      return res.status(404).json({ message: 'Vérification non trouvée' });
    }
    res.json({ message: 'Vérification supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vérifier le statut de vérification d'un prestataire
exports.checkVerificationStatus = async (req, res) => {
    try {
        const prestataire_id = req.params.prestataire_id;
        const verification = await VerificationModel.getVerification(prestataire_id);
        
        if (!verification) {
            return res.status(404).json({ 
                message: 'Vérification non trouvée',
                status: 'missing'
            });
        }

        // Vérifier si tous les statuts sont validés
        const isVerified = verification.statut_identite === 'validé' &&
                         verification.statut_cv_diplomes === 'validé' &&
                         verification.statut_experience === 'validé';

        res.json({
            status: isVerified ? 'validé' : 'en attente',
            message: isVerified 
                ? 'Vérification complète' 
                : 'En attente de vérification'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateVerificationStatus = async (req, res) => {
    try {
        const { prestataire_id, status } = req.body;
        const success = await VerificationModel.updateVerificationStatus(prestataire_id, status);
        
        if (!success) {
            return res.status(404).json({ message: 'Vérification non trouvée' });
        }

        res.json({ 
            message: 'Statut de vérification mis à jour',
            status 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

// Obtenir toutes les vérifications
exports.getAllVerifications = async (req, res) => {
    try {
        const verifications = await VerificationModel.getAllVerifications();
        res.status(200).json({
            success: true,
            data: verifications
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des vérifications:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des vérifications',
            error: error.message
        });
    }
}; 
