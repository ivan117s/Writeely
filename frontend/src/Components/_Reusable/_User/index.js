import React, { Component } from 'react';
import NumberString from '../../../functions/number_to_string';

import Nickname from './nickname';
import Social from './media';
import Avatar from './avatar';
import Axios from 'axios';

class User extends Component 
{
    
    constructor(props) 
    {
        super(props)
        this.state = 
        {
            user: this.props.user_prop ? this.props.user_prop : false,
            following: this.props.user_prop ? this.props.user_prop.following : false,
            session: this.props.user_prop ? this.props.user_prop.session : false,
            own_account: this.props.user_prop ? this.props.user_prop.own_account : false,
            user_got: false
        }
    }
    

    componentDidMount()
    {
        this.get_user_by_id()
        this.get_user_by_nickname()
    }
    
    get_user_by_id = async () =>
    {
        if(!this.props.nickname && !this.props.user_prop && this.props.id)
        {
            var res = await Axios.get(`/api/user/${id}/getuser_id`);
            if(res)
            {
                var data = res.data;
                this.setState({user: data.user, session: res.data.session, following: res.data.following, own_account: res.data.own_account, })
            }
        }
    }

    get_user_by_nickname = async () =>
    {
        if(this.props.nickname && !this.props.user_prop && !this.props.id)
        {
            var res = await Axios.get(`/api/user/${nickname}/getuser`);
            if(res)
            {
                var data = res.data;
                this.setState({user: data.user, session: res.data.session, following: res.data.following, own_account: res.data.own_account, })
            }
        }
    }

    follow_user = async () =>
    {
        this.setState({following: !this.state.following})
    }

    render() 
    {
        const user = this.state.user;
        return(
        user ? 
            <div className="user-perfil">
                <div  className="user-perfil__container">
                    <Avatar avatar={user.avatar}/>
                    <div className="user-perfil__info">
                        <Nickname own_account={this.state.own_account} following={this.state.following} id={user._id}  follow={this.follow_user} session={this.state.session} anchor={this.state.anchor} nickname={user.nickname}/>
                        <div className="user-perfil__statistics">
                            <div className="user-perfil__statistics-param">
                                <p> <span>{NumberString(user.followers)}</span>  {user.followers === 1 ? "seguidor" : "seguidores"}</p>
                            </div>
                            <div className="user-perfil__statistics-param">
                                <p> <span>{NumberString(user.books)}</span> {user.books === 1 ? "libro" : "libros"}</p>
                            </div>
                        </div>
                        <div className="user-perfil_name">
                            {user.name}
                        </div>
                        <div className="user-perfil_intro">
                            {user.introduction}
                        </div>
                        <Social social={user.social_networks} />
                    </div>
                </div> 
            </div>
        : <div className="user-perfil--loading"></div>)
    }
}

export default User;