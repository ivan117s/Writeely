import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {getUser} from '../../../redux/reducers'


import Axios from 'axios';

function Nickname({nickname, own_account, following, session, anchor, id, follow, user}) 
{
    
    const follow_unfollow = async () =>
    {
        follow()
        if(!following) 
        {
            await Axios.post(`/api/v1/follows/follow?author=` + id)
        } 
        else if(following)  await Axios.post(`/api/v1/follows/unfollow?author=` + id)
    }
    if(!session)
    {
        return( 
        <div className="user-perfil__nickname">
            <NicknameText nickname={nickname} anchor={anchor}/>
            <Link to="/signin" className="user-perfil__follow-button">Unirse</Link>
        </div>)
    } 
    else if(!own_account)
    {
        return( 
        <div className="user-perfil__nickname">
            <NicknameText nickname={nickname} anchor={anchor}/>
            {!following 
            ?   <button className="user-perfil__follow-button" onClick={follow_unfollow}>
                    Seguir
                </button>
            :   <button className="user-perfil__follow-button user-perfil__follow-button-active" onClick={follow_unfollow}>
                    Siguendo
                </button>}
        </div>)
    } 
    else 
    {
       return(
        <div className="user-perfil__nickname">
            <h1 title={nickname}>@{nickname}</h1>
            <Link to="/account" className="user-perfil__follow-button">Editar</Link>
        </div>)
    }
  

}

const NicknameText = ({anchor, nickname}) =>
{
    if(anchor)
    {
        return(
        <Link to={"/user/" + nickname}>
            <h1>
                <span className="user-perfil__author-icon">Autor</span>
                <span title={nickname}>@{nickname}</span>
            </h1>
        </Link>)
    } else return <h1 title={nickname}>@{nickname}</h1>
}

export  default connect(getUser)(Nickname);