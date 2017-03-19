import { Reducer } from 'react-redux-utilities'

const defaultPlayers = [
	{name: 'Player 1', color: 'red', active: true}, 
	{name: 'Player 2', color: 'black', active: false}
]

export default Reducer(defaultPlayers, {
	switchPlayer: (state, action) => {
		return state.map(player => ({...player, active: !player.active}))
	}
})