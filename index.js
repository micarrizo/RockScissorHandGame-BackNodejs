const express = require('express');
const conectarDB = require('./config/db')
const cors = require('cors')
const path = require("path");

const app = express();

conectarDB();

app.use(cors())

app.use(express.json({ extends: true }));

const PORT = process.env.PORT || 4000;

app.use('/api/games', require('./routes/game'));
app.use('/api/moves', require('./routes/move'));
app.use('/api/files', require('./routes/files'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/public', express.static(__dirname+'/public/assets/uploads'));



app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
});