import { Reducer } from 'react-redux-utilities'

export default Reducer(true, {toggleMyTurn: (state, action) => !state})