import React, { Component } from 'react';
import Grid from '../_Reusable/_Books-Grid';
import List from '../_Reusable/_Books-List';

import Template from '../_Reusable/_Template';
import Axios from 'axios';

class Home extends Component
{
    constructor()  
    {
        super()
        this.state =  
        {
            show_leftbar: false,
            hide_animation: false,
            animating: false,
            best: [],
            resent: [],
            resent_loaded: false,
            best_loaded: false,
            list: 1,
            resent_list: 1
        }
    } 
    
    componentDidMount()
    {
       this.get_best_books()
    }

    get_best_books = async () => 
    {
       const res = await Axios.get('/api/v1/books/?popular=true&authors=true')
       if(res && res.data.books) this.setState({best: res.data.books, best_loaded: true})
      
    }

    render() 
    {
        return(
        <Template>
            <div className="home-page">
                <List books={this.state.best} loaded={this.state.best_loaded} title="Lo mejor de Wrixy"/>
                <Grid books_url={"/api/v1/books/?authors=true&list="} title="Recomendados"/>
            </div>
        </Template>)
    }
}




export default Home;
