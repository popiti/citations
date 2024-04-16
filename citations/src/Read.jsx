import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import './citation.scss';

function Read() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [citation,setCitation]=useState([])
    useEffect(()=>{
        axios.get('http://localhost:8081/read/'+id)
        .then(res => {
            console.log(res)
            setCitation(res.data[0]);
        })
        .catch(err => console.log(err))
    }, [])
  return (
    <div className='container'>
    <section>
        <div className="container py-4">
            <h1 className="h1 text-center" id="pageHeaderTitle">Résumé de la citation</h1>
            <article className="postcard dark blue">
            <p className="postcard__img_link">
                <img className="postcard__img" src="https://picsum.photos/1000/1000" alt=""/>
            </p>
                <div class="postcard__text">
                    <h1 class="postcard__title blue">{citation.username}</h1>
                    <div class="postcard__subtitle small">
                        <time datetime="2020-05-25 12:00:00">
                            <i class="fas fa-calendar-alt mr-2"></i>{citation.date}
                        </time>
                    </div>
                    <div class="postcard__bar"></div>
                    <div class="postcard__preview-txt">{citation.contenu}</div>
                        <ul class="postcard__tagbox">
                            <li className='tag__item'><a onClick={()=>navigate(-1)} href='-#'><i class="fas fa-play mr-2"></i>Back</a></li>
                        </ul>
                </div>
            </article>
        </div>
    </section>
</div>

  )
}

export default Read