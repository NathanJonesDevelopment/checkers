import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react-redux-utilities'
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
		const size = height < width ? {height: '60vh', width: '60vh'} : {height: '70vw', width: '70vw'}
		this.setState(size)
	},
	fetchData() {
		
	},
	render() {
		const {currentPlayer, squares, myTurn} = this.props
		const selectedSquare = squares.filter(square => square.selected)[0]
		const moves = selectedSquare && getAvailableMoves(selectedSquare, squares, currentPlayer)
		const availableMoves = moves && moves.availableMoves
		const jumps = moves && (moves.jumps || null)
		const style = {
			width: this.state.width,
			height: this.state.height,
			borderStyle: 'inset inset outset outset',
			borderWidth: '15px',
			borderColor: '#EDA070',
			transition: !window.socket ? 'transform 2s ease-in-out' : 'none',
			transform: currentPlayer.color === 'black' ? 'rotateZ(-180deg)' : 'none',
			margin: '3vh auto 0px auto',
			fontSize: '100%'
		}
		return (
			<div style={style} onClick={this.fetchData}>
				{squares.map(square => {
					const jump = jumps && jumps.filter(j => {
						return j.pos.row - selectedSquare.row > 0 === square.row - selectedSquare.row > 0
							&& j.pos.column - selectedSquare.column > 0 === square.column - selectedSquare.column > 0
					})[0]
					const canMoveHere = availableMoves && availableMoves.filter(m => m.pos.id === square.id)[0] != null
					return <Square key={square.id} {...square} selectedSquare={selectedSquare} myTurn={myTurn}
						jump={jump && jump.pos.id} currentPlayer={currentPlayer} canMoveHere={canMoveHere} />
				})}
			</div>
		);
	}
}, state => ({
	squares: state.squares,
	myTurn: state.myTurn,
	currentPlayer: state.players.filter(player => player.active === true)[0]
}));

function getAvailableMoves({row, column, piece}, squares, player) {

	// get the position and direction of all squares where they are diagonaly positioned, 
	// and are within 1 or 2 places of each other
	let possibleMoves = squares.filter(sq => {
		return [1,2].map(distance => {
			return (sq.row === row + distance && sq.column === column + distance)
				|| (sq.row === row + distance && sq.column === column - distance)
				|| (sq.row === row - distance && sq.column === column + distance)
				|| (sq.row === row - distance && sq.column === column - distance)
		}).reduce((a, b) => a || b)
	}).map(sq => ({pos: sq, direction: {
		row: sq.row - row > 0, 
		column: sq.column - column > 0
	}}))

	//remove backwards moves if the piece is not kinged
	if (!piece.king) {
		possibleMoves = possibleMoves.filter(sq => {
			return (player.color === 'red' && sq.pos.row > row)
				|| (player.color === 'black' && sq.pos.row < row)
		})
	}

	// separate possible moves into adjacent moves and jump moves
	const adjacentMoves = possibleMoves.filter(move => Math.abs(move.pos.row - row) === 1)
	const jumpMoves = possibleMoves.filter(move => Math.abs(move.pos.row - row) === 2)

	// find all available adjacent and jump moves
	const availableAdjacentMoves = adjacentMoves.filter(move => {
		return !move.pos.piece 
	})
	let jumpableSquares = [];
	const availableJumpMoves = jumpMoves.filter(jump => {
		// get the square being jumped
		const squareToJump = adjacentMoves.filter(adjacent => {
			return jump.direction.row  === adjacent.direction.row
				&& jump.direction.column === adjacent.direction.column
		})[0]
		console.log(squareToJump.pos.id + ": " + squareToJump.pos.piece)

		// add it to jumpableSquares, so we can removed it if it gets jumped
		squareToJump && squareToJump.pos.piece && jumpableSquares.push(squareToJump)

		// return the jump move only if it has no piece, 
		// and the square bieng jumped has a piece not belonging to the current player 
		return !jump.pos.piece && squareToJump.pos.piece && squareToJump.pos.piece.color !== player.color
	})

	const res = {availableMoves: availableAdjacentMoves.concat(availableJumpMoves), jumps: jumpableSquares}
	console.log(res)

	// return the combined list of available adjacent and jump moves, and the jumpable squares
	return res
}