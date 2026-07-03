const app = require('./app');



require('dotenv').config();
const { testConnection } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

testConnection();

app.listen(PORT, () => {
  console.log(`TaskFlow API listening on http://localhost:${PORT}`);
});




