import postCategoriesSchema from '../validations/postCategories.js';

export default function postCategoriesValidation(req, res, next) {
  const validation = postCategoriesSchema.validate(req.body);

  if (validation.error) {
    return res
      .status(400)
      .send('Todos os campos devem ser devidamente preenchidos');
  }

  return next();
}
