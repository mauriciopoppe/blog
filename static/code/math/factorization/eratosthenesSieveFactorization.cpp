// let `p` be the smallest prime factor of the index `i`, each element
// contains a pair `(p, x)` such that `p^x` is a divisor of `i`
// e.g.
//
//    8 = (2, 3)
//    15 = (3, 1)
//    6 = (2, 1)
//
vector<pair<int, int> > lp;

void eratosthenes_sieve_factorization(long long n) {
  pair<int, int> unvisited(-1, -1);

  // (-1, -1) is an unvisited state
  lp.assign(n + 1, unvisited);

  for (int i = 2; i * i <= n; i += 1) {
    if (lp[i] == unvisited) {
      // if an index is in an unvisited state it's a prime number
      pair<int, int> base(i, 1);
      lp[i] = base;
      for (int j = i * i; j <= n; j += i) {
        if (lp[j] == unvisited) {
          // if a multiple of the prime number is in an unvisited
          // state that means that it's lowest prime divisor is
          // the current index `i`
          lp[j] = base;
          if (lp[j / i] != unvisited) {
            // `j` is a multiple of `i`, in fact `j = i^x` because
            // only numbers which don't have other factors but `i`
            // reach this point, to accumulate the powers it's enough
            // find out the power of `j / i`
            lp[j].second += lp[j / i].second;
          }
        }
      }
    }
  }

  // all the prime numbers > sqrt(n) will have an unvisited state
  // changing the unvisited state to prime_number^1
  int sqrtN = sqrt(n);
  if (sqrtN % 2 == 0) {
    sqrtN += 1;
  }
  for (int i = sqrtN; i <= n; i += 2) {
    if (lp[i] == unvisited) {
      lp[i] = pair<int, int>(i, 1);
    }
  }
}
