export interface Appointment {
    start: string;
    end: string;
    clientId: string;
    practitionerId: string;
    clientName: string;
    practitionerName: string;
    notes?: string;
    color?: string;
}

export default Appointment;