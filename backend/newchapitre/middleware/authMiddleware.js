const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Récupérer le token du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Token d\'authentification manquant' });
        }

        // Le format du header doit être "Bearer <token>"
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Format de token invalide' });
        }

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, 'votre_secret_key'); // Utiliser la même clé secrète que dans authController

        // Ajouter les informations de l'utilisateur à la requête
        req.user = {
            id: decoded.userId,
            role: decoded.role
        };

        next(); // Continuer vers le contrôleur
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
};

module.exports = authMiddleware; 