import React, { Component } from 'react';
import Template from '../_Reusable/_Template';


class Library extends Component 
{
    constructor(props) {
        super(props)
        this.state = 
        {
            books: []
        }
    }
    
    componentDidMount()
    {

    }

    get_books = () =>
    {
        
    }

    render() 
    {
        return(
        <Template>
            <div className="library-page">
                
            </div>
        </Template>)
    }
}


export default Library;