import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'


function ListFavori() {
  const [data, setData] = useState([])
    useEffect(()=>{
        axios.get('http://localhost:8081/listfavori')
        .then(res=>setData(res.data))
        .catch(err=>console.log(err));
    }, [])

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
          <div className="row row-cols-1 row-cols-sm-3 row-cols-md-3 g-3">
          {filteredCitations.map((citation,index) => {
            return <div className="col" key={index}>
            <div>
              <div className="card-body citation-col h-100 p-4 bg-light border rounded-3">
                <p className="card-text">{citation.contenu}</p>
                <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                  <Link to={`/read/${citation.id}`} className='btn btn-sm btn-outline-secondary'>Read</Link>
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

export default ListFavori