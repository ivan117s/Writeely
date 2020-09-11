import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';
import Axios from 'axios';

import StepOne, { StepTwo } from './steps';

import Template from '../_Reusable/_Template';


import { connect } from 'react-redux';
import {getUser} from '../../redux/reducers'
import {updateUser} from '../../redux/actions'

class Signin extends Component 
{
    constructor(props) {
        super(props)
    
        this.state = {
            step: 1,
            nickname:"",
            name: "",
            password: "",
            email: "",
            login: true,
            redirect: false
        }
    }
    
    setlogin = () =>
    {
        this.setState(
        {
            nickname:"",
            name: "",
            password: "",
            email: "",
            login: false
        })
    }

    set_state_by_key = (key, value) =>
    {
        const obj = {}
        obj[key] = value;
        this.setState(obj)
    }

    setnextstep = async (e) =>
    {
        e.preventDefault()
        const nickname_regex_validator = new RegExp(/( )/g)
        const nickname_validator = nickname_regex_validator.test(this.state.nickname);
    
        this.setState({alert: false});
        if(!nickname_validator) 
        {
            const comfirm_user = await Axios.post("/api/v1/session//comfirm-nickname", {nickname: this.state.nickname})
            if(!comfirm_user.data.user_available) this.setState({alert: "El nombre de usuario ya está en uso"});
            else this.setState({step: 2});
           
        } else this.setState({alert: "El nombre de usuario no debe contener espacios"});
    }

    singin = async () =>
    {
        const res = await Axios.post('/api/v1/session/singin', {email: this.state.email, password: this.state.password, name: this.state.name, nickname: this.state.nickname}) 

        if(res.data.user_exists)
        {
            this.setState({alert: "El usuario ya ha sido creado"})
        }
        else if(res.data.logged && res.data.user)
        {
            Object.assign(res.data.user, {session: true})
            this.props.updateUser(res.data.user)
            this.setState({redirect: true})
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
                                {this.state.step === 1 ? <p>Registrase</p> 
                                : <p>Segundo paso, configura tu sessión</p> }
                            </div>
                        </div>
                        {this.state.step === 1 
                        ? <StepOne setnextstep={this.setnextstep} nickname={this.state.nickname} name={this.state.name} set_state_by_key={this.set_state_by_key}/> 
                        : <StepTwo  set_state_by_key={this.set_state_by_key} singin={this.singin}/>}
                        {this.state.alert ? <div className="sign-in-page__alert">{this.state.alert}</div> : null}
                    </div>
                </div>
                {this.state.step === 2 
                ? <div className="sign-in-page__step-two-info">
                    <p>Nombre de usuario: {this.state.nickname}</p>
                    <p>Nombre: {this.state.name}</p>
                    <button onClick={() => this.setState({step: 1})}>Regresar</button>
                </div> : null}
                <div className="sign-in-page__change-login">
                    <Link to="/login">Iniciar sesión</Link>
                </div>
            </div>
            {this.state.redirect ? <Redirect to="/"/> : null}
        </Template>
        )
    }
}

export default connect(getUser, {updateUser})(Signin) ;
