from _utils.Node import Node
from _utils.nodes import nodes1, nodes2
from _utils.rooms import floor1, floor2, stairs1, stairs2, stair_from_1_to_2, stair_from_2_to_1, elev_from_1_to_2, elev_from_2_to_1, elevators1, elevators2

def search(f, t: Node, start_node: Node, end_node: Node, path: list = [], paths: list = [], nodes: list = []):    
    to_search = t.adjacents
    to_search = [nodes[n] for n in to_search if nodes[n].hallway in ['X', start_node.hallway, end_node.hallway]]
    if not to_search:
        print("Nothing to search for",t.id)
    if f: # if came from a node; isn't the start node
        try:
            to_search.remove(f) # remove previous node from list to avoid doubling up
        except:
            print("Removing",f.id,"from",t.id,"failed")
            exit()
    if t == end_node: # found a path
        path.append(t) # add end node to path
        #print("Found path:",[n.id for n in path])
        paths.append(path)
        return paths
    for curr in to_search:
        if curr not in path:
            paths = search(t, curr, start_node, end_node, path + [t], paths, nodes)
    return paths

def get_coords(start_room, end_room, elevators = False):
    if elevators:
        travel1 = elevators1.copy()
        travel2 = elevators2.copy()
        travel_from_1_to_2 = elev_from_1_to_2.copy()
        travel_from_2_to_1 = elev_from_2_to_1.copy()
    else:
        travel1 = stairs1.copy()
        travel2 = stairs2.copy()
        travel_from_1_to_2 = stair_from_1_to_2.copy()
        travel_from_2_to_1 = stair_from_2_to_1.copy()
    
    start_floor1 = start_room[1] == '1'
    end_floor1 = end_room[1] == '1'
    floor = "1"
    not_floor = "2"
    if start_floor1 == end_floor1: # on same floor            
        if start_floor1:
            start_node = nodes1[floor1[start_room]]
            end_node = nodes1[floor1[end_room]]
            paths = search(None, start_node, start_node, end_node, nodes = nodes1)
        else:
            start_node = nodes2[floor2[start_room]]
            end_node = nodes2[floor2[end_room]]
            floor = "2"
            not_floor = "1"
            paths = search(None, start_node, start_node, end_node, nodes = nodes2)
        best_path = min(paths, key=len)
        paths.clear()
        print("Best:",[n.id for n in best_path])
        return {floor: [n.coords for n in best_path], not_floor: []}
    else: # different floors
        # find starting stairwell
        if start_floor1:
            # choose stairs
            start_node = nodes1[floor1[start_room]]
            start_stair = travel1[start_node.hallway]
            if not start_stair: # fix this
                start_stair = travel1['X']
            best_stair_option = start_stair[0]
            paths = search(None, start_node, start_node, nodes1[start_stair[0]], nodes = nodes1)
            best_stair_path = min(paths, key=len)
            for option in start_stair:
                paths = search(None, start_node, start_node, nodes2[option], nodes = nodes1)
                curr_path = min(paths, key=len)
                if len(curr_path) < len(best_stair_path):
                    best_stair_path = curr_path
                    best_stair_option = option
            
            # floor 2
            start_node = nodes2[travel_from_1_to_2[best_stair_option]]
            end_node = nodes2[floor2[end_room]]
            paths.clear()
            paths = search(None, start_node, start_node, end_node, nodes = nodes2)
            best_path = min(paths, key=len)
            return {"2": [n.coords for n in best_path], "1": [n.coords for n in best_stair_path]}

        else:
            # choose stairs
            start_node = nodes2[floor2[start_room]]
            start_stair = travel2[start_node.hallway]
            if not start_stair: # fix this
                start_stair = travel2['X']
            best_stair_option = start_stair[0]
            paths = search(None, start_node, start_node, nodes2[start_stair[0]], nodes = nodes2)
            best_stair_path = min(paths, key=len)
            for option in start_stair:
                paths.clear()
                paths = search(None, start_node, start_node, nodes2[option], nodes = nodes2)
                curr_path = min(paths, key=len)
                if len(curr_path) < len(best_stair_path):
                    best_stair_path = curr_path
                    best_stair_option = option
            
            # floor 1
            start_node = nodes1[travel_from_2_to_1[best_stair_option]]
            end_node = nodes1[floor1[end_room]]
            paths.clear()
            paths = search(None, start_node, start_node, end_node, nodes = nodes1)
            best_path = min(paths, key=len)
            print([n.id for n in best_path])
            return {"1": [n.coords for n in best_path], "2": [n.coords for n in best_stair_path]}