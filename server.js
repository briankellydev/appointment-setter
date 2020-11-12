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
const mdbProd = 'mongodb://briankellydev:hiremen0w@cluster0-shard-00-00.sy7n0.mongodb.net:27017,cluster0-shard-00-01.sy7n0.mongodb.net:27017,cluster0-shard-00-02.sy7n0.mongodb.net:27017/default?ssl=true&replicaSet=atlas-zg2kp5-shard-0&authSource=admin&retryWrites=true&w=majority';
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

//use users route for api/users
app.use('/api/users', usersRoute);
// tenant routes
app.use('/api/tenants', tenantsRoute);
// auth
app.use('/api/auth', authRoute);

app.get('*', function(req, res) {
  res.sendFile('public/index.html', {root: __dirname}); // load our public/index.html file
});

const port = process.env.PORT || 3001;
// Procfile must run $env:myprivatekey = 'myprivatekey'
app.listen(port, () => console.log(`Listening on port ${port}...`));