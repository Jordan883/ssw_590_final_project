import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from "@mui/material";
import banner from '../assets/images/banner.jpg';
let card = null;

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    // console.log(JSON.parse(localStorage.getItem("id")));
    if (JSON.parse(localStorage.getItem("id")) === null) {
      navigate("/login");
    } 
    const fetch = async () => {
      try {
        const response = await api.routes.getAllPosts();
        // console.log(response.data);
        setPosts(posts.concat(response.data));
        // console.log(posts);
      } catch (error) {
        setError(error);
        return;
      }     
    }
    fetch();
  }, []);

  const buildCard = (post) => {
    return(
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={post._id}>
        <Card
          variant='outlined'
          sx={{
            maxWidth: 250,
            height: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 5,
            border: '1px solid #1e8678',
            boxShadow:
              '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
          }}
        >
          <CardActionArea>
            <Link to={`/posts/${post._id}`} style={{textDecoration: 'none'}}>
              <CardMedia
                sx={{
                  height: '100%',
                  width: '100%'
                }}
                component='img'
                image={
                  banner
                }
                title='show image'
              />
              <CardContent>
                <Typography
                  sx={{
                    borderBottom: '1px solid #1e8678',
                    fontWeight: 'bold'
                  }}
                  gutterBottom
                  variant='h6'
                  component='h3'
                >
                  {post.title}
                </Typography>
                <Typography
                  sx={{
                    borderBottom: '1px solid #1e8678',
                    fontWeight: 'bold'
                  }}
                  gutterBottom
                  variant='h6'
                  component='h3'
                >
                  {post.ingredients}
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    )
  }

  card = posts && posts.map((post) => {
    return buildCard(post);
  })

  return <div>
    <div style={{margin: '2em'}}>
        {error && (
          <div>
            <h2>404 - Posts list not found! You're all out of Posts!</h2>
          </div>
        )}
        <br />
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: 'row'
          }}
        >
          {card}
        </Grid>
      </div>
  </div>;
}

export default Home;
