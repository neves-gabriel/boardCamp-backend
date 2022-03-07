import connection from '../database/database.js';

async function listGames(req, res) {
  const { name } = req.query;
  const params = [];

  let query =
    'SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id';

  if (name) {
    query += ' WHERE games.name ILIKE $1';
    params.push(`${name}%`);
  }

  try {
    const result = await connection.query(`${query};`, params);

    res.send(result.rows);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function postGames(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    const { rows: game } = await connection.query(
      `
            SELECT * FROM games WHERE name = ( $1 )
        `,
      [name]
    );

    if (game.length > 0) return res.status(409).send('Jogo já existente');

    const { rows: category } = await connection.query(
      `
            SELECT * FROM categories WHERE id = ( $1 )
        `,
      [categoryId]
    );

    if (category.length === 0) {
      return res.status(400).send('Categoria do Jogo deve existir');
    }

    await connection.query(
      `
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);
        `,
      [name, image, stockTotal, categoryId, pricePerDay]
    );

    res.status(201).send('Jogo inserido');
  } catch (error) {
    res.status(500).send(error);
  }
}

export { listGames, postGames };
