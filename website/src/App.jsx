import { useState } from 'react'
import './App.css'
import GluedTrees from '../glued-trees'
import Input from './components/input/input'

function App() {
  let neighbors = {};
  for (let i = 0; i < Object.keys(GluedTrees).length; i++)
    neighbors[Object.keys(GluedTrees)[i]] = Object.values(GluedTrees)[i]
  return (
    <>
      <Input neighbors={neighbors} />
    </>
  )
}

export default App
