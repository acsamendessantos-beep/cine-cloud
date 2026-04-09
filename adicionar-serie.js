// adicionar-serie.js
const API_URL = "http://localhost:3000";

const form = document.getElementById('add-serie-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Agora pegamos Temporadas
    const serie = {
        titulo: document.getElementById('titulo').value,
        capa: document.getElementById('capa').value,
        genero: document.getElementById('genero').value,
        temporadas: document.getElementById('temporadas').value, // <-- DIFERENTE
        link: document.getElementById('link').value,
    };

    try {
        const res = await fetch(`${API_URL}/series`, { // <-- ENVIA PARA /series
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serie)
        });

        if (res.ok) {
            alert("Série salva com sucesso!");
            window.location.href = "home.html";
        } else {
            alert("Erro ao salvar a série no servidor.");
        }
    } catch (err) {
        alert("Erro ao conectar com o servidor.");
    }
});