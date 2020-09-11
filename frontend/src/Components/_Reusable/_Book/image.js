import React from 'react';
import { useState } from 'react';
import MainTag from './tags';

function Image({cover, synopsis, genres})  
{
  
    const [open, setopen] = useState(false)
    var countingdown = false

    function close_open_onclick() {
        if(open)
        {
            setopen(false) 
        }  else {
            setopen(true)
        } 
    } 

    
    
    function set_timeout_to_close() 
    {
        if(!countingdown && open)
        {
            countingdown = true
            setTimeout(() => {
               
                if(countingdown)
                {
                    
                    setopen(false)
                     countingdown = false
                } 
            }, 2000);
        }
    }

    const clear_Timeout = () =>
    {
         countingdown = false
    }
    const image_url = "/images/" + cover;
    return (
    <div onClick={close_open_onclick} className={"book__image"} onMouseOver={clear_Timeout} onMouseLeave={set_timeout_to_close}>
        <div className={`image__box ${open ? "rise-image" : "pull-down-image"}`}>
            <img loading="lazy" src={image_url} draggable={false} alt="/imagen-libro" /> 
            <div className="home__loading">
                <div className="home__loading-image-box">
                    <div className="home__loading-image"></div>
                </div>
            </div>
        </div>
        
        <div className="image__text"> 
            
            <div className="image__text-box"> 
                <MainTag genres={genres}/>
                <p>{synopsis}</p>
            </div>
        </div>
    </div>)
}
 

export default Image;
