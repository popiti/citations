import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ListUser() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Effectue une requête au serveur pour obtenir la liste des utilisateurs
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8081/listUser');
                setUsers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération de la liste des utilisateurs', error);
            }
        };

        fetchUsers();
    }, []);

    const handleLogout = (iduser) => {
        axios.post(`http://localhost:8081/logout-user/${iduser}`)
            .then((res) => {
                console.log(res.data.message);
                // Mets à jour la liste des utilisateurs après la déconnexion
                setUsers(users.filter(user => user.userID !== iduser));
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="container">
            <h2>Liste des Utilisateurs</h2>
            <ul className="list-group">
                {users.map((user, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {user.username}
                        <button onClick={() => handleLogout(user.userID)} className="btn btn-sm btn-outline-secondary">
                            Déconnecter
                        </button>
                    </li>
                ))}
            </ul>
            <Link to="/list" className="btn btn-primary mt-3">
                Retour à la liste des citations
            </Link>
        </div>
    );
}

export default ListUser;
