
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user.model');
const dataController = require('./data.controller');
const authController = require('./auth.controller');
const userController = {};

userController.getCurrentUser = (req, res) => {
    User.findById(req.user._id).select('-password').then((user) => {
        const token = authController.generateAuthToken(user);
        res.header('x-auth-token', token).send(user);
    });
}

userController.makeUser = (req, res) => {
    // validate the request body first
    const { error } = validate(req.body);
    if (error && error.error) return res.status(400).send(error);
    let userId = dataController.generateUniqueId();
   return  User.findOne({ userId: userId }).then((existingUser) => {
        if (existingUser) {
            userId = dataController.generateUniqueId();
        }
        //find an existing user
        return User.findOne({ email: req.body.email }).then((user) => {
            if (user) return res.status(400).send('User already registered.');
            user = new User({
                password: req.body.password,
                email: req.body.email,
                userId: userId,
                // Need to check against the creating user for perms in the db
                isPractitioner: req.body.isPractitioner,
                isAdmin: req.body.isAdmin,
                tenantId: req.body.tenantId,
                appointments: [],
                fullName: req.body.fullName
            });
            return bcrypt.hash(user.password, 10).then((password) => {
                user.password = password;
                return user.save();
            });
        });
    });
}

userController.createUser = (req, res) => {
    User.findById(req.user._id).then((user) => {
        if (!user.isAdmin) res.header('x-auth-token', token).status(401).send('Unauthorized');
        userController.makeUser(req, res).then(() => {
            res.header('x-auth-token', token).send();
        }).catch(() => {
            res.header('x-auth-token', token).status(500).send('Error creating user');
        });
    }).catch(() => {
        res.header('x-auth-token', token).status(500).send('Error finding logged in user');
    });
}

userController.getPractitioners = (req, res) => {
    User.findById(req.user._id).then((user) => {
        if (user) {
            User.find({ tenantId: user.tenantId, isPractitioner: true }).then((practitioners) => {
                const mappedResponse = practitioners.map((practitioner) => {
                    return {
                        fullName: practitioner.fullName,
                        userId: practitioner.userId,
                    }
                });
                const token = authController.generateAuthToken(user);
                res.header('x-auth-token', token).send(mappedResponse);
            }).catch(() => {
                res.header('x-auth-token', token).status(500).send('Error fetching practitioners');
            });
        } else {
            res.header('x-auth-token', token).status(500).send('Error fetching practitioners');
        }
    }).catch(() => {
        res.status(500).send('Error fetching practitioners');
    })

}

userController.getPractitionerById = (req, res) => {
    User.findOne({ email: user.email }).then((user) => {
        if (user) {
            User.findOne({ tenantId: user.tenantId, userId: req.params.practitionerId }).then((practitioner) => {
                const mappedAppointments = practitioner.appointments.map((appt) => {
                    return {
                        start: appt.start,
                        end: appt.end,
                    }
                });
                const mappedResponse = practitioner.map((pract) => {
                    return {
                        fullName: pract.fullName,
                        userId: pract.userId,
                        appointments: mappedAppointments
                    }
                });
                const token = authController.generateAuthToken(user);
                res.header('x-auth-token', token).send(mappedResponse);
            }).catch(() => {
                res.status(500).send('Error fetching practitioner');
            });
        } else {
            res.status(500).send('Error fetching practitioner');
        }
    }).catch(() => {
        res.status(500).send('Error fetching practitioner');
    });

}

userController.createAppointment = (req, res) => {
    User.findOne({ email: req.user.email }).then((user) => {
        const conflictExistsInUser = dataController.checkForAppointmentConflict(user.appointments, req.body.appointment);
        if (conflictExistsInUser) {
            res.status(500).send('Error creating appointment: Appointment in this timeslot exists');
        } else {
            User.findOne({ userId: req.body.practitionerId }).then((practitioner) => {
                const conflictExistsInPractitioner = dataController.checkForAppointmentConflict(practitioner.appointments, req.body.appointment);
                if (conflictExistsInPractitioner) {
                    res.status(500).send('Error creating appointment: Appointment in this timeslot exists');
                } else {
                    user.appointments.push(req.body.appointments);
                    practitioner.appointments.push(req.body.appointments);
                    user.save().then(() => {
                        practitioner.save().then(() => {
                            const token = authController.generateAuthToken(user);
                            res.header('x-auth-token', token).send();
                        }).catch(() => {
                            user.appointments.pop();
                            user.save().then(() => {
                                res.status(500).send('Error saving practitioner appointment');
                            });
                        });
                    }).catch(() => {
                        res.status(500).send('Error saving client appointment');
                    });
                }
            }).catch(() => {
                res.status(500).send('Error finding practitioner by id');
            });
        }
    });
}

userController.removeAppointment = (req, res) => {
    User.findOne({ email: req.user.email }).then((user) => {
        const userApptIndex = user.appointments.findIndex((appointment) => {
            return appointment.time === req.body.time;
        });
        user.appointments.splice(userApptIndex, 1);
        User.findOne({ userId: req.body.practitionerId }).then((practitioner) => {
            const practApptIndex = practitioner.appointments.findIndex((appointment) => {
                return appointment.time === req.body.time;
            });
            practitioner.appointments.splice(practApptIndex, 1);
            user.save().then(() => {
                practitioner.save().then(() => {
                    const token = authController.generateAuthToken(user);
                    res.header('x-auth-token', token).send();
                }).catch(() => {
                    user.appointments.push(req.body.appointment);
                    user.save().then(() => {
                        res.status(500).send('Error removing appointment for practitioner');
                    });
                });
            }).catch(() => {
                res.status(500).send('Error removing appointment for client');
            });
        }).catch(() => {
            res.status(500).send('Error finding practitioner by id');
        });
    });
}

module.exports = userController;