import CssBaseline from '@mui/material/CssBaseline';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Posts from './pages/Posts';
import SinglePost from './pages/SinglePost';
import AppNavbar from './components/AppNavbar';
import Login from './pages/Login';
import Register from './pages/Register';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <CssBaseline />
      <div className='App'>
        <AppNavbar />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/posts' element={<Posts />} />
            <Route path='/post/:postId' element={<SinglePost />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
      </div>
    </Router>    
  );
}

export default App;
