const config = require('config');
const mongoose = require('mongoose');
const usersRoute = require('./routes/user.route');
const tenantsRoute = require('./routes/tenant.route');
const authRoute = require('./routes/auth.route');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


//use config module to get the privatekey, if no private key set, end the application
if (!config.get('myprivatekey')) {
  console.error('FATAL ERROR: myprivatekey is not defined.');
  process.exit(1);
}
const mdbDev = 'mongodb://localhost/appointment-setter';
const mdbProd = 'mongodb://briankellydev:hiremen0w@ds335678.mlab.com:35678/heroku_t18rqgvk'
//connect to mongodb
mongoose
  .connect(mdbProd, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));


app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

app.use(express.static(__dirname + '/public')); 

app.get('*', function(req, res) {
    res.sendFile('public/index.html', {root: __dirname}); // load our public/index.html file
});
//use users route for api/users
app.use('/api/users', usersRoute);
// tenant routes
app.use('/api/tenants', tenantsRoute);
// auth
app.use('/api/auth', authRoute);

const port = process.env.PORT || 3001;
// Procfile must run $env:myprivatekey = 'myprivatekey'
app.listen(port, () => console.log(`Listening on port ${port}...`));