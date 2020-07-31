import React from 'react'
import { AppContext } from '../App/AppProvider'

// This is a wrapper component for the settings page, to make sure that the coinList is not accessed during 1st pageLoad, as the-
//- data won't be available, which when accessed will throw an undefined error, and instead replaced with a Loading text till the-
//- data is available 

export default function Content(props) {
    return (
        <AppContext.Consumer>
            {({ coinList, prices, firstVisit }) => { //Destructurize the provider component's state to fetch these data
                if (!coinList) {
                    return <div>Loading Coins...</div>
                }
                if (!firstVisit && !prices) { //firstVisit is checked here, as the prices won't be fetched if it was the 1st visit as-
                    //- there won't be any favourite coins set by the user, without checking that, the page will stay with the note of-
                    //- "Loading Coin Prices....", it checked to assure thet there are prices fetched, to display the loading text
                    return <div>Loading Coin Pricess...</div>
                }
                return <div>{props.children}</div>
            }}
        </AppContext.Consumer>
    )
}