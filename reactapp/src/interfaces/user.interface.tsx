import Appointment from './appointment.interface';

export interface User {
    email: string;
    password?: string;
    tenantId: string;
    isAdmin: boolean;
    isPractitioner: boolean;
    userId: string;
    appointments: Appointment[];
    fullName: string;
    notes?: string;
}

export default User;