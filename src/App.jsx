import { Router,Route,Routes } from 'react-router-dom';
import './App.css'
import Header from './components/header';
import Home from './pages/home';
import Library from './pages/library';
import Register from './pages/register';
import LogIn from './pages/login';
import Profile from './pages/profile';

function App() {

    return (
        <>
        <Header/>
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/library' element={<Library/>}/>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/signup' element={<LogIn/>}></Route>
        </Routes>
        </>
    );
}


export default App
