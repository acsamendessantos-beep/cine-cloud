const API_URL = "http://localhost:3000";
let catalogoCompleto = []; 

window.onload = () => {
    exibirBoasVindas();
    carregarConteudo(); 
};

function exibirBoasVindas() {
    const nomeUsuario = localStorage.getItem('usuarioNome');
    const msgElemento = document.getElementById('welcome-msg');
    if (nomeUsuario) {
        msgElemento.innerHTML = `Bem-vindo, <strong>${nomeUsuario}</strong>!`;
    } else {
        window.location.href = "login.html";
    }
}

async function carregarConteudo() {
    const container = document.getElementById('catalog-sections');
    try {
        const [resFilmes, resSeries] = await Promise.all([
            fetch(`${API_URL}/filmes`),
            fetch(`${API_URL}/series`)
        ]);

        const filmes = await resFilmes.json();
        const series = await resSeries.json();

        catalogoCompleto = [
            ...filmes.map(f => ({ ...f, tipo: 'filme' })),
            ...series.map(s => ({ ...s, tipo: 'serie' }))
        ];

        renderizarCatalogo(catalogoCompleto);

    } catch (error) {
        console.error("Erro ao carregar:", error);
        container.innerHTML = "<p style='color: white;'>Erro ao carregar o catálogo.</p>";
    }
}

function filtrarTipo(tipo) {
    let filtrados;
    if (tipo === 'todos') {
        filtrados = catalogoCompleto;
    } else {
        filtrados = catalogoCompleto.filter(item => item.tipo === tipo);
    }

    renderizarCatalogo(filtrados);
    
    const botoes = document.querySelectorAll('.category-menu button');
    botoes.forEach(btn => {
        btn.classList.remove('active');
        const textoBotao = btn.innerText.toLowerCase();
        if (tipo === 'todos' && textoBotao === 'início') btn.classList.add('active');
        if (tipo === 'serie' && textoBotao === 'séries') btn.classList.add('active');
        if (tipo === 'filme' && textoBotao === 'filmes') btn.classList.add('active');
    });
}

function renderizarCatalogo(itens) {
    const container = document.getElementById('catalog-sections');
    
    if (itens.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px; color: white;">
                <h3>Seu catálogo está vazio 🍿</h3>
                <p>Clique em "+ Adicionar" para começar!</p>
            </div>
        `;
        return;
    }

    const porGenero = {};
    itens.forEach(item => {
        if (!porGenero[item.genero]) porGenero[item.genero] = [];
        porGenero[item.genero].push(item);
    });

    container.innerHTML = "";
    Object.keys(porGenero).forEach(genero => {
        const section = document.createElement('section');
        section.className = 'genre-section';
        
        section.innerHTML = `
            <h3 class="genre-title">${genero}</h3>
            <div class="movies-row">
                ${porGenero[genero].map(item => `
                    <div class="movie-card" data-title="${item.titulo.toLowerCase()}">
                        <a href="${item.link || '#'}" target="_blank" style="text-decoration: none; color: inherit;">
                            <img src="${item.capa}" alt="${item.titulo}" onerror="this.src='https://via.placeholder.com/300x450?text=Sem+Capa'">
                            <div class="movie-info">
                                <h3>${item.titulo}</h3>
                                <p>${item.genero} • ${item.tipo === 'serie' ? (item.temporadas + ' Temp.') : (item.ano || '---')}</p>
                            </div>
                            <div class="play-overlay">
                                <button class="play-btn">▶</button>
                            </div>
                        </a>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(section);
    });

    document.getElementById('search-input').addEventListener('input', filtrarBusca);
}

function filtrarBusca() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach(card => {
        const title = card.dataset.title;
        card.style.display = title.includes(query) ? 'block' : 'none';
    });
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}