import React from 'react'
import WelcomeMessage from './WelcomeMessage.js'
import ConfirmButton from './ConfirmButton'
import Page from '../Shared/Page'
import CoinGrid from './CoinGrid'
import Search from './Search'

export default function index() {
    return (
        <Page name="settings">
            <WelcomeMessage />
            <CoinGrid favouriteSection />
            <ConfirmButton />
            <Search />
            <CoinGrid />
        </Page>
    )
}