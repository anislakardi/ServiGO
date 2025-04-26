const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // ou true selon le serveur
  auth: {
    user: '', // <-- ici tu dois mettre ton adresse email
    pass: ''  // <-- ici ton mot de passe d'application
  }
});


exports.sendResetCode = (email, code) => {
  return transporter.sendMail({
    from: 'anis.lkrd@gmail.com',
    to: email,
    subject: 'Code de réinitialisation ServiGO',
    text: `Votre code de vérification est : ${code}\nCe code est valable 15 minutes.`
  });
};
