import React from 'react'
import { Reducer, Component, Actions, Render } from 'react-redux-utilities'
import Bootstrap from 'bootstrap/dist/css/bootstrap.css'
import { Grid, Row, Col } from 'react-bootstrap'
import 'whatwg-fetch'
import css from './style.scss'
import players from './reducers/players'
import squares from './reducers/squares'
import multiplayerReducers from './reducers/multiplayerReducers'
import Board from './components/board'

if (window.socket) {
	let playersReady = false
	let playerColor = 'red'
	window.socket.on('opponentMoved', (moveData, jump) => {
		Actions.movePiece(moveData)
		moveData.jump && Actions.removePiece(moveData.jump)
		moveData.makeKing && Actions.makeKing(moveData.endPos)
	})
	window.socket.on('assignPlayerColor', color => {
		if (color === 'black') {
			Actions.switchPlayer()
			Actions.toggleMyTurn()
		}
	})
	window.socket.on('switchPlayer', () => Actions.toggleMyTurn())
	window.socket.on('playersReady', () => Actions.playersReady())
}

const App = Component({
	render() {
		const {playersReady, currentPlayer, myTurn} = this.props
		if (!playersReady && window.socket) return (
			<div>
				<a href="http://playcheckerswithme.herokuapp.com" className='newGameBtn'>New Game</a>
				<h1>Waiting for Opponent...</h1>
				<h2>
					Send this link to a friend to start a game: 
				</h2>
				<input type='text' onClick={e => e.target.select()} value={`http://playcheckerswithme.herokuapp.com/game/${window.gameID}`} />
			</div>
		)
		else return (
			<div style={{overflow: 'hidden'}}>
				<a href="http://playcheckerswithme.herokuapp.com" className='newGameBtn'>New Game</a>
				<div className="currentPlayer">
					<h1>{window.socket && !myTurn ? 'Opponents Turn...' : `${currentPlayer.name} (${currentPlayer.color})`}</h1>
					<h2>{window.socket && !myTurn ? '' : 'Your Move'}</h2>
				</div>
				<Board />
			</div>
		)
	}
}, state => ({
	currentPlayer: state.players.filter(player => player.active === true)[0],
	playersReady: state.playersReady,
	myTurn: state.myTurn
}))

Render({squares, players, ...multiplayerReducers}, <App />)