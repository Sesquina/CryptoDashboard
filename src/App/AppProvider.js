import React from 'react'
import _ from 'lodash'
import moment from 'moment' //TO manipulate dates

const cc = require('cryptocompare');
cc.setApiKey('7526ceca46099b0b3079b0e41644bdcf35f17c0f4c0e1b980fdedadfb5b1aa1f')



export const AppContext = React.createContext(); // creating and exporting the context, to use it in teh consumers in the child components

const MAX_FAVOURITES = 10;
const TIME_UNITS = 10;

export class AppProvider extends React.Component {
    //The provider will be exported in the main wrapper, to provide the state to the other components
    constructor(props) {
        super(props);
        this.state = {
            page: 'dashboard',
            // default to the dashboard page, unless the user has any local storage data => new user
            favourites: ['BTC', 'ETH', 'XMR', 'DOGE'],
            timeInterval: 'months',
            ...this.savedSettings(), // This fn(), when called, will spread the results over the rest of the previous properties here
            setPage: this.setPage, // Passing in the updater function, so it can be used in the consumer components
            addCoin: this.addCoin,
            removeCoin: this.removeCoin,
            isInFavourites: this.isInFavourites,
            confirmFavourites: this.confirmFavourites,
            setFilteredCoins: this.setFilteredCoins,
            setCurrentFavourite: this.setCurrentFavourite,
            chartSelectionHandler: this.chartSelectionHandler
        }
    }

    componentDidMount() {
        //Fetch the coins and the prices of the coins on Page visit
        this.fetchCoins();
        this.fetchPrices();
        this.fetchHistorical();
    }

    fetchCoins = async () => {
        let coinList = (await cc.coinList()).Data; // await = > waiting for the Promise = cc.coinList() =>  to resolve
        this.setState({ coinList });
    }

    fetchPrices = async () => {
        //To prevent fetching the prices of the dummy favourites, in the initial state, that are not the user's favourite and which-
        //- have also not been set, on the user's first visit to the page
        if (this.state.firstVisit) return;
        // This statement gets resolved after the promises in priceFetch() are resolved after those promises have all been resolved,
        let prices = await this.priceFetch();//This actaully returns a promise array, which requires to be resolved separately
        prices = prices.filter(price => Object.keys(price).length);
        this.setState({ prices });
    }

    fetchHistorical = async () => {
        if (this.state.firstVisit) return;
        let results = await this.historicalCoinData();
        let historicalData = [
            {
                name: this.state.currentFavourite,
                data: results.map((value, index) => [ //Return an array of x,y coordinates || x -> Date , y -> Price
                    moment().subtract({ [this.state.timeInterval]: TIME_UNITS - index }).valueOf(),
                    //index increments form 0 - 10, by which the prices are extracted from teh response
                    //this.state.timeInterval -> updates the chart data as per the time units choosen on the dropdown
                    value.USD
                ])
            }
        ]
        this.setState({ historicalData });
    }

    priceFetch = async () => {//This will initially be an array of promises, 
        let coinPriceData = [];
        for (let i = 0; i < this.state.favourites.length; i++) {
            try {
                // Fetch the Coin Price data using CryptoCompare's priceFull()
                let priceData = await cc.priceFull(this.state.favourites[i], 'USD') //arg1 :> Coin Symbols || arg2 :> Currency 
                coinPriceData.push(priceData); //Push the coin price data into the array, after the promise has been resolved
            } catch (e) {
                console.warn('Error in fetching the prices');
            }
        }
        return coinPriceData;
    }

    historicalCoinData = () => {
        let promises = [];
        for (let units = TIME_UNITS; units > 0; units--) {
            promises.push( //Push a call to priceHistorical()
                // priceHistorical() will take in the query, that's in the cryptoCompareAPI
                cc.priceHistorical( //Pushing the fetched historical data into the promise array
                    this.state.currentFavourite,
                    ['USD'],
                    moment()
                        .subtract({ [this.state.timeInterval]: units }) //subtract 10 months
                        .toDate()// Putting it in a JavaScript Date
                )
            )
        }
        return Promise.all(promises);// Returns only when all the promises are resolved
        //This historical fetch would be completed, when all the fetch have been resolved
    }

    addCoin = key => {
        let favourites = [...this.state.favourites];
        if (favourites.length < MAX_FAVOURITES) {
            favourites.push(key);
            this.setState({ favourites });
        }
    }

    removeCoin = key => {
        let favourites = [...this.state.favourites];
        this.setState({ favourites: _.pull(favourites, key) });
        // _.pull() pull the from the array and return the new array

    }

    isInFavourites = key => _.includes(this.state.favourites, key) // _.includes() checks if the give key is in that array

    confirmFavourites = () => {
        let currentFavourite = this.state.favourites[0];
        this.setState({
            firstVisit: false,
            page: 'dashboard',
            currentFavourite,
            historicalData: null
        }, () => { //Fetch prices callback to fetch the prices of the favourite coins, to display it on the Dashboard
            this.fetchPrices();
            this.fetchHistorical(); // Fetch the historical data, after confirming the favourites and setting the state
        });
        // Storing the favourite coins in the local storage to pull in these values during initial page load
        localStorage.setItem('cryptoDash', JSON.stringify({
            favourites: this.state.favourites,
            currentFavourite
        }));
    }

    setCurrentFavourite = (sym) => {
        this.setState({ //Setting the state locally to the app, on the currentFavourite
            currentFavourite: sym,
            historicalData: null //To clearout the historical data and render the chart for the current spotlight coin, without rendering-
            //- the chart for the historical data for the previous choice.
        }, this.fetchHistorical); //This callback fn() will fetch the historical data for the new favourite coin
        //Setting the local storage to the stringified version of thay object 
        localStorage.setItem('cryptoDash', JSON.stringify({
            ...JSON.parse(localStorage.getItem('cryptoDash')),//Parsing the local storage and merge that in with the new currentFavourite
            currentFavourite: sym
        }))
    }

    savedSettings() {
        // getItem() & setItem() from localStorage, allows to get/set items from/to the localStorage
        let cryptoDashData = JSON.parse(localStorage.getItem('cryptoDash')); // parse() to conv the return data, to string
        if (!cryptoDashData) { // cryptoDashData will return undefined when a user visits the page for the 1st time
            return {
                page: 'settings',
                firstVisit: true // This var is not needed to be pulled into the state, this could be set in the state, prior to this-
                //- return, but firstVisit : false/undefined is all the same, 
            }
        }
        // If a returning user visits the page, pull in the favourite coisn from the cryptoDashData and return it
        let { favourites, currentFavourite } = cryptoDashData; // currentFavourite will be 0, if the page is loaded for the 1st time
        return { favourites, currentFavourite }; // This will overwrite the state variable
    }

    setPage = page => this.setState({ page });

    setFilteredCoins = (filteredCoins) => this.setState({ filteredCoins })

    chartSelectionHandler = (value) => {
        console.log(value);
        this.setState({ timeInterval: value, historicalData: null }, this.fetchHistorical);
    }

    render() {
        return (
            <div>
                <AppContext.Provider value={this.state}>
                    {this.props.children}
                </AppContext.Provider>
            </div>
        )
    }
}