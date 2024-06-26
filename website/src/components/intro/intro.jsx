import React from 'react'
import './intro.css'
import Diagram from '../../assets/diagram.png'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

export default function Intro() {
    return (
        <>
            <h1>Describing the Problem</h1>
            <p><Latex>Consider a network of two mirrored binary trees connected to each other, where the outermost nodes of each tree are connected to two random nodes in the other tree. Each node in the structure has a secret key in the form of a random bit string (an assortment of $1$s and $0$s), and you can query a node using its key to get the keys of its neighbors. Your goal is, given the key of the entrance node, to find the key of the exit node as efficiently as possible. The diagram below displays an example of such a structure.</Latex></p>
            <img src={Diagram} style={{margin: "-0.5rem 0"}}/>
            <p>If you try to play this game yourself, or program an algorithm to do so, you'll quickly run into a major problem: since you don't know what specific nodes on the tree the interior keys correspond to, you will get lost within the structure once you reach the area between the two trees. There is no way to guarantee a solution to this problem (using a classical computer) that doesn't require you to check every node in the worst case.</p>
            <h1>Interactive Demo</h1>
            <p>The text field below is an interactive demo of the glued trees problem. In this demo, each node has a five letter key attached to it, and if you enter a node's key, you get the keys of its neighbors. The glued trees structure in the demo has 10 total columns and 62 total nodes. Try to find the exit node in as few queries as possible! The entrance node can be accessed with the key <b>START</b>. The exit key can be easily recognized as the only other key with only two neighbors. Using this setup, you can try to create a classical algorithm to solve the problem, but you'll most likely find that there's no good way to avoid getting lost in the web of connections between the two glued trees.</p>
        </>
    )
}