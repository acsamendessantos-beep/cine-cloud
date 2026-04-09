const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Conexão corrigida - Adicionei 'cinecloudDB' antes da interrogação
mongoose.connect('mongodb+srv://minha_agenda:Acsa.5931@acsa.ingh5l2.mongodb.net/cinecloudDB?retryWrites=true&w=majority')
  .then(() => console.log("Conectado ao MongoDB Atlas!"))
  .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

// --- MODELOS ---

const UserSchema = new mongoose.Schema({
    // nome: armazena o nome completo do usuário
    nome: String,
    // email: identificador único do usuário, não pode repetir na base de dados
    email: { type: String, unique: true, required: true },
    // senha: armazena a senha criptografada do usuário
    senha: { type: String, required: true },
    // favoritos: array de referências aos filmes favoritados pelo usuário
    favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Filme' }]
});
const User = mongoose.model('User', UserSchema);

const filmeSchema = new mongoose.Schema({
    titulo: String, /* Nome do filme, exibido na interface */
    capa: String, /* URL da imagem de capa do filme */  
    genero: String, /* Categoria ou estilo do filme (ex: Ação, Drama, Comédia) */
    ano: Number, // Ano de lançamento do filme, armazenado como número para facilitar ordenação e validação
    link: String, // <-- Verifique se esta linha existe no seu server.js
});
const Filme = mongoose.model('Filme', filmeSchema);


// --- ROTAS DE AUTENTICAÇÃO ---

app.post('/auth/register', async (req, res) => {
    // ROTA: POST /auth/register - Cria uma nova conta de usuário
    try {
        // Extrai nome, email e senha do corpo da requisição
        const { nome, email, senha } = req.body;
        
        // Verifica se o usuário já existe antes de tentar criar
        const usuarioExiste = await User.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ erro: "Este email já está em uso!" });
        }

        // Criptografa a senha com bcrypt usando salt de 10 iterações
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        
        // Cria o novo usuário no banco de dados com a senha criptografada
        await User.create({ nome, email, senha: senhaCriptografada });
        
        res.status(201).json({ mensagem: "Conta criada com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao criar conta. Tente novamente." });
    }
});

app.post('/auth/login', async (req, res) => {
    // ROTA: POST /auth/login - Autentica usuário e retorna seus dados
    // email: email do usuário para buscar na base de dados
    // senha: senha em texto plano (será comparada com a hash armazenada)
    const { email, senha } = req.body;
    const usuario = await User.findOne({ email });
    
    // Verifica se o usuário existe e se a senha corresponde à hash armazenada
    if (usuario && await bcrypt.compare(senha, usuario.senha)) {
        // Retorna o ID único do usuário e seu nome para armazenar no localStorage
        res.json({ id: usuario._id, nome: usuario.nome });
    } else {
        // Retorna erro se email não existir ou senha estiver incorreta
        res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }
});

// --- ROTAS DE FILMES ---

app.get('/filmes', async (req, res) => {
    // ROTA: GET /filmes - Retorna todos os filmes do catálogo
    const filmes = await Filme.find();
    res.json(filmes);
});

app.post('/filmes', async (req, res) => {
    // ROTA: POST /filmes - Cria um novo filme no catálogo
    // Corpo da requisição deve conter: titulo, capa, genero, ano, link
    const novoFilme = await Filme.create(req.body);
    res.json(novoFilme);
});

app.delete('/filmes/:id', async (req, res) => {
    // ROTA: DELETE /filmes/:id - Remove um filme do catálogo
    // :id: identificador único do filme a ser deletado (ObjectId do MongoDB)
    try {
        const filme = await Filme.findByIdAndDelete(req.params.id);
        if (filme) {
            // Se o filme foi encontrado e deletado com sucesso
            res.json({ mensagem: "Filme removido com sucesso!" });
        } else {
            // Se o filme não foi encontrado
            res.status(404).json({ erro: "Filme não encontrado." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao deletar filme." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// --- NOVAS ROTAS PARA SÉRIES ---

const serieSchema = new mongoose.Schema({
    titulo: String,
    capa: String,
    genero: String,
    temporadas: Number, 
    link: String
});

// Definimos o modelo como 'Serie' (com S maiúsculo é o padrão recomendado)
const Serie = mongoose.model('Serie', serieSchema);

// ROTA PARA SALVAR SÉRIE (POST)
app.post('/series', async (req, res) => {
    try {
        // Usamos 'Serie' exatamente como definido acima
        const novaSerie = await Serie.create(req.body); 
        res.status(201).json(novaSerie);
    } catch (err) {
        console.error("Erro ao salvar série:", err);
        res.status(500).json({ erro: "Erro ao salvar série" });
    }
});

// ROTA PARA BUSCAR TODAS AS SÉRIES (GET)
app.get('/series', async (req, res) => {
    try {
        const listaSeries = await Serie.find();
        res.json(listaSeries);
    } catch (err) {
        console.error("Erro ao buscar séries:", err);
        res.status(500).json({ erro: "Erro ao buscar séries" });
    }
});