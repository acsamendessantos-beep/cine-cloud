const API_URL = "http://localhost:3000";

const form = document.getElementById('filme-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Pegando os valores dos campos (incluindo o LINK)
    const titulo = document.getElementById('titulo').value;
    const capa = document.getElementById('capa').value;
    const genero = document.getElementById('genero').value;
    const ano = document.getElementById('ano').value;
    const link = document.getElementById('link').value; // O pulo do gato está aqui!

    try {
        const response = await fetch(`${API_URL}/filmes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, capa, genero, ano, link })
        });

        if (response.ok) {
            alert("Filme adicionado com sucesso!");
            window.location.href = "home.html"; // Volta para a home
        } else {
            alert("Erro ao salvar o filme.");
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("O servidor está offline.");
    }
});