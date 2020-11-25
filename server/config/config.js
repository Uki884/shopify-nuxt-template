let database = process.env.DB_NAME || 'shopify_db';
let username = process.env.DB_USER || 'postgres';
let password = process.env.DB_PASSWORD || 'password';
let host = process.env.DB_HOST || 'db';
let port = process.env.DB_PORT || '5432';
console.log(port, username, database);

module.exports = {
  development: {
    username: username,
    password: password,
    database: database,
    host: host,
    port: port,
    dialect: "postgres"
  },
  test: {
    username: username,
    password: password,
    database: database,
    host: "127.0.0.1",
    port: port,
    dialect: "postgres"
  },
  production: {
    username: username,
    password: password,
    database: database,
    host: host,
    port: port,
    dialect: "postgres"
  }
}
