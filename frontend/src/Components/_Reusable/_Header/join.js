import React from 'react';
import {Link} from 'react-router-dom';

const Join = () =>
{
    return(
    <Link to="/signIn" className="join-session">
        
        <i className="join-session__icon"></i>
        Unirse
    </Link>)
}

export default Join;