import postRentalSchema from '../validations/postRental.js';

export default function postRentalValidation(req, res, next) {
  const validation = postRentalSchema.validate(req.body);

  if (validation.error) {
    return res
      .status(400)
      .send('Todos os campos devem ser devidamente preenchidos');
  }

  return next();
}
