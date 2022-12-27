---
title: 'Mental Context Switching'
tags: ['life', 'software engineer', 'task management', 'time management']
date: 2022-05-11 21:16:00
---

Multitasking is a skill that I must develop to better use my time, while it may seem detrimental
to my performance because I'm not completely focused on a task, I believe that there are situations
where being able to do a mental context switch can save you a lot of time, this blogpost is about the
strategies/tools that I use at work and in my personal projects that helped me develop my context switching skills.

## Getting used to context switching

First suggestion is to ask more experienced people about the way they do it,
at work managers and tech leads are very good at context switching and it's because they get lots
of exposure to it, as you start growing in your career your scope will increase
as well as the amount of knowledge that you have, you'll participate in more meetings for many
different topics that you'll have to juggle around in your head, with lots of opportunities to
practice every day you eventually get used to it.

## Deep focus

Having periods of time for deep focus is a must but it's also really important to let the conscious
mind rest and let the diffuse mode of thinking act. I learned this from the book "A mind for numbers"
by Barbara Oakley which goes deeper into balancing the focussed and diffuse modes of thinking. For
this reason, taking break is really important and helps me reset my mind, some of the solutions
for problems at work that I can't solve when I'm focused usually come after I take a break
and go back to my desk.

Getting interrupted during the periods for deep focus ruins my train of thought and is something
that I avoid by disabling notifications and blocking time in my calendar to focus on specific areas.

Having a routine helps tremendously and keeps me sane, regular exercise in the morning keeps my mind clean
and gives me energy for the rest of the day to focus better.

## Emails

A tip that I got from a coworker is to tag all the incoming emails, I use an internal tool
at work that helps me tag emails with a declarative language,
I think that https://github.com/mbrt/gmailctl or a similar tool can help.

The first thing is to free your inbox from emails that aren't that important to read,
I identified that emails coming from our bug tracker are most of the time not directed to me but
to my team inbox instead, the first filter group bugs by the team they're targetted to and moves
them to a tag e.g. `bugs-team-a`, `bugs-team-b` and archives them skipping the inbox.
Some of these bugs might need my attention because I'm mentioned in them and therefore if I'm
CCed on them then I also need to add another tag to it e.g. `bugs-me`.

I receive emails directed to the google groups I'm subscribed, to my org and company wide,
while these are important messages they're not urgent and they can also be tagged to something like `google-groups`, `org`, `company`, etc.

I do the same with changelist & github emails, I group them by the team e.g. `cl-team-a`, `cl-team-b` and
skip the inbox, for bugs where I'm the reviewer or where I'm CCed I add `cl-me` and they stay in my inbox.

There's also spam that should be tagged and marked as read by default, for example a person joining a big
team where I'm also part of might generate an automated email for all the members of the team, emails
like this can be marked as read, tagged and archived.

With time I got used to check my inbox regularly following this priority: first my inbox, `bugs-me`, `cl-me` and
if I feel like it then I read other tags.

## Task management

Throughout my day/week I get emails with action items, in meetings after taking some notes we realize that there
are some action items that I should act on soon (for example reading and reviewing a design doc, work on an upcoming release, etc).
While I can create an internal bug for some of these with an assigned priority there are some items like
asking and giving feedback in a design doc, for some items with deadlines I also need a reminder to work on it soon
and to block space in my calendar for it.

