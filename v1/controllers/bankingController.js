const Joi = require('joi')
const { Pool } = require('pg')

const schemaTotalTuition = Joi.object({
  studentno: Joi.string().alphanum().min(3).max(30).required()
})
const schemaPayTuition = Joi.object({
  studentno: Joi.string().alphanum().min(3).max(30).required(),
  term: Joi.string().alphanum().min(3).max(30).required()
})
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.balanceandtotaltuition = async (req, res) => {
  var body = req.body
  const { error, value } = schemaTotalTuition.validate(body)
  if (error) {
    res.status(400).send(error.details[0].message)
  } else {
    console.log('badi', body)
    console.log(value)
    var db = await getDbDatasForTotal(body.studentno)
    await sleep(5000)
    console.log('test', db)
    res.send(
      'tuition total ' +
        db[0].tuitionamount +
        ' student balance ' +
        db[0].studentsbalance
    )
  }
}
exports.payTuition = async (req, res) => {
  var body = req.body
  const { error, value } = schemaPayTuition.validate(body)
  if (error) {
    res.status(400).send(error.details[0].message)
  } else {
    console.log('badi', body)
    console.log(value)
    var db = await getDbDatasForPayTuition(body.studentno,body.term)
    await sleep(5000)
    if (db) {
      res.send('Success')
    } else {
      res.send('failed')
    }
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

getDbDatasForPayTuition = async (studentno, term) => {
  var studentBalance = 0
  var tuitionAmount = 0
  var totalBalance = 0
  const dbConf = getDBConfig()
  const pool = new Pool(dbConf)
  const queryText1 = `
  select * from students where studentid = $1 and studentsterm = $2
  `
  const queryText2 = ' select * from studenttuition where studentid = $1 '
  const queryParams = [studentno, term]
  const queryParams2 = [studentno]

  try {
    const res1 = await pool.query(queryText1, queryParams)
    if (res1.rows.length > 0) {
      studentBalance = res1.rows[0].studentsbalance

      const res2 = await pool.query(queryText2, queryParams2)
      console.log('res2', res2.rows)
      if (res2.rows.length > 0) {
        tuitionAmount = res2.rows[0].tuitionamount
        console.log('tuitionAmount', tuitionAmount)
        if (studentBalance >= tuitionAmount) {
          totalBalance = studentBalance - tuitionAmount
          tuitionAmount = 0
          const queryParams3 = [totalBalance, studentno]
          console.log('queryParams3', queryParams3)
          const queryText3 =
            'UPDATE students SET studentsbalance = $1 where studentid = $2'
          const queryParams4 = [0, studentno]
          const queryText4 =
            'UPDATE studenttuition SET tuitionamount = $1 where studentid = $2'
          const res3 = await pool.query(queryText3, queryParams3)
          const res4 = await pool.query(queryText4, queryParams4)
          if (res3.rowCount > 0 && res4.rowCount > 0) {
            return true
          } else {
            return false
          }
        }
      }
    }

    return 'harika'
  } catch (err) {
    console.error('Bağlantı hatası:', err.stack)
    throw err
  } finally {
    await pool.end() // Pool'i sonlandır
  }
}

getDbDatasForTotal = async (studentno) => {
  const dbConf = getDBConfig()
  const pool = new Pool(dbConf)
  const queryParams = [studentno]
  const queryText =
  'SELECT s.studentid, s.studentsbalance, t.tuitionamount FROM students AS s JOIN studenttuition AS t ON s.studentid = t.studentid WHERE s.studentid = $1;'
try {
  const res = await pool.query(queryText, queryParams)
  console.log('Banking:', res.rows)
  return res.rows
} catch (err) {
  console.error('Bağlantı hatası:', err.stack)
  throw err
}
}