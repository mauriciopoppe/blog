int time_spent;

// the adjacency list representation of `G`
vector<vector<int> > g;
// the time a vertex `i` was discovered first
vector<int> time_in;
// stores the discovery time of the lowest predecessor that vertex `i`'s
// succesor vertices can reach **through a back edge**, initially
// the lowest predecessor is set to the vertex itself
vector<int> back;
// the bridges found during the dfs
vector<pair<int, int> > cut_edge;

void dfs(int v, int parent) {
  // the lowest back edge discovery time of `v` is
  // set to the discovery time of `v` initally
  back[v] = time_in[v] = ++time_spent;

  for (int i = 0; i < g[v].size(); i += 1) {
    int next = g[v][i];

    if (next == parent) {
      continue;
    }

    if (time_in[next] == -1) {
      dfs(next, v);
      // if there's a back edge between a descendant of `next` and
      // a predecessor of `v` then `next` will have a lower back edge discovery time
      // otherwise it's a bridge
      if (back[next] > time_in[v]) {
        cut_edge.push_back(pair<int, int> (v, next));
      }
      // propagation of the lowest back edge discovery time
      back[v] = min(back[v], back[next]);
    } else {
      // *back edge*
      // update the lowest back edge discovery time of `v`
      back[v] = min(back[v], time_in[next]);
    }
  }
}

/**
 * Finds the bridges in an undirected graph `G` of order `n` and size `m`
 *
 * Time complexity: O(n + m)
 * Space complexity: O(n)
 */
void bridges() {
  int n = g.size();
  time_spent = 0;
  time_in.assign(n, -1);
  back.assign(n, -1);
  cut_edge.clear();

  for (int i = 0; i < n; i += 1) {
    if (time_in[i] == -1) {
      dfs(i, -1);
    }
  }
}
