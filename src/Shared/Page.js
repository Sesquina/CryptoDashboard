import React from 'react'
import { AppContext } from '../App/AppProvider'

export default function ({ name, children }) {
    return (
        <AppContext.Consumer>
            {({ page }) => {
                if (page !== name) { //Checking the name of teh page with the name of the child
                    return null;
                }
                return <div>{children}</div>;
            }}
        </AppContext.Consumer>
    );
}