// C++11
#include <random>

bool miller_rabin_primality_test(long long a, long long n) {
  int s = 0;
  long long q = n - 1;
  while (q % 2 == 0) {
    q /= 2;
    s += 1;
  }
  long long m = binary_exponentiation_modulo_m(a, q, n);
  if (m == 1 || m == n - 1) {
    // base case a^q ≡ 1 (mod n)
    return true;
  }
  for (int i = 0; i < s; i += 1) {
    // a^{2^iq} (mod n)
    m = (m * m) % n;
    if (m == n - 1) {
      return true;
    }
  }
  return false;
}

bool is_probably_prime(long long p, int iterations) {
  // NOTE: test of the primes 2 and 3 because of
  // the distribution limits (p, p - 2)
  if (p == 2 || p == 3) {
    return true;
  }
  if (p % 2 == 0 || p == 1) {
    return false;
  }
  std::random_device rd;
  std::mt19937 engine(rd());
  std::uniform_int_distribution<long long> dis(2, p - 2);
  while (iterations--) {
    // choose an integer between 2 and n-2
    long long a = dis(engine);
    if (!miller_rabin_primality_test(a, p)) {
      return false;
    }
  }
  return true;
}
