// Variables globales
let currentStep = 1;
const totalSteps = 7;
let completedSteps = 0;
const progressBar = document.getElementById('progress-bar');
const progressText = document.querySelector('.progress-text');
const submitButton = document.getElementById('submit-verification');
const prevButton = document.getElementById('prev-step');
const nextButton = document.getElementById('next-step');

// Fonction pour mettre à jour la barre de progression
function updateProgress() {
    const percentage = Math.round((completedSteps / totalSteps) * 100);
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% complété`;
    
    // Activer le bouton de soumission si toutes les étapes sont complétées
    submitButton.disabled = completedSteps !== totalSteps;
}

// Fonction pour afficher/masquer les étapes
function showStep(stepNumber) {
    document.querySelectorAll('.step-card').forEach(card => {
        const cardStep = parseInt(card.dataset.step);
        if (cardStep === stepNumber) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Mettre à jour les boutons de navigation
    prevButton.disabled = stepNumber === 1;
    nextButton.disabled = stepNumber === totalSteps;
}

// Fonction pour passer à l'étape suivante
function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
    }
}

// Fonction pour revenir à l'étape précédente
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// Fonction pour gérer le téléchargement de fichiers
function setupFileUpload(uploadZoneId) {
    const uploadZone = document.getElementById(uploadZoneId);
    const fileInput = uploadZone.querySelector('input[type="file"]');
    const deleteButton = uploadZone.querySelector('.btn-delete');
    const validateButton = uploadZone.closest('.step-card').querySelector('.btn-validate');

    uploadZone.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-delete')) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            
            // Afficher un aperçu si c'est une image
            if (fileInput.accept.includes('image')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadZone.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 150px;">
                        <span>${file.name}</span>
                        <button class="btn-delete">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    setupFileUpload(uploadZoneId); // Réinitialiser les événements
                };
                reader.readAsDataURL(file);
            } else {
                uploadZone.innerHTML = `
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                    <button class="btn-delete">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                setupFileUpload(uploadZoneId); // Réinitialiser les événements
            }
            
            // Activer le bouton de validation
            validateButton.disabled = false;
        }
    });

    // Gérer la suppression du fichier
    if (deleteButton) {
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            uploadZone.innerHTML = `
                <input type="file" accept="${fileInput.accept}" style="display: none;">
                <i class="fas fa-${fileInput.accept.includes('image') ? 'camera' : 'file'}"></i>
                <span>${fileInput.accept.includes('image') ? 'Ajouter une image' : 'Ajouter un fichier'}</span>
                <button class="btn-delete" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            setupFileUpload(uploadZoneId); // Réinitialiser les événements
            validateButton.disabled = true;
        });
    }
}

// Fonction pour valider une étape
function validateStep(stepId) {
    const stepCard = document.getElementById(stepId);
    const statusBadge = stepCard.querySelector('.status-badge');
    
    // Mettre à jour le statut
    statusBadge.classList.remove('pending', 'missing');
    statusBadge.classList.add('validated');
    statusBadge.textContent = 'Validé';
    
    // Incrémenter le compteur d'étapes complétées
    completedSteps++;
    updateProgress();
    
    // Afficher la modale de confirmation
    showVerificationModal();
    
    // Passer à l'étape suivante
    nextStep();
}

// Fonction pour afficher la modale de vérification
function showVerificationModal() {
    const modal = document.getElementById('verification-modal');
    modal.style.display = 'flex';
    
    // Fermer la modale après 2 secondes
    setTimeout(() => {
        modal.style.display = 'none';
    }, 2000);
}

// Fonction pour gérer la vérification du téléphone/email
function setupVerification(verifyButtonId, inputId) {
    const verifyButton = document.querySelector(`#${verifyButtonId} .btn-verify`);
    const input = document.querySelector(`#${verifyButtonId} input`);
    
    verifyButton.addEventListener('click', () => {
        // Simuler l'envoi du code de vérification
        verifyButton.textContent = 'Code envoyé';
        verifyButton.disabled = true;
        
        // Simuler la vérification après 2 secondes
        setTimeout(() => {
            verifyButton.textContent = 'Vérifié';
            verifyButton.style.backgroundColor = '#4CAF50';
            validateStep(verifyButtonId);
        }, 2000);
    });
}

// Fonction pour sauvegarder la progression
function saveProgress() {
    // Simuler la sauvegarde
    const saveButton = document.getElementById('save-progress');
    saveButton.textContent = 'Progression sauvegardée';
    saveButton.disabled = true;
    
    setTimeout(() => {
        saveButton.textContent = 'Sauvegarder la progression';
        saveButton.disabled = false;
    }, 2000);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Afficher la première étape
    showStep(1);

    // Configurer les boutons de navigation
    prevButton.addEventListener('click', prevStep);
    nextButton.addEventListener('click', nextStep);

    // Configurer les zones de téléchargement
    setupFileUpload('id-front');
    setupFileUpload('id-back');
    setupFileUpload('cv-upload');
    setupFileUpload('diploma-upload');
    setupFileUpload('profile-photo-upload');
    
    // Configurer la vérification du téléphone et email
    setupVerification('contact', 'phone');
    setupVerification('contact', 'email');
    
    // Configurer les boutons de validation
    document.querySelectorAll('.btn-validate').forEach(button => {
        button.addEventListener('click', () => {
            const stepCard = button.closest('.step-card');
            validateStep(stepCard.id);
        });
    });
    
    // Configurer le bouton de sauvegarde
    document.getElementById('save-progress').addEventListener('click', saveProgress);
    
    // Configurer le bouton de fermeture de la modale
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('verification-modal').style.display = 'none';
    });
    
    // Configurer la validation de l'expérience
    const experienceForm = document.querySelector('.experience-form');
    experienceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        validateStep('experience');
    });
    
    // Configurer la validation de la zone d'intervention
    const zoneSelector = document.querySelector('.zone-selector select');
    zoneSelector.addEventListener('change', () => {
        if (zoneSelector.value) {
            validateStep('intervention-zone');
        }
    });
    
    // Configurer la validation de la charte de qualité
    const charterCheckbox = document.getElementById('accept-charter');
    charterCheckbox.addEventListener('change', () => {
        if (charterCheckbox.checked) {
            validateStep('quality-charter');
        }
    });
}); 