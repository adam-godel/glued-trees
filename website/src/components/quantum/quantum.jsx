import React from 'react'
import './quantum.css'
import TenQubits from '../../../../figures/10_qubits.png'
import TwentyQubits from '../../../../figures/20_qubits.png'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

export default function Quantum() {
    return (
        <>
            <h1 style={{marginTop: '1rem'}}>A Quantum Approach</h1>
            <p>There is a way to solve this problem efficiently however, on the order of the total number of columns of the structure instead of the nodes. You just need to use a quantum computer! This <a href="https://journals.aps.org/prx/pdf/10.1103/PhysRevX.13.041041">paper</a> published in December 2023 describes a quantum approach to solving this algorithm by considering the columns of the structure as a system of coupled harmonic oscillators attached by springs. A quantum computer can use Hamiltonian simulation to simulate this classical system efficiently. If you apply a push to the oscillator representing the entrance node, and treat the interactions between nodes as queries, you can "reach" the exit node (trigger a spike in its oscillatory movement) in time <Latex>$2n$</Latex>, offering linear efficiency as opposed to exponential efficiency!</p>
            <p>But wait, what is Hamiltonian simulation and how can it make a quantum computer solve the glued trees problem more efficiently? In short, Hamiltonian simulation refers to the simulation of a quantum system on a quantum computer, where such a simulation is more natural. So if we could convert the glued trees structure into a quantum system that could be simulated, we could possibly create a more efficient implementation of the algorithm!</p>
            <p><Latex>A Hamiltonian is a matrix of size $2^q \times 2^q$ which can be modeled in $q$ qubits. So to convert our glued trees structure into a Hamiltonian, we must represent it somehow as a square matrix with a size corresponding to a power of two. The clear choice is to create an adjacency matrix for the structure. An adjacency matrix is a square matrix where each row and column of a graph represent a node. Some entry at row $i$, column $j$ of an adjacency matrix is $1$ if nodes $i$ and $j$ are neighbors and $0$ otherwise. By this definition, the entry at row $i$, column $j$ will be identical to the entry at row $j$, column $i$, so adjacency matrices will always be symmetrical.</Latex></p>
            <p><Latex>The ordering of the nodes of our glued trees graph will change how its adjacency matrix looks, but any ordering is equally valid in terms of accurately modeling the glued trees structure. In the context of the problem, the ordering of the nodes is unknown—the ordering of the exit node relative to the other nodes {`<i>is</i>`} its key! However, for the sake of demonstration, we will be using a simple linear ordering of the nodes such that the entrance node is first and the exit node is last. The advantage of this is that we know where the exit node should be, so we can observe the behavior of its corresponding quantum state (bitstrings of size $q$ with different probabilities from $0$ to $1$) when Hamiltonian simulation is performed.</Latex></p>
            <p><Latex>One final quirk we need to consider is that the matrix we base our Hamiltonian off of is actually a slightly adjusted adjacency matrix. We will call this matrix {`$\\mathbf{A}$`} and define it as {`$\\mathbf{A} := 3(\\mathbf{1}_N)-A$`}, where $A$ is the adjacency matrix of the graph. All this does is make the entries on the diagonal of the matrix be $3$ instead of $0$ and make the entries that would normally be $1$ be $-1$. This is due to the specific setup present in the 2023 paper. Based on this setup and our use of a linear ordering for the nodes of the glued trees structure, our matrix will be defined as the following:</Latex></p>
            <Latex>
                {`$$
                \\mathbf{A} = \\begin{pmatrix}
                3 & -1 & -1 & 0 & \\cdots & \\cdots & \\cdots & \\cdots & 0 \\\\
                -1 & 3 & 0 & -1 & \\cdots & \\cdots & \\cdots & \\cdots & 0 \\\\
                -1 & 0 & 3 & 0 & \\cdots & \\cdots & \\cdots & \\cdots & 0 \\\\
                0 & -1 & 0 & 3 & \\cdots & \\cdots & \\cdots & \\cdots & 0 \\\\
                \\vdots & \\vdots & \\vdots & \\vdots & \\ddots & \\vdots & \\vdots & \\vdots & \\vdots \\\\
                \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & 3 & 0 & -1 & 0 \\\\
                \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & 0 & 3 & 0 & -1 \\\\
                \\vdots & \\vdots & \\vdots & \\vdots & \\vdots & -1 & 0 & 3 & -1 \\\\
                0 & 0 & 0 & 0 & \\cdots & 0 & -1 & -1 & 3
                \\end{pmatrix}
                $$`}
            </Latex>
            <p><Latex>Now this is something we can work with! But this matrix presents two problems we must solve before we can use it as our Hamiltonian. Before we address those, let's formally define a few variables. We will call the total number of nodes in our glued trees graph $N$, and the number of columns of one tree $n$ (so the structure as a whole has $2n$ columns). Since a binary tree has $2^n-1$ nodes, the glued trees structure will have double that, so {`$N=2(2^n-1)=2^{n+1}-2$`}.</Latex></p>
            <p><Latex>The first problem lies in the fact that due to how Hamiltonian simulation is set up, the Hamiltonian we want to simulate is actually {`$-\\sqrt{\\mathbf{A}}$`}, not {`$\\mathbf{A}$`} itself. {`$\\sqrt{\\mathbf{A}}$`} is just a $N \times N$ matrix such that {`$\\sqrt{\\mathbf{A}}\\sqrt{\\mathbf{A}}=\\mathbf{A}$`}. The second problem lies in the fact that both the matrices {`$\\mathbf{A}$`} and {`$-\\sqrt{\\mathbf{A}}$`} are of size $N \times N$, which is {`<i>not</i>`} a power of two. We need to create a Hamiltonian with a size corresponding to a power of two that imbues the same information as {`$-\\sqrt{\\mathbf{A}}$`}.</Latex></p>
            <p><Latex>While there are several ways to do this, the 2023 paper highlights a particularly efficient one which uses a new $N \times M$ matrix {`$\\mathbf{B}$`} such that {`$\\mathbf{B}\\mathbf{B}^†=\\mathbf{A}$`}, where {`$\\mathbf{B}^†$`} refers to the {`<a href="https://en.wikipedia.org/wiki/Conjugate_transpose">conjugate transpose</a>`} of {`$\\mathbf{B}$`}. We can then define our usable Hamiltonian {`$\\mathbf{H}$`} to be as follows:</Latex></p>
            <Latex>
                {`$$
                \\mathbf{H} := -\\begin{pmatrix}
                \\mathbf{0} & \\mathbf{B} \\\\
                \\mathbf{B}^† & \\mathbf{0}
                \\end{pmatrix}
                $$`}
            </Latex>
            <p><Latex>This type of matrix is known as a block Hamiltonian and is defined in terms of other matrices, known as blocks, that are placed in a grid. Its dimension is apparent from the grid structure: we know that {`$\\mathbf{B}$`} is of size $N \times M$ and {`$\\mathbf{B}^†$`} is of size $M \times N$, so to keep the matrix square, the top-left {`$\\mathbf{0}$`} (a matrix of all $0$s) must be of size $N \times N$ and the bottom-left {`$\\mathbf{0}$`} must be of size $M \times M$. This means that {`$\\mathbf{H}$`} must be a square matrix with side length $N+M$. To ensure that the side length is a power of two, we can let $M=N+4$, so {`$N+M=2N+4=2(2^{n+1}-2)+4=2^{n+2}$`}.</Latex></p>
            <p><Latex>This solves both of our problems! Since the first block of {`$\\mathbf{H}^2$`} is {`$\\mathbf{A}$`}, it essentially functions similarly to {`$-\\sqrt{\\mathbf{A}}$`}. Additionally, since our Hamiltonian has side length {`$2^{n+2}$`}, it means that it can be simulated with $n+2$ qubits. This is proportional to the number of columns of the glued trees structure—a good sign!</Latex></p>
            <h1>Creating a Quantum Circuit</h1>
            <p><Latex>Now that we have a theoretical foundation for what we're trying to do, let's figure out how to implement it! We will be using the {`<a href="https://docs.classiq.io/">Classiq</a>`} software development kit in Python to create and execute the quantum circuit corresponding to our Hamiltonian simulation. In particular, we will be using the {`<code><a href="https://docs.classiq.io/latest/explore/functions/qmod_library_reference/qmod_core_library/hamiltonian_evolution/exponentiation/exponentiation/">exponentiation_with_depth_constraint</a></code>`} function, which takes in the matrix {`$\\mathbf{H}$`} in the form of a Pauli list, a linear combination of {`<a href="https://en.wikipedia.org/wiki/Kronecker_product">tensor products</a>`} of {`<a href="https://en.wikipedia.org/wiki/Pauli_matrices">Pauli operators</a>`} $I$, $X$, $Y$, and $Z$. The Pauli operators are simple $2 \times 2$ matrices that our Hamiltonian can be decomposed into using an algorithm known as {`<a href="https://en.wikipedia.org/wiki/Cholesky_decomposition">Cholesky decomposition</a>`}. We can generate the adjacency matrix for our glued trees structure using a powerful Python library known as {`<a href="https://networkx.org/">NetworkX</a>`}, and we can generate the Pauli list for our Hamiltonian using {`<a href="https://www.ibm.com/quantum/qiskit">Qiskit</a>`}.</Latex></p>
            <p>We now have everything we need to construct our algorithm! Let's formally outline it here:</p>
            <h2 style={{marginTop: "-0.3rem", marginBottom: "0"}}>Glued Trees Algorithm</h2>
            <ol>
                <li><Latex>Create the glued trees structure for a given number of columns per tree $n$ using NetworkX. Then, convert it into an adjacency matrix using the {`<code><a href="https://networkx.org/documentation/stable/reference/generated/networkx.linalg.graphmatrix.adjacency_matrix.html">adjacency_matrix</a></code>`} function and assemble {`$\\mathbf{A}$`}.</Latex></li>
                <li><Latex>Use NumPy's {`<code><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.cholesky.html">linalg.cholesky</a></code>`} function to perform Cholesky decomposition on {`$\\mathbf{A}$`}.</Latex></li>
                <li><Latex>Since the resulting matrix will be of size $N \times N$, pad it with four columns of $0$s to get {`$\\mathbf{B}$`}, which is of size $N \times (N+4)$. Then, use Numpy to get {`$\\mathbf{B}^†$`}. We can check that {`$\\mathbf{B}\\mathbf{B}^†$`} is indeed {`$\\mathbf{A}$`} as expected.</Latex></li>
                <li><Latex>Use NumPy's {`<code><a href="https://numpy.org/doc/stable/reference/generated/numpy.block.html">block</a></code>`} function to get our block Hamiltonian {`$\\mathbf{H}$`} of size {`$2^{n+2} \\times 2^{n+2}$`}. Then, use Qiskit's {`<code><a href="https://docs.quantum.ibm.com/api/qiskit/qiskit.quantum_info.SparsePauliOp">SparsePauliOp.from_operator</a></code>`} function to get its Pauli list.</Latex></li>
                <li><Latex>Crop the Pauli list (or approximate it if it's too large to generate) and run Classiq's {`<code><a href="https://docs.classiq.io/latest/explore/functions/qmod_library_reference/qmod_core_library/hamiltonian_evolution/exponentiation/exponentiation/">exponentiation_with_depth_constraint</a></code>`} function.</Latex></li>
            </ol>
            <p>Wait, what do we mean by cropping or approximating the Pauli list? This is the final piece of the glued trees algorithm and it involves two functions we have to create ourselves.</p>
            <h1>Compressing Pauli Lists</h1>
            <p><Latex>The final piece of our algorithm involves cropping our resulting Pauli list to minimize the depth of our quantum circuit. In short, the circuit depth is proportional to the number of terms in the Pauli list, and quantum hardware can only handle a circuit depth far lower than the full Pauli lists of larger qubit values while still producing coherent results. After some experimentation, I found that Pauli lists of roughly size 200 result in a circuit depth in the 1200s, around the range of the limit for current state of the art quantum hardware. To compress Pauli lists of any qubit size, I created two algorithms: one to crop full Pauli lists for qubit sizes where the Pauli list can be generated in reasonable time, and one to approximate Pauli lists for larger qubit sizes from cropped Pauli lists of smaller qubit sizes. The Pauli lists for 1-13 qubits are generated with the first algorithm, while higher qubit sizes are generated with the second algorithm. 13 qubits is the highest qubit size with a Pauli list that can be authentically generated in a reasonable time, as Pauli decomposition is an incredibly time expensive operation, {`$\\mathcal{O}(4^q)$`} for $q$ qubits.</Latex></p>
            <p><Latex>The first algorithm is used for cropping naturally generated Pauli lists created using the algorithm defined above. It uses an {`<a href="https://en.wikipedia.org/wiki/Ad_hoc">ad hoc</a>`} approach that tries to represent the Pauli list as a whole as accurately as possible using only the 200 ostensibly most relevant terms to simulating the system. The algorithm first selects 120 terms (60%) by going through each character position from the end to the start and picking the Pauli terms with the largest coefficients that contain each of the four possibilities ($I$, $X$, $Y$, $Z$) at that character position. If all positions are exhausted before reaching 120 terms, the algorithm takes another pass through the character positions until 120 are selected. The other 80 terms (40%) are selected by picking the 80 remaining terms with the largest coefficients. Through my experimentation, I found that this algorithm does a pretty good job of accurately representing the full Pauli list results when comparing them in a simulator. The algorithm balances important high-coefficient terms with diversity in the 200 selected terms.</Latex></p>
            <p>The second algorithm is used for approximating Pauli lists too large to generate. It simply takes the current largest Pauli list generatable in reasonable time and pads it with its second character until the desired qubit size is reached. This approximation method is generally effective since most significant Pauli strings for the matrix contain a long substring of the same character beginning with the second character. Adding that same character and keeping the coefficient generally follows the trend present when comparing generated Pauli strings for different qubit sizes to each other.</p>
            <h1>Results</h1>
            <p><Latex>Now that we have defined our algorithm, assembled our quantum circuit, and cropped or approximated our block Hamiltonian for a given qubit size, we can now execute our quantum circuit! The algorithm works by simulating the glued trees structure as a classical system of {`<a href="https://en.wikipedia.org/wiki/Oscillation#Coupled_oscillations">coupled harmonic oscillators</a>`} using Hamiltonian simulation. Essentially, we are using a quantum computer to simulate a classical system using quantum mechanics, which in this case is exponentially more efficient! Classiq's exponentiation function will approximate {`$e^{-it\\mathbf{H}}$`} for a given time $t$, accurately simulating our Hamiltonian.</Latex></p>
            <p><Latex>The first $N$ terms of the resulting quantum state will correspond to the speed of a system of oscillators, where each node corresponds to an oscillator. Since the quantum state will initially be $|0\rangle$ (with probability $1$), this indicates that the first oscillator will have a starting speed of $1$ while the others start at rest. Since the algorithm works to the order of the number of columns, and there are $2n$ total columns in the glued trees structure, we should expect a spike in the probability of the bitstring corresponding to the speed of the exit node at $t \approx 2n$. Remember, since we used a linear ordering for demonstration, we know that this spike should be at $|N-1\rangle$.</Latex></p>
            <p><Latex>We are now ready to view the results! The following graphs show the proportion of shots on the Classiq Aer simulator for the quantum state $|N-1\rangle$ representing the speed of the exit node oscillator {`$|\\dot{x}_N(t)|$`} for 10 qubits ({`$n=8, N=510$`}) and 20 qubits ({`$n=18, N=524286$`}) respectively. As a reminder, the expected behavior is a spike for this state around $t \approx 2n$, and you can clearly see a large spike on both of the graphs.</Latex></p>
            <div className="graph">
                <img src={TenQubits}/>
                <img src={TwentyQubits}/>
            </div>
        </>
    )
}