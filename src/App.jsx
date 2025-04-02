import {Navigate, Route,Routes } from 'react-router-dom';
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
import { GuestRoute, InviteGuard, ProtectedRoute } from './utils/protectedRoute.jsx';
import InviteMember from './utils/inviteMember.jsx';
import Footer from './components/footer.jsx';

function App() {
    useAuthExpiration()

    return (
        <>
        <Header/>
        <Routes>
        {/* Guest can access but once logged can't */}
        <Route element={<GuestRoute/>}>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/signup' element={<LogIn/>}></Route>
        </Route>

        {/* only user can access guest can't */}
        <Route element={<ProtectedRoute/>}>
        <Route path='/library' element={<Library/>}/>
        <Route path='/profile' element={<Profile/>}></Route>
        </Route>
        {/* everyone can access */}
        <Route path='/' element={<Home/>}/>
        <Route path='/search/:query/:page' element={<Search/>}/>
        <Route path='/watch/:mediaType/:title/:id' element={<Movie/>}/>
        <Route path="/watch/:mediaType/:title/:id/season/:season/episode/:episode" element={<Movie/>}/>
        <Route path="*" element={<Navigate to="/" replace />}/>

        {/* specifically for invites */}
        <Route element={<InviteGuard/>}>
        <Route path="/library/invite/:inviteToken" element={<InviteMember/>}/>
        </Route>
        </Routes>
        <Footer/>
        </>
    );
}


export default App
