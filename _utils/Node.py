class Node():
    def __init__(self, id, coords = [], adjacents = []):
        self.id = id
        self.coords = coords
        self.adjacents = adjacents

    def __eq__(self, other):
        return self.id == other.id