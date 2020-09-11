import React, { Component } from 'react'
import Genres from './genres';

export default class ExploreBooks extends Component 
{
    constructor(props) 
    {
        super(props)
        this.state = 
        {
            title: "",
            author: "",
            genres: [],
            time: "",
            relevant: true,
            resent: false
        }
    }
    
    update_state_param = (key, value) =>
    {   
        let state_obj = {}
        state_obj = Object.assign(state_obj, {[key]: value})
        this.setState(state_obj)
    }

    set_search_config = (key) =>
    {
        if(key === "relevant")  this.setState({relevant: true, resent: false})
        else if(key === "resent") this.setState({relevant: false, resent: true})
    }

    search = () =>
    {
        let search = "/api/v1/books/?authors=true"
        this.state.title ? search = search + "&title=" + this.state.title : null;
        this.state.relevant ? search = search + "&popular=true" : null;
        this.state.genres ? this.state.genres.forEach((element, i) =>
        {
            console.log(element);
           search = search + "&g" + (i + 1) + "=" + element.tag
        }) : null;
        search = search + "&list="
        this.props.set_book_search(search)
    }

    render() 
    {
        return(
        <div className="explore-search-element">
            <div className="explore-search__params">
                <div className="explore-search__param">
                    <label>Título</label> 
                    <input onChange={(e) => this.update_state_param("title", e.target.value)} value={this.state.title} className="explore-search__input-default" type="text"/>
                </div>
            </div>
            <Genres change_state_value={this.update_state_param} genres={this.state.genres}/>
            <div className="explore-search__search-config">
                <ButtonSelect param={this.state.relevant} set_param={this.set_search_config} key_param="relevant" text="Más Relevante" />
                <ButtonSelect param={this.state.resent} set_param={this.set_search_config} key_param="resent" text=" Más reciente" />
                {this.state.title.trim().length > 0 || this.state.genres.length > 0
                ?   <button onClick={this.search} className="explore-search__search-config-button explore-search__search-config-button--selected">
                        Buscar
                    </button> : null}
            </div>
        </div>)
    }
}


function ButtonSelect({param, text, key_param, set_param}) 
{
    function set() 
    {
        if(!param) set_param(key_param)
    }
    const classname_selected = param ? "explore-search__search-config-button--selected" : "";
    return(
    <button onClick={set} className={"explore-search__search-config-button " + classname_selected}>
        {text}
    </button>)
}
