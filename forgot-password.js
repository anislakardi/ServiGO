document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const emailForm = document.getElementById('emailForm');
    const codeForm = document.getElementById('codeForm');
    const passwordForm = document.getElementById('passwordForm');
    const steps = document.querySelectorAll('.step');
    let currentStep = 1;
    let verificationCode = '';

    // Fonction pour afficher une notification personnalisée
    function showCustomAlert(title, message) {
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        
        const alert = document.createElement('div');
        alert.className = 'custom-alert';
        alert.innerHTML = `
            <h3>${title}</h3>
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()">OK</button>
        `;
        
        overlay.appendChild(alert);
        document.body.appendChild(overlay);
    }

    // Fonction pour générer un code de vérification
    function generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Fonction pour passer à l'étape suivante
    function goToStep(stepNumber) {
        steps.forEach(step => step.classList.remove('active'));
        steps[stepNumber - 1].classList.add('active');
        currentStep = stepNumber;
    }

    // Gestionnaire pour le formulaire d'email
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        // Ici, vous devriez envoyer une requête à votre backend
        // Pour l'exemple, nous simulons l'envoi d'un email
        verificationCode = generateVerificationCode();
        console.log('Code envoyé à ' + email + ': ' + verificationCode);
        
        // Afficher un message de succès
        showCustomAlert('Code envoyé', 'Un code de vérification a été envoyé à votre adresse email.');
        
        // Passer à l'étape suivante
        goToStep(2);
    });

    // Gestionnaire pour le formulaire de code
    codeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const enteredCode = document.getElementById('verificationCode').value;
        
        if (enteredCode === verificationCode) {
            // Passer à l'étape suivante
            goToStep(3);
        } else {
            showCustomAlert('Code incorrect', 'Le code saisi est incorrect. Veuillez réessayer.');
        }
    });

    // Gestionnaire pour le formulaire de mot de passe
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            showCustomAlert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }
        
        if (newPassword.length < 8) {
            showCustomAlert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }
        
        // Ici, vous devriez envoyer une requête à votre backend
        // Pour mettre à jour le mot de passe
        console.log('Nouveau mot de passe:', newPassword);
        
        // Afficher un message de succès
        showCustomAlert('Succès', 'Votre mot de passe a été réinitialisé avec succès.');
        
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });

    // Gestionnaire pour le bouton d'affichage/masquage du mot de passe
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
}); 