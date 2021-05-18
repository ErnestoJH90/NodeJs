const express = require('express');
const.router = express.Router();

app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, 'views/index.html'));
    res.render('index');
});