import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import fuzzy from 'fuzzy';
import { backgroundColor2, fontSize2 } from '../Shared/Styles';
import { AppContext } from '../App/AppProvider';

const StyledSearchGrid = styled.div`
    display: grid;
    grid-template-columns: 220px 1fr;
`
const StyledSearchInput = styled.input`
    ${backgroundColor2}
    ${fontSize2}
    border: 1.5px solid;
    height: 35px;
    color: #1163c9;
    place-self: center left;
    border-radius: 3px;
`
// lodash provides debounce functions that help prevent executing multiple events, by delaying consecutive event/function calls
// debounce function is used here to perform too many filtering operations at the same time, while searching for a coin => the filtering-
//- operations won't be triggered for every alphabet(s) that's entered, before completion
const handleFilter = _.debounce((inputValue, coinList, setFilteredCoins) => {
    // 1) Get all the coin symbols
    let coinSymbols = Object.keys(coinList);
    // 2) Get all the Coin Names and map the symbol to the names
    let coinNames = coinSymbols.map(sym => coinList[sym].CoinName);
    // 3) Concatenate the Symbols and Names into 1 list , so Eg: the user can search for Bitcoin by typing name Bitcoin or Symbol BTC
    let allStringsToSearch = coinSymbols.concat(coinNames); //allStringsToSearch -> has both coin names and coin symbols
    let fuzzyResults = fuzzy
        .filter(inputValue, allStringsToSearch, {}) // value to search, arrey to look in, options array(optional)
        .map(result => result.string); //mapping all array values to their string property[string is the prop that holds the name]
    let filteredCoins = _.pickBy(coinList, (result, symKey) => { //Creates an object composed of the object properties, based on a callback
        // arg1 : datastructure to look in || arg2: callback -> iterator fn(value to look for)
        let coinName = result.CoinName;
        // A truthful expn should be returned here, in this case, if the expn is true, corresponding key would be removed off the coinList
        return (_.includes(fuzzyResults, symKey) || _.includes(fuzzyResults, coinName)) // This allows to search coins by name/symbol
    });
    console.log(filteredCoins);
    setFilteredCoins(filteredCoins); // This sets the filteredCoins in the state of AppProvider.js, so it will be available in coinGrid
}, 500);//500 -> atleast half a second should pass, before setting this debounce function

function filterCoins(e, setFilteredCoins, coinList) {
    let inputValue = e.target.value;
    if (!inputValue) {// To check if the user input is empty
        setFilteredCoins(null);// => display sliced list of 1st 100 coins from coinList, if the user has not typed anything or-
        //- if the user had cleared the input
        return;
    }
    handleFilter(inputValue, coinList, setFilteredCoins);
}

export default function () {
    return (
        <AppContext.Consumer>
            {({ setFilteredCoins, coinList }) =>
                <StyledSearchGrid>
                    <h1>Search Coins</h1>
                    <StyledSearchInput onKeyUp={(e) => filterCoins(e, setFilteredCoins, coinList)} />
                </StyledSearchGrid>
            }
        </AppContext.Consumer>
    )
}