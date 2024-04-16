import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

function List() {
  const [data, setData] = useState([])
    useEffect(()=>{
        axios.get('http://localhost:8081/list')
        .then(res=>setData(res.data))
        .catch(err=>console.log(err));
    }, [])
    const handleFavori= (id)=> {
      axios.post('http://localhost:8081/ajoutfavori/'+id)
      .then(res =>{
        window.location.reload();
      })
      .catch(err=>console.log(err));
    }
    const handleDeleteCitation= (id)=> {
      axios.delete('http://localhost:8081/deleteCitation/'+id)
          .then(res =>{
            window.location.reload();
          })
          .catch(err=>console.log(err));
    }
      // Fonction pour changer l'état du bouton
    const handleDelete= (id)=> {
        axios.delete('http://localhost:8081/deletefavori/'+id)
        .then(res =>{
          window.location.reload();
        })
        .catch(err=>console.log(err));
      }
      const [user, setUser] = useState(null);
      useEffect(() => {
        // Effectue une requête au serveur pour obtenir les informations de l'utilisateur
        const fetchUser = async () => {
          try {
            const response = await fetch('http://localhost:8081/api/user', {
              method: 'GET',
              credentials: 'include',
            });
    
            const data = await response.json();
            setUser(data.user);
          } catch (error) {
            console.error('Erreur lors de la récupération des informations utilisateur', error);
          }
        };
    
        fetchUser();
      }, []);
      
      const [searchTerm, setSearchTerm] = useState('');
      const handleSearch = (e) => {
        setSearchTerm(e.target.value);
      };
    
      const filteredCitations = data.filter(citation =>
        citation.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        citation.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
  return (
    <div className='container'>
        <div className='row m-4'>
          <div className='col-md-6'>
            <h2> Citation List</h2>
          </div>
          <div className="search-bar col-md-6" >
            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={handleSearch} />
          </div>
        </div>
        <div className='d-flex justify-content-end m-2'>
        {user ? (
          <Link to="/create" className='btn btn-sm btn-outline-secondary'>Ajouter citation </Link>
        ):(<div/>)}
        </div>
          <div className="row row-cols-1 row-cols-sm-3 row-cols-md-3 g-3">
          {filteredCitations.map((citation,index) => {
            return <div className="col" key={index}>
            <div>
              <div className="card-body citation-col h-100 p-4 bg-light border rounded-3">
                <p className="card-text">{citation.contenu}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="btn-group">
                  <Link to={`/read/${citation.id}`} className='btn btn-sm btn-outline-secondary'>Read</Link>
                  {user && user.isAdmin !== 0 && (
                        <button onClick={() => handleDeleteCitation(citation.id)} className='btn btn-sm btn-outline-secondary'>Delete</button>
                    )}
                  {user && (
                    <div>
                      {citation.nbr>0 && 
                      (
                        <button onClick={() => handleDelete(citation.id)} className='btn btn-sm btn-outline-secondary'><FaHeart/></button>
                      )
                    }
                    {citation.nbr===0 &&
                        (
                        <button onClick={() => handleFavori(citation.id)} className='btn btn-sm btn-outline-secondary'><FaRegHeart/></button>
                        )
                    }
                    </div>      
                          )
                  }
                  </div>
                  <small className="text-muted">{citation.username}</small>
                </div>
              </div>
            </div>
          </div>
          })
        }
        </div>
    </div>
  )
}

export default List