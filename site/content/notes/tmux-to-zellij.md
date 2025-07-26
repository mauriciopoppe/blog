---
title: Tmux to Zellij
summary: |
  Tips that helped me migrate from Tmux to Zellij, I outline key requirements
  such as organized workspaces with easy pane management,
  seamless integration with Neovim, and efficient session switching.

  I describe my experience adopting Zellij, highlighting its vi-like modes and custom keybindings for navigation.

  I then explore session management with a script
  for quickly switching between preferred and active Zellij sessions
  mirroring my previously Tmux workflow.
image: /images/zellij-switch-session.gif
tags: ['tmux', 'zellij', 'terminal']
date: 2025-06-21 14:00:00
---

## Requirements

My requirements for a terminal multiplexer:

- Organization of workspaces using sessions
  - Quickly create vertical and horizontal panes
  - Seamless movement between my editor and my terminals
  - Seamless integration with neovim
- Switch sessions effectively
  - Single keybind to switch between sessions
  - Use a list of known workspaces as input to start/switch sessions

## Learning Zellij

Zellij's introduces modes similar to vi where each mode has its
own separate keybindings, for more info about the modes
read https://zellij.dev/documentation/keybindings-modes.html

I mapped `Ctrl + Space` to enter switch from Normal mode to Tmux mode
and back.

## Organization of workspaces using sessions

I mapped `Ctrl + Space`+`-` to create a horizontal pane and
`Ctrl + Space`+`\` to create a vertical pane.

Because of the different modes that zellij has I also use
the [`zellij-autolock` plugin](https://github.com/fresh2dev/zellij-autolock) to
provide a single keybind combination to move across panes, while this is possible
to do with zellij without plugins the plugin is needed for zellij to
be aware of switching modes when entering a pane running a program.

[My zellij-autolock setup is very similar to the one in the repo](https://github.com/mauriciopoppe/dotfiles/blob/main/zellij/config.kdl).

Neovim needs to be aware of the plugin, fortunately,
the same author created [zellij.vim](https://github.com/fresh2dev/zellij.vim)
which I included through my preferred package manager.

## Single keybind launcher to switch sessions

{{< figure src="/images/zellij-switch-session.gif" caption="Demo of switching sessions with Zellij">}}

I want a system that helps me find my preferred session to launch
or to switch too, the sessions to display are my preferred list of
sessions and the currently opened sessions, After I make the selection
in the fuzzy finder, I want to switch to that session.

With tmux, [I have this setup](https://github.com/mauriciopoppe/dotfiles/blob/b183e64e8a0927254c8ebaab76688d4a6eeca0c8/zsh/bin/tmux-switch-client.py)
with this one liner:

```
# This is a simplified version of my setup, it doesn't run it as it is.
( cat $bookmarks && tmux ls ) | fzf --tmux | xargs tmux switch-client -t
```

Zellij doesn't have a subcommand similar to `tmux switch-client`.
There's this [reddit thread](https://www.reddit.com/r/zellij/comments/18go1y5/switching_sessions_via_cli/)
where Zellij's author mention that the way to do this is with a plugin.
Fortunately, the plugin [zellij-switch](https://github.com/mostafaqanbaryan/zellij-switch)
already does this.

```
# This is a simplified version of my setup, it doesn't run it as it is.
( cat $bookmarks && zellij list-sessions -n ) | fzf | \
  xargs -I {} zellij pipe --plugin https://github.com/mostafaqanbaryan/zellij-switch/releases/download/0.2.1/zellij-switch.wasm \
  -- "session $(basename {}) --cwd {} --layout default"
```

I map the above the the keybinding `Ctrl + Space`+`Ctrl J` with
the following zellij config.

```
        bind "Ctrl j" {
            SwitchToMode "normal";
            Run "zellij-switch-session" {
                direction "Down";
                close_on_exit true;
            }
        }
```

[`zellij-switch-session`](https://github.com/mauriciopoppe/dotfiles/blob/main/zsh/bin/zellij-switch-session.py)
is a bash script that wraps the above one zellij one liner.

## Was it worth it?

While zellij fulfilled my requirements and I used regulary for at least 3 weeks
I ended up switching to tmux. First, I'll write the things that I really liked:

- Open the current pane output in my editor - It's easier to do find/search in neovim.
- The language choice to create pane configuration - I like it way more than tmuxinator yaml file
  which is an equivalent package that I use for tmux.
- There's a very helpful sidebar showing you what keybindings to use.
- If a panel is resized from within (e.g. running `nvim-dap-ui` in nvim) doesn't have an effect
  the layout of zellij. This is very annoying in tmux and fixed nicely in zellij.
- Fullscreen mode remains in fullscreen when you switch to other panes.

Unfortunately I didn't like these:

- zellij doesn't have a native way to navigate to my last session - On tmux I have a binding
  to the `Ctrl+Space` + `Space` key to switch back to my previous session, in zellij I had to
  enter the name of the session every time I wanted to switch back.
- No mouse editor support to resize the panes - I could only do this with keybindings.
- I couldn't find a way to kill an unresponsive pane - In tmux if there's a pane that's stuck
  I run `respawn-pane -k`, I couldn't find an equivalent in tmux.
- There's a bug launching a temp pane to run a command, in some cases the layout will be changed
  after switching to another session.

It's a matter of personal preference, I'm happy with tmux for now.
