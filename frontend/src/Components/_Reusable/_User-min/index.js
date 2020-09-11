import React, { Component } from 'react'
import _arrayBufferToBase64 from '../../../functions/bufferToBase64';
import NTString from '../../../functions/number_to_string';
import {Link} from 'react-router-dom';
import Axios from 'axios';

class UserMin extends Component 
{
    constructor(props) {
        super(props)
    
        this.state = 
        {
            user: this.props.user,
            session: this.props.user.session,
            following:  this.props.user.following
        } 
    }
    
    follow = async () =>
    {
        this.setState({following: !this.state.following})
        if(!this.state.following) await Axios.post(`/api/v1/follows/follow?author=${this.state.user._id}`)
        else await Axios.post(`/api/v1/follows/unfollow?author=${this.state.user._id}`)
    }

    render() 
    {
        const avatar = "/images/" + this.state.user.avatar
        return(
        this.state.user 
        ? <div className="user-perfil-min">
            <div className="user-perfil-min__avatar">
                <Link className="user-perfil-min__avatar-image-link" to={"/user/" + this.state.user.nickname}>
                {this.state.user.avatar
                ? <img className="user-perfil-min__avatar-image" src={avatar} alt=""/>
                : <div className="user-perfil-min__avatar-image--default"></div>}
                </Link>
            </div>
            <div className="user-perfil-min__user-data">
                <div className="user-perfil-min__user-data-container">
                    <div className="user-perfil-min__user-nickname">
                        <Link to={"/user/" + this.state.user.nickname} className="user-perfil-min__user-nickname">
                            @{this.state.user.nickname}
                        </Link>
                    </div>
                    <div className="user-perfil-min__followers">
                        <span>{NTString(this.state.user.followers)} seguidores</span>
                    </div>
                </div>
                {!this.props.user.edit ? <div className="user-perfil-min__follow-buttons">
                    {!this.state.following && this.state.session
                    ? <button onClick={this.follow} className="user-perfil-min__follow-button user-perfil-min__follow-button--selected">Seguir</button>
                    : null}
                    {this.state.following && this.state.session
                    ? <button onClick={this.follow} className="user-perfil-min__follow-button">Siguiendo</button>
                    : null}
                    {!this.state.session 
                    ? <Link to="/signIn" className="user-perfil-min__follow-button user-perfil-min__follow-button--selected">Unirse</Link>
                    : null}
                </div> : null}
            </div>
            
        </div> : <div className="user-perfil-min--loading"></div>)
    }
}

export default UserMin