int sum_of_divisors(int n) {
  int total = 1;
  for (int i = 2; i * i <= n; i += 1) {
    if (n % i == 0) {
      int primePower = i;
      while (n % i == 0) {
        primePower *= i;
        n /= i;
      }
      // sigma(n^k) = (n^{k + 1} - 1) / (k - 1)
      total *= (primePower - 1) / (i  - 1);
    }
  }
  if (n > 1) {
    // if `n` is still a prime number after factorization
    // sigma(n) = 1 + n
    total *= (1 + n);
  }
  return total;
}
