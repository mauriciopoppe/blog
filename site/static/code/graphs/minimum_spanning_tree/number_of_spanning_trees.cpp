/**
 * Given a square matrix M of size (n x n) this method
 * computes the a matrix of size (n - 1) x (n - 1) by eliminating
 * the elements belonging to the `row` row of M and the `col`
 * column of M
 *
 * @param {vector<vector<int> > } m The square matrix
 * @param {int} row The row to be ignored
 * @param {int} col The column to be ignored
 * @return {vector<vector<int> >} the value of the determinant
 */
vector<vector<int> > minor(vector<vector<int> > m, int row, int col) {
  int n = m.size();
  vector<vector<int> > t(n - 1, vector<int>(n - 1));

  int trow = 0;
  for (int i = 0; i < n; i += 1) {
    if (i == row) {
      continue;
    }
    int tcol = 0;
    for (int j = 0; j < n; j += 1) {
      if (j == col) {
        continue;
      }
      t[trow][tcol] = m[i][j];
      tcol += 1;
    }
    trow += 1;
  }
  return t;
}

/**
 * Computes the determinant of an square matrix
 *
 * @param {vector<vector<int> > } m The square matrix
 * @return {int} the value of the determinant
 */
int determinant(vector<vector<int> > m) {
  int n = m.size();

  if (n == 1) {
    return m[0][0];
  }
  if (n == 2) {
    return m[0][0] * m[1][1] - m[1][0] * m[0][1];
  }

  int result = 0;
  for (int col = 0; col < n; col += 1) {
    vector<vector<int> > t = minor(m, 0, col);
    result += m[0][col] * pow(-1, col) * determinant(t);
  }
  return result;
}

/**
 * Computes the number of spanning trees in an undirected graph `G`
 *
 * @param <vector<vector<int> > > g The adjacency matrix of `G`
 * @return {int} The number of spanning trees
 */
int number_of_spanning_trees(vector<vector<int> > &g) {
  int n = g.size();
  vector<vector<int> > t = g;
  for (int i = 0; i < n; i += 1) {
    // -a_{ij} for elements that are not in the main diagonal
    int degree = 0;
    for (int j = 0; j < n; j += 1) {
      if (i != j) {
        t[i][j] *= -1;
        if (t[i][j]) {
          degree += 1;
        }
      }
    }

    // deg v_i for t[i][i]
    t[i][i] = degree;
  }

  // compute the (0,0) cofactor
  // c_{0, 0} = (-1)^{0 + 0} * determinant((0, 0) minor)
  //          = determinant((0, 0) minor)
  return determinant(minor(t, 0, 0));
}
