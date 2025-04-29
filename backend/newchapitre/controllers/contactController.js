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

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.getAllContacts();
    return res.status(200).json({ success: true, contacts });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Erreur lors de la récupération des contacts.' });
  }
};

const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const success = await Contact.deleteContact(id);
    
    if (success) {
      return res.status(200).json({ success: true, message: 'Contact supprimé avec succès.' });
    } else {
      return res.status(404).json({ success: false, error: 'Contact non trouvé.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Erreur lors de la suppression du contact.' });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  deleteContact
};
