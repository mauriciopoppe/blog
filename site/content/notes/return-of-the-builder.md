---
title: "Return of the Builder"
date: 2026-05-09 16:50:00
tags: ['career', 'ai', 'agents', 'software-engineering', 'productivity']
summary: |
  I think the cost of building things has changed a lot lately. For a while in my career, being an engineer meant spending more time on "alignment" and design docs than on actual code. But with the way agents are working now, I feel like we're going back to a time where the most important thing you can do is just build.
---

## The Cold Dinner

I became a software engineer because, deep down, I love building. For me, it has always been the ultimate way to express creative thinking while solving problems with a computer.

I first discovered this during my college years through the International Collegiate Programming Contest (ICPC). These competitions were challenging, but I loved the thrill. I'm a deep thinker, I can spend lots of time in front of a problem and face it.

I remember nights at home practicing in the University of Valladolid (uVA) problems and encountering a problem so interesting that would make me lose my ability of keeping track of time. My mom would sometimes bring dinner to my room and leave it on my desk. I'd be so deep in the problem, reading it, thinking about it and spending endless time thinking about it, that three hours would pass in what felt like minutes. I'd eventually make progress or solve it, look down, and realize my dinner was cold in the desk!

That's how deep I would go into these problems.

## Fundamentals

In my first job, I realized that being a deep thinker and solver is actually a big asset as a software engineer. I spent my time reading codebases, learning from my peers. Learning large codebases seemed natural simply because I'm used to spending time reading code and thinking about problems. Early in my career I knew that I had to learn fundamentals to be effective so I would spend lots of time reading Javascript manuals and know internals about how things work. I started doing frontend right at around the time when Promises were a new thing, I would implement them from scratch to know how they work and apply them to my projects at work. Because I focused a lot on my fundamentals that meant that I could adapt rapidly to new projects, onboard new libraries into our codebase, and bring new people up to speed into work.

Then in my next job, I landed a role in Silicon Valley (which I was very fortunate on). Here I learned about backend development and infrastructure, again I focused on fundamental skills and would keep on building new stacks, learning on every step of the way. Having a great manager helped a lot who supported me along the way in my explorations. I would still be a builder.

## Big Tech and Alignment

Then I joined Big Tech. This was where things took an interesting turn because in my starter project I applied the same type of work I did so far, I learned the problem and just "built" things. My starter project went smoothly, my tech mentor gave me a stellar review and here's where I got a very interesting "rating". My first feedback at big tech was: "your work was great, do you have any other artifacts besides your code?", my first review was about my "design doc."

In Big Tech, visibility depends not only on the code I would produce but on the "alignment" I would bring based on discussions in a design doc. I learned that as the problem becomes larger, features touch many components and impact the work of many teams, therefore it's important to bring them along the way and have their opinion on the work that you'll do. There's a very valid reason for this to exist and it's part of the culture in my company, one of our values is "respect the user" which translates into having a high quality bar for our deliverables, that's why a design doc is needed, to discover pros/cons of approaches, to consider stakeholders and get their opinion and "LGTM" on your proposal, so that your feature is polished before it's implemented. This exists because it was expensive to invest in a new project that requires time from design, PM, engineering. So, better to have a good plan before spending 6 months on it!

I got more trust on the work I'd do and lay the strategy for a small team, then I'd define where we should be at matching our PM's goals and PRDs, we'd think about the target customers, the opportunity, the edge cases, align with partner teams and stakeholders, etc. All of this meant that we started to move slowly because we not only depended on our work but on the work of others, reviews from other teams, alignment on roadmaps from other teams. The more I learned about it the more I had to play the game of politics with fellow co-workers including PMs, engineers and managers. I guess it's needed because that's part of growing in career in big tech right? So I'd keep on playing the game, learning from it.

## Working with Agents

Throughout last year, I started using agents and got to know their boundaries. I remember how I disliked vibe coding the first time I tried because the agent would do things I didn't want to do, so I kept myself in the loop. Something interesting is that I realized I tended to see the agent capabilities as a snapshot, I'd try a workflow and make some judgement based on the current state, unfortunately that also meant that I judged the tech from that narrow mindset and would avoid trying new things because I didn't think the agents were there yet.

Things changed in December with [conductor](https://github.com/gemini-cli-extensions/conductor). I tried it alongside other spec based agents and my view on agent capabilities changed so much! I realized that I could spend lots of time drafting the set of tasks, defining the boundaries of what I wanted to do and what I didn't want to do, then I'd enable YOLO during that period of time and things went so much better! I slowly trusted the agent more, slowly assigned larger work to the agent on larger tasks. Then the models got better and better and I realized I no longer needed strong guardrails, I'd create a tiny plan and yolo it at once.

Then [Autoresearch from Karpathy](https://github.com/karpathy/autoresearch) came, I tried and was amazed at how an agent could work in a loop guiding its own self to improve based on some metric defined by me and it would do this endlessly! That led me to learn about [Ralph loops](https://ghuntley.com/loop/) and harnesses and being "on" the loop instead of being "in" the loop. While I've been trying to keep myself up to date I feel that there's so much that's been happening in the agentic space while I was busy playing politics.

## The Return of the Builder

I recently watched a [interview to Cat Wu](https://www.youtube.com/watch?v=PplmzlgE0kg) (Head of Product for Claude Code at Anthropic) about how their product team moves faster than anyone else. It was an eye opener! It showed me that I've been playing the politics game for too long, attempting to show leadership with meetings, words, alignment docs instead of just being a builder who understands the market, the users, their wants and builds things for them.

This is a time for builders, I can build, I can have my team of agents build experiments super fast. If building things became easier then what's stopping me from doing that, alignment docs? product/design visions? Things have changed, and like Cat mentioned the boundaries between jobs are becoming fuzzy, roles are converging.

Then I realized it, I can develop a good taste of product by keeping myself as close as possible to customers and knowing what they want, I can be a PM for my team, I can be a designer for my team, in fact anyone in my team can wear that hat because the role is converging, all that we need is to try and learn by doing it.

I'm lucky that PM customer meetings are captured in emails, I realized that I can empower my team by ingesting these emails into NotebookLM and then we can interact with them as if they were our actual customers (because the emails capture the voice of the customer!). I can categorize the notes into tiers and have personas that represent them, then for every idea I can ask them to criticize my own ideas from their point of view while being brutally honest. With that I can wear the PM hat.

This means that the barrier to ship a new feature/product has shortened a lot. Anyone can come up with an idea, anyone can validate the idea by talking to an agent that represents the customer, anyone can build designs with the agents, anyone can spawn a swarm of agents to build the prototype and put it in the hands of customers as soon as possible to validate the idea, there's no need for large initial alignment beyond a small group of people that want to ship the feature/product, and there's nothing preventing me and my team to wear all the tech hats.

Deep down I've always been a builder, and I'm just happy that agents empower me to do what I like the most. I like this new phase of my tech career where I can be a builder again.
