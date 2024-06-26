import './App.css'
import GluedTrees from '../glued-trees'
import Title from './components/title/title'
import Intro from './components/intro/intro'
import Input from './components/input/input'
import Quantum from './components/quantum/quantum'
import Outro from './components/outro/outro'

function App() {
  let neighbors = {};
  for (let i = 0; i < Object.keys(GluedTrees).length; i++)
    neighbors[Object.keys(GluedTrees)[i]] = Object.values(GluedTrees)[i]
  return (
    <>
      <Title />
      <p>Welcome to the Glued Trees website! This site serves as the home for all information relating to the glued trees problem and its respective quantum algorithm, which offers an exponential advantage when compared to the best known classical algorithm. This page is meant to introduce the problem to people of any experience level with quantum computing. If you have experience and would like to read a more formal definition of the problem and my algorithm, you can view my implementation in the <a href="https://github.com/adam-godel/glued-trees">Glued Trees repository</a>.</p>
      <p>I began working on this project as part of <a href="https://www.quantumcoalition.io">QRISE 2024</a> for <a href="https://www.classiq.io/">Classiq</a>. I was selected as a winner of QRISE and the research exchange has since ended, but I continued to work on the algorithm and my implementation has become a part of the <a href="https://github.com/Classiq/classiq-library/tree/main/algorithms/glued_trees">Classiq library</a>. If you would like to learn more about me, feel free to access my website at <a href="https://adamgodel.me">adamgodel.me</a>. You can also send me an email at <a href="mailto:agodel@bu.edu">agodel@bu.edu</a>.</p>
      <Intro />
      <Input neighbors={neighbors} />
      <Quantum />
      <Outro />
    </>
  )
}

export default App
