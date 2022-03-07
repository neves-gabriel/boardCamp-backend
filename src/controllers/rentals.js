import dayjs from 'dayjs';
import connection from '../database/database.js';

async function listRentals(req, res) {
  const querryArray = [];
  const queryCustomer = req.query.customerId;
  const queryGame = req.query.gameId;

  if (queryCustomer) {
    querryArray.push(queryCustomer);
  }
  if (queryGame) {
    querryArray.push(queryGame);
  }

  const query = `
      SELECT 
          rentals.*,
          customers.id AS cid,
          customers.name AS cname,
          games.id AS gid,
          games.name AS gname,
          games."categoryId" AS gcateid,
          categories.name AS gcatename
      FROM rentals
          JOIN customers ON rentals."customerId" = customers.id
          JOIN games ON rentals."gameId" = games.id
              JOIN categories ON games."categoryId" = categories.id
      ${queryCustomer || queryGame ? 'WHERE ' : ''}
          ${queryCustomer ? 'customers.id = $1 ' : ''}
          ${queryGame && !queryCustomer ? 'games.id = $1' : ''}
          ${queryCustomer && queryGame ? 'AND games.id = $2 ' : ''}
      ORDER BY rentals.id DESC;
  `;
  try {
    const result = await connection.query(query, querryArray);
    res.send(
      result.rows.map(
        ({
          id,
          customerId,
          gameId,
          rentDate,
          daysRented,
          returnDate,
          originalPrice,
          delayFee,
          cid,
          cname,
          gid,
          gname,
          gcateid,
          gcatename,
        }) => ({
          id,
          customerId,
          gameId,
          rentDate: dayjs(rentDate).format('YYYY-MM-DD'),
          daysRented,
          returnDate: returnDate
            ? dayjs(returnDate).format('YYYY-MM-DD')
            : null,
          originalPrice,
          delayFee,
          customer: {
            id: cid,
            name: cname,
          },
          game: {
            id: gid,
            name: gname,
            categoryId: gcateid,
            categoryName: gcatename,
          },
        })
      )
    );
  } catch (error) {
    res.status(500).send(error);
  }
}

async function postRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const rentDate = dayjs().format('YYYY-MM-DD');

  try {
    const customer = await connection.query(
      'SELECT * FROM customers WHERE id = $1;',
      [customerId]
    );
    if (!customer.rows.length) {
      return res.status(400).send('Cliente não existe');
    }

    const game = await connection.query('SELECT * FROM games WHERE id = $1;', [
      gameId,
    ]);
    if (!game.rows.length) {
      return res.status(400).send('Jogo não existe');
    }

    const checkCurrentRentals = await connection.query(
      `
        SELECT *
        FROM rentals
        WHERE "gameId" = $1 AND "returnDate" IS NULL
    ;`,
      [gameId]
    );
    if (game.rows[0].stockTotal <= checkCurrentRentals.rows.length) {
      res.status(400).send('Não existem jogos disponíveis');
    }

    const originalPrice = daysRented * game.rows[0].pricePerDay;
    await connection.query(
      `INSERT INTO rentals (
        "customerId",
        "gameId",
        "daysRented",
        "rentDate",
        "originalPrice"
        ) VALUES ($1, $2, $3, $4, $5)
    ;`,
      [customerId, gameId, daysRented, rentDate, originalPrice]
    );
    res.status(201).send('Aluguel inserido');
  } catch (error) {
    res.status(500).send(error);
  }
}

async function finishRental(req, res) {
  const { id } = req.params;

  try {
    const checkRental = await connection.query(
      'SELECT * FROM rentals WHERE id = $1',
      [id]
    );
    if (!checkRental.rows.length) {
      return res.status(404).send('Não existe aluguel');
    }

    if (checkRental.rows[0].returnDate) {
      return res.status(400).send('Aluguel já finalizado');
    }

    const returnDate = dayjs().format('YYYY-MM-DD');
    let delayFee = 0;
    const diffDates = dayjs(checkRental.rows[0].rentDate)
      .add(checkRental.rows[0].daysRented, 'day')
      .diff(returnDate, 'day');
    if (diffDates < 0) {
      delayFee =
        diffDates *
        -1 *
        (checkRental.rows[0].originalPrice / checkRental.rows[0].daysRented);
    }
    await connection.query(
      `
          UPDATE rentals 
          SET 
              "returnDate" = $2,
              "delayFee" = $3
          WHERE id = $1
      `,
      [id, returnDate, delayFee]
    );
    res.status(200).send('Aluguel finalizado');
  } catch (error) {
    res.status(500).send(error);
  }
}

async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const checkRental = await connection.query(
      'SELECT * FROM rentals WHERE id = $1',
      [id]
    );
    if (!checkRental.rows.length) {
      return res.status(404).send('Não existe aluguel');
    }

    if (checkRental.rows[0].returnDate) {
      return res.status(400).send('Aluguel já finalizado');
    }

    await connection.query('DELETE FROM rentals WHERE id = $1', [id]);
    res.status(200).send('Aluguel deletado');
  } catch (error) {
    res.status(500).send(error);
  }
}

export { listRentals, postRental, finishRental, deleteRental };
