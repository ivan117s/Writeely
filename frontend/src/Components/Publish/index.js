import React, { Component } from 'react';
import {  Redirect  } from 'react-router-dom';

import Axios from 'axios'
import Template from '../_Reusable/_Template';
import List from '../_Reusable/_Books-List';
import Cover from './cover';
import Genres from './genres';
import { connect } from 'react-redux'
import { updateUser } from '../../redux/actions';
import { getUser } from '../../redux/reducers';



class Write extends Component 
{

    constructor(props) {
        super(props)
    
        this.state = 
        {
            genres: [],
            resent: [],
            resent_loaded: false,
            title: "",
            synopsis: "",
            tags: "",
            redirect: false,
            image: "",
            preImage: "",
            cut: false,
            loading: false
        }
    }

    componentDidMount()
    {
       if(!this.state.resent_loaded && this.props.user) this.get_my_resent_books()
    }

    componentDidUpdate()
    {
        if(!this.state.resent_loaded  && this.props.user) this.get_my_resent_books()
    }

    get_my_resent_books = async () => {
        const res = await  Axios.get('/api/v1/user/books?nickname=' + this.props.user.nickname)
        if(res)
        {
             this.setState({resent: res.data.books, resent_loaded: true})
        }
    }

    change_state_value = (key, value) =>
    {   
        let obj = {}
        obj[key] = value
        this.setState(obj)
    }

    image_resize = (imageBase64) =>
    {
        const new_image = new Image();
        new_image.src = imageBase64;
        let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 469;
        ctx.drawImage(new_image, 0, 0, 300, 469);
        return canvas.toDataURL();
    }

    submit_book = async () => 
    {
        this.setState({loading:true})
        const resize_image = () =>
        {
            function dataURLtoFile(dataurl, filename) 
            {
                var arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), 
                    n = bstr.length, 
                    u8arr = new Uint8Array(n);
                    
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                
                return new File([u8arr], filename, {type:mime});
            }
            const resized_image = this.image_resize(this.state.image)
           
            return dataURLtoFile(resized_image, this.state.title + ".png")
        }
        var formData = new FormData();
        formData.append("image", resize_image());
        
        formData.append("book", JSON.stringify({
            title: this.state.title,
            tags: this.state.tags,
            synopsis: this.state.synopsis,
            genres: this.state.genres,
        }));
        const res = await Axios.post('/api/v1/book', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        if(res)
        {
            let new_resent = this.state.resent;
            new_resent.push(res.data.book)
            this.setState({title: "", synopsis:"", tags: "", genres: [], image: "", preImage:"", loading: false})
        }
    }

    
    render() 
    {
        const validate = this.state.title &&  this.state.synopsis && this.state.genres.length > 0 && this.state.image ? true : false;
        return (
        <Template>
            <div className="publish-page">
                <div className="create-book-element">
                    <div className="create-book-element__container">
                        <Cover preImage={this.state.preImage} cut={this.state.cut} image={this.state.image} change_state_value={this.change_state_value}/>
                        <div className="create-book-element__desc">
                            <div className="create-book-element__title">
                                <label className="create-book-element__label">Titulo</label>
                                <input value={this.state.title} onChange={(e) => this.setState({title: e.target.value})} type="text"/>
                            </div>
                            <div className="create-book-element__synopsis">
                                <label className="create-book-element__label">Synopsis</label>
                                <textarea value={this.state.synopsis} onChange={(e) => this.setState({synopsis: e.target.value})} className="create-book-element__synopsis-textarea" type="text"/>
                            </div>
                            <div className="create-book-element__tags">
                                <label className="create-book-element__label">Etiquetas *</label>
                                <input value={this.state.tags} onChange={(e) => this.setState({tags: e.target.value})} type="text"/>
                            </div>
                           
                            <Genres genres={this.state.genres} change_state_value={this.change_state_value}/>
                        </div>
                    </div>
                    <div className="create-book-element__submit-book-buttons">
                        {validate && !this.state.loading ? <button onClick={this.submit_book} className="create-book-element__submit-book-button">Crear</button>: null}
                        {this.state.loading 
                        ?   <div className="loading-element" style={{height: "40px", width: "50px"}}>
                                <div className="loading-animation" style={{height: "30px", width: "30px"}}></div>
                            </div> 
                        : null}
                    </div>
                </div>
                <List books={this.state.resent} edit={true} loaded={this.state.resent_loaded} title="Mis Libros recientes"/>
                {this.state.redirect ? <Redirect to="/"/> : null}
            </div>
        </Template>)
    }
}



export default connect(getUser,{updateUser})(Write);


