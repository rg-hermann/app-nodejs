// Entry point
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, Node.js 22 API!' });
});

// Novo endpoint: GET /ping
app.get('/ping', (req, res) => {
  res.json({ pong: true });
});

// Novo endpoint: POST /sum
app.post('/sum', (req, res) => {
  const { a, b } = req.body || {};
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'Both a and b must be numbers' });
  }
  res.json({ result: a + b });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
