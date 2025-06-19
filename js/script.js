document.addEventListener('DOMContentLoaded', () => {
    let briks = JSON.parse(localStorage.getItem('briks')) || [];
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    function saveBriks() {
        localStorage.setItem('briks', JSON.stringify(briks));
    }

    function saveFavoritos() {
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }

    window.sendMessage = function() {
        const chatMessage = document.getElementById('chatMessage').value;
        if (chatMessage.trim()) {
            alert('Mensagem enviada: ' + chatMessage);
            document.getElementById('chatMessage').value = '';
            const chatModal = bootstrap.Modal.getInstance(document.getElementById('chatModal'));
            if (chatModal) {
                chatModal.hide();
            }
        } else {
            alert('Por favor, digite uma mensagem.');
        }
    };

    const addBrikForm = document.getElementById('addBrikForm');
    const briksList = document.getElementById('briksList');

    if (addBrikForm) {
        addBrikForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const title = document.getElementById('brikTitle').value;
            const description = document.getElementById('brikDescription').value;
            const price = parseFloat(document.getElementById('brikPrice').value).toFixed(2);
            const contact = document.getElementById('brikContact').value;
            const imageFile = document.getElementById('brikImage').files[0];

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageUrl = e.target.result;
                    const newBrik = {
                        id: Date.now().toString(),
                        title,
                        description,
                        price,
                        contact,
                        imageUrl
                    };
                    briks.push(newBrik);
                    saveBriks();
                    displayBriks();
                    addBrikForm.reset();
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addBrikModal'));
                    if (modal) {
                        modal.hide();
                    }
                };
                reader.readAsDataURL(imageFile);
            } else {
                alert('Por favor, selecione uma imagem para o Brik.');
            }
        });
    }
    
    function displayBriks() {
        if (!briksList) return;

        briksList.innerHTML = '';
        if (briks.length === 0) {
            briksList.innerHTML = '<p class="text-muted text-center">Nenhum brik disponível ainda. Adicione o primeiro!</p>';
            return;
        }

        briks.forEach((brik) => {
            const isFavorited = favoritos.some(fav => fav.id === brik.id);
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
                <div class="card h-100">
                    <img src="${brik.imageUrl}" class="card-img-top" alt="${brik.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${brik.title}</h5>
                        <p class="card-text">${brik.description}</p>
                        <p class="text-muted small">Contato: ${brik.contact}</p>
                        <p class="valor-produto mt-2 mb-3">
                            R$ ${brik.price}
                            <i class="fa-brands fa-pix text-success ms-2" title="Aceita Pix"></i>
                            <i class="fa-solid fa-credit-card text-primary ms-1" title="Aceita Cartão"></i>
                        </p>
                        <div class="mt-auto d-flex justify-content-between">
                            <button class="btn btn-primary btn-sm buy-btn" data-bs-toggle="modal" data-bs-target="#chatModal" data-contact="${brik.contact}">Tenho Interesse</button>
                            <button class="btn btn-${isFavorited ? 'danger' : 'outline-warning'} btn-sm favorite-toggle-btn" data-id="${brik.id}">
                                ${isFavorited ? '💔 Desfavoritar' : '⭐ Favoritar'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            briksList.appendChild(col);
        });
    }

    const favoritosList = document.getElementById('favoritosList');

    function displayFavoritos() {
        if (!favoritosList) return;

        favoritosList.innerHTML = '';
        if (favoritos.length === 0) {
            favoritosList.innerHTML = '<p class="text-muted text-center">Nenhum favorito ainda.</p>';
            return;
        }

        favoritos.forEach((fav) => {
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
                <div class="card h-100">
                    <img src="${fav.imageUrl}" class="card-img-top" alt="${fav.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${fav.title}</h5>
                        <p class="card-text">${fav.description}</p>
                        <p class="text-muted small">Contato: ${fav.contact}</p>
                        <p class="valor-produto mt-2 mb-3">
                            R$ ${fav.price}
                            <i class="fa-brands fa-pix text-success ms-2" title="Aceita Pix"></i>
                            <i class="fa-solid fa-credit-card text-primary ms-1" title="Aceita Cartão"></i>
                        </p>
                        <div class="mt-auto d-flex justify-content-between">
                            <button class="btn btn-primary btn-sm buy-btn" data-bs-toggle="modal" data-bs-target="#chatModal" data-contact="${fav.contact}">Comprar</button>
                            <button class="btn btn-danger btn-sm unfavorite-btn" data-id="${fav.id}">💔 Desfavoritar</button>
                        </div>
                    </div>
                </div>
            `;
            favoritosList.appendChild(col);
        });
    }

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('favorite-toggle-btn')) {
            const brikId = event.target.dataset.id;
            const brikToToggle = briks.find(brik => brik.id === brikId);

            if (brikToToggle) {
                const isFavorited = favoritos.some(fav => fav.id === brikId);

                if (isFavorited) {
                    favoritos = favoritos.filter(fav => fav.id !== brikId);
                    event.target.textContent = '⭐ Favoritar';
                    event.target.classList.remove('btn-danger');
                    event.target.classList.add('btn-outline-warning');
                } else {
                    favoritos.push(brikToToggle);
                    event.target.textContent = '💔 Desfavoritar';
                    event.target.classList.remove('btn-outline-warning');
                    event.target.classList.add('btn-danger');
                }
                saveFavoritos();
                if (favoritosList) {
                    displayFavoritos();
                }
            }
        }

        if (event.target.classList.contains('unfavorite-btn')) {
            const brikId = event.target.dataset.id;
            favoritos = favoritos.filter(fav => fav.id !== brikId);
            saveFavoritos();
            displayFavoritos();

            if (briksList) {
                displayBriks();
            }
        }

        if (event.target.classList.contains('buy-btn')) {
            const contact = event.target.dataset.contact;
            console.log("Contato do vendedor para o chat:", contact);
        }
    });

    if (briksList) {
        displayBriks();
    } else if (favoritosList) {
        displayFavoritos();
    }
});

document.getElementById("addBrikForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("brikTitle").value;
  const description = document.getElementById("brikDescription").value;
  const price = document.getElementById("brikPrice").value;
  const contact = document.getElementById("brikContact").value;
  const imageInput = document.getElementById("brikImage");
  const category = document.getElementById("brikCategory").value;

  if (!category) {
    alert("Por favor, selecione uma categoria.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const imageUrl = reader.result;

    const brik = {
      title,
      description,
      price,
      contact,
      category,
      image: imageUrl
    };

    addBrikToList(brik);
    const modal = bootstrap.Modal.getInstance(document.getElementById("addBrikModal"));
    modal.hide();
    e.target.reset();
  };

  if (imageInput.files[0]) {
    reader.readAsDataURL(imageInput.files[0]);
  }
});

function addBrikToList(brik) {
  const briksList = document.getElementById("briksList");

  // Cria um card para o brik
  const card = document.createElement("div");
  card.className = "col";

  card.innerHTML = `
    <div class="card h-100">
      <img src="${brik.image}" class="card-img-top" alt="${brik.title}">
      <div class="card-body">
        <h5 class="card-title">${brik.title}</h5>
        <p class="card-text">${brik.description}</p>
        <p class="card-text"><strong>Valor:</strong> R$ ${brik.price}</p>
        <p class="card-text"><strong>Contato:</strong> ${brik.contact}</p>
        <p class="card-text"><strong>Categoria:</strong> ${brik.category}</p>
      </div>
    </div>
  `;

  briksList.appendChild(card);
}
