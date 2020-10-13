---
title: "Interview Preparation"
date: 2020-10-12 21:23:30
draft: true
---

## Before you start

Congrats! **Preparing** for an interview is a such a rewarding process, note that I said **preparing** for an interview instead of
acing it since passing the interview is a consequence of enough and good preparation, the process is rewarding because
you improve your ability to come up with a solution to an algorithmic problem in a short amount of time, this skill is what you actually 
need at work too so it makes sense that the interviews target this skill, also, the concepts that you learn when you're preparing for the 
system design interview are invaluable and will be helpful throughout your career.

My plan was to interview with my target top companies (Airbnb, Facebook, Google) at once and I wanted to do the onsites close to each other (with at
least one day to rest between interviews), I managed to schedule the 3 onsites in 2 weeks. This plan will contain notes that are applicable 
to any company as well as specifics for each company.

Understand that **there's a lot of luck involved in the interview process**, you may have prepared a lot but:
 
- you might get stage fright during the interview, you can decrease the anxiety effect with enough practice but I guess that this feeling will always be there
- you might be unable to make progress because the problem is too hard to solve because you didn't practice that topic enough or you just missed that small insight
- there might be an external factor that you can't control, for example your interviewer might be having a bad day or during the HC review there's someone that's a better fit for the position. 

You increase your chances of landing a job at a top company if you interview with more of them.

For stage fright just practice a lot either at pramp or with a friend that's experienced in interviews (highly recommended), 
the more you practice the better you'll become at communicating your solution as well as controlling the time, 
when I started I could come up with a solution for a coding problem but I'd present it in a disordered way, I'd explain the solution and start coding it right
away without realizing that I was solving the wrong problem or I'd talk too much without considering the time and I'd eat valuable time in the interview that I could
use for the follow up question or for tests, when I practiced system design interviews I'd jump across the system design
stages or I'd go way too deep into the detailed design when I was talking about the high level design. After I did enough mock
interview rounds with my friend I was able to correct these problems as well as come up with an ordered way to tackle each coding problem.

For hard problems always try to come up with examples, I got followup questions where I didn't have an idea of where to start
so after cycling through some data structures I decided to write some examples, then I could find a pattern and finally
the data structures and algorithms that would help me solve the problem. If you can't make progress ask for help! If you get
a good interviewer he/she might realize you need help but in any case keep this step as a last resort when you're completely stuck.

For external factors there's nothing that you can do, just focus your energy on the next interview instead of thinking what you could've done better
in a past one.

Finally my journey wasn't without failures, I failed multiple interviews with top companies, I was naive in the past and when I decided to 
interview I'd "put all of my eggs in one basket" and miserably fail but now I realize that the interview process gave me invaluable information that'd help me in my next attempts, 
if you fail it just means that you've failed that attempt, after all of your rounds reflect what you did good and bad and focus on improving 
that part for the next attempt.

<div class="columns is-mobile is-size-3">
<div class="column is-half is-offset-one-quarter">
<p><span class="quote-highlight">Luck</span> is what happens when <span class="quote-highlight">preparation</span> meets <span class="quote-highlight">opportunity</span></p>
<p class="has-text-right"><i>Seneca</i></p>
</div>
</div>

Getting an offer is not the end of the journey, it might be possible that even after you reach your target company and you
work there for some years you might look for new challenges in other top companies, the interview skill is something
that you should keep up to date. Good luck! 

## Summary

Before I wanted to interview (what you should be doing now)

- Do the daily leetcode challenge, it's an awesome way to keep the interview coding skill up to date
- Read/code/have experience in scalable systems, collect/read interesting papers and read the red book [Designing Data Intensive Applications](https://dataintensive.net/)

When I was ready to interview

- Contact the recruiters, schedule phone screens in 3 weeks
- Warmup: solve a few easy problems in leetcode, get familiarized with the STL ([if your programming language is C++ I have created a refresher article](/notes/computer-science/programming-languages/cpp-refresher/))
- Start solving medium type of questions and attempt to solve hard questions
- Buy leetcode premium and do a lot of mock interviews (at least 2 per day), force yourself to be in the session and don't exit prematurely, 
get into the habit of drawing examples in comments (when I interviewed there were only virtual onsites). 
- Do mockup interviews in leetcode, pair with a friend to do real 45m interviews
- Pass the phone interviews, schedule onsites in 4 weeks

### Coding

{{< interview who="all" >}}
My notes for any company:

- When you start focus for breadth, a nice schedule is described in the EPI book where you can find the problems that 
you should solve according to your timeline  
{{< /interview >}}

{{< interview who="airbnb" >}}
- They may ask a single LC Hard Question in the 45m interview, check the ones tagged with Airbnb in leetcode
- The code that you write MUST compile and run, make sure to know the libraries that you need to include 
{{< /interview >}}

{{< interview who="facebook" >}}
- One of their core values is move fast therefore they expect you to come up with a brute force solution and an
optimized solution pretty fast, practice for speed
- The coding platform is 
- They typically ask 2 easy to medium type of questions
{{< /interview >}}

{{< interview who="google" >}}
- Hardest one to practice, you may get an easy question that has a follow up that turns it into medium or hard, you
may also get a question with a nice story that's hiding a well known algorithm like sliding window
- Interviews used to be in google docs but now they have their own coding platform https://interview.google.com (the 
recruiting coordinator will give you unique links for each one)
- You can't run your code so make sure you check it once after you're done coding and before testing it and debug it
with some test cases
{{< /interview >}}

Interesting exercises:

- [Given a string N and a dictionary of words D, find if N can be created by concatenating words from D](https://leetcode.com/problems/word-break/description/)
- Given a tree find the longest path between any two leaf nodes
- [Find the next permutation of a list of numbers](https://leetcode.com/problems/next-permutation/description/)
- [Largest rectangle in histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)
- [Find the largest rectangle made out of ones in a matrix of ones and zeros](https://leetcode.com/problems/maximal-rectangle/description/)
- [Find the number of square submatrices filled with ones in a matrix](https://leetcode.com/problems/count-square-submatrices-with-all-ones/)
- [Given a binary tree find the maximum path sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/description/)
- [Sort a linked list in O(n log n) with O(1) space complexity](https://leetcode.com/problems/sort-list/description/)
- [The skyline problem](https://leetcode.com/problems/the-skyline-problem/)
- [Given an array and a sliding window of size k find all the minimum/maximum numbers in every window](https://leetcode.com/problems/sliding-window-maximum/description/)
- Given a list of integers, find the smallest consecutive set of integers that sums up to a given number k

### System design

### Low Level System Design

### Behavioral Questions
