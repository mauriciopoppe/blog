---
title: Tmux to Zellij (and back)
summary: |
  Tips that helped me when trying Zellij and why I went back to Tmux.
  I outline key requirements such as organized workspaces with easy pane management,
  seamless integration with Neovim, and efficient session switching.

  I describe my experience adopting Zellij, highlighting its vi-like modes and custom keybindings for navigation.

  I then explore session management with a script for quickly switching between preferred and active Zellij sessions,
  mirroring my previous Tmux workflow.
image: /images/zellij-switch-session.gif
tags: ['tmux', 'zellij', 'terminal']
date: 2025-06-21 14:00:00
---

## Requirements

My requirements for a terminal multiplexer:

- Organization of workspaces using sessions.
  - Quickly create vertical and horizontal panes.
  - Seamless movement between my editor and my terminals.
  - Seamless integration with Neovim.
- Switch sessions effectively.
  - Single keybind to switch between sessions.
  - Use a list of known workspaces as input to start/switch sessions.

## Learning Zellij

Zellij introduces modes similar to vi, where each mode has its
own separate keybindings. For more info about the modes,
read https://zellij.dev/documentation/keybindings-modes.html.

I mapped `Ctrl + Space` to switch from Normal mode to Tmux mode
and back.

## Organization of workspaces using sessions

I mapped `Ctrl + Space` + `-` to create a horizontal pane and
`Ctrl + Space` + `\` to create a vertical pane.

Because of the different modes that Zellij has, I also use
the [`zellij-autolock` plugin](https://github.com/fresh2dev/zellij-autolock) to
provide a single keybind combination to move across panes. While this is possible
to do with Zellij without plugins, the plugin is needed for Zellij to
be aware of switching modes when entering a pane running a program.

[My zellij-autolock setup is very similar to the one in the repo](https://github.com/mauriciopoppe/dotfiles/blob/main/zellij/config.kdl).

Neovim needs to be aware of the plugin. Fortunately,
the same author created [zellij.vim](https://github.com/fresh2dev/zellij.vim),
which I included through my preferred package manager.

## Single keybind launcher to switch sessions

{{< figure src="/images/zellij-switch-session.gif" caption="Demo of switching sessions with Zellij" >}}

I want a system that helps me find my preferred session to launch
or to switch to. The sessions to display are my preferred list of
sessions and the currently opened sessions. After I make the selection
in the fuzzy finder, I want to switch to that session.

With tmux, [I have this setup](https://github.com/mauriciopoppe/dotfiles/blob/b183e64e8a0927254c8ebaab76688d4a6eeca0c8/zsh/bin/tmux-switch-client.py)
with this one-liner:

```
# This is a simplified version of my setup; it doesn't run as it is.
( cat $bookmarks && tmux ls ) | fzf --tmux | xargs tmux switch-client -t
```

Zellij doesn't have a subcommand similar to `tmux switch-client`.
There's this [reddit thread](https://www.reddit.com/r/zellij/comments/18go1y5/switching_sessions_via_cli/)
where Zellij's author mentions that the way to do this is with a plugin.
Fortunately, the plugin [zellij-switch](https://github.com/mostafaqanbaryan/zellij-switch)
already does this.

```
# This is a simplified version of my setup; it doesn't run as it is.
( cat $bookmarks && zellij list-sessions -n ) | fzf | \
  xargs -I {} zellij pipe --plugin https://github.com/mostafaqanbaryan/zellij-switch/releases/download/0.2.1/zellij-switch.wasm \
  -- "session $(basename {}) --cwd {} --layout default"
```

I map the above to the keybinding `Ctrl + Space` + `Ctrl J` with
the following Zellij config.

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
is a bash script that wraps the above Zellij one-liner.

## Was it worth it?

While Zellij fulfilled my requirements and I used it regularly for at least 3 weeks,
I ended up going back to tmux.

First, I'll write the things that I really liked about Zellij:

- Open the current pane output in my editor - It's easier to do find/search in Neovim.
- The language choice to create pane configuration - I like it way more than the tmuxinator yaml file,
  which is an equivalent package that I use for tmux.
- There's a very helpful sidebar showing you what keybindings to use.
- If a panel is resized from within (e.g., running `nvim-dap-ui` in nvim), it doesn't have an effect
  on the layout of the window. In tmux, the window panes are resized, and it's very annoying,
  but it's not a problem in Zellij.
- Fullscreen mode remains in fullscreen when you switch to other panes.

Unfortunately, I found these annoying:

- Zellij doesn't have a native way to navigate to my last session. On tmux, I have a binding
  to the `Ctrl+Space` + `Space` key to switch back to my previous session. In Zellij, I had to
  enter the name of the session every time I wanted to switch back.
- No mouse editor support to resize the panes - I could only do this with keybindings.
- I couldn't find a way to kill an unresponsive pane. In tmux, if there's a pane that's stuck,
  I run `respawn-pane -k` to restart the pane. I couldn't find an equivalent in Zellij.
- There's a bug launching a temp pane to run a command. In some cases, the layout will be changed
  after switching to another session.

It's a matter of personal preference. I'm happy with tmux for now.
