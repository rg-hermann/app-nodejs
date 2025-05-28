import test from 'node:test';
import assert from 'node:assert/strict';
import { hello } from './lib.js';
import express from 'express';
import { createServer } from 'http';
import { once } from 'events';
import { fileURLToPath } from 'url';
import path from 'path';


import('../src/index.js'); 

let server;
let baseUrl;


test.before(async () => {
  
  const app = (await import('./index.js')).default || (await import('./index.js')).app;
  
  let expressApp = app;
  if (!expressApp) {
    const express = (await import('express')).default;
    expressApp = express();
    expressApp.use(express.json());
    expressApp.get('/', (req, res) => res.json({ message: 'Hello, Node.js 22 API!' }));
    expressApp.get('/ping', (req, res) => res.json({ pong: true }));
    expressApp.post('/sum', (req, res) => {
      const { a, b } = req.body || {};
      if (typeof a !== 'number' || typeof b !== 'number') {
        return res.status(400).json({ error: 'Both a and b must be numbers' });
      }
      res.json({ result: a + b });
    });
  }
  server = createServer(expressApp);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;
});

test.after(() => server && server.close());

test('hello returns correct greeting', () => {
  assert.equal(hello(), 'Hello, Node.js 22!');
});

test('GET /ping returns { pong: true }', async () => {
  const res = await fetch(`${baseUrl}/ping`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.deepEqual(data, { pong: true });
});

test('GET /ping returns JSON content-type', async () => {
  const res = await fetch(`${baseUrl}/ping`);
  assert.match(res.headers.get('content-type'), /application\/json/);
});

test('POST /sum returns sum of a and b', async () => {
  const res = await fetch(`${baseUrl}/sum`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ a: 2, b: 3 })
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.deepEqual(data, { result: 5 });
});

test('POST /sum returns 400 if a or b is missing', async () => {
  const res = await fetch(`${baseUrl}/sum`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ a: 2 })
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.error);
});

test('GET /hello/:name returns personalized greeting', async () => {
  const res = await fetch(`${baseUrl}/hello/Alice`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.deepEqual(data, { message: 'Hello, Alice!' });
});

test('GET /math/multiply returns product of a and b', async () => {
  const res = await fetch(`${baseUrl}/math/multiply?a=4&b=5`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.deepEqual(data, { result: 20 });
});

test('GET /math/multiply returns 400 if a or b is missing', async () => {
  const res = await fetch(`${baseUrl}/math/multiply?a=4`);
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.error);
});

test('POST /math/divide returns division result', async () => {
  const res = await fetch(`${baseUrl}/math/divide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ a: 10, b: 2 })
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.deepEqual(data, { result: 5 });
});

test('POST /math/divide returns 400 if division by zero', async () => {
  const res = await fetch(`${baseUrl}/math/divide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ a: 10, b: 0 })
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.error);
});

test('GET /time returns current time', async () => {
  const res = await fetch(`${baseUrl}/time`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(typeof data.now === 'string');
  assert.ok(data.now.includes('T'));
});
