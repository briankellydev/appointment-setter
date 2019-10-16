import React from 'react';
import './App.scss';
import globalState from './state-management';
import { Subject } from 'rxjs';

export class App extends React.Component<{router: any, history: string[]}, {loading: boolean, initialLoginCheck: boolean}> {
  state = {
    loading: true,
    initialLoginCheck: false
  };

  private destroy$ = new Subject();


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
      if (window.location.pathname !== '/' || window.location.pathname !== '/signup') {
        window.location.href = '/';
      }
    } else {
      this.setState({loading: false, initialLoginCheck: true});
    }
    
  });

}

}

export default App;
