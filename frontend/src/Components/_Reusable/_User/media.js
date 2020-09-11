import React from 'react'

function Social({social}) 
{ 
    return(
    <div className="user-perfil__media">
        <MediaLink iconclass="instagram-logo"  url={social.instagram}/>
        <MediaLink iconclass="youtube-logo" url={social.youtube}/>
        <MediaLink iconclass="patreon-logo" url={social.patreon}/>
        <MediaLink iconclass="twitter-icon" url={social.twitter}/>
    </div>)
}

function MediaLink({iconclass, url}) 
{
    return(
    url ? 
    <a title={url} className="user-perfil__media-item" target="_blank" href={url} rel="noopener noreferrer" >
        <div className="user-perfil__media-item-container">
            <div className={"user-perfil__media-logo " + iconclass}></div>
        </div>
    </a>: null)    
}

export default Social;