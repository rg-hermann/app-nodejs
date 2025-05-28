
import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, Node.js 22 API!' });
});

app.get('/ping', (req, res) => {
  res.json({ pong: true });
});

app.post('/sum', (req, res) => {
  const { a, b } = req.body || {};
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'Both a and b must be numbers' });
  }
  res.json({ result: a + b });
});

app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  res.json({ message: `Hello, ${name}!` });
});

app.get('/math/multiply', (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Both a and b must be numbers' });
  }
  res.json({ result: a * b });
});

app.post('/math/divide', (req, res) => {
  const { a, b } = req.body || {};
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'Both a and b must be numbers' });
  }
  if (b === 0) {
    return res.status(400).json({ error: 'Division by zero' });
  }
  res.json({ result: a / b });
});

app.get('/time', (req, res) => {
  res.json({ now: new Date().toISOString() });
});

export default app;
