from Node import Node

def search(f, t: Node, path: list = [], paths: list = []):
    to_search = t.adjacents.copy()
    to_search = [nodes[n] for n in to_search]
    if f: # if came from a node; isn't the start node
        to_search.remove(f) # remove previous node from list to avoid doubling up
    if t == end_node: # found a path
        path.append(t) # add end node to path
        print("Found end node! Path:",[n.id for n in path])
        paths.append(path)
    for curr in to_search:
        if curr not in path:
            search(t, curr, path + [t], paths)
    return paths

nodes = {
    1: Node(1, [], [2]),
    2: Node(2, [], [1, 3, 5]),
    3: Node(3, [], [2, 4]),
    4: Node(4, [], [3, 9]),
    5: Node(5, [], [2, 6]),
    6: Node(6, [], [5, 7]),
    7: Node(7, [], [6, 8, 10]),
    8: Node(8, [], [7, 9]),
    9: Node(9, [], [4, 8]),
    10: Node(10, [], [7])
}

rooms = {
    "F206": 6
}

end_node = nodes[10]

paths = search(None, nodes[1])
print("Finished, found",len(paths))
for i in range(0, len(paths)):
    print(i,":",[n.id for n in paths[i]])
print(paths)
best_path = min(paths,key=len)
print("Best:",[n.id for n in best_path])