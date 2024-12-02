const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Carregar banco de dados (arquivo JSON)
const COMMENTS_FILE = 'comments.json';

function loadComments() {
    if (fs.existsSync(COMMENTS_FILE)) {
        return JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8'));
    }
    return [];
}

function saveComments(comments) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}

// Endpoint para obter comentários
app.get('/comments', (req, res) => {
    const comments = loadComments();
    res.json(comments);
});

// Endpoint para adicionar um novo comentário
app.post('/comments', (req, res) => {
    const { name, brand, model, comment } = req.body;
    if (!name || !brand || !model || !comment) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const comments = loadComments();
    const newComment = { name, brand, model, comment, date: new Date() };
    comments.push(newComment);
    saveComments(comments);

    res.status(201).json(newComment);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
