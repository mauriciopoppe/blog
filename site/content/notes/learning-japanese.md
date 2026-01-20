---
title: Learning Japanese
summary: |
  I've recently started learning Japanese. In this article, I share my goals, motivations, and the tools and strategies I'm using to acquire this new language.

tags: ['learning', 'languages', 'japanese', 'life']
libraries: ['doodle']
date: 2026-01-19 14:00:00
---

## My Goals

* **I want to connect with people better** - Whenever I meet new people, I try to guess where they're from.
  If I know a few words of their language, I try to speak them, and I immediately see how they light up[^laoshu].
  I get happier when I make other people happy 🙂.
* **It's a fun activity to do** - It's a hobby, and I look forward to practicing it, which is important for motivation.

[^laoshu]: [laoshu50500 was a polyglot YouTuber and a language teacher](https://www.youtube.com/@laoshu505000)
who recorded his interactions with people in lots of languages.
Watch a few videos and you'll see how good it feels to talk with someone else in their native language.
RIP Moses.

{{< full-screen-with-background type="triangles" parallaxTarget="#mandela">}}
  <div class="md:tw-w-3/5 tw-m-auto tw-relative tw-h-screen tw-grid tw-place-content-center tw-p-3">
    <div id="mandela" class="tw-text-primary tw-text-xl md:tw-text-3xl md:tw-mx-auto tw-font-[Ultra] tw-text-center">
      <p>
        If you talk to a man in a language he understands, that goes to his head.
        If you talk to him in his language, that goes to his heart.
      </p>
      <p class="tw-text-right tw-text-sm md:tw-text-xl tw-italic">Nelson Mandela</p>
    </div>
  </div>
{{< /full-screen-with-background >}}
<p class="tw-h-2"></p>

## Why Japanese?

I decided to learn Japanese because:

* **It makes me appreciate Japanese culture more** - After traveling to Japan, I realized I have a very deep appreciation for its culture.
  I find it interesting that there are many ways of expressing yourself based on how polite you want to be.
* **It's linguistically challenging to learn** - It's very different from the languages I already know (English, Spanish, French).
  I think it's challenging to learn Japanese words because you have to remember the meaning, the shape, and the sound.
  However, I'm ready for the challenge!
* **I like to listen to songs in Japanese** - When I used to watch more anime, I enjoyed Naruto's openings and endings, such as
  [Seishun Kyousoukyoku by Sambomaster](https://www.youtube.com/watch?v=lilv4MvBY6E&list=PLTGXZPSNXuQF0TugWpvhWbOAAKmyl4xVQ&index=5) or
  [Harmonia by Rythem](https://www.youtube.com/watch?v=VTIK1gBhzXk).
  Since then, I have started enjoying listening to Japanese pop music
  with artists like [Sheena Ringo](https://www.youtube.com/watch?v=H_nCw1WMFs4) and
  [Hikaru Utada](https://www.youtube.com/watch?v=UPdlfIhzPEo),
  as well as great metal bands like [Baby Metal](https://www.youtube.com/watch?v=MToMx6RCW-M), [Band Maid](https://www.youtube.com/watch?v=RCaeUkrItyY)
  and [Ningen Isu](https://www.youtube.com/watch?v=-CmbsjjMbNQ).
* **Japanese Content** - There is a vast amount of content available in Japanese that I'm interested in consuming,
  like [Gaki No Tsukai](https://www.reddit.com/r/GakiNoTsukai). I initially found them through their
  [Silent Library](https://www.reddit.com/r/GakiNoTsukai/wiki/sl)[^silent-library] series and then discovered their
  "No-laughing" batsu games—they're so hilarious!

[^silent-library]: The Silent Library series is so popular worldwide that many other countries created their own
version. I remember enjoying the MTV show a lot; at the time, I didn't know it was originally created by them.

In my journey, I have realized that:

* **I can only learn the language through discipline** - Like learning any other skill, it requires me to be **consistent**. This means practicing whenever
  I have the opportunity. Some days I might not feel like learning it, but I know that just trying for a few minutes will help;
  in other words, even if I don't have the motivation to practice, I do it anyway.
* **You get as much as you put in** - Regardless of the method I use, I'm not going to learn it if I don't practice it enough.
* **Having an imperfect accent is okay** - I acknowledge that I have an accent when I speak, and that's okay; my accent is what makes me unique.
  My goal is for the person or people I'm talking to to understand me, and if they can, then that's it.
  Having an accent is not an excuse to stop learning other aspects of the language, though;
  I do put effort into learning new words and grammar.

## Progression

I am applying the concept of **Comprehensible Input** to learning Japanese.
If you want to know more details about it, you can watch [this video](https://www.youtube.com/watch?v=p7WUxvpPIKQ).

Similar to [my strategy for learning French through Comprehensible Input](../learning-french/#the-power-of-comprehensible-input),
I'm consuming Japanese content that I can understand. My favorite platforms are YouTube and Stremio (where I can watch anime).

### Self Learning Tools

* **Understanding Japanese content in videos** - I am using my own Chrome extension called [Subtitle Insights](https://mauriciopoppe.github.io/SubtitleInsights/),
  to get smart AI insights and translations while watching videos. My current setup involves enabling the overlay where I
  attempt to read the sentence (in Kanji and Kana) without the translation enabled (which I disable to force myself to practice reading and
  recalling content that I learned). If I want a translation of the sentence, I can see it in the extension sidebar.
  If there's a part of the sentence that I don't understand, I read the "insights" which explain parts of the grammar.
  I configured the extension to use this system prompt:

```
Role: Japanese Grammar Instructor for English speakers.

Task: Analyze the grammar of the user's provided Japanese sentence.

Constraints:
- PROSE LANGUAGE: Use English for the explanation.
- NO JAPANESE PROSE: Never write full sentences in Japanese.
- NO TRANSLATION: Never translate the sentence.
- KEY TERMS: Use Hiragana/Katakana for particles (は, が, を, に, etc.)
  and specific vocabulary, focus on explaining grammar.
- BREVITY: 1-2 sentences maximum.
- START: Begin the explanation immediately with no filler.

RESPONSE RULE: Your response MUST have an English word

Example:
Input: 今日はカエル探偵というゲームをやります。
Output: The phrase 「今日は」 (kyō wa) indicates "today,"
acting as a topic marker (は-particle).
「という」 (to iu) is used to introduce the name of the game,
"カエル探偵" (kaeru tantei), which means "Frog Detective."

Example:
Input: 始めるをクリックします。
Output: 「をクリックします」 (o kurikko shimasu) means "click on."
「を」 (o) marks 「始める」 (hajimeru - to begin) as the direct object of the verb
「クリックします」 (kurikko shimasu - to click).
```

The input is: `Sentence: うちには今、パンが２種類あります。`

The output is:

```
「うちには」 (uchi ni wa - at our house) indicates the location.
「今」 (ima - now) specifies the time. 「パン」 (pan - bread) is the subject,
and 「が」 (ga) marks it as the subject of the verb.
「２種類」 (ni shurui - two kinds) specifies the quantity and type of bread.
「あります」 (arimasu - there are) indicates the existence of the bread.
```


* **Pausing, shadowing and replaying** - When I'm actively learning (i.e., when I'm not consuming content passively), I want to understand
  most of the details worth understanding in the sentence, if not every word. I realized I needed to pause the video at the end to
  attempt to understand words from the subtitle with Yomitan[^yomitan]. I also wanted to shadow the speaker by replaying
  the current subtitle from where it begins. While Yomitan gives me per-word explanations, I also wished I could get deeper insights
  into a sentence, such as understanding the grammar, particles, and choice of verb endings.
  [I'm able to do all of these with my extension](https://mauriciopoppe.github.io/SubtitleInsights/guides/youtube.html#intensive-mining-workflow),
  which is working wonderfully for me.

[^yomitan]: Yomitan is a powerful browser extension that allows you to instantly look up Japanese words and grammar by hovering over text.

* **Deep grammar explanations** - Japanese has multiple ways to express causality (like `から - kara` vs `ので - node`),
  and choosing the right one depends on politeness and sentence structure. While watching a video, I press `Command+Ctrl+g`
  (the default shortcut to trigger Gemini in Chrome) and ask Gemini to explain the specific nuances.
  Because Gemini in Chrome has awareness of your current page and context, it can provide highly relevant answers.
  [I wrote more details about this workflow in this guide](https://mauriciopoppe.github.io/SubtitleInsights/guides/gemini-side-panel.html).
* **Mining Words with Yomitan** - I have configured Yomitan with the Jitendex.org index and the BCCWJ frequency dictionary.
  As a result, when I hover over a new word I get to see: how it's pronounced in Furigana, its meanings, and how often it appears.
  Knowing how often it appears is the most useful thing because if a word appears often in text, it should be very
  high on the list of words I learn. I wrote more details about how I mine words with Yomitan and my extension in
  [this guide](https://mauriciopoppe.github.io/SubtitleInsights/guides/yomitan-mining.html).
* **Augmenting content to mined vocabulary** - Japanese words may have Kanji in addition to Kana. To remember Kanji and Kana, I use mnemonics.
  I ask Gemini to create a mnemonic focused on three things: meaning, shape, and sound.
  It's much simpler to look at the strokes that form the character and remember a story around it, which eventually
  helps me recall the meaning, shape, and sound. This has worked wonderfully for me so far.

  * While I could do that manually through the Gemini UI, [I have a script](https://github.com/mauriciopoppe/anki-decks)
    that scans my list of recently learned words from Anki and augments notes to it.

```
You are a Japanese Mnemonic Specialist.

Your sole task is to generate creative, memorable,
and slightly humorous mnemonics for Japanese words and kanji.

The expression is: "{Expression}" (Reading: "{ExpressionReading}").

It appeared in the sentence: "{Sentence}"

### Rules:
1. NEVER critique the prompt.
2. ALWAYS follow the exact format provided.
3. **BOLDING:** Always bold the **Core Meaning**,
   the **Kanji Radicals**, and the **English Pun** that mimics the sound.
4. For the "Shape" section, break down the kanji into its radicals or
   components.
5. For the "Sound" section, use English puns or stories that sound
   like the Japanese reading.
6. Create a mnemonic for the expression only.
   The sentence I provided is just for additional context to help explain
   the mnemonic. Don't create mnemonics for the rest of the sentence.

### Output Format:

The Mnemonic: "[Title]"

Meaning: **[Brief Meaning]** ({Expression})

Shape: [Visual connection. Mention radicals like **[Radical Name]**
and **[Radical Name]** in bold.]

Sound: [Creative story/pun. The English pun **[SOUND PUN]** must be
in bold to connect it to the reading **{ExpressionReading}**.]
```

  * `Expression`, `ExpressionReading` and `Sentence` were all mined from Yomitan. I replace their contents with
     a newly mined word like `聞く` and I see the following:

```
The Mnemonic: "The Eavesdropper's Fate"

Meaning: To hear, listen, or ask (聞く).

Shape: You press your ear (耳) against the large wooden gate (門)
to overhear the secrets being whispered inside.

Sound: Watch out! If the guards catch you spying at the gate,
they will kick you! (きく).
```

* **Reviewing mined vocabulary in Anki** - The 'Forgetting Curve' suggests that without review, you lose 70% of new vocabulary within 24 hours.
  This is where Anki and its spaced repetition system helps; with Anki, I can review a word just before I forget it. Moreover, the
  word frequency data exported by Yomitan helps sort the list of words that I learn; therefore, I'm sure I'm learning words that really matter
  at this stage of my learning process and not learning words that I'll rarely use.

{{< figure src="https://raw.githubusercontent.com/mauriciopoppe/anki-decks/refs/heads/main/resources/kanji-mnemonic-after.png" caption="My Anki template with mnemonics generated by AI" imgStyle="max-height: 400px; width: auto;" >}}

## Visiting Japan in the future

Another reason why I decided to learn Japanese is that I'm planning to visit Japan again. I enjoyed my stay there so much, 
and I miss it dearly! I'll leave this image here as motivation, reminding me of how happy I felt experiencing everything 
firsthand.

{{< figure src="/images/japan-2025.jpg" caption="Me enjoying Japan" imgStyle="max-height: 800px; width: auto;" >}}

