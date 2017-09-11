vector<bool> visited;
// adjacency list of G
vector<vector<int> > g;
vector<int> order;

void dfs(int v) {
  visited[v] = true;
  for (int i = 0; i < g[v].size(); i += 1) {
    int next = g[v][i];
    if (!visited[next]) {
      dfs(next);
    }
  }
  order.push_back(v);
}

/**
 * Given a graph `G` of order `n` and size `m` computes a linear ordering
 * of the vertices such that for every edge u -> v, `u` comes earlier than `v`
 * in the ordering
 *
 * Time complexity: O(n + m)
 * Space complexity: O(n)
 *
 */
void topological_sort() {
  int n = g.size();
  visited.assign(n, false);

  for (int i = 0; i < visited.size(); i += 1) {
    if (!visited[i]) {
      dfs(i);
    }
  }

  reverse(order.begin(), order.end());
}
