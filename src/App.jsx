import React from 'react'
import { Routes,Route } from "react-router"
import Room from './tic-tac/Room'
import Game from './tic-tac/Game'
import FlappyBird from './flappy-bird/FlappyBird'
function App() {
  return (
    <Routes>
      <Route path='/' Component={Room}/>
        <Route path='/tic-tac' Component={Game}/>
        <Route path='/flappy-bird' Component={FlappyBird}/>
        <Route path='/unknown' Component={FlappyBird}/>
    </Routes>
  )
}

export default App