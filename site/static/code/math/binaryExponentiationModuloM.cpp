/**
 *
 * Computes
 *
 *    a^k % m
 *
 * Given the fact that a^k can be computed in O(log k) using
 * binary exponentiation
 *
 * @param {int} a
 * @param {int} k
 * @param {int} m
 * @return {int}
 */
int binary_exponentiation_modulo_m(int a, int k, int m) {
  if (k == 0) {
    // a^0 = 1
    return 1;
  }

  if (k % 2 == 1) {
    return (binary_exponentiation_modulo_m(a, k - 1, m) * a) % m;
  } else {
    int t = binary_exponentiation_modulo_m(a, k / 2, m);
    return (t * t) % m;
  }
}
