const { estNonVide, estEmailValide } = require('../utils/validators');

// Données en mémoire : 2 utilisateurs fictifs
let users = [
  { id: 1, name: 'Aya', email: 'aya@example.com', role: 'admin' },
  { id: 2, name: 'Karim', email: 'karim@example.com', role: 'user' }
];
let prochainId = 3;

// GET /api/users (filtre optionnel ?role=...)
const getAllUsers = (req, res) => {
  const { role } = req.query;
  let resultat = users;
  if (role) {
    resultat = users.filter(u => u.role === role);
  } 
  res.status(200).json({ total: resultat.length, users: resultat });
}; 

// GET /api/users/:id
const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: `Utilisateur ${id} introuvable` });
  }
  res.status(200).json(user);
};

// POST /api/users
const createUser = (req, res) => {
  const { name, email, role } = req.body;

  if (!estNonVide(name)) {
    return res.status(400).json({ error: 'Le nom est obligatoire et ne doit pas être vide' });
  }
  if (!estEmailValide(email)) {
    return res.status(400).json({ error: "L'email est invalide (il doit contenir @ et un point)" });
  }

  const nouvelUser = { id: prochainId++, name, email, role: role || 'user' };
  users.push(nouvelUser);
  res.status(201).json({ message: 'Utilisateur créé', user: nouvelUser });
};

// DELETE /api/users/:id
const deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: `Utilisateur ${id} introuvable` });
  }
  users.splice(index, 1);
  res.status(200).json({ message: `Utilisateur ${id} supprimé` });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser
};