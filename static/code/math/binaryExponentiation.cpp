/**
 * Computes
 *
 *    a^k
 *
 * Given the following facts:
 *
 * - if `k` is even then a^(2k) = (a^k)^2
 * - if `k` is odd then a^(2k + 1) = (a^k)^2 * a
 */
int logarithmic_exponentiation(int a, int k) {
  if (k == 0) {
    // a^0 = 1
    return 1;
  }
  if (k % 2 == 1) {
    return binary_exponentiation(a, k - 1) * a;
  } else {
    int t = binary_exponentiation(a, k / 2);
    return t * t;
  }
}

// iterative implementation
int binary_exponentiation(int a, int k) {
  int x = 1;
  while (k) {
    // analyze the i-th bit of the binary representation of k
    if (k & 1) {
      x *= a;
    }
    a *= a;
    k >>= 1;
  }
  return x;
}
