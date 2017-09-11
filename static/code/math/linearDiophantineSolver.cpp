/**
 * Computes the integer values `x` and `y` for the equation
 *
 *    ax + by = c
 *
 * if `c` is not divisible by `gcd(a, b)` then there isn't a valid solution,
 * otherwise there's an infinite number of solutions, (`x`, `y`) form one pair
 * of the set of possible solutions
 *
 * @param {int} a
 * @param {int} b
 * @param {int} c
 * @param {int} x
 * @param {int} y
 * @returns {bool} True if the equation has solutions, false otherwise
 */
bool linear_diophantine_solution(int a, int b, int c, int &x, int &y) {
  int gcd = extended_euclidean(abs(a), abs(b), x, y);
  if (c % gcd != 0) {
    // no solutions since c is not divisible by gcd(a, b)
    return false;
  }
  x *= c / gcd;
  y *= c / gcd;
  if (a < 0) { x *= -1; }
  if (b < 0) { y *= -1; }
  return true;
}
