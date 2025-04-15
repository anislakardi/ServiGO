const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Fonction pour générer un token JWT
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        'votre_secret_key', // À remplacer par une clé secrète sécurisée
        { expiresIn: '24h' }
    );
};

exports.register = async (req, res) => {
    try {
        const { nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, role, specialisation, experience } = req.body;

        // Vérifier si l'email existe déjà dans la table appropriée
        let checkEmailQuery;
        if (role === 'client') {
            checkEmailQuery = 'SELECT * FROM clients WHERE email = ?';
        } else {
            checkEmailQuery = 'SELECT * FROM prestataires WHERE email = ?';
        }

        const [existingUser] = await pool.query(checkEmailQuery, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

        // Insérer l'utilisateur dans la table appropriée
        if (role === 'client') {
            await pool.query(
                `INSERT INTO clients (nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [nom_utilisateur, nom, prenom, date_nee, adresse, email, hashedPassword]
            );
        } else if (role === 'prestataire') {
            await pool.query(
                `INSERT INTO prestataires (nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, specialisation, experience) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [nom_utilisateur, nom, prenom, date_nee, adresse, email, hashedPassword, specialisation, experience]
            );
        }

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        // Chercher l'utilisateur dans les deux tables séparément
        const [clients] = await pool.query('SELECT * FROM clients WHERE email = ?', [email]);
        const [prestataires] = await pool.query('SELECT * FROM prestataires WHERE email = ?', [email]);

        let user = null;
        let userRole = null;

        if (clients.length > 0) {
            user = clients[0];
            userRole = 'client';
        } else if (prestataires.length > 0) {
            user = prestataires[0];
            userRole = 'prestataire';
        }

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Générer le token
        const token = generateToken(user.id, userRole);

        // Retourner les informations de l'utilisateur et le token
        res.status(200).json({
            token,
            role: userRole,
            user: {
                id: user.id,
                nom_utilisateur: user.nom_utilisateur,
                email: user.email,
                role: userRole,
                specialisation: user.specialisation,
                experience: user.experience
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la connexion', error });
    }
}; 