import React, { Component } from 'react'
import { LoadingBooksList, BooksRender } from '../books_render';

class HorizontalBooksList extends Component 
{
    render() 
    {
        return(
        <div className="books-list-element">
            {this.props.title ? 
            <p className="books-list-element__title">
                {this.props.title}
            </p> : null}
            <div className="books-list-element__list">
                <div className="books-list-element__list-cotainer">
                    {!this.props.loaded 
                    ? <LoadingBooksList/>
                    : <BooksRender books={this.props.books}/>}
                </div> 
            </div>
        </div>)
    }
}


export default HorizontalBooksList
