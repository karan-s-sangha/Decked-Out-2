class Node {
    constructor(x, y, g, h, parent = null) {
        this.x = x;
        this.y = y;
        this.g = g; // Cost from start node
        this.h = h; // Heuristic cost to end node
        this.f = g + h; // Total cost
        this.parent = parent;
    }

    toString() {
        return `${this.x}-${this.y}`;
    }
}
