import React from 'react'
import styled, { css } from 'styled-components';

import { blueBoxShadow } from '../Shared/Styles'

const CoinImage = styled.img`
    height: 50px;
    ${props => props.spotlight && css`
        ${blueBoxShadow}
        display: block;
        height: 200px;
        margin: auto;
    `}
`

export default function ({ coin, spotlight }) {
    return <CoinImage
        spotlight={spotlight}
        src={`http://cryptocompare.com/${coin.ImageUrl}`}
        alt={coin.CoinSymbol}
    />;
}
