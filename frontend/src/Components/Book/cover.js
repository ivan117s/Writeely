import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import  _arrayBufferToBase64 from '../../functions/bufferToBase64';
import number_to_string from '../../functions/number_to_string';

const Cover = ({image, bookId, defaultlikes, defaultliked, session})  => 
{

    const [liked, set_liked] = useState(defaultliked)
    const [likes, set_likes] = useState(defaultlikes)

    async function like() 
    {
        if(session)
        {
            set_liked(!liked)
            if(!liked) 
            {
                set_likes(likes + 1)
                await Axios.post('/api/v1/book-like/like/?bookId=' + bookId)
            }
            else if(liked) 
            {
                set_likes(likes - 1)
                await Axios.post('/api/v1/book-like/remove-like/?bookId=' + bookId)
            }
           
        }
    }

    const image_url = "/images/" + image
    return( 
    <div className="book-page-cover">
        <div className="book-page-cover__container">
            <img src={image_url} className="book-page-cover__image" draggable="false"  alt=""/>
            <div className="book-page-cover__info">
                <div className="book-page-cover_info-item">
                    <span onClick={like} className={liked ? " book-page-cover__like-icon book-page-cover__like-icon--selected" : "book-page-cover__like-icon"}></span>
                    <span>{number_to_string(likes)}</span>
                </div>
                <div title={145151} className="book-page-cover_info-item">
                    <span>{number_to_string(8100)} visitas</span>
                </div>
            </div>
        </div>
    </div>)
}




export default Cover;