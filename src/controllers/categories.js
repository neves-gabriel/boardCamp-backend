import connection from '../database/database.js';

async function listCategories(req, res) {
  try {
    const result = await connection.query('SELECT * FROM categories;');

    res.send(result.rows);
  } catch (error) {
    res.status(500).send(error);
  }
}
export { listCategories };
