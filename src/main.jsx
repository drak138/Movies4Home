import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'; // Use HashRouter instead of BrowserRouter
import UseScrollToTop from './hooks/useScroll.jsx';
import { AuthProvider } from "./context/authContext"; // Import your AuthProvider




createRoot(document.getElementById('root')).render(
<HashRouter>
<UseScrollToTop/>
<AuthProvider>
    <App />
</AuthProvider>
</HashRouter>,
)
