// C++11
#include <random>

bool is_probably_prime(unsigned long long p, int iterations) {
  if (p == 2) {
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
    if (binary_exponentiation_modulo_m(a, p - 1, p) != 1) {
      return false;
    }
  }
  return true;
}
