import React, { Component } from 'react'
import Template from '../_Reusable/_Template';
import GridList from '../_Reusable/_Books-Grid';
import Axios from 'axios';
import { connect } from 'react-redux'
import { updateUser } from '../../redux/actions';
import { getUser } from '../../redux/reducers';
import { LogoLoading } from '../_Reusable/_Efects';
class MyBooks extends Component 
{

    constructor(props) {
        super(props)
    
        this.state = {
            resent_books: false,
            resent_loading: true,
            list: 1,
            list_count: 1,
            user_loaded: false
         }
    }

    componentDidMount()
    {
        if(this.props.user && this.state.user_loaded === false) this.get_books_resent();
    }

    componentDidUpdate()
    {
       if(this.props.user && this.state.user_loaded === false) this.get_books_resent();
    }

    get_books_resent = async () =>
    {
        const res = await Axios.get('/api/v1/user/books?nickname=' + this.props.user.nickname)
        if(res)
        {
            this.setState({resent_books: res.data.books, user_loaded: true, resent_loading: false})
        }
    }

    render() {
      
        return(
        <Template>
            <div className="my-books-page">
                { this.props.user 
                ? <GridList books_url={"/api/v1/user/my-books?list="} title={"libros recientes"} />
                : <LogoLoading/>}
            </div>
        </Template>) 
    }
}

export default connect(getUser,{updateUser})(MyBooks);


