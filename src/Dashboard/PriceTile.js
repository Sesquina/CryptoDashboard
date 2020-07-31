import React from 'react'
import styled, { css } from 'styled-components'

import { AppContext } from '../App/AppProvider'
import { SelectableTile } from '../Shared/Tile'
import { fontSize3, fontSizeBig, blueBoxShadow } from '../Shared/Styles'
import { StyledCoinHeaderGrid } from '../Settings/CoinHeaderGrid'

const JustifyRight = styled.div`
    justify-self: right;
    color:#35bf2e;
`

const JustifyLeft = styled.div`
    justify-self: left;
`
const CoinPrice = styled.div`
    ${fontSizeBig}
`

const ChangePCT = styled.div`
    color: #35bf2e;
    ${props => props.red && css` color: red; `}
`

// fn() to shorten some price digits
const numberFormat = number => {
    return +(number + '').slice(0, 7);  // Conv number to string -> slice it -> conv back to number(the + at the beginning does that conv)
}

const StyledPriceTile = styled(SelectableTile)`
    ${props => props.compact && css`
        display: grid;
        ${fontSize3}
        grid-gap: 1px;
        grid-template-columns: repeat(3, 1fr);
        justify-items: right;
    `}
    ${props => props.currentFavourite && css`
        ${blueBoxShadow}
        pointer-events: none; /*If the user had already selected current favourite, then the user can't click on that tile again*/
    `}
`

function ChangePercent({ data }) {
    return (
        <JustifyRight>
            <ChangePCT red={data.CHANGEPCT24HOUR < 0}>
                {numberFormat(data.CHANGEPCT24HOUR)}%
            </ChangePCT>
        </JustifyRight>
    );
}

function PriceTile({ sym, data, currentFavourite, setCurrentFavourite }) { //currentFavourite is assigned here with a value here, coz if it's-
    //- not put/specifyied with any arguments/values, it will always be true
    return (
        <StyledPriceTile onClick={setCurrentFavourite} currentFavourite={currentFavourite}>
            <StyledCoinHeaderGrid>
                <div> {sym} </div>
                <ChangePercent data={data} />
            </StyledCoinHeaderGrid>
            <CoinPrice>
                ${numberFormat(data.PRICE)}
            </CoinPrice>
        </StyledPriceTile>
    );
}

function PriceTileContent({ sym, data, currentFavourite, setCurrentFavourite }) {
    return (
        <StyledPriceTile onClick={setCurrentFavourite} compact currentFavourite={currentFavourite}>
            <JustifyLeft> {sym} </JustifyLeft>
            <ChangePercent data={data} />
            <div>
                ${numberFormat(data.PRICE)}
            </div>
        </StyledPriceTile>
    );
}

export default function ({ price, index }) {
    let sym = Object.keys(price)[0];
    let data = price[sym]['USD'];
    let TileClass = index < 5 ? PriceTile : PriceTileContent;
    return (
        <AppContext.Consumer>
            {({ currentFavourite, setCurrentFavourite }) =>
                < TileClass
                    sym={sym}
                    data={data}
                    currentFavourite={currentFavourite === sym}
                    setCurrentFavourite={() => setCurrentFavourite(sym)}
                />
            }
        </AppContext.Consumer>
        //setCurrentFavourite is set to an => fn(), only then it could pass in the sym
    )

}