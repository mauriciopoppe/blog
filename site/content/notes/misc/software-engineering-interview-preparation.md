---
title: "Software Engineering Interview Preparation"
tags: ["interview", "system design"]
aliases:
  - /notes/misc/interview-preparation/
date: 2020-10-12 21:23:30
---

This interview preparation plan contains notes that apply to any company and specifics for my target companies.
I planned to interview with my target companies Airbnb, Facebook, and Google at once. I wanted to have the onsites close to each other (with at
least one day to rest between interviews) to maximize my chances to get into a big company.
I got excellent recruiters that helped me schedule the 3 on-sites in 2 weeks.
I was able to pass all of the Hiring Committees and got offers from Airbnb, Facebook, and Google.
Disclaimer: *This plan worked for me. It might or might not work for you*.

{{< figure src="/images/airbnb_facebook_google.png" title="Airbnb, Facebook, Google" >}}

## Before you start

**Preparing** for an interview is a rewarding, stressful, and exciting experience. Passing an interview could be the outcome of enough focused preparation
(luck is involved too, but I'll get to this shortly).
The process is stressful on every single stage from the first time you send your resume and wait for the automated program or the recruiter not to reject it
until the last day you negotiate your offer with your recruiter. However, the process is rewarding because you improve your problem-solving skills, also,
the concepts that you learn when you're preparing for the system design interviews are invaluable and will be helpful throughout your career.

**Luck is involved in the interview process**. You may have prepared a lot but:

- you might get stage fright during the interview, you can decrease the anxiety effect with enough practice, but I guess that this feeling will always be there
- you might be unable to make progress because the problem is too hard to solve because you didn't practice that topic enough, or you just missed that small insight
- there might be an external factor that you can't control; for example, you might not click with your interviewer, your interviewer might be having a bad day or
during the Hiring Committee review, someone dislikes something about your round even though all the interviewers gave you a positive score
 (as an anecdote [not even the Hiring Committee members are safe from themselves](https://youtu.be/r8RxkpUvxK0?t=530)).

You increase your chances of landing a job at a top company if you interview with more of them. It may seem obvious, but it
took me some courage to attempt more times because I was afraid of rejection,
it helped to switch my mentality to focus more on the preparation rather than the result.

For stage fright, practice a lot either at pramp or with a friend experienced in interviews (highly recommended),
the more you practice, the better you'll become at communicating your solution as well as keeping control of the time,
when I started, I could come up with a solution for a coding problem, but I'd present it in a disordered way, I'd explain a solution and start coding it right
away without realizing that I was solving the wrong problem or I'd talk too much without considering the time, and I'd eat valuable time in the interview that I could
use for the follow-up question or tests, when I practiced system design interviews, I'd jump across the system design
stages or I'd go way too deep into the detailed design when I talked about the high-level design. After I did enough mock
interview rounds with my friend, I corrected these problems and came up with a systematic way to tackle each coding and system design problem.

For challenging problems, always try to come up with examples. I got follow-up questions where I didn't know where to start,
so after cycling through some data structures and algorithms I'd write some examples, I'd find a pattern, and finally,
the data structures and algorithms that would help me solve the problem. If you can't make progress, ask for help! If you get
an excellent interviewer, he/she might realize you need help and give you hints but in any case, keep this step as a last resort when you're completely stuck.

For external factors, there's nothing you can do. Just focus your energy on the next interview instead of thinking about what you could've done better.

Finally, my journey wasn't without failures. I failed multiple interviews with top companies, I was naive in the past, and when I decided to
go for an interview I'd "put all of my eggs in one basket" (meaning interviewing only with one company at a time in years) and fail but
now I realize that the interview process gave me invaluable information that helped me in my next attempts,
if you fail, it just means that you've failed that attempt. After all of your rounds, reflect on what you did right and wrong and focus on improving
that part for the next shot.

<div class="columns is-size-3">
<div class="column is-half is-offset-one-quarter">
<p><span class="has-text-primary">Luck</span> is what happens when <span class="has-text-primary">preparation</span> meets <span class="has-text-primary">opportunity</span></p>
<p class="has-text-right"><i>Seneca</i></p>
</div>
</div>

Getting an offer is not the end of the journey. It might be possible that even after you reach your target company and you
work there for some years, you might look for new challenges in other top companies. The interview skill is something
that you should keep up to date. Good luck!

## Summary

*(If you haven't interviewed in the past and wanna get noticed)*

- If you're a student, enjoy the student lifestyle! Work on challenging projects that make you stand out from the rest.
In my case, I used to be a competitive programmer and was also really into creating my
projects for fun, [I managed to have a JS library featured in a magazine once!](https://javascriptweekly.com/issues/194),
([link to the project](https://mauriciopoppe.github.io/PojoViz/public/vulcanize.html#readme)).
- [Participate in Coding Contests](https://www.youtube.com/watch?v=ueNT-w7Oluw), I solved thousands of problems over the years;
my solutions are in [this repo](https://github.com/mauriciopoppe/competitive-programming).
- Google has this website called https://foobar.withgoogle.com/ (learn about it [here](https://medium.com/plutonic-services/things-you-should-know-about-google-foobar-invitation-703a535bf30f)).
When I was reading about web performance, I saw a pink button somewhere inside the [Web Fundamentals Rendering Performance Guides](https://developers.google.com/web/fundamentals/performance/rendering)
which led me to the foobar site, I solved 3 problems in python and got an interview invitation and then I solved the remaining 2 and got more invitations to give to friends.
- If you are working full-time, look for opportunities to work on challenging problems and show leadership, **take the chance, no pain, no gain**.
- Make sure your resume shines and aim for a 1-page resume, [here's the CV I used for this round (with my details removed)](https://www.overleaf.com/read/fvdmbqtskgsw).

Before looking to interview:

- Do the daily Leetcode challenge. It's a great way to keep the coding interview skill up to date
- Participate in Leetcode contests every Saturday, or Codeforces when it's available
- Read about or code scalable systems, read interesting papers and read the red book [Designing Data Intensive Applications](https://dataintensive.net/),
I focused a lot on this part since the last time I failed my previous onsite was because of system design.
- Get to know me and the places I'd like to work, check if my values match the company core values

{{< interview who="airbnb" >}}
I've been a fan of their engineering
blog ever since I saw this article [Rearchitecting Airbnb's Frontend](https://medium.com/airbnb-engineering/rearchitecting-airbnbs-frontend-5e213efc24d2),
moreover, I had the opportunity to use part of their work presented in [Dynein: Building an Open-source Distributed Delayed Job Queueing System](https://medium.com/airbnb-engineering/dynein-building-a-distributed-delayed-job-queueing-system-93ab10f05f99) at work,
also, the obsession for what "belong anywhere" means matches my core values. If you don't know what it means, I highly
recommend this [Ted talk by Joe Gebbia, one of the co-founders of Airbnb](https://www.ted.com/talks/joe_gebbia_how_airbnb_designs_for_trust?language=en) and
if you understand Spanish, listen to this [story by a writer that had a heart attack while staying at an Airbnb](https://www.youtube.com/watch?v=sVuMmcFu9uI)
{{< /interview >}}

{{< interview who="facebook" >}}
In the Facebook HQ you see their core values everywhere. One phrase that stuck with me in one of their buildings is *what would you do if you weren't afraid?*.
A few of my friends have been working there for a long time, Facebook's been one of my target companies for a while, [their engineering blog](https://engineering.fb.com/) is filled with
so many gems across multiple fields. As a Frontend developer, I learned a lot from [Browserlab](https://engineering.fb.com/web/browserlab-automated-regression-detection-for-the-web/)
whose infrastructure design I used as inspiration in a project I did at work with [WebPagetest](https://www.webpagetest.org/).
{{< /interview >}}

{{< interview who="google" >}}
I use a lot of Google products every day, and I admire their high quality. Google's always setting standards in engineering in the industry
and ensuring that their research is available to the world. Many companies, including mine, have benefited from all the open-source projects they
produce/support. [Kubernetes](https://kubernetes.io/) is the core component in many companies' infra, and it looks like a magic box to the engineers that use it.
{{< /interview >}}

NOTE about picking your companies: I only interviewed with the companies I wanted to work for, which is risky. Another strategy is to apply to all the top
companies hoping to get multiple offers, which helps during the negotiation phase. During my preparation, I watched videos from various founders
from all of the top companies and discovered that I'd like to work at [Stripe](https://www.youtube.com/watch?v=NprBQi0cSHU) too.

When I was ready to interview

- Contact the recruiters, schedule phone screens in 3 to 4 weeks. More time to prepare for the phone screen is risky
because I'll burn out even before practicing the system design questions.
- Practice only coding for the phone screens. The plan is detailed below.
- After the phone screen interviews, schedule on sites in 4 to 6 weeks (I did 4 weeks), I also ensured that the onsites
were as close as possible to a target date with enough breathing room to rest.
- Practice mainly system design and coding to a less extent, give yourself enough breathing room not to burn out.
- Practice behavioral types of questions. Each company has its way to assess this part that's described below.
- Go through the onsites, get to a mental state where you're ready for the next interview regardless of the outcome of the previous round.
- Receive feedback from the recruiters and the HC, go through the team matching interviews if you passed the HC, remember that **you don't have an offer yet**.
- If you get offers, learn to negotiate, read [Salary negotiation strategies everyone in tech already knows — but you don't](https://candor.co/guides/salary-negotiation), [How I negotiated a \$300,000 job offer in Silicon Valley](https://medium.com/@bayareabelletrist/how-i-negotiated-a-software-engineer-offer-in-silicon-valley-f11590f5c656), and/or
get professional help.
- If you don't get an offer, learn from your mistakes, and move on, you'll have enough time to reflect and think about the plan for the next attempt.

## Coding

### Phone screen preparation

{{< figure src="/images/epi-ctci.webp" title="The standard coding interview books" >}}

- My phone screen preparation took 3 to 4 weeks, warmup for the 1st week: solve a few easy/medium problems in Leetcode, remember the STL ([if your programming language is C++ I have a refresher article](/notes/computer-science/programming-languages/cpp-refresher/)).
- Focus on breadth, a nice schedule based on your timeline can be found in the EPI book, then pick problems from your weakest area.
- Practice EPI questions. I've already read EPI multiple times, so I just had to review their intro for each chapter's STL methods and glance
through the problems and the solutions. To practice and test if your implementation works, use the [EPI Judge](https://github.com/adnanaziz/EPIJudge).
Start solving medium-type questions and target hard questions in Leetcode, review medium questions that you may have solved in the past,
and study how other people solved it (you'll learn something new every time).
- Go through this list of patterns: [Important and Useful links from all over Leetcode](https://Leetcode.com/discuss/general-discussion/665604/important-and-useful-links-from-all-over-the-Leetcode).
It's by far the best source of knowledge and problems to solve for your preparation.
- Participate in the weekly Leetcode contest every Saturday at 7:30PM PT.
- Buy Leetcode premium and do a lot of mock interviews (at least 2 per day), force yourself to be in the session and don't exit prematurely,
get into the habit of drawing examples in comments (when I interviewed, there were only virtual onsites).

Here's an example of what I'd do in my head and code, say what you're thinking out loud. Your thought process might
make you come up with a strategy or might help the interviewer guide you if you're stuck

{{< interview-example >}}

Example Problem: [1105. Filling Bookcase Shelves](https://leetcode.com/problems/filling-bookcase-shelves/)

We're given an array of books represented as `[width, height]` and a parameter `shelf_width`.
We want to accumulate consecutive books on the shelves of a bookshelf. The sum of the widths of the books must not be greater than the input `shelf_width`.
The height of a single shelf is the max height across all the books on the shelf. We're looking to minimize the bookshelf's total height,
which is the sum of all the max heights across all of the shelves.

```text
Input: books = [[1,1],[2,3],[2,3],[1,1],[1,1],[1,1],[1,2]], shelf_width = 4
Output: 6
```

I'm trying to understand why the output is 6, I think I'd get 6 if I do:

```text
[
   [1,1],                         sum(width) = 1, max height = 1
   [2,3], [2,3]                   sum(width) = 4, max height = 3
   [1,1], [1,1], [1,1], [1,2]     sum(width) = 4, max height = 2
]
sum(max height) = 6
```

**Question**: is it possible to have a book whose width is greater than `shelf_width`?

**Answer**: not possible

**Question**: it looks like I could have several solutions whose output is the optimal value. I guess we're only interested
in the sum of the max heights and not in the location of each book right?

**Answer**: yes, not interested in the location of the books, just in the height of the bookshelf

**Question**: is it possible for the sum to overflow `int`?

**Answer**: no, the answer fits inside an `int`

----

**Possible greedy strategy**: It looks like I can solve it with a greedy strategy if take items from right to left (i.e., starting at the bottom)
and I can keep accumulating books until I get enough books for the current shelf whose sum doesn't go beyond `shelf_width` e.g.

```text
(reversed order e.g. bottom to top)
[
    [1,2], [1,1], [1,1], [1,1]
    [2,3], [2,3],
    [1,1]
]
```

**Possible question that I might get asked**: is this greedy strategy going to work for all the cases? Is there an example where it fails?

**My answer**: I'll think about a case that might break the greedy solution, the case that breaks it is:

```text
books = [5,5], [2,5], [2,2], shelf_width = 7

[
    [2,2], [2,5]
    [5,5]
]
```

In the case above, I'd take `[2,2], [2,5]` in the last row and `[5,5]` in the first one with a total height of 10; the optimal is 7
so I think that the greedy approach won't work.

**Brainstorm brute force**: For a brute-force solution, I'd put some books on a shelf and then attempt to put the remaining books
in the next shelf and so on recursively, in the recursion, I'd have a parameter `i` that would tell me where to start in the array
of books, to decide how many books I can put on a shelf I'd also need an accumulator that keeps track of the current width sum

**Optimized brute force width dp**:
I see that the solution above will create cases where we're trying to solve the problem with the same parameters
again, I think we can use DP, and the recurrence would be:

```text
T(i) = min(max(height[i], height[i+1], ..., height[i+k]) + T(k + 1))   from i = 0 up to i = books.size()
T(books.size()) = 0
constraint for T(i): sum(width[i], width[i+1], ..., width[i+k]) <= shelf_width
```

The time complexity would be `O(mn)` where `m` is a variable whose value depends on how many books I can put on a shelf,
I think that in the worst case it could be `n` so overall, it's `O(n^2)`.

The space complexity would be `O(n)` because we're storing a solution for every index of the books' array.

**Question for the interviewer** Do you think that this algorithm would work? I don't know what's the max value of `n`?

**Possible answer** Yes, it'll work, `n` is small enough so that an `O(n^2)` algorithm works.

---

Finally, you can code it and test it, make sure you review your implementation before testing as you may find variables
that are invalid or small logic errors

<style>
.language-cpp {
    border: none !important;
}
</style>

```cpp
class Solution {
public:
    int minHeightShelves(vector<vector<int>>& books, int shelf_width) {
        const int INF = 1e9;
        vector<int> dp(books.size(), INF);

        function<int(int)> solve = [&](int i) -> int {
            if (i == books.size()) return 0;
            if (dp[i] != INF) return dp[i];
            int max_h = 0;
            int acc_width = 0;
            int j = i;
            while (j < books.size() && books[j][0] + acc_width <= shelf_width) {
                acc_width += books[j][0];
                max_h = max(max_h, books[j][1]);
                dp[i] = min(dp[i], max_h + solve(j + 1));
                ++j;
            }
            return dp[i];
        };

        return solve(0);
    }
};

/*

T(0) =
        [1,1] + T(1)
        [1,1], [2,3] + T(2)

T(1) =
        [2,3] + T(2)
        [2,3], [2,3] + T(3)

T(2) =
        [2,3] + T(3)
        ... this path would take the incorrect branch
*/

```

Then compute the last `T(x)` (the ones closer to the end of the array) and propagate the values up the stack.

Come up with additional tests if you have time, probably you can handle edge cases like what if the array is empty too.
If you get [a good question](https://youtu.be/r8RxkpUvxK0?t=1798), the above will not be enough, and you might have a
followup question where you attempt to solve the problem with less space or with better time complexity.

{{< /interview-example >}}

- Also, go through the questions sorted by company. Depending on the company, you might get asked questions from their
pool, don't memorize questions; instead, learn the techniques used in each problem.
- Master Big O notation and understand [the time/space complexity of all the data structures that you might use](https://www.bigocheatsheet.com/), big focus here on the differences between
a `map`, `unordered_map`, `set`, `unordered_set`, `multiset`, `priority_queue`, `queue`, `stack`, `vector`, etc. Also master Big O for recurrences (you can derive the master
theorem so you don't need to memorize it, [learn how to solve recurrences by making a guess and proving your guess by induction or by unrolling the recurrence](https://courses.engr.illinois.edu/cs473/sp2010/notes/99-recurrences.pdf))
- **Pair with a friend and do 45 minute interviews. Take turns to interview each other**, this, in my opinion, is the best way to prepare because you're doing what you're supposed to do in an interview.

### Onsite preparation

- After the phone screen interviews, schedule the onsites in 4 to 6 weeks (I did 4 weeks)
- Pick new problems based on how weak I felt in the patterns shown in the [leetcode master link](https://Leetcode.com/discuss/general-discussion/665604/important-and-useful-links-from-all-over-the-Leetcode),
I discarded some problems that had a bad thumbs up/thumbs down ratio
- Pick LC solved problems (medium and hard) and review my solutions if I did them recently.
If I solved them a long time ago, redo them, read explanations by other coders in the discussion tab.
- Do mock interviews again and again. I eventually went through all the onsite mock interviews for Google and Facebook
- Participate in the weekly Leetcode contest

Some additional notes for each of my target companies

{{< interview who="airbnb" >}}
- They may ask a single LC Hard Question in the 45m interview, check the ones tagged with Airbnb in Leetcode
- The code that you write MUST compile and run with test cases that you prepare. Make sure to know the libraries
that you need to include in your file to compile your code
{{< /interview >}}

{{< interview who="facebook" >}}
- One of their core values is `move fast` therefore, they expect you to come up with a brute force solution and an
optimized solution pretty fast, practice for speed.
- The coding platform is coderpad with their logo watermark
- You can't run your code, so make sure you check it once after you're done coding and before testing it and debug it
with some test cases
- They typically ask 2 LC easy to medium type of questions. It might be possible that you run out of time explaining
your approach! As I said, practice for speed.
{{< /interview >}}

{{< interview who="google" >}}
- Hardest one to practice because of how unpredictable it is. You may get a warmup question that has a follow up that turns it into medium or hard.
You may also get a problem with a nice story hiding a well-known algorithm like sliding-window.
- Interviews used to be in google docs, but now they have their proprietary coding platform https://interview.google.com
(the recruiting coordinator will give you unique links for each one).
- You can't run your code, so make sure you check it once after you're done coding and before testing it and debug it
with some test cases.
- You may need to do back of the envelope calculations in the coding section too, make sure you understand the [memory layout
of a program](https://gabrieletolomei.wordpress.com/miscellanea/operating-systems/in-memory-layout/).
It could help you estimate the memory required for your program in a real-life scenario.
- For the followups that you won't be able to solve because of the time limit, get into the habit of expressing your ideas
clearly in typed text. I don't know if these notes are used by the Interviewer or read by the HC, for example:
  - **Interviewer**: The solution you proposed should work fine. How would you modify your algorithm so that it runs faster if there are no resource constraints?
  - **You**: I can improve the performance of my algorithm by using multiple threads doing X,
  or I can parallelize the work by using map reduce where the map function is M and the reduce function is R.
{{< /interview >}}

### About practicing with someone

Practicing with someone and taking turns is the best way to get used to the interview environment.
To practice, I used this template with a friend: [Google Docs template](https://docs.google.com/document/d/1TKNUaBdgzEoPaD8LNexz9JlquRKc1ZSBnNJuZmhFp4Y/edit?usp=sharing)

### About the post onsite hype

After going through 5 rounds in an onsite I'd feel that I've nailed the interview.
In reality, your performance might be around average or even below average; you never know.
If you're doing multiple onsites consecutively, **expect the worst but hope for the best**,
don't let the hype felt after an onsite impact your performance on the next one!

### Reading list

Interesting Problems + Hints:

- [Google Docs - Coding Interview Notes](https://docs.google.com/document/d/10DrjF-C73AnuPwvLC2yJiiiBYJV9pXtphC20x86--rM/edit?usp=sharing)

Sites to practice:

- [Leetcode](http://leetcode.com/), I have a university discount, so I got the premium for a year for 99$. The LC contests start on Saturdays at 7PM PDT
- [Binary Search](https://binarysearch.com/), high-quality problems too, the contests start on Saturdays at 11AM PDT
- [Codeforces](https://codeforces.com/), if you like harder problems, then try Codeforces. I think the Div2 A, B, and C problems
are similar to what you'd get in an interview

Books:

- [Elements of Programming Interviews](https://www.amazon.com/Elements-Programming-Interviews-Insiders-Guide/dp/1479274836) - Standard resource
- [Competitive Programmer's Handbook](https://cses.fi/book/book.pdf) - This may look advanced for the interviews, but chapters 6 (Greedy Algorithms)
, 8 (Amortized Analysis), 10 (Bit Manipulation), 26 (String Algorithms) have techniques commonly used in coding interviews.
- [Cracking the Coding Interview](https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850) - Great resource. I like
how problems are solved in EPI more, though.

## System Design

System design interviews are very unpredictable. You could practice a lot, but the problem you may get touches a point that you've never seen before,
so you have to develop something based on your experience. If you're targeting L5+ at Google and Airbnb or L4+ at Facebook you'll have at least one System Design interview.

### Acquiring knowledge

- Watch all the videos from the [MIT 6.824 Distributed Systems](https://pdos.csail.mit.edu/6.824/schedule.html) course and **do the labs**,
this resource helped immensely during the team matching phase at Google, where I had a chance to show what I learned
and how I could be useful to the team,
my favorite lectures: [all the Raft ones](https://thesquareplanet.com/blog/students-guide-to-raft/) and how Facebook uses Memcached.
- Watch tons of presentations about how big companies solve problems at scale; my links will be below
- Learn algorithms and data structures used in distributed systems; my links will be below
- Read [the cloud design patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/) for building reliable, scalable, secure applications in the cloud.
- If you're a full-time Software Engineer, then ask your manager for more challenging problems.
I'm honored to have had a fantastic manager who genuinely cared about me in my previous company and helped me work on big projects
where I had the chance to learn and grow. That was one of the reasons why I stayed there for so long.

### Onsite preparation

- Learn how to use google drawings, [this is my google drawings template](https://docs.google.com/drawings/d/11GQ_JBU5AH9BV40BulAuFIv66CexIad1zalG26OzZh4/edit?usp=sharing) and
 [this is an example of how I used it](https://docs.google.com/drawings/d/1PbxOaBTwC3BfTMpZx9WtRmoSnWfMM5cmCSAT5mrqODA/edit?usp=sharing)
- Master the structure of the interview, [I followed this system design template](https://leetcode.com/discuss/career/229177/My-System-Design-Template)
- Define functional and non-functional requirements, don't make too many assumptions, and if you do say them out loud,
so your interviewer is aware of this, big focus on mentioning tradeoffs

{{< interview-example >}}
> Design a system that does X and handles REQ requests doing W writes and R reads

- What are the most critical features?
- Daily active users, traffic volume, read/write ratio?
- Are these writes in single/multiple regions?
- Access patterns, even load vs. spikes throughout the day?
- Latency requirements, tradeoff fast reads for slow writes?
- Data consistency, eventual vs. strong consistency

---

> Design a chat system where users send and receive messages in real-time

(after talking about the functional and non-functional requirements)

The client can use the following approaches:

- **polling**, here the client will periodically make requests at some fixed rate like every 30s, the disadvantage
is that every time we're creating a new connection and wasting server resources because we might not have
any message to send or receive.
- **long polling**, this approach is similar to polling. However, we keep the connection open and wait for the
server to send some data across the wire, as soon as we receive data, we reopen/create a connection
- **web sockets**, in this approach, we keep the connection open since web sockets connections are persistent and made
for bidirectional communication, for the application protocol, it could depend on the devices we'll use for the chat system, if
it's a battery-powered device, then the overhead of the XMPP protocol is the fact that the device has to parse XML, which could be detrimental to the battery life,
instead, the MQTT protocol is designed to use bandwidth and battery sparingly. At the same time, the
XMPP protocol is extensible and adaptable that we could use if we want additional functionality like bots.
{{< /interview-example >}}

- Do some [back of the envelope calculations](/notes/computer-science/system-design/back-of-the-envelope-calculations/) if needed,
always clarify with your interviewer. This step is crucial at big
companies where you need to design for scale and think about capacity planning before you design your system,
[I have created an article with exercises and estimates that could be helpful](/notes/computer-science/system-design/back-of-the-envelope-calculations/),
 I've taken this example from [Gaurav Sen's awesome course on system design](https://interviewready.io/)

{{< interview-example >}}
> We're going to design an email server for 2B users, when a user sends an email it can attach files with a size up to 1MB,
> How much storage do we need per day to store emails?

Let's say each email has 200 characters, on average. A user receives emails from useful connections, companies and spam.
Assume 20 spam emails, 20 marketing emails and 10 useful emails, per user per day.

```text
Email data = Emails * Characters * Users
           = 50 * 200 * 2B
           = 20 TB

Attachment data = number of emails with attachments * average attachment size
                = 5% of all emails * 1 MB
                = 5% * 50 * 2B * 1 MB = 5 PB
```

So the total space requirement is `Email data + Attachment data = 20TB + 5 PB` per day.
This is a naively optimistic estimate, since we must account for redundancy (to improve performance and fault tolerance).
`Estimated total space requirement = (20TB + 5 PB) * 3 ~ ​15PB per day`.
{{< /interview-example >}}

- Define the API (signature, inputs, outputs) and the data model. I moved between these two back and forth during the interview
- High-level design, make sure that your design covers all the functional requirements, don't go too deep here, or you'll waste invaluable time
- Pick a component (alternatively, the interviewer may pick it for you) and then explain why you need it; big focus here again on tradeoffs
- Since this is a design for scale, you'll need to split processing or data into multiple machines, learn how to handle failures at scale
- If you have time, talk about things you'd do to maintain the system, including monitoring and security.

### Low level system design

For senior levels L5+ you might encounter questions involving designing and coding the internals of a class.
This type of question is more of a coding question than a system design question, but you should be aware of the tradeoffs you make at every stage in your design.

If you haven't taken any Operating Systems class, I recommend the [Graduate Introduction to Operating Systems by Georgia Tech](https://omscs.gatech.edu/cs-6200-introduction-operating-systems),
I'm in grad school as I write this, and I recently took this class. Unfortunately, the labs aren't public, but the
material is nevertheless a great introduction.

I'd suggest you learn about mutexes, condition variables, atomics, readers-writers, boss-worker model, pipeline model, cache lines, and so many others!
Also, read and attempt to implement the following classes from scratch, either with C++ 11 Multithreading primitives or pthreads.

- Semaphore
- Threadpool - [I implemented a threadpool in my Cpp refresher algorithm](/notes/computer-science/programming-languages/cpp-refresher/#multithreading)
- Thread-safe dictionary, queue, stack, and priority queue
- Parallel sort
- Multithreaded crawler
- Distributed key-value store - [MIT's Distributed System course has a lab on it](https://pdos.csail.mit.edu/6.824/labs/lab-raft.html)
- Distributed file system - The Georgia Tech Graduate Introduction to Operating Systems course's Project 4 is all about this.

Resources:

- [Graduate Introduction to Operating Systems by Georgia Tech](https://omscs.gatech.edu/cs-6200-introduction-operating-systems)
- [Concurrent Programming with C++](https://www.youtube.com/playlist?list=PL5jc9xFGsL8E12so1wlMS0r0hTQoJL74M) -
Excellent intro to multithreading concepts and primitives, a perfect mix of theory and practice.
- [Back to Basics: Concurrency - Arthur O'Dwyer - CppCon 2020](https://www.youtube.com/watch?v=F6Ipn7gCOsY) - Overview of modern concurrency in C++ 11.
- [Chapter 19 in EPI](https://www.amazon.com/Elements-Programming-Interviews-Insiders-Guide/dp/1479274836/)
- [CPU Caches and Why You Care](https://www.youtube.com/watch?v=WDIkqP4JbkE) - Fantastic introduction to cache lines. I learned
more about data locality and that having more threads will not always improve your program's performance as you thought it would.
- [Gaurav Sen's System design course](https://get.interviewready.io/) - In addition to system design questions, it also has low-level design problems.

### Reading list

These are my notes about interesting tech

- [Non Functional requirements](/notes/computer-science/system-design/non-functional-requirements/)
- [Partitioning](/notes/computer-science/system-design/partitioning/)
- [Cassandra](/notes/computer-science/system-design/cassandra/)
- [Kafka](/notes/computer-science/system-design/kafka/)
- [Back of the Envelope calculations](/notes/computer-science/system-design/back-of-the-envelope-calculations/)
- [Data Structures for Massive Datasets](/notes/computer-science/data-structures/data-structures-massive-datasets/)
- [Knowledge repository with links to interesting tech](https://docs.google.com/document/d/1sqI-Pf52GvzC08ZXHROt48bQYiabOUa2RXIO46vkxsc/edit?usp=sharing)

List of books

- [System design Interview - Alex Xu](https://www.amazon.com/System-Design-Interview-Questions-Solutions-ebook/dp/B08B3FWYBX) -
My favorite book about system design interviews, it covers the system design interview structure and has many real life examples.
What I really like about this is the focus on tradeoffs, it has 4 different rate limitting algorithms and all of them are valid,
having the ability to demonstrate why you picked a solution over others is what the interview is about.
- [Web Scalability for Startup Engineers - Artur Ejsmont](https://www.amazon.com/Scalability-Startup-Engineers-Artur-Ejsmont-ebook/dp/B00ZPS4KI0/) -
Great intro to all of the components in a complex web application
- [Distributed Systems for Practicioners - Dimos Raptis](https://leanpub.com/distributed-systems-for-practitioners) -
The why behind a technology and use cases in the industry, I liked the way it's structured with the theory first and then practice.
- [Designing Data Intensive Applications - Martin Kleppmann](https://dataintensive.net/) -
Deep into how distributed systems work, I think this is a standard resource by now.

List of courses:

- [Grokking the system design interview](https://www.educative.io/courses/grokking-the-system-design-interview) - Standard resource
- [System Design Primer](https://github.com/donnemartin/system-design-primer) - Standard resource
- [System Design Interview – Step By Step Guide](https://www.youtube.com/watch?v=bUHFg8CZFws) - Amazing youtube channel for system design interviews
- [Gaurav Sen's System design course](https://get.interviewready.io/) - Perfect resource to learn about making iterations over time in your design and to do back of the envelope calculations

## Behavioral Questions

Google and Facebook have 1 behavioral round, and Airbnb has 2 behavioral rounds. For this part, Cracking the Coding interview helped a lot.

- your level inside the company is based on your answers to this round. Talk about your leadership skills!
- learn to introduce yourself; you might do this in some coding rounds too. A must for the team matching phase at Google or Airbnb, the template that I use is:

> Hello, my name is `{your name}` and I'm a software engineer at `{current company}` where we do `{description of the product}`,
> I'm currently working on `{project A doing front-end, back-end, infra, ml, etc.}`. In the past, I worked at `{previous company}` where I did `{more projects}`.
> On the side, I'm doing `{school coursework or extracurricular activities}`, and my next objective is to achieve `{objective in the short term}`.

- learn about STAR, create a grid with questions, projects, and answers for each one
- practice with a friend. I'm friends with an awesome googler that helped me a lot here with mock interviews, we practiced many times, and he noticed that my
answers were not specific enough or were not structured pretty well. To improve, I wrote down my answers to all of these questions and rehearsed them many times:
  - Tell me about a challenging project
  - What did you enjoy learning the most?
  - Tell me about a time you had a conflict of priorities with your manager
  - Tell me about a time you made a mistake
  - Tell me about a time you had to make a difficult decision
  - Tell me how you solved an unambiguous task at work
  - What are the qualities of a good leader, according to you?

{{< interview who="airbnb" >}}
A special note about Airbnb, they do care about the culture fit more than anyone, spend some time understanding what `belong anywhere` means,
I watched a lot of interviews with Brian Chesky, which helped me solidify my willingness to work at Airbnb [(6 golden rules)](https://www.youtube.com/watch?v=jgPYSogOOTY),
On the onsite, you have 2 behavioral rounds with questions that can be found here: https://candor.co/interviews/airbnb; the most important ones are

- **What does belonging mean to you? What is your understanding of Airbnb culture?**
- **Why Airbnb?**

Make sure you practice some of these even before you apply to Airbnb. The recruiter wants to know if you're genuinely interested in Airbnb
{{< /interview >}}

{{< interview who="facebook" >}}
They have a behavioral round of 30m with common behavioral questions and an easy coding question at the end. Read this article
about [Ramping Up a Senior Software Engineer](https://jdxcode.com/posts/2020-09-16-10-tips-ramping-up-as-a-senior-engineer/)
{{< /interview >}}

{{< interview who="google" >}}
Pure behavioral round, if you're targeting L5+ show that you're a leader!
{{< /interview >}}

## The end?

<div class="columns is-size-3">
<div class="column is-half is-offset-one-quarter">
<p>Success is not final, failure is not fatal, it is the courage to continue that counts.</p>
<p class="has-text-right"><i>Winston Churchill</i></p>
</div>
</div>

Regardless of the outcome, enjoy the experience!
