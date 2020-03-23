int number_of_divisors(int n) {
  int total = 1;
  for (int i = 2; i * i <= n; i += 1) {
    int power = 0;
    while (n % i == 0) {
      power += 1;
      n /= i;
    }
    total *= (power + 1);
  }
  if (n > 1){
    total *= 2;
  }
  return total;
}
