import React from 'react';
import { useState } from 'react';

function SignInStepOne({set_state_by_key, nickname, name, setnextstep}) 
{
    return(
    <form className="sign-in__form">
        <div className="form__value">
            <label>Mi nombre de usuario</label>
            <input value={nickname}   onChange={(e) => set_state_by_key("nickname", e.target.value.trim())} type="text" required/>
        </div>
        <div className="form__value">
            <label>Mi nombre</label>
            <input value={name}  onChange={(e) => set_state_by_key("name", e.target.value)} type="text" required/>
        </div>
        <div className="form__next">
            {nickname.trim().length > 0 &&  name.trim().length > 0
            ? <input type="submit" value="siguente" onClick={(e) => setnextstep(e)} className="next__buttom"/>
            : null}
        </div>
    </form>)
}

export function StepTwo({singin, set_state_by_key}) 
{
    const [email, set_email] = useState("")
    const [password, set_password] = useState("")

    function subimt_login(e) {
        e.preventDefault()
        singin()
    }

    return(
    <form onSubmit={subimt_login} className="sign-in__form">
        <div className="form__value">
            <label>Email</label>
            <input value={email}   onChange={(e) => {set_email(e.target.value); set_state_by_key("email", e.target.value)}} type="email"  required/>
        </div>
        <div className="form__value">
            <label>Contraseña</label>
            <input value={password}  onChange={(e) => {set_password(e.target.value); set_state_by_key("password", e.target.value)}}  type="password"  required/>
        </div>
        <div className="form__next">
            {email.trim().length > 0 && password.trim().length > 0
            ? <input type="submit" value="Registrarse" className="next__buttom"/>
            : null}
        </div> 
    </form>
    )
}

export default SignInStepOne;
