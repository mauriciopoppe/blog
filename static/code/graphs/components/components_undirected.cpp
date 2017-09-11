vector<bool> visited;
// adjacency list of G
vector<vector<int> > g;

void dfs(int v) {
  visited[v] = true;
  for (int i = 0; i < g[v].size(); i += 1) {
    int next = g[v][i];
    if (!visited[next]) {
      dfs(next);
    }
  }
}

/**
 * Computes the number of connected components in an undirected graph `G`
 * of order `n` and size `m`
 *
 * Time complexity: O(n + m)
 * Space complexity: O(n)
 *
 * @return {int} The number of components in `G`
 */
int connected_components() {
  int n = g.size();
  visited.assign(n, false);

  int components = 0;
  for (int i = 0; i < visited.size(); i += 1) {
    if (!visited[i]) {
      dfs(i);
      ++components;
    }
  }
  return components;
}
