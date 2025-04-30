// Liste des wilayas d'Algérie
const wilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
    "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger",
    "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
    "Illizi", "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
    "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
    "Ghardaïa", "Relizane"
];

// Fonction pour initialiser la page
function initializePage() {
    // Remplir le select des wilayas
    const wilayaSelect = document.getElementById('wilaya');
    wilayas.forEach(wilaya => {
        const option = document.createElement('option');
        option.value = wilaya;
        option.textContent = wilaya;
        wilayaSelect.appendChild(option);
    });

    // Initialiser la carte
    initializeMap();
}

// Fonction pour ouvrir le modal d'ajout de tâche
function openAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    modal.style.display = 'block';
}

// Fonction pour fermer le modal d'ajout de tâche
function closeAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    modal.style.display = 'none';
}

// Fonction pour ajouter une nouvelle tâche
function addNewTask(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    
    if (!title || !priority || !dueDate) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const checklist = document.querySelector('.checklist');
    const newTask = document.createElement('div');
    newTask.className = 'checklist-item';
    newTask.innerHTML = `
        <input type="checkbox" id="task-${Date.now()}">
        <label for="task-${Date.now()}">
            <span class="task-title">${title}</span>
            <span class="task-priority ${priority.toLowerCase()}">${priority}</span>
            <span class="task-date">${formatDate(dueDate)}</span>
        </label>
    `;

    checklist.appendChild(newTask);
    closeAddTaskModal();
    document.getElementById('addTaskForm').reset();
}

// Fonction pour formater la date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Fonction pour initialiser la carte
function initializeMap() {
    // Code pour initialiser la carte avec Leaflet ou Google Maps
    // À implémenter selon la bibliothèque de cartes choisie
}

// Événements
document.addEventListener('DOMContentLoaded', initializePage);

// Fermer le modal si on clique en dehors
window.onclick = function(event) {
    const modal = document.getElementById('addTaskModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
} 