const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✨ Conneto server running on http://localhost:${PORT}`);
});
