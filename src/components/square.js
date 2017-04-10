import React, { Component } from 'react'
import { Actions } from 'react-redux-utilities'

export default function Square(props) {
	const {id, row, column, piece, color, selected, selectedSquare, jump, currentPlayer, canMoveHere, myTurn} = props
	const handleClick = () => {
		if ((window.socket && myTurn) || !window.socket) {
			if (piece && piece.color === currentPlayer.color) Actions.setSelected(id)
			else if (canMoveHere) {
				Actions.setSelected(selectedSquare.id)
				Actions.movePiece({
					startPos: selectedSquare.id,
					endPos: id,
					piece: selectedSquare.piece
				})
				jump && Actions.removePiece(jump)

				if (currentPlayer.color === 'red' && row === 8
				|| currentPlayer.color === 'black' && row === 1) {
					Actions.makeKing(id)
				}

				if (window.socket) {
					window.socket.emit('sendMove', window.gameID, {
						jump,
						startPos: selectedSquare.id,
						endPos: id,
						piece: selectedSquare.piece,
						makeKing: (currentPlayer.color === 'red' && row === 8) || (currentPlayer.color === 'black' && row === 1)
					})
					if (Math.abs(row - selectedSquare.row) === 1) {
						Actions.toggleMyTurn()
						window.socket.emit('switchPlayer', window.gameID)
					}
					else Actions.setSelected(id)
				}
				else {
					if (Math.abs(row - selectedSquare.row) === 1) Actions.switchPlayer()
					else Actions.setSelected(id)
				}
			}
		}
	}
	const style = {
		square: {
			height: '12.5%',
			width: '12.5%',
			float: 'left',
			position: 'relative',
			backgroundColor: selected ? '#39D' : canMoveHere ? '#3D7' : color
		},
		piece: {
			textAlign: 'center',
			height: '80%',
			width: '80%',
			display: 'block',
			position: 'absolute',
			top: '50%',
			left: '50%',
			transition: 'all 2s ease-in-out',
			transform: 'translate(-50%, -50%)' + (currentPlayer.color === 'black' ? ' rotate(-180deg)' : '')
		}
	}
	return (
		<div onClick={handleClick} style={style.square}>
			{piece && <img src={`images/${piece.color}${piece.king ? 'King' : 'Piece'}.png`} style={style.piece} />}
		</div>
	)
}