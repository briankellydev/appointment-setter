import React from 'react';
import { Snackbar, SnackbarContent } from '@material-ui/core';

export class MySnackbar extends React.Component<{variant: string}> {
    
    render() {
        return (
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
                }}
                open={true}
                autoHideDuration={2000}
            >
                <SnackbarContent
                message={this.props.variant.toUpperCase()}
                >

                </SnackbarContent>
            </Snackbar>
        )
    }
}