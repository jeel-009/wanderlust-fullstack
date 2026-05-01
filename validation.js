const Joi = require('joi');

const reviewsSchema = Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().max(5).min(1).required(),
    }).required()
});

module.exports = reviewsSchema;