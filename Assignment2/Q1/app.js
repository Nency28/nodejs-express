const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://0.0.0.0:27017/fileupload', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  files: [String] 
});
const User = mongoose.model('User', userSchema);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
  res.render('index');
});

app.post('/register', upload.array('files', 5), async (req, res) => {
  try {
    const { username, email } = req.body;
    const files = req.files.map(file => file.filename);
    
    const newUser = new User({ username, email, files });
    await newUser.save();

    res.redirect('/files');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/files', async (req, res) => {
  try {
    const users = await User.find();
    res.render('files', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);
  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
