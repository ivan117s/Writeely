import React, { useState } from 'react';
import {Link, Redirect} from 'react-router-dom';
import number_string from '../../../functions/number_to_string';
import  _arrayBufferToBase64 from '../../../functions/bufferToBase64';

function Info({ id, avatar, likes, author, title, edit})  
{
    const [redirect, set_redirect] = useState(false)
    const Redirect_To_Bookpage = () =>
    {
        set_redirect(true)
    }

    return ( 
    <div onClick={Redirect_To_Bookpage} className="book__content">
        <div className="content__container">
            {avatar 
            ? <Avatar nickname={author} image={avatar}/> 
            : null}
            <div className="book-info">
                {edit 
                ? 
                <Link aria-level={title} title={title} to={`/editbook/${id}`} className="info__title">
                    <span className="container__title">{title}</span>
                </Link> 
                : <Link aria-level={title} title={title} to={`/book/${id}`} className="info__title">
                    <span className="container__title">{title}</span>
                </Link>}
                {author 
                ?<Link to={"/user/" + author} className="info__author">
                    <span className="author__text">@{author}</span>
                </Link> : null}
                <div className="info__data">
                    <span className="data__views">{number_string(likes)} me gusta</span>
                </div>
            </div>
        </div>
        {redirect && !edit ? <Redirect to={`/book/${id}`}/> : null}
        {redirect && edit ? <Redirect to={`/editbook/${id}`}/> : null}
    </div>)
}

const Avatar = ({image, nickname}) =>
{
    return(
    <Link to={"/user/" + nickname} className="avatar-container">
        <div className="avatar-image-box">
            {image
            ? <img src={"/images/" + image} alt=""/> 
            :  <div className="avatar-image-box__default-image"></div>}
        </div>
    </Link>)
}

export default Info;
