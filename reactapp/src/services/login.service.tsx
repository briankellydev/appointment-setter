import http from '../auth/axios';

export class LoginService {
    login(username: string, password: string) {
        return http.post('/auth/login', {email: username, password: password});
    }

    createUser(username: string, password: string) {
        return http.post('/users/create', {email: username, password: password});
    }
}

export default LoginService;