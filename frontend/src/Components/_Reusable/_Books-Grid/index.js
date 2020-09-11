import React, { Component } from 'react'
import Axios from 'axios';
import { LoadingBooksList, BooksRender, LoadingBooksGrid, BooksGridRender } from '../books_render';

class ScalableGridBooksList extends Component 
{
    constructor(props) {
        super(props)
    
        this.state = {
            books: [],
            books_got: false,
            list_got_count: 1,
            count_render: 1
        }
    }
    

    componentDidMount()
    {
        this.get_first_list_of_books()
    }

    get_first_list_of_books = async () =>
    {
        this.setState({books_got: false})
        const res = await Axios.get(this.props.books_url +  (this.state.count_render - 1))
        if(res)
        {
           this.setState({books: res.data.books, books_got: true})
        }
    }

    get_more_books_on_server_and_render = async () =>
    {
        if(this.state.count_render === this.state.list_got_count)
        {
            this.setState({books_got: false})
            const res = await Axios.get(this.props.books_url + (this.state.list_got_count))
            if(res)
            {
                let new_books = this.state.books.slice()
                this.setState((state) => {
                   return {
                        books: new_books.concat(res.data.books), 
                        count_render: state.count_render + 1, 
                        books_got: true,
                        list_got_count: state.list_got_count + 1
                    }
                })
            }
        } else this.render_next_list_of_books()
    }

    render_next_list_of_books = () =>
    {
        this.setState({books_got: false})
        if(this.state.count_render > 0)
        {
            this.setState((state) => 
            { 
                return {
                    count_render: state.count_render + 1,
                    books_got: true
                }
            })
        }
    }

    render_previous_list_of_books = () =>
    {
        this.setState({books_got: false})
        if(this.state.count_render > 1)
        {
            this.setState((state) => 
            { 
                return {
                    count_render: state.count_render - 1,
                    books_got: true
                }
            })
        } 
    }
    

    render() {
        let books_props = this.state.books ?  this.state.books.slice(): []
        const books = books_props.splice((this.state.count_render - 1) * 16, this.state.count_render * 16);
    
        return (
        <div className="books-grid-element">
            {this.props.title ? <p className="books-grid-element__title">  {this.props.title}   </p> : null}
          
            <div className="books-grid-element__grid">
            {this.state.books_got 
                ? <BooksGridRender books={books}/> 
                : <LoadingBooksGrid/>}
            </div> 
            <div className="books-grid-element__render-buttons">
                {books.length >= 16 ? <button className="books-grid-element__render-button" onClick={this.get_more_books_on_server_and_render}>más</button> : null}
                {this.state.count_render > 1 ? <button className="books-grid-element__render-button" onClick={this.render_previous_list_of_books}>regresar</button> : null}
            </div>
        </div>)
    }
}

export default ScalableGridBooksList;