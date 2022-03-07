import { Router } from 'express';
import { listCategories, postCategories } from '../controllers/categories.js';
import { postCategoriesValidation } from '../middlewares/postCategoriesValidation.js';

const routes = new Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});

routes.get('/categories', listCategories);
routes.post('/categories', postCategoriesValidation, postCategories);

export default routes;
