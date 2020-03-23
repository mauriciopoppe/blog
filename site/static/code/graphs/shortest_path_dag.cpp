// adjacency list of G
// (to, weight)
vector<vector<pair<int, int> > > g;

// topological sort states
vector<bool> visited;
vector<int> order;

// shortest path state
vector<int> dist;

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

/**
 * Given a weighted graph `G` of order `n` and size `m` and a source vertex `source`
 * it computes the shortest distance between `source` and every other reachable
 * vertex from `source`
 *
 * Time complexity: O(n + m)
 * Space complexity: O(n)
 *
 */
void shortest_path_dag(int source) {
  int n = g.size();
  dist.assign(n, -1);

  topological_sort();
  dist[source] = 0;

  for(int i = 0; i < order.size(); i += 1) {
    int v = order[i];
    if (dist[v] >= 0) {
      for (int j = 0; j < g[v].size(); j += 1) {
        int to = g[v][j].first;
        int weight = g[v][j].second;
        int path_distance = dist[v] + weight;
        if (dist[to] < 0 || dist[to] > path_distance) {
          dist[to] = path_distance;
        }
      }
    }
  }
}
