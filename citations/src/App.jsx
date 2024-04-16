import React,{ useEffect, useState }  from 'react'
import Menu from './Menu';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Home';
import 'bootstrap/dist/css/bootstrap.min.css'
import Create from './Create';
import Read from './Read';
import Edit from './Edit';
import List from './List';
import ListFavori from './ListFavori';
import ListUser from './ListUser';
import axios from 'axios';


function App() {
  const [data, setData] = useState([])
  useEffect(()=>{
      axios.get('http://localhost:8081/veriftoken')
      .then(res=>setData(res.data))
      .catch(err=>console.log(err));
  }, [])
  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8081/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error(`Erreur lors de la déconnexion : ${response.statusText}`);
        // Traite l'erreur de déconnexion
        return;
      }

      // La déconnexion a réussi, redirige l'utilisateur vers la page de connexion
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      // Traite l'erreur de déconnexion ici
    }
  };
  if(data !=null )
  {
    if(data.exp < Math.floor(Date.now() / 1000))
    {
      logout();
    }
  }
  return (
    <BrowserRouter>
    <Menu/>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create' element={<Create />} /> 
            <Route path='/read/:id' element={<Read />} /> 
            <Route path='/edit/:id' element={<Edit />} /> 
            <Route path='/list' element={<List/>} /> 
            <Route path='/listfavori' element={<ListFavori/>} />
            <Route path="/listUser" element={<ListUser/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App