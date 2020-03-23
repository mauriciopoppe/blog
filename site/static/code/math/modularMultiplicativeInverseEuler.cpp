/**
 * Computes the modular multiplicative inverse of `a` in the ring
 * of integers modulo `m` using Euler's theorem,
 * it assumes that `m` is a prime number and that is relatively prime to `a`
 *
 *    a^{-1} ≡ a^{m - 2} (mod m)
 *
 * @param {int} a
 * @param {int} m
 * @returns {int} The modular multiplicative inverse of a
 */
int modular_multiplicative_inverse(int a, int m) {
  return binary_exponentiation_modulo_m(a, m - 2, m);
}
