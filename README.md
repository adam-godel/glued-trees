# Glued Trees
This repository contains the code for the latest version of a quantum circuit implementation for the glued trees algorithm. You can view the current iteration of the algorithm in the Jupyter notebook attached. **The code is currently in an unfinished state and has not yet been thoroughly tested.** I plan to perform significant data analysis over the coming weeks on both a simulator and quantum hardware.

I began working on this project as part of [QRISE 2024](https://github.com/adam-godel/qrise2024-classiq-challenge) for [Classiq](https://github.com/Classiq). I was selected as a winner of QRISE and the research exchange has since ended, but I am still working with Classiq to greatly improve the algorithm with the goal of running as large of an implementation as possible on real quantum hardware. If you would like to learn more about me, feel free to access my website at [adamgodel.me](https://adamgodel.me/). You can also send me an email at agodel@bu.edu.

This README file describes the glued trees problem and my approach in detail with a to-do list at the end describing my near-term goals for the project as they currently stand.

## Describing the Problem
Consider a network of two mirrored binary trees connected to each other, where the outermost nodes of each tree are connected to two random nodes in the other tree. This structure will have $2n$ columns and $2^{n+1}-2$ nodes in total, as shown in the diagram below. Each node in the structure has a secret key in the form of a random bit string of size $2n$, and you can query a node using its key to get the keys of its neighbors. Your goal is, given the key of the entrance node, to find the key of the exit node as efficiently as possible.

<p align="center">
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjoHV_EgsCy3f3fid2P29Lyq00CQtPBiV9cc2A2oL6RoX0W3oawha617NRm7a6J9fdUPG7z55MuHKnko5eDCRZ4tb6mVvFQ-twhlL3EjLKDHKHDw0-69-0ESWovOsDTbkAfDBUwRiYa0U8rfHeGOB_JwfcWIXQyJYnfmRjI5E7ygfZz-l5w1N4Kisle8WeV/s16000/image2.png" height="400">
</p>

If you try to play this game yourself, or program an algorithm to do so, you'll quickly run into a major problem: since you don't know what specific nodes on the tree the interior keys correspond to, you will get lost within the structure once you reach the area between the two trees. There is no way to guarantee a solution to this problem—using a classical computer—that doesn't require you to check every node in the worst case.

## A Quantum Approach
There is a way to solve this problem efficiently however, on the order of the total number of *columns* of the structure instead of the nodes. You just need to use a quantum computer! This [paper](https://journals.aps.org/prx/pdf/10.1103/PhysRevX.13.041041) published in December 2023 describes a quantum approach to solving this algorithm by considering the columns of the structure as a system of coupled harmonic oscillators attached by springs. A quantum computer can use Hamiltonian simulation to simulate this classical system efficiently. If you apply a push to the oscillator representing the entrance node, and treat the interactions between nodes as queries, you can "reach" the exit node (trigger a spike in its oscillatory movement) in time $2n$, offering linear efficiency as opposed to exponential efficiency!

I will now describe the technical aspects of this approach in further detail. To model the columns of the glued trees structure as a system of coupled harmonic oscillators, we consider a weighted adjacency matrix $\mathbf{A}$ of size $2n \times 2n$ corresponding to the columns of the glued trees structure. As described in more detail in the paper linked above, this matrix is defined as the following: 
```math
\mathbf{A} = \begin{bmatrix}
3 & -\sqrt{2} & 0 & 0 & 0 & 0 & \cdots & 0 \\
-\sqrt{2} & 3 & -\sqrt{2} & 0 & 0 & 0 & \cdots & \vdots\\
\vdots & \ddots & \ddots & \ddots & 0 & 0 & \cdots & \vdots \\
0 & \cdots & -\sqrt{2} & 3 & -2 & \cdots & 0 & 0 \\
0 & 0 & \cdots & -2 & 3 & -\sqrt{2} & \cdots & 0 \\
\vdots & \cdots & 0 & 0 & \ddots & \ddots & \ddots & \vdots \\
\vdots & \cdots & 0 & 0 & 0 & -\sqrt{2} & 3 & -\sqrt{2} \\
0 & \cdots & 0 & 0 & 0 & 0 & -\sqrt{2} & 3
\end{bmatrix}
```
We can then observe that the following relation is formed:
```math
\begin{aligned}
\ddot{\vec{z}}(t) &= -\mathbf{A}\vec{z}(t) \\
\ddot{\vec{z}}(t) + i\sqrt{\mathbf{A}}\dot{\vec{z}}(t) &= i\sqrt{\mathbf{A}}\big(\dot{\vec{z}}(t)+i\sqrt{\mathbf{A}}\vec{z}(t)\big)
\end{aligned}
```
where $\vec{z}(t)$ represents the vector of size $2n$ of position states for each oscillator. This is equivalent to Schrödinger's equation induced by the Hamiltonian $-\sqrt{\mathbf{A}}$. Therefore, this system of oscillators can be modeled by the exponentiation $\exp(-iHt)$ where $H=-\sqrt{\mathbf{A}}$. The challenge then becomes simulating this exponentiation efficiently on a quantum computer for large versions of the matrix $\mathbf{A}$.

## Creating a Quantum Circuit
I am working with [Classiq](https://github.com/Classiq) to create a quantum circuit implementation of the glued trees problem using their Python software development kit. One of the biggest advantages of using Classiq for this task is that their functions can be applied to an arbitrary number of qubits—in other words, you can create a Python function that takes in the size of the glued trees system as a parameter without needing to fundamentally change the code to model systems of different sizes. 

To achieve this task, I am simply using the [`exponentiation_with_depth_constraint`](https://docs.classiq.io/latest/explore/functions/qmod_library_reference/qmod_core_library/hamiltonian_evolution/exponentiation/exponentiation/) function in Classiq, which takes in the matrix $-\sqrt{\mathbf{A}}$ in the form of a Pauli list, a linear combination of tensor products of Pauli operators $X$, $Y$, $Z$, and $I$. This setup causes the $2n \times 2n$ matrix $\mathbf{A}$ to be of size $2^q \times 2^q$, so the relationship $n=2^{q-1}$ is formed. 

The major challenge of this approach is efficiently creating and compressing the Pauli list into a state where it both accurately represents the original Hamiltonian and can be converted into a circuit with a reasonable circuit depth given the limits of today's quantum hardware (currently in the low thousands) for large qubit values.

## Future Goals
This project is currently under active development. I will be consistently working on this project over the coming months to optimize the algorithm with the hope of ultimately running it on state of the art quantum hardware for circuits too high to run on a simulator, comprised of at least 30 qubits. You can view the current to-do list regarding the project below.
### To-Do
- [X] Create an initial working version of the algorithm
- [X] Write the repository description in detail
- [X] Rewrite Pauli decomposition function to be more efficient
- [X] Write large cropped Pauli lists to a file to be used as a dictionary for memoization
- [ ] Write script to approximate larger cropped Pauli lists from smaller Pauli lists
- [ ] Run and graph results for the higher range of simulatable circuits (greater than 10 qubits)
- [ ] Run and compare quantum hardware results with simulatable results at this range
- [ ] Run the algorithm on quantum hardware at qubit sizes too large to simulate
