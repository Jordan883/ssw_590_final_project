import React, {useState, useEffect} from 'react';
import { TextField, Button, Container, Stack } from '@mui/material';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { helper } from "../helper";
import { api } from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [hasError, setHasError] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))) {
      navigate("/");
    }
  }, []);

  const validateRegister = async (e) => {
    e.preventDefault();
    try {
      setUsername(helper.common.usernameHandler(username));
      setPassword(helper.common.isValidPassword(password));
      setConfirmPassword(helper.common.isEqualPassword(password, confirmPassword));
    } catch (e) {
      setError(e.response.data.error);
      return;
    }

    try {
      const data = {"username" : username, "password" : password}
      const response = await api.routes.register(data);
      // console.log(response.data);
      localStorage.setItem('id',JSON.stringify(response.data._id));
      navigate("/");
    } catch (e) {
      setError(e.response.data.error);
      return;
    }
  }

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
          <h5 className="card-title">Register</h5>
          <br />
          <form onSubmit={validateRegister} id="register-form">
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
            <TextField
              label="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              variant="outlined"
              color="secondary"
              type="password"
              value={confirmPassword}
              fullWidth
              sx={{ mb: 3 }}
            />
            <Button variant="outlined" color="secondary" type="submit">
              Register
            </Button>
            <br />
            <br />
            <small>
              Already have an account? <Link to="/login ">Login</Link>
            </small>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register