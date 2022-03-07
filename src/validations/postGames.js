import joi from 'joi';

const postGamesSchema = joi.object({
  name: joi.string().min(3).required(),
  image: joi.string().pattern(/https?:\/\/.*.(?:png|jpg)/),
  stockTotal: joi.number().min(1).required(),
  categoryId: joi.number().min(1).required(),
  pricePerDay: joi.number().required(),
});

export default postGamesSchema;
