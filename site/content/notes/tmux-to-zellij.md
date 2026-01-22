---
title: Tmux to Zellij (and back)
summary: |
  I used Zellij consistently for a few weeks as a possible alternative to Tmux.
  It fulfilled my requirements for a terminal multiplexer, but I found some
  things annoying and switched back to Tmux. I'm very happy with Tmux for now.
image: /images/zellij-switch-session.gif
tags: ['tmux', 'zellij', 'terminal']
date: 2025-06-21 14:00:00
---

## Requirements

My requirements for a terminal multiplexer are:

- **Workspace organization using sessions.**
  - Quickly create vertical and horizontal panes.
  - Seamless movement between the editor and terminals.
  - Seamless integration with Neovim.
- **Effective session switching.**
  - A single keybind to switch between sessions.
  - Use a list of known workspaces as input to start or switch sessions.

## Learning Zellij

Zellij introduces modes similar to Vi, where each mode has its
own separate keybindings. For more info about the modes,
read https://zellij.dev/documentation/keybindings-modes.html.

I mapped `Ctrl + Space` to switch from Normal mode to Tmux mode
and back.

## Organization of workspaces using sessions

I mapped `Ctrl + Space` + `-` to create a horizontal pane and
`Ctrl + Space` + `\` to create a vertical pane.

Because of the different modes in Zellij, I also use
the [`zellij-autolock` plugin](https://github.com/fresh2dev/zellij-autolock) to
provide a single keybind combination to move across panes. While this is possible
in Tmux without plugins, a plugin is needed so Zellij is
aware of the need to switch modes as it crosses panes.

[My zellij-autolock setup is very similar to the one in the repo](https://github.com/mauriciopoppe/dotfiles/blob/main/zellij/config.kdl).

Neovim needs to be aware of the plugin. Fortunately,
the same author created [zellij.vim](https://github.com/fresh2dev/zellij.vim),
which I included through my preferred package manager.

## Single keybind launcher to switch sessions

I want a system that helps me find my preferred session to launch
or to switch to. The sessions to display are my preferred list of
sessions and the currently opened sessions. After I make the selection
in the fuzzy finder, I want to switch to that session.

With tmux, [I have this setup](https://github.com/mauriciopoppe/dotfiles/blob/b183e64e8a0927254c8ebaab76688d4a6eeca0c8/zsh/bin/tmux-switch-client.py)
using this one-liner:

```bash
# This is a simplified version of my setup; it doesn't run as it is.
( cat $bookmarks && tmux ls ) | fzf --tmux | xargs tmux switch-client -t
```

Zellij doesn't have a subcommand similar to `tmux switch-client`.
There's this [Reddit thread](https://www.reddit.com/r/zellij/comments/18go1y5/switching_sessions_via_cli/)
where Zellij's author mentions that the way to do this is with a plugin.
Fortunately, the plugin [zellij-switch](https://github.com/mostafaqanbaryan/zellij-switch)
already does this.

```bash
# This is a simplified version of my setup; it doesn't run as it is.
( cat $bookmarks && zellij list-sessions -n ) | fzf | \
  xargs -I {} zellij pipe --plugin https://github.com/mostafaqanbaryan/zellij-switch/releases/download/0.2.1/zellij-switch.wasm \
  -- "session $(basename {}) --cwd {} --layout default"
```

I mapped the above to the keybinding `Ctrl + Space` + `Ctrl + J` with
the following Zellij config:

```bash
        bind "Ctrl j" {
            SwitchToMode "normal";
            Run "zellij-switch-session" {
                direction "Down";
                close_on_exit true;
            }
        }
```

[`zellij-switch-session`](https://github.com/mauriciopoppe/dotfiles/blob/main/zsh/bin/zellij-switch-session.py)
is a script that wraps the above Zellij one-liner.

Here's a demo of the launcher:

{{< figure src="/images/zellij-switch-session.gif" caption="Demo of switching sessions with Zellij" >}}


## Was it worth it?

While Zellij fulfilled my requirements and I used it regularly for at least 3 weeks,
I ended up going back to tmux.

First, here are the things I really liked about Zellij:

- **Open the current pane output in my editor** - It's easier to do a search and find in Neovim.
- **The language choice to create pane configuration** - I like it way more than the Tmuxinator YAML file
  which I use for tmux.
- **The helpful sidebar** - It shows you which keybindings to use for the current mode.
- **Resizing isolation** - If a panel is resized from within (e.g., running `nvim-dap-ui` in Neovim), it doesn't affect
  the layout of the window. In tmux, when a pane is resized it causes all other panes to be resized and it's very annoying,
  but it's not a problem in Zellij.
- **Persistent Fullscreen** - Fullscreen mode remains active when you switch to other panes.

Unfortunately, I found these things annoying:

- **No "last session" navigation** - Zellij doesn't have a native way to navigate to my last session. In tmux, I have a binding
  to `Ctrl + Space` + `Space` to switch back to my previous session. In Zellij, I had to
  enter the name of the session every time I wanted to switch back. I guess I could implement that
  as another script that kept track of the last session but I didn't implement it.
- **No mouse support to resize panes** - I could only do this with keybindings.
- **No way to kill unresponsive panes** - In tmux, if there's a pane that's stuck,
  I run `respawn-pane -k` to restart it. I couldn't find an equivalent in Zellij.
- **Layout bugs** - There's a bug when launching a temp pane to run a command. In some cases, the layout changes
  after switching to another session.

Ultimately, it's a matter of personal preference. I'm happy with tmux for now.
