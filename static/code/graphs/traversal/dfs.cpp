int time_spent = 0;

// the adjacency list of `G`
vector<vector<int> > g;
// the explored state of a vertex `i`
vector<bool> visited;
// the predecesor of a vertex `i` in the dfs tree
vector<bool> predecessor;
// the time a vertex `i` was discovered first
vector<int> time_in;
// the time a vertex `i` spent exploring each reachable non-visited vertices
vector<int> time_out;

/**
 * Traverses a graph `G` of order `n` and size `m` by depth,
 * it's assumed that `time_in`, `time_out`, `visited`, `predecessor`
 * are initialized correctly with a size equal to `n`
 *
 * Time complexity: O(n + m)
 * Space complexity: O(n)
 *
 * @param {int} v The current vertex being analyzed
 */
void dfs(int v) {
  visited[v] = true;
  time_in[v] = ++time_spent;

  for (int i = 0; i < g[v].size(); i += 1) {
    int next = g[v][i];

    // edge analysis
    if (!time_in[next]) {
      // edge (v, next) is a tree edge
    } else if (!time_out[next]) {
      // edge (v, next) is a back edge
    } else if (time_in[v] < time_in[next]) {
      // edge (v, next) is a forward edge
    } else {
      // edge (v, next) is a forward edge
    }

    // traversal to adjacent vertices
    if (!visited[next]) {
      predecessor[next] = v;
      dfs(next);
    }
  }

  time_out[v] = ++time_spent;
}
