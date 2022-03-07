import { Router } from 'express';
import { listCategories } from '../controllers/categories.js';

const routes = new Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});

routes.get('/categories', listCategories);
export default routes;
