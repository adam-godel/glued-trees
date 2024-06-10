import networkx as nx
import random
import string
import json

dim = 5
T1 = nx.balanced_tree(2, dim-1)
T2 = nx.relabel_nodes(T1, lambda x: 2**(dim+1)-3-x)
T = nx.union(T1, T2)
edges = {i:0 for i in range(2**dim-1, 2**(dim-1)+2**dim-1)}
for i in range(2**(dim-1)-1, 2**dim-1):
    nums = [j for j in range(2**dim-1, 2**(dim-1)+2**dim-1) if edges[j] < 2]
    vals = random.sample(nums, k=2)
    for j in vals:
        edges[j] += 1
    T.add_edges_from([(i, vals[0]), (i, vals[1])])

keys = {i:(''.join(random.sample(string.ascii_uppercase, k=dim)) if i > 0 else 'START') for i in range(0, 2**(dim+1)-2)}
neighbors = {keys[i]:[keys[i] for i in list(T[i])] for i in keys.keys()}
json.dump(neighbors, open("glued-trees.json", "w"))