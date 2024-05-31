from functools import wraps
from qiskit.quantum_info import SparsePauliOp
from scipy import linalg
import numpy as np
import pickle

def cache(func):
    func.cache = pickle.load(open('pauli_list.cache', 'rb'))
    @wraps(func)
    def wrapper(dim):
        if dim in func.cache:
            return func.cache[dim]
        func.cache[dim] = func(dim)
        pickle.dump(func.cache, open('pauli_list.cache', 'wb'))
        return func.cache[dim]
    return wrapper

@cache
def pauli_str(dim):
    A = [[0] * 2**dim for _ in range(2**dim)]
    for i in range(2**dim):
        if i >= 1:
            A[i][i-1] = -2 if i == 2**(dim-1) else -np.sqrt(2)
        A[i][i] = 3
        if i < 2**dim-1:
            A[i][i+1] = -2 if i == 2**(dim-1)-1 else -np.sqrt(2)
    A = -np.array(linalg.sqrtm(A))
    c = SparsePauliOp.from_operator(A)
    result = [(str(c.paulis[i]), c.coeffs[i].real) for i in range(len(c))]
    if len(result) <= 200:
        return result
    return sorted(result, key=lambda x: abs(x[1]), reverse=True)[0:200]

dim = int(input('Qubits: '))
print(pauli_str(dim))