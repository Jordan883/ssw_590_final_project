import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { helper } from "../helper";
import { TextField, FormControl, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))) {
      navigate("/");
    }
  }, []);

  const validateLogin = async (e) => {
    e.preventDefault();
    try {
      setUsername(helper.common.usernameHandler(username));
      setPassword(helper.common.isValidPassword(password));
      setError();
    } catch (e) {
      setError(e.response.data.error);
      return;
    }

    try {
      const data = {"username" : username, "password" : password}
      const response = await api.routes.login(data);
      // console.log(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate("/");
    } catch (e) {
      setError(e.response.data.error);
      return;
    }
  };

  return (
    <div>
      <div
        className="card"
        style={{
          width: "80rem",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "10rem",
        }}
      >
        {error ? <h5 className="card-header error">{error}</h5> : ""}
        <div className="card-body">
          <h5 className="card-title">Login</h5>
          <br />
          <form onSubmit={validateLogin} id="login-form">
            <TextField
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
              variant="outlined"
              color="secondary"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
              value={username}
            />
            <TextField
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
              color="secondary"
              type="password"
              value={password}
              fullWidth
              sx={{ mb: 3 }}
            />
            <Button variant="outlined" color="secondary" type="submit">
              Login
            </Button>
            <br />
            <br />
            <small>
              Don't have an account? <Link to="/register ">Register</Link>
            </small>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
