import { Reducer } from 'react-redux-utilities'

const initialSquares = []
for (let row = 8; row >= 1; row--) {
	for (let column = 1; column <= 8; column++) {
		const color = (row + column) % 2 === 0 ? '#5d3000' : '#EED'
		let piece = null
		if (color === '#5d3000') {
			if (row === 1 || row === 2) piece = {color: 'red', king: false}
			if (row === 7 || row === 8) piece = {color: 'black', king: false}
		}
		initialSquares.push({row, column, piece, color, id: row+''+column, selected: false})
	}
}

export default Reducer(initialSquares, {
	movePiece: (state, moveData) => {
		return state.map(square => {
			if (square.id === moveData.startPos || square.id === moveData.jumpPos) return {...square, piece: null}
			else if (square.id === moveData.endPos) return {...square, piece: moveData.piece}
			else return square
		})
	},
	setSelected: (state, squareToToggle) => {
		return state.map(square => ({...square, 
			selected: square.id === squareToToggle ? !square.selected : false
		}))
	},
	removePiece: (state, id) => {
		return state.map(square => square.id === id ? {...square, piece: null} : square)
	}
})