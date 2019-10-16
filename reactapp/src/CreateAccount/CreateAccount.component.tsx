import './CreateAccount.component.scss';
import React, { ReactElement } from 'react';
import Card from '../Card/Card.component';
import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@material-ui/core';
import NewUser from '../interfaces/new-user.interface';
import { UserService } from '../services/user.service';
import User from '../interfaces/user.interface';
import globalState from '../state-management';
import { takeUntil } from 'rxjs/operators';
import Tenant from '../interfaces/tenant.interface';
import { Subject } from 'rxjs';
import { MySnackbar } from '../MySnackbar/MySnackbar.component';

const userService = new UserService();

interface State extends NewUser {
    loading: boolean;
}

const InitialState: State = {
    fullName: '',
    email: '',
    isPractitioner: false,
    password: '',
    loading: true,
    tenantId: '',
    notes: ''
}

const KEYS = {
    FULL_NAME: 'fullName',
    EMAIL: 'email',
    PRACTITIONER: 'isPractitioner',
    PASSWORD: 'password',
    NOTES: 'notes'
}

export class CreateAccount extends React.Component<any, State> {
    state = InitialState;
    cardContent: any;
    snackbar: ReactElement;

    private destroy$ = new Subject();

    componentDidMount() {
        globalState.tenant.pipe(takeUntil(this.destroy$)).subscribe((tenant: Tenant) => {
            if (tenant) {
                this.setState({tenantId: tenant.tenantId, loading: false});
            } else {
                this.props.history.push('/dashboard');
            }
        });
    }

    componentWillUnmount() {
        this.destroy$.next();
    }

    render() {
        return (
            <div className="CreateAccount">
                <div className="row text-center">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <Card headerText="Create An Account" bodyHtml={
                        this.state.loading ? (<span></span>) : 
                        (
                            <div>
                                <form>
                                    <div>
                                        <TextField
                                            label="Full Name"
                                            value={this.state.fullName}
                                            onChange={this.handleChange(KEYS.FULL_NAME)}
                                            margin="normal"
                                        >
                                        </TextField>
                                    </div>
                                    <div>
                                        <TextField
                                            label="E-Mail"
                                            value={this.state.email}
                                            onChange={this.handleChange(KEYS.EMAIL)}
                                            margin="normal"
                                        >
                                        </TextField>
                                    </div>
                                    <div>
                                        <TextField
                                            label="Notes"
                                            value={this.state.notes}
                                            onChange={this.handleChange(KEYS.NOTES)}
                                            margin="normal"
                                        >
                                        </TextField>
                                    </div>
                                    <div>
                                        <TextField
                                            label="Temporary Password"
                                            value={this.state.password}
                                            onChange={this.handleChange(KEYS.PASSWORD)}
                                            margin="normal"
                                            type="password"
                                        >
                                        </TextField>
                                    </div>
                                    <div>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">User Type</FormLabel>
                                            <RadioGroup aria-label="type" name="type" value={this.state.isPractitioner} onChange={this.radioSelected()}>
                                                <FormControlLabel value={true} control={<Radio />} label="Provider" />
                                                <FormControlLabel value={false} control={<Radio />} label="Client" />
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!this.state.fullName || !this.state.password || !this.state.password}
                                        onClick={() => this.create()}
                                    >
                                        Create
                                    </Button>
                                </form>
                            </div>
                        )
                        }></Card>
                    </div>
                    <div className="col-3"></div>
                </div>
                {this.snackbar}
            </div>
        );
    }

    private handleChange = (key: string) => (event: any) => {
        this.setState({[key]: event.target.value});
    };

    private radioSelected = () => (event: any) => {
        this.setState({isPractitioner: event.target.value === 'true'});
    }

    private create() {
        const payload: User = {
            fullName: this.state.fullName,
            email: this.state.email,
            isPractitioner: this.state.isPractitioner,
            isAdmin: false,
            password: this.state.password,
            appointments: [],
            userId: '',
            tenantId: this.state.tenantId,
            notes: this.state.notes,
        }
        userService.createUser(payload).then(() => {
            this.snackbar = (
                <MySnackbar variant="success"></MySnackbar>
            );
            this.forceUpdate();
            setTimeout(() => {
                this.snackbar = (<span></span>);
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

export default CreateAccount;
