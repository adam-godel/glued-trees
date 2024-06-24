import { useState } from 'react'
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import './App.css'
import Logo from './assets/logo.png'
import GluedTrees from '../glued-trees'
import Input from './components/input/input'

function App() {
  let neighbors = {};
  for (let i = 0; i < Object.keys(GluedTrees).length; i++)
    neighbors[Object.keys(GluedTrees)[i]] = Object.values(GluedTrees)[i]
  return (
    <>
      <img className="title" src={Logo} /><br/>
      <Latex>This is a test, $x=5$.</Latex><br/>
      <Input neighbors={neighbors} />
    </>
  )
}

export default App
