const express = require('express');
const redis = require('redis');

const app = express();

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const APP_PORT = process.env.PORT || 4000;

const client = redis.createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

client.connect();

client.on('error', (err) => {
  console.log('Redis error:', err);
});

/* ✅ HEALTHCHECK ROUTE (NEW) */
app.get('/health', async (req, res) => {
  try {
    await client.ping();
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send('NOT OK');
  }
});

/* Existing route */
app.get('/', async (req, res) => {
  let visits = await client.get('visits');
  if (!visits) visits = 0;
  visits = Number(visits) + 1;
  await client.set('visits', visits);
  res.send(`Number of visits: ${visits}`);
});

app.listen(APP_PORT, () => {
  console.log(`App running on port ${APP_PORT}`);
});

