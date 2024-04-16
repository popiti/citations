import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Create() {
  const [values, setValues]= useState({
    contenu:'',
  })
  const navigate=useNavigate();
  const handleSubmit =(e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/ajoutcitation', values)
    .then(res=>{
        console.log(res);
        navigate('/list')
    })
    .catch(err=>console.log(err));
  }
  return (
    <div className='d-flex justify-content-center align-items-center'>
        <div className='w-50 bg-white round p-3'>
            <form onSubmit={handleSubmit}>
                <h2>Ajout citation</h2>
                <div className='mb-2'>
                    <textarea type="textarea" placeholder='Rédigez votre citation' className='form-control' 
                    onChange={e=> setValues({...values, contenu: e.target.value})}/>
                </div>
                <button className='btn btn-success'>Ajouter</button>
            </form>
        </div>
    </div>
  )
}

export default Create