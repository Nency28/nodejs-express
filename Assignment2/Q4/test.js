const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0:27017/studentdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected');
    mongoose.disconnect(); // Close the connection after test
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});
