const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost', // Si tu es sur XAMPP ou WAMP, c'est localhost
    user: 'root', // Par défaut, c'est "root" sur phpMyAdmin
    password: '', // En général, pas de mot de passe sur XAMPP/WAMP
    database: 'newchapitrebdd', // Mets le nom exact de ta base de données
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool.promise(); // Permet d'utiliser async/await pour les requêtes SQL
