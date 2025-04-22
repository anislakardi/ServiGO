const express = require('express');
const router = express.Router();
const { createContact } = require('../controllers/contactController');

// Route pour soumettre un message de contact
router.post('/contact', createContact);

module.exports = router;
