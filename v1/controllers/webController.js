const Joi = require('joi')
const { Pool } = require('pg')
const unpaidTuitionStatusschema = Joi.object({
  term: Joi.string().required()
})
const addTuitionschema = Joi.object({
  term: Joi.string().required(),
  studentno: Joi.string().alphanum().min(3).max(30).required()
})

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.addTuition = async (req, res) => {
  try {
    
    const { studentno, term } = req.body
 
    const { error, value } = addTuitionschema.validate({ studentno, term })
    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    
    let tuitionAmount = 0
    if (term === 'spring') {
      tuitionAmount = 100
    } else if (term === 'fall') {
      tuitionAmount = 150
    }

    var db = getDbDatasForWebAdd(studentno, term, tuitionAmount)
   
    return res.status(200).json({
      message: 'Öğrenim ücreti ödemesi başarıyla eklendi.',
      tuition: tuitionAmount
    })
  } catch (error) {
    
    console.error('Öğrenim ücreti eklenirken bir hata oluştu:', error)
    return res
      .status(500)
      .json({ error: 'Öğrenim ücreti eklenirken bir hata oluştu.' })
  }
}

exports.unpaidTuitionStatus = async (req, res) => {
  var body = req.body
  const { error, value } = unpaidTuitionStatusschema.validate(body)
  if (error) {
    res.status(400).send(error.details[0].message)
  } else {
    console.log('badi', body)
    console.log(value)
    var db = await getDbDatasForWebUnpaid(body.term)
    await sleep(5000)
    console.log('test', db)
    res.send(db)
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
getDbDatasForWebUnpaid = async term => {
  const dbConf = getDBConfig()
  const pool = new Pool(dbConf)
  const queryParams = [term]
  console.log('queryParams:', queryParams)

  const queryText =
    'SELECT s.* FROM students s INNER JOIN studenttuition t ON s.studentid = t.studentid WHERE s.studentsterm = $1 AND t.tuitionstatus = false;  '
  try {
    const res = await pool.query(queryText, queryParams)
    console.log('Bağlantı başarılı:', res.rows)

    return res.rows
  } catch (err) {
    console.error('Bağlantı hatası:', err.stack)
    throw err
  } finally {
    await pool.end()
  }
}

getDbDatasForWebAdd = async (studentno, term, tuitionAmount) => {
  const dbConf = getDBConfig()
  const pool = new Pool(dbConf)
  const queryParams = [ studentno, tuitionAmount]
  console.log('queryParams:', queryParams)

  const queryText =
    'SELECT * FROM students WHERE studentid = $2 AND studentsterm = $1;'
  const queryText2 =
    'UPDATE studenttuition SET tuitionamount = tuitionamount + $1 WHERE studentid = $2 ;'
  try {
    const res = await pool.query(queryText, [term, studentno])
    console.log('acaca',res.rows);
    if (res.rows.length > 0) {
      console.log('asascad');
      const res2 = await pool.query(queryText2,queryParams )
      console.log('sfsd',res2);
    }
    console.log('Bağlantı başarılı:', res.rows)

    return res.rows
  } catch (err) {
    console.error('Bağlantı hatası:', err.stack)
    throw err
  } finally {
    await pool.end()
  }
}
