vector<int> dist;
vector<int> parent;

/**
 * Traverses a graph `G` of order `n` and size `m` by breadth
 *
 * Time complexity: O(n + m)
 * Space complexity: O(n)
 *
 * @param {vector<vector<int> >} g The adjacency list representation
 * of a graph
 * @param {int} source The source vertex
 */
void bfs(vector<vector<int> > &g, int source) {
  int n = g.size();
  dist.assign(n, -1);
  parent.assign(n, -1);

  queue<int> remaining;
  dist[source] = 0;
  remaining.push(source);

  while (!remaining.empty()) {
    int current = remaining.front();
    remaining.pop();

    for (int i = 0; i < g[current].size(); i += 1) {
      int next = g[current][i];
      if (dist[next] == -1) {
        dist[next] = dist[current] + 1;
        parent[next] = current;
        remaining.push(next);
      }
    }
  }
}
