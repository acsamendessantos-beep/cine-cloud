const API_URL = "http://localhost:3000"; // URL base para todas as requisições ao servidor

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o recarregamento da página ao submeter o formulário

    // Captura os valores dos campos do formulário
    const nome = document.getElementById('nome').value; // nome do novo usuário
    const email = document.getElementById('email').value; // email para login
    const senha = document.getElementById('password').value; // senha do usuário

    try {
        // Envia requisição POST para registrar o novo usuário
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST', // Método HTTP para enviar dados
            headers: { 'Content-Type': 'application/json' }, // Especifica que o corpo é JSON
            body: JSON.stringify({ nome, email, senha }) // Converte os dados para JSON
        });

        const data = await response.json(); // Converte a resposta em objeto JavaScript

        if (response.ok) {
            // Se a requisição foi bem-sucedida (status 200-299)
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "login.html"; // Vai para o login após cadastrar
        } else {
            // Se houve erro na requisição
            alert(data.erro || "Erro ao cadastrar");
        }
    } catch (error) {
        // Se o servidor estiver offline ou houver erro de conexão
        console.error("Erro na conexão:", error);
        alert("O servidor está offline.");
    }
});