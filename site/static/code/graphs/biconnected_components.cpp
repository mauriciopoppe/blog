int time_spent;

// the adjacency list representation of `G`
vector<vector<int> > g;
// the time a vertex `i` was discovered first
vector<int> time_in;
// stores the discovery time of the lowest predecessor that vertex `i`'s
// succesor vertices can reach **through a back edge**, initially
// the lowest predecessor is set to the vertex itself
vector<int> back;

// the biconnected components found during the dfs
vector<vector<pair<int, int> > > bcc;
stack<pair<int, int> > edges_processed;

void output_biconnected_component(int u, int v) {
  pair<int, int> top;
  vector<pair<int, int> > component;
  do {
    top = edges_processed.top();
    edges_processed.pop();
    component.push_back(top);
  } while (u != top.first || v != top.second);
  bcc.push_back(component);
}

void dfs(int v, int parent) {
  // the lowest back edge discovery time of `v` is
  // set to the discovery time of `v` initally
  back[v] = time_in[v] = ++time_spent;

  // count the number of children for the `root` vertex
  int is_cut_vertex = false;

  for (int i = 0; i < g[v].size(); i += 1) {
    int next = g[v][i];

    if (parent == next) {
      continue;
    }

    // mark the edge (v, next) as processed
    if (time_in[next] == -1) {
      // this edge is being processed right now
      edges_processed.push(pair<int, int> (v, next));

      dfs(next, v);
      // if there's a back edge between a descendant of `next` and
      // a predecessor of `v` then `next` will have a lower reachable
      // vertex than `v` through a back edge, in this case the vertex `v` is not
      // a cut-vertex
      if (back[next] >= time_in[v]) {
        output_biconnected_component(v, next);
      }
      // propagation of the back edge to a vertex with the lowest discovery time
      back[v] = min(back[v], back[next]);
    } else if (time_in[next] < time_in[v]) {
      // * back edge *
      // update index of the vertex incident with this back edge to
      // be the one with the lowest discovery time
      back[v] = min(back[v], time_in[next]);

      // push this edge to the stack only once
      edges_processed.push(pair<int, int> (v, next));
    }
  }
}

/**
 * Finds the biconnected components in an undirected graph `G`
 * of order`n` and size `m`
 *
 * Time complexity: O(n + m)
 * Space complexity: O(m)
 *
 * @returns {int} the number of biconnected components
 */
int biconnected_components() {
  int n = g.size();
  time_spent = 0;
  time_in.assign(n, -1);
  back.assign(n, -1);

  while (!edges_processed.empty()) {
    edges_processed.pop();
  }
  bcc.clear();

  for (int i = 0; i < n; i += 1) {
    if (time_in[i] == -1) {
      dfs(i, -1);
    }
  }

  return bcc.size();
}
