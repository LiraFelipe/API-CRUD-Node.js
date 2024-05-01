const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

class UserAPI {
    constructor() {
        this.users = [
            new User(1, 'Usuário 1', 'usuario1@email.com'),
            new User(2, 'Usuário 2', 'usuario2@email.com')
        ];
    }

    getUsers() {
        return this.users;
    }

    addUser(newUser) {
        this.users.push(newUser);
    }

    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    updateUser(id, updateUser) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updateUser };
            return this.users[index];
        } else {
            return null;
        }
    }

    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }
}

const userAPI = new UserAPI();

app.use(express.json());

// Listar Usuários
app.get('/users', (req, res) => {
    res.json(userAPI.getUsers());
});

// Adicionar Usuário
app.post('/users', (req, res) => {
    const newUser = new User(req.body.id, req.body.name, req.body.email);
    userAPI.addUser(newUser);
    res.status(201).json(newUser);
});

// Buscar Usuário por ID
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = userAPI.getUserById(id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('Usuário não encontrado');
    }
});

// Atualizar Usuário
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updateUser = req.body;
    const updatedUser = userAPI.updateUser(id, updateUser);
    if (updatedUser) {
        res.json(updatedUser);
    } else {
        res.status(404).send('Usuário não encontrado');
    }
});

// Remover Usuário
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = userAPI.deleteUser(id);
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).send('Usuário não encontrado');
    }
});

app.use((req, res, next) => {
    res.status(404).json({ error: 'Página não encontrada' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
