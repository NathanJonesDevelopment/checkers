import { Reducer } from 'react-redux-utilities'

export default {
    myTurn: Reducer(true, {toggleMyTurn: (state, action) => !state}),
    playersReady: Reducer(false, {playersReady: () => true}),
    playerColor: Reducer('red', {setPlayerColor: (state, color) => color})
}