For this reason I use Google Tasks as my task management tool, it's easy to add tasks (with substasks too 🙂), set calendar
reminders and manually order to give some priority to them. What's super cool is that I can see it every time I go
to my email tab ([read this article for more info](https://support.google.com/mail/answer/106237?hl=en&co=GENIE.Platform%3DDesktop#zippy=%2Csave-an-email-as-a-task%2Corganize-your-tasks-into-lists:~:text=Slides%20in%20Keep-,Create%20a%20task,-Go%20to%C2%A0)).

## Keeping notes

At work almost all the meetings have meeting notes, we write the topics that were discussed and their conclusions,
I can't emphasize enough how useful these notes are, they help remember discussions and conclusions, they prepare
you for the next meeting if it's a regular meeting and if you missed a meeting then you could read the notes taken and
reach out to people if needed.

For example [these are the meeting notes of the Kubernetes Storage Special Interest Group](https://docs.google.com/document/d/1-8KEG8AjAgKznS9NFm3qWqkGyCHmvU6HVl0sk5hwoAE/edit),
as you can see it's split by dates, topics discussed and conclussions.

In my day to day I look at these notes just like I check my emails, outside work I keep a weekly checklist
of the things I have to do, having more things written and outside my mind gives me more room to
remember valuable things.

## Development tools

At work I make changes to many codebases during the day, to quickly switch across codebases
and the terminal layouts that I'm used to I use [tmux](https://github.com/tmux/tmux),
[tmuxinator](https://github.com/tmuxinator/tmuxinator), a combination of a
few scripts that I'll talk about later and [fzf](https://github.com/junegunn/fzf). I'll describe
some concepts around tmux and tmuxinator, the scripts that I use and my workflow,
and other tools that I tried that didn't work for me. First a quick look into what it looks like:

<script id="asciicast-h9bEclMKVl9SONRqMe3yoyryF" src="https://asciinema.org/a/h9bEclMKVl9SONRqMe3yoyryF.js" async></script>

Sessions in tmux can have a name and in my mind I keep the mapping of a session name to a codebase, e.g.
if I want to work in the kubernetes codebase cloned at `~/go/src/k8s.io/kubernetes` then that'd be the tmux
session name I should remember.

Once I'm in that session I usually have a predefined terminal layout, in most of the codebases I keep a 3 pane layout
with my editor on the left and two terminals stacked vertically on the right, because this is a common layout
across many of the codebases I work on I have to save it so that the next time I open the codebase I keep the same
layout, to do so I use the following file stored at `~/.tmuxinator.yaml`

```yaml
# I use · instead of . because . is reserved in tmuxinator
# I also don't want to see the entire path to home, instead just use ~
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

If a codebase needs a different layout I create a `.tmuxinator.yaml` file at the codebase root and override
what I need e.g. multiple windows with different layout or commands that should be used instead.

Keeping track of all the location of the codebases that I work on is tiresome, instead as I mentioned I only need
to remember codebase names which will be mapped to tmux sessions, moreover, I should keep track of the codebases
that are worth remembering because there might be codebases that I cloned once and never used again, to save
the codebases worth remembering I 'bookmark' them in the file `~/.bookmarks.data` which looks like this:

```plain
/Users/mauriciopoppe/.dotfiles
/Users/mauriciopoppe/go/src/github.com/mauriciopoppe/blog
/Users/mauriciopoppe/go/src/k8s.io/kubernetes
...
```

Once I clone a codebase worth remembering I cd into it and invoke a script
[`bookmark`](https://github.com/mauriciopoppe/dotfiles/blob/main/zsh/bin/bookmark)
that will save the absolute path in the file `~/.bookmarks.data`.

Finally it comes time to pick a codebase that I want to work on, to do so I use a
[ruby script](https://github.com/mauriciopoppe/dotfiles/blob/main/zsh/bin/tmux-switch-client) that reads
the `~/.bookmarks.data` file and feeds it to `fzf` which on selection will call `tmuxinator start .` on the
selected path, `tmuxinator start .` needs a `.tmuxinator.yaml` file at the codebase root and if a codebase
doesn't override it then I just symlink the `~/.tmuxinator.yaml` file to the codebase before running `tmuxinator start .`,
also at this stage I have to combine existing `tmux` sessions that are already opened and apply some sorting
so that they're shown first and the ones that are not opened last. This ruby script is mapped be called whenever
I type `<ctrl+space><ctrl+j>` with this [tmux config](https://github.com/mauriciopoppe/dotfiles/blob/22fdba7e6f179077dce2f780d598a1a6c4c12a3a/tmux/.tmux.conf#L72).

With the concepts learned above it comes time to talk about my workflow:

- Log into my computer, start the tmux server, I'll usually see the session 0.
- Think to the project that I want to work on first e.g. the kubernetes/kubernetes repo, I only need to remember kubernetes.
- Type `<ctrl+space><ctrl+j>`, that'll open fzf with the list of all the codebases that I work on.
- I filter them by typing <kbd>kubernetes</kbd> and select the codebase that I want.
- That will create a new tmux session with the layout that I wanted.
- I may run a long running command like building kubernetes or creating a dev cluster, in the meantime
  I can context switch and work on a different project, I switch to it with the same keyboard combination above.
- After working on the other codebase remember that I created a kubernetes dev cluster! I might run another long
  running command before jumping to a different codebase.
- Rinse and repeat

Things that I've tried in the past:

- [tmux-continuum](https://github.com/tmux-plugins/tmux-continuum) - This tool saves your tmux session layout
  automatically which is great! However when I used it it'd reopen all the tmux sessions that were stored,
  imagine having tens of codebases and seeing all of them getting created when you invoke tmux-continuum!
