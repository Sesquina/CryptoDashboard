import React from 'react'
import styled from 'styled-components'
import { AppContext } from '../App/AppProvider'
// import { SelectableTile } from '../Shared/Tile'
import CoinTile from './CoinTile'

export const StyledCoindGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    /*Grid table Responsiveness without @media_queries
      auto-fill => fils the row with as many columns as it can fit. The new columsn may be empty but they will still occupy a designated-
    - space in row => Place the columns in the space, even if it has no content in it
      auto-fit => fits the currently available columns into the space, by exapnding them so that they take up any avaialable space => Place
    - only the available columns to the full width
    */
    grid-gap: 20px;
    margin-top: 40px;
`
function getFilteredCoinList(coinList, filteredCoins) {// Helper fn() to check if filteredCoins exists
    return (filteredCoins && Object.keys(filteredCoins)) ||//return filteredCoins & the keys of those coins, as filteredCoins is a keyed list
        Object.keys(coinList).slice(0, 100) //Return the sliced list of 1st 100 keys, if filtered doesn't exist
}
function getCoinsToDisplay(coinList, favouriteSection, favourites, filteredCoins) {
    return favouriteSection ? favourites : getFilteredCoinList(coinList, filteredCoins);
    // return favouriteSection ? favourites : Object.keys(coinList).slice(0, 100); > Instead of just displaying a sliced coinList, the-
    //- filteredCoins may be checked if it exists(a helper fn() is used here for checking), and display that instead of a sliced list
    //Display the favourites in the favouriteSection, instead os slicing the list
}
export default function ({ favouriteSection }) {
    return (
        <AppContext.Consumer>
            {({ coinList, favourites, filteredCoins }) =>
                <StyledCoindGrid>
                    {getCoinsToDisplay(coinList, favouriteSection, favourites, filteredCoins).map(coinKey => <CoinTile key={coinKey} favouriteSection={favouriteSection} coinKey={coinKey} />)}
                </StyledCoindGrid>
            }
        </AppContext.Consumer>
    )
}