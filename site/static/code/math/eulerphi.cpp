int phi(int n) {
  int result = n;
  for (int i = 2; i * i <= n; i += 1) {
    // if `i` is a divisor of `n`
    if (n % i == 0) {
      // divide it by `i^k` so that it's no longer divisible by `i`
      while (n % i == 0) {
        n /= i;
      }
      // all the multiples of `i` are coprime to n, the number of
      // multiples is equal to `i * k` <= n, therefore `k <= n / i`
      result -= result / i;
    }
  }
  if (n > 1) {
    result -= result / n;
  }
  return result;
}
