import React from 'react'
import { Render } from 'react-redux-utilities'
import players from './reducers/players'
import squares from './reducers/squares'
import Board from './components/board'

Render({squares, players}, <Board />)