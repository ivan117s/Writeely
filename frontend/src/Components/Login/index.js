import React, { Component } from 'react';
import { Link,  Redirect} from 'react-router-dom'
import Axios from 'axios';
import Template from '../_Reusable/_Template';

import { connect } from 'react-redux';
import { getUser } from '../../redux/reducers'
import { updateUser} from '../../redux/actions'


class Login extends Component 
{

    constructor(props) 
    {
        super(props)
        this.state = 
        {
            nickname: "",
            password: "",
            alert: ""
        }
    }
    
    set_state_by_key = (key, value) =>
    {
        const obj = {alert: ""}
        obj[key] = value;
        this.setState(obj)
    }

    login = async (e) =>
    {
        e.preventDefault()
        if(this.state.nickname.trim().length > 0 &&  this.state.password.length > 0)
        {
            var res = await Axios.post('/api/v1/session/login', {password: this.state.password, nickname: this.state.nickname})
            if(!res.data.result.user)
            {
                this.setState({alert: "El usuario no existe"})
            } 
            else if(!res.data.result.password)
            {
                this.setState({alert: "Contraseña incorrecta"})
            }  
            else 
            {
                Object.assign(res.data.result.user, {session: true})
                
                this.props.updateUser(res.data.result.user)
                this.setState({ redirect: true })
            }
        }
    }


    render() 
    {
        return(
        <Template hidejoin={true}>
            <div className="sign-in-page">
                <div className="sign-in-page__signin">
                    <div className="signin-container">
                        <div className="signin-logo">

                            <div className="signin-logo__container">
                               <div className="signin-logo__image-container">
                                    <div className="logo__background"></div>
                               </div>
                                <p>Writeely</p> 
                            </div>
                           
                            <div className="sign-in-guide">
                                <p>Iniciar sesión</p> 
                            </div>
                        </div>
                        <form className="sign-in__form">
                            <div className="form__value">
                                <label>Email o nombre de usuario</label>
                                <input onChange={(e) => this.set_state_by_key("nickname", e.target.value)}  value={this.state.nickname} type="text" required/>
                            </div>
                            <div className="form__value">
                                <label>Contraseña</label>
                                <input onChange={(e) => this.set_state_by_key("password", e.target.value)} value={this.state.password} type="password" required/>
                            </div>
                            <div className="form__next">
                                 <input type="submit" value="Inciar sesión" onClick={(e) => this.login(e)} className="next__buttom"/>
                            </div>
                        </form>
                        {this.state.alert ? <div className="sign-in-page__alert">{this.state.alert}</div> : null}
                    </div>
                </div>
                <div className="sign-in-page__change-login">
                    <Link to="/signin">Registrarse</Link>
                </div>
            </div>
            {this.state.redirect ? <Redirect to="/"/> : null}
        </Template>
        )
    }
}


export default connect(getUser, {updateUser})(Login)


/*
<Template>
            <div className="login-page">
                <form className="login-page__login-form">
                    <div className="login-page__login-form-items">
                        <div className="login-page__logo">
                            <div className="logo__background">

                            </div>
                        </div>
                    </div>
                    
                </form>
            </div>
        </Template>
        */