import React, { PureComponent, } from 'react';
import {Loading} from '../_Reusable/_Efects/index';

import Axios from 'axios';


class Content extends PureComponent 
{
    constructor(props) {
        super(props)
    
        this.state = 
        {
            pages: [],
            loading: false,
            chapter: ""
        }
    }

    componentDidMount()
    {
        if(this.props.chapters)
        { 
            const chapterIndex = this.props.chapters.findIndex((element) => element._id === this.props.chapterId)
            const chapter = this.props.chapters[chapterIndex];
            if(chapter) this.setState({chapter: chapter.name});
        }
       

        this.get_pages()
    }

    get_pages = async () =>
    {
        const res = await Axios.get('/api/v1/pages/' + this.props.chapterId);
        if(res)
        {
            this.setState({pages: res.data.pages, loading: true})
        }
    }

    reproduce = (text) =>
    {
        window.speechSynthesis.cancel()
        const voice = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(voice)
    }
    render() 
    { 
        if(!this.state.loading)
        {
            return(<Loading/>)
        }
        else 
        {
            return (
            <div className="book-content">
                <div className="book-content__page">
                    <div className="book-content__pages-list">
                        {this.state.pages.map((element, i) =>
                        {
                            return(
                            <div className="book-content__page" key={element._id}>
                                <div className="book-content__page-info">
                                    <div className="book-content__page-number">
                                        {i + 1}
                                    </div>
                                    <div className="book-content__page-name">
                                        {this.state.chapter}
                                    </div>
                                </div>
                                {element.content.map((item) =>
                                {
                                    return <Paragraph font_size={item.font_size} text_align={item.text_align} content={item.content} reproduce={this.reproduce} key={item._id}/>
                                })}
                            </div> )
                        })}
                    </div>
                </div>
            </div>)
        }
       
    }
}

function Paragraph({text_align , font_size, content}) 
{
   return(
    <div className="paragraph-container">
        <div className="paragraph-box" >
            <p style={{textAlign: text_align, fontSize: font_size + "px" }}>{content}</p>
        </div>
    </div>) 
   
}

export default Content