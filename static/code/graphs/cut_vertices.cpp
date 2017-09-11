int time_spent;

// the adjacency list representation of `G`
vector<vector<int> > g;
// the time a vertex `i` was discovered first
vector<int> time_in;
// stores the discovery time of the lowest predecessor that vertex `i`'s
// succesor vertices can reach **through a back edge**, initially
// the lowest predecessor is set to the vertex itself
vector<int> back;
// the articulation points found during the dfs
vector<int> cut_vertex;

void dfs(int v, int parent) {
  // the lowest back edge discovery time of `v` is
  // set to the discovery time of `v` initally
  back[v] = time_in[v] = ++time_spent;

  // count the number of children for the `root` vertex
  int children = 0;
  int is_cut_vertex = false;

  for (int i = 0; i < g[v].size(); i += 1) {
    int next = g[v][i];

    if (next == parent) {
      continue;
    }

    if (time_in[next] == -1) {
      dfs(next, v);
      /// if there's a back edge between a descendant of `next` and
      // a predecessor of `v` then `next` will have a lower reachable
      // vertex than `v` through a back edge, in this case the vertex `v` is not
      // a cut-vertex (the special case of the root node is handled below)
      if (back[next] >= time_in[v] && parent != -1) {
        is_cut_vertex = true;
      }
      // propagation of the back edge to a vertex with the lowest discovery time
      back[v] = min(back[v], back[next]);
      ++children;
    } else {
      // * back edge *
      // update index of the vertex incident with this back edge to
      // be the one with the lowest discovery time
      // it's possible for this edge to be a *forward edge*, in that
      // case the time won't be updated since time[v] < time[next]
      back[v] = min(back[v], time_in[next]);
    }
  }

  // the root vertex of the dfs tree is a cut-vertex
  // if it has more than two children in the dfs tree
  if (parent == -1 && children > 1) {
    is_cut_vertex = true;
  }

  if (is_cut_vertex) {
    cut_vertex.push_back(v);
  }
}

/**
 * Finds the articulation points in an undirected graph `G`
 * of order`n` and size `m`
 *
 * Time complexity: O(n + m)
 * Space complexity: O(n)
 *
 * @returns {int} the number of articulation points
 */
int articulation_points() {
  int n = g.size();
  time_spent = 0;
  time_in.assign(n, -1);
  back.assign(n, -1);
  cut_vertex.clear();

  for (int i = 0; i < n; i += 1) {
    if (time_in[i] == -1) {
      dfs(i, -1);
    }
  }
  return cut_vertex.size();
}
