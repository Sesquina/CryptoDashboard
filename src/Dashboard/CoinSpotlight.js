import React from 'react'

import { Tile } from '../Shared/Tile'
import CoinImage from '../Shared/CoinImage'
import { AppContext } from '../App/AppProvider';
import styled from 'styled-components';

const JustifyLeft = styled.div`
    justify-self: left;
`
const SpotLightName = styled.h2`
    text-align: center;
`

export default function () {
    return (
        <AppContext.Consumer>
            {({ currentFavourite, coinList }) =>
                <Tile>
                    <SpotLightName>{coinList[currentFavourite].CoinName}</SpotLightName>
                    <JustifyLeft>
                        <CoinImage spotlight coin={coinList[currentFavourite]} />
                    </JustifyLeft>
                </Tile>
            }
        </AppContext.Consumer>
    );
}