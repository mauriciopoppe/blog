---
title: "Building a Home Server with Orange Pi 5 and Gemini"
date: 2026-01-19 19:00:00
tags: ['ai', 'gemini', 'devops', 'orangepi', 'sshfs', 'productivity', 'self-hosted']
summary: "Bootstrapping a home server on an Orange Pi 5 using Gemini and SSHFS."
---

My home server runs on an [Orange Pi 5](http://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/details/Orange-Pi-5.html). It started as a simple DNS sinkhole to block ads, but it's since turned into a sandbox for anything I'd rather not pay a monthly subscription for.

{{< figure src="/images/home-server-diagram.png" caption="Home Server Architecture" style="background: var(--grey-dark); padding: 1.25em 1.5em; border-radius: 0.375rem;" >}}

## Development Workflow

The Orange Pi 5 isn't beefy enough to run LLMs locally, but fortunately it doesn't have to. First, I mount the Pi's filesystem to my MacBook using [SSHFS](https://github.com/libfuse/sshfs), then I start Gemini in the mounted directory.

```bash
# Mounting the infrastructure repo
sshfs myuser@myhost:/home/myuser/infrastructure ~/mnt/orangepi
```

Since Gemini sees the files directly through the mount, it understands the project structure. I've also taught it how to run commands on the Pi via SSH. This creates a fast feedback loop where I can ask for a config change, and the agent can apply and test it on the actual hardware immediately.

## Secure Remote Access: Tailscale

I use [Tailscale](https://tailscale.com/) to bridge my devices. The main win here is keeping my DNS sinkhole active on my phone when I'm on mobile data. AdGuard Home filters trackers before they hit my browser, regardless of where I am[^net-perf].

[^net-perf]: There's a slight latency hit since DNS requests have to round-trip to my house. I usually only keep this on when I'm traveling or on public Wi-Fi.

## Security (Zero Trust-ish)

My approach to container security is to assume every container is a liability.

I stick to a few hard rules:
*   No `host` network mode. Each stack gets its own bridge network so containers can't sniff traffic from unrelated services.
*   Strict CPU and memory limits. A memory leak in a side project shouldn't take down my DNS or gateway.
*   One-way trust. My laptop can SSH into the Pi, but the Pi has no keys to talk to anything else on my network. It's effectively quarantined.
*   Pinning images. I avoid `:latest`. I want to know exactly what code is running, and `:latest` is just asking for a supply chain headache.

## The Stacks

The setup is split into Docker Compose stacks. It makes troubleshooting easier, and I don't have to worry about one massive YAML file.

### AdGuard Home
DNS-level blocking is the only way to handle ads on mobile devices. I use [AdGuard Home](https://adguard.com/en/adguard-home/overview.html) for this, plus some internal DNS rewrites so my `*.home.arpa` domains resolve correctly whether I'm on the local Wi-Fi or the tailnet.

### Caddy
[Caddy](https://caddyserver.com/) is the entry point. It handles the reverse proxying and internal TLS. It's much simpler to manage than Nginx for a small setup.

### n8n + FastAPI
I use [n8n](https://n8n.io/) for personal automation. I wrote a small FastAPI service called `finance-sync` that pulls data from my bank's API and spits out JSON. n8n picks that up and shoves it into a Google Sheet. When I need to check my spending, I point Gemini at the sheet for a breakdown.

{{< figure src="/images/home-server-n8n.png" caption="n8n workflow" >}}

### Observability
Prometheus and Grafana keep an eye on the hardware. I use cAdvisor for container metrics and Node Exporter for the Pi itself. Mostly, it's there so I can see if a new service is eating too much RAM.

## Backups

I use [Restic](https://restic.net/) and [Rclone](https://rclone.org/) to push encrypted snapshots to Google Drive. It runs weekly via cron using a sandboxed Google OAuth client, the Pi only has permission to see its specific backup folder. Knowing I can rebuild the entire thing from a fresh SD card in ten minutes makes it much easier to break things and experiment.

## Fun

Recently, [Kai Lentit](https://www.youtube.com/@programmersarealsohuman5909) posted a video about setting up a server for OpenClaw. It was hilariously relatable.

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
