const { Tenant, validateNewTenant } = require('../models/tenant.model');
const dataController = require('./data.controller');
const userController = require('./user.controller');
const authController = require('./auth.controller');
const User = require('../models/user.model');
const tenantController = {};

tenantController.getCurrentTenant = (req, res) => {
    Tenant.findOne({tenantId: req.user.tenantId}).then((tenant) => {
        const token = authController.generateAuthToken(req.user);
        res.header('x-auth-token', token).send(tenant);
    });
}

tenantController.createTenant = async (req, res) => {
    const error = validateNewTenant(req.body);
    if (error && error.error) return res.status(400).send(error);
    //make sure we didn't create a tenantId that relady exists
    let tenantId = dataController.generateUniqueId();
  let tenant = await Tenant.findOne({ tenantId: tenantId });
  if (tenant) {
    tenantId = dataController.generateUniqueId();
  }
  let userPayload = {
      body: {
        email: req.body.email,
        password: req.body.password,
        tenantId: tenantId,
        isAdmin: true,
        isPractitioner: false,
        fullName: req.body.fullName,
      }
  }

  userController.makeUser(userPayload, res).then(() => {
    tenant = new Tenant({
        tenantId: tenantId,
        name: req.body.name,
        welcomeMessage: req.body.welcomeMessage
    });
    tenant.save().then(() => {
        const token = authController.generateAuthToken(userPayload);
        res.header('x-auth-token', token).send();
    }).catch((err) => {
        console.log(err);
        User.findOne({email: req.email}).then((user) => {
            user.remove();
        });
        res.header('x-auth-token', token).status(500).send('Error generating tenant. Please try again.');
    });
  }).catch((err) => {
    console.log(err);
    res.header('x-auth-token', token).status(500).send('Error generating user. Please try again.');
  });
}

module.exports = tenantController;