const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const pool = require('./config/database');

const clientRoutes = require('./routes/clientRoutes');
const prestataireRoutes = require('./routes/prestataireRoutes');
const adminRoutes = require('./routes/adminRoutes');
const avisRoutes = require('./routes/avisRoutes');
const avisServiGORoutes = require('./routes/avisServiGORoutes');
const demandeRoutes = require('./routes/demandeRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../../')));
app.use('/views', express.static(path.join(__dirname, '../../views')));
app.use('/style', express.static(path.join(__dirname, '../../style')));

// Routes API
app.use('/api', clientRoutes);
app.use('/api', prestataireRoutes);
app.use('/api', adminRoutes);
app.use('/api', avisRoutes);
app.use('/api', avisServiGORoutes);
app.use('/api', publicationRoutes);
app.use('/api', demandeRoutes);
app.use('/api', conversationRoutes);
app.use('/api', messageRoutes);
app.use('/api', serviceRoutes);
app.use('/api/auth', authRoutes);

// Log des routes disponibles
console.log('Routes disponibles:');
console.log('- /api/conversation/client/:client_id/publications');
console.log('- /api/messages/:conversation_id');
console.log('- /api/messages (POST)');

// Routes pour les pages HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/login.html'));
});

app.get('/homeClient', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/homeClient.html'));
});

// Route pour gérer les requêtes avec l'extension .html
app.get('/homeClient.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/homeClient.html'));
});

app.get('/homePrestataire', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/homePrestataire.html'));
});

app.get('/offreurs', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/offreurs.html'));
});

// Vérification de la connexion à la base de données
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
    connection.release();
});

// Initialisation de la base de données et démarrage du serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
