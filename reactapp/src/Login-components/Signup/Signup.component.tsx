import '../shared.scss';
import React, { ReactElement } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TenantService from '../../services/tenant.service';
import { MySnackbar } from '../../MySnackbar/MySnackbar.component';

const tenantService = new TenantService();

interface State {
    [key: string]: string;
    username: string;
    password: string;
    passwordConfirm: string;
    tenantName: string;
    fullName: string;
    welcomeMessage: string;
}

const InitialState: State = {
    username: '',
    password: '',
    passwordConfirm: '',
    tenantName: '',
    fullName: '',
    welcomeMessage: ''
}

const KEYS = {
    USERNAME: 'username',
    PASSWORD: 'password',
    PASSWORD_CONFIRM: 'passwordConfirm',
    TENANT_NAME: 'tenantName',
    FULL_NAME: 'fullName',
    WELCOME_MESSAGE: 'welcomeMessage'
}

export class Signup extends React.Component<any, State> {
    error: any;
    props: any;
    state = InitialState;
    private snackbar: ReactElement;

    render() {
        return (
            <div className="Signup">
                <div className="Signup-main">
                    <h3>Sign Up</h3>
                    <form>
                        <div>
                            <TextField
                                label="E-mail"
                                value={this.state.username}
                                onChange={this.handleChange(KEYS.USERNAME)}
                                margin="normal"
                            />
                        </div>
                        <div>
                            <TextField
                                label="Full Name"
                                value={this.state.fullName}
                                onChange={this.handleChange(KEYS.FULL_NAME)}
                                margin="normal"
                            />
                        </div>
                        <div>
                            <TextField
                                label="Tenant Name"
                                value={this.state.tenantName}
                                onChange={this.handleChange(KEYS.TENANT_NAME)}
                                margin="normal"
                            />
                        </div>
                        <div>
                            <TextField
                                label="Tenant Welcome Message"
                                value={this.state.welcomeMessage}
                                onChange={this.handleChange(KEYS.WELCOME_MESSAGE)}
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
                        <div>
                            <TextField
                                label="Confirm"
                                value={this.state.passwordConfirm}
                                type="password"
                                onChange={this.handleChange(KEYS.PASSWORD_CONFIRM)}
                                margin="normal"
                            />
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={
                                    this.state.password !== this.state.passwordConfirm ||
                                    !this.state.username ||
                                    !this.state.password ||
                                    !this.state.tenantName ||
                                    !this.state.fullName
                                }
                                onClick={() => this.signUp()}
                            >
                                Sign Up
                            </Button>
                        </div>
                    </form>
                    {this.error}
                    {this.snackbar}
                </div>
            </div>
        )
    }

    handleChange = (key: string) => (event: any) => {
        this.setState({[key]: event.target.value});
        let compareKey;
        if (key === KEYS.PASSWORD || key === KEYS.PASSWORD_CONFIRM) {
            compareKey = key === KEYS.PASSWORD ? KEYS.PASSWORD_CONFIRM : KEYS.PASSWORD;
            this.error = event.target.value !== this.state[compareKey] ?
            (
                <div className="error">
                    Passwords Must Match
                </div>
            ) : (<div></div>);
        } else {
            this.error = (<div></div>);
        }
        this.forceUpdate();
    };

    private signUp() {
        const payload = {
            email: this.state.username,
            password: this.state.password,
            name: this.state.tenantName,
            fullName: this.state.fullName,
            welcomeMessage: this.state.welcomeMessage
        }
        tenantService.createTenant(payload).then(() => {
            this.snackbar = (
                <MySnackbar variant="success"></MySnackbar>
            );
            this.forceUpdate();
            setTimeout(() => {
                this.snackbar = (<span></span>);
                this.forceUpdate();
                this.props.history.push('/');
            }, 2500);
        }).catch(() => {
            this.snackbar = (
                <MySnackbar variant="error"></MySnackbar>
            );
            this.forceUpdate();
            setTimeout(() => {
                this.snackbar = (<span></span>);
                this.forceUpdate();
            }, 2500);
        });
    }
}