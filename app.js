const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 80;


// Static Files
app.use(express.static('public'));

// Templating Engine
app.engine('hbs', exphbs( {extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 
// Connection Pool
mongoose.connect(process.env.MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
}).then(() => console.log("connected to MONGO DB...")).catch(() => console.log(err));


const routes = require('./routes/routes')(app);
app.listen(port, () => console.log(`Listening on port ${port}`));