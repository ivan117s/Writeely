import React from 'react'
import Cropper from '../_Reusable/_Cropper';

function Cover({change_state_value, cut,preImage, image})
{

    function hide_n_show_cutter_element() 
    {
        window.scrollTo(0, 0)
        if(document.body.style.overflow === "hidden") document.body.style.overflow = "auto"
        else  document.body.style.overflow = "hidden"
        change_state_value("cut", !cut)
    }
    
    async function set_image(e) 
    {
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
        if(e.target.files[0])
        {
            const image = await toBase64(e.target.files[0])
            if(image)
            {
                change_state_value("image", image)
                change_state_value("preImage", image)
                change_state_value("cut", true)
                hide_n_show_cutter_element()
            }
        }
    }

    function set_new_image(image)
    {
        change_state_value("image", image)
    }

    function delete_image() 
    {
        change_state_value("image", "")
        change_state_value("preImage", "")
    }

    function edit_image() 
    {
        change_state_value("image", preImage)
        hide_n_show_cutter_element()
    }


    return(
    <div className="create-book-element__book-form">
        <div className="create-book-element__cover">
            <div className="create-book-element__cover-image">
                {image ? <img src={image} alt="cover"/> : <div className="image-size-background"> <span>300*469</span> </div>}
            </div>
        </div>
        <div className="create-book-element__image-buttons">
            <label className="create-book-element__image-label">
                <span>Elige una imagen</span>
                <input onChange={async (e) => await set_image(e)} type="file" accept=".png,.jpg,.jpeg"/>
            </label>
            <label className="create-book-element__image-label">
                {image ? <span onClick={edit_image}>Editar</span> : null}
                {image ? <span onClick={delete_image}>Eliminar</span> : null}
            </label> 
        </div>
        {cut === true ? <Cropper aspect={300/469} image={preImage} set_new_image={set_new_image} hide_n_show_cutter_element={hide_n_show_cutter_element}/> : null}
    </div>)   
}




export default Cover;