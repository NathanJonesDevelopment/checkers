import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react-redux-utilities'
import styled, { keyframes } from 'styled-components'
import Square from './square'

export default Component({
	getInitialState() {
		return {width: '70vw', height: '70vw'}
	},
	componentDidMount() {
		window.addEventListener('resize', this.handleResize)
		this.handleResize()
	},
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize)
	},
	handleResize() {
		const {height, width} = document.body.getBoundingClientRect()
		const size = height < width ? {height: '65vh', width: '65vh'} : {height: '70vw', width: '70vw'}
		this.setState(size)
	},
	render() {
		const {currentPlayer, squares} = this.props
		const selectedSquare = squares.filter(square => square.selected)[0]
		const availableMoves = selectedSquare && getAvailableMoves(selectedSquare, squares, this.props.currentPlayer)
		const style = {
			width: this.state.width,
			height: this.state.height,
			borderStyle: 'inset inset outset outset',
			borderWidth: '15px',
			borderColor: '#EDA070',
			transition: 'transform 2s ease-in-out',
			transform: currentPlayer.color === 'black' ? 'rotateZ(-180deg)' : 'none',
			margin: '5vh auto',
			fontSize: '100%'
		}
		return (
			<div>
				<h1 style={{textAlign: 'center'}}>{`${currentPlayer.name} (${currentPlayer.color})`}</h1>
				<h2>Your Move</h2>
				<div style={style}>
					{squares.map(square => {
						const move = availableMoves && availableMoves.filter(m => m.id === square.id)[0]
						const canMoveHere = move != null
						const {id, row, piece, color, selected} = square
						return <Square key={id} id={id} row={row} piece={piece} color={color} 
							selected={selected} selectedSquare={selectedSquare}
							currentPlayer={currentPlayer} canMoveHere={canMoveHere} />
					})}
				</div>
			</div>
		);
	}
}, state => ({
	squares: state.squares, 
	currentPlayer: state.players.filter(player => player.active === true)[0]
}));

function getAvailableMoves({row, column}, squares, player) {

	// get all squares where they are diagonaly positioned, and are within 1 or 2 places of each other
	const possibleMoves = squares.filter(sq => {
		return [1,2].map(distance => {
			return (sq.row === row + distance && sq.column === column + distance)
					|| (sq.row === row + distance && sq.column === column - distance)
					|| (sq.row === row - distance && sq.column === column + distance)
					|| (sq.row === row - distance && sq.column === column - distance)
		}).reduce((a, b) => a || b)
	})

	// separate possible moves into adjacent moves and jump moves
	const adjacentMoves = possibleMoves.filter(move => Math.abs(move.row - row) === 1)
	const jumpMoves = possibleMoves.filter(move => Math.abs(move.row - row) === 2)

	// find all available adjacent and jump moves
	const availableAdjacentMoves = adjacentMoves.filter(move => !move.piece)
	const availableJumpMoves = jumpMoves.filter(jump => {
		// get the square being jumped
		const squareToJump = adjacentMoves.filter(adjacent => {
			return (jump.row - row > 0) === (adjacent.row - row > 0)
			&& (jump.column - column > 0) === (adjacent.column - column > 0)
		})[0]
		// return the jump move only if it has no piece, 
		// and the square bieng jumped has a piece not belonging to the current player 
		return !jump.piece && squareToJump.piece && squareToJump.piece.color !== player.color
	})

	// return the combined list of available adjacent and jump moves
	return availableAdjacentMoves.concat(availableJumpMoves)
}