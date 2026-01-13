import React from 'react'
import Game from './Game'
import { Routes,Route } from "react-router"
function App() {
  return (
    <Routes>
      <Route path='/' Component={Game}/>
    </Routes>
  )
}

export default App