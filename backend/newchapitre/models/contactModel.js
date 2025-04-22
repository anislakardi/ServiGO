const pool = require('../config/database');

class Contact {
  static async createContact(name, email, message) {
    try {
      // Exécution de la requête pour insérer un contact dans la base de données
      const [result] = await pool.query(
        'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', 
        [name, email, message]
      );

      // Vérifie si l'insertion a réussi
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erreur lors de la création du contact:", error);
      throw error;
    }
  }
}

module.exports = Contact;
