import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import UseScrollToTop from './hooks/useScroll.jsx';



createRoot(document.getElementById('root')).render(
<BrowserRouter basename='/Movies4Home'>
<UseScrollToTop/>
    <App />
</BrowserRouter>,
)
