import './MyAppointments.component.scss';
import React, { ReactElement } from 'react';
import Card from '../Card/Card.component';
import globalState from '../state-management';
import { takeUntil } from 'rxjs/operators';
import User from '../interfaces/user.interface';
import { Subject } from 'rxjs';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import Appointment from '../interfaces/appointment.interface';
import moment from 'moment';
import { Button } from '@material-ui/core';
import { UserService } from '../services/user.service';
import { MySnackbar } from '../MySnackbar/MySnackbar.component';

interface State {
    selectedAppointment: Appointment;
    user: User;
}

const InitialState: State = {
    selectedAppointment: {
        start: '',
        end: '',
        clientId: '',
        practitionerId: '',
        clientName: '',
        practitionerName: ''
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
}

const userService = new UserService();

export class MyAppointments extends React.Component<any, State> {
    
    state = InitialState;

    private destroy$ = new Subject();
    private calendarCard: ReactElement;
    private detailsCard: ReactElement;
    private snackbar: ReactElement;

    componentDidMount() {
        globalState.user.pipe(takeUntil(this.destroy$)).subscribe((user: User) => {
            this.setState({user: user}, () => {
                this.renderCalendar();
                this.renderDetails();
                this.forceUpdate();
            });
        });
    }

    componentWillUnmount() {
        this.destroy$.next();
    }

    render() {
        return (
            <div className="MyAppointments">
                <Card headerText="My Appointments" bodyHtml=""></Card>
                <div className="row">
                    <div className="col-6">
                        <Card headerText="My Calendar" bodyHtml={this.calendarCard}></Card>
                    </div>
                    <div className="col-6">
                        <Card headerText="Appointment Details" bodyHtml={this.detailsCard}></Card>
                    </div>
                </div>
                {this.snackbar}
            </div>
        )
    }

    private handleClick(event: any) {
        const selectedAppointment = this.state.user.appointments.find((appointment) => {
            return moment(appointment.start).toISOString() === moment(event.event.start).toISOString();
        });
        this.setState({selectedAppointment: selectedAppointment}, () => {
            this.renderDetails();
            this.forceUpdate();
        });
    }

    private renderCalendar() {
        this.calendarCard = (
            <FullCalendar
            defaultView="timeGridWeek"
            allDaySlot={false}
            minTime="09:00:00"
            maxTime="17:00:00"
            events={this.state.user.appointments}
            plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin ]}
            eventClick={this.handleClick.bind(this)}
        />
        );
    }

    private renderDetails(confirm = false) {
        this.detailsCard = this.state.selectedAppointment.start ? (
            <div>
                <div className="text-bold">
                    {this.state.selectedAppointment.practitionerName}
                </div>
                <div>
                    {moment(this.state.selectedAppointment.start).format('MMMM Do YYYY, h:mm a')}
                </div>
                <div className="text-center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.cancelAppointment()}
                    >
                        Cancel Appointment
                    </Button>
                </div>
                {confirm ? (
                    <div className="text-center">
                        <p className="text-bold">Are you sure you want to cancel?</p>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.confirmCancel()}
                        >
                            Cancel Appointment
                        </Button>
                    </div>
                ) :
                (<span></span>)}
            </div>
        ) : (<div>Please select an appointment from the left.</div>)
    }

    private getUser() {
        userService.getCurrentUser().then((resp: {data: User}) => {
            globalState.user.next(resp.data);
        });
    }

    private cancelAppointment() {
        this.renderDetails(true);
        this.forceUpdate();
    }

    private confirmCancel() {
        userService.cancelAppointment(this.state.selectedAppointment).then(() => {
            this.snackbar = (
                <MySnackbar variant="success"></MySnackbar>
            );
            this.forceUpdate();
            this.getUser();
            setTimeout(() => {
                this.snackbar = (<span></span>);
                this.forceUpdate();
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