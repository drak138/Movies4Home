import { Router,Route,Routes } from 'react-router-dom';
import './App.css'
import Header from './components/header';
import Home from './pages/home';
import Library from './pages/library';

function App() {

    return (
        <>
        <Header/>
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/library' element={<Library/>}/>
        </Routes>
        </>
    );
}


export default App
