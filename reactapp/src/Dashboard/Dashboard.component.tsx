import './Dashboard.component.scss';
import React, { ReactElement } from 'react';
import User from '../interfaces/user.interface';
import globalState from '../state-management';
import Tenant from '../interfaces/tenant.interface';
import Card from '../Card/Card.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Button } from '@material-ui/core';

interface State {
    tenant: Tenant;
    user: User;
    loading: boolean;
}

const InitialState: State = {
    tenant: {
        name: '',
        tenantId: '',
        welcomeMessage: ''
    },
    user: {
        email: '',
        tenantId: '',
        isAdmin: false,
        isPractitioner: false,
        userId: '',
        appointments: [],
        fullName: ''
    },
    loading: true,
}

export class Dashboard extends React.Component<any, State> {
    state: State = InitialState;

    private destroy$ = new Subject();
    private headerCardContent: ReactElement;
    private welcomeCardContent: ReactElement;
    private actionsCardContent: ReactElement;

    componentDidMount() {
        globalState.tenant.pipe(takeUntil(this.destroy$)).subscribe((tenant: Tenant) => {
                this.setState({tenant: tenant}, () => {
                    if (tenant) {
                        this.headerCardContent = (
                            <div className="welcome-card">
                                {this.state.tenant.welcomeMessage}
                            </div>
                        )
                        if (this.state.user) {
                            this.setState({loading: false});
                        }
                    }
                });
            
        });
        globalState.user.pipe(takeUntil(this.destroy$)).subscribe((user: User) => {
            this.setState({user: user}, () => {
                if (user) {
                    this.welcomeCardContent = user.appointments && user.appointments.length ? (
                        <div>{user.appointments.filter((appointment) => {
                            return moment(appointment.start).isAfter(moment().subtract(5, 'days'));
                        }).map((appointment, index) => {
                            return index < 5 ? (
                                <div key={index.toString()}>
                                    <div className="text-bold">
                                        {user.isPractitioner ? appointment.clientName : appointment.practitionerName}
                                    </div>
                                    <div>
                                        {
                                            moment(appointment.start).format('MMMM Do YYYY, h:mm a')
                                        }
                                    </div>
                                    
                                </div>
                            ) : (<span></span>)
                        })}</div>
                    ) : (
                        <div>
                            You have no upcoming appointments scheduled. {user.isPractitioner || user.isAdmin ? 
                            (<span></span>) :
                            (
                                <Link to="/appointment/create">Would you like to schedule one?</Link>
                            )}
                        </div>
                    );
                    this.actionsCardContent = (
                        <div className="actions-card text-center">
                            {user.isAdmin ?
                                (
                                    <div>
                                        <Link to="/account/create">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                            >
                                                Create An Account
                                            </Button>
                                        </Link>
                                    </div>
                                ) :
                                (<span></span>)
                            }
                            <div>
                                <Link to="/appointment/create">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                    >
                                        Schedule An Appointment
                                    </Button>
                                </Link>
                            </div>
                            <div>
                                <Link to="/appointment/my">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                    >
                                        My Appointments
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    );
                    if (this.state.tenant) {
                        this.setState({loading: false});
                    }
                }
            });
            
            
        });
    }

    componentWillUnmount() {
        this.destroy$.next();
    }

    render() {
        return (
            <div className="Dashboard">
                <Card headerText="Admin Dashboard" bodyHtml={this.headerCardContent}></Card>
                {this.state.loading ? (<span></span>) : (<div className="row">
                    <div className="col-12 col-md-6">
                        {
                            (<Card headerText="Upcoming Appointments" bodyHtml={this.welcomeCardContent}></Card>)
                        }
                    </div>
                    <div className="col-12 col-md-6">
                        <Card headerText="Actions" bodyHtml={this.actionsCardContent}></Card>
                    </div>
                </div>)}
            </div>
        );
    }
}