const pool = require('../config/database');

class Prestataire {
    static async create({ nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, specialisation, experience }) {
        const [result] = await pool.query(
            `INSERT INTO prestataires (nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, specialisation, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, specialisation, experience]
        );
        return result.insertId;
    }

    static async findAll() {
      const [rows] = await pool.query(`SELECT * FROM prestataires`);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(`SELECT * FROM prestataires WHERE id = ?`, [id]);
        return rows[0];
    }

    static async update(id, data) {
        const { nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, specialisation, experience } = data;
        const [result] = await pool.query(
            `UPDATE prestataires SET nom_utilisateur = ?, nom = ?, prenom = ?, date_nee = ?, adresse = ?, email = ?, mot_de_passe = ?, specialisation = ?, experience = ? WHERE id = ?`,
            [nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, id, specialisation, experience]
        );
        return result.affectedRows;
    }

    static async suspend(id, dateSuspension) {
            const [result] = await pool.query(`UPDATE prestataires SET suspendu_jusqu = ? WHERE id = ?`, [dateSuspension, id]);
            return result.affectedRows;
        }
    
    static async activate(id) {
        const [result] = await pool.query(`UPDATE prestataires SET suspendu_jusqu = NULL WHERE id = ?`, [id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.query(`DELETE FROM prestataires WHERE id = ?`, [id]);
        return result.affectedRows;
    }

    static async updateStatus(id, status) {
        const [result] = await pool.query(
            "UPDATE prestataires SET statuts = ? WHERE id = ?",
            [status, id]
        );
        return result.affectedRows;
    }
    
    static async updateStatus(id, status) {
        const [result] = await pool.query(
            "UPDATE prestataires SET disponibilite = ? WHERE id = ?",
            [status, id]
        );
        return result.affectedRows;
    }

    static async getStatus(id) {
        const [rows] = await pool.query(
            "SELECT disponibilite FROM prestataires WHERE id = ?",
            [id]
        );
        return rows[0]?.disponibilite || 'Disponible';
    }

    static async postServicePhoto(id, serviceNumber, photo, mediaType) {
        const query = `
            UPDATE prestataires 
            SET service${serviceNumber}_photo = ?,
                media_type${serviceNumber} = ?
            WHERE id = ?
        `;
        
        const [result] = await pool.query(query, [photo, mediaType, id]);
        return result;
    }

    // Nouvelles méthodes pour la gestion des photos de services
    static async updateServicePhoto(id, serviceNumber, photo, mediaType) {
        try {
            const [result] = await pool.query(
                `UPDATE prestataires 
                 SET service${serviceNumber}_photo = ?,
                     media_type${serviceNumber} = ?
                 WHERE id = ?`,
                [photo, mediaType, id]
            );
            return result.affectedRows;
        } catch (error) {
            console.error("Erreur dans updateServicePhoto:", error);
            throw error;
        }
    }
    

    static async getServicePhotos(id) {
        const [rows] = await pool.query(
            `SELECT 
                service1_photo, media_type1,
                service2_photo, media_type2,
                service3_photo, media_type3
             FROM prestataires 
             WHERE id = ?`,
            [id]
        );
        
        if (rows.length === 0) return null;

        const row = rows[0];
        return {
            service1: { photo: row.service1_photo, mediaType: row.media_type1 },
            service2: { photo: row.service2_photo, mediaType: row.media_type2 },
            service3: { photo: row.service3_photo, mediaType: row.media_type3 },
        };
    }

    static async deleteServicePhoto(id, serviceNumber) {
        const query = `
            UPDATE prestataires 
            SET service${serviceNumber}_photo = NULL,
                media_type${serviceNumber} = NULL
            WHERE id = ?
        `;
        
        const [result] = await pool.query(query, [id]);
        return result;
    }

}

module.exports = Prestataire;
