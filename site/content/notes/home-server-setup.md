---
title: "Building a Home Server with Orange Pi 5 and Gemini"
date: 2026-01-19 19:00:00
tags: ['ai', 'gemini', 'devops', 'orangepi', 'sshfs', 'productivity', 'self-hosted', 'docker']
summary: "Bootstrapping a home server on an Orange Pi 5 using Gemini and SSHFS."
---

My home server runs on an [Orange Pi 5](http://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/details/Orange-Pi-5.html). It started as a simple DNS sinkhole to block ads, but it's since turned into a sandbox for anything I'd rather not pay a monthly subscription for.

## Development Workflow

The Orange Pi 5 isn't beefy enough to run LLMs locally, but fortunately it doesn't have to. First, I mount the Pi's filesystem to my MacBook using [SSHFS](https://github.com/libfuse/sshfs), then I start Gemini in the mounted directory.

```bash
# Mounting the infrastructure repo
sshfs <user>@<host>:/path/to/infrastructure ~/mnt/orangepi
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

The setup is split into Docker Compose stacks. It makes troubleshooting easier, and I don't have to worry about one big YAML file.

<div class="tw-bg-white tw-p-6 tw-rounded-xl tw-my-8">
{{< figure src="https://mermaid.ink/svg/pako:eNqFVmlv4zYQ_SsEFyiyhe1GvqMPxTrJ5ijibBpl20XrIqClsc1aIgVKiq0N8t87PKxEstN1gPCYNzOcg098pqGMgPq03W7PRCjFgi_9mSAkZqUscp9AvNbLfAUJ-ERBVGzbEVNmM5Zy7RMBskL8wRRn8xgyYwMRXMCZjKXyyYx-GA3034xamUDHp1JFcEgYxkWWg3pXnjAuTtdLLckVE1nKFIi8qX0QYCJdxHITrpjKycMp6mTFfKlYuiJfM1CP5_DEQ8j-ntFJiGNGblgJakb_sdb174aluUwRMWXhKaaB3ClZA0zlnMeAAH63kgKcDEQ0E2_9BTkL14-ovC0Ra0byEzm_DWrGzlgUlUczakZiUDP68VU-ubxC6SS6LJiKyJVMwInf8TcpcpmwnEuhY7wmr-vMIuqhlJM0RftJ2WZp6pMLluWTu-vaCX7jgiHkXxzaCpgp2o0MWUyCEB3r7L1B3wfBVTFHvJ3UZRDxTIv0iJGHqx8E82WONXtimG6e6yTW1gfCwfQlRybXCWDTFlnN_aViC2ZicbOaNJxETzyTCsW7aU1-iz39eauTpWcEp1LlVfDvBDDFSJluJT0eODDjMssxqYlOy-T6S2AX_280KPEGJGjVTmoG7yHLeWhyrCfkFBWKtBbImZJCNxwOOZtjEVd48-N3K6FbLsCsg9IFwPu2BHLHyaByG3EFoW4we9_c7033NzdfW7IpqdW3KTQ5bG66FBw6-Octlkew-PEslkWEh99tEB2OZoFa5gLB0geF7Y25qeakeRkugxVArqt1KeUyBmLX9Tbv6vRqp4sYqQnX5AhvA_nFVSP7WIN_e7y6xdN9Q_kVykGRW9hkDVapeIm02-RPfsHJJ10YXP1qKaSJeWA8zvCSAvk02bCyCbQc9gOghVpmQuSM_txZGQIyIMMdyGjuMuEMuQr_v_Z0ZQFbzbhSfLnE-CptdxZjyDjwOuQC8nCF_yFyfiyRoGGdqD2NbsfREJnipyuSG-HUNG3toXuILpIEP2XfgRzd3Ew_OvQlJFxw_DxAGgCs9xT7qFiKUB9md6yuBe1BL9CxCMHgHbbqpz3w1zSWbBepa65d2lzgiDNUab1q6rRizXJa6MLX0h1xYbIcXVnorkSI_r0AZYus9Ztdgx4vAmyOQuQG83r53ZEsq-gexCzFpevoKiGuq61B3_cj87l1u7bnmrtVblAA7oY6kcvHvuC-u7-nu-OAiXpda4Ddg4Jl2TksiD0Vwd6Va_A_9Hq9lp23NzzKV3433TY0BOQbqdaVyrE3GJ3Md1oRy_AVoljpkwHSZV011OSLLyj1vj9vz9_u6JUOLIbh8fGBY9IWTUDhSyrC99-zNoNvJf2Km1H9bIpgwYrYPJleEMqQkHW3Uj9XBbSoksVyRf0FizNcFWnEcjjnDGk12UGWSpu2c2zJXKqpfWyaNyeaQOICdaYbifqDFk2Z-EvKSh2X1H-mW-p7Xa9z0j0ZD4a9fn90fNIdtmhJ_XZ3MOr0vWFv2Pf6Pc8bj0cvLfrdmPA63bE36I3742F_fDzyei__AcmQaSg" caption="Home Server Architecture" >}}
</div>

### AI Automations
This handles my intelligence pipelines and financial tools. It's a suite of FastAPI services supported by [Jina Reader](https://github.com/jina-ai/reader) for scraping and [RSSHub](https://docs.rsshub.app/) for feed ingestion.

*   **Hacker News Intelligent RSS:** Fetches the HN front page and filters for high-signal technical content using LLMs (Gemini/DeepSeek). It scrapes articles using a local Jina instance and produces narrative summaries synced to Cloudflare R2 as Folo-compliant RSS.
*   **X (Twitter) Intelligence Feed:** I don't like scrolling on X, but some interesting content only lives there. To keep my workflow RSS-centric, I set up a public X list with people and companies I follow. RSSHub fetches the content daily, and DeepSeek summarizes it into a format that works for me.
*   **Finance Sync:** Fetches investment holdings (stocks, crypto, options) via SnapTrade and syncs them directly to Google Sheets for portfolio tracking.

Since Jina Reader is heavy to build on the Pi, I build the image on macOS and load it via `docker save | ssh ... docker load`.

### AdGuard Home & aiostreams
DNS-level blocking is the only way to handle ads on mobile devices. I use [AdGuard Home](https://adguard.com/en/adguard-home/overview.html) for this, plus some internal DNS rewrites so my `*.home.arpa` domains resolve correctly whether I'm on the local Wi-Fi or the tailnet.

### Caddy
[Caddy](https://caddyserver.com/) is the entry point. It handles the reverse proxying and internal TLS. It's much simpler to manage than Nginx for a small setup.

### Observability
Prometheus and Grafana keep an eye on the hardware. I use cAdvisor for container metrics and Node Exporter for the Pi itself. Mostly, it's there so I can see if a new service is eating too much RAM.

## Automation & Backups

I use `crontab` on the host to schedule the intelligence briefings and finance syncs daily. For backups, I use [Restic](https://restic.net/) to push encrypted snapshots to Cloudflare R2. I know I can rebuild the entire thing from a fresh SD card in ten minutes, which makes it much easier to break things and experiment.

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
