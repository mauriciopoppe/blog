---
title: Productivity
summary: |
  I try to improve my productivity every day to get better use of my time. This article summarizes my day-to-day productivity framework and how it has evolved from traditional multitasking and manual terminal tools to modern workflows using AI agents. These are divided into: getting used to multitasking, having time for deep focus, managing emails, task management, note retrieval with NotebookLM, deep research, and development tools.
tags: ['life', 'software engineer', 'task management', 'time management', 'productivity', 'ai', 'agents', 'notebooklm']
image: /images/productivity-skills.jpeg
date: 2022-05-11 21:16:00
lastmod: 2026-05-23 18:11:00
---

## Getting Used to Multitasking

Multitasking is a skill that I try to get better at to better use my time. While it may seem detrimental to my performance because I'm not completely focused on a task, I believe that there are situations where being able to do a mental context switch[^1] can save you a lot of time.

As you start growing in your career, your scope will increase, as well as the amount of knowledge that you have. You'll participate in more meetings for many different topics that you'll have to juggle in your head. With lots of opportunities to practice every day, you eventually get used to it. So the short answer, like any other skill, is practice.

Lately, this multitasking has actually increased a lot because of agents. It is way easier to do "fire and forget" tasks now. While a task is being worked on by one agent in the background, there is a lot of time where I can spawn other agents and run more things in parallel. It works out great.

## Time for Deep Focus, Time for a Break

Having periods of time for deep focus is a must, but it's also really important to let the conscious mind rest and let the diffuse mode of thinking act. I learned this from the book "A Mind for Numbers" by Barbara Oakley, which goes deeper into balancing the focused and diffuse modes of thinking. For this reason, taking breaks is really important and helps me reset my mind. Some of the solutions for problems at work that I can't solve when I'm focused usually come after I take a break and go back to my desk.

Getting interrupted during the periods for deep focus ruins my train of thought and is something that I avoid by disabling notifications and blocking time in my calendar to focus better on the task.

One of the biggest distractions to my deep focus is meetings. I actively search for opportunities to skip meetings if I realize they aren't going to be productive for me. I also try to keep my calendar clear on certain days. For example, I try not to have any meetings on Mondays, and Friday is my day where I don't have any meetings at all (I ask people to ping me before booking anything on Fridays). When I do have meetings, I like to batch them together on the same day, and I always make sure to prepare for them in advance. But I know my limits. After a set of back-to-back meetings, I know I will be completely exhausted, so I usually just stop working for a bit to recover my energy.

Having a routine helps tremendously and keeps me happy. Regular exercise in the morning keeps my mind clean and gives me energy for the rest of the day to focus better.

## Emails

A tip that I got from a coworker is to tag and filter all the incoming emails. I use an internal tool at work that helps me tag emails with a declarative language. I think that https://github.com/mbrt/gmailctl or a similar tool can help.

Once you tag emails, the first thing is to free your inbox from emails that aren't that important to read. Lots of emails coming from our bug tracker are most of the time not directed to me but to my team inbox instead. The first filter groups bugs by the team they're targeted to and moves them to a tag, e.g., `bugs-team-a`, `bugs-team-b`, and archives them, skipping the inbox. Some of these bugs might need my attention because I'm mentioned in them, and therefore if I'm CCed on them, then I also need to add another tag to it, e.g., `bugs-me`.

I receive emails directed to the Google Groups I'm subscribed to, to my org, and company-wide. While these are important messages, they're not urgent, and they can also be tagged to something like `google-groups`, `org`, `company`, etc.

I do the same with changelist & GitHub emails. I group them by the team, e.g., `cl-team-a`, `cl-team-b`, and skip the inbox. For bugs where I'm the reviewer or where I'm CCed, I add `cl-me`, and they stay in my inbox.

There's also spam that should be tagged and marked as read by default. For example, a person joining a big team where I'm also part of might generate an automated email for all the members of the team. Emails like this can be marked as read, tagged, and archived.

With time, I got used to checking my inbox regularly, following this priority: first my inbox, `bugs-me`, `cl-me`, and if I feel like it, then I read other tags.

## Task Management

Throughout my day/week, I get emails with action items. In meetings, after taking some notes, we realize that there are some action items that I should act on soon (for example, reading and reviewing a design doc, working on an upcoming release, etc.). While I can create an internal bug for some of these with an assigned priority, there are some items, like asking and giving feedback in a design doc, where I wouldn't need to create a bug. In addition, for some items with deadlines, I also need a reminder to work on it soon.

