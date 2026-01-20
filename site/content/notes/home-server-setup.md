---
title: "Building a Robust Home Server with Orange Pi 5 and Gemini"
date: 2026-01-19 19:00:00
tags: ['ai', 'gemini', 'devops', 'orangepi', 'sshfs', 'productivity', 'self-hosted']
summary: "How I leveraged Gemini and SSHFS to rapidly architect a secure, observable, and automated home server setup on an Orange Pi 5."
---

In this post, I'll walk through the architecture of my home server setup.
I was able to build a secure environment very fast using Gemini in just a few sessions.

{{< figure src="/images/home-server-diagram.png" caption="Home Server Architecture" style="background: var(--grey-dark); padding: 1.25em 1.5em; border-radius: 0.375rem;" >}}

## Assumptions

- SSH access to the home server.
- Any terminal based AI agent, my choice is gemini-cli.

## The Workflow

While my home server (an [Orange Pi 5](http://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/details/Orange-Pi-5.html) running [DietPi](https://dietpi.com/)) isn't powerful enough to run gemini-cli locally, it doesn't have to.
gemini-cli only needs access to a filesystem and permissions to run commands.

- **Access to a filesystem** - I mount the Pi's entire filesystem to my MacBook Pro using [SSHFS](https://github.com/libfuse/sshfs). To my Mac (and Gemini), the server's code looks like a local folder.
  Because Gemini is launched within this mounted codebase, it has a "Senior DevOps" level of understanding of my entire system.
  It doesn't just suggest snippets, it analyzes my stacks, identifies resource bottlenecks, and generates entire configuration files.

```bash
# One time mount
sshfs myuser@myhost:/home/myuser/infrastructure ~/mnt/orangepi

# Then I can start gemini at ~/mnt/orangepi.
```

- **Running commands** - I've taught Gemini that the filesystem it sees is thanks to the mount and
  I've told it how to run commands directly on the Pi via SSH.
  It can apply the changes it just wrote, check container logs, and verify that the setup is working as expected.

This REPL environment allowed me to iterate very fast and bridged the gap between a small SBC and a powerful AI.

## Secure Remote Access: Tailscale

The server is never exposed to the internet via port forwarding.

Instead, I use [Tailscale](https://tailscale.com/) which is installed across all my devices.
This allows me to SSH into the Pi or access the Grafana dashboard from
my iPhone or MacBook anywhere in the world as if I were sitting in my living room.

The best part of tailscale is that I don't get to see ads in my devices even when I'm not at home!

## Zero Trust

My security philosophy starts with a pessimistic assumption: **any container running on my server is potentially vulnerable to an attack I'm not yet aware of.** Therefore, I operate under the assumption that a container *will* be compromised at some point.

To mitigate the blast radius of such an event, I implement a "Zero Trust" policy at multiple levels:

1.  **Network Isolation**: I never run containers in `host` network mode unless absolutely necessary (and it rarely is). Each stack runs in its own isolated bridge network, preventing a compromised container from sniffing traffic on the host interface.
2.  **Resource Quotas**: To prevent a compromised or malfunctioning container from crashing the entire system (a Denial of Service attack), every single service has strict `cpus` and `memory` limits defined in its Docker Compose file.
3.  **One-Way Access**: While my trusted devices (laptop, phone) can access the Pi via SSH or HTTPS, the Pi—and specifically the containers running on it—are restricted from initiating connections to other sensitive devices on my local network. This containment ensures that even if a container is breached, it cannot be used as a pivot point to attack my personal workstation.
4.  **Pinned Image Versions**: I never use the `:latest` tag for container images. Using `latest` makes the system susceptible to supply chain attacks, as a simple `docker compose pull` could replace a trusted image with a compromised one. Every image is pinned to a specific version tag or digest.

## Docker Compose Stacks

I've organized the system into independent Docker Compose stacks. This separation of concerns makes updates and troubleshooting much easier.

### Security & DNS: AdGuard Home

I dislike how obstrusive ads are. While Chrome Extensions could block ads when I'm on my laptop I can't install the same extension in my phone.

The reason I decided to have a home server in the first place is to block ads and malware for all my devices through a [DNS sinkhole](https://en.wikipedia.org/wiki/DNS_sinkhole).

[AdGuard Home](https://adguard.com/en/adguard-home/overview.html) handles DNS for my entire network, blocking trackers and malware at the source. It's wonderful not
having to see ads in my phone whenever I read news articles.

I've configured DNS rewrites so that internal aliases resolve correctly whether I'm on my local Wi-Fi or connected via **Tailscale**.

The ready-to-use docker compose template is at https://github.com/2Tiny2Scale/ScaleTail/tree/main/services/adguardhome.

### The Gateway: Caddy

Everything is fronted by [Caddy](https://caddyserver.com/). It acts as a reverse proxy with internal TLS termination.

### Automation: n8n + FastAPI

For automations, I run [n8n](https://n8n.io/) alongside sidecar containers with my personalized logic.

The `finance-sync` sidecar is a small python server that I developed that can fetch data from my financial sources.
Once it fetches data it'll output a summary of my holdings to stdout as JSON.

Then in the n8n UI I configured a workflow to write the data to Google Sheets.

{{< figure src="/images/home-server-n8n.png" caption="n8n" >}}

This workflow runs regularly portfolio adjustment preferences.

Whenever I need to make an analysis of my financials, I give the spreadsheet to Gemini and ask it to draw conclusions based on my goals.

### Observability: Prometheus & Grafana

You can't manage what you don't measure. My observability stack includes [Prometheus](https://prometheus.io/) for metric collection and [Grafana](https://grafana.com/) for visualization,
with [cAdvisor](https://github.com/google/cadvisor) and [Node Exporter](https://github.com/prometheus/node_exporter) tracking performance at both the container and host levels.
Every service has **Docker Resource Limits** (CPU/Memory) defined to ensure no single container can starve the system.

### Backups

Backups are handled by [Restic](https://restic.net/) and [Rclone](https://rclone.org/) storing data in my Google Drive

*  **Isolation**: The Pi uses a "Sandboxed" Google OAuth client. It can only see the specific folder it creates for backups—it has zero access to my personal Google Drive files.
*  **Automation**: A weekly cron job handles the backup and prunes old snapshots.

## Key Takeaways

* **AI is a Force Multiplier**: Gemini turned a complex DevOps setup into a series of fast iterations.
* **Monitor the stacks**: Since I'm running on an SD card, I watch CPU IOWait in Grafana as a leading indicator of hardware failure.
* **Isolate your backups**: Don't give your server full access to your cloud storage.

By combining the affordability of an Orange Pi 5 with the intelligence of Gemini via SSHFS, I've built a home server that just works—and I did it in record time.
