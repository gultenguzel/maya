const Joi = require('joi')
const { Pool } = require('pg')
const schema = Joi.object({
  studentno: Joi.string().alphanum().min(3).max(30).required()
})
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.balanceandtotaltuition = async (req, res) => {
  var body = req.body
  const { error, value } = schema.validate(body)
  if (error) {
    res.status(400).send(error.details[0].message)
  } else {
    console.log('badi', body)
    console.log(value)
    var db = await getDbDatasForMobile(body.studentno)
    await sleep(5000)
    console.log("test",db); 
    res.send('tuition total ' + db[0].tuitionamount + " student balance " +  db[0].studentsbalance)
  }
}

 function getDBConfig() {
  const dbConfig = {
    user: 'maya',
    host: 'uniapidb.postgres.database.azure.com',
    database: 'unidb',
    password: 'Gulten.5515253',
    port: 5432,
    ssl: true
  }
  return dbConfig
}


getDbDatasForMobile = async (studentno) => {
  const dbConf = getDBConfig()
  const pool = new Pool(dbConf)
  const queryParams = [studentno];
  const queryText = "SELECT s.studentid, s.studentsbalance, t.tuitionamount FROM students AS s JOIN studenttuition AS t ON s.studentid = t.studentid WHERE s.studentid = $1;"; 
  try {
    const res = await pool.query(queryText, queryParams);
    console.log('mobile:', res.rows);
    return res.rows;
  } catch (err) {
    console.error('Bağlantı hatası:', err.stack);
    throw err;
  } finally {
    await pool.end()
  }
}


