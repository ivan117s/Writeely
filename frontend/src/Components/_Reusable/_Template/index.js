import React, { Component } from 'react'
import Header from '../_Header';
import Scroll from '../_Scroll';

class Template extends Component
{
    render() 
    {
        return(
        <div className="main-page">
            <Header  hidejoin={this.props.hidejoin}/>
            {!this.props.notscrollToTop ? <Scroll/> : null }
            {this.props.children}
        </div>)
    }
}

export default Template;