import '../shared.scss';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LoginService from '../../services/login.service';
import globalState from '../../state-management';

const loginService = new LoginService();

interface State {
    [key: string]: string;
    username: string;
    password: string;
}

const InitialState = {
    username: '',
    password: ''
}

const KEYS = {
    USERNAME: 'username',
    PASSWORD: 'password'
}

export class Login extends React.Component<any, State> {

    state: State;
    props: any;
    error: any;

    constructor() {
        super({}, InitialState);
        this.state = InitialState;
    }

    componentDidMount() {
        if (localStorage.getItem('x-auth-token') && localStorage.getItem('x-auth-token') !== 'undefined') {
            this.props.history.push('/dashboard');
        }
    }

    render() {
        return (
            <div className="Login">
                <div className="Login-main">
                    <h3>Login</h3>
                    <form>
                        <div>
                            <TextField
                                label="E-Mail"
                                value={this.state.username}
                                onChange={this.handleChange(KEYS.USERNAME)}
                                margin="normal"
                            />
                        </div>
                        <div>
                            <TextField
                                label="Password"
                                value={this.state.password}
                                type="password"
                                onChange={this.handleChange(KEYS.PASSWORD)}
                                margin="normal"
                            />
                        </div>
                        <div className="row">
                            <div className="col-2"></div>
                            <div className="col-4">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => this.signUp()}
                                >
                                    Sign Up
                                </Button>
                            </div>
                            <div className="col-4">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={!this.state.username || !this.state.password}
                                    onClick={() => this.login()}
                                >
                                    Login
                                </Button>
                            </div>
                            <div className="col-2"></div>
                        </div>
                    </form>
                    {this.error}
                </div>
            </div>
        );
    }

    handleChange = (key: string) => (event: any) => {
        this.setState({[key]: event.target.value});
    };

    login() {
        loginService.login(this.state.username, this.state.password).then((res) => {
            localStorage.setItem('x-auth-token', res.headers['x-auth-token']);
            globalState.checkLoginStatus().then(() => {
                this.props.history.push('/dashboard');
            });
        }).catch(() => {
            this.error = (
                <div className="error">
                    Incorrect Credentials
                </div>
            );
        });
    }

    signUp() {
        this.props.history.push('/signup');
    }

}

export default Login;   