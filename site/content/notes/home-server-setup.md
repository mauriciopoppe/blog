---
title: "Building a Home Server with Orange Pi 5 and Gemini"
date: 2026-01-19 19:00:00
tags: ['ai', 'gemini', 'devops', 'orangepi', 'sshfs', 'productivity', 'self-hosted']
summary: "I used Gemini and SSHFS to bootstrap a home server on an Orange Pi 5."
---

I'll walk through the architecture of my home server setup running on an [Orange Pi 5](http://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/details/Orange-Pi-5.html).

I originally set up this server to block ads and malware across my devices using a [DNS sinkhole](https://en.wikipedia.org/wiki/DNS_sinkhole). Since then, I've found plenty of other uses for it. There are so many self-hosted alternatives to paid software that it’s mostly a matter of finding the right balance between convenience and control.

{{< figure src="/images/home-server-diagram.png" caption="Home Server Architecture" style="background: var(--grey-dark); padding: 1.25em 1.5em; border-radius: 0.375rem;" >}}

## Assumptions

- SSH access to the home server.
- A terminal-based AI agent (I use Gemini via `gemini-cli`).

## Development Workflow

The Orange Pi 5 isn't powerful enough to run LLMs locally, but it doesn't need to. Gemini just needs access to the files and the ability to run commands.

I mount the Pi's filesystem to my MacBook Pro using [SSHFS](https://github.com/libfuse/sshfs), so the server's code looks like a local folder to my Mac (and to Gemini). Since Gemini runs within this mounted directory, it understands the project structure immediately.

```bash
# One time mount
sshfs myuser@myhost:/home/myuser/infrastructure ~/mnt/orangepi
```

I've configured Gemini to understand that it's looking at a mounted directory and taught it how to run commands on the Pi via SSH. This setup creates a tight feedback loop for iterating on a small SBC.

## Secure Remote Access: Tailscale

I have [Tailscale](https://tailscale.com/) installed on all my devices. My main goal was to keep the DNS sinkhole active even when I’m away from home. Inside the tailnet, AdGuard Home filters out trackers and ads, so my browsing stays clean on mobile data just as it does on my home Wi-Fi[^net-perf].

[^net-perf]: The tradeoff is a bit of latency, as every DNS request has to travel back to my home server. I usually only toggle this on when I'm traveling, though I haven't tested the performance outside my own city yet.

## Zero Trust

I used to worry about having a 24/7 internet-connected device sitting in my living room. My security mindset for containers is pretty simple: assume any container *will* eventually be compromised.

To limit the damage, I follow a few "Zero Trust" rules:

*   **Network Isolation:** I avoid `host` network mode. Each stack lives in its own isolated bridge network, so a breach in one container doesn't mean the attacker can sniff traffic from everything else.
*   **Resource Caps:** Every service has strict CPU and memory limits. This prevents a runaway process (or a malicious one) from crashing the entire Pi.
*   **One-Way Trust:** My laptop can talk to the Pi, but the Pi can't initiate connections to my other local devices. It’s effectively quarantined.
*   **No `:latest`:** I pin container images to specific versions or digests. Using `:latest` is a roll of the dice for supply chain attacks during an update.

## The Stacks

The system is split into independent Docker Compose stacks. This makes troubleshooting much easier, and Gemini is great at helping with refactors. For example, moving my gateway and media server into separate files while verifying everything still worked took about a minute.

### AdGuard Home: DNS & Security

I can't stand intrusive ads. Browser extensions help on a laptop, but they don't do much for a phone. [AdGuard Home](https://adguard.com/en/adguard-home/overview.html) handles DNS for my whole network, blocking trackers at the source. I also use DNS rewrites so my internal services resolve correctly whether I'm home or on Tailscale.

The template I use is available at [ScaleTail](https://github.com/2Tiny2Scale/ScaleTail/tree/main/services/adguardhome).

### Caddy: The Gateway

[Caddy](https://caddyserver.com/) handles all the incoming traffic. It’s my reverse proxy and takes care of internal TLS termination automatically.

### n8n + FastAPI: Automation

I run [n8n](https://n8n.io/) for workflows, paired with a few custom sidecar containers. One of these is a small Python server I wrote called `finance-sync`. It pulls data from my bank accounts and outputs a JSON summary. From there, n8n pushes that data into Google Sheets.

{{< figure src="/images/home-server-n8n.png" caption="n8n workflow" >}}

When I want to analyze my finances, I just point Gemini at the spreadsheet and ask for a breakdown based on my savings goals.

### AIOStream: Media

I use Stremio for most of my streaming because it handles almost any format through a remote server. It’s also how I practice French and Japanese, using my [Subtitle Insights](https://mauriciopoppe.github.io/SubtitleInsights) extension.

### Observability: Prometheus & Grafana

I use [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/) to keep an eye on things, with [cAdvisor](https://github.com/google/cadvisor) and [Node Exporter](https://github.com/prometheus/node_exporter) providing the metrics. It’s useful for catching resource leaks before they become a problem.

## Backups

A home server without a backup is just a temporary hobby. I use [Restic](https://restic.net/) and [Rclone](https://rclone.org/) to send encrypted snapshots to Google Drive. It runs weekly via crontab using a sandboxed Google OAuth client, the Pi can only see its specific backup folder. Knowing I can rebuild the whole thing from a fresh SD card in a few minutes makes it much easier to experiment.

## Final Thoughts

Mounting the Pi’s filesystem via SSHFS and giving Gemini the context it needs has completely changed how I manage this server. It’s less about knowing every Docker command by heart and more about being able to describe what I want to happen. Like any [dotfiles](https://github.com/mauriciopoppe/dotfiles) repo, it's always a work in progress.

## Fun

Recently, Kai Lentit posted a video about setting up a server for OpenClaw. It covered some of the same automation territory I've been exploring, and it was hilariously relatable.

My favorite bit:

> Agent: We block all unsolicited traffic from the worldwide hostile web app, but we leave one door open. Port 2222. Then we activate the firewall.
>
> User: Why four twos?
>
> Agent: Oh, it's just an arbitrary number. You could choose any.
>
> User: Six, seven?
>
> Agent: No! The standard for arbitrary numbers is 2222.
>
> Me: 😂😂😂

<iframe class="tw-mx-auto tw-aspect-video md:tw-w-full" src="https://www.youtube.com/embed/40SnEd1RWUU?si=wupZG9EgsjsE0iNx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
