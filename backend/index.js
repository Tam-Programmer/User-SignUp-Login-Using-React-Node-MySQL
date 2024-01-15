import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dbConnection from "./utils/db.js";
const salt = 10;

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// we have to verify the user before login
const verifyUser = (req, res, next) => {
    const token = req.cookies.token; // the name of the cookie is token (as we set it in /login above)
    if (!token) {
      return res.json({Error: "You are not authenticated" })
    } else {
      //check if it is a valid token( generated in the login)
      jwt.verify(token, "jwt-secret-key", (err , decoded) => {
          if(err) {
              return res.json({Error: "Wrong Token"})
          }else{
              req.name = decoded.name; //this decoded name is the name used to sign the token (see /login above)
              req.email =decoded.email;
              next();
          }
         
      })
    }
  };
  app.get("/", verifyUser, (req, res) => {
      return res.json({Status: "Success", name: req.name, email:req.email})
  });
  

app.post("/register", (req, res) => {
  const sql = "INSERT INTO users (`name`,`email`,`password`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hashedPassword) => {
    if (err) return res.json({ Error: "error hashing password" });
    const values = [req.body.name, req.body.email, hashedPassword];
    dbConnection.query(sql, [values], (err, data) => {
      if (err) return res.json({ Error: "error in registering user" });
      return res.json({ Status: "Success" });
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * from users Where email = ?";
  dbConnection.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "login query error" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "password compare error" });
          if (response) {
            const name = data[0].name;
            const email = data[0].email;
            const token = jwt.sign({email,name }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            return res.json({ Status: "Success" });
          } else {
            return res.json({ Error: "password not matched" });
          }
        }
      );
    } else {
      return res.json({ Error: "No such email existed" });
    }
  });
});
 app.get('/logout',(req,res) =>{
    res.clearCookie('token');
    return res.json({Status:"Success"});
 })

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
