import React, { Component } from 'react'
import Template from '../_Reusable/_Template'
import ExploreBooks from './books';
import ListGrid from '../_Reusable/_Books-Grid';

class Explore extends Component 
{
    constructor(props) {
        super(props)
    
        this.state = {
            user_search: false,
            book_search: false
        }
    }

    set_book_search = ( url ) =>
    {
        this.setState({book_search: url, searching: true, user_search: false})
        setTimeout(() => {
            this.setState({searching:false})
        }, 100);
    }
    
    render() 
    {
        return (
        <Template>
            <div className="explore-page">
                <div className="explore-element">
                    <ExploreBooks set_book_search={this.set_book_search}/>
                </div>
                <div className="explore-page__results">
                    <div className="explore-page__title">Resultados</div>
                    {this.state.book_search && !this.state.searching ? <ListGrid books_url={this.state.book_search}/> : null}
                </div>
            </div>
        </Template>)
    }
}



export default Explore;