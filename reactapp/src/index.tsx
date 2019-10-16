import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import Login from './Login-components/Login/Login.component';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { Dashboard } from './Dashboard/Dashboard.component';
import { Signup } from './Login-components/Signup/Signup.component';
import { CreateAppointment } from './CreateAppointment/CreateAppointment.component';
import CreateAccount from './CreateAccount/CreateAccount.component';
import { MyAppointments } from './MyAppointments/MyAppointments.component';
import { GlobalHeader } from './GlobalHeader/GlobalHeader.component';

class ProtectedRoute extends React.Component<{element: ReactElement, history?: string[]}> {
    // TODO this
    render() {
        return this.props.element;
    }
}

const routes = (
    <Router>
        <div>
            <GlobalHeader></GlobalHeader>
            <Route exact path="/" component={Login}/>
            <ProtectedRoute element={(<Route path="/signup" component={Signup} />)}/>
            <ProtectedRoute element={(<Route path="/dashboard" component={Dashboard} />)}/>
            <ProtectedRoute element={(<Route path="/appointment/create" component={CreateAppointment}/>)}/>
            <ProtectedRoute element={(<Route path="/appointment/my" component={MyAppointments}/>)}/>
            <Route path="/account/create" component={CreateAccount} />
        </div>
    </Router>
);

const routing = (
    <App router={routes} history={[]}></App>
    
  )

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
