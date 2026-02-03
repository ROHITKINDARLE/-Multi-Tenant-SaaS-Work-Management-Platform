const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

console.log('ENV CHECK:', {
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
});

require('./config/db');

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const redis = require('./config/redis');

// Every 30 minutes
setInterval(() => {
  redis.publish('automation:run', 'go');
}, 1000 * 60 * 30);
