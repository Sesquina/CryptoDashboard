import React from 'react'
import styled, { css } from 'styled-components';
import { AppContext } from './AppProvider';

const Logo = styled.div`
    font-size: 1.5em;
`

const Bar = styled.div`
    display:grid;
    margin-bottom: 40px;
    grid-template-columns: 180px auto 100px 100px;
`

const ControlButonElem = styled.div`
    cursor: pointer;
    ${props => props.active && css`
        color: red;
        text-shadow: 0px 0px 0px gold;
    `}
    ${props => props.hidden && css`
        display:none;
    `}
`

function toProperCase(lower) {
    return lower.charAt(0).toUpperCase() + lower.substr(1);
}

function ControlButton({ name }) {
    // Consumer takes in a callback fn() || The page is checked to see if it is active, by verfying if the page === name that is passed in
    return (
        <AppContext.Consumer>
            {({ firstVisit, page, setPage }) => (
                <ControlButonElem
                    active={page === name}
                    onClick={() => setPage(name)}
                    hidden={firstVisit && name === 'dashboard'}
                >
                    {toProperCase(name)}
                </ControlButonElem>
            )}
        </AppContext.Consumer>
    )
}

export default function () {
    return (
        <div>
            <Bar>
                <Logo>CryptoDash</Logo>
                <div></div>
                <ControlButton active name="dashboard" />
                <ControlButton name="settings" />
            </Bar>
        </div>
    );
}