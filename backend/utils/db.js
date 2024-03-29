import mysql from "mysql2";

//first create database called signup in mysql 
var dbConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup",
  
});
// database connection
dbConnection.getConnection(function (err, connection) {
  if (!err) {
    console.log("Database connected successfully");
  } else {
    console.log({connection:"Database connection Unsuccessful"});
  }
});

//create table in the database
const users = `CREATE TABLE if not exists users(
  id int auto_increment,
  name varchar(255) not null,
  email varchar(255) not null,
  password varchar(255) not null,
  role INT NULL,
  PRIMARY KEY (id)
)`;
// check table creation is ok
dbConnection.query(users, (err, result) => {
  if (err) {
    console.log("Error creating users table");
  } else {
    console.log("Users table created");
  }
    });

export default dbConnection;