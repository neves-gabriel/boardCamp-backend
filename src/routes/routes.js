import { Router } from 'express';
import { listCategories, postCategories } from '../controllers/categories.js';
import { postCategoriesValidation } from '../middlewares/postCategoriesValidation.js';
import { listGames, postGames } from '../controllers/games.js';
import { postGamesValidation } from '../middlewares/postGamesValidation.js';

const routes = new Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});

routes.get('/categories', listCategories);
routes.post('/categories', postCategoriesValidation, postCategories);

routes.get('/games', listGames);
routes.post('/games', postGamesValidation, postGames);

export default routes;
