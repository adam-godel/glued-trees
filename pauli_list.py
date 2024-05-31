from functools import wraps
from qiskit.quantum_info import SparsePauliOp
from scipy import linalg
import numpy as np
import pickle

def cache(func):
    func.cache = pickle.load(open('pauli_list.cache', 'rb'))
    @wraps(func)
    def wrapper(dim, compression):
        if (dim, compression) in func.cache:
            return func.cache[dim, compression]
        func.cache[dim, compression] = func(dim, compression)
        pickle.dump(func.cache, open('pauli_list.cache', 'wb'))
        return func.cache[dim, compression]
    return wrapper

@cache
def pauli_str(dim, compression):
    A = [[0] * 2**dim for _ in range(2**dim)]
    for i in range(2**dim):
        if i >= 1:
            A[i][i-1] = -2 if i == 2**(dim-1) else -np.sqrt(2)
        A[i][i] = 3
        if i < 2**dim-1:
            A[i][i+1] = -2 if i == 2**(dim-1)-1 else -np.sqrt(2)
    A = -np.array(linalg.sqrtm(A))
    c = SparsePauliOp.from_operator(A)
    return [(str(c.paulis[i]), c.coeffs[i].real) for i in range(len(c)) if abs(c.coeffs[i]) > 1/compression]

dim = int(input('Qubits: '))
compression = eval(input('Compression: '))
print(pauli_str(dim, compression))