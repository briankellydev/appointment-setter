

const { User } = require('../models/user.model');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

const authController = {};

authController.login = (req, res) => {
    User.findOne({email: req.body.email}).then((user) => {
        if (!user) {
            res.status(500).send('Login information incorrect');
        } else {
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (same) {
                    const token = authController.generateAuthToken(user);
                    res.header('x-auth-token', token).send({
                        _id: user._id,
                        email: user.email,
                        tenantId: user.tenantId
                    });
                } else {
                    res.status(500).send('Login information incorrect');
                }
            });
        }
    });
}

authController.generateAuthToken = (user) => { 
    const token = jwt.sign(
      {
          _id: user._id,
          email: user.email,
          tenantId: user.tenantId
      },
      config.get('myprivatekey'),
      {expiresIn: '1d'}
      );
    return token;
  }

module.exports = authController;