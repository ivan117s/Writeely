import React, { Fragment, memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

import { Loading } from '../_Efects'

import Join from './join';
import SessionMenu from './session';

import { connect } from 'react-redux';
import {getUser} from '../../../redux/reducers'
import {updateUser} from '../../../redux/actions'

function Header({updateUser,  user}) 
{
    useEffect(() => 
    {
        if(!user) comfirm_session()
    })
    
    async function comfirm_session() 
    {
       var res = await Axios.get('/api/v1/session/comfirm');
       if(res.data.user)
       {
            Object.assign(res.data.user, {session: true})
            updateUser(res.data.user);
       } else updateUser({session: false})
    }   
    
    return (
    <Fragment> 
        <header className="main-header">
            <div className="main-header__container">
                <div className="main-header__logo">
                    <Link to="/" className="main-header__logo-container"> 
                        <div className="main-header__logo-image" to="/" ></div>
                        Writeely
                    </Link>
                </div>
                <div className="main-header__session">
                    <Link to="/explore" className="main-header__menu-item">
                        <div  className="search-icon"></div>
                    </Link>
                    <ComfirmSession user={user}/>
                </div>
            </div>
        </header>
        <div className="main-header-fixed-box"></div>
    </Fragment>)
}

function ComfirmSession({user})
{
    if(!user)
    {
        return <Loading/>
    } 
    else if(user.session)
    {
        return <SessionMenu user={user}/>
    } else if(!user.session)
    {
        return <Join/>
    }
}

export default connect(getUser, {updateUser})(memo(Header));
