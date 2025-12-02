const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, 'users.json');

const users = [
  {
    id: uuidv4(),
    name: 'Admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password', 10),
    createdAt: new Date().toISOString()
  }
];

fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
console.log('Seeded users.json');
