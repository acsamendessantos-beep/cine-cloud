// Substitua pela URL do seu Render quando fizer o deploy
const API_URL = "http://localhost:3000"; // URL base para todas as requisições ao servidor

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede a página de recarregar ao submeter o formulário

    // Captura os valores dos campos do formulário
    const email = document.getElementById('email').value; // email para autenticação
    const senha = document.getElementById('password').value; // senha do usuário

    try {
        // Envia requisição POST para autenticação
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST', // Método HTTP para enviar dados de autenticação
            headers: {
                'Content-Type': 'application/json' // Especifica que o corpo é JSON
            },
            body: JSON.stringify({ email, senha }) // Converte os dados para JSON
        });

        const data = await response.json(); // Converte a resposta em objeto JavaScript

        if (response.ok) {
            // Se a autenticação foi bem-sucedida
            console.log("Login bem-sucedido!", data);
            
            // Salva os dados na memória local do navegador
            localStorage.setItem('usuarioId', data.id); // Armazena o ID do usuário
            localStorage.setItem('usuarioNome', data.nome); // Armazena o nome do usuário

            alert(`Bem-vindo(a), ${data.nome}!`);

            // Força o navegador a ir para a home
            window.location.replace("home.html");
    
        } else {
            // Se o servidor retornar erro (senha errada, email não encontrado, etc)
            alert(data.erro || "Erro ao fazer login");
        }

    } catch (error) {
        // Se o servidor estiver offline ou houver erro de conexão
        console.error("Erro na conexão:", error);
        alert("O servidor está offline ou houve um erro de conexão.");
    }
});

// Função para o botão "Criar conta"
function irParaCadastro() {
    // Redireciona para a página de cadastro quando o usuário clica em "Não tem conta?"
    window.location.href = "cadastro.html";
}