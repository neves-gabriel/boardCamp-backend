import joi from 'joi';

const postGamesSchema = joi.object({
  name: joi.string().required(),
  image: joi
    .string()
    .pattern(/https?:\/\/.*.(?:png|jpg)/)
    .required(),
  stockTotal: joi.number().integer().positive().min(1).required(),
  categoryId: joi.number().min(1).required(),
  pricePerDay: joi.number().min(1).positive().required(),
});

export default postGamesSchema;
