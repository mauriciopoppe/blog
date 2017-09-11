/**
 * Computes the value of `x` for the linear congruent system of equations
 *
 *    x ≡ a_1 (mod p_1)
 *    x ≡ a_2 (mod p_2)
 *      |
 *    x ≡ a_n (mod p_n)
 *
 * All the solutions are given by the expression `x + k · p_1p_2...p_n`
 * where `k` is an integer
 *
 * @param {vector<int>} a
 * @param {vector<int>} p
 * @return {int} A solution for the system if it exists
 */
int chinese_remainder(vector<int> &a, vector<int> &p) {
  x = 0;
  int product = 1;
  for (int i = 0; i < p.size(); i += 1) {
    product *= p[i];
  }
  for (int i = 0; i < a.size(); i += 1) {
    x += a[i] * modular_multiplicative_inverse(product / p[i], p[i]);
    x %= product;
  }
  return x;
}
