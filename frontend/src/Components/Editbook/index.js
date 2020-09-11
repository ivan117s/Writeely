import React, { Component, createRef, useState } from 'react'
import Template from '../_Reusable/_Template';
import Axios from 'axios';


import Page from './page';
import Chapters from './chapters';
import {Loading, LogoLoading} from '../_Reusable/_Efects'

class Edit extends Component 
{
    constructor(props) {
        super(props)
    
        this.state = {
            book: false,
            pages: [],
            chapter: false,
            chapters: [],
            loading_pages: false,
            page_paragraphs: []
        }
        this.edit = createRef()
    }
    
    componentDidMount()
    {
        this.get_book()
    }

    

    get_book = async () =>
    {
        const res = await Axios.get("/api/v1/book/?chapters=true&id=" + this.props.match.params.bookId )
        if(res)
        {
            this.setState({book: res.data.book, chapters: res.data.chapters})
        }
    }

    set_chapters =  (new_chapter) =>
    {
       let items = this.state.chapters
       items.push(new_chapter)
       this.setState({chapters: items})
    }

    set_chapter = async (id) =>
    {
        this.setState({loading_pages: true})
        const index = this.state.chapters.findIndex(element => element._id === id)
        const chapter = this.state.chapters[index];
        await this.get_pages(chapter)
    }

    delete_page = async (id) =>
    {
        var pages =  this.state.pages
        const index = pages.findIndex(element => element._id === id)
        pages.splice(index, 1)
        this.setState({pages: pages})
        await Axios.delete('/api/v1/page/' + id)
    }

    create_page = (page) =>
    {
        var pages = this.state.pages
        pages.push(page)
        this.setState({pages: pages})
    }

    get_pages = async (chapter) =>
    {
        const res = await Axios.get("/api/v1/pages/" + chapter._id)
        if(res) this.setState({pages: res.data.pages, chapter: chapter,  loading_pages: false})
    }
    
   
    render() 
    {
        return (
        <Template>
            {this.state.book 
            ? 
            <div className="edit-book-page">
                <Book book={this.state.book}/>
                <Chapters current_chapter={this.state.chapter} set_chapter={this.set_chapter} bookId={this.props.match.params.bookId } chapters={this.state.chapters} set_chapters={this.set_chapters}/>
                {!this.state.loading_pages && this.state.chapter 
                ? <Pages 
                    chapter={this.state.chapter.name} 
                    chapterId={this.state.chapter._id} 
                    create_page={this.create_page} 
                    delete_page={this.delete_page}
                    pages={this.state.pages}/> 
                : null}
                <div className="edit-book-page__loading">
                    {this.state.loading_pages ? <Loading/> : null}
                </div>
            </div>: <LogoLoading/>}
        </Template>)
    }
}

function Pages({pages, chapterId, chapter, create_page, delete_page}) 
{
    async function create_new_page() {
        const res = await Axios.post('/api/v1/page/' + chapterId)
        if(res) {
            create_page(res.data.page)
        }
    }
    
    return(
    <div className="editable-pages">
        <div className="editable-pages__chapter">
            {chapter}
        </div>
        {pages.length !== 0 
        ? pages.map((element, i ) =>
        {
            return(
            <Page 
                delete_page={delete_page} 
                chapter={chapter} 
                chapterId={chapterId} 
                paragraphs={element.content} 
                _id={element._id} 
                index={i} 
                key={element._id}/>)
                
        }): null}
        <div className="editable-pages__create_page">
            <button className="editable-pages__create_page_button" onClick={create_new_page}>Nueva página</button>
        </div>
    </div>
    )
    
}

function Book({book}) 
{
    const [edit, set_edit] = useState(false)
    const [title, set_title] = useState(book.title)
    const [synopsis, set_synopsis] = useState(book.synopsis)
    const [published, set_published] = useState(book.published)
    const [has_changed, set_changed] = useState(false)

    function Edit_book() {
        set_edit(true)
    }

    async function Save_book() {
        set_edit(false)
        set_changed(false)
        await Axios.patch("/api/v1/book?id=" + book._id, {title: title, synopsis: synopsis})
    }

    function Change_title(e) {
        set_title(e.target.value)
        set_changed(true)
    }

    function Change_synopsis(e) {
        set_synopsis(e.target.value)
        set_changed(true)
    }

    async function publish_book() {
        const publish = async () => {
            const res = await Axios.post("/api/v1/book/" + book._id + "/publish")
            if(res) set_published(true)
        }

        const hide_book = async () => {
            const res = await Axios.patch("/api/v1/book/" + book._id + "/publish")
            if(res) set_published(false)
        }

        if(!published) await publish()
        else await hide_book()
    }

    function Cancel_Change() {
        set_edit(false)
        set_changed(false)
    }

    if(book)
    {
        const cover = "/images/" + book.cover;
        return(
        <div className="edit-book-element">
            <img src={cover} alt="" className="edit-book-element__cover"/>
            <div className="edit-book-element__synopsis">
                {!edit ? <h1>{title}</h1> : <input onChange={(e) => Change_title(e)} value={title} type="text"/>}
                {!edit ? <span>{synopsis}</span> : <textarea onChange={(e) => Change_synopsis(e)} value={synopsis} type="text"/>}

                <div className="edit-book-element__buttons">
                    {!edit ? <button onClick={Edit_book} className="edit-book-element__button">Editar</button> : null}
                    {edit && !has_changed ? <button className="edit-book-element__button" onClick={Cancel_Change}>Cancelar</button> : null}
                    {edit && has_changed ? <button className="edit-book-element__button" onClick={Save_book}>Guardar</button> : null}
                    {!published ? <button onClick={publish_book} className="edit-book-element__button edit-book-element__button-select">Publicar</button> : <button onClick={publish_book} className="edit-book-element__button edit-book-element__button--delete">Ocultar</button>}
                    <button className="edit-book-element__button edit-book-element__button--delete">Borrar libro</button>
                </div>
            </div>
        </div>)
    } else return null
    
}

export default Edit;