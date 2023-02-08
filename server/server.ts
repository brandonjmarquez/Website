const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config({path:__dirname+'/.env'});
const PORT = process.env.SERVER_PORT || 3003;

// var mongoose = require("./foo_db_connect.js");

app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/sound-file-count'));
app.use('/sounds', express.static(path.join(__dirname, '/sounds')));

//server 
app.listen(PORT, () => {
  console.log(`node server is running on port %s`, PORT);
});

