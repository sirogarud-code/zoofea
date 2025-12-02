const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}

let users = loadUsers();

function publicUser(u) {
  const { password, ...rest } = u;
  return rest;
}

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'ZooFeed server running' });
});

// List all users (public view)
app.get('/users', (req, res) => {
  res.json(users.map(publicUser));
});

// Get single user by id
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(publicUser(user));
});

// Register new user
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const exists = users.some(u => u.email === email);
  if (exists) return res.status(409).json({ error: 'Email already registered' });

  const id = uuidv4();
  const hashed = bcrypt.hashSync(password, 10);

  const newUser = {
    id,
    name: name || null,
    email,
    password: hashed,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  try {
    saveUsers(users);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save user' });
  }

  res.status(201).json(publicUser(newUser));
});

app.listen(PORT, () => {
  console.log(`ZooFeed server listening on port ${PORT}`);
});
