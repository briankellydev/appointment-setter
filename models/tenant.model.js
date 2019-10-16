const mongoose = require('mongoose');
const Joi = require('joi');

const TenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tenantId: {
        type: String,
        required: true
    },
    welcomeMessage: {
        type: String,
        required: true
    }
});

const Tenant = mongoose.model('Tenant', TenantSchema);

function validateNewTenant(newTenant) {
    const schema = {
        name: Joi.string().required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(255).required(),
        fullName: Joi.string().required(),
        welcomeMessage: Joi.string.required()
    }

    return Joi.validate(newTenant, schema);
}

exports.Tenant = Tenant;
exports.validateNewTenant = validateNewTenant;