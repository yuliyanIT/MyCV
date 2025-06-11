const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const cheerio = require('cheerio');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

const ADMIN_USER = 'admin';
const ADMIN_PASS_HASH = bcrypt.hashSync('password', 10); 

// Middleware за auth
function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  res.redirect('/login');
}

// Четене и писане на content.json
function readContent() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'content.json')));
}
function writeContent(data) {
  fs.writeFileSync(path.join(__dirname, 'data', 'content.json'), JSON.stringify(data, null, 2));
}

// Login routes
app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === 'password') {
    req.session.loggedIn = true;
    res.redirect('/admin');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// Admin dashboard
app.get('/admin', requireLogin, (req, res) => {
  const content = readContent();
  res.render('dashboard', { content });
});

// Edit content
app.get('/admin/edit', requireLogin, (req, res) => {
  const content = readContent();
  res.render('edit', { content });
});
app.post('/admin/edit', requireLogin, (req, res) => {
  writeContent(req.body);
  res.render('edit', { content: req.body, saved: true });
});

// Public page
app.get('/', (req, res) => {
  const content = readContent();
  res.render('public', { content });
});
// Път до твоя index.html
const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const OUTPUT_PATH = path.join(__dirname, 'data', 'content.json');

// Функция за екстракция
function extractContentFromIndex() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const $ = cheerio.load(html);

  // Пример: взимане на текстове от секциите
  const summary = $('#summary .flip-card-front p').first().text().trim();
  const summary_back = $('#summary .flip-card-back p').first().text().trim();

  const experience = $('#experience .flip-card-front p').first().text().trim();
  const experience_back = $('#experience .flip-card-back').first().html().trim();

  const skills = $('#skills .flip-card-front p').first().text().trim();
  const skills_back = $('#skills .flip-card-back').first().html().trim();

  const education = $('#education .flip-card-front p').first().text().trim();
  const education_back = $('#education .flip-card-back').first().html().trim();

  const softskills = $('#soft-skills .flip-card-front p').first().text().trim();
  const softskills_back = $('#soft-skills .flip-card-back').first().html().trim();

  const languages = $('#languages .flip-card-front p').first().text().trim();
  const languages_back = $('#languages .flip-card-back').first().html().trim();

  const contacts = $('#contacts .flip-card-front p').first().text().trim();
  const contacts_back = $('#contacts .flip-card-back').first().html().trim();

  const certificates = $('#certificates .flip-card-front p').first().text().trim();
  const certificates_back = $('#certificates .flip-card-back').first().html().trim();

  // Създай JSON обект
  const content = {
    summary,
    summary_back,
    experience,
    experience_back,
    skills,
    skills_back,
    education,
    education_back,
    softskills,
    softskills_back,
    languages,
    languages_back,
    contacts,
    contacts_back,
    certificates,
    certificates_back
  };

  // Запиши във файла
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(content, null, 2), 'utf8');
  console.log('Content extracted to content.json');
}


app.listen(3000, () => console.log('CMS running on http://localhost:3000'));

