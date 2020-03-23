/**
 * Breadth first search algorithm applied on an unweighted graph `G`
 * of order `n` and size `m` to find the shortest path from a source
 * vertex `s`
 *
 * Time complexity: O(n + m)
 * Space complexity: O(n)
 *
 * @param {vector<vector<int> >} g The adjacency list representation
 *  of `G`, each entry `g_{ij}` holds the end `v` of the edge `iv`
 * @param {int} s The source vertex
 * @return {vector<int>} The shortest path from `s` to all the other vertices
 */
vector<int> bfs(vector<vector<int> > &g, int s) {
  int n = g.size();

  // the vertex predecessor of `i` in the `s-i` path
  vector<int> parent(n, -1);
  // holds the shortest distance from `s` to vertex `i`
  vector<int> d(n, INF);

  // the distance from the source vertex is zero
  d[s] = 0;

  // accumulated weight, next vertex (weight, v)
  queue<int> q;
  q.push(s);

  while (!q.empty()) {
    int v = q.front();
    q.pop();

    for (int i = 0; i < g[v].size(); i += 1) {
      int to = g[v][i];
      if (d[to] == INF) {
        d[to] = d[v] + 1;
        parent[to] = v;
        q.push(to);
      }
    }
  }

  return d;
}
