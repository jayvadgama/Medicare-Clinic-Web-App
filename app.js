const express = require('express');
const session = require('express-session');
const fs = require('fs');
var hbs = require('hbs');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true
}));

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Load user data from JSON file
  const users = JSON.parse(fs.readFileSync('users.json'));

  // Check if user exists and password is correct
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    res.send('Invalid username or password');
  } else {
    // Store user ID in session
    req.session.userId = user.id;
    res.redirect('/dashboard');
  }
});

app.get('/dashboard', (req, res) => {
  // Check if user is logged in
  if (!req.session.userId) {
    res.redirect('/login');
    return;
  }

  // Load user data from JSON file
  const users = JSON.parse(fs.readFileSync('users.json'));

  // Find user by ID
  const user = users.find(u => u.id === req.session.userId);

  // Serve the dashboard HTML page and replace [username] with the actual username
  res.render('dashboard', {username: user.username});

  // const dashboardPage = fs.readFileSync(__dirname + '/public/dashboard.html', 'utf8');
  // const renderedPage = dashboardPage.replace('[username]', user.username);
  // res.send(renderedPage);
});



app.get('/login', (req, res) => {
  res.render('login');
});

// Register endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  let users = [];
  if (fs.existsSync('users.json')) {
    users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  }

  // Check if username is already taken
  if (users.find(user => user.username === username)) {
    return res.status(400).send('Username is already taken');
  }


    const user = {
      id: users.length + 1,
      username: username,
      password: password
    };

    
    users.push(user);
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.send('User registered successfully');
 

});

app.get('/logout', (req, res) => {
  // Destroy the session and redirect to the login page
  req.session.destroy();
  res.redirect('/login');
  
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

