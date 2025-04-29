const express = require('express');
const router = express.Router();
const { createContact, getAllContacts, deleteContact } = require('../controllers/contactController');

// Route pour soumettre un message de contact
router.post('/contact', createContact);

// Route pour récupérer tous les contacts (admin)
router.get('/contacts', getAllContacts);

// Route pour supprimer un contact (admin)
router.delete('/contacts/:id', deleteContact);

module.exports = router;
