long long special_factorial_mod_p(long long n, long long p) {
  long long res = 1;

  // computation of c
  long long c = p-1;

  while (n > 1) {
    res = (res * binary_exponentiation_modulo_m(c, n / p, p)) % p;
    for (long long i = 2; i <= n % p; i += 1) {
      res = (res * (long long)i) % p;
    }
    n /= p;
  }
  return res % p;
}
