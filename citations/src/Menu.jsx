import React, {useEffect,useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import { Link } from 'react-router-dom';

function Menu() {
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
  
  const handleLogin = () => {
    window.location.href = 'http://localhost:8081/auth/discord';
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8081/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error(`Erreur lors de la déconnexion : ${response.statusText}`);
        // Traite l'erreur de déconnexion ici
        return;
      }

      // La déconnexion a réussi, redirige l'utilisateur vers la page de connexion
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      // Traite l'erreur de déconnexion ici
    }
  };
  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
            <p className="navbar-brand">Citation APP</p>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item"><a className="nav-link active" aria-current="page" href="/">Acceuil</a></li>
                    <li className="nav-item"><a className="nav-link" href="/list">Liste citations</a></li>
                    {user ? (
                                <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" id="navbarDropdown" href="/#" role="button" data-bs-toggle="dropdown" aria-expanded="false">{user.username}</a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="/listfavori">Favori</a></li>
                                    <li><Link to="/create" className="dropdown-item">Create citation</Link></li>
                                    {user.isAdmin !== 0 && <li><Link to="/listUser" className="dropdown-item">Gérer les utilisateurs</Link></li>}
                                    <li><button className="dropdown-item" onClick={handleLogout}>Deconnexion</button></li>
                                </ul>
                                </li>
                              ) : (
                                <li className="nav-item"><button className="nav-link" onClick={handleLogin}>Se connecter avec Discord</button></li>
                              )}
                </ul>
            </div>
        </div>
        </nav>
    </div>
  );
}

export default Menu