import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {InputText} from 'primereact/components/inputtext/InputText';
import {Button} from 'primereact/components/button/Button';

import Growl from '../growl';
import {loginRedirectCreator} from '../../redux/actions/authenticationActions';

import {validField, validEmail, validPassword, validConfirmPassword} from '../../utils/formValidator';

import splash from '../../assets/images/splash.png';
import './register.css';

class RegisterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                email: '',
                fullName: '',
                password: '',
            },
            errors: {
                email: null,
                fullName: null,
                password: null,
                confirmPassword: null
            },
            showMessage: false
        };

        this.checkConfirmPassword = this.checkConfirmPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.headToLogin = this.headToLogin.bind(this);
        this.onGrowlClick = this.onGrowlClick.bind(this);
    }

    checkConfirmPassword(password, confirmPassword) {
        let errors = this.state.errors;
        errors.confirmPassword = !validConfirmPassword(password, confirmPassword);
        this.setState({errors: errors});
    }

    handleSubmit() {
        const email = this.state.values.email;
        const fullName = this.state.values.fullName;
        const password = this.state.values.password;
        !Object.values(this.state.errors).includes(true)
        &&
        axios.post('/register', {email, fullName, password})
            .then(response => this.props.loginRedirectCreator())
            .catch(error => {
                this.setState({showMessage: true});
                throw new Error(error);
            });
    }

    onGrowlClick() {
        this.setState({showMessage: !this.state.showMessage});
    }

    headToLogin() {
        this.props.loginRedirectCreator();
    }

    render() {
        return (
            <div className='register-wrapper'>
                <Growl header='Problem' body='Username already exists' positive={false} onClick={this.onGrowlClick}
                       showGrowl={this.state.showMessage === true}/>
                <img src={splash} alt='Splash image' draggable='false'></img>
                <div className='label-text'>EMAIL</div>
                <div>
                    <InputText
                        id='email'
                        className={this.state.errors.email === true && 'error-input'}
                        onChange={event => {
                            let values = this.state.values;
                            values.email = event.target.value;
                            this.setState({values: values});
                            let errors = this.state.errors;
                            errors.email = !validEmail(event.target.value);
                            this.setState({errors: errors});
                        }}
                        onBlur={event => {
                            let errors = this.state.errors;
                            errors.email = !validEmail(event.target.value);
                            this.setState({errors: errors});
                        }}
                    />
                </div>
                {this.state.errors.email === true && <div className='error-message'>This field is wrong</div>}
                <div className='label-text'>FULL NAME</div>
                <div>
                    <InputText
                        id='fullName'
                        className={this.state.errors.fullName === true && 'error-input'}
                        onChange={event => {
                            let values = this.state.values;
                            values.fullName = event.target.value;
                            this.setState({values: values});
                            let errors = this.state.errors;
                            errors.fullName = !validField(event.target.value);
                            this.setState({errors: errors});
                        }}
                        onBlur={event => {
                            let errors = this.state.errors;
                            errors.fullName = !validField(event.target.value);
                            this.setState({errors: errors});
                        }}
                    />
                </div>
                {this.state.errors.fullName === true && <div className='error-message'>This field is wrong</div>}
                <div className='label-text'>PASSWORD</div>
                <div>
                    <InputText
                        id='password'
                        type='password'
                        onChange={event => {
                            let values = this.state.values;
                            values.password = event.target.value;
                            this.setState({values: values});
                            let errors = this.state.errors;
                            errors.password = !validPassword(event.target.value);
                            this.setState({errors: errors});
                        }}
                        onBlur={event => {
                            let errors = this.state.errors;
                            errors.password = !validPassword(event.target.value);
                            this.setState({errors: errors});
                        }}
                    />
                </div>
                {this.state.errors.password === true && <div className='error-message'>This field is wrong</div>}
                <div className='label-text'>CONFIRM PASSWORD</div>
                <div>
                    <InputText
                        id='confirmPassword'
                        type='password'
                        onChange={event => {
                            this.checkConfirmPassword(this.state.values.password, event.target.value);
                        }}
                        onBlur={(event) => this.checkConfirmPassword(this.state.values.password, event.target.value)}
                    />
                </div>
                {this.state.errors.confirmPassword === true && <div className='error-message'>This field is wrong</div>}
                <div className='submit-button-wrapper'>
                    <Button label='SUBMIT' onClick={this.handleSubmit}
                            disabled={Object.values(this.state.errors).includes(true) || Object.values(this.state.errors).includes(null)}></Button>
                </div>
                <div className='label-text'>Already has account? Login</div>
                <div>
                    <Button label="LOGIN" onClick={this.headToLogin}></Button>
                </div>
            </div>
        );
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({loginRedirectCreator}, dispatch);

export default connect(null, mapDispatchToProps)(RegisterPage);