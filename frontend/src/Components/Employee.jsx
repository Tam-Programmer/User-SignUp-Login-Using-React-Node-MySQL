import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Employee() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true; // to store cookies

  useEffect(() => {
    axios
      .get("http://localhost:3000/")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
          setEmail(res.data.email);
          setRole(res.data.role);
          // navigate('/')
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = () => {
    axios.get('http://localhost:3000/logout')
    .then(() => {
      location.reload(true); // reload from the server side
    })
    .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4">
      {auth ? (
        <div>
          <div>
            <h3>Hello {name} - You are our employee</h3>
            <h5>Your email is :{email}</h5>
            <h5>Your role is :{role}</h5>
          </div>
          <button className="btn btn-danger" onClick={handleDelete}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <div>
            <h3>{message}</h3>
          </div>
          <h3>Login to get access</h3>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default Employee;