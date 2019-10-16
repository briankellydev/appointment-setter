import http from '../auth/axios';

interface NewTenant {
    email: string;
    password: string;
    name: string;
}

export class TenantService {
    createTenant(tenant: NewTenant) {
        return http.post('/tenants/create', tenant);
    }

    getCurrentTenant() {
        return http.get('/tenants/current');
    }
}

export default TenantService;