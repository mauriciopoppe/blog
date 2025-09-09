---
title: "Productivity Skills"
summary: |
  I try to improve my productivity every day to get better use of my time. This article summarizes the things I'm used to doing every day at work. These are divided into: getting used to multitasking, having time for deep focus and for breaks, handling incoming emails, task management, and development tools.
tags: ['life', 'software engineer', 'task management', 'time management', 'productivity']
image: /images/productivity-skills.jpeg
date: 2022-05-11 21:16:00
---

## Getting Used to Multitasking

Multitasking is a skill that I try to get better at to better use my time. While it may seem detrimental to my performance because I'm not completely focused on a task, I believe that there are situations where being able to do a mental context switch[^1] can save you a lot of time.

As you start growing in your career, your scope will increase, as well as the amount of knowledge that you have. You'll participate in more meetings for many different topics that you'll have to juggle in your head. With lots of opportunities to practice every day, you eventually get used to it. So the short answer, like any other skill, is practice.

## Time for Deep Focus, Time for a Break

Having periods of time for deep focus is a must, but it's also really important to let the conscious mind rest and let the diffuse mode of thinking act. I learned this from the book "A Mind for Numbers" by Barbara Oakley, which goes deeper into balancing the focused and diffuse modes of thinking. For this reason, taking breaks is really important and helps me reset my mind. Some of the solutions for problems at work that I can't solve when I'm focused usually come after I take a break and go back to my desk.

Getting interrupted during the periods for deep focus ruins my train of thought and is something that I avoid by disabling notifications and blocking time in my calendar to focus better on the task.

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

## Keeping Notes

At work, almost all the meetings have meeting notes. We write the topics that were discussed and their conclusions. I can't emphasize enough how useful these notes are. They help remember discussions and conclusions, they prepare you for the next meeting if it's a regular meeting, and if you missed a meeting, then you could read the notes taken and reach out to people if needed.

For example, [these are the meeting notes of the Kubernetes Storage Special Interest Group](https://docs.google.com/document/d/1-8KEG8AjAgKznS9NFm3qWqkGyCHmvU6HVl0sk5hwoAE/edit). As you can see, it's split by dates, topics discussed, and conclusions.

In my day-to-day, I look at these notes just like I check my emails. Outside work, I keep a weekly checklist of the things I have to do. Having more things written down and outside my mind gives me more room to remember valuable things.

## Development Tools

At work, I make changes to many codebases during the day. To quickly switch across codebases and the terminal layouts that I'm used to, I use [tmux](https://github.com/tmux/tmux), [tmuxinator](https://github.com/tmuxinator/tmuxinator), a combination of a few scripts that I'll talk about later, and [fzf](https://github.com/junegunn/fzf). I'll describe some concepts around tmux and tmuxinator, the scripts that I use, and my workflow, and other tools that I tried that didn't work for me. First, a quick look into what it looks like:

<script id="asciicast-h9bEclMKVl9SONRqMe3yoyryF" src="https://asciinema.org/a/h9bEclMKVl9SONRqMe3yoyryF.js" async></script>

Sessions in tmux can have a name, and in my mind, I keep the mapping of a session name to a codebase. E.g., if I want to work in the Kubernetes codebase cloned at `~/go/src/k8s.io/kubernetes`, then that'd be the tmux session name I should remember.

Once I'm in that session, I usually have a predefined terminal layout. In most of the codebases, I keep a three-pane layout with my editor on the left and two terminals stacked vertically on the right. Because this is a common layout across many of the codebases I work on, I have to save it so that the next time I open the codebase, I keep the same layout. To do so, I use the following file stored at `~/.tmuxinator.yaml`:

```yaml
# I use · instead of . because . is reserved in tmuxinator
# I also don't want to see the entire path to home; instead, just use ~
name: <%= ENV['PWD'].gsub('.', '·').gsub(ENV['HOME'], '~') %>
root: ./

windows:
  - editor:
      layout: 7598,272x69,0,0{209x69,0,0,10,62x69,210,0[62x34,210,0,11,62x34,210,35,12]}
      panes:
        - nvim -S
        - null
        - null
```

If a codebase needs a different layout, I create a `.tmuxinator.yaml` file at the codebase root and override what I need, e.g., multiple windows with different layouts or commands that should be used instead.

Keeping track of all the locations of the codebases that I work on is tiresome. Instead, as I mentioned, I only need to remember codebase names, which will be mapped to tmux sessions. Moreover, I should keep track of the codebases that are worth remembering because there might be codebases that I cloned once and never used again. To save the codebases worth remembering, I 'bookmark' them in the file `~/.bookmarks.data`, which looks like this:

```plain
/Users/mauriciopoppe/.dotfiles
/Users/mauriciopoppe/go/src/github.com/mauriciopoppe/blog
/Users/mauriciopoppe/go/src/k8s.io/kubernetes
...
```

Once I clone a codebase worth remembering, I `cd` into it and invoke a script [`bookmark`](https://github.com/mauriciopoppe/dotfiles/blob/main/zsh/bin/bookmark) that will save the absolute path in the file `~/.bookmarks.data`.

Finally, it comes time to pick a codebase that I want to work on. To do so, I use a [Python script](https://github.com/mauriciopoppe/dotfiles/blob/main/zsh/bin/tmux-switch-client.py) that reads the `~/.bookmarks.data` file and feeds it to `fzf` to provide fuzzy finding over all the existing and saved (but not started) sessions. After a bookmark (or tmux session) is selected, then it comes time to call tmuxinator within that directory and start a new tmux session or just switch to an existing one if the selected item was already a tmux session.

This Ruby script is keymapped to be called whenever I type `<ctrl+space><ctrl+j>` with this [tmux config](https://github.com/mauriciopoppe/dotfiles/blob/22fdba7e6f179077dce2f780d598a1a6c4c12a3a/tmux/.tmux.conf#L72).

With the concepts learned above, it comes time to talk about my workflow:

- Log into my workstation, start the tmux server (or attach to one already running). I'll usually see session 0.
- Think about the project that I want to work on first, e.g., the kubernetes/kubernetes repo. I only need to remember "kubernetes."
- Type `<ctrl+space><ctrl+j>`. That'll trigger the `tmux-switch-client` script and run fzf with my bookmarks and the tmux sessions that are currently running.
- I type `kubernetes` and see the repos related to Kubernetes. I move over the list and select the one that I want. Once selected, it will create a new tmux session in the Kubernetes codebase with a predefined tmux layout.
- I may run a long-running command like building Kubernetes or creating a dev cluster. In the meantime, I can work on a different project. I switch to it with `<ctrl+space><ctrl+j>`.
- After working for some time in the other codebase, I remember that I created a Kubernetes dev cluster! I can switch to the Kubernetes codebase to see the status of the build.
- Rinse and repeat.

Things that I've tried in the past:

- [tmux-continuum](https://github.com/tmux-plugins/tmux-continuum) - This tool saves your tmux session layout automatically, which is great! However, when I used it, it'd reopen all the tmux sessions that were stored. Imagine having tens of codebases and seeing all of them getting created when you invoke tmux-continuum!

[^1]: A mental context switch is an analogy of what an OS does under the hood to [share a single CPU among processes](https://en.wikipedia.org/wiki/Context_switch), but applied to our day-to-day mental tasks. After all, we only have one brain that's already multitasking with unconscious processes like perception or breathing.
