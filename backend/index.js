import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dbConnection from "./utils/db.js";

const saltRounds = 10;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Wrong Token" });
      } else {
        req.name = decoded.name;
        req.email = decoded.email;
        req.role = decoded.role;
        next();
      }
    });
  }
};

// app.get("/", verifyUser, (req, res) => {
//   return res.json({ Status: "Success" });
// });

app.get("/", verifyUser, (req, res) => {
  return res.json({
    Status: "Success",
    name: req.name,
    email: req.email,
    role: req.role,
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO users (`name`,`email`,`password`) VALUES (?)";
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      return res.json({ Error: "Error hashing password" });
    }
    const values = [name, email, hashedPassword];
    dbConnection.query(sql, [values], (err, data) => {
      if (err) {
        return res.json({ Error: "Error in registering user" });
      }
      return res.json({ Status: "Success" });
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  dbConnection.query(sql, [email], (err, data) => {
    if (err) {
      return res.json({ Error: "Login query error" });
    }
    if (data.length > 0) {
      bcrypt.compare(password, data[0].password, (err, response) => {
        if (err) {
          return res.json({ Error: "Password compare error" });
        }
        if (response) {
          const { name, email, role } = data[0];
          const token = jwt.sign({ email, name, role }, "jwt-secret-key", {
            expiresIn: "1d",
          });
          res.cookie("token", token);
          return res.json({ Status: "Success", role });
        } else {
          return res.json({ Error: "Password not matched" });
        }
      });
    } else {
      return res.json({ Error: "No such email exists" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});