import React from 'react'
import { Component, Render } from 'react-redux-utilities'
import players from './reducers/players'
import squares from './reducers/squares'
import Board from './components/board'

const App = Component({
    render() {
        const {currentPlayer} = this.props
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>{`${currentPlayer.name} (${currentPlayer.color})`}</h1>
                <h2>Your Move</h2>
                <Board />
            </div>
        )
    }
}, state => ({currentPlayer: state.players.filter(player => player.active === true)[0]}))

Render({squares, players}, <App />)