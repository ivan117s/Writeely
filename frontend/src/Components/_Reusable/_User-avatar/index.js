import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';


export default function UserAvatar({avatar,_id, nickname}) 
{
    const [following, setfollowing] = useState(true)

    async function follow_unfollow() {
        
        setfollowing(!following)
        await Axios.post(`api/follows/${_id}/follow`)
    }

    const avatar_url = "/images/" + avatar
    return(
    <div className="user-creator-avatar-element">
        <Link to={`/user/${nickname}`} className="user-creator-avatar-element__image-container">
            {avatar ? <img src={avatar_decode} alt=""/> : <div className="user-creator-avatar-element__avatar-image"  /> }
        </Link>
        <div className="user-creator-avatar-element__user-data">
            <p>{nickname}</p>
            {following ? 
            <button onClick={follow_unfollow} className="user-creator-avatar-element__follow-button user-creator-avatar-element__follow-button--selected">Siguiendo</button>
            : <button  onClick={follow_unfollow} className="user-creator-avatar-element__follow-button">Seguir</button>}
        </div>
    </div>)
}
