# LinkedIn Draft: Article #2 · Queuing Theory for Systems Engineers

Status: draft

## Post

Article 2 in my Systems Performance Engineering series: Queuing Theory for Systems Engineers

Full article: https://mauriciopoppe.com/notes/queuing-theory-for-systems-engineers/

If a worker is busy only half of the time, the intuitive expectation is that most requests should start immediately. However, random arrivals make the result less obvious. Some requests arrive while the worker is idle, but others arrive during a burst while another request is still running. Those requests wait even though the worker will be idle again soon.

The article starts with a basic single-worker queue. Each request takes an average of 10 milliseconds to process, and requests arrive randomly. At 50% utilization, the average request waits 10 milliseconds before processing begins. That waiting time is equal to the request's own processing time, so the total average response time is 20 milliseconds, twice the processing time. As the worker approaches full utilization, a small increase in incoming traffic produces a much larger increase in waiting.

At 75% utilization, the same model predicts a distribution of queue states. If K is the number of requests ahead of an arriving request, the probability of seeing a particular K is 25% multiplied by 75% once for every request already ahead. That gives 25% for K = 0, about 19% for K = 1, and about 14% for K = 2. The average number of requests ahead is 75% divided by the remaining 25%, or 3 jobs. With 10 milliseconds of processing per job, that means 30 milliseconds of average queue wait followed by 10 milliseconds of processing, for a 40 millisecond total response time.

The video shows this distribution in the Monte Carlo simulator. The red bars are the theoretical probabilities. A single simulated arrival starts with a 36% flip, which is below the 75% utilization threshold, so one request is found ahead. The next flip stops the sequence, giving K = 1. Another arrival reaches K = 11, which is less common but still part of the same distribution, and another reaches K = 2, whose theoretical probability is about 14%.

After 500 simulated arrivals, the green bars begin to resemble the red theoretical bars. After a few more runs, roughly 3,000 arrivals have been simulated and the match becomes closer. The simulated mean is 2.97 jobs ahead. The theoretical mean is ρ/(1 − ρ) = 0.75/0.25 = 3 jobs, so the simulated value is close because a larger sample is converging toward the theoretical average.

The article then applies the same reasoning to service-time variance and resource pooling. The practical takeaway is to (1) keep enough spare capacity for bursts, (2) separate slow and highly variable work from latency-sensitive requests, and (3) place requests with similar processing times behind one shared queue. That queue can dispatch work to several interchangeable replicas instead of giving every replica a private queue that may leave capacity idle.

[Video: Monte Carlo Arrival Simulator at 75% utilization]

## Visual artifact brief

Record a short walkthrough of the hockey-stick explorer. Start at moderate worker utilization, move the load toward 90% and 99%, and show how response time grows sharply as the worker approaches full capacity. Then switch to the Monte Carlo Arrival Simulator and compare the observed number of requests found waiting with the theoretical distribution.

If there is room for a longer artifact, follow with the pooled-worker example: four isolated queues at 80% load produce much more waiting than one shared queue with four workers and the same total capacity. Keep the focus on the change in waiting time, not on reproducing every derivation from the article.

Suggested captions for the sequence:

1. A worker can be busy only half the time and still make requests wait
2. Average response time includes both waiting and processing
3. Waiting grows sharply near full utilization
4. Random arrivals create bursts
5. Slow requests delay fast requests behind them
6. A shared queue lets the first available worker help

## Iteration notes

- Lead with the 50% utilization example because it introduces the central intuition without requiring notation.
- Use the hockey-stick explorer first, then the Monte Carlo simulator, and finish with the pooled-worker diagram if the post supports multiple visuals.
- Keep the post intuitive and self-contained. Leave the queueing notation, derivations, variance calculations, and Erlang C formula in the article.
