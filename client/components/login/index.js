import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Button } from 'primereact/components/button/Button';
import { push } from 'react-router-redux';

import { registerRedirectCreator } from '../../redux/actions/authenticationActions';
import { validField } from '../../utils/formValidator';

import splash from '../../assets/images/splash.png';
import './login.css';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                login: '',
                password: ''
            },
            errors: {
                login: null,
                password: null
            }
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.headToRegister = this.headToRegister.bind(this);
    }
    
    handleLogin() {
        !Object.values(this.state.errors).includes(true) 
        && 
        fetch('/login', { 
            method: 'POST',
            body: this.state.values,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(data => console.log(data))
        .catch(error => { throw new Error(error); });
    }

    headToRegister() {
        this.props.registerRedirectCreator();
    }

    render() {
        return (
            <div className='login-wrapper'>
                <img src={splash} alt='Splash image' draggable='false'></img>
                <div className='label-text'>LOGIN</div>
                <div>
                    <InputText
                        id='login' 
                        className={this.state.errors.login === true && 'error-input'} 
                        onChange={event => this.setState({ values: { login: event.target.value } })} 
                        onBlur={event => this.setState({ errors: { login: !validField(event.target.value) } })} 
                        onFocus={() => this.setState({ errors: { login: false }})} 
                    />
                </div>
                {this.state.errors.login === true && <div className='error-message'>This field is wrong</div>}
                <div className='label-text'>PASSWORD</div>
                <div>
                    <InputText
                        id='password' 
                        className={this.state.errors.password === true && 'error-input'} 
                        type='password' onChange={event => this.setState({ values: { password: event.target.value } })} 
                        onBlur={event => this.setState({ errors: { password: !validField(event.target.value) } })} 
                        onFocus={() => this.setState({ errors: { password: false }})} 
                    />
                </div>
                {this.state.errors.password === true && <div className='error-message'>This field is wrong</div>}
                <div className='submit-button-wrapper'>
                    <Button label='SUBMIT' onClick={this.handleLogin}></Button>
                </div>
                <div className='label-text'>Want to register? Head right there!</div>
                <div>
                    <Button label='REGISTER' onClick={this.headToRegister}></Button>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ registerRedirectCreator }, dispatch);

export default connect(null, mapDispatchToProps)(LoginPage);