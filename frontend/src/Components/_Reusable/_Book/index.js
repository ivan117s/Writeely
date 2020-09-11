import React, { PureComponent } from 'react'
import Info from './info';
import Image from './image';

class Book extends PureComponent 
{
    render()   
    {
        return (
        <div className="home__book">
            <Image cover={this.props.cover} genres={this.props.genres} synopsis={this.props.synopsis} />
            <Info author={this.props.author} id={this.props.id} avatar={this.props.avatar} title={this.props.title} edit={this.props.edit} likes={this.props.likes}/>
        </div>)  
    }
}


export default Book;