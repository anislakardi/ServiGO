const Contact = require('../models/contactModel');

const createContact = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Appel à la méthode de modèle pour insérer un contact
    const success = await Contact.createContact(name, email, message);

    if (success) {
      return res.status(200).json({ success: true, message: 'Votre message a été envoyé avec succès.' });
    } else {
      return res.status(500).json({ success: false, error: 'Impossible d\'envoyer le message. Essayez encore.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Une erreur s\'est produite lors de l\'envoi.' });
  }
};

module.exports = {
  createContact
};
