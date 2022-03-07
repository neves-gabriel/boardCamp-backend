import postCustomerSchema from '../validations/postCustomer.js';

export default function postCustomerValidation(req, res, next) {
  const validation = postCustomerSchema.validate(req.body);

  if (validation.error) {
    return res
      .status(400)
      .send('Todos os campos devem ser devidamente preenchidos');
  }

  return next();
}