For these reasons, I use [Google Tasks](https://www.youtube.com/watch?v=b82GeFbxIj8) as my task management tool. It's easy to add tasks by hand, tasks from emails (with subtasks too 🙂), set calendar reminders, and manually order to give some priority among them. What's super cool is that I can see it every time I go to my email tab. ([Read this article for more info about how to set it up.](https://support.google.com/mail/answer/106237?hl=en&co=GENIE.Platform%3DDesktop#zippy=%2Csave-an-email-as-a-task%2Corganize-your-tasks-into-lists:~:text=Slides%20in%20Keep-,Create%20a%20task,-Go%20to%C2%A0)).

## Keeping Notes and Active Knowledge Synthesis

At work, almost all the meetings have meeting notes. We write the topics that were discussed and their conclusions. I can't emphasize enough how useful these notes are. They help remember discussions and conclusions, they prepare you for the next meeting if it's a regular meeting, and if you missed a meeting, then you could read the notes taken and reach out to people if needed.

For example, [these are the meeting notes of the Kubernetes Storage Special Interest Group](https://docs.google.com/document/d/1-8KEG8AjAgKznS9NFm3qWqkGyCHmvU6HVl0sk5hwoAE/edit). As you can see, it's split by dates, topics discussed, and conclusions.

In my day-to-day, I look at these notes just like I check my emails. Outside work, I keep a weekly checklist of the things I have to do. Having more things written down and outside my mind gives me more room to remember valuable things.

Writing notes is great, but finding things in them later is actually pretty hard. When you have a lot of notes, searching by hand takes too much time. So, I started using NotebookLM to query all the notes and files that I collect. It is a super cool tool because you can talk to your data directly.

I use it for any content that I want to remember. For example, for education programs like the Stanford LEAD program, I regularly upload all lecture transcripts, syllabus materials, and personal reading notes to keep my memory fresh. If I need to recall a specific framework, I query the notebook and it gives me the answer in seconds. I do the same for books I read or my personal finances. It acts as an external brain.

Another way is talking to customers at work. We get lots of feedback and emails from PM customer meetings. I upload all of these into NotebookLM, and then I can chat with the data as if I were talking to the customers themselves, since the notes capture the actual voice of the customer. I group them into different tiers and ask the model to act like a specific customer. When I have a new idea, I ask them to criticize it and give me brutally honest feedback. This is very useful to see if my ideas make sense before we build them.

## Exploring New Areas and Keeping Up to Date

When I need to learn a completely new topic or technology, it usually takes hours of searching on Google, reading random articles, and trying to put the pieces together. It's slow specially when there's a lot of noise.

To make this faster, I use Gemini with Deep Research. When I want to explore a new area, I just give it a prompt of what I want to figure out. The model runs in a loop, searches the web, reads docs and articles, and synthesizes everything for me. In the end, it gives me a solid report with links to the sources. This gives me context right away so I can jump straight into understanding the problem and building.

But keeping up to date with daily technical news is a different problem. I like to read aggregated content from sources like HackerNews. It is unfortunate that some interesting tech posts only live on Twitter (X), but I don't like doomscrolling. 

To solve this without spending hours scrolling, I built a custom RSS aggregator that runs on my [Orange Pi home server](/notes/home-server-setup/) every day. The setup fetches the HN front page and a public list of the people and companies I follow on Twitter. Then, it uses an LLM to generate a condensed daily summary of the front page and my Twitter feed. All I have to do is read the summarized notes whenever I have some dedicated free time.

## Development Tools

At work, I make changes to many codebases during the day. First, a quick look into what it looks like:

<script id="asciicast-h9bEclMKVl9SONRqMe3yoyryF" src="https://asciinema.org/a/h9bEclMKVl9SONRqMe3yoyryF.js" async></script>

Lately, how I build software has changed a lot. I do most of my development using Antigravity 2.0 (which is called jetski hub at work). My main interaction is looking at the chat and reading the diffs on the right-side canvas where the artifacts are displayed. It's super cool because I stay on the loop, guiding the agent to make changes instead of typing every single line of code myself.

But sometimes I still need to go into the code myself, run tests, or debug. This is where I go back to my command line workflow using tmux and agy (which is called jetski-cli at work). 

To quickly switch across repositories, I still use tmuxinator and fzf to manage my sessions. I map each active codebase to a tmux session name. In most of these sessions, I keep a three-pane layout: on the left side my main editor (neovim), and on the right side two terminal panes stacked vertically. The first terminal pane runs agy, so I can converse with the repository directly and let it make changes, while using the other terminal pane to run builds or inspect logs. 

I keep track of these codebases by bookmarking them in a simple text file called `~/.bookmarks.data`. Then, whenever I want to switch to a project, a keyboard shortcut triggers a [Python project launcher script](https://github.com/mauriciopoppe/dotfiles/blob/main/zsh/bin/tmux-switch-client.py) that feeds these bookmarks to fzf, letting me switch or open a session in seconds.

While I still use the tmux setup every day to run local servers, check logs, or jump into the code directly, I don't write as much raw code inside those terminal panes anymore. I mostly use tmux as a stable background environment to host agy and run local builds, while the high-level creation and visual iteration happen on the Antigravity 2.0 canvas. This combination of the web UI and the terminal CLI works out great.

[^1]: A mental context switch is an analogy of what an OS does under the hood to [share a single CPU among processes](https://en.wikipedia.org/wiki/Context_switch), but applied to our day-to-day mental tasks. After all, we only have one brain that's already multitasking with unconscious processes like perception or breathing.
