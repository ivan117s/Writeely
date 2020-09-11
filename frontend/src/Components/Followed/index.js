import React, { Component } from 'react'
import Template from '../_Reusable/_Template';
import UserAvatar from '../_Reusable/_User-avatar';
import Axios from 'axios';

export default class Followed extends Component 
{
    constructor(props) 
    {
        super(props)
        this.state = 
        {
            users: []
        }
    }

    componentDidMount()
    {
        this.get_followed()
    }
    
    get_followed = async () =>
    {
        const res = await Axios.get('api/follows/followed');
        if(res)
        {
            const authors = []
            res.data.followed.forEach((element) =>
            {
                authors.push(element.authorId)
            }) 
            this.setState({users: authors})
        }
    }

    render() 
    {
        return (
        <Template>
            <div className="users-followed-page">
                <div className="users-followed-list">
                    {this.state.users.map((user) =>
                    {
                        return <UserAvatar avatar={user.avatar} nickname={user.nickname} _id={user._id} key={user._id} />
                    })}
                    {this.state.users.length === 0 
                    ? <div className="users-followed-list__sign">Explora para encontrar escritores</div> : null}
                </div>
            </div>
            
        </Template>)
    }
}
