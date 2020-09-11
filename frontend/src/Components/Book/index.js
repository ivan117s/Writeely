import React, { Component, createRef } from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import Axios from 'axios';

import Pages from './pages';
import Chapters from './chapters';
import UserMin from '../_Reusable/_User-min'; 
import Template from '../_Reusable/_Template';
import Cover from './cover';
import { LogoLoading } from '../_Reusable/_Efects';

class BookPage extends Component 
{
    constructor(props) 
    {
        super(props)
        this.state = 
        {
            title: "",
            image: "",
            user: false,
            edit: false,
            synopsis: "",
            chapters: []
        }
        this.contentRef = createRef()
    }
    
    componentDidMount()
    {
       
        this.get_book()
    }

    componentWillUnmount()
    {
        document.title = "Wrixy";
    }

    get_user = async (id) =>
    {
        const res = await Axios.get("/api/v1/user?id=" + id)
        
        if(res) 
        {
            var user = Object.assign(res.data.author, {session: res.data.session, following: res.data.following, edit: res.data.mycount}) 
            this.setState({user: user})
        }
    }

    get_book = async () =>
    {
        const res = await Axios.get(`/api/v1/book/?id=${this.props.match.params.bookId}&chapters=true`)
        if(res)
        {
            const book = res.data.book;
            document.title = book.title;
            this.setState(
            {
                title: book.title, 
                image:  book.cover, 
                chapters: res.data.chapters,
                synopsis: book.synopsis, 
                edit: res.data.editable,
                likes: book.likes,
                liked: res.data.liked,
                session: res.data.session,
                book_got: true
            })
            await this.get_user(book.author)
           
        }
    }

    scrolltochapter = () =>
    {
        this.contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    render() 
    { 
        return( 
        <Template notscrollToTop={true}>
            <div className="book-page">
                {this.state.book_got && this.state.user
                ?   <div className="book-page__container">
                        <div className="book-page-book-element">
                            <Cover bookId={this.props.match.params.bookId} session={this.state.session} defaultlikes={this.state.likes} edit={this.state.edit} defaultliked={this.state.liked}  image={this.state.image}/>
                            {this.state.edit ? 
                            <div className="book-page-book-element__edit-book">
                                <Link to={`/editbook/${this.props.match.params.bookId}`}>Editar</Link> 
                            </div> : null}
                            {this.state.user ? <UserMin anchor={true} user={this.state.user}/> :  <div className="user-perfil-min--loading"></div>}
                            
                            <Synopsis synopsis={this.state.synopsis} title={this.state.title}/>
                            <Chapters chapters={this.state.chapters} bookId={this.props.match.params.bookId} />
                            <div className="scoll-ref-div">
                                <Switch  >
                                    <Route path="/book/:bookId/:chapterId" component={(props) => <Pages {...props} chapters={this.state.chapters} chapterId={props.match.params.chapterId} bookId={props.match.params.bookId} key={props.match.params.chapterId}/>}/>
                                </Switch>
                            </div> 
                        </div>
                    </div> 
                : <LogoLoading/>}
            </div>
        </Template>)
    }
}

function Synopsis({title, synopsis}) 
{
    return(
    <div className="book-page__synopsis">
        <span className="book-page__synopsis-title">{title}</span>
        <p className="book-page__synopsis-text">{synopsis}</p>
    </div>)
}


export default BookPage;
