const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const emailService = require('../services/emailService');
const resetStore = {};
// Fonction pour générer un token JWT
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        'votre_secret_key', // À remplacer par une clé secrète sécurisée
        { expiresIn: '24h' }
    );
};




exports.sendResetCode = async (req, res) => {
    const { email } = req.body;
    console.log('Received request to send reset code to:', email);
    
    if (!email) {
      console.log('Email field missing in request');
      return res.status(400).json({ success: false, message: 'Email requis' });
    }
  
    const code = Math.floor(100000 + Math.random()*900000).toString();
    const expiresAt = Date.now() + 15*60*1000; // 15 minutes
  
    resetStore[email] = { code, expiresAt };
    console.log(`Generated code for ${email}: ${code}, expires at: ${new Date(expiresAt)}`);
  
    try {
      console.log('Attempting to send email...');
      await emailService.sendResetCode(email, code);
      console.log('Email sent successfully');
      res.json({ success: true });
    } catch (err) {
      console.error('Error sending email:', err);
      res.status(500).json({ success: false, message: 'Échec envoi email' });
    }
  };
  
  exports.verifyResetCode = (req, res) => {
    const { email, code } = req.body;
    console.log(`Verifying code for ${email}: input=${code}`);
    
    const record = resetStore[email];
    console.log('Stored record:', record);
    
    if (record && record.code === code && record.expiresAt > Date.now()) {
      console.log('Code verification successful');
      return res.json({ success: true });
    }
    console.log('Code verification failed');
    res.json({ success: false });
  };
  
  exports.resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    console.log(`Resetting password for ${email} with code: ${code}`);
    
    const record = resetStore[email];
    console.log('Stored record:', record);
    
    if (!record || record.code !== code || record.expiresAt <= Date.now()) {
      console.log('Invalid or expired code');
      return res.status(400).json({ success: false, message: 'Code invalide ou expiré' });
    }
  
    try {
      // hash du nouveau mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
    
      // déterminer si client ou prestataire
      console.log('Checking user type...');
      const [clients] = await pool.query('SELECT id FROM clients WHERE email = ?', [email]);
      
      if (clients.length > 0) {
        console.log('Updating client password');
        await pool.query('UPDATE clients SET mot_de_passe = ? WHERE email = ?', [hashed, email]);
      } else {
        console.log('Updating prestataire password');
        await pool.query('UPDATE prestataires SET mot_de_passe = ? WHERE email = ?', [hashed, email]);
      }
    
      // nettoyer le store
      console.log('Clearing reset record from store');
      delete resetStore[email];
    
      res.json({ success: true });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation du mot de passe' });
    }
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

        // Chercher l'utilisateur dans les trois tables séparément
        const [clients] = await pool.query('SELECT * FROM clients WHERE email = ?', [email]);
        const [prestataires] = await pool.query('SELECT * FROM prestataires WHERE email = ?', [email]);
        const [admins] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);

        let user = null;
        let userRole = null;

        // Déterminer quel type d'utilisateur
        if (clients.length > 0) {
            user = clients[0];
            userRole = 'client';
        } else if (prestataires.length > 0) {
            user = prestataires[0];
            userRole = 'prestataire';
        } else if (admins.length > 0) {
            user = admins[0];
            userRole = 'admin';
        }
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Si le rôle est admin, extraire le mot de passe et le PIN
        if (userRole === 'admin') {
            const { password, pin } = extractWithFixedPositions(mot_de_passe);

            // Vérifier le mot de passe de l'admin
            const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);

            if (!isPasswordValid || String(user.pin) !== pin) {
                return res.status(401).json({ message: 'Mot de passe ou PIN incorrect pour l\'admin' });
            }
        } else {
            // Vérification du mot de passe pour les clients et prestataires
            const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Mot de passe incorrect' });
            }

            // Si prestataire suspendu
                const now = new Date();
                if (user.suspendu_jusqu && new Date(user.suspendu_jusqu) > now) {
                    const diffTime = new Date(user.suspendu_jusqu) - now;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return res.status(403).json({
                        message: `Votre compte est suspendu. Il reste ${diffDays} jour(s) avant la réactivation.`
                    });
                }
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

// Fonction pour extraire mot de passe et PIN de l'input
function extractWithFixedPositions(input) {
    let pin = '';
    let password = '';
  
    // Extraction des 6 premiers chiffres à partir des positions impaires
    for (let i = 0; i < 12; i++) { // on traite les 12 premiers caractères
      if (i % 2 === 1) { // positions impaires pour le PIN
        pin += input[i];
      }else if (i % 2 === 0) { // positions paires pour le mot de passe
        password += input[i];
      }
    }
  
    // Extraction du mot de passe (tout le reste après les 12 premiers caractères)
    password += input.slice(12); // Reste de l'input après les 12 premiers caractères
  
    return { password, pin };
  }