import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { helper } from "../helper";
import { api } from "../api";

function CreatePost() {
  const navigate = useNavigate();
  const [data, setData] = useState({ title: "", text: "" });
  const [error, setError] = useState();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("id")) === null) {
      navigate("/login");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(data);
    try {
      data.title = helper.common.stringInputHandler(data.title, "Title");
      helper.common.senseValidation(data.title, "Title");
      data.text = helper.common.stringInputHandler(data.text, "Post text");
      helper.common.senseValidation(data.text, "Post text");
    } catch (e) {
        setError(e.response.data.error);
        return;
    }

    try {
        const response = await api.routes.createPost(data);
        // console.log(response.data);
        if(response.data){
          navigate('/');
        }
    } catch (error) {
        setError(e);
        return;
    }
    // navigate("/");
  };

  return (
    <div
      className="card"
      style={{
        width: "50rem",
        position: "absolute",
        marginLeft: "25%",
        marginTop: "2rem",
      }}
    >
      <div className="card-body">
        <h5 className="card-title">Create New Post</h5>
        {error && <p className="text-danger">{error}</p>}
        <br />
        <form onSubmit={handleSubmit} autoCapitalize="words" autoComplete="off">
          <TextField
            label="Title"
            onChange={(e) =>
              setData((prevData) => ({ ...prevData, title: e.target.value }))
            }
            variant="outlined"
            color="secondary"
            type="text"
            sx={{ mb: 3 }}
            fullWidth
            required
            value={data.title}
          />
          <TextField
            label="Text"
            onChange={(e) =>
              setData((prevData) => ({ ...prevData, text: e.target.value }))
            }
            variant="outlined"
            color="secondary"
            type="text"
            sx={{ mb: 3 }}
            fullWidth
            required
            value={data.text}
          />
          <Button variant="outlined" color="secondary" type="submit">
            Post
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
