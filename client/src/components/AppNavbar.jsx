import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function AppNavbar() {
  const [user, setUser] = useState();
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))) {
      setUser(localStorage.getItem("user"));
    }
  }, []);

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container fluid>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Navbar.Brand>DevOps Application</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{
              maxHeight: "100px",
              position: "absolute",
              right: "10px",
              top: "4px",
            }}
            navbarScroll
          >
            {user ? (
              <>
                <Link to="/logout" style={{ textDecoration: "none" }}>
                  <p className="nav-link">Logout</p>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <p className="nav-link">Login</p>
                </Link>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <p className="nav-link">Register</p>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
