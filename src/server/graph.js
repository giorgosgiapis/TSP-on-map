module.exports = /** @class */ (function () {
    function Graph() {
        this.adjList = {};
        this.nodeList = [];
        this.idMap = {};
        this.invMap = {};
        this.nodeCnt = 0;
        this.adjMat = [];
    }
    /**
     * addNode: adds a node in the graph
     */
    Graph.prototype.addNode = function (id) {
        this.adjList[id] = [];
        this.idMap[id] = this.nodeCnt;
        this.invMap[this.nodeCnt] = id;
        this.nodeList.push(id);
        this.nodeCnt++;
    };
    /**
     * addEdge: adds an edge between two graph nodes
     * NOTE: all nodes should be added before adding an edge
     */
    Graph.prototype.addEdge = function (node1, node2, dist) {
        this.adjList[node1].push([node2, dist]);
        this.adjList[node2].push([node1, dist]);
    };
    /**
     * TSPSolverDP: Solve TSP using Dynamic Programming
     */
    Graph.prototype.TSPSolverDP = function () {
        var _this = this;
        this.buildMatrix();
        var dp = [];
        for (var i = 0; i < this.nodeCnt; i++) {
            dp[i] = [];
            for (var j = 0; j < (1 << this.nodeCnt); j++) {
                dp[i][j] = -1;
            }
        }
        this.DPHelper(0, 1, dp);
        var path = [0];
        this.getPathDP(0, 1, dp, path);
        return path.map(function (index) {
            return _this.invMap[index];
        });
    };
    Graph.prototype.DPHelper = function (pos, mask, dp) {
        if (mask == (1 << this.nodeCnt) - 1) {
            return this.adjMat[0][pos];
        }
        if (dp[pos][mask] != -1) {
            return dp[pos][mask];
        }
        var minDist = Number.POSITIVE_INFINITY;
        for (var i = 0; i < this.nodeCnt; i++) {
            if (i == pos || mask & (1 << i)) {
                continue;
            }
            var curDist = this.adjMat[pos][i] + this.DPHelper(i, mask | (1 << i), dp);
            if (curDist < minDist) {
                minDist = curDist;
            }
        }
        dp[pos][mask] = minDist;
        return minDist;
    };
    Graph.prototype.getPathDP = function (pos, mask, dp, path) {
        if (mask == (1 << this.nodeCnt) - 1) {
            return;
        }
        var minDist = Number.POSITIVE_INFINITY, curCity;
        for (var i = 0; i < this.nodeCnt; i++) {
            if (i == pos || mask & (1 << i)) {
                continue;
            }
            var curDist = this.adjMat[pos][i] + dp[i][mask | (1 << i)];
            if (curDist < minDist) {
                minDist = curDist;
                curCity = i;
            }
        }
        path.push(curCity);
        this.getPathDP(curCity, mask | (1 << curCity), dp, path);
    };
    Graph.prototype.buildMatrix = function () {
        for (var _i = 0, _a = this.nodeList; _i < _a.length; _i++) {
            var node = _a[_i];
            var u = this.idMap[node], v = void 0, w = void 0;
            this.adjMat[u] = [];
            this.adjMat[u][u] = 0;
            for (var _b = 0, _c = this.adjList[node]; _b < _c.length; _b++) {
                var neigh = _c[_b];
                v = this.idMap[neigh[0]];
                w = neigh[1];
                this.adjMat[u][v] = w;
            }
        }
    };
    return Graph;
}());
