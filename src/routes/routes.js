import { Router } from 'express';
import { listCategories, postCategories } from '../controllers/categories.js';
import { postCategoriesValidation } from '../middlewares/postCategoriesValidation.js';
import { listGames, postGames } from '../controllers/games.js';
import { postGamesValidation } from '../middlewares/postGamesValidation.js';
import {
  listCustomers,
  postCustomer,
  selectCustomer,
  updateCustomer,
} from '../controllers/customers.js';
import { postCustomerValidation } from '../middlewares/postCustomerValidation.js';
import {
  listRentals,
  postRental,
  finishRental,
  deleteRental,
} from '../controllers/rentals.js';
import { postRentalValidation } from '../middlewares/postRentalValidation.js';

const routes = new Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});

routes.get('/categories', listCategories);
routes.post('/categories', postCategoriesValidation, postCategories);

routes.get('/games', listGames);
routes.post('/games', postGamesValidation, postGames);

routes.get('/customers', listCustomers);
routes.post('/customers', postCustomerValidation, postCustomer);
routes.get('/customers/:id', selectCustomer);
routes.put('/customers/:id', postCustomerValidation, updateCustomer);

routes.get('/rentals', listRentals);
routes.post('/rentals', postRentalValidation, postRental);
routes.post('/rentals/:id/return', finishRental);
routes.delete('/rentals/:id', deleteRental);

export default routes;
