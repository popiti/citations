import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Home() {

  const [data, setData] = useState([])
  useEffect(()=>{
      axios.get('http://localhost:8081/')
      .then(res=>setData(res.data))
      .catch(err=>console.log(err));
  }, [])
  return (
    <div>
        <div className="container">
            <div className="text-center mt-5">
                <h1>Bienvenu sur notre site de citations</h1>
                <p className="lead">Un projet réalisé par Walid EL MEJJAD, Ephraïm MIDEKOR, Harry LECLANCHER.</p>
                <p className="lead">Pour commencer vous pouvez consulter la liste des citations disponibles.</p>
            </div>
            <div className="mt-5">
                <h1>Fonctionnalités disponibles </h1>
                <p className="lead">Pour utiliser toutes les fonctionnalités du site, il vous faudra vous connecter avec un compte discord.</p>
                <ul className="lead">Listes des fonctionnalités : </ul>
                  <li>
                    <p> Pouvoir ajouter votre propre citation;</p>
                  </li>
                  <li>
                  <p> Ajouter des citations dans vos favoris et pouvoir les consulter.</p>
                  </li>
            </div>
            <div className="row row-cols-1 row-cols-sm-3 row-cols-md-3 g-3">
          {data.map((citation,index) => {
            return <div className="col" key={index}>
            <div>
              <div className="card-body citation-col h-100 p-4 bg-light border rounded-3">
                <p className="card-text">{citation.contenu}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">{citation.username}</small>
                </div>
              </div>
            </div>
          </div>
          })
        }
          </div>
          <div className="row">
                    <a href='/list' className='btn-home btn-outline-secondary'>Voir plus ...</a>
          </div>
        </div>
    </div>
  )
}

export default Home