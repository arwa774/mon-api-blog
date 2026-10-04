const express = require('express'); // 1. Load the Express framework module

const app = express(); // 2. Instantiate the server application

const PORT = 3000;
app.use(express.json());

// 3. Route definition: executed when a client requests GET /
app.get('/', (req, res) => {
    res.json({
        message: "Hello, I am the blog API"
    });
});
app.use(express.json());
// In-memory data store.
// State resets to defaults upon process restart.
// Persistent storage will be handled by MongoDB in Session 3.
const articles = [
    {
        id: 1,
        title: 'Welcome to the blog',
        author: 'Admin'
    },
    {
        id: 2,
        title: 'My first Express server',
        author: 'Aya'
    },
    {
        id: 3,
        title: 'Testing an API with Postman',
        author: 'Aya'
    }
];

// GET /api/articles/2 -> fetch the article whose id equals 2
app.get('/api/articles/:id', (req, res) => {
    const id = Number(req.params.id); // Convert "2" (string) -> 2 (number)

    const article = articles.find(a => a.id === id);

    if (!article) {
        return res.status(404).json({
            error: `Article ${id} not found`
        });
    }

    res.json(article);
});


// GET /api/articles -> get all articles
// GET /api/articles?author=Aya -> get articles filtered by author

app.get('/api/articles', (req, res) => {
    const { author } = req.query;
    // Equivalent to: const author = req.query.author;

    let result = articles;

    // If the query parameter ?author= was provided
    if (author) {
        result = articles.filter(a => a.author === author);
    }

    res.json({
        total: result.length,
        articles: result
    });
});
// GET /api/articles -> fetch all articles
app.get('/api/articles', (req, res) => {
    res.json({
        total: articles.length,
        articles: articles
    });
});
let prochainId = 4;

app.post('/api/articles', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "Le titre et l'auteur sont obligatoires" });
  }
  const nouvelArticle = { id: prochainId, title: title, author: author };
  prochainId = prochainId + 1;
  articles.push(nouvelArticle);
  res.status(201).json({ message: 'Article créé', article: nouvelArticle });
});
// 1. GET /about
app.get('/about', (req, res) => {
    res.json({
        appName: "API du blog",
        author: "Arwa",
        version: "1.0.0"
    });
});
// 2. Les utilisateurs
const users = [
    { id: 1, name: 'Aya', email: 'aya@gmail.com' },
    { id: 2, name: 'Omar', email: 'omar@gmail.com' },
    { id: 3, name: 'Youssef', email: 'youssef@gmail.com' }
];

// GET /api/users  (+ bonus : /api/users?name=Aya)
app.get('/api/users', (req, res) => {
    const { name } = req.query;
    let result = users;
    if (name) {
        result = users.filter(u => u.name === name);
    }
    res.json(result);
});

// 3. GET /api/users/:id
app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) {
        return res.status(404).json({ error: `Utilisateur ${id} introuvable` });
    }
    res.json(user);
});

// 4. POST /contact
app.post('/contact', (req, res) => {
    const { email, message } = req.body;
    if (!email || !message) {
        return res.status(400).json({ error: "L'email et le message sont obligatoires" });
    }
    res.status(200).json({ message: "Merci, votre message a bien été reçu" });
});
// 4. Bind and listen: wait for incoming HTTP requests on port 3000
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

