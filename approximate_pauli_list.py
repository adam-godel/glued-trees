from functools import wraps
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
    cache = pickle.load(open('pauli_list.cache', 'rb'))
    return [(x[0].rjust(dim, 'I'), x[1]) for x in cache[max(cache)]]

print('Cached values:', list(pauli_str.cache.keys()))
dim = int(input('Qubits: '))
print(pauli_str(dim))