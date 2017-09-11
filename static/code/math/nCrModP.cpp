long long nCr_mod_p(int n, int r, int p) {
  int a = max_power_in_factorial(n, p);
  int b = max_power_in_factorial(n - r, p);
  int c = max_power_in_factorial(r, p);
  if (a > b + c) {
    return 0;
  }

  return (special_factorial_mod_p(n, p) *
    ((modular_multiplicative_inverse(special_factorial_mod_p(n - r, p), p) *
    modular_multiplicative_inverse(special_factorial_mod_p(r, p), p)) % p) % p);
}
