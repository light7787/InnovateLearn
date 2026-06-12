import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './Components/Navbar.jsx';
import Test from './Subjects/C++/Test.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';





createRoot(document.getElementById('root')).render(
 <BrowserRouter>


 <Navbar/>

 
     <App />
   
 </BrowserRouter>

 
)
