import { BehaviorSubject } from 'rxjs';
import User from './interfaces/user.interface';
import Tenant from './interfaces/tenant.interface';
import { UserService } from './services/user.service';
import { TenantService } from './services/tenant.service';

const userService = new UserService();
const tenantService = new TenantService();

class GlobalState {
    user = new BehaviorSubject<User>(null);
    tenant = new BehaviorSubject<Tenant>(null);
    initialLoginCheck = new BehaviorSubject<boolean>(false);

    checkLoginStatus(): Promise<boolean> {
        if (this.user.value && this.tenant.value) {
            return Promise.resolve(true);
        } else {
            if (localStorage.getItem('x-auth-token') && localStorage.getItem('x-auth-token') !== 'undefined') {
                return Promise.all([userService.getCurrentUser(), tenantService.getCurrentTenant()]).then((resp) => {

                    if (resp[0]) {
                        this.user.next(resp[0].data);
                    }
                    if (resp[1]) {
                        this.tenant.next(resp[1].data);
                    }
                   return Promise.resolve(true);
                  }).catch((error) => {
                      console.log(error);
                      return Promise.resolve(false);
                  });
            } else {
                return Promise.resolve(false);
            }
        }
    }
}

export const globalState = new GlobalState();

export default globalState;