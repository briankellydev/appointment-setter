export interface NewUser {
    [key: string]: string | boolean;
    fullName: string;
    email: string;
    isPractitioner: boolean;
    password: string;
    tenantId: string;
    notes: string;
}

export default NewUser;