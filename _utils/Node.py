class Node():
    def __init__(self, id, coords = [], adjacents = [], hallway = 'H'):
        self.id = id
        self.coords = coords
        self.adjacents = adjacents
        self.hallway = hallway

    def __eq__(self, other):
        return self.id == other.id