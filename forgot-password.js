document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const emailForm    = document.getElementById('emailForm');
    const codeForm     = document.getElementById('codeForm');
    const passwordForm = document.getElementById('passwordForm');
    const steps        = document.querySelectorAll('.step');
  
    // Réutilisable : passer à l'étape N
    function goToStep(stepNumber) {
      steps.forEach(step => step.classList.remove('active'));
      steps[stepNumber - 1].classList.add('active');
    }
  
    // Afficher une alerte
    function showCustomAlert(title, message) {
      console.log(`Alert: ${title} - ${message}`);
      const overlay = document.createElement('div');
      overlay.className = 'custom-alert-overlay';
      overlay.innerHTML = `
        <div class="custom-alert">
          <h3>${title}</h3>
          <p>${message}</p>
          <button id="alert-ok">OK</button>
        </div>
      `;
      document.body.appendChild(overlay);
      document.getElementById('alert-ok').addEventListener('click', () => overlay.remove());
    }
  
    // 1) ENVOI DU CODE
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = emailForm.email.value;
      console.log(`Sending reset code to: ${email}`);
      
      // Correcting API path - adding base URL check
      const apiUrl = 'http://localhost:5001/api/auth/forgot/send';
      console.log(`Calling API: ${apiUrl}`);
      
      fetch(apiUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email })
      })
      .then(r => {
        console.log(`Response status: ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log('API response:', data);
        if (data.success) {
          showCustomAlert('Code envoyé', 'Vérifiez votre boîte mail.');
          goToStep(2);
        } else {
          showCustomAlert('Erreur', data.message || 'Échec de l\'envoi du code.');
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
        showCustomAlert('Erreur', 'Impossible de contacter le serveur.');
      });
    });
  
    // 2) VÉRIFICATION DU CODE
    codeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = emailForm.email.value;
      const code  = codeForm.verificationCode.value;
      console.log(`Verifying code: ${code} for email: ${email}`);
      
      // Correcting API path
      const apiUrl = '/api/auth/forgot/verify';
      console.log(`Calling API: ${apiUrl}`);
      
      fetch(apiUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, code })
      })
      .then(r => {
        console.log(`Response status: ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log('API response:', data);
        if (data.success) {
          goToStep(3);
        } else {
          showCustomAlert('Code incorrect', 'Le code saisi est invalide ou expiré.');
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
        showCustomAlert('Erreur', 'Impossible de contacter le serveur.');
      });
    });
  
    // 3) RÉINITIALISATION DU MOT DE PASSE
    passwordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email       = emailForm.email.value;
      const code        = codeForm.verificationCode.value;
      const newPassword = passwordForm.newPassword.value;
      const confirmPass = passwordForm.confirmPassword.value;
  
      if (newPassword !== confirmPass) {
        return showCustomAlert('Erreur', 'Les mots de passe ne correspondent pas.');
      }
      if (newPassword.length < 8) {
        return showCustomAlert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères.');
      }
      
      console.log(`Resetting password for email: ${email}`);
      
      // Correcting API path
      const apiUrl = '/api/auth/forgot/reset';
      console.log(`Calling API: ${apiUrl}`);
      
      fetch(apiUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, code, newPassword })
      })
      .then(r => {
        console.log(`Response status: ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log('API response:', data);
        if (data.success) {
          showCustomAlert('Succès', 'Mot de passe réinitialisé avec succès.');
          setTimeout(() => window.location.href = 'login.html', 2000);
        } else {
          showCustomAlert('Erreur', data.message || 'Échec de la réinitialisation.');
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
        showCustomAlert('Erreur', 'Impossible de contacter le serveur.');
      });
    });
  
    // Toggle œil mot de passe
    document.querySelectorAll('.toggle-password').forEach(button => {
      button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type  = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
      });
    });
  });
  