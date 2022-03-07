import joi from 'joi';

const postRentalSchema = joi.object({
  customerId: joi.number().positive().integer().min(1).required(),
  gameId: joi.number().positive().integer().min(1).required(),
  daysRented: joi.number().positive().integer().min(1).required(),
});

export default postRentalSchema;
