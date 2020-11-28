interface AdjacencyList {
  [key: string] : [string, number][];
}

interface Dictionary {
  [key: string] : number;
}

interface InverseDict {
  [key: number] : string;
}

module.exports = class Graph {
  protected adjList: AdjacencyList = {};
  protected nodeList: string[] = [];
  protected idMap: Dictionary = {};
  protected invMap: InverseDict = {};
  protected nodeCnt: number = 0;
  protected adjMat: number[][] = [];
  /**
   * addNode: adds a node in the graph
   */
  public addNode(id: string): void {
    this.adjList[id] = [];
    this.idMap[id] = this.nodeCnt;
    this.invMap[this.nodeCnt] = id;
    this.nodeList.push(id);
    this.nodeCnt++;
  }
  /**
   * addEdge: adds an edge between two graph nodes
   * NOTE: all nodes should be added before adding an edge
   */
  public addEdge(node1: string, node2: string, dist: number): void {
    this.adjList[node1].push([node2, dist]);
    this.adjList[node2].push([node1, dist]);
  }

  /**
   * TSPSolverDP: Solve TSP using Dynamic Programming
   */
  public TSPSolverDP() {
    this.buildMatrix();
    let dp: number[][] = [];
    for (let i = 0; i < this.nodeCnt; i++) {
      dp[i] = [];
      for (let j = 0; j < (1 << this.nodeCnt); j++) {
        dp[i][j] = -1;
      }
    }
    this.DPHelper(0, 1, dp);
    let path:number[] = [0];
    this.getPathDP(0, 1, dp, path);
    return path.map(index => {
      return this.invMap[index];
    });
  }

  private DPHelper(pos: number, mask: number, dp: number[][]) {
    if (mask == (1 << this.nodeCnt) - 1) {
      return this.adjMat[0][pos];
    }
    if (dp[pos][mask] != -1) {
      return dp[pos][mask];
    }
    let minDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < this.nodeCnt; i++) {
      if (i == pos || mask & (1 << i)) {
        continue;
      }
      let curDist = this.adjMat[pos][i] + this.DPHelper(i, mask | (1 << i), dp);
      if (curDist < minDist) {
        minDist = curDist;
      }
    }
    dp[pos][mask] = minDist;
    return minDist;
  }

  private getPathDP(pos: number, mask: number, dp: number[][], path: number[]) {
    if (mask == (1 << this.nodeCnt) - 1) {
      return;
    }
    let minDist = Number.POSITIVE_INFINITY, curCity;
    for (let i = 0; i < this.nodeCnt; i++) {
      if (i == pos || mask & (1 << i)) {
        continue;
      }
      let curDist = this.adjMat[pos][i] + dp[i][mask | (1 << i)];
      if (curDist < minDist) {
        minDist = curDist;
        curCity = i;
      }
    }
    path.push(curCity);
    this.getPathDP(curCity, mask | (1 << curCity), dp, path);
  }

  private buildMatrix() {
    for (let node of this.nodeList) {
      let u = this.idMap[node], v: number, w: number;
      this.adjMat[u] = [];
      this.adjMat[u][u] = 0;
      for (let neigh of this.adjList[node]) {
        v = this.idMap[neigh[0]];
        w = neigh[1];
        this.adjMat[u][v] = w;
      }
    }
  }
}
