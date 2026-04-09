// Rota para recuperar/alterar senha
app.put('/recuperar-senha', async (req, res) => {
    const { email, novaSenha } = req.body;

    try {
        // Busca o usuário pelo email e atualiza a senha
        // Se estiver usando criptografia (bcrypt), lembre-se de criptografar a novaSenha aqui
        const usuarioAtualizado = await Usuario.findOneAndUpdate(
            { email: email },
            { senha: novaSenha },
            { new: true } // Retorna o usuário já com a alteração
        );

        if (!usuarioAtualizado) {
            return res.status(404).json({ erro: 'Usuário não encontrado com este e-mail.' });
        }

        res.json({ mensagem: 'Senha atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
});