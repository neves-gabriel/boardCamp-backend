import joi from 'joi';

const postCategoriesSchema = joi.object({
  name: joi.string().min(3).required(),
});

export default postCategoriesSchema;
