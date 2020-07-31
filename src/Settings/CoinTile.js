import React from 'react'
import { AppContext } from '../App/AppProvider'
import { SelectableTile, DeletableTile, DisabledTile } from '../Shared/Tile'
import CoinHeaderGrid from './CoinHeaderGrid'
import CoinImage from '../Shared/CoinImage'

function coinClickHandler(favouriteSection, coinKey, addCoin, removeCoin) {
    return favouriteSection ? () => {
        removeCoin(coinKey)
    } : () => {
        addCoin(coinKey)
    }
}

export default function ({ coinKey, favouriteSection }) {
    return (
        <AppContext.Consumer>
            {({ coinList, addCoin, removeCoin, isInFavourites }) => {
                let coin = coinList[coinKey];  // This is a Coin Object
                let TileClass = SelectableTile;

                if (favouriteSection) { // If in favouriteSection
                    TileClass = DeletableTile;
                } else if (isInFavourites(coinKey)) { // If in the main coin list
                    TileClass = DisabledTile; // Give the DisabledTile styling, for the tiles present in favouriteSection
                }

                return (
                    <TileClass onClick={coinClickHandler(favouriteSection, coinKey, addCoin, removeCoin)}>
                        <CoinHeaderGrid favouriteSection={favouriteSection} name={coin.CoinName} symbol={coin.Symbol} />
                        <CoinImage coin={coin} />
                    </TileClass>
                )
            }}
        </AppContext.Consumer>
    )
}