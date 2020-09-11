import React, { useState, useEffect, Fragment } from 'react'
import _arrayBufferToBase64 from '../../../functions/bufferToBase64';

function Avatar({avatar, author}) 
{
   
    const [focused_image, set_focused_image] = useState(false)
    useEffect(() => {
      
        return () => {
            document.body.style.overflow = ""
        }
    }, [])
    function focusImage()
    {
        document.body.style.overflow = "hidden"
        set_focused_image(!focused_image)
    }
    function closeImage() {
        document.body.style.overflow = ""
        set_focused_image(!true)
    }

    const avatar_decode = "/images/" + avatar;
    const image = avatar
    ? <img draggable="false" onClick={focusImage}  className="user-perfil__avatar-image"  src={avatar_decode} alt={`avatar de ${author}`}/>
    : <div className="user-perfil__avatar-image--defalut"><div className="user-perfil__default-image"></div></div>;

    return(
    <Fragment>
        <div className="user-perfil__avatar">
            <div className="user-perfil__avatar-container">
                {image}
            </div>
            {focused_image 
            ?<div className="user-perfil__avatar-focus">
                <button  onClick={closeImage} className="user-perfil__focus-avatar-close-button">+</button>
                <div  onClick={closeImage} className="user-perfil__avatar-focus-background"></div>
                <img draggable="false"    className="user-perfil__avatar-focus-image "  src={avatar_decode} alt=""/>;
            </div>
            :null}
        </div> 
       
    </Fragment>
    )
}

export default Avatar;