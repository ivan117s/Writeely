import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Chapters extends Component 
{

    render() 
    {
        
        return (
        <div className="chapters-container">
            <div className="chapters-box">
                <div className="chapters-box__title">
                    <span>Contenido</span>
                </div>
                <div className="chapters-box__chapters">
                    {this.props.chapters.map((item, i) => 
                    {
                        return(
                        <Link to={`/book/${this.props.bookId}/${item._id }`} className="box__chapters__chapter"  key={item._id}>
                            {item.name}
                        </Link>)
                    })}
                </div>
            </div>
        </div>)
    }
}
export default Chapters;
