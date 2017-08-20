const username = process.env.PH_DB_USERNAME || ''
const password = process.env.PH_DB_PASSWORD || ''
const host = process.env.PH_DB_HOST || 'localhost/ph'
const database = {
  //url: `mongodb://${username}:${password}@localhost/ph`,
  url: `mongodb://localhost/ph`
}

module.exports = database