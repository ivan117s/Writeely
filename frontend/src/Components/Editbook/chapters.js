import React, { Component, useState} from 'react'
import Axios from 'axios'

class Chapters extends Component 
{
    constructor(props) {
        super(props)
    
        this.state = {
            chapter: ""
        }
    }

    create_chapter = async () =>
    {
        this.setState({chapter: ""})
        const res = await  Axios.post('/api/v1/chapter/' + this.props.bookId, {name: this.state.chapter})
        if(res)
        {
            this.props.set_chapters(res.data.chapter)
        }

    }

    get_pages = (id) =>
    {
        this.props.get_pages(id)
    }

    render() 
    {
        return(
        <div className="chapters-creator">
            <div className="chapters-creator__creator">
                <label className="chapters-creator__title">
                    titulo
                    <input value={this.state.chapter} className="chapters-creator__title-input" onChange={(e) => this.setState({chapter: e.target.value})} type="text"/>
                    {this.state.chapter.trim().length > 0 ? <button onClick={this.create_chapter}>Crear</button> : null}
                </label>
            </div>
            <ul className="chapter-creator__chapters">
                {this.props.chapters.map((element) =>
                {
                    return  <EditableChapter chapter={this.props.current_chapter} element={element} set_chapter={() => this.props.set_chapter(element._id)}  key={element._id}/>
                })}
               
            </ul>
        </div>)
    }
}

function EditableChapter({element, chapter, set_chapter}) 
{
    const [name, set_name] = useState(element.name);
    const [text_has_change, set_text_has_change] = useState(false);
    const [edit, set_edit] = useState(false);
    const [deleted, set_deleted] = useState(false)
    function set_chapter_val() {
        if(!chapter) set_chapter()
        else 
        {
            if(chapter._id !== element._id) set_chapter()
        }
    }

    function Change_chapter_name(e) 
    {
        set_text_has_change(true)
        set_name(e.target.value)
    }

    function Edit_chapter() 
    {
        set_edit(!edit)
    }

    function Save_chapter() 
    {
        set_text_has_change(false)
        set_edit(!edit)
    }

    function CancelChange() {
        set_text_has_change(false)
        set_edit(false)
    }

    async function Delete_chapter() {
        const res = await Axios.delete("/api/v1/chapter/" + chapter._id)
        if(res) set_deleted(true)
    }

    return(
    !deleted ? 
    <li  className="chapter-creator__chapter" key={element._id}>
        {!edit 
        ? <button className="chapter-creator__chapter-name" onClick={set_chapter_val}>{name}</button> 
        : <input className="chapter-creator__chapter-name-input" onChange={(e) => Change_chapter_name(e)} value={name} type="text"/>}
        <div className="chapter-creator__chapter-buttons">
            {!edit 
            ? <button onClick={Edit_chapter} className="chapter-creator__chapter-button">Editar</button>
            : null}
            {edit && text_has_change
            ? <button onClick={Save_chapter} className="chapter-creator__chapter-button">Guardar</button>
            : null}
            {edit && !text_has_change
            ? <button onClick={CancelChange} className="chapter-creator__chapter-button">Cancelar</button>
            : null}
            <button onClick={Delete_chapter} className="chapter-creator__chapter-button chapter-creator__chapter-button--delete">X</button>
        </div>
    </li> : null)
}

export default Chapters;
