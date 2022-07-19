// ./database/db-connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'CS467_tungh',
  password        : '3892',
  database        : 'CS467_tungh'
});

// Export it for use in our applicaiton
module.exports.pool = pool;
