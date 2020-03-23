/**
 * Computes the values `x` and `y` for the equation
 *
 *    ax + by = gcd(a, b)
 *
 * Given that `a` and `b` are positive integers
 *
 * @param {int} a
 * @param {int} b
 * @param {int} x
 * @param {int} y
 * @returns {int} gcd(a, b)
 */
int extended_euclidean(int a, int b, int &x, int &y) {
  if (b == 0) {
    x = 1;
    y = 0;
    return a;
  }
  int x1, y1;
  int gcd = extended_euclidean(b, a % b, x1, y1);
  x = y1;
  y = x1 - a / b * y1;
  return gcd;
}

/**
 * Alternative version using a vector of ints
 * Computes the values x and y for the equation
 *
 *    ax + by = gcd(a, b)
 *
 * @returns {vector<int>} A triplet with the values (gcd(a, b), x, y)
 */
vector<int> extended_euclidean(int a, int b) {
  if (b == 0) {
    // base case:
    // b divides a so a(1) + b(0) = a
    return vector<int> {a, 1, 0};
  }
  vector<int> t = extended_euclidean(b, a % b);
  int gcd = t[0];
  int x1 = t[1];
  int y1 = t[2];
  return vector<int> {gcd, y1, x1 - a / b * y1};
}
