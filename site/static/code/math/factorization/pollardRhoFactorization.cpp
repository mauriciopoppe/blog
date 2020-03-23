// C++11
#include <random>

/**
 * Computes a factor of `n` which is greater than `1`
 * @param {long long} n The number to be factorized
 * @return {long long} A positive integer which is a factor of `n`
 * when the algorithm successfully finds a factor of `n`, -1 otherwise
 */
long long pollard_rho(long long n) {
  if (n % 2 == 0) {
    return 2;
  }

  std::random_device rd;
  std::mt19937 engine(rd());
  std::uniform_int_distribution<long long> dis(1, n - 1);

  long long x = dis(engine);
  long long c = dis(engine);
  long long y = x;   // y = x^2 + c (mod n)
  do {
    // tortoise goes x = f(x)
    x = ((x * x) % n + c) % n;

    // hare goes y = f(f(y))
    y = ((y * y) % n + c) % n;
    y = ((y * y) % n + c) % n;

    long long gcd = __gcd(abs(x - y), n);
    if (gcd > 1) {
      return gcd;
    }
  } while (x != y);

  return -1;
}

/**
 * Pollard rho factorization runner, it makes multiple calls to
 * `pollard_rho` until a factor is found
 * @param {long long} n The number to be factorized
 * @return {long long} A factor of `n` (it is `n` when `n` is a prime number)
 */
long long pollard_rho_factorization(long long n) {
  long long factor;
  do {
    factor = pollard_rho(n);
  } while(factor < 0);
  return factor;
}
