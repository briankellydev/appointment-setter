import http from '../auth/axios';
import User from '../interfaces/user.interface';
import Appointment from '../interfaces/appointment.interface';

export class UserService {
    getCurrentUser() {
        return http.get('/users/current');
    }

    getPractitioners() {
        return http.get('/users/practitioners');
    }

    createUser(user: User) {
        return http.post('/users/create', user);
    }

    createAppointment(appointment: Appointment) {
        return http.post('/users/appointment/create', appointment);
    }

    getPractitionerById(id: string) {
        return http.get(`/users/practitioners/one`, {params: {practitionerId: id}});
    }

    cancelAppointment(appointment: Appointment) {
        const payload = {
            start: appointment.start,
            clientId: appointment.clientId,
            practitionerId: appointment.practitionerId
        };
        return http.delete('/users/appointment/remove', {data: payload});
    }
}