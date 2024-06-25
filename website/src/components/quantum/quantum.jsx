import React from 'react'
import './quantum.css'
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function Quantum() {
    return (
        <>
            <h1 style={{marginTop: '1rem'}}>A Quantum Approach</h1>
            <p>There is a way to solve this problem efficiently however, on the order of the total number of columns of the structure instead of the nodes. You just need to use a quantum computer! This <a href="https://journals.aps.org/prx/pdf/10.1103/PhysRevX.13.041041">paper</a> published in December 2023 describes a quantum approach to solving this algorithm by considering the columns of the structure as a system of coupled harmonic oscillators attached by springs. A quantum computer can use Hamiltonian simulation to simulate this classical system efficiently. If you apply a push to the oscillator representing the entrance node, and treat the interactions between nodes as queries, you can "reach" the exit node (trigger a spike in its oscillatory movement) in time <Latex>$2n$</Latex>, offering linear efficiency as opposed to exponential efficiency!</p>
            <p>But wait, what is Hamiltonian simulation and how can it make a quantum computer solve the glued trees problem more efficiently?</p>
        </>
    )
}