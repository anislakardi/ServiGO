const pool = require("../config/database");

class VerificationModel {
  static async createVerification(verificationData) {
      try {
          const data = {
              prestataire_id: verificationData.prestataire_id,
              identite_face_avant: verificationData.identite_face_avant,
              identite_face_arriere: verificationData.identite_face_arriere,
              cv_pdf: verificationData.cv_pdf,
              diplomes: verificationData.diplomes,
              annees_experience: verificationData.annees_experience,
              description_experience: verificationData.description_experience,
              preuves_experience: verificationData.preuves_experience,
              statut_identite: 'en attente',
              statut_cv_diplomes: 'en attente',
              statut_experience: 'en attente',
                statut_global: 'en attente',
              date_creation: new Date()
          };

          const [result] = await pool.query(
              "INSERT INTO verifications SET ?",
              [data]
          );

          return result.insertId;
        } catch (error) {
            console.error('Erreur création vérification:', error);
            throw error;
        }
    }

    static async getVerification(prestataire_id) {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM verifications WHERE prestataire_id = ?",
                [prestataire_id]
            );
            return rows[0];
      } catch (error) {
          throw error;
      }
  }

  static async updateFileField(prestataire_id, fieldName, fileBuffer) {
    try {
        const sql = `UPDATE verifications SET ?? = ? WHERE prestataire_id = ?`;
        const [result] = await pool.query(sql, [fieldName, fileBuffer, prestataire_id]);
        return result;
    } catch (error) {
        throw error;
    }
}

static async updateMetadata(prestataire_id, annees_experience, description_experience) {
    try {
        const sql = `UPDATE verifications SET annees_experience = ?, description_experience = ? WHERE prestataire_id = ?`;
        const [result] = await pool.query(sql, [annees_experience, description_experience, prestataire_id]);
        return result;
        } catch (error) {
            throw error;
        }
    }

    static async updateVerification(prestataire_id, updateData) {
        try {
            const [result] = await pool.query(
                "UPDATE verifications SET ? WHERE prestataire_id = ?",
                [updateData, prestataire_id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async deleteVerification(prestataire_id) {
        try {
            const [result] = await pool.query(
                "DELETE FROM verifications WHERE prestataire_id = ?",
                [prestataire_id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async checkVerificationStatus(prestataire_id) {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM verifications WHERE prestataire_id = ?",
                [prestataire_id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async updateVerificationStatus(prestataire_id, status) {
        try {
            const [result] = await pool.query(
                "UPDATE verifications SET statut_global = ? WHERE prestataire_id = ?",
                [status, prestataire_id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getAllVerifications() {
        try {
            const [rows] = await pool.query(
                "SELECT v.*, p.nom, p.prenom, p.email, p.telephone " +
                "FROM verifications v " +
                "JOIN prestataires p ON v.prestataire_id = p.id " +
                "ORDER BY v.date_creation DESC"
            );
            return rows;
        } catch (error) {
            console.error('Erreur lors de la récupération des vérifications:', error);
            throw error;
        }
    }
}

module.exports = VerificationModel; 