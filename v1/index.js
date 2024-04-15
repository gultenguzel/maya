const express = require('express')
const app = express()
const bankingRouter = require('./routers/bankingRouter.js')
const webRouter = require('./routers/webRouter.js')
const mobileRouter = require('./routers/mobileRouter.js')
const { Pool } = require('pg');

async function getDBConfig() {
  const dbConfig = {
    user: "maya",
    host: "uniapidb.postgres.database.azure.com",
    database: "unidb",
    password: "Gulten.5515253",
    port: 5432,
    ssl: true
  };
  return dbConfig;
}

app.use('/api/banking', bankingRouter)
app.use('/api/web', webRouter)
app.use('/api/mobile', mobileRouter)

app.get('/', function (req, res) {
  res.send('Hello World')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
  try {
    const dbConf = await getDBConfig()
    const pool = new Pool(dbConf);
    const result = await pool.query(' SELECT * FROM students JOIN studenttuition ON students.id::TEXT = studenttuition.studentid', (err, res) => {
      if (err) {
        console.error('Bağlantı hatası:', err.stack);
      } else {
        console.log('Bağlantı başarılı:', res.rows);
      }
    });
    
    console.log(result);

  } catch { } 
})
