import React from 'react'
import './notebook.css'
import Diagram from '../../../figures/glued_trees_diagram.png'
import TenQubits from '../../../figures/10_qubits.png'
import TwentyQubits from '../../../figures/20_qubits.png'
import Title from '../components/title/title'
import { CodeBlock, paraisoLight } from 'react-code-blocks'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

export default function Notebook() {
    function codeBlock(code) {
        return (
            <div className='code'>
                <CodeBlock
                    text={code}
                    language={'python'}
                    showLineNumbers={true}
                    theme={paraisoLight}
                />
            </div>
        );
    }
    return (
        <>
            <Title />
            <h1>Glued Trees Notebook</h1>
            <p>This page is a port of the <code><a href="https://github.com/adam-godel/glued-trees/blob/main/glued_trees.ipynb">glued_trees.ipynb</a></code> Jupyter notebook found in the <a href="https://github.com/adam-godel/glued-trees">Glued Trees repository</a>. It is also featured as part of the <a href="https://github.com/Classiq/classiq-library/tree/main/algorithms/glued_trees">Classiq library</a>. Use the Jupyter notebook version in the repository if you would like to re-execute cells or customize the qubit size.</p>
            <h1>Introduction</h1>
            <p><Latex>Consider a network of two mirrored binary trees connected to each other, where the outermost nodes of each tree are connected to two random nodes in the other tree. This structure will have $2n$ columns and {`$2^{n+1}-2$`} nodes in total, as shown in the diagram below. Each node in the structure has a secret key in the form of a random bit string of size $2n$, and you are given oracular access to the network such that you can query a node using its key to get the keys of its neighbors. Your goal is, given the key of the entrance node, to find the key of the exit node as efficiently as possible.</Latex></p>
            <img src={Diagram}/>
            <p>If you try to play this game yourself, or program an algorithm to do so, you'll quickly run into a major problem: since you don't know what specific nodes on the tree the interior keys correspond to, you will get lost within the structure once you reach the area between the two trees. There is no way to guarantee a solution to this problem—using a classical computer—that doesn't require you to check every node in the worst case.</p>
            <p><Latex>There is a way to solve this problem efficiently however, on the order of the total number of {`<i>columns</i>`} of the structure instead of the nodes. You just need to use a quantum computer! This paper {`[<a href="#GluedTrees" target="_self">1</a>]`} published in December 2023 describes a quantum approach to solving this algorithm by considering the structure as a system of coupled harmonic oscillators attached by springs. A quantum computer can use Hamiltonian simulation to simulate this classical system efficiently. If you apply a push to the oscillator representing the entrance node, and treat the interactions between nodes as queries, you can "reach" the exit node (trigger a spike in its oscillatory movement) in time $2n$, offering linear efficiency as opposed to exponential efficiency!</Latex></p>
            <p>While this notebook will be following the algorithm described by the 2023 paper above, it should be noted that this problem was first set by this paper from October 2002 [<a href="#QuantumWalk" target="_self">2</a>].</p>
            <p>The following code segment imports all the necessary libraries for this notebook. Both Qiskit and NetworkX are required for the <code>generate_pauli_list</code> function, but the Pauli lists for 10 and 20 qubits (the examples in this notebook) have already been generated and cached in the <code><a href="https://github.com/adam-godel/glued-trees/blob/main/glued_trees_cache.json">glued_trees_cache.json</a></code> file. You may uncomment the two lines at the bottom of the code segment, however, if you would like to try recalculating the Pauli lists or calculating them for other qubit sizes.</p>
            {codeBlock(`from typing import cast
from classiq import *
from classiq.execution import ExecutionPreferences
import numpy as np
import matplotlib.pyplot as plt
import random
import json
%config InlineBackend.figure_format = 'retina' # improve graph image quality
#from qiskit.quantum_info import SparsePauliOp
#import networkx as nx`)}
            <h1 style={{marginTop: '0.9rem'}}>Quantum Algorithm</h1>
            <p><Latex>To model the columns of the glued trees structure as a system of coupled harmonic oscillators, we consider a matrix {`$\\mathbf{A}$`} of size $N \times N$ corresponding to the nodes of the glued trees structure, such that {`$N=2^{n+1}-2$`} and $n$ is the number of columns of one of the two glued trees. This matrix is defined as {`$\\mathbf{A}:=3(\\mathbf{1}_N)-A$`}, where $A$ is the adjacency matrix of the glued trees system using any ordering.</Latex></p>
            <p>For demonstration purposes, we will be using a simple linear ordering of this adjacency matrix such that the entrance node is first and the exit node is last. This matrix will be symmetrical and take the following shape:</p>
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
            <p><Latex>As shown in further detail in the paper, we can define a block Hamiltonian {`$\\mathbf{H}$`} such that</Latex></p>
            <Latex>
                {`$$
                \\mathbf{H} := -\\begin{pmatrix}
                \\mathbf{0} & \\mathbf{B} \\\\
                \\mathbf{B}^† & \\mathbf{0}
                \\end{pmatrix}
                $$`}
            </Latex>
            <p><Latex>where {`$\\mathbf{B}$`} is any $N \times M$ matrix such that {`$\\mathbf{B}\\mathbf{B}^†=\\mathbf{A}$`}. However, to use this matrix {`$\\mathbf{H}$`} for Hamiltonian simulation, it must have a size corresponding to a power of two, while {`$\\mathbf{A}$`} is size $N \times N$. We can deal with this by ensuring that {`$\\mathbf{B}$`} is size $N \times (N+4)$, so the resulting Hamiltonian {`$\\mathbf{H}$`} is a square matrix with side length {`$2N+4 = 2(2^{n+1}-2)+4 = 2^{n+2}$`}. This means that a glued trees system with $n$ columns for one tree can be simulated using $n+2$ qubits.</Latex></p>
            <p><Latex>The following code segments contain all of the helper methods that relate to creating the matrix {`$\\mathbf{H}$`} and processing it in a form that Classiq's {`<code>exponentiation_with_depth_constraint</code>`} function can understand.</Latex></p>
            <p>The <code>pauli_str_to_enums</code> and <code>pauli_list_to_hamiltonian</code> functions are taken from the Classiq documentation and convert the list of tuples input into a <code>PauliTerm</code> list, the input Classiq recognizes for its exponentiation function.</p>
            {codeBlock(`CHAR_TO_STUCT_DICT = {"I": Pauli.I, "X": Pauli.X, "Y": Pauli.Y, "Z": Pauli.Z}

def pauli_str_to_enums(pauli):
    return [CHAR_TO_STUCT_DICT[s] for s in pauli]

def pauli_list_to_hamiltonian(pauli_list):
    return [
        PauliTerm(
            pauli=pauli_str_to_enums(pauli), coefficient=cast(complex, coeff).real
        )
        for pauli, coeff in pauli_list
    ]`)}
            <p><Latex>In this notebook, we generate the matrix {`$\\mathbf{A}$`} by building the glued trees structure using the NetworkX library such that the nodes are labeled in order from the entrance to exit node and using the {`<code>nx.adjacency_matrix</code>`} function to generate an adjacency matrix using that ordering. We will decompose {`$\\mathbf{A}$`} using {`<a href="https://en.wikipedia.org/wiki/Cholesky_decomposition">Cholesky decomposition</a>`} to get a square matrix where its product with its conjugate transpose is equal to {`$\\mathbf{A}$`}. This matrix is the same size as {`$\\mathbf{A}$`}, however, so we must pad it with 4 columns of zeroes to get our matrix {`$\\mathbf{B}$`} of size $N \times (N+4)$ so {`$\\mathbf{H}$`} has a size corresponding to a power of two. We can then create the block Hamiltonian with the proper size using {`$\\mathbf{B}$`} and {`$\\mathbf{B}^†$`}, and generate its full Pauli list using Qiskit's {`<code>SparsePauliOp.from_operator</code>`} {`[<a href="#SparsePauliOp" target="_self">3</a>]`} function.</Latex></p>
            <p>All Pauli list outputs are cropped so they have no more than 200 terms. This is to ensure that the circuit depth is at a reasonable range (low thousands) given the limits of current quantum hardware. As a result of this approach, as the number of qubits increases, the accuracy of the Pauli list in comparison to the matrix it represents diminishes so the circuit depth remains roughly constant.</p>
            <p><Latex>The Pauli list representation of {`$\\mathbf{H}$`} for qubit sizes small enough to calculate (13 qubits and lower) are generated and cropped using the {`<code>generate_pauli_list</code>`} function, which uses an ad hoc approach that tries to represent the Pauli list as a whole as accurately as possible using only the 200 ostensibly most relevant terms to simulating the system.</Latex></p>
            <p><Latex>The cropping algorithm, defined in the {`<code>crop_pauli_list</code>`} function, first selects 120 terms (60%) by going through each character position from the end to the start and picking the Pauli terms with the largest coefficients that contain each of the four possibilities ($I$, $X$, $Y$, $Z$) at that character position. If all positions are exhausted before reaching 120 terms, the algorithm takes another pass through the character positions until 120 are selected. The other 80 terms (40%) are selected by picking the 80 remaining terms with the largest coefficients. The algorithm balances important high-coefficient terms with diversity in the 200 selected terms.</Latex></p>
            <p>The Pauli lists for qubit sizes too large to fully calculate (greater than 13 qubits) are approximated by padding with the second character of the Pauli strings of the largest cropped Pauli list that can be generated in reasonable time, as this follows a pattern present in the vast majority of strings in the cropped Pauli list.</p>
            {codeBlock(`def crop_pauli_list(pauli, size):
    if len(pauli) <= size:
        return pauli
    result = []
    idx = 0
    while len(result) < round(size*0.6):
        for i in range(len(pauli[0][0])-1, -1, -1):
            for k in pauli:
                if k[0][i] == 'IXYZ'[idx%4] and k not in result:
                    result.append(k)
                    break
            idx += 1
    for i in pauli:
        if len(result) >= size:
            break
        if i not in result:
            result.append(i)
    return result

def generate_pauli_list(qubits):
    dim = qubits-2
    T1 = nx.balanced_tree(2, dim-1)
    T2 = nx.relabel_nodes(T1, lambda x: 2**(dim+1)-3-x)
    T = nx.union(T1, T2)
    edges = {i:0 for i in range(2**dim-1, 2**(dim-1)+2**dim-1)}
    for i in range(2**(dim-1)-1, 2**dim-1):
        nums = [j for j in range(2**dim-1, 2**(dim-1)+2**dim-1) if edges[j] < 1]
        if len(nums) == 0:
            nums = [j for j in range(2**dim-1, 2**(dim-1)+2**dim-1) if edges[j] < 2]
        vals = random.sample(nums, k=2)
        for j in vals:
            edges[j] += 1
        T.add_edges_from([(i, vals[0]), (i, vals[1])])
    A = 3*np.identity(2**(dim+1)-2)-np.array(nx.adjacency_matrix(T, nodelist=sorted(T.nodes())).todense())
    B = np.hstack((np.linalg.cholesky(A), np.zeros((2**(dim+1)-2, 4))))
    H = -np.block([[np.zeros((B.shape[0], B.shape[0])), B], [B.conj().T, np.zeros((B.shape[1], B.shape[1]))]])
    c = SparsePauliOp.from_operator(H)
    result = [(str(c.paulis[i]), c.coeffs[i].real) for i in range(len(c))]
    return crop_pauli_list(sorted(result, key=lambda x: abs(x[1]), reverse=True), 200)

def pauli_str(qubits, recalculate=False):
    cache = json.load(open('glued_trees_cache.json', 'r'))
    if not recalculate and str(qubits) in cache:
        return cache[str(qubits)]
    if qubits > 13:
        return [(i[0][0]+i[0][1]*(qubits-len(i[0]))+i[0][1:], i[1]) for i in generate_pauli_list(13)]
    return generate_pauli_list(qubits)`)}
            <p><Latex>We are now ready to run our main execution function, {`<code>run_point</code>`}. This function takes in the number of qubits {`<code>qubits</code>`} and the time {`<code>t</code>`} to perform Hamiltonian simulation {`$e^{-it\\mathbf{H}}$`} using the {`<code>exponentiation_with_depth_constraint</code>`} function in the Classiq software development kit.</Latex></p>
            <p>The <code>max_depth</code> parameter is set to 1400, which is around the range of the current limit for comprehensible results in state of the art quantum computers. The <code>num_shots</code> parameter is set to 8192 to give enough of room for significant spikes in a state to be apparent given the high number of total possible states.</p>
            <p>The resulting quantum state can be written as follows:</p>
            <Latex>
                {`$$
                \\begin{align*}
                |\\psi(t)\\rangle &\\propto \\begin{pmatrix}
                \\dot{\\vec{x}}(t) \\\\
                i\\mathbf{B}^†\\vec{x}(t) 
                \\end{pmatrix} \\\\
                \\begin{pmatrix}
                \\dot{\\vec{x}}(t) \\\\
                i\\mathbf{B}^†\\vec{x}(t) 
                \\end{pmatrix} &= e^{-it\\mathbf{H}} \\begin{pmatrix}
                \\dot{\\vec{x}}(0) \\\\
                i\\mathbf{B}^†\\vec{x}(0) 
                \\end{pmatrix}
                \\end{align*}
                $$`}
            </Latex>
            <p><Latex>where {`$\\vec{x}(0)=(0,0,\\dots,0)^T$`} and {`$\\dot{\\vec{x}}(0)=(1,0,\\dots,0)^T$`} using a linear ordering of nodes.</Latex></p>
            <p><Latex>Since the speed of the entrance node oscillator {`$|\\dot{x}_1(t)|$`} is represented by the quantum state $|0\rangle$ and should have probability 1 at $t=0$, there is no specific state preparation necessary for this system. It should also be noted that since our matrix {`$\\mathbf{B}^†$`} is padded with 4 rows of zeroes, the highest 4 quantum states do not correspond to the displacement or speed of any oscillator. This means that the quantum state representing the speed of the exit node oscillator {`$|\\dot{x}_N(t)|$`}, which is what we are most interested in, will correspond to {`$|N-1\\rangle=|2^{n+1}-3\\rangle$`}. We will be tracking this particular quantum state at time $t \approx 2n$ expecting a spike, which represents the system of oscillators "reaching" the exit node from the initial push to the entrance node.</Latex></p>
            <p><Latex>We will run the {`<code>run_point</code>`} function through a helper function {`<code>run_range</code>`}, which executes it 13 times in total for a given qubit size, spanning from $t=2n-12$ to $t=2n+12$ in 2 second intervals. This range gives time to observe oscillation occurring at the state value corresponding to {`$|\\dot{x}_N(t)|$`} while also being close enough around $t=2n$, the time where we are expecting a spike.</Latex></p>
            {codeBlock(`def run_point(qubits, t, pauli_list):
    @qfunc
    def main(state: Output[QArray[QBit]]) -> None:
        allocate(len(pauli_list[0][0]), state)
        exponentiation_with_depth_constraint(
            pauli_list_to_hamiltonian(pauli_list),
            evolution_coefficient=t,
            max_depth=1400,
            qbv=state,
        )
    execution_preferences = ExecutionPreferences(num_shots=8192)
    model = set_execution_preferences(create_model(main), execution_preferences)
    quantum_program = synthesize(model)
    job = execute(quantum_program)
    filename = str(qubits)+'-qubits/2n'+(str(t-2*qubits+4) if t < 2*qubits-4 else '+'+str(t-2*qubits+4))
    json.dump(dict(job.result()[0].value), open('results/'+filename+'.json', 'w'))

def run_range(qubits, recalculate=False):
    pauli_list = pauli_str(qubits, recalculate)
    for i in range(-12, 13, 2):
        run_point(qubits, 2*qubits-4+i, pauli_list)`)}
            <p><Latex>The following code segment displays the execution of {`<code>run_range</code>`} for 10 qubits ($n=8, N=510$), a higher qubit size that is still simulatable. In addition, it is low enough that its Pauli list can still be fully generated and cropped.</Latex></p>
            <p>This instance of the function should take a few minutes to run. As defined, it will use the cached Pauli list for 10 qubits in <code>glued_trees_cache.json</code>. If you would like to recalculate the Pauli list, ensure that you have uncommented and run the two lines at the top of this notebook and add <code>recalculate=True</code> as the second parameter to the function.</p>
            {codeBlock(`run_range(10)`)}
            <p><Latex>The following code segment, on the other hand, displays the execution of {`<code>run_range</code>`} for 20 qubits ($n=18, N=524286$), a qubit size that is still simulatable but where its Pauli list cannot be generated and is thus approximated using the Pauli list for 13 qubits.</Latex></p>
            <p>This instance of the function should take a few minutes to run if the cached Pauli list is used. Since this instance of the function requires generating the Pauli list for 13 qubits, which is very large, it will take much longer to run if you choose to recalculate the Pauli list.</p>
            {codeBlock(`run_range(20)`)}
            <p><Latex>We can now graph the results we have generated using the simulator, which have been saved into directories in the {`<code>results</code>`} folder based on their qubit size. The {`<code>graph_results</code>`} function creates a plot of the proportion of shots for the qubit state $|N-1\rangle$ corresponding to {`$|\\dot{x}_N(t)|$`} for a given qubit size from $t=2n-12$ to $t=2n+12$ and saves it in the {`<code>figures</code>`} folder.</Latex></p>
            {codeBlock(`def graph_results(qubits):
    states = [(str(i) if i < 0 else '+'+str(i)) for i in range(-12, 13, 2)]
    times = [2*qubits-4+int(i) for i in states]
    data = []
    for i in states:
        with open('results/'+str(qubits)+'-qubits'+'/2n'+i+'.json', 'r') as f:
            j = json.load(f)
            key = str('0'+bin(2**(qubits-1)-3)[2:])
            data.append(j['counts'][key]/j['num_shots'] if key in j['counts'] else 0)
    plt.plot(times, data)
    plt.xlabel('Time (s)')
    plt.ylabel("Proportion of |"+str(2**(qubits-1)-3)+"> shots")
    plt.title(r'Glued Trees System at $t \approx 2n$ for '+str(qubits)+r' Qubits ($n='+str(qubits-2)+r'$)')
    plt.savefig('figures/'+str(qubits)+'_qubits.png', bbox_inches='tight', dpi=300)
    plt.show()`)}
            <p><Latex>The following code segment displays the graph for 10 qubits, a qubit size with a generated and cropped Pauli list. As expected, there is a large spike at $t=2n$ indicative of the initial push to the entrance node having "reached" the exit node.</Latex></p>
            {codeBlock(`graph_results(10)`)}
            <img src={TenQubits}/>
            <p><Latex>The following code segment displays the graph for 20 qubits, a qubit size with an approximated Pauli list. There is a clear spike just before $t=2n$ caused by the propagation from the entrance node.</Latex></p>
            {codeBlock(`graph_results(20)`)}
            <img src={TwentyQubits}/>
            <p>Because of our Pauli list cropping, the algorithm can also be run with reasonable accuracy on actual quantum hardware. Simply add one of Classiq's quantum hardware <a href="https://docs.classiq.io/latest/reference-manual/platform/executor/cloud-providers/">cloud providers</a> as an execution preference in the <code>run_point</code> function.</p>
            <p>Perhaps the most interesting thing about the glued trees algorithm is that it is a relatively heavy case of using a quantum computer to gain an exponential advantage, usually requiring several executions at different time points to observe the intended result, but it can still be executed effectively on present-day quantum hardware due to the Pauli list cropping. I encourage you to try out the algorithm on both a simulator and quantum hardware for various qubit sizes!</p>
            <h1>References</h1>
            <ul>
                <li><b id="GluedTrees">[1]:</b> <a href="https://journals.aps.org/prx/pdf/10.1103/PhysRevX.13.041041">Babbush, Ryan and Berry, Dominic W. and Kothari, Robin and Somma, Rolando D. and Wiebe, Nathan. "Exponential Quantum Speedup in Simulating Coupled Classical Oscillators." Phys. Rev. X 13, 041041 (2023)</a></li>
                <li><b id="QuantumWalk">[2]:</b> <a href="https://arxiv.org/pdf/quant-ph/0209131">Childs, Andrew M. and Cleve, Richard and Deotto, Enrico and Farhi, Edward and Gutmann, Sam and Spielman, Daniel A. "Exponential algorithmic speedup by a quantum walk." Proc. 35th ACM Symposium on Theory of Computing (STOC 2003), pp. 59-68</a></li>
                <li><b id="SparsePauliOp">[3]:</b> <a href="https://docs.quantum.ibm.com/api/qiskit/qiskit.quantum_info.SparsePauliOp">SparsePauliOp (Qiskit)</a></li>
            </ul>
        </>
    )
}