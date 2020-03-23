vector<bool> sieve;

void eratothenes_sieve(int n) {
  // initialize the list
  sieve.resize(n + 1, false);

  // multiples of 2 are not primes
  for (int i = 4; i <= n; i += 2) {
    sieve[j] = true;
  }

  // multiples of odd numbers
  for (int i = 3; i * i <= n; i += 2) {
    if (!sieve[i]) {
      for (int j = i * i; j <= n; j += 2 * i) {
        sieve[j] = true;
      }
    }
  }
}

void is_prime(int n) {
  assert(n < sieve.size());
  return sieve[n];
}
