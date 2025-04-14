// Données de test (à remplacer par vos appels API)
const testData = {
    stats: {
        totalClients: 150,
        totalProviders: 45,
        totalServices: 320,
        ongoingServices: 28
    },
    validationRequests: [
        {
            id: 1,
            nom: "Dupont",
            prenom: "Jean",
            email: "jean.dupont@example.com",
            date_nee: "1990-05-15",
            adresse: "123 Rue des Lilas, Paris",
            specialisation: "Mécanique automobile",
            date_demande: "2024-03-20",
            documents: [
                {
                    type: "Pièce d'identité",
                    url: "https://consulat-montpellier-algerie.fr/wp-content/uploads/2022/04/cnib.jpg",
                    description: "Carte nationale d'identité"
                },
                {
                    type: "Diplôme",
                    url: "https://www.mon-diplome.fr/Diplome/700-964698-Diplome-mecanique-automobile.jpg",
                    description: "Diplôme de mécanique automobile"
                },
                {
                    type: "Diplôme",
                    url: "https://www.ecam.fr/wp-content/uploads/2016/06/Exemple-fichier-PDF-1.pdf",
                    description: "Diplôme de mécanique anis"
                }
            ]
        },
        // Ajoutez plus de demandes de test ici
    ]
};

// Mise à jour des statistiques
function updateStats() {
    document.getElementById('total-clients').textContent = testData.stats.totalClients;
    document.getElementById('total-providers').textContent = testData.stats.totalProviders;
    document.getElementById('total-services').textContent = testData.stats.totalServices;
    document.getElementById('ongoing-services').textContent = testData.stats.ongoingServices;
}

// Création des cartes de demande
function createRequestCard(request) {
    const card = document.createElement('div');
    card.className = 'request-card';
    card.innerHTML = `
        <div class="request-info">
            <h3>${request.nom} ${request.prenom}</h3>
            <p>Email: ${request.email}</p>
            <p>Spécialisation: ${request.specialisation}</p>
            <p>Date de demande: ${new Date(request.date_demande).toLocaleDateString()}</p>
        </div>
        <div class="request-actions">
            <button class="action-btn details-btn" onclick="showRequestDetails(${request.id})">
                En savoir plus
            </button>
        </div>
    `;
    return card;
}

// Photo Zoom Modal
const photoZoomModal = document.createElement('div');
photoZoomModal.className = 'photo-zoom-modal';
photoZoomModal.innerHTML = `
    <div class="photo-zoom-content">
        <span class="photo-zoom-close">&times;</span>
        <img src="" alt="Zoomed document" class="zoomed-photo">
    </div>
`;
document.body.appendChild(photoZoomModal);

// Function to show zoomed photo
function showZoomedPhoto(photoUrl) {
    const zoomedPhoto = photoZoomModal.querySelector('.zoomed-photo');
    zoomedPhoto.src = photoUrl;
    photoZoomModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Function to close zoomed photo
function closeZoomedPhoto() {
    photoZoomModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event listeners for photo zoom
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('document-preview')) {
        showZoomedPhoto(e.target.src);
    }
});

photoZoomModal.querySelector('.photo-zoom-close').addEventListener('click', closeZoomedPhoto);
photoZoomModal.addEventListener('click', (e) => {
    if (e.target === photoZoomModal) {
        closeZoomedPhoto();
    }
});

// Affichage des détails de la demande
function showRequestDetails(requestId) {
    const request = testData.validationRequests.find(req => req.id === requestId);
    if (!request) return;

    const modal = document.getElementById('request-modal');
    if (!modal) {
        console.error('Modal not found');
        return;
    }

    const modalContent = modal.querySelector('.modal-content');
    if (!modalContent) {
        console.error('Modal content not found');
        return;
    }

    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>Détails de la demande</h2>
        <div class="modal-body">
            <div class="request-details">
                <div class="personal-info">
                    <h3>Informations personnelles</h3>
                    <p><strong>Nom:</strong> ${request.nom}</p>
                    <p><strong>Prénom:</strong> ${request.prenom}</p>
                    <p><strong>Email:</strong> ${request.email}</p>
                    <p><strong>Date de naissance:</strong> ${new Date(request.date_nee).toLocaleDateString()}</p>
                    <p><strong>Adresse:</strong> ${request.adresse}</p>
                    <p><strong>Spécialisation:</strong> ${request.specialisation}</p>
                    <p><strong>Date de demande:</strong> ${new Date(request.date_demande).toLocaleDateString()}</p>
                </div>
                <div class="documents">
                    <h3>Documents</h3>
                    <div class="documents-grid">
                        ${request.documents.map(doc => {
                            const isPDF = doc.url.toLowerCase().endsWith('.pdf');
                            return `
                                <div class="document-item">
                                    <h4>${doc.type}</h4>
                                    ${isPDF ? `
                                        <div class="pdf-preview">
                                            <iframe src="${doc.url}" class="pdf-iframe"></iframe>
                                            <div class="pdf-actions">
                                                <a href="${doc.url}" target="_blank" class="btn download-btn">
                                                    <i class="fas fa-download"></i> Télécharger
                                                </a>
                                                <button class="btn view-btn" onclick="openPDFInNewTab('${doc.url}')">
                                                    <i class="fas fa-external-link-alt"></i> Ouvrir
                                                </button>
                                            </div>
                                        </div>
                                    ` : `
                                        <img src="${doc.url}" alt="${doc.type}" class="document-preview">
                                    `}
                                    <p>${doc.description}</p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn reject" onclick="handleValidation('reject', ${requestId})">Refuser</button>
                <button class="btn accept" onclick="handleValidation('accept', ${requestId})">Accepter</button>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Ajouter l'événement de fermeture
    const closeBtn = modalContent.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }
}

// Fonction pour ouvrir le PDF dans un nouvel onglet
function openPDFInNewTab(pdfUrl) {
    window.open(pdfUrl, '_blank');
}

// Gérer la validation d'une demande
function handleValidation(status, requestId) {
    console.log(`Validation de la demande ${requestId}: ${status}`);
    const modal = document.getElementById('request-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    
    // Mettre à jour les statistiques
    updateStats();

    // Afficher les demandes de validation
    const requestsContainer = document.getElementById('requests-container');
    if (requestsContainer) {
        console.log('Requests container found');
        testData.validationRequests.forEach(request => {
            const card = createRequestCard(request);
            requestsContainer.appendChild(card);
        });
    } else {
        console.error('Requests container not found');
    }

    // Gérer la fermeture du modal en cliquant en dehors
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('request-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}); 