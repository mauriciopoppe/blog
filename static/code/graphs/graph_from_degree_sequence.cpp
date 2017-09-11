bool graph_from_sequence(vector<int> &degrees) {
  int sum = 0;
  int size = degrees.size();
  for (int i = 0; i < size; i += 1) {
    sum += degrees[i];
    if (degrees[i] >= size || degrees[i] < 0) {
      // a vertice can have a maximum degree of n - 1
      // also none of the degrees can be negative
      return false;
    }
  }

  if (sum == 0) {
    // trivial case
    return true;
  }

  sort(degrees.begin(), degrees.end());

  // removing d_1
  int max_degree = degrees.back();
  degrees.pop_back();
  size -= 1;

  // subtracting 1 from the next d_1 elements
  for (int i = 0; i < max_degree; i += 1) {
    degrees[size - 1 - i] -= 1;
  }
  return graph_from_sequence(degrees);
}
