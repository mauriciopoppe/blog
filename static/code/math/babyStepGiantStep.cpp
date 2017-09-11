/**
 * Let `a`, `b` and `n` be **integers**, where `a` and `n` are coprime,
 * the following is an implementation of Shank's baby step giant step
 * algorithm which attempts to find a solution for the congruence
 *
 *    a^x ≡ b (mod n)
 *
 * `x` can be represented as `im + j` then
 *
 *   a^j ≡ b(a^{-m})^i (mod n)
 *
 * NOTE: `binary_exponentiation_modulo_m` is a function which computes
 *
 *    a^x (mod n)
 *
 * @param {int} a
 * @param {int} b
 * @param {int} n
 * @returns {int} An integer >= 0 which is the value of `x`, -1
 * if no value was found
 */
int baby_step_giant_step(int a, int b, int n) {
  int m = ceil(sqrt(n));

  // values in the left side
  map<int, int> M;

  // store all possible a^j
  int aj = 1;
  for (int j = 0; j < m; j += 1) {
    if (!M.count(aj)) {
      M[aj] = j;
    }
    aj = (aj * a) % n;
  }

  // compute b(a^{-m})^i
  // first compute the modular multiplicative inverse of a
  int inverse;
  if (!modular_multiplicative_inverse(a, n, inverse)) {
    return -1;
  }
  int coef = binary_exponentiation_modulo_m(inverse, m, n);

  // NOTE: the modular multiplicative inverse can also be computed
  // using Euler's theorem only if `n` is prime
  // - first compute a^-1 with the identity a^-1 ≡ a^{n - 2} (mod n)
  // - compute inverse^m % n
  //
  // int coef = binary_exponentiation_modulo_m(a, n - 2, n);
  // coef = binary_exponentiation_modulo_m(coef, m, n);

  int gamma = b;
  for (int i = 0; i < m; i += 1) {
    if (M.count(gamma)) {
      return i * m + M[gamma];
    }
    gamma = (gamma * coef) % n;
  }
  return -1;
}
