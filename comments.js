document.addEventListener('DOMContentLoaded', () => {
  const modal    = document.getElementById('commentModal');
const closeBtn = modal.querySelector('.close-btn');       // <- ajouté
  const commentsList  = document.getElementById('commentsList');
  const input         = document.getElementById('newCommentInput');
  const submitBtn     = document.getElementById('submitCommentBtn');

  function openCommentsModal(publicationId) {
    modal.dataset.publicationId = publicationId;
    commentsList.innerHTML = '<em>Chargement…</em>';
    fetch(`http://localhost:5001/api/commentaires/publication/${publicationId}`)
      .then(res => res.json())
      .then(comments => {
        if (!Array.isArray(comments) || comments.length === 0) {
          commentsList.innerHTML = '<p>Aucun commentaire.</p>';
        } else {
          commentsList.innerHTML = '';
          comments.forEach(c => {
            const div = document.createElement('div');
            div.className = 'comment';
            div.innerHTML = `<strong>${c.client_nom}</strong>: ${c.texte}`;
            commentsList.appendChild(div);
          });
        }
        modal.style.display = 'flex';
      })
      .catch(err => {
        commentsList.innerHTML = '<p>Erreur de chargement.</p>';
        console.error(err);
        modal.style.display = 'flex';
      });
  }

  // Attache l'événement à chaque bouton "Commenter"
  document
  .getElementById('allPublicationsContainer')
  .addEventListener('click', e => {
    // Trouve si on a cliqué sur un bouton contenant l'icône comment
    const btn = e.target.closest('button');
    if (!btn) return;
    if (!btn.querySelector('i.fa-comment')) return;

    const pubDiv = btn.closest('.publication');
    if (!pubDiv) return;
    openCommentsModal(pubDiv.dataset.id);
  });

  // Fermer le modal
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

  // Envoyer un nouveau commentaire
  submitBtn.addEventListener('click', () => {
    const texte = input.value.trim();
    if (!texte) return;
    fetch('http://localhost:5001/api/commentaires', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publication_id: modal.dataset.publicationId,
        client_id:     localStorage.getItem('userId'),
        texte
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.commentaireId) {
        const div = document.createElement('div');
        div.className = 'comment';
        div.innerHTML = `<strong>Vous</strong>: ${texte}`;
        commentsList.appendChild(div);
        input.value = '';
        commentsList.scrollTop = commentsList.scrollHeight;
      } else {
        alert('Erreur lors de l’ajout du commentaire.');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Erreur réseau.');
    });
  });
});
