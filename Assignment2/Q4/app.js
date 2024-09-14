const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/studentdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.set('view engine', 'ejs');

const studentRoutes = require('./routes/students');
const authRoutes = require('./routes/auth');

app.use('/students', studentRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

app.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
});
