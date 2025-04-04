---
title: Creating a backing track from your favorite song for an open mic
summary: |
  I perform in open mics in my spare time, when I decide to perform a cover of
  a song I usually play the guitar as well as singing it. Therefore, I prepare
  a backing track without those tracks that I use as background music during
  the performance.

  In this article I show how to create a backing track using yt-dlp, demucs and ffmpeg.
tags: ['life', 'karaoke', 'open mic', 'demucs', 'ffmpeg', 'guitar', 'singing', 'music', 'bachata']
image: /images/open-mic-guitar.jpg
imageAlt: |
  Photo by Brands&People on <a href="https://unsplash.com/photos/man-in-black-and-white-checkered-button-up-shirt-playing-white-electric-guitar-FuezoxTPpDk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
date: 2024-12-01 14:49:00
---

I have a couple of ways to split a song:

- With Logic Pro for iPad - In the update for 2024, there's a way to split
  a song into tracks (bass, drums, other, vocals), this feature is called
  [stem splitter](https://support.apple.com/guide/logicpro-ipad/extract-vocal-instrumental-stems-stem-lpip1b60ada3/ipados).
- With [demucs](https://github.com/facebookresearch/demucs) which is an open source tool capable of separating
  drums, bass, and vocals from the rest of the accompaniment
  - It has a feature where it can split a song using more instruments (bass, drums, guitar, other, piano, vocals),
    in this mode I can keep important tracks in the backing track such as the "other" and "piano" tracks
    which make the backing track feel complete.

In this article I show how to use demucs to split a song into tracks.

## Splitting a song with Demucs

### High level steps

- Install essential tools
  - [git](https://git-scm.com/downloads)
  - [python](https://www.python.org/downloads/)
- Download dependencies (there's an automated step to download these below)
  - Install [yt-dlp](https://github.com/yt-dlp/yt-dlp) to download your song (if you have your song skip this step).
  - Install [demucs](https://github.com/facebookresearch/demucs/) to split the track.
  - Install [ffmpeg](https://ffmpeg.org/) to combine selected tracks into a combined track.
- Download your song with `yt-dlp`
- Separate the track with `demucs`
- Join the drums/bass/other tracks with `ffmpeg` into a track that you can use as your backing track!

### Download demucs dependencies

The assumption is that you already have git and python installed.

I've created a project that has a file with all the dependencies to install, you just need to clone
the repository and use the `requirements.txt` file to install the dependencies.

```
git clone https://github.com/mauriciopoppe/open-mic/
cd open-mic
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
```

### Download your song

I'll create a backing track with bass, drums, piano and other for the song
[December 21 by Prince Royce](https://www.youtube.com/watch?v=A9B1Uo-VQas)

<iframe class="tw-mx-auto tw-aspect-video md:tw-w-full" src="https://www.youtube.com/embed/A9B1Uo-VQas?si=OILLax2aDMwMna8D" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

First let's download the song assuming that it's on Youtube:

```
yt-dlp -x --audio-format mp3 <link-to-song>
```

Example:

```
yt-dlp -x --audio-format mp3 "https://www.youtube.com/watch?v=A9B1Uo-VQas"
[youtube] Extracting URL: https://www.youtube.com/watch?v=A9B1Uo-VQas
[youtube] A9B1Uo-VQas: Downloading webpage
[youtube] A9B1Uo-VQas: Downloading ios player API JSON
[youtube] A9B1Uo-VQas: Downloading android player API JSON
[youtube] A9B1Uo-VQas: Downloading player b46bb280
WARNING: [youtube] A9B1Uo-VQas: nsig extraction failed: You may experience throttling for some formats
         n = CN0_8RV0LjPMw_i9xJs ; player = https://www.youtube.com/s/player/b46bb280/player_ias.vflset/en_US/base.js
WARNING: [youtube] A9B1Uo-VQas: nsig extraction failed: You may experience throttling for some formats
         n = it19Djd_eJ-wpANfMuK ; player = https://www.youtube.com/s/player/b46bb280/player_ias.vflset/en_US/base.js
[youtube] A9B1Uo-VQas: Downloading m3u8 information
[info] A9B1Uo-VQas: Downloading 1 format(s): 140
[download] Destination: Prince Royce - Dec. 21 (Official Video) [A9B1Uo-VQas].m4a
[download] 100% of    3.30MiB in 00:00:00 at 7.11MiB/s
[FixupM4a] Correcting container of "Prince Royce - Dec. 21 (Official Video) [A9B1Uo-VQas].m4a"
[ExtractAudio] Destination: Prince Royce - Dec. 21 (Official Video) [A9B1Uo-VQas].mp3
Deleting original file Prince Royce - Dec. 21 (Official Video) [A9B1Uo-VQas].m4a (pass -k to keep)
```

The track is downloaded in the same location as where the command was run.

Next let's use `demucs` to separate the track into different instrument tracks.

```
demucs -n htdemucs_6s --mp3 -j 2 <path-to-downloaded-song>
```

Example

```
demucs -n htdemucs_6s --mp3 -j 2 "Prince Royce - Dec. 21 (Official Video) [A9B1Uo-VQas].mp3"
Selected model is a bag of 1 models. You will see that many progress bars per track.
Separated tracks will be stored in /Users/mauriciopoppe/go/src/github.com/mauriciopoppe/open-mic/separated/htdemucs_6s
Separating track Prince Royce - Dec. 21 (Official Video) [A9B1Uo-VQas].mp3
100%|██████████████████████████████████████████████████████████████████████| 216.45/216.45 [01:28<00:00,  2.46seconds/s]
```

`demucs` created multiple files in the directory `separated`, let's list them:

```
tree separated/
separated/
└── htdemucs_6s
    └── Prince Royce - Dec. 21 (Official Video) [A9B1Uo-VQas]
        ├── bass.mp3
        ├── drums.mp3
        ├── guitar.mp3
        ├── other.mp3
        ├── piano.mp3
        └── vocals.mp3

```

Finally let's join the bass, drums, other, piano tracks with `ffmpeg` into the combined file `combined.mp3`.

```
cd separated/htdemucs_6s/Prince\ Royce\ -\ Dec.\ 21\ \(Official\ Video\)\ \[A9B1Uo-VQas\]/
ffmpeg -i bass.mp3 -i drums.mp3 -i other.mp3 -i piano.mp3 -filter_complex amix=inputs=4:normalize=0 combined.mp3
```

Let's compare the original song with two versions of the backing track, one with bass and drums (no voice or guitar) and the other with bass, drums, other and piano (no voice or guitar).

<table class="tw-table-auto">
  <thead>
    <tr>
      <th>Song</th>
      <th>Sample Audio</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Original song (voice and all instruments)</td>
      <td><audio controls src="/audio/original-open-mic.mp3"></audio></td>
    </tr>
    <tr>
      <td>Backing track (bass, drums), no voice or guitar. This is what you'd get using Logic Pro's stem split feature.</td>
      <td><audio controls src="/audio/bass-drums-open-mic.mp3"></audio></td>
    </tr>
    <tr>
      <td>Backing track (bass, drums, other, piano), no voice or guitar</td>
      <td><audio controls src="/audio/combined-open-mic.mp3"></audio></td>
    </tr>
  </tbody>
</table>

`demucs` is an amazing tool and so useful for open mics!

<div class="tw-flex tw-flex-row tw-justify-center tw-mb-5">
  <div class="github-card" data-github="mauriciopoppe/open-mic" data-width="400" data-height="" data-theme="default"></div>
</div>
<script src="//cdn.jsdelivr.net/github-cards/latest/widget.js"></script>

