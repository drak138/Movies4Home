import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, HashRouter } from 'react-router-dom'; // Use HashRouter instead of BrowserRouter
import UseScrollToTop from './hooks/useScroll.jsx';
import { AuthProvider } from "./context/authContext"; // Import your AuthProvider
import { DownloadCount } from './context/donwloadContext.jsx';




createRoot(document.getElementById('root')).render(
<HashRouter>
<AuthProvider>
<DownloadCount>
<UseScrollToTop/>
    <App />
</DownloadCount>
</AuthProvider>
</HashRouter>,
)
