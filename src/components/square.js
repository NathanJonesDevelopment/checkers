import React, { Component } from 'react'
import { Actions } from 'react-redux-utilities'
import styled from 'styled-components'

export default function Square(props) {
	const {id, row, piece, color, selected, selectedSquare, currentPlayer, canMoveHere} = props
	const handleClick = () => {
		if (piece && piece.color === currentPlayer.color) Actions.setSelected(id)
		else if (canMoveHere) {
			Actions.setSelected(selectedSquare.id)
			Actions.movePiece({
				startPos: selectedSquare.id,
				endPos: id,
				piece: selectedSquare.piece
			})
			if (Math.abs(row - selectedSquare.row) === 1) Actions.switchPlayer()
			else Actions.setSelected(id)
		}
	}
	const style = {
		square: {
			//position: 'relative',
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
			transform: 'translate(-50%, -50%)' + (currentPlayer.color === 'black' ? ' rotateZ(-180deg)' : '')
		}
	}
	return (
		<div onClick={handleClick} style={style.square}>
			{piece && <img src={`images/${piece.color}${piece.king ? 'King' : 'Piece'}.png`} style={style.piece} />}
		</div>
	)
}