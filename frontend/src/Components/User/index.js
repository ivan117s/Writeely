import React, { Component } from 'react';
import Axios from 'axios';

import User from '../_Reusable/_User';
import GridList from '../_Reusable/_Books-Grid';
import Template from '../_Reusable/_Template';
import { LogoLoading } from '../_Reusable/_Efects';

class UserPerfil extends Component
{
    constructor(props) 
    {
        super(props)
    
        this.state = 
        {
            resent: [],
            resolved: false,
            author: false,
        }
    }

    componentDidMount = async () =>
    {
        await this.get_user()
    }

    componentWillUnmount()
    {
        document.title = "Wrixy"
    }

    get_user = async () =>
    {
        if(!this.state.author) 
        {
            const res = await Axios.get(`/api/v1/user/?nickname=${this.props.match.params.name}`)
            if(res)
            {
                let author = res.data.author;
                document.title = "@" + author.name + ` (${author.nickname})`
                author = Object.assign(author, {session: res.data.session, own_account: res.data.mycount, following: res.data.following})
                if (author) this.setState({author: res.data.author, resolved:true})
            }
        }
        
    }

    render() 
    {
        return( 
        <Template>
            {this.state.resolved  ? 
            <div className="user-interface">
                <div className="user-interface-container">
                    <User anchor={false} user_prop={this.state.author}/> 
                </div>
                <div className="main-books-list">
                    <GridList books_url={`/api/v1/user/books/?nickname=${this.props.match.params.name}&list=`}  loaded={this.state.books_loaded} title="Libros más recientes de Ectarwen"/>
                </div>
            </div> : <LogoLoading/>}
        </Template>)
    }
}


export default UserPerfil;