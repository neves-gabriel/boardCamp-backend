import connection from '../database/database.js';

async function listCustomers(req, res) {
  const { cpf } = req.query;

  try {
    if (cpf) {
      const result = await connection.query(
        `
                SELECT * FROM customers WHERE cpf LIKE $1
            `,
        [`${cpf}%`]
      );

      res.send(result.rows);
    }

    const result = await connection.query(`
            SELECT * FROM customers
        `);

    res.send(result.rows);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function postCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const { rows: customer } = await connection.query(
      `
            SELECT * FROM customers WHERE cpf = ( $1 )
        `,
      [cpf]
    );

    if (customer.length > 0) {
      return res.status(409).send('Cliente já existente');
    }

    await connection.query(
      `
            INSERT INTO customers ( name, phone, cpf, birthday ) VALUES ( $1, $2, $3, $4 )
        `,
      [name, phone, cpf, birthday]
    );

    res.status(201).send('Cliente inserido');
  } catch (error) {
    res.status(500).send(error);
  }
}

async function selectCustomer(req, res) {
  const { id } = req.params;

  try {
    const customerById = await connection.query(
      `
            SELECT * FROM customers WHERE id = ( $1 )
        `,
      [id]
    );

    if (customerById.rows.length === 0) {
      return res.status(404).send('Cliente não existe');
    }

    res.send(customerById[0]);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function updateCustomer(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  try {
    const { rows: customer } = await connection.query(
      `
            SELECT * FROM customers WHERE id=$1
        `,
      [id]
    );

    const { rows: cpfCustomer } = await connection.query(
      `
            SELECT id FROM customers WHERE cpf=$1
        `,
      [cpf]
    );

    if (cpfCustomer.length > 0 && cpf !== customer[0].cpf) {
      return res.status(409).send('Cliente já existente');
    }

    await connection.query(
      `
            UPDATE customers
            SET name = $1, cpf = $2, phone = $3, birthday = $4 
            WHERE id=$5
        `,
      [name, cpf, phone, birthday, id]
    );

    res.status(200).send('Cliente Atualizado');
  } catch (error) {
    res.status(500).send(error);
  }
}

export { listCustomers, postCustomer, selectCustomer, updateCustomer };
