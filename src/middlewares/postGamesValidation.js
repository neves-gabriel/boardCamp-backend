import postGamesSchema from '../validations/postGames.js';

export default function postGamesValidation(req, res, next) {
  const validation = postGamesSchema.validate(req.body);

  if (validation.error) {
    return res
      .status(400)
      .send('Todos os campos devem ser devidamente preenchidos');
  }

  return next();
}
