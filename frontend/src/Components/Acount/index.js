import React, { Component, createRef } from 'react';
import Template from '../_Reusable/_Template';
import Cropper from '../Publish/crop'
import _BTBASE64 from '../../functions/bufferToBase64'

import { connect } from 'react-redux';
import {getUser} from '../../redux/reducers';
import {updateUser} from '../../redux/actions'
import Axios from 'axios';
import { Loading } from '../_Reusable/_Efects';

class Account extends Component 
{
    constructor(props) {
        super(props)
    
        this.state = 
        {
            cropper: false,
            name: "",
            nickname: "",
            user_got: true,
            email: "",
            avatar: "",
            twitter: "",
            introduction: "",
            youtube: "",
            patreon: "",
            saving_user: false,
            instagram: "",
            user_got: false
        }
    }

    componentDidMount()
    {
        this.set_user()
    }

    componentDidUpdate()
    {
       this.set_user()
    }

    set_cropped_avatar = (image) =>
    {
        this.setState({avatar:image})
    }

    set_user = () =>
    {
        if(this.props.user && !this.state.user_got)
        {
            this.setState(
            {
                name: this.props.user.name,
                nickname: this.props.user.nickname,
                user_got: true,
                email: this.props.user.email,
                avatar: this.props.user.avatar ? "/images/" + this.props.user.avatar : false,
                twitter: this.props.user.social_networks.twitter,
                introduction: this.props.user.introduction,
                youtube: this.props.user.social_networks.youtube,
                patreon: this.props.user.social_networks.patreon,
                instagram: this.props.user.social_networks.instagram,
            })
        }
    }
   
    set_seleceted_image_file_to_base64 = async (e) =>
    {
        const fileToBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
        
        if(e.target.files[0])
        {
          
            const image = await fileToBase64(e.target.files[0]);
            if(image) this.setState({avatar: image})
            this.show_image_cropper()
        }
    }

    resize_base64_image = (image) =>
    {
        const new_image = new Image();
        new_image.src = image;
        let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
        canvas.width = 150;
        canvas.height = 150;
        ctx.drawImage(new_image, 0, 0, 150, 150);
        return canvas.toDataURL();
    }


    save_changes = async () =>
    {
        this.setState({saving_user: true})
        const resize_image = (image, name) =>
        {
            function dataURLtoFile(dataurl, filename) 
            {
                var arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), 
                    n = bstr.length, 
                    u8arr = new Uint8Array(n);
                    
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                
                return new File([u8arr], filename, {type:mime});
            }
            const resized_image = this.resize_base64_image(image)
            return dataURLtoFile(resized_image, name + ".png")
        }
        var formData = new FormData();
        formData.append("image", resize_image(this.state.avatar, this.state.nickname));
        var data = 
        {
            name: this.state.name,
            nickname: this.state.nickname,
            email: this.state.email,
            introduction: this.state.introduction,
            social_networks: 
            {
                twitter: this.state.twitter,
                youtube: this.state.youtube,
                patreon: this.state.patreon,
                instagram: this.state.instagram,
            }
        }
        const update_avatar = await Axios.patch("/api/v1/user/avatar", formData)
        const res = await Axios.patch('/api/v1/user', data)
        if(res && update_avatar)
        {
            const user = Object.assign(this.props.user, data)
            this.props.updateUser(user);
            this.setState({saving_user: false})
        }
    }

    show_image_cropper = () =>
    {
        this.setState({cropper: !this.state.cropper })
    }

    destroy_session = async () =>
    {
        this.props.updateUser(false) 
        const res = await Axios.post('/api/session/logout')
        if(res)
        {
            window.location.href = "/"
        }
    }
   

    render() 
    {
        return(
        <Template> 
            <div className="account-page">
                <div className="account-element">
                    <form onSubmit={(e) => e.preventDefault()} className="account-element__form">
                        <div className="account-element__field-avatar">
                            <label>
                                <input type="file" onChange={(e) => this.set_seleceted_image_file_to_base64(e)} style={{display: "none"}}/>
                                {this.state.avatar 
                                ? <img src={this.state.avatar} alt="Cambiar foto del usuario"/> 
                                :  <div className="account-element__avatar-default"></div>}
                            </label>
                        </div>
                        <div className="account-element__field">
                            <label>Nombre</label>
                            <input 
                                className="account-element__field-input" 
                                value={this.state.name}  
                                onChange={(e) => this.setState({name: e.target.value})}
                                type="text"/>
                        </div>
                        <div className="account-element__field">
                            <label>Nombre de usuario</label>
                            <input 
                                className="account-element__field-input" 
                                value={this.state.nickname}  
                                onChange={(e) => this.setState({nickname: e.target.value})}
                                type="text"/>
                        </div>
                        <div className="account-element__field">
                            <label>Email</label>
                            <input 
                                className="account-element__field-input" 
                                value={this.state.email}   
                                onChange={(e) => this.setState({email: e.target.value})}
                                type="text"/>
                        </div>
                        <div className="account-element__field">
                            <label>Presentacion</label>
                            <textarea 
                            className="account-element__field-textarea" 
                            value={this.state.introduction}  
                            onChange={(e) => this.setState({introduction: e.target.value})}
                            type="text"/>
                        </div>
                        <div className="account-element__field">
                            <label>Instagram *</label>
                            <input 
                                className="account-element__field-input" 
                                value={this.state.instagram}
                                onChange={(e) => this.setState({instagram: e.target.value})}
                                type="text"/>
                        </div>
                        <div className="account-element__field">
                            <label>Twitter *</label>
                            <input 
                                className="account-element__field-input" 
                                value={this.state.twitter}
                                onChange={(e) => this.setState({twitter: e.target.value})}
                                type="text"/>
                        </div>
                        <div className="account-element__field">
                            <label>Patreon *</label>
                            <input 
                                className="account-element__field-input" 
                                value={this.state.patreon}
                                onChange={(e) => this.setState({patreon: e.target.value})}
                                type="text"/>
                        </div>
                        <div className="account-element__field">
                            <label>Youtube *</label>
                            <input 
                                className="account-element__field-input" 
                                value={this.state.youtube}
                                onChange={(e) => this.setState({youtube: e.target.value})}
                                type="text"/>
                        </div>
                        <div className="account-element__buttons">
                            {!this.state.saving_user ? <button onClick={this.save_changes} className="account-element__button-submit">
                                Guardar
                            </button> : <div className="account-element__saving-element"><Loading/></div>}
                            <button onClick={this.destroy_session} className="account-element__button-logout">Cerrar sesión</button>
                        </div>
                    </form>
                    {this.state.cropper ? <Cropper aspect={150/150} set_new_image={this.set_cropped_avatar} hide_n_show_cutter_element={this.show_image_cropper} image={this.state.avatar}/> : null}
                </div>
            </div>
        </Template>)
    }
}

export default connect(getUser, { updateUser })( Account );