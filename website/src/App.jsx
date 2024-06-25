import './App.css'
import Logo from './assets/logo.svg'
import GluedTrees from '../glued-trees'
import Intro from './components/intro/intro'
import Input from './components/input/input'
import Quantum from './components/quantum/quantum'

function App() {
  let neighbors = {};
  for (let i = 0; i < Object.keys(GluedTrees).length; i++)
    neighbors[Object.keys(GluedTrees)[i]] = Object.values(GluedTrees)[i]
  return (
    <>
      <img className="title" src={Logo} />
      <p>Welcome to the Glued Trees website! This site serves as the home for all information relating to the glued trees problem and its respective quantum algorithm, which offers an exponential advantage when compared to the best known classical algorithm. This page is meant to introduce the problem to people of any experience level with quantum computing. If you have experience and would like to skip the fundamentals, you can view my implementation in the <a href="https://github.com/adam-godel/glued-trees">Glued Trees repository</a>.</p>
      <p>I began working on this project as part of <a href="https://www.quantumcoalition.io">QRISE 2024</a> for <a href="https://www.classiq.io/">Classiq</a>. I was selected as a winner of QRISE and the research exchange has since ended, but I continued to work on the algorithm and my implementation has become a part of the <a href="https://github.com/Classiq/classiq-library/tree/main/algorithms/glued_trees">Classiq library</a>. If you would like to learn more about me, feel free to access my website at <a href="https://adamgodel.me">adamgodel.me</a>. You can also send me an email at <a href="mailto:agodel@bu.edu">agodel@bu.edu</a>.</p>
      <Intro />
      <Input neighbors={neighbors} />
      <Quantum />
    </>
  )
}

export default App
