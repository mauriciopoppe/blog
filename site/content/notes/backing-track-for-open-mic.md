---
title: Creating a Backing Track from Your Favorite Song for an Open Mic
summary: |
  I perform in open mics in my spare time. When I decide to perform a cover of
  a song, I usually play the guitar and sing. Therefore, I prepare
  a backing track without the tracks I use as background music during
  the performance.

  In this article, I show how to ask a coding agent to create a backing track using
  the open-mic project, yt-dlp, Demucs, and FFmpeg.
tags: ['life', 'karaoke', 'open mic', 'demucs', 'ffmpeg', 'guitar', 'singing', 'music', 'bachata']
image: /images/music-gear.jpg
date: 2024-12-01 14:49:00
---

I play the guitar and sing in open mics in my spare time. To perform, I usually play with a backing
track but sometimes it's hard to find a "karaoke" version and even harder to find one with
all my desired instruments (I'd like to hear everything but the guitar because I'm going to play it!).

There are a few ways to create a backing track from a song (maybe there are more but these are
the ones that I know of):

- With Logic Pro for iPad: Since 2024 it has a way to split
  a song into tracks (bass, drums, other, vocals). This feature is called
  [stem splitter](https://support.apple.com/guide/logicpro-ipad/extract-vocal-instrumental-stems-stem-lpip1b60ada3/ipados).
- With [Demucs](https://github.com/facebookresearch/demucs), which is an open-source tool capable of separating
  drums, bass, and vocals from the rest of the accompaniment.
  - It has a feature where it can split a song using more instruments (bass, drums, guitar, other, piano, vocals).
    In this mode, I can keep important tracks in the backing track, such as the "other" and "piano" tracks,
    which make the backing track feel complete.

In this article, I show how to give the full workflow to a coding agent while keeping the audio operations explicit.

## Creating the backing track with an agent

You only need to tell your coding agent which song to use and which parts you plan to perform. The agent can get the [`open-mic`](https://github.com/mauriciopoppe/open-mic) project, set it up, separate the song, and create the backing track.

Start with this prompt and replace the placeholders with your song and the parts you plan to perform:

```text
Use https://github.com/mauriciopoppe/open-mic to create a backing track for
<song-url>.

I will perform <parts-you-will-perform>. Remove those parts from the backing
track, keep the other instruments, and tell me where you saved the finished track.
```

The repository contains a `README.md` for people and an `AGENTS.md` with detailed instructions for coding agents. Those files tell the agent how to install the `open-mic` command, where generated files belong, and how to check its work. You do not need to copy the installation commands into your prompt.

### Putting the theory into practice

I want to sing and play guitar over [December 21 by Prince Royce](https://www.youtube.com/watch?v=A9B1Uo-VQas). I will create two backing tracks for comparison:

- A minimal version with bass and drums.
- A fuller version with bass, drums, piano, and other instruments.

Both versions should exclude the vocals and guitar. This prompt gives the agent the song, the performance plan, and the two outputs to create:

```text
Use https://github.com/mauriciopoppe/open-mic to create a backing track for
https://www.youtube.com/watch?v=A9B1Uo-VQas.

I will sing and play guitar. Remove the vocals and guitar, then create two versions:

1. A backing track with bass and drums.
2. A backing track with bass, drums, piano, and other.

Tell me where you saved both finished tracks.
```

<iframe class="tw-mx-auto tw-aspect-video md:tw-w-full" src="https://www.youtube.com/embed/A9B1Uo-VQas?si=OILLax2aDMwMna8D" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Once the agent starts, `open-mic` uses [yt-dlp](https://github.com/yt-dlp/yt-dlp) to download the audio and [Demucs](https://github.com/facebookresearch/demucs/) to separate it into six stems:

```
workspace/stems/htdemucs_6s/<song>/
        ├── bass.mp3
        ├── drums.mp3
        ├── guitar.mp3
        ├── other.mp3
        ├── piano.mp3
        └── vocals.mp3
```

The agent combines the requested stems and saves both backing tracks under the project's `workspace/` directory. The original download, individual stems, and final mixes remain in that workspace.

Here is the original song followed by the two backing tracks:

<div class="tw-grid md:tw-grid-cols-2 tw-gap-4 tw-mb-5">
  <div class="tw-font-bold">Song</div>
  <div class="tw-font-bold">Sample Audio</div>

  <div>Original song (voice and all instruments)</div>
  <div><audio controls src="/audio/original-open-mic.mp3"></audio></div>

  <div>Backing track (bass, drums), no voice or guitar. This is what you'd get using Logic Pro's stem split feature.</div>
  <div><audio controls src="/audio/bass-drums-open-mic.mp3"></audio></div>

  <div>Backing track (bass, drums, other, piano), no voice or guitar created with Demucs.</div>
  <div><audio controls src="/audio/combined-open-mic.mp3"></audio></div>
</div>

As you can hear, the backing track created with Demucs has lots of details from the original song minus
the voice or guitar which is exactly what I need. `Demucs` is an amazing tool and so useful for open mics!

