/**
 * Computes the maximum power of `k` that is a divisor of `n!`
 *
 * @param {int} n
 * @param {int} k
 * @return {int}
 */
int max_power_in_factorial(int n, int k) {
  int ans = 0;
  while (n) {
    n /= k;
    ans += n;
  }
  return ans;
}
