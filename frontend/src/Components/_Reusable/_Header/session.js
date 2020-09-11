import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import _arrayBufferToBase64 from '../../../functions/bufferToBase64';

export default  function SessionMenu({user}) 
{
    const [open, setopen] = useState(false)
    function open_menu()
    {
        setopen(!open)
    }

    const avatar = "/images/" + user.avatar
    
    return (
    <div className="main-header__session-menu">
        <div className="main-header__menu-items">
            <div className="main-header__menu-item">
                <div className="bell"></div>
            </div> 
            <div className="main-header__menu-item" onClick={open_menu}>
                <AddContent nickname={user.nickname} open={open}/>
            </div>
            <Link to={"/user/" + user.nickname} className="main-header__avatar-container">
                {user.avatar ? <img className="main-header__avatar" src={avatar} alt="" /> 
                : <div className="main-header__avatar"></div>}
            </Link>
        </div>
    </div>)
}

const AddContent = ({open, nickname}) =>
{
    return( 
    <div className="add-content-element">
        <div className="add"></div>
        {open ? 
        <ul className="add-menu">
            <li>
                <Link to="/publish" className="add-item">
                    <div className="add-menu__icon pen-icon "></div>
                    <p>Crear libro</p>
                </Link>
            </li>
            <li>
                <Link to="/followed" className="add-item">
                    <div className="add-menu__icon users-icon"></div>
                    <p>Seguidos</p>
                </Link>
            </li>
           <li>
                <Link to="/my-books" className="add-item">
                    <div className="add-menu__icon books-icon"></div>
                    <p>Mis libros</p>
                </Link>
           </li>
           <li>
                <Link to={"/user/" + nickname} className="add-item">
                    <div className="add-menu__icon user-icon"></div>
                    <p>Perfil</p>
                </Link>
           </li>
           <li>
                <Link to={"/library"} className="add-item">
                    <div className="add-menu__icon library-icon"></div>
                    <p>Biblioteca</p>
                </Link>
           </li>
           <li>
                <Link to="/account" className="add-item">
                    <p>Editar perfil</p>
                </Link>
           </li>
        </ul> : null}
    </div>)
}
