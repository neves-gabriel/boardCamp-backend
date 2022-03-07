import connection from '../database/database.js';

async function listCategories(req, res) {
  try {
    const result = await connection.query('SELECT * FROM categories;');

    res.send(result.rows);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function postCategories(req, res) {
  const { name } = req.body;
  try {
    const category = await connection.query(
      `
            SELECT * FROM categories WHERE name = ( $1 )
        `,
      [name]
    );

    if (category.rows.length > 0) {
      return res.status(409).send('Categoria já existente');
    }

    await connection.query(
      `
          INSERT INTO categories (name) VALUES ($1);
      `,
      [name]
    );

    res.status(201).send('Categoria inserida');
  } catch (error) {
    res.status(500).send(error);
  }
}

export { listCategories, postCategories };
