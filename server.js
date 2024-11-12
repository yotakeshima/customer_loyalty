import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();

app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  uesr: '',
  host: '',
  database: '',
  password: '',
  port: 5432,
});

db.connect();

app.get('/loyaltyfirst/login', async (req, res) => {
  const { user, pass } = req.query;

  if (!user || !pass) {
    return res.status(400).send('Username and password is required');
  }

  try {
    const result = await db.query(
      'SELECT id, password FROM login WHERE user = $1',
      [user]
    );

    if (result.rows.length === 0) {
      return res.send('No user found');
    }

    const customer = result.rows[0];

    const isPasswordValid = await bcrypt.compare(pass, customer.password);
    if (isPasswordValid) {
      res.send(`Valid: ${customer.id}`);
    } else {
      res.send('No');
    }
  } catch (err) {
    console.error('Error durring login', err);
    res.status(500).send('Internal server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
