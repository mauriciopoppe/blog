struct edge {
  int u, v, weight;
  edge(int _u, int _v, int _w) {
    u = _u; v = _v; weight = _w;
  }
  // custom sort
  bool operator<(const edge &other) const {
    return weight < other.weight;
  }
};

vector<int> tree, size;

void initialize_sets(int n) {
  tree.resize(n);
  size.resize(n);
  for (int i = 0; i < n; i += 1) {
    tree[i] = i;
    size[i] = 1;
  }
}

int find_set(int element) {
  if (element != tree[element]) {
    tree[element] = find_set(tree[element]);
  }
  return tree[element];
}

void set_union(int x, int y) {
  int rx, ry;
  rx = find_set(x);
  ry = find_set(y);
  if (rx == ry) {
    return;
  }
  if (rx > ry) {
    size[rx] += size[ry];
    tree[ry] = rx;
  } else {
    size[ry] += size[rx];
    tree[rx] = ry;
  }
}

/**
 * An implementation of Kruskal's algorithm which computes
 * the minimum spanning tree of a graph `G`
 *
 * Time complexity: O(m log m)
 * Space complexity: O(m)
 *
 * @param {vector<vector<pair<int, int> > >} g The adjacency list representation
 * of a graph `G`, each entry `g_{ij}` holds a pair which represents an edge
 * (vertex, weight) which tells that there's an edge from `i` to `vertex`
 * with weight `weight`
 * @return {int} The weight of the MST
 */
int kruskal(vector<vector<pair<int, int> > > &g) {
  int n = g.size();

  vector<edge> edges;
  for (int i = 0; i < n; i += 1) {
    for (int j = 0; j < g[i].size(); j += 1) {
      int v = g[i][j].first;
      int weight = g[i][j].second;
      edges.push_back(edge(i, v, weight));
    }
  }

  initialize_sets(n);

  sort(edges.begin(), edges.end());

  int total = 0;
  for (int i = 0; i < edges.size(); i += 1) {
    int u = find_set(edges[i].u);
    int v = find_set(edges[i].v);
    if (u != v) {
      set_union(u, v);
      total += edges[i].weight;
    }
  }

  return total;
}
