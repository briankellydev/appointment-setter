import React from 'react';
import './App.scss';
import { GlobalHeader } from './GlobalHeader/GlobalHeader.component';
import globalState from './state-management';
import TenantService from './services/tenant.service';
import { UserService } from './services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


const tenantService = new TenantService();
const userService = new UserService();

export class App extends React.Component<{router: any, history: string[]}, {loading: boolean, initialLoginCheck: boolean}> {
  state = {
    loading: true,
    initialLoginCheck: false
  };

  destroy$ = new Subject();


  componentDidMount() {
    this.checkLoginStatus();
  }

  componentWillUnmount() {
    this.destroy$.next();
  }

  render() {
    return (
        <div className="App">
          {this.state.loading ? (<span></span>) : this.props.router}
        </div>
      
    );
  }

private checkLoginStatus() {
  globalState.checkLoginStatus().then((loggedIn: boolean) => {
    if (!loggedIn) {
      this.setState({loading: false, initialLoginCheck: true});
      localStorage.removeItem('x-auth-token');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    } else {
      this.setState({loading: false, initialLoginCheck: true});
    }
    
  });

}

}

export default App;
