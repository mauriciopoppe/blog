/**
 * Computes the modular mutiplicative inverse of the number `a` in the ring
 * of integers modulo `m`
 *
 *    ax ≡ 1 (mod m)
 *
 * `x` only exists if `a` and `m` are coprimes
 *
 * @param {int} a
 * @param {int} m
 * @param {int} x
 * @returns {bool} True if the number `a` has a modular multiplicative
 * inverse, false otherwise
 */
bool modular_multiplicative_inverse(int a, int m, int &x) {
  // the value multiplying `y` is never used
  int y;
  int gcd = extended_euclidean(a, m, x, y);
  if (gcd != 1) {
    // `a` and `m` are not coprime
    return false;
  }
  // ensure that the value of `x` is positive
  x = (x % m + m) % m;
  return true;
}

/**
 * Same as above but throws an error if the `a` and `m` are not coprimes
 *
 * @param {int} a
 * @param {int} m
 * @returns {int} The modular multiplicative inverse of a
 */
int modular_multiplicative_inverse(int a, int m) {
  // the value multiplying `y` is never used
  int x, y;
  int gcd = extended_euclidean(a, m, x, y);
  if (gcd != 1) {
    // `a` and `m` are not coprime
    throw std::invalid_argument("a and m are not relative primes");
  }
  // ensure that the value of `x` is positive
  x = (x % m + m) % m;
  return x;
}
