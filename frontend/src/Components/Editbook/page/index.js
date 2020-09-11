import React, { Component, useState } from 'react'
import Paragraph from './paragraph';
import Axios from 'axios';
import { Loading } from '../../_Reusable/_Efects';

function KwyGenerator(array) {
    let new_array = []
    array.forEach((element, i) => {
        let new_element = element;
        new_element["key"] = `${ i }_${ new Date().getTime() }`;
        new_array.push(new_element)
    });
    return new_array
}

export default class Page extends Component 
{
    constructor(props) 
    {
        super(props)
        this.state = 
        {
            paragraphs: KwyGenerator(this.props.paragraphs),
            focused_paragraph: false,
            loading: false,
            styles_config: 
            {
                text_align: "center",
                font_size: 20
            },
        }
    }

    save_page = async () =>
    {
        this.setState({loading: true})
        const res = await Axios.patch('/api/v1/page/' + this.props._id,    {paragraphs: this.state.paragraphs})
        if(res)
        {
            this.setState({loading: false})
        }
    }

    update_styles_config = (value, key) =>
    {
        var styles = this.state.styles_config
        styles[key] = value;
        this.setState({styles_config: styles})
        if(this.state.focused_paragraph !== false)
        { 
            this.update_paragraph(this.state.focused_paragraph, styles)
        }
    }

    set_styles_config = (values, index, focus) =>
    {
        if(focus) this.setState({styles_config: values, focused_paragraph: index})
        else this.setState({styles_config: values, focused_paragraph: false})
    }

    update_paragraph = (index, data) =>
    {
        var paragraphs = this.state.paragraphs;
        paragraphs[index] = Object.assign(paragraphs[index], data) 
        this.setState({paragraphs: paragraphs})
    }

    insert_paragraph = (direction, chartp, index) =>
    {
        if(direction === "bottom" && this.state.paragraphs.length < 16)
        {
            var items = this.state.paragraphs.slice()
            items.splice(index + 1, 0, Object.assign(this.state.styles_config, {content: "", key: `${ index }_${ new Date().getTime() }`, new: true}));
            this.setState({paragraphs: items})
        } 
        else if(direction === "top")
        {
            var items = this.state.paragraphs.slice()
            items.splice(index, 0, Object.assign(this.state.styles_config, {content: "", key: `${ index }_${ new Date().getTime() }`, new: true}));
            this.setState({paragraphs: items})
        }
        else if(direction === "slice"  && this.state.paragraphs.length < 16)
        {
            const item = this.state.paragraphs.slice()[index]
            var first_part_content =  item.content.slice(0, chartp);
            var second_part_content =  item.content.slice(chartp);
            var items = this.state.paragraphs.slice()
            items[index] = Object.assign(item, {content: first_part_content});
            items.splice(index + 1, 0, Object.assign({text_align: item.text_align, font_size: item.font_size}, {content: second_part_content, key: `${ index }_${ new Date().getTime() }` }))
            this.setState({paragraphs: KwyGenerator(items)})
        }

    }

    remove_paragraph = (index) =>
    {
        
        const item = this.state.paragraphs.slice()[index]
        if(item.content.length === 0 && index !== 0)
        {
            var items = this.state.paragraphs.slice()
            items[index - 1].new = true
            items.splice(index, 1)
            this.setState({paragraphs: KwyGenerator(items)})
        } 
        else if(index !== 0)
        {
            var items = this.state.paragraphs.slice()
            items[index - 1].content = items[index - 1].content.concat(items[index].content) 
            items[index - 1].new = true
            items.splice(index, 1)
            this.setState({paragraphs: KwyGenerator(items)})
        }
    }

    
    render() 
    {
        const default_length = 1200;
        const text_limit = lengthStringArrayValidator(this.state.paragraphs, "content", default_length);
        const length_bar =  text_limit.count > default_length ? "100%"  : (text_limit.count / default_length) * 100 + "%";
        return(
        <div className="edit-book-element-page">
            <ParagraphStyles pageId={this.props._id} save_page={this.save_page} loading={this.state.loading} delete_page={this.props.delete_page} styles_config={this.state.styles_config} update_styles_config={this.update_styles_config}/>
            <div className="edit-book-element-page__length" style={{width: length_bar }}>
                {Math.floor((text_limit.count / default_length) * 100)  + "%"}
            </div> 
            <div className="edit-book-element-page__paragraphs">
                {this.state.paragraphs.map((element, i) =>
                {
                    return(
                    <Paragraph 
                        focused={this.state.focused_paragraph}
                        insert_paragraph={this.insert_paragraph}
                        remove_paragraph={this.remove_paragraph}
                        update_paragraph={this.update_paragraph}
                        paragraph={element} 
                        limit={text_limit.result} 
                        set_styles_config={this.set_styles_config}
                        index={i} 
                        key={element.key}/>)
                })}
            </div>
        </div>)
    }
}


function ParagraphStyles({loading, pageId, save_page, styles_config, delete_page, update_styles_config}) 
{
    const [font_size_list, set_font_size_list] = useState(false)

    function Show_font_size_list() 
    {
        set_font_size_list(!font_size_list)
    }

    function Set_font_size(font_size) 
    {
        update_styles_config(font_size, "font_size")
        Show_font_size_list()
    }

    function StyleVal(value) {
        if(styles_config.text_align === value) 
            return " edit-book-element-page__button--select";
        else 
            return "";
    }

    return(
    <div className="edit-book-element-page__styles-menu">
        <button className={"edit-book-element-page__button" + StyleVal("left")} onClick={() => update_styles_config("left", "text_align")}>
            <div className="edit-book-element-page__button-left"></div>
        </button>
        <button className={"edit-book-element-page__button " + StyleVal("center") } onClick={() => update_styles_config("center", "text_align")}>
            <div className="edit-book-element-page__button-center"></div>
        </button>
        <button className={"edit-book-element-page__button " + StyleVal("right")} onClick={() => update_styles_config("right", "text_align")}>
            <div className="edit-book-element-page__button-right"></div>
        </button>
        
        <div className="edit-book-element-page__font-size">
            <button className="edit-book-element-page__button" onClick={Show_font_size_list}>
                {styles_config.font_size}
            </button>
            {font_size_list ? <ul className="edit-book-element-page__font-size-list">
                <li onClick={() => Set_font_size(15)} className="edit-book-element-page__font-size-item">
                    15
                </li>
                <li onClick={() => Set_font_size(20)} className="edit-book-element-page__font-size-item">
                    20
                </li>
                <li onClick={() => Set_font_size(25)} className="edit-book-element-page__font-size-item">
                    25
                </li>
                <li onClick={() => Set_font_size(30)} className="edit-book-element-page__font-size-item">
                    30
                </li>
                <li onClick={() => Set_font_size(35)} className="edit-book-element-page__font-size-item">
                    35
                </li>
            </ul> : null}
        </div>
        <button onClick={save_page} className="edit-book-element-page__button">
            {!loading ? "Guardar" : <Loading/>}
        </button>
        <button onClick={() => delete_page(pageId)} className="edit-book-element-page__button edit-book-element-page__button--delete ">
            Borrar
        </button>
    </div>)
}



function lengthStringArrayValidator(array, key, count) 
{
    let items = array;
    let lengthCount = 0;
    items.forEach(element => {
        lengthCount += element[key].length
    });
    if(lengthCount > count)
    {
        return  {result: false, count: lengthCount} 
    } else return  {result: true, count: lengthCount} 
}