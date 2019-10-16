import './GlobalHeader.component.scss';
import React, { ReactElement } from 'react';
import User from '../interfaces/user.interface';
import globalState from '../state-management';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import Tenant from '../interfaces/tenant.interface';
import { Popover, Drawer } from '@material-ui/core';
import { Link } from 'react-router-dom';

interface State {
    user: User;
    tenant: Tenant;
    userMenuOpen: boolean;
    sidebarOpen: boolean;
}

const InitialState: State = {
    user: null,
    tenant: null,
    userMenuOpen: false,
    sidebarOpen: false
}

export class GlobalHeader extends React.Component<any, State> {
    state: State = InitialState;
    private destroy$ = new Subject<any>();
    private anchorEl: Element;
    private menuContent: ReactElement;

    componentDidMount() {
        globalState.user.pipe(takeUntil(this.destroy$)).subscribe((user: User) => {
            this.setState({user: user}, () => {
                this.renderMenu();
            });
        });
        globalState.tenant.pipe(takeUntil(this.destroy$)).subscribe((tenant: Tenant) => {
            this.setState({tenant: tenant}, () => {
                this.renderMenu();
            });
        });
    }

    componentWillUnmount() {
        this.destroy$.next();
    }

    render() {
        const tenant = Boolean(this.state.tenant) ? (<span>{this.state.tenant.name}</span>) : (<span></span>);
        return (
            <header className="GlobalHeader">
                <Drawer open={this.state.sidebarOpen} onClose={this.toggleDrawer}>
                    {this.menuContent}
                </Drawer>
                {this.state.user ? (<span className="float-left">
                    <i className="fa fa-bars" onClick={this.toggleDrawer}></i>
                </span>) : (<span></span>) }
                <span>{tenant}</span>
                {this.state.user ? (
                    <span className="float-right">
                    <i className="fa fa-user" onClick={this.toggleMenu}></i>
                    <Popover
                    open={this.state.userMenuOpen}
                    anchorEl={this.anchorEl}
                    onClose={this.toggleMenu}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                    }}
                    >
                        <div className="Popover-content">
                            <div className="text-bold hover-menu">
                                {this.state.user.fullName}
                            </div>
                            <div className="border-top hover-menu" onClick={() => this.logout()}>
                                Logout
                            </div>
                        </div>
                        
                    </Popover>
                    </span>) : (<span></span>)}
            </header>
        )
    }

    private toggleMenu = (event?: any) => {
        if (event) {
            this.anchorEl = event.currentTarget;
        }
        this.setState({userMenuOpen: !this.state.userMenuOpen});
    }

    private toggleDrawer = () => {
        this.setState({sidebarOpen: !this.state.sidebarOpen})
    }

    private logout() {
        localStorage.removeItem('x-auth-token');
        window.location.href = '/';
    }

    private renderMenu() {
        this.menuContent = (
            <div className="Drawer-content text-center">
                {this.state.tenant ? (
                    <div className="text-bold Drawer-header">
                        {this.state.tenant.name}
                    </div>
                ) : (<span></span>)}
                
                    <Link to="/dashboard">
                        <div className="menu-item">
                            Dashboard
                        </div>
                    </Link>
                
                {this.state.user && this.state.user.isAdmin ?
                    (
                        
                        <Link to="/account/create">
                            <div className="menu-item">
                            Create An Account
                            </div>
                        </Link>
                        
                    ) :
                    (<span></span>)
                }
                
                <Link to="/appointment/create">
                    <div className="menu-item">
                        Schedule An Appointment
                    </div>
                </Link>
            
                <Link to="/appointment/my">
                    <div className="menu-item">
                        My Appointments
                    </div>
                </Link>
            </div>
        );
    }
};