import './CreateAppointment.component.scss';
import React, { ReactElement } from 'react';
import Card from '../Card/Card.component';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@material-ui/core';
import globalState from '../state-management';
import { takeUntil } from 'rxjs/operators';
import User from '../interfaces/user.interface';
import { Subject } from 'rxjs';
import { UserService } from '../services/user.service';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import Appointment from '../interfaces/appointment.interface';
import moment from 'moment';
import { MySnackbar } from '../MySnackbar/MySnackbar.component';

const userService = new UserService();

interface State {
    practitioners: User[];
    selectedPractitioner: User;
    selectedAppointment: Appointment;
    calendarEvents: any;
    appointmentNotes: string;
}

const InitialState: State = {
    practitioners: [],
    selectedPractitioner: {
        fullName: '',
        email: '',
        tenantId: '',
        isAdmin: false,
        isPractitioner: true,
        appointments: [],
        userId: '',
    },
    selectedAppointment: {
        start: '',
        end: '',
        clientId: '',
        practitionerId: '',
        clientName: '',
        practitionerName: ''
    },
    appointmentNotes: '',
    calendarEvents: []
}

export class CreateAppointment extends React.Component<{}, State> {
    cardContent: ReactElement;
    calendar: ReactElement;
    snackbar: ReactElement;
    menuItems: any[] = [];
    state = InitialState;
    selectedPractitioner: User;
    private practitioners: User[];
    private user: User;
    private destroy$ = new Subject();
    
    componentDidMount() {
        this.initialize();
        globalState.user.pipe(takeUntil(this.destroy$)).subscribe((user: User) => {
            this.user = user;
            this.setUpAppointments();
        });

    }

    componentWillUnmount() {
        this.destroy$.next();
    }

    render() {
        return (
            <div className="CreateAppointment">
                <Card headerText="Schedule An Appointment" bodyHtml=""></Card>
                <div className="row">
                    <div className="col-6">
                        <Card headerText="Choose a Provider" bodyHtml={this.cardContent}></Card>
                    </div>
                    <div className="col-6">
                        <Card headerText="" bodyHtml={this.calendar}></Card>
                    </div>
                </div>
                {this.snackbar}
            </div>
        );
    }

    private initialize() {
        userService.getPractitioners().then((resp) => {
            this.practitioners = resp.data;
            resp.data.forEach((practitioner: User) => {
                this.menuItems.push(
                    (<MenuItem key={practitioner.userId} value={practitioner.fullName}>{practitioner.fullName}</MenuItem>)
                );
            });
            this.renderCard();
            this.renderCalendar();
            this.setState({practitioners: resp.data});
        });
    }

    private handleDateClick = (event: any) => {
        this.setState(
            {
                selectedAppointment: {
                    start: event.dateStr,
                    end: moment(event.dateStr).add(1, 'hour').toISOString(),
                    clientId: this.user.userId,
                    practitionerId: this.state.selectedPractitioner.userId,
                    clientName: this.user.fullName,
                    practitionerName: this.state.selectedPractitioner.fullName,
                    notes: '',
                    color: '#AA5939'
                }
            }, () => {
                this.setUpAppointments();
            }
        );
    }

    private handleChange = (event: any) => {
        const selectedPractitioner = this.practitioners.find((pract: User) => {
            return pract.fullName === event.target.value;
        });
        userService.getPractitionerById(selectedPractitioner.userId).then((resp: {data: User}) => {
            this.setState({selectedPractitioner: resp.data}, () => {
                this.setUpAppointments();
            });
        });
    }

    private setUpAppointments() {
        this.state.selectedPractitioner.appointments.forEach((appointment) => {
            appointment.color = '#AA8E39';
        });
        this.setState(
            {
                calendarEvents: this.user.appointments.concat(this.state.selectedPractitioner.appointments).concat(this.state.selectedAppointment)
            }, () => {
                this.renderCard();
                this.renderCalendar();
                this.forceUpdate();
            }
        );
    }

    private setNotes = () => (event: any) => {
        this.setState({appointmentNotes: event.target.value}, () => {
            this.renderCard();
            this.forceUpdate();
        });
    };

    private create() {
        const payload: Appointment = {
            start: this.state.selectedAppointment.start,
            end: this.state.selectedAppointment.end,
            clientId: this.state.selectedAppointment.clientId,
            practitionerId: this.state.selectedPractitioner.userId,
            notes: this.state.appointmentNotes,
            clientName: this.user.fullName,
            practitionerName: this.state.selectedPractitioner.fullName
        }
        userService.createAppointment(payload).then((res) => {
            this.snackbar = (
                <MySnackbar variant="success"></MySnackbar>
            );
            this.forceUpdate();
            setTimeout(() => {
                this.snackbar = (<span></span>);
                this.forceUpdate();
            }, 2500);
            this.initialize();
        }, ).catch(() => {
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

    private renderCard() {
        this.cardContent = (
            <div className="schedule-card-content">
                <form>
                    <FormControl>
                        <InputLabel>Provider</InputLabel>
                        <Select
                        value={this.state.selectedPractitioner.fullName}
                        onChange={this.handleChange}
                        >
                            {this.menuItems}
                        </Select>
                    </FormControl>
                </form>
                {this.state.selectedPractitioner.fullName ?
                    (<div>
                        <h3>{this.state.selectedPractitioner.fullName}</h3>
                        <p>{this.state.selectedPractitioner.notes}</p>
                    </div>) :
                    (<span></span>)}
                {this.state.selectedAppointment.start ?
                    (<div>
                        <div>
                            <div className="text-bold">Appointment Time</div>
                            {
                                `${moment(this.state.selectedAppointment.start).format('MMMM Do YYYY, h:mm a')} - 
                                ${moment(this.state.selectedAppointment.end).format('MMMM Do YYYY, h:mm a')}`
                            }
                            <form>
                                <div>
                                    <TextField
                                        label="Notes"
                                        value={this.state.appointmentNotes}
                                        onChange={this.setNotes()}
                                        margin="normal"
                                    >
                                    </TextField>
                                </div>
                                <div className="text-center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!this.state.selectedAppointment.start || !this.state.selectedPractitioner.fullName}
                                        onClick={() => this.create()}
                                    >
                                        Create
                                    </Button>
                                </div>
                            </form>
                            
                        </div>
                    </div>) :
                    (<span></span>)
                }
            </div>
        );
    }

    private renderCalendar() {
        this.calendar = (
            <FullCalendar
                defaultView="timeGridWeek"
                allDaySlot={false}
                minTime="09:00:00"
                maxTime="17:00:00"
                events={this.state.calendarEvents}
                plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin ]}
                dateClick={this.handleDateClick}
            />
        );
    }
}

export default CreateAppointment;