import {Route,Routes } from 'react-router-dom';
import './App.css'
import Header from './components/header';
import Home from './pages/home';
import Library from './pages/library';
import Register from './pages/register';
import LogIn from './pages/login';
import Profile from './pages/profile';
import Movie from './pages/movie';
import Search from './pages/search';
import useAuthExpiration from './utils/authExparation.js';

function App() {
    useAuthExpiration()

    return (
        <>
        <Header/>
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/search/:query/:page' element={<Search/>}/>
        <Route path='/watch/:mediaType/:title/:id' element={<Movie/>}/>
        <Route path="/watch/:mediaType/:title/:id/season/:season/episode/:episode" element={<Movie/>}/>
        <Route path='/library' element={<Library/>}/>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/signup' element={<LogIn/>}></Route>
        </Routes>
        </>
    );
}


export default App